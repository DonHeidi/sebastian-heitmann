# DNS zone for sebastian-heitmann.dev, hosted at Scaleway Domains and DNS.
#
# The domain stays REGISTERED at GoDaddy (Scaleway doesn't sell .dev); only DNS
# hosting moves here, via external-domain onboarding + NS delegation to
# ns0/ns1.dom.scw.cloud. The zone itself is NOT terraformable
# (scaleway_domain_zone only creates sub-zones) — it was registered once via
# `POST /domain/v2beta1/external-domains` on 2026-08-02; this file manages every
# record in it. Cutover procedure + rollback:
# docs/runbooks/2026-08-02-apex-dns-cutover.md
#
# The record set below is a faithful recreation of the GoDaddy zone (authoritative
# export 2026-08-02, archived at docs/runbooks/2026-08-02-godaddy-zone-export.txt;
# mail is on Microsoft 365 — do NOT drop the MX/SPF/verification records:
# me@sebastian-heitmann.dev is a live address), plus the apex ALIAS that is the
# point of the migration. Deliberately NOT recreated:
#   - the apex A records (15.197.225.128 / 3.33.251.168) — GoDaddy's forwarding
#     ALB, replaced by the apex ALIAS below
#   - _domainconnect CNAME — GoDaddy Domain Connect discovery, meaningless once
#     the zone leaves GoDaddy DNS
#   - core CNAME → core.sebastian-heitmann.dev — a self-referential loop that
#     resolves to nothing (broken leftover)

# --- Apex + www -----------------------------------------------------------------

# Apex → the redirect function, which holds the apex's managed cert and 301s to
# www. A CNAME can't exist at a zone apex and Edge Services can't take a bare
# apex, but a function can via an ALIAS (apex flattening) to its domain_name.
resource "scaleway_domain_record" "apex" {
  dns_zone = var.domain
  name     = ""
  type     = "ALIAS"
  data     = "${scaleway_function.apex_redirect.domain_name}."
  ttl      = 300
}

# www → Edge Services. The edge endpoint is deterministic from the pipeline id:
# <pipeline-id>.svc.edge.scw.cloud. Matches the record currently at GoDaddy.
resource "scaleway_domain_record" "www" {
  dns_zone = var.domain
  name     = "www"
  type     = "CNAME"
  data     = "${scaleway_edge_services_pipeline.website.id}.svc.edge.scw.cloud."
  ttl      = 300
}

# Scaleway external-domain ownership challenge. Must also exist at GoDaddy DNS
# during onboarding; kept in the zone because Scaleway re-checks it periodically.
resource "scaleway_domain_record" "scaleway_challenge" {
  dns_zone = var.domain
  name     = "_scaleway-challenge"
  type     = "TXT"
  data     = "e2724349-3400-481f-886f-2d5d4866544c"
  ttl      = 600
}

# --- Mail: Microsoft 365 (me@sebastian-heitmann.dev) ------------------------------

resource "scaleway_domain_record" "mx" {
  dns_zone = var.domain
  name     = ""
  type     = "MX"
  data     = "sebastianheitmann-dev02c.mail.protection.outlook.com."
  priority = 0
  ttl      = 3600
}

resource "scaleway_domain_record" "spf" {
  dns_zone = var.domain
  name     = ""
  type     = "TXT"
  data     = "v=spf1 include:secureserver.net -all"
  ttl      = 3600
}

resource "scaleway_domain_record" "ms_verification" {
  for_each = toset([
    "NETORGFT9959061.onmicrosoft.com",
    "NETORGFT9253916.onmicrosoft.com",
  ])

  dns_zone = var.domain
  name     = ""
  type     = "TXT"
  data     = each.value
  ttl      = 3600
}

resource "scaleway_domain_record" "autodiscover" {
  dns_zone = var.domain
  name     = "autodiscover"
  type     = "CNAME"
  data     = "autodiscover.outlook.com."
  ttl      = 3600
}

resource "scaleway_domain_record" "sip" {
  dns_zone = var.domain
  name     = "sip"
  type     = "CNAME"
  data     = "sipdir.online.lync.com."
  ttl      = 3600
}

resource "scaleway_domain_record" "lyncdiscover" {
  dns_zone = var.domain
  name     = "lyncdiscover"
  type     = "CNAME"
  data     = "webdir.online.lync.com."
  ttl      = 3600
}

# DMARC policy for the root domain (new post-cutover, not in the GoDaddy zone).
# p=none changes nothing about delivery yet: it only asks receivers to send
# aggregate reports to the mailbox, so legitimate mail flows can be confirmed
# before tightening to p=quarantine / p=reject. Tighten only after M365 DKIM
# (m365_dkim_cnames) is enabled and the reports look clean for a few weeks.
resource "scaleway_domain_record" "dmarc" {
  dns_zone = var.domain
  name     = "_dmarc"
  type     = "TXT"
  data     = "v=DMARC1; p=none; rua=mailto:${var.mail_recipient}"
  ttl      = 3600
}

# Microsoft 365 DKIM signing for the root domain. Created only once the
# tenant-specific targets are filled in (see variables.tf) — M365 must have
# DKIM enabled first or the CNAMEs point at nothing.
resource "scaleway_domain_record" "m365_dkim" {
  for_each = var.m365_dkim_cnames

  dns_zone = var.domain
  name     = "${each.key}._domainkey"
  type     = "CNAME"
  data     = "${trimsuffix(each.value, ".")}."
  ttl      = 3600
}

# Legacy Microsoft 365 sign-in helper (pre-2020 tenants; harmless to keep).
resource "scaleway_domain_record" "msoid" {
  dns_zone = var.domain
  name     = "msoid"
  type     = "CNAME"
  data     = "clientconfig.microsoftonline-p.net."
  ttl      = 3600
}

# Skype for Business / Teams federation. Scaleway SRV data is the full
# "<priority> <weight> <port> <target>" string (the runbook's pre-delegation
# check verifies these come back correctly from ns0.dom.scw.cloud).
resource "scaleway_domain_record" "sip_tls_srv" {
  dns_zone = var.domain
  name     = "_sip._tls"
  type     = "SRV"
  data     = "100 1 443 sipdir.online.lync.com."
  ttl      = 3600
}

resource "scaleway_domain_record" "sipfederation_srv" {
  dns_zone = var.domain
  name     = "_sipfederationtls._tcp"
  type     = "SRV"
  data     = "100 1 5061 sipfed.online.lync.com."
  ttl      = 3600
}

# GoDaddy-hosted webmail entry point (email.<domain> → webmail login). Mail runs
# on Microsoft 365 sold through GoDaddy, so this stays valid after the NS move.
resource "scaleway_domain_record" "email" {
  dns_zone = var.domain
  name     = "email"
  type     = "CNAME"
  data     = "email.secureserver.net."
  ttl      = 3600
}

# --- Misc verification ------------------------------------------------------------

resource "scaleway_domain_record" "google_site_verification" {
  dns_zone = var.domain
  name     = ""
  type     = "TXT"
  data     = "google-site-verification=m-jIF1hAu_xIehyXmlrKne0iDKkVH_KNOOfzwroiiWY"
  ttl      = 3600
}

# --- Transactional Email (contact.<domain>, the contact-form sender) --------------
# These mirror what scaleway_tem_domain.mail expects (see the tem_dns_* outputs).
# DKIM/DMARC reference the TEM resource directly — the key material lives there;
# SPF/MX are the fixed TEM values as published at GoDaddy today.

resource "scaleway_domain_record" "tem_mx" {
  dns_zone = var.domain
  name     = "contact"
  type     = "MX"
  data     = "blackhole.tem.scaleway.com."
  priority = 10
  ttl      = 3600
}

resource "scaleway_domain_record" "tem_spf" {
  dns_zone = var.domain
  name     = "contact"
  type     = "TXT"
  data     = "v=spf1 include:_spf.tem.scaleway.com -all"
  ttl      = 3600
}

resource "scaleway_domain_record" "tem_dkim" {
  dns_zone = var.domain
  # dkim_name is absolute with a trailing dot; record names are zone-relative
  name = trimsuffix(trimsuffix(scaleway_tem_domain.mail.dkim_name, "."), ".${var.domain}")
  type = "TXT"
  data = scaleway_tem_domain.mail.dkim_config
  ttl  = 3600
}

resource "scaleway_domain_record" "tem_dmarc" {
  dns_zone = var.domain
  # dmarc_name is absolute with a trailing dot; record names are zone-relative
  name = trimsuffix(trimsuffix(scaleway_tem_domain.mail.dmarc_name, "."), ".${var.domain}")
  type = "TXT"
  data = scaleway_tem_domain.mail.dmarc_config
  ttl  = 3600
}
