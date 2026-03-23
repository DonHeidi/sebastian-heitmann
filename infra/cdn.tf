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
