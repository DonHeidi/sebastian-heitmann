#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
INFRA_DIR="$ROOT_DIR/infra"
MAIL_SERVICE_DIR="$ROOT_DIR/apps/mail-service"

if [[ ! -f "$INFRA_DIR/terraform.tfvars" ]]; then
  echo "Missing infra/terraform.tfvars. Copy infra/terraform.tfvars.example and fill in real values." >&2
  exit 1
fi

cd "$MAIL_SERVICE_DIR"
bun run build

cd "$INFRA_DIR"
terraform apply "$@"
