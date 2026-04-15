# Scaleway Infrastructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move Terraform config to a shared `infra/` directory and add Object Storage + Edge Services for static website hosting alongside the existing mail service function.

**Architecture:** Single Scaleway project containing an Object Storage bucket (website hosting), Edge Services pipeline (CDN), and a serverless function (contact form handler). The function deploys first so its endpoint can be baked into the website build.

**Tech Stack:** Terraform (Scaleway provider ~> 2.0), Scaleway Object Storage, Scaleway Edge Services, Scaleway Serverless Functions

**Spec:** `docs/superpowers/specs/2026-03-23-scaleway-infrastructure-design.md`

---

## File Structure

```
infra/
├── main.tf                    # terraform block, provider, project resource
├── variables.tf               # all input variables
├── function.tf                # function namespace + function (from existing config)
├── storage.tf                 # object bucket + website configuration
├── cdn.tf                     # edge services plan, pipeline, backend, cache, head stage
├── outputs.tf                 # cdn_endpoint, function_endpoint, bucket_endpoint
├── terraform.tfvars.example   # example values
└── .gitignore                 # terraform state, tfvars, .terraform/
```

Old `apps/mail-service/infra/` will be removed after migration.

---

### Task 1: Create `infra/main.tf` — provider and project

**Files:**
- Create: `infra/main.tf`

- [ ] **Step 1: Create `infra/main.tf`**

```hcl
terraform {
  required_providers {
    scaleway = {
      source  = "scaleway/scaleway"
      version = "~> 2.0"
    }
  }

  required_version = ">= 1.0"
}

provider "scaleway" {
  region = var.region
  zone   = "${var.region}-1"
}

resource "scaleway_account_project" "main" {
  name        = "sebastian-heitmann-dev"
  description = "Personal portfolio website and supporting services"
}
```

- [ ] **Step 2: Commit**

```bash
git add infra/main.tf
git commit -m "feat(infra): add main.tf with provider and project resource"
```

---

### Task 2: Create `infra/variables.tf` — all input variables

**Files:**
- Create: `infra/variables.tf`

- [ ] **Step 1: Create `infra/variables.tf`**

```hcl
variable "region" {
  description = "Primary Scaleway region for resource deployment"
  type        = string
  default     = "nl-ams"
}

variable "tem_region" {
  description = "Scaleway region for Transactional Email API (only available in fr-par)"
  type        = string
  default     = "fr-par"
}

variable "mail_recipient" {
  description = "Email address to receive contact form messages"
  type        = string
  sensitive   = true
}

variable "mail_sender" {
  description = "Verified sender email address in Scaleway TEM"
  type        = string
}

variable "allowed_origins" {
  description = "Comma-separated CORS allowed origins for the mail function"
  type        = string
  default     = "https://www.sebastian-heitmann.dev,https://sebastian-heitmann.dev"
}
```

- [ ] **Step 2: Commit**

```bash
git add infra/variables.tf
git commit -m "feat(infra): add variables.tf with all input variables"
```

---

### Task 3: Create `infra/function.tf` — mail service function

**Files:**
- Create: `infra/function.tf`

Migrated from `apps/mail-service/infra/main.tf`. Key change: `zip_file` path updated from `${path.module}/../dist/handler.zip` to `${path.module}/../apps/mail-service/dist/handler.zip` since infra/ is now at repo root.

- [ ] **Step 1: Create `infra/function.tf`**

```hcl
resource "scaleway_function_namespace" "mail" {
  name        = "mail-service"
  description = "Contact form mail service"
  project_id  = scaleway_account_project.main.id
}

resource "scaleway_function" "contact_handler" {
  namespace_id = scaleway_function_namespace.mail.id
  name         = "contact-handler"
  runtime      = "node22"
  handler      = "handler.handle"
  privacy      = "public"
  min_scale    = 0
  max_scale    = 5
  timeout      = 30
  memory_limit = 256
  zip_file     = "${path.module}/../apps/mail-service/dist/handler.zip"
  zip_hash     = filesha256("${path.module}/../apps/mail-service/dist/handler.zip")

  environment_variables = {
    MAIL_SENDER     = var.mail_sender
    ALLOWED_ORIGINS = var.allowed_origins
    TEM_REGION      = var.tem_region
  }

  secret_environment_variables = {
    TEM_SECRET_KEY = scaleway_iam_api_key.mail_service.secret_key
    TEM_PROJECT_ID = scaleway_account_project.main.id
    MAIL_RECIPIENT = var.mail_recipient
  }

  deploy = true
}
```

- [ ] **Step 2: Commit**

```bash
git add infra/function.tf
git commit -m "feat(infra): add function.tf for mail service (migrated from apps/mail-service/infra)"
```

---

### Task 4: Create `infra/storage.tf` — object storage bucket

**Files:**
- Create: `infra/storage.tf`

- [ ] **Step 1: Create `infra/storage.tf`**

```hcl
resource "scaleway_object_bucket" "website" {
  name       = "sebastian-heitmann-website"
  project_id = scaleway_account_project.main.id
  acl        = "public-read"
}

resource "scaleway_object_bucket_website_configuration" "website" {
  bucket = scaleway_object_bucket.website.name

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "404.html"
  }
}
```

Note: uploaded objects still default to private on Scaleway Object Storage, so the deployment step must set object ACLs to `public-read` or use an equivalent bucket policy.

- [ ] **Step 2: Commit**

```bash
git add infra/storage.tf
git commit -m "feat(infra): add storage.tf for website object storage bucket"
```

---

### Task 5: Create `infra/cdn.tf` — Edge Services pipeline

**Files:**
- Create: `infra/cdn.tf`

Minimal pipeline: backend (S3) → cache → head stage. Custom domain (DNS/TLS stages) will be configured via Scaleway console.

- [ ] **Step 1: Create `infra/cdn.tf`**

```hcl
resource "scaleway_edge_services_pipeline" "website" {
  name        = "sebastian-heitmann-website"
  description = "CDN for sebastian-heitmann.dev static website"
  project_id  = scaleway_account_project.main.id
}

resource "scaleway_edge_services_backend_stage" "website" {
  pipeline_id = scaleway_edge_services_pipeline.website.id

  s3_backend_config {
    bucket_name   = scaleway_object_bucket.website.name
    bucket_region = var.region
  }
}

resource "scaleway_edge_services_cache_stage" "website" {
  pipeline_id      = scaleway_edge_services_pipeline.website.id
  backend_stage_id = scaleway_edge_services_backend_stage.website.id
}

resource "scaleway_edge_services_head_stage" "website" {
  pipeline_id   = scaleway_edge_services_pipeline.website.id
  head_stage_id = scaleway_edge_services_cache_stage.website.id
}
```

- [ ] **Step 2: Commit**

```bash
git add infra/cdn.tf
git commit -m "feat(infra): add cdn.tf with Edge Services pipeline"
```

---

### Task 6: Create `infra/outputs.tf`

**Files:**
- Create: `infra/outputs.tf`

- [ ] **Step 1: Create `infra/outputs.tf`**

```hcl
output "function_endpoint" {
  description = "Public URL of the contact handler function"
  value       = scaleway_function.contact_handler.domain_name
}

output "bucket_endpoint" {
  description = "Object Storage website endpoint"
  value       = scaleway_object_bucket_website_configuration.website.website_endpoint
}

output "cdn_endpoint" {
  description = "Edge Services pipeline endpoint"
  value       = scaleway_edge_services_pipeline.website.dns_stage_url
}
```

- [ ] **Step 2: Commit**

```bash
git add infra/outputs.tf
git commit -m "feat(infra): add outputs.tf with endpoint URLs"
```

---

### Task 7: Create `infra/terraform.tfvars.example` and `infra/.gitignore`

**Files:**
- Create: `infra/terraform.tfvars.example`
- Create: `infra/.gitignore`

- [ ] **Step 1: Create `infra/terraform.tfvars.example`**

```hcl
region         = "nl-ams"
tem_domain     = "contact.sebastian-heitmann.dev"
mail_recipient = "you@example.com"
mail_sender    = "contact@contact.sebastian-heitmann.dev"
allowed_origins = "https://www.sebastian-heitmann.dev,https://sebastian-heitmann.dev"
```

- [ ] **Step 2: Create `infra/.gitignore`**

```
.terraform/
*.tfstate
*.tfstate.backup
terraform.tfvars
.terraform.lock.hcl
```

- [ ] **Step 3: Commit**

```bash
git add infra/terraform.tfvars.example infra/.gitignore
git commit -m "feat(infra): add tfvars example and gitignore"
```

---

### Task 8: Validate Terraform configuration

**Files:**
- None (validation only)

- [ ] **Step 1: Build mail handler (needed for `filesha256` in function.tf)**

Run: `cd apps/mail-service && bun run build`
Expected: `dist/handler.zip` created

- [ ] **Step 2: Initialize Terraform**

Run: `cd infra && terraform init`
Expected: Provider downloaded, "Terraform has been successfully initialized"

- [ ] **Step 3: Validate configuration**

Run: `cd infra && terraform validate`
Expected: "Success! The configuration is valid."

If validation fails, fix errors and re-validate before proceeding.

- [ ] **Step 4: Dry-run with plan**

Run: `cd infra && terraform plan -var-file=terraform.tfvars`

Note: requires a `terraform.tfvars` with real values. Verify the plan shows creation of:
- 1 project
- 1 function namespace + 1 function
- 1 object bucket + 1 website configuration
- 1 edge services pipeline + 1 backend stage + 1 cache stage + 1 head stage

---

### Task 9: Remove old `apps/mail-service/infra/`

**Files:**
- Delete: `apps/mail-service/infra/main.tf`
- Delete: `apps/mail-service/infra/terraform.tfvars.example`

- [ ] **Step 1: Remove old infra directory**

```bash
rm -rf apps/mail-service/infra
```

- [ ] **Step 2: Commit**

```bash
git add -A apps/mail-service/infra
git commit -m "refactor(infra): remove old mail-service infra (moved to infra/)"
```
