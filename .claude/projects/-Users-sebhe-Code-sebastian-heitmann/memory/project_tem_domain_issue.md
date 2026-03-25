---
name: TEM domain verification is project-scoped
description: contact.sebastian-heitmann.dev is verified in the old default project, not the new sebastian-heitmann-dev project — contact form returns 502 until domain is re-verified
type: project
---

TEM domain `contact.sebastian-heitmann.dev` is verified in the default project (`707eef75-...`), but the mail function sends with `project_id` of the new project (`e4c697f5-...`). TEM domain verification is project-scoped, not account-scoped.

**Why:** The function's Terraform-managed API key and project ID point to `sebastian-heitmann-dev`, but the domain DNS records (SPF, DKIM, DMARC) were set up for the old project.

**How to apply:** To fix, re-verify `contact.sebastian-heitmann.dev` in the `sebastian-heitmann-dev` project via Scaleway console, then update DNS records on GoDaddy. Contact form will return 502 until this is done.
