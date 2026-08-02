# Apex → www redirect function. Edge Services refuses bare-apex hostnames, but a
# Serverless Function CAN take an apex custom domain (via an ALIAS record + managed
# cert), so this holds the apex cert and 301s every request — path and query
# preserved — to https://www.<domain>. Same pattern as job-directory.eu.

resource "scaleway_function_namespace" "redirect" {
  name        = "apex-redirect"
  description = "Apex domain redirect to www"
  project_id  = scaleway_account_project.main.id
}

resource "scaleway_function" "apex_redirect" {
  namespace_id = scaleway_function_namespace.redirect.id
  name         = "apex-redirect"
  runtime      = "node22"
  handler      = "handler.handle"
  privacy      = "public"
  http_option  = "enabled"
  min_scale    = 0
  max_scale    = 2
  timeout      = 10
  memory_limit = 128
  zip_file     = "${path.module}/../apps/apex-redirect/dist/handler.zip"
  zip_hash     = fileexists("${path.module}/../apps/apex-redirect/dist/handler.zip") ? filesha256("${path.module}/../apps/apex-redirect/dist/handler.zip") : null
  deploy       = true

  environment_variables = {
    REDIRECT_TARGET = "https://www.${var.domain}"
  }
}

# Bind the apex custom domain to the redirect function → Scaleway provisions a
# managed Let's Encrypt cert for it. Gated behind var.bind_apex_domain because
# cert issuance needs the apex to actually resolve to the function, which only
# happens AFTER the nameserver cutover to Scaleway DNS (see the runbook in
# docs/runbooks/2026-08-02-apex-dns-cutover.md). Flip the variable default to
# true and re-apply once NS delegation is live.
resource "scaleway_function_domain" "apex" {
  count = var.bind_apex_domain ? 1 : 0

  function_id = scaleway_function.apex_redirect.id
  hostname    = var.domain

  depends_on = [scaleway_domain_record.apex]
}
