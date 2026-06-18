#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCRIPT_PATH="$ROOT_DIR/scripts/deploy-website.sh"
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
  # resolves apps/website/.env.schema fresh and honors the PUBLIC_MAIL_ENDPOINT we set below.
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

aws s3 cp dist/ s3://sebastian-heitmann-website/ \
  --acl public-read \
  --endpoint-url https://s3.nl-ams.scw.cloud \
  --recursive
