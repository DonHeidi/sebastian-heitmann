variable "region" {
  description = "Primary Scaleway region for resource deployment"
  type        = string
  default     = "nl-ams"
}

variable "tem_region" {
  description = "Scaleway region for Transactional Email API (only available in fr-par)"
  type        = string
  default     = "fr-par"
}

variable "mail_recipient" {
  description = "Email address to receive contact form messages"
  type        = string
  sensitive   = true
}

variable "mail_sender" {
  description = "Verified sender email address in Scaleway TEM"
  type        = string
}

variable "allowed_origins" {
  description = "Comma-separated CORS allowed origins for the mail function"
  type        = string
  default     = "https://www.sebastian-heitmann.dev,https://sebastian-heitmann.dev"
}
