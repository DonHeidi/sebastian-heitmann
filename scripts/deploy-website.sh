#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
# Must resolve to THIS file, never a fixed name: the re-exec below would otherwise
# hand control to scripts/deploy-website.sh whichever file was actually invoked, so
# a copy or wrapper (a --dry-run variant, say) silently runs the original's
# behaviour instead of its own.
SCRIPT_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/$(basename "${BASH_SOURCE[0]}")"
INFRA_DIR="$ROOT_DIR/infra"
WEBSITE_DIR="$ROOT_DIR/apps/website"
PROJECT_NAME="sebastian-heitmann-dev"
VARLOCK="$ROOT_DIR/node_modules/.bin/varlock"

# Re-exec under `varlock run` so Scaleway credentials (SCW_ACCESS_KEY, SCW_SECRET_KEY,
# SCW_DEFAULT_ORGANIZATION_ID) come from Proton Pass — no ~/.config/scw/config.yaml needed.
# varlock loads infra/.env.schema from the infra directory (the cwd at exec time).
if [[ -z "${VARLOCK_INJECTED:-}" ]]; then
  cd "$INFRA_DIR"
  # --inject vars (no __VARLOCK_ENV blob) so the website build's own `varlock run`
  # resolves apps/website/.env.schema fresh rather than inheriting this one's
  # infra-scoped config.
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

# Initialize the remote backend + providers (idempotent; required on a fresh checkout).
( cd "$INFRA_DIR" && terraform init -input=false >/dev/null )
FUNCTION_ENDPOINT="$(cd "$INFRA_DIR" && terraform output -raw function_endpoint)"
if [[ -z "$FUNCTION_ENDPOINT" ]]; then
  echo "Could not resolve function_endpoint from 'terraform output' — has the infrastructure been applied (./scripts/apply-infra.sh)?" >&2
  exit 1
fi

cd "$WEBSITE_DIR"

# The endpoint is committed in apps/website/.env.schema so that `bun run build`
# and this script produce byte-identical output. Terraform stays the source of
# truth for the value, so verify the two agree and abort on drift rather than
# injecting — an injected override would silently make the deployed artifact
# differ from what a plain build produces.
#
# Resolve through varlock rather than reading .env.schema textually: varlock
# layers .env / .env.local / .env.*.local over the schema, so a stray local
# override would otherwise sail past a file-text check and get baked into the
# deployed bundle. This asks for exactly the value the build below will use.
RESOLVED_ENDPOINT="$("$VARLOCK" run -- printenv PUBLIC_MAIL_ENDPOINT)"
if [[ "$RESOLVED_ENDPOINT" != "https://${FUNCTION_ENDPOINT}" ]]; then
  echo "PUBLIC_MAIL_ENDPOINT drift — refusing to deploy." >&2
  echo "  terraform output: https://${FUNCTION_ENDPOINT}" >&2
  echo "  build would use:  ${RESOLVED_ENDPOINT:-<unset>}" >&2
  echo "Reconcile apps/website/.env.schema with terraform (and remove any local" >&2
  echo ".env override), commit, then redeploy." >&2
  exit 1
fi

bun run build

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

# --s3-acl passed explicitly too (belt and braces): the RCLONE_CONFIG_SCW_ACL env var
# name couldn't be confirmed against the real bucket (only --dry-run is permitted
# there), so all destination-touching commands also carry the flag directly.
rclone copy dist/ scw:sebastian-heitmann-website \
  --checksum --include '_astro/**' --fast-list --transfers 8 -v \
  --s3-acl public-read "${REFRESH_FLAGS[@]}" \
  --header-upload 'Cache-Control: public, max-age=31536000, immutable'

rclone copy dist/ scw:sebastian-heitmann-website \
  --checksum --include 'fonts/**' --fast-list --transfers 8 -v \
  --s3-acl public-read "${REFRESH_FLAGS[@]}" \
  --header-upload 'Cache-Control: public, max-age=31536000, immutable'

rclone copy dist/ scw:sebastian-heitmann-website \
  --checksum --exclude '_astro/**' --exclude 'fonts/**' --exclude '*.html' \
  --fast-list --transfers 8 -v \
  --s3-acl public-read "${REFRESH_FLAGS[@]}" \
  --header-upload 'Cache-Control: public, max-age=3600'

rclone copy dist/ scw:sebastian-heitmann-website \
  --checksum --include '*.html' --fast-list --transfers 8 -v \
  --s3-acl public-read "${REFRESH_FLAGS[@]}" \
  --header-upload 'Cache-Control: no-cache'

# Deletion-only pass: the four copies above are exhaustive and just ran over the
# same dist/, so every checksum matches and nothing transfers — carrying no
# --header-upload here is deliberate (a transfer would strip Cache-Control).
rclone sync dist/ scw:sebastian-heitmann-website \
  --checksum --fast-list --transfers 8 -v \
  --s3-acl public-read

# Post-deploy verification. Non-fatal: legacy objects uploaded by the old
# aws-cli path can carry multipart ETags that sync tolerates (size fallback)
# but check flags — that must not fail a deploy whose sync already succeeded.
rclone check dist/ scw:sebastian-heitmann-website --checksum --fast-list \
  || echo "WARNING: post-deploy rclone check reported differences (possibly legacy multipart-ETag objects) — inspect the output above." >&2
