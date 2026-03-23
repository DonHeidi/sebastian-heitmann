resource "scaleway_function_namespace" "mail" {
  name        = "mail-service"
  description = "Contact form mail service"
  project_id  = scaleway_account_project.main.id
}

resource "scaleway_function" "contact_handler" {
  namespace_id = scaleway_function_namespace.mail.id
  name         = "contact-handler"
  runtime      = "node22"
  handler      = "handler.handle"
  privacy      = "public"
  min_scale    = 0
  max_scale    = 5
  timeout      = 30
  memory_limit = 256
  zip_file     = "${path.module}/../apps/mail-service/dist/handler.zip"
  zip_hash     = filesha256("${path.module}/../apps/mail-service/dist/handler.zip")

  environment_variables = {
    MAIL_SENDER    = var.mail_sender
    ALLOWED_ORIGIN = var.allowed_origin
    SCW_REGION     = var.tem_region
  }

  secret_environment_variables = {
    SCW_SECRET_KEY = sensitive(scaleway_account_project.main.id != "" ? var.scw_secret_key : "")
    SCW_PROJECT_ID = scaleway_account_project.main.id
    MAIL_RECIPIENT = var.mail_recipient
  }

  deploy = true
}
