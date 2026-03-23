resource "scaleway_edge_services_plan" "main" {
  name       = "starter"
  project_id = scaleway_account_project.main.id
}

resource "scaleway_edge_services_pipeline" "website" {
  name        = "sebastian-heitmann-website"
  description = "CDN for sebastian-heitmann.dev static website"
  project_id  = scaleway_account_project.main.id

  depends_on = [scaleway_edge_services_plan.main]
}

resource "scaleway_edge_services_backend_stage" "website" {
  pipeline_id = scaleway_edge_services_pipeline.website.id

  s3_backend_config {
    bucket_name   = scaleway_object_bucket.website.name
    bucket_region = var.region
    is_website    = true
  }
}

resource "scaleway_edge_services_cache_stage" "website" {
  pipeline_id      = scaleway_edge_services_pipeline.website.id
  backend_stage_id = scaleway_edge_services_backend_stage.website.id
}

resource "scaleway_edge_services_tls_stage" "website" {
  pipeline_id         = scaleway_edge_services_pipeline.website.id
  cache_stage_id      = scaleway_edge_services_cache_stage.website.id
  managed_certificate = true
}

resource "scaleway_edge_services_dns_stage" "website" {
  pipeline_id  = scaleway_edge_services_pipeline.website.id
  tls_stage_id = scaleway_edge_services_tls_stage.website.id
  fqdns        = ["www.sebastian-heitmann.dev"]
}

resource "scaleway_edge_services_head_stage" "website" {
  pipeline_id   = scaleway_edge_services_pipeline.website.id
  head_stage_id = scaleway_edge_services_dns_stage.website.id
}
