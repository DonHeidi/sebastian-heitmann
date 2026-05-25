#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
INFRA_DIR="$ROOT_DIR/infra"
MAIL_SERVICE_DIR="$ROOT_DIR/apps/mail-service"
PROJECT_NAME="sebastian-heitmann-dev"

if [[ ! -f "$INFRA_DIR/terraform.tfvars" ]]; then
  echo "Missing infra/terraform.tfvars. Copy infra/terraform.tfvars.example and fill in real values." >&2
  exit 1
fi

if [[ -z "${SCW_ACCESS_KEY:-}" || -z "${SCW_SECRET_KEY:-}" ]]; then
  echo "Missing SCW_ACCESS_KEY/SCW_SECRET_KEY. Export them (e.g. \`set -a; source apps/mail-service/.env; set +a\`) before running." >&2
  exit 1
fi

if [[ -z "${AWS_ACCESS_KEY_ID:-}" || -z "${AWS_SECRET_ACCESS_KEY:-}" ]]; then
  PROJECT_ID=$(scw account project list -o json | jq -r --arg n "$PROJECT_NAME" '.[] | select(.name == $n) | .id')
  if [[ -z "$PROJECT_ID" ]]; then
    echo "Could not resolve Scaleway project '$PROJECT_NAME' via scw CLI. Check ~/.config/scw/config.yaml." >&2
    exit 1
  fi
  export AWS_ACCESS_KEY_ID="${SCW_ACCESS_KEY}@${PROJECT_ID}"
  export AWS_SECRET_ACCESS_KEY="$SCW_SECRET_KEY"
fi

cd "$MAIL_SERVICE_DIR"
bun run build

cd "$INFRA_DIR"
terraform apply "$@"
