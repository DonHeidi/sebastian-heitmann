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

variable "domain" {
  description = "Root domain of the website. Registered at GoDaddy; DNS hosted at Scaleway (see infra/dns.tf)"
  type        = string
  default     = "sebastian-heitmann.dev"
}

variable "bind_apex_domain" {
  description = "Bind the apex hostname to the redirect function (provisions its managed cert). Was false during the DNS cutover — cert issuance needs the apex resolving to the function first, which required the NS delegation to Scaleway to be live. See docs/runbooks/2026-08-02-apex-dns-cutover.md"
  type        = bool
  default     = true
}

variable "m365_dkim_cnames" {
  description = <<-EOT
    Microsoft 365 DKIM CNAME targets for the root domain, keyed by selector
    (selector1/selector2). The targets are tenant-specific: enable DKIM for
    sebastian-heitmann.dev in the Defender portal (security.microsoft.com →
    Email & collaboration → Policies & rules → Threat policies → Email
    authentication settings → DKIM), copy the two CNAME values it shows, and
    commit them here as the default (repo convention: committed defaults, no
    tfvars). Empty map = records not created (DKIM not yet enabled in M365).
    Example:
      { selector1 = "selector1-sebastian-heitmann-dev._domainkey.<tenant>.onmicrosoft.com"
        selector2 = "selector2-sebastian-heitmann-dev._domainkey.<tenant>.onmicrosoft.com" }
  EOT
  type        = map(string)
  default     = {}

  validation {
    condition     = alltrue([for k, v in var.m365_dkim_cnames : contains(["selector1", "selector2"], k)])
    error_message = "m365_dkim_cnames keys must be selector1 and/or selector2."
  }
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
