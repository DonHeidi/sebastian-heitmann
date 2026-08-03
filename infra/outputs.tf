output "project_id" {
  description = "Scaleway project ID containing all managed resources (used for AWS_ACCESS_KEY@PROJECT_ID auth on the state bucket)"
  value       = scaleway_account_project.main.id
}

output "function_endpoint" {
  description = "Public URL of the contact handler function"
  value       = scaleway_function.contact_handler.domain_name
}

output "apex_redirect_endpoint" {
  description = "Native URL of the apex → www redirect function (the apex ALIAS record targets this host)"
  value       = scaleway_function.apex_redirect.domain_name
}

output "bucket_endpoint" {
  description = "Object Storage website endpoint"
  value       = scaleway_object_bucket_website_configuration.website.website_endpoint
}

output "cdn_pipeline_id" {
  description = "Edge Services pipeline ID (configure custom domain via Scaleway console)"
  value       = scaleway_edge_services_pipeline.website.id
}

output "tem_domain_id" {
  description = "Transactional Email domain ID in the Scaleway project"
  value       = scaleway_tem_domain.mail.id
}

output "tem_domain_name" {
  description = "Transactional Email domain name"
  value       = scaleway_tem_domain.mail.name
}

output "tem_dns_spf_value" {
  description = "SPF TXT value to publish for the TEM domain"
  value       = scaleway_tem_domain.mail.spf_value
}

output "tem_dns_dkim_name" {
  description = "DKIM TXT record name to publish for the TEM domain"
  value       = scaleway_tem_domain.mail.dkim_name
}

output "tem_dns_dkim_value" {
  description = "DKIM TXT value to publish for the TEM domain"
  value       = scaleway_tem_domain.mail.dkim_config
}

output "tem_dns_dmarc_name" {
  description = "DMARC TXT record name to publish for the TEM domain"
  value       = scaleway_tem_domain.mail.dmarc_name
}

output "tem_dns_dmarc_value" {
  description = "DMARC TXT value to publish for the TEM domain"
  value       = scaleway_tem_domain.mail.dmarc_config
}

output "tem_dns_mx_value" {
  description = "MX record value to publish for the TEM domain blackhole"
  value       = scaleway_tem_domain.mail.mx_config
}

output "rocks_cdn_pipeline_id" {
  description = "Edge Services pipeline ID for the .rocks site"
  value       = scaleway_edge_services_pipeline.rocks.id
}

output "rocks_bucket_endpoint" {
  description = "Object Storage website endpoint for the .rocks bucket"
  value       = scaleway_object_bucket_website_configuration.rocks.website_endpoint
}

output "rocks_apex_redirect_endpoint" {
  description = "Native URL of the .rocks apex → www redirect function (the apex ALIAS record targets this host)"
  value       = scaleway_function.apex_redirect_rocks.domain_name
}
