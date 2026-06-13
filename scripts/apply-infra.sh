#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCRIPT_PATH="$ROOT_DIR/scripts/apply-infra.sh"
INFRA_DIR="$ROOT_DIR/infra"
MAIL_SERVICE_DIR="$ROOT_DIR/apps/mail-service"
PROJECT_NAME="sebastian-heitmann-dev"
VARLOCK="$ROOT_DIR/node_modules/.bin/varlock"

# Re-exec under `varlock run` so Proton Pass secrets (SCW_ACCESS_KEY, SCW_SECRET_KEY,
# SCW_DEFAULT_ORGANIZATION_ID, TF_VAR_mail_recipient) are injected into the environment.
# varlock loads infra/.env.schema from the infra directory (the cwd at exec time).
if [[ -z "${VARLOCK_INJECTED:-}" ]]; then
  if [[ ! -f "$INFRA_DIR/terraform.tfvars" ]]; then
    echo "Missing infra/terraform.tfvars. Copy infra/terraform.tfvars.example and fill in real values." >&2
    exit 1
  fi
  cd "$INFRA_DIR"
  # --inject vars (individual env vars, no __VARLOCK_ENV blob) keeps nested `varlock run`
  # invocations (e.g. wrapped build scripts) resolving their own schema cleanly.
  exec "$VARLOCK" run --inject vars -- env VARLOCK_INJECTED=1 bash "$SCRIPT_PATH" "$@"
fi

# --- below runs with secrets injected by varlock ---

# Derive S3 state-backend auth (AWS_ACCESS_KEY@PROJECT_ID). The scw CLI authenticates
# from the SCW_* env vars varlock provides, so no ~/.config/scw/config.yaml is needed.
if [[ -z "${AWS_ACCESS_KEY_ID:-}" || -z "${AWS_SECRET_ACCESS_KEY:-}" ]]; then
  PROJECT_ID=$(scw account project list -o json | jq -r --arg n "$PROJECT_NAME" '.[] | select(.name == $n) | .id')
  if [[ -z "$PROJECT_ID" ]]; then
    echo "Could not resolve Scaleway project '$PROJECT_NAME' via scw CLI." >&2
    exit 1
  fi
  export AWS_ACCESS_KEY_ID="${SCW_ACCESS_KEY}@${PROJECT_ID}"
  export AWS_SECRET_ACCESS_KEY="$SCW_SECRET_KEY"
fi

cd "$MAIL_SERVICE_DIR"
bun run build

cd "$INFRA_DIR"
terraform apply "$@"
