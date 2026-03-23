# Scaleway Infrastructure Design

## Overview

Unified Terraform configuration managing all Scaleway infrastructure for sebastian-heitmann.dev: static website hosting via Object Storage + Edge Services (CDN), and the contact form mail service serverless function.

## Architecture

```
                   GoDaddy DNS
                   ┌──────────────────────────┐
                   │ sebastian-heitmann.dev    │
                   │   → redirect to www.      │
                   │ www.sebastian-heitmann.dev│
                   │   → CNAME to CDN endpoint │
                   └──────────┬───────────────┘
                              │
                   Scaleway (project: sebastian-heitmann-dev)
                   ┌──────────┴───────────────┐
                   │                          │
            Edge Services (CDN)        Serverless Function
            (nl-ams)                   (nl-ams)
                   │                          │
            Object Storage              TEM API
            (nl-ams)                   (fr-par)
                   │
            Static Astro build
```

## Scaleway Resources

### Project

- **Name:** `sebastian-heitmann-dev`
- **Description:** Personal portfolio website and supporting services

### Object Storage (website hosting)

- **Bucket name:** `sebastian-heitmann-website`
- **Region:** `nl-ams`
- **Visibility:** Public (for website serving)
- **Website config:** index document `index.html`, error document `404.html`
- **Content:** Static files from `apps/website/dist/` synced via `scw` CLI

### Edge Services (CDN)

- **Origin:** Object Storage bucket
- **Region:** `nl-ams`
- **Custom domain:** Configured manually via Scaleway console after deployment
  - `www.sebastian-heitmann.dev` with managed TLS
- **DNS:** Configured manually on GoDaddy
  - `www.sebastian-heitmann.dev` → CNAME to CDN endpoint
  - `sebastian-heitmann.dev` → redirect to `www.`

### Serverless Function (mail service)

- **Namespace:** `mail-service`
- **Function:** `contact-handler`
- **Runtime:** Node.js 22
- **Handler:** `handler.handle`
- **Privacy:** Public
- **Scaling:** 0–5 instances
- **Memory:** 256 MB
- **Timeout:** 30 seconds
- **Source:** `apps/mail-service/dist/handler.zip`
- **Environment variables:**
  - `MAIL_SENDER` — verified sender email
  - `ALLOWED_ORIGIN` — CORS origin
  - `SCW_REGION` — `fr-par` (TEM API region)
- **Secret environment variables:**
  - `SCW_SECRET_KEY` — API key for TEM
  - `SCW_PROJECT_ID` — auto-filled from project resource
  - `MAIL_RECIPIENT` — destination email

## Terraform Layout

```
infra/
├── main.tf                    # provider, project
├── storage.tf                 # object storage bucket + website config
├── cdn.tf                     # edge services
├── function.tf                # mail service function
├── variables.tf               # all variables
├── outputs.tf                 # endpoints (CDN, function, bucket)
└── terraform.tfvars.example   # example variable values
```

Moved from `apps/mail-service/infra/` to `infra/` at repo root.

## Variables

| Variable | Default | Sensitive | Description |
|----------|---------|-----------|-------------|
| `region` | `nl-ams` | No | Primary deployment region |
| `tem_region` | `fr-par` | No | TEM API region |
| `mail_recipient` | — | Yes | Contact form destination email |
| `mail_sender` | — | No | Verified sender email |
| `allowed_origin` | — | No | CORS allowed origin |
| `scw_secret_key` | — | Yes | Scaleway API secret key |

## Outputs

| Output | Description |
|--------|-------------|
| `cdn_endpoint` | Edge Services endpoint URL |
| `function_endpoint` | Mail function public URL |
| `bucket_endpoint` | Object Storage bucket URL |

## Deployment Flow

Order matters: the function must be deployed before the website is built, because the website bakes in the function endpoint at build time via `PUBLIC_MAIL_ENDPOINT`.

1. Build mail handler: `cd apps/mail-service && bun run build`
2. Deploy infra: `cd infra && terraform apply` → note `function_endpoint` from output
3. Set `PUBLIC_MAIL_ENDPOINT=<function_endpoint>` in `apps/website/.env`
4. Build website: `cd apps/website && bun run build`
5. Sync website files to bucket: `scw object cp -r apps/website/dist/ s3://sebastian-heitmann-website/`

## Out of Scope (for now)

- TEM domain management via Terraform
- DNS management (stays on GoDaddy)
- Custom domain attachment on CDN (done via Scaleway console)
- CI/CD pipeline
