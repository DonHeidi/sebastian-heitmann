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
  - `ALLOWED_ORIGINS` — comma-separated CORS origins
  - `TEM_REGION` — `fr-par` (TEM API region)
- **Secret environment variables:**
  - `TEM_SECRET_KEY` — API key for TEM
  - `TEM_PROJECT_ID` — auto-filled from project resource
  - `MAIL_RECIPIENT` — destination email

### Transactional Email (TEM)

- **Region:** `fr-par`
- **Sender domain:** `contact.sebastian-heitmann.dev`
- **Project scope:** Managed in the same `sebastian-heitmann-dev` Scaleway project as the function
- **DNS:** SPF, DKIM, DMARC, and MX records are published in external DNS using Terraform outputs

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
| `allowed_origins` | `https://www.sebastian-heitmann.dev,https://sebastian-heitmann.dev` | No | Comma-separated CORS allowed origins |

## Outputs

| Output | Description |
|--------|-------------|
| `cdn_endpoint` | Edge Services endpoint URL |
| `function_endpoint` | Mail function public URL |
| `bucket_endpoint` | Object Storage bucket URL |

## Deployment Flow

Order matters: the function must be deployed before the website is built, because the website bakes in the function endpoint at build time via `PUBLIC_MAIL_ENDPOINT`.

1. Copy `infra/terraform.tfvars.example` to `infra/terraform.tfvars` and fill in real values
2. Apply infra via `./scripts/apply-infra.sh`
3. Deploy website via `./scripts/deploy-website.sh`

## Environment Strategy

- `infra/terraform.tfvars` owns infrastructure configuration
- `apps/mail-service/.env` is for local mail-service development only
- `apps/website/.env` is for local website development only
- Production `PUBLIC_MAIL_ENDPOINT` is derived from Terraform output during website deployment

## Out of Scope (for now)

- DNS management (stays on GoDaddy)
- Custom domain attachment on CDN (done via Scaleway console)
- CI/CD pipeline
