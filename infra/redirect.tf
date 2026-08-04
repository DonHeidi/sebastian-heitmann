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
  # Cold starts are mitigated by the keep-warm cron below, NOT by min_scale:
  # provisioned (min_scale > 0) time bills outside the free tier, at a rate
  # Scaleway's own sources disagree on (€1.62–€5.51/month for one warm 128 MB
  # instance as of 2026-08), while cron self-invocations land in the
  # always-free request/execution tiers.
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

# Keep-warm self-ping: invoke the redirect every 5 minutes so an instance stays
# resident and the SEO-facing apex 301 (direct type-ins, backlinks to the bare
# domain, crawlers following them) rarely pays a cold start. Best-effort, not a
# guarantee — instances can still recycle after deploys; the paid alternative
# is min_scale = 1 (see comment above). ~8.6k invocations/month against the
# 1M-request free tier: effectively free. The handler is defensive about
# non-HTTP events (cron args have no path/query), so the ping is a harmless
# no-op that returns the 301 object to nobody.
resource "scaleway_function_cron" "apex_keepwarm" {
  name        = "apex-keepwarm"
  function_id = scaleway_function.apex_redirect.id
  schedule    = "*/5 * * * *"
  args        = jsonencode({ keepwarm = true })
}

# Bind the apex custom domain to the redirect function → Scaleway provisions a
# managed Let's Encrypt cert for it. Gated behind var.bind_apex_domain because
# cert issuance needs the apex to actually resolve to the function, which only
# became true AFTER the nameserver cutover to Scaleway DNS (see the runbook in
# docs/runbooks/2026-08-02-apex-dns-cutover.md). The default has been true
# since the delegation went live; the gate stays for future re-bootstraps.
resource "scaleway_function_domain" "apex" {
  count = var.bind_apex_domain ? 1 : 0

  function_id = scaleway_function.apex_redirect.id
  hostname    = var.domain

  depends_on = [scaleway_domain_record.apex]
}
