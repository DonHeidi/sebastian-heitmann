# Sebastian Heitmann — Monorepo

## Project Overview

Bun workspaces monorepo containing the personal portfolio website and supporting services.

## Monorepo Structure

```
apps/
├── website/          # Astro 6 portfolio site
└── mail-service/     # Scaleway serverless contact form handler
infra/                # Terraform — Scaleway project, function, object storage, CDN
docs/                 # Shared project documentation
```

## Tech Stack

- **Runtime/Package Manager:** Bun (managed via mise) with workspaces
- **Website:** Astro 6, SCSS, TypeScript
- **Mail Service:** TypeScript, Scaleway Transactional Email API
- **Infrastructure:** Terraform (Scaleway provider ~> 2.0)

## Commands

```bash
bun install                          # Install all workspace dependencies

# Website
cd apps/website
bun run dev                          # Start dev server
bun run build                        # Production build
bun run preview                      # Preview production build

# Mail Service
cd apps/mail-service
bun run build                        # Bundle for deployment
```

---

## Website (`apps/website/`)

Astro-based personal portfolio/fractional CTO landing page. Precision Swiss design with light/dark mode and multi-locale support (en-us, en-gb, de-de).

### Website Structure

```
apps/website/
├── src/
│   ├── i18n/                    # Locale string files and types
│   ├── layouts/Layout.astro     # Shared HTML shell, head, theme, hreflang
│   ├── pages/                   # Locale-prefixed page routes
│   ├── components/              # All accept strings as props
│   ├── content/cases/           # Case studies per locale
│   └── assets/                  # Images
├── public/fonts/                # Self-hosted IBM Plex Mono
├── astro.config.mjs
└── package.json
```

### Internationalization (i18n)

| Locale | URL | Default |
|--------|-----|---------|
| en-us | `/` (no prefix) | Yes |
| en-gb | `/en-gb/` | No |
| de-de | `/de-de/` | No |

- UI strings in `src/i18n/{locale}.ts` — typed with shared `Strings` interface
- Components receive string sections as props
- Case studies in `src/content/cases/{locale}/`
- First-visit redirect detects `navigator.language`, redirects once (localStorage)
- Language picker: inline segmented control (US/GB/DE)

### Fonts

Instrument Serif (display), DM Sans (body) via Google Fonts; IBM Plex Mono (mono) self-hosted.

### Design System

- **Light/dark mode:** `html.dark` / `html.light` class, three-option toggle (system/light/dark)
- **CSS custom properties:** `--v8-bg`, `--v8-text`, `--v8-accent`, `--v8-border`, `--v8-font-display`, `--v8-font-body`, `--v8-font-mono`
- **Dark accent:** #FF3B00, **Light accent:** #B82A00
- Responsive breakpoints: 1440px, 1024px, 768px, 375px

---

## Infrastructure (`infra/`)

Terraform config managing a dedicated Scaleway project (`sebastian-heitmann-dev`) containing:
- **Object Storage** bucket (`sebastian-heitmann-website`) — static website hosting
- **Edge Services** pipeline — CDN with cache stage
- **Serverless Function** — contact form handler (Node.js 22, Amsterdam)
- **IAM** — project-scoped API key with `TransactionalEmailEmailApiCreate` permission

### Scaleway Gotchas

- TEM API is only available in `fr-par`, function hosts in `nl-ams`
- `SCW_*` env vars are reserved in Scaleway Functions — use `TEM_*` prefix instead
- S3 API requires `ACCESS_KEY@PROJECT_ID` format to target non-default projects — the `PROJECT_ID` is the Terraform-managed project, not the default org project from `~/.config/scw/config.yaml`
- Bucket ACL is managed by Terraform (`public-read`) — do not pass `--acl public-read` on `aws s3 cp` as it requires extra permissions
- Edge Services requires a `scaleway_edge_services_plan` before creating pipelines
- `scaleway_edge_services_head_stage` must point to the DNS stage, not cache/backend
- Backend stage needs `is_website = true` to serve HTML (otherwise returns XML bucket listing)
- CDN CNAME target is `<pipeline_id>.svc.edge.scw.cloud` (only visible via API, not console)
- TLS certificate is auto-provisioned once CNAME points to Edge Services endpoint

### Deployment

Order matters: function must deploy before website build (endpoint baked in at build time).

```bash
# 1. Build mail handler
cd apps/mail-service && bun run build

# 2. Deploy infrastructure (uses TF_VAR_* env vars)
cd infra
source ../apps/mail-service/.env
TF_VAR_region="nl-ams" \
TF_VAR_mail_recipient="$MAIL_RECIPIENT" \
TF_VAR_mail_sender="$MAIL_SENDER" \
TF_VAR_allowed_origin="$ALLOWED_ORIGIN" \
terraform apply

# 3. Build website with function endpoint
cd apps/website
PUBLIC_MAIL_ENDPOINT="https://<function_endpoint>" bun run build

# 4. Sync to bucket
# Uses Scaleway CLI credentials (~/.config/scw/config.yaml)
# PROJECT_ID is the Terraform-managed project (not the default org project):
#   cd infra && terraform state show scaleway_account_project.main | grep ' id'
SCW_ACCESS_KEY="$(grep access_key ~/.config/scw/config.yaml | awk '{print $2}')" \
SCW_SECRET_KEY="$(grep secret_key ~/.config/scw/config.yaml | awk '{print $2}')" \
PROJECT_ID="$(cd ../infra && terraform output -raw 2>/dev/null; terraform state show scaleway_account_project.main 2>/dev/null | grep ' id' | awk '{print $NF}' | tr -d '"')" \
AWS_ACCESS_KEY_ID="${SCW_ACCESS_KEY}@${PROJECT_ID}" \
AWS_SECRET_ACCESS_KEY="$SCW_SECRET_KEY" \
aws s3 cp dist/ s3://sebastian-heitmann-website/ \
  --endpoint-url https://s3.nl-ams.scw.cloud \
  --recursive
```

---

## Mail Service (`apps/mail-service/`)

Scaleway serverless function that receives contact form submissions and sends emails via Scaleway Transactional Email API.

### Environment Variables

| Variable | Description |
|----------|-------------|
| `TEM_SECRET_KEY` | Scaleway API secret key (managed by Terraform IAM) |
| `TEM_PROJECT_ID` | Scaleway project ID (auto-filled by Terraform) |
| `TEM_REGION` | TEM API region (default: `fr-par`) |
| `MAIL_RECIPIENT` | Email address to receive contact form messages |
| `MAIL_SENDER` | Sender email address (verified domain: `contact.sebastian-heitmann.dev`) |

---

## Conventions

### Commit Messages

Uses conventional commits:
- `feat(scope): description` for features
- `fix(scope): description` for bug fixes
- `refactor(scope): description` for refactors
- `cicd(scope): description` for CI/CD changes

### Component Patterns

- All components use `--v8-*` CSS custom properties that adapt to light/dark mode
- Components accept typed string props — no hardcoded user-visible text
- Scoped SCSS `<style>` blocks per component
