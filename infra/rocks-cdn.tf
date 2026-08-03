resource "scaleway_edge_services_pipeline" "rocks" {
  name        = "sebastian-heitmann-rocks"
  description = "CDN for sebastian-heitmann.rocks static website"
  project_id  = scaleway_account_project.main.id

  depends_on = [scaleway_edge_services_plan.main]
}

resource "scaleway_edge_services_backend_stage" "rocks" {
  pipeline_id = scaleway_edge_services_pipeline.rocks.id

  s3_backend_config {
    bucket_name   = scaleway_object_bucket.rocks.name
    bucket_region = var.region
    is_website    = true
  }
}

resource "scaleway_edge_services_cache_stage" "rocks" {
  pipeline_id      = scaleway_edge_services_pipeline.rocks.id
  backend_stage_id = scaleway_edge_services_backend_stage.rocks.id
}

resource "scaleway_edge_services_tls_stage" "rocks" {
  pipeline_id         = scaleway_edge_services_pipeline.rocks.id
  cache_stage_id      = scaleway_edge_services_cache_stage.rocks.id
  managed_certificate = true
}

resource "scaleway_edge_services_dns_stage" "rocks" {
  pipeline_id  = scaleway_edge_services_pipeline.rocks.id
  tls_stage_id = scaleway_edge_services_tls_stage.rocks.id
  fqdns        = ["www.${var.rocks_domain}"]
}

resource "scaleway_edge_services_head_stage" "rocks" {
  pipeline_id   = scaleway_edge_services_pipeline.rocks.id
  head_stage_id = scaleway_edge_services_dns_stage.rocks.id
}
