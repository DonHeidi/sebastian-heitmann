#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
INFRA_DIR="$ROOT_DIR/infra"
WEBSITE_DIR="$ROOT_DIR/apps/website"
SCW_CONFIG="${HOME}/.config/scw/config.yaml"

if [[ ! -f "$INFRA_DIR/terraform.tfstate" ]]; then
  echo "Missing infra/terraform.tfstate. Apply infrastructure before deploying the website." >&2
  exit 1
fi

if [[ ! -f "$SCW_CONFIG" ]]; then
  echo "Missing Scaleway CLI config at $SCW_CONFIG." >&2
  exit 1
fi

FUNCTION_ENDPOINT="$(cd "$INFRA_DIR" && terraform output -raw function_endpoint)"
PROJECT_ID="$(jq -r '.resources[] | select(.type=="scaleway_account_project" and .name=="main") | .instances[0].attributes.id' "$INFRA_DIR/terraform.tfstate")"
SCW_ACCESS_KEY="$(grep access_key "$SCW_CONFIG" | awk '{print $2}')"
SCW_SECRET_KEY="$(grep secret_key "$SCW_CONFIG" | awk '{print $2}')"

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
