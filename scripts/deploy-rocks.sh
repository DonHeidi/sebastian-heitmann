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
# Phase 1: assets first so no live HTML ever references a missing file.
# Phase 2: HTML + deletions of stale objects (bucket is fully regenerable from git).
export RCLONE_CONFIG_SCW_TYPE=s3
export RCLONE_CONFIG_SCW_PROVIDER=Scaleway
export RCLONE_CONFIG_SCW_ACCESS_KEY_ID="$AWS_ACCESS_KEY_ID"
export RCLONE_CONFIG_SCW_SECRET_ACCESS_KEY="$AWS_SECRET_ACCESS_KEY"
export RCLONE_CONFIG_SCW_ENDPOINT="https://s3.nl-ams.scw.cloud"
export RCLONE_CONFIG_SCW_ACL=public-read

rclone copy dist/ "scw:$BUCKET" \
  --checksum --exclude '*.html' --fast-list --transfers 8 -v \
  --s3-acl public-read

rclone sync dist/ "scw:$BUCKET" \
  --checksum --fast-list --transfers 8 -v \
  --s3-acl public-read

# Post-deploy verification (non-fatal, matching deploy-website.sh).
rclone check dist/ "scw:$BUCKET" --checksum --fast-list \
  || echo "WARNING: post-deploy rclone check reported differences — inspect the output above." >&2
