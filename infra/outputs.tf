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
