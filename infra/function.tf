resource "scaleway_iam_application" "mail_service" {
  name        = "mail-service"
  description = "Service identity for the contact form mail function"
}

resource "scaleway_iam_policy" "mail_service" {
  name           = "mail-service-tem-access"
  description    = "Allows the mail service to send emails via TEM API"
  application_id = scaleway_iam_application.mail_service.id

  rule {
    project_ids          = [scaleway_account_project.main.id]
    permission_set_names = ["TransactionalEmailEmailApiCreate"]
  }
}

resource "scaleway_iam_api_key" "mail_service" {
  application_id = scaleway_iam_application.mail_service.id
  description    = "API key for mail service to call TEM API"
  expires_at     = "2027-03-23T00:00:00Z"
}

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
    MAIL_SENDER     = var.mail_sender
    ALLOWED_ORIGINS = var.allowed_origins
    TEM_REGION      = var.tem_region
  }

  secret_environment_variables = {
    TEM_SECRET_KEY = scaleway_iam_api_key.mail_service.secret_key
    TEM_PROJECT_ID = scaleway_account_project.main.id
    MAIL_RECIPIENT = var.mail_recipient
  }

  deploy = true
}
