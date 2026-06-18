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

variable "tem_domain" {
  description = "Transactional Email sender domain managed in the Scaleway project"
  type        = string
  default     = "contact.sebastian-heitmann.dev"

  validation {
    condition     = can(regex("^[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$", var.tem_domain))
    error_message = "tem_domain must be a valid DNS domain name."
  }
}

variable "mail_recipient" {
  description = "Email address to receive contact form messages"
  type        = string
  sensitive   = true
}

variable "mail_sender" {
  description = "Verified sender email address in Scaleway TEM"
  type        = string
  default     = "contact@contact.sebastian-heitmann.dev"

  validation {
    condition     = can(regex("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$", var.mail_sender)) && endswith(var.mail_sender, "@${var.tem_domain}")
    error_message = "mail_sender must be a valid email address within tem_domain."
  }
}

variable "allowed_origins" {
  description = "Comma-separated CORS allowed origins for the mail function"
  type        = string
  default     = "https://www.sebastian-heitmann.dev,https://sebastian-heitmann.dev"

  validation {
    condition = alltrue([
      for origin in split(",", var.allowed_origins) :
      startswith(trimspace(origin), "http://") || startswith(trimspace(origin), "https://")
    ])
    error_message = "allowed_origins must be a comma-separated list of http(s) origins."
  }
}
