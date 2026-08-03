# Sebastian Heitmann — Monorepo

## Project Overview

Bun workspaces monorepo containing the personal portfolio website and supporting services.

## Monorepo Structure

```
apps/
├── website/          # Astro 7 portfolio site
├── mail-service/     # Scaleway serverless contact form handler
└── apex-redirect/    # Scaleway serverless apex → www 301 redirect (path + query preserved)
infra/                # Terraform — Scaleway project, function, object storage, CDN
docs/                 # Shared project documentation
```

## Tech Stack

- **Runtime/Package Manager:** Bun (managed via mise) with workspaces
- **Toolchain:** mise pins `bun`, `terraform`, `scaleway` (the `scw` CLI), `aws`, and `jq` — run `mise install`. The mail-service build also needs system **`zip`** (preinstalled on macOS; `sudo apt install zip` on Debian/Ubuntu/WSL).
- **Secrets:** [varlock](https://varlock.dev) (`.env.schema` per workspace) + [Proton Pass](https://protonpass.github.io/pass-cli/) via `@varlock/proton-pass-plugin`
- **Website:** Astro 7, Tailwind v4 + shadcn (--v8-asterisk design system), React/TSX as build-time templating only (no client-side React), TypeScript
- **Mail Service:** TypeScript, Scaleway Transactional Email API
- **Infrastructure:** Terraform (Scaleway provider ~> 2.0)

## Prerequisites

The deploy/infra toolchain is managed by [mise](https://mise.jdx.dev) (`mise.toml`):
`bun`, `terraform` (≥ 1.10, needed for the S3 backend's `use_lockfile`), `rclone`
(website upload), and `scaleway-cli` (provides `scw`). Install everything with:

```bash
mise install                         # Installs bun, terraform, rclone, scaleway-cli
```

Then authenticate Scaleway once — this writes `~/.config/scw/config.yaml`, which both
deploy scripts read for the access/secret key:

```bash
scw init                             # Paste your Scaleway API access key + secret (from console → IAM → API keys)
```

`jq` is also required (system package, not managed by mise). Credentials are never stored
in the repo; without a valid `~/.config/scw/config.yaml` the deploy scripts exit early.

## Commands

```bash
mise install                         # Install pinned toolchain (bun, terraform, scw, aws, jq)
sudo apt install zip                 # System dep for the mail-service build (Debian/Ubuntu/WSL; preinstalled on macOS)
bun install                          # Install all workspace dependencies (incl. varlock + proton-pass plugin)
# One-time: install & authenticate pass-cli, create the Proton Pass vault (see Proton Pass vault setup)
./scripts/apply-infra.sh             # Build mail-service and apply Terraform (secrets via varlock + Proton Pass)
./scripts/deploy-website.sh          # Build website and upload dist/ to Scaleway Object Storage
./scripts/scw <args...>              # Run the Scaleway CLI with creds from Proton Pass (no ~/.config/scw needed)

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

Astro-based personal portfolio/fractional CTO landing page. Precision Swiss design with light/dark mode and multi-locale support (en-us, de-de).

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
| de-de | `/de-de/` | No |

- UI strings in `src/i18n/{locale}.ts` — typed with shared `Strings` interface
- Components receive string sections as props
- Case studies in `src/content/cases/{locale}/`
- First-visit redirect detects `navigator.language`, redirects once (localStorage)
- Language picker: inline segmented control (US/DE)

### Fonts

Instrument Serif (display), DM Sans (body) via Google Fonts; IBM Plex Mono (mono) self-hosted.

### Image Handling Gotchas

- Reference image URLs through `getImage()` from `astro:assets`, not `ImageMetadata.src`. Using `.src` directly (e.g. for OG meta, JSON-LD) forces Astro to emit the original source file (often multi-MB PNGs) to `dist/_astro/`.
- Astro's content-collection `image()` schema imports every referenced asset via Vite, which emits the source file even when only transformed variants (webp/jpg) are actually referenced in HTML. `scripts/deploy-website.sh` prunes these orphans before upload by cross-referencing every file in `dist/_astro/` against URLs appearing in emitted HTML/CSS/JS.

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
- **Serverless Function** — apex → www redirect (`apps/apex-redirect/`); Edge Services can't take a bare apex, so the apex ALIAS points here and the function holds the apex's managed cert
- **DNS zone** (`infra/dns.tf`) — the full `sebastian-heitmann.dev` zone, hosted at Scaleway Domains and DNS (registration stays at GoDaddy; NS delegated to `ns0/ns1.dom.scw.cloud`). Includes the Microsoft 365 mail records for `me@sebastian-heitmann.dev` — never remove those. Zone onboarding itself is not terraformable; see `docs/runbooks/2026-08-02-apex-dns-cutover.md`
- **Transactional Email domain** (`contact.sebastian-heitmann.dev`) — project-scoped sender domain for TEM
- **IAM** — a project-scoped API key with `TransactionalEmailEmailApiCreate` permission, generated by Terraform for the mail function. Not to be confused with the **deploy** key from Proton Pass, which is organization-wide (see Scaleway Gotchas)

### Terraform State Backend

State lives in a Scaleway Object Storage bucket (`sebastian-heitmann-tfstate`, region `nl-ams`) inside the `sebastian-heitmann-dev` project. The bucket is created manually via the Scaleway console (not in Terraform) to avoid managing the bucket that holds its own state. Configure with: private visibility, SSE-ONE encryption, versioning enabled, no object lock.

The S3 backend in `infra/main.tf` uses S3-native locking (`use_lockfile = true`, requires Terraform ≥ 1.10). Auth uses AWS-prefixed env vars that mirror your Scaleway credentials:

```bash
export AWS_ACCESS_KEY_ID="${SCW_ACCESS_KEY}@<TF-managed-project-id>"
export AWS_SECRET_ACCESS_KEY="$SCW_SECRET_KEY"
```

The `@<project-id>` suffix is required to target the `sebastian-heitmann-dev` project (see Scaleway gotcha below). The project ID is visible in `terraform output` or the Scaleway console.

### Scaleway Gotchas

- **The deploy credentials are organization-wide, not project-scoped.** `infra/.env.schema` supplies `SCW_DEFAULT_ORGANIZATION_ID` and no project id, so `./scripts/scw <cmd> list` enumerates **every project in the org** (currently `sebastian-heitmann.dev`, `sebastian-heitmann-dev`, `job-directory`) — and mutating commands will happily act on another project's resources. Always pass `--project-id` on ad-hoc commands, or check the `project_id` field in the output before acting on a resource. Real incident: `edge-services pipeline list` returns two pipelines, and the second (`landing-apex`) belongs to `job-directory`, not this site — it was purged repeatedly in the belief that both served this domain. Terraform is unaffected: it is pinned to the `sebastian-heitmann-dev` project.
- Only **one** Edge Services pipeline belongs to this repo — `sebastian-heitmann-website`, serving `www.sebastian-heitmann.dev` (`infra/cdn.tf`). Resolve its id by name rather than hardcoding one, so a cache purge cannot land on another project's pipeline:

  ```bash
  ./scripts/scw edge-services purge-request create all=true \
    pipeline-id="$(./scripts/scw edge-services pipeline list -o json \
      | jq -r '.[] | select(.name=="sebastian-heitmann-website") | .id')"
  ```

  (`terraform output -raw cdn_pipeline_id` also holds it, but only works with the S3-backend credentials the deploy script exports — it fails silently otherwise.)
- TEM API is only available in `fr-par`, function hosts in `nl-ams`
- `SCW_*` env vars are reserved in Scaleway Functions — use `TEM_*` prefix instead
- S3 API requires `ACCESS_KEY@PROJECT_ID` format to target non-default projects — the `PROJECT_ID` is the Terraform-managed project, not the default org project from `~/.config/scw/config.yaml`
- Bucket ACL and object visibility are separate in Scaleway Object Storage. Uploaded objects are private by default, so website deploys must set object ACLs to `public-read` or apply an equivalent bucket policy.
- Edge Services requires a `scaleway_edge_services_plan` before creating pipelines
- `scaleway_edge_services_head_stage` must point to the DNS stage, not cache/backend
- Backend stage needs `is_website = true` to serve HTML (otherwise returns XML bucket listing)
- CDN CNAME target is `<pipeline_id>.svc.edge.scw.cloud` (only visible via API, not console)
- TLS certificate is auto-provisioned once CNAME points to Edge Services endpoint

### Environment Separation

Config is managed by **varlock** — each workspace has a committed `.env.schema` (the single source of truth for its config shape). Non-secret values are committed defaults; sensitive values resolve at runtime from **Proton Pass** via the `protonPass(pass://…)` resolver. Nothing sensitive is written to disk: every command that needs config runs behind `varlock run --` (already wired into the relevant `package.json` scripts and the deploy scripts).

- Non-secret infra inputs (`mail_sender`, `allowed_origins`, `tem_domain`, `region`) live as **defaults in `infra/variables.tf`** — no `terraform.tfvars` is needed (single-environment, non-secret). `mail_recipient` is sensitive (PII) and resolves from Proton Pass as `TF_VAR_mail_recipient`. (Add a `terraform.tfvars` only if you need per-machine overrides; it stays gitignored.)
- `infra/.env.schema` supplies the deploy credentials (`SCW_ACCESS_KEY`, `SCW_SECRET_KEY`, `SCW_DEFAULT_ORGANIZATION_ID`) from Proton Pass, so deploys need **no** `~/.config/scw/config.yaml` and work on any machine with vault access. There is no `config.yaml` — run ad-hoc Scaleway commands via `./scripts/scw <args>`, which injects the creds from Proton Pass (region-specific commands may need a `--region` flag).
- `TEM_SECRET_KEY` is **not** in Proton Pass — Terraform self-generates it (`scaleway_iam_api_key`) and injects it into the function at apply time.
- `PUBLIC_MAIL_ENDPOINT` is a **committed default** in `apps/website/.env.schema`. It is public by definition (it ships in the HTML of every page with a contact form), so committing it keeps `bun run build` and `./scripts/deploy-website.sh` producing byte-identical output. Terraform stays the source of truth for the value: the deploy script compares `terraform output -raw function_endpoint` against the schema and **aborts on a mismatch** rather than injecting an override. If the function URL changes, update `.env.schema` and commit it before deploying.

See `docs/superpowers/specs/2026-06-12-varlock-proton-pass-design.md` for the full design.

### Proton Pass vault setup

One-time, on each machine that develops or deploys:

1. Install `mise` and system `zip` (`sudo apt install zip` on Debian/Ubuntu/WSL; preinstalled on macOS), then run `mise install` (bun, terraform, scw, aws, jq) and `bun install` (adds `varlock` + `@varlock/proton-pass-plugin`).
2. Install `pass-cli` (`curl -fsSL https://proton.me/download/pass-cli/install.sh | bash`) and authenticate (`pass-cli login`), or use a personal access token scoped to the vault.
3. Create a Proton Pass vault named **`sebastian-heitmann`** with these items and **exact** field names (the plugin extracts the last `pass://` path segment from `pass-cli item view --output json`):

   | Item | Field(s) |
   |------|----------|
   | `scaleway` | `access-key`, `secret-key`, `org-id` |
   | `mail` | `recipient` |

After setup, `bun run dev` in any app and the deploy scripts resolve secrets automatically. Migrate the existing `apps/mail-service/.env` values into the vault, then delete that file.

### Deployment

Order matters: function must deploy before website build (endpoint baked in at build time). Prerequisite: `mise install`, `bun install`, and an authenticated `pass-cli` session (see above).

```bash
# 1. Apply infrastructure (varlock injects SCW creds + TF_VAR_mail_recipient from Proton Pass;
#    non-secret inputs come from defaults in infra/variables.tf — no terraform.tfvars needed)
./scripts/apply-infra.sh -auto-approve

# 2. Build and deploy website
./scripts/deploy-website.sh
```

#### Cache-Control policy

The deploy script sets `Cache-Control` as per-object metadata at upload time (the
Edge Services cache stage adds no browser-facing headers of its own):

| Path | Policy |
|------|--------|
| `_astro/**` | `public, max-age=31536000, immutable` (content-hashed filenames) |
| `fonts/**` | `public, max-age=31536000, immutable` — **a changed font must ship under a new filename** (files in `public/` are never hashed) |
| `*.html` | `no-cache` (browsers and CDN revalidate via ETag; deploys visible immediately) |
| everything else | `public, max-age=3600` |

rclone skips checksum-identical files and skipped files keep their old metadata, so
after **changing** a policy run `./scripts/deploy-website.sh --refresh-cache-metadata`
once — it forces every object to re-upload so the new headers land everywhere.

---

## Mail Service (`apps/mail-service/`)

Scaleway serverless function that receives contact form submissions and sends emails via Scaleway Transactional Email API.

### Environment Variables

| Variable | Description |
|----------|-------------|
| `TEM_SECRET_KEY` | Scaleway API secret key (managed by Terraform IAM) |
| `TEM_PROJECT_ID` | Scaleway project ID (auto-filled by Terraform) |
| `TEM_REGION` | TEM API region (default: `fr-par`) |
| `MAIL_RECIPIENT` | Email address to receive contact form messages (local: from Proton Pass `mail/recipient`; prod: Terraform) |
| `MAIL_SENDER` | Sender email address (verified domain: `contact.sebastian-heitmann.dev`) |

Locally, these resolve from `apps/mail-service/.env.schema` via `varlock run` (see Environment Separation). In production they are injected by Terraform.

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
- Components are `.tsx`, styled with Tailwind utilities — there are no `<style>` blocks and no SCSS. Decorative CSS that utilities cannot express (grain overlays, the `.bd-*` backdrop vocabulary, the reveal animation) lives in `src/styles/global.css` under `@layer components`, documented in place
- **No React ships to the client.** React/TSX is a build-time templating layer only: components render to static HTML and there are no `client:*` directives anywhere. Interactive components (`theme-toggle.astro`, `contact-form.astro`) are `.astro` files whose markup lifts the design-system classes verbatim and whose behavior lives in a colocated `<script>` (plain TypeScript, bundled by Astro). The shadcn/React components in the v8-asterisk registry are for other projects — do not reintroduce them as hydrated islands here
