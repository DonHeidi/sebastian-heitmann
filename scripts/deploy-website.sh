#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
INFRA_DIR="$ROOT_DIR/infra"
WEBSITE_DIR="$ROOT_DIR/apps/website"
SCW_CONFIG="${HOME}/.config/scw/config.yaml"
PROJECT_NAME="sebastian-heitmann-dev"

if [[ ! -f "$SCW_CONFIG" ]]; then
  echo "Missing Scaleway CLI config at $SCW_CONFIG." >&2
  exit 1
fi

SCW_ACCESS_KEY="$(grep access_key "$SCW_CONFIG" | awk '{print $2}')"
SCW_SECRET_KEY="$(grep secret_key "$SCW_CONFIG" | awk '{print $2}')"

PROJECT_ID=$(scw account project list -o json | jq -r --arg n "$PROJECT_NAME" '.[] | select(.name == $n) | .id')
if [[ -z "$PROJECT_ID" ]]; then
  echo "Could not resolve Scaleway project '$PROJECT_NAME' via scw CLI. Check ~/.config/scw/config.yaml." >&2
  exit 1
fi

if [[ -z "${AWS_ACCESS_KEY_ID:-}" || -z "${AWS_SECRET_ACCESS_KEY:-}" ]]; then
  export AWS_ACCESS_KEY_ID="${SCW_ACCESS_KEY}@${PROJECT_ID}"
  export AWS_SECRET_ACCESS_KEY="$SCW_SECRET_KEY"
fi

FUNCTION_ENDPOINT="$(cd "$INFRA_DIR" && terraform output -raw function_endpoint)"

cd "$WEBSITE_DIR"
PUBLIC_MAIL_ENDPOINT="https://${FUNCTION_ENDPOINT}" bun run build

# Astro's content-collection image() schema imports each source asset via Vite,
# which emits the originals to dist/_astro/ even when only transformed variants
# (webp/jpg) are referenced. Prune any file in dist/_astro/ that isn't
# referenced by any emitted HTML/CSS/JS.
REFERENCED="$(grep -rhoE '_astro/[A-Za-z0-9._-]+' dist --include='*.html' --include='*.css' --include='*.js' --include='*.xml' | sort -u)"
while IFS= read -r -d '' file; do
  rel="${file#dist/}"
  if ! grep -qxF "$rel" <<< "$REFERENCED"; then
    rm -f "$file"
  fi
done < <(find dist/_astro -maxdepth 1 -type f -print0)

AWS_ACCESS_KEY_ID="${SCW_ACCESS_KEY}@${PROJECT_ID}" \
AWS_SECRET_ACCESS_KEY="$SCW_SECRET_KEY" \
aws s3 cp dist/ s3://sebastian-heitmann-website/ \
  --acl public-read \
  --endpoint-url https://s3.nl-ams.scw.cloud \
  --recursive
