output "function_endpoint" {
  description = "Public URL of the contact handler function"
  value       = scaleway_function.contact_handler.domain_name
}

output "bucket_endpoint" {
  description = "Object Storage website endpoint"
  value       = scaleway_object_bucket_website_configuration.website.website_endpoint
}

output "cdn_pipeline_id" {
  description = "Edge Services pipeline ID (configure custom domain via Scaleway console)"
  value       = scaleway_edge_services_pipeline.website.id
}
