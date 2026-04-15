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

AWS_ACCESS_KEY_ID="${SCW_ACCESS_KEY}@${PROJECT_ID}" \
AWS_SECRET_ACCESS_KEY="$SCW_SECRET_KEY" \
aws s3 cp dist/ s3://sebastian-heitmann-website/ \
  --acl public-read \
  --endpoint-url https://s3.nl-ams.scw.cloud \
  --recursive
