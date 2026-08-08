#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
# Must resolve to THIS file, never a fixed name: the re-exec below would otherwise
# hand control to whichever script name was hardcoded, so a copy or wrapper would
# silently run the original's behaviour instead of its own.
SCRIPT_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/$(basename "${BASH_SOURCE[0]}")"
INFRA_DIR="$ROOT_DIR/infra"
ROCKS_DIR="$ROOT_DIR/apps/rocks"
PROJECT_NAME="sebastian-heitmann-dev"
BUCKET="sebastian-heitmann-rocks"
VARLOCK="$ROOT_DIR/node_modules/.bin/varlock"

# Re-exec under `varlock run` so Scaleway credentials (SCW_ACCESS_KEY, SCW_SECRET_KEY,
# SCW_DEFAULT_ORGANIZATION_ID) come from Proton Pass — no ~/.config/scw/config.yaml needed.
# varlock loads infra/.env.schema from the infra directory (the cwd at exec time).
if [[ -z "${VARLOCK_INJECTED:-}" ]]; then
  cd "$INFRA_DIR"
  exec "$VARLOCK" run --inject vars -- env VARLOCK_INJECTED=1 bash "$SCRIPT_PATH" "$@"
fi

# --- below runs with secrets injected by varlock ---

# The scw CLI authenticates from the SCW_* env vars varlock provides.
PROJECT_ID=$(scw account project list -o json | jq -r --arg n "$PROJECT_NAME" '.[] | select(.name == $n) | .id')
if [[ -z "$PROJECT_ID" ]]; then
  echo "Could not resolve Scaleway project '$PROJECT_NAME' via scw CLI." >&2
  exit 1
fi

export AWS_ACCESS_KEY_ID="${SCW_ACCESS_KEY}@${PROJECT_ID}"
export AWS_SECRET_ACCESS_KEY="$SCW_SECRET_KEY"

cd "$ROCKS_DIR"

# packages/structured-data's own test suite is the only thing keeping the
# shared schema.org builders (both sites' Layout.astro call into them)
# correct. Nothing else runs it: this repo has no CI, and `bun run build`
# below is a bare `astro build`, which strips types rather than checking
# them. apps/rocks has no test suite of its own (it renders no prices,
# unlike apps/website — see scripts/deploy-website.sh), so only the shared
# package's tests run here. Run it before the build, so a broken builder
# aborts the deploy the same way the structured-data gate (further below)
# aborts on an invalid graph.
( cd "$ROOT_DIR/packages/structured-data" && bun test )

# `astro build` never type-checks (see above). Run the real type-checker
# before the build so any `satisfies`/exhaustiveness guard in this app is
# actually enforced rather than decorative.
bunx tsc --noEmit

bun run build

# Structured data is emitted by a shared package and referenced across pages by
# @id; a broken graph is invisible in the rendered page and in the build output.
# Gate it here, the same way PUBLIC_MAIL_ENDPOINT drift is gated above. This
# repo has no CI, so the deploy scripts are the only enforcement point.
bun "$ROOT_DIR/scripts/check-structured-data.ts" dist

# Astro's content-collection image() schema imports each source asset via Vite,
# which emits the originals to dist/_astro/ even when only transformed variants
# (webp/jpg) are referenced. Prune any IMAGE in dist/_astro/ that isn't
# referenced by any emitted HTML/CSS/JS. Only images are ever true orphans:
# JS/CSS chunks reference each other via bare relative paths ("./chunk.js")
# that this grep cannot see, so they must never be pruned.
REFERENCED="$(grep -rhoE '_astro/[A-Za-z0-9._-]+' dist --include='*.html' --include='*.css' --include='*.js' --include='*.xml' | sort -u)"
while IFS= read -r -d '' file; do
  rel="${file#dist/}"
  if ! grep -qxF "$rel" <<< "$REFERENCED"; then
    rm -f "$file"
  fi
done < <(find dist/_astro -maxdepth 1 -type f \
  \( -name '*.png' -o -name '*.jpg' -o -name '*.jpeg' -o -name '*.webp' \
     -o -name '*.gif' -o -name '*.avif' -o -name '*.svg' \) -print0)

# Safety net: every bare relative chunk import inside surviving JS must resolve.
# Aborts the deploy instead of shipping a site with a broken module graph.
while IFS= read -r -d '' js; do
  while IFS= read -r chunk; do
    if [ -n "$chunk" ] && [ ! -f "dist/_astro/$chunk" ]; then
      echo "ERROR: dist/_astro/$(basename "$js") imports missing chunk ./$chunk — aborting deploy." >&2
      exit 1
    fi
  done < <(grep -oE 'from"\./[A-Za-z0-9._-]+\.js"' "$js" | sed 's|from"\./||; s|"$||')
done < <(find dist/_astro -maxdepth 1 -type f -name '*.js' -print0)

# Incremental upload via rclone (checksum-exact, MD5 vs S3 ETag).
# Cache-Control is per-object S3 metadata set at upload time, so each path class
# uploads in its own phase carrying the strongest policy it can safely hold:
#   _astro/**  — content-hashed by the build; a URL never changes content → immutable
#   fonts/**   — copied verbatim from public/, never hashed → immutable by
#                convention: a changed font MUST ship under a new filename
#   *.html     — entry points mapping URLs to hashed assets → always revalidate
#                (cheap 304 via ETag; deploys become visible immediately)
#   the rest   — unhashed occasionals (favicon, sitemaps, images/, videos/) → 1 hour
# Phase order: assets before HTML so no live page ever references a missing file;
# the trailing sync only deletes stale objects (bucket is fully regenerable from git).
# Credentials mirror the aws CLI wiring above exactly (same ACCESS_KEY@PROJECT_ID suffix).
# This mirrors scripts/deploy-website.sh's upload phases — keep the two in sync.
export RCLONE_CONFIG_SCW_TYPE=s3
export RCLONE_CONFIG_SCW_PROVIDER=Scaleway
export RCLONE_CONFIG_SCW_ACCESS_KEY_ID="$AWS_ACCESS_KEY_ID"
export RCLONE_CONFIG_SCW_SECRET_ACCESS_KEY="$AWS_SECRET_ACCESS_KEY"
export RCLONE_CONFIG_SCW_ENDPOINT="https://s3.nl-ams.scw.cloud"
export RCLONE_CONFIG_SCW_ACL=public-read

# rclone skips checksum-identical files, and skipped files keep their existing
# metadata — a Cache-Control policy change never reaches already-uploaded objects
# on its own. `--refresh-cache-metadata` forces every object to upload once so the
# new headers land everywhere; run it once after changing a policy above.
REFRESH_FLAGS=()
if [[ "${1:-}" == "--refresh-cache-metadata" ]]; then
  REFRESH_FLAGS=(--ignore-times)
fi
# Expanded below as ${REFRESH_FLAGS[@]+"${REFRESH_FLAGS[@]}"}: on bash < 4.4
# (macOS system bash is 3.2) expanding an empty array under `set -u` aborts
# with "unbound variable" — this idiom expands to nothing instead.

# --s3-acl passed explicitly too (belt and braces): the RCLONE_CONFIG_SCW_ACL env var
# name couldn't be confirmed against the real bucket (only --dry-run is permitted
# there), so all destination-touching commands also carry the flag directly.
rclone copy dist/ "scw:$BUCKET" \
  --checksum --include '_astro/**' --fast-list --transfers 8 -v \
  --s3-acl public-read ${REFRESH_FLAGS[@]+"${REFRESH_FLAGS[@]}"} \
  --header-upload 'Cache-Control: public, max-age=31536000, immutable'

rclone copy dist/ "scw:$BUCKET" \
  --checksum --include 'fonts/**' --fast-list --transfers 8 -v \
  --s3-acl public-read ${REFRESH_FLAGS[@]+"${REFRESH_FLAGS[@]}"} \
  --header-upload 'Cache-Control: public, max-age=31536000, immutable'

rclone copy dist/ "scw:$BUCKET" \
  --checksum --exclude '_astro/**' --exclude 'fonts/**' --exclude '*.html' \
  --fast-list --transfers 8 -v \
  --s3-acl public-read ${REFRESH_FLAGS[@]+"${REFRESH_FLAGS[@]}"} \
  --header-upload 'Cache-Control: public, max-age=3600'

rclone copy dist/ "scw:$BUCKET" \
  --checksum --include '*.html' --fast-list --transfers 8 -v \
  --s3-acl public-read ${REFRESH_FLAGS[@]+"${REFRESH_FLAGS[@]}"} \
  --header-upload 'Cache-Control: no-cache'

# Deletion-only pass: the four copies above are exhaustive and just ran over the
# same dist/, so every checksum matches and nothing transfers — carrying no
# --header-upload here is deliberate (a transfer would strip Cache-Control).
rclone sync dist/ "scw:$BUCKET" \
  --checksum --fast-list --transfers 8 -v \
  --s3-acl public-read

# Post-deploy verification. Non-fatal: legacy objects uploaded by the old
# aws-cli path can carry multipart ETags that sync tolerates (size fallback)
# but check flags — that must not fail a deploy whose sync already succeeded.
rclone check dist/ "scw:$BUCKET" --checksum --fast-list \
  || echo "WARNING: post-deploy rclone check reported differences (possibly legacy multipart-ETag objects) — inspect the output above." >&2
