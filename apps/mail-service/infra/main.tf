terraform {
  required_providers {
    scaleway = {
      source  = "scaleway/scaleway"
      version = "~> 2.0"
    }
  }

  required_version = ">= 1.0"
}

provider "scaleway" {
  region = var.region
  zone   = "${var.region}-1"
}

variable "region" {
  description = "Scaleway region"
  type        = string
  default     = "nl-ams"
}

variable "mail_recipient" {
  description = "Email address to receive contact form messages"
  type        = string
  sensitive   = true
}

variable "mail_sender" {
  description = "Verified sender email address"
  type        = string
}

variable "allowed_origin" {
  description = "CORS allowed origin"
  type        = string
  default     = "https://sebastian-heitmann.dev"
}

resource "scaleway_function_namespace" "mail" {
  name        = "mail-service"
  description = "Contact form mail service"
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

  environment_variables = {
    MAIL_SENDER    = var.mail_sender
    ALLOWED_ORIGIN = var.allowed_origin
    SCW_REGION     = var.region
  }

  secret_environment_variables = {
    SCW_SECRET_KEY = sensitive(data.scaleway_account_project.current.id != "" ? var.scw_secret_key : "")
    SCW_PROJECT_ID = data.scaleway_account_project.current.id
    MAIL_RECIPIENT = var.mail_recipient
  }

  deploy = true
}

variable "scw_secret_key" {
  description = "Scaleway API secret key for the function to call Transactional Email API"
  type        = string
  sensitive   = true
}

data "scaleway_account_project" "current" {}

output "function_endpoint" {
  description = "The public URL of the contact handler function"
  value       = scaleway_function.contact_handler.domain_name
}
