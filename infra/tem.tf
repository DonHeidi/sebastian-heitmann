resource "scaleway_tem_domain" "mail" {
  name       = var.tem_domain
  project_id = scaleway_account_project.main.id
  region     = var.tem_region
  accept_tos = true
  autoconfig = false
}
