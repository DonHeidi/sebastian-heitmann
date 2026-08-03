# Apex → www redirect for the .rocks portfolio, reusing the same handler zip and
# function namespace as the .dev apex redirect (the handler is generic: it 301s
# every request to REDIRECT_TARGET with path and query preserved).

resource "scaleway_function" "apex_redirect_rocks" {
  namespace_id = scaleway_function_namespace.redirect.id
  name         = "apex-redirect-rocks"
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
    REDIRECT_TARGET = "https://www.${var.rocks_domain}"
  }
}

# Gated like the .dev apex binding: cert issuance needs the apex resolving to
# the function, which only happens after the .rocks NS delegation to Scaleway.
resource "scaleway_function_domain" "rocks_apex" {
  count = var.bind_rocks_apex_domain ? 1 : 0

  function_id = scaleway_function.apex_redirect_rocks.id
  hostname    = var.rocks_domain

  depends_on = [scaleway_domain_record.rocks_apex]
}
