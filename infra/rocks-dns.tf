# DNS zone for sebastian-heitmann.rocks, hosted at Scaleway Domains and DNS.
# Registration stays at GoDaddy; the zone was onboarded via
# POST /domain/v2beta1/external-domains (manual, not terraformable) — see the
# rocks DNS onboarding runbook in docs/runbooks/. This file manages every record.
#
# No mailbox and no sender exists under this domain, so the zone carries
# explicit "no mail" records: null MX (RFC 7505), an SPF that authorizes
# nothing, and a reject-all DMARC.

resource "scaleway_domain_record" "rocks_apex" {
  dns_zone = var.rocks_domain
  name     = ""
  type     = "ALIAS"
  data     = "${scaleway_function.apex_redirect_rocks.domain_name}."
  ttl      = 300
}

resource "scaleway_domain_record" "rocks_www" {
  dns_zone = var.rocks_domain
  name     = "www"
  type     = "CNAME"
  data     = "${scaleway_edge_services_pipeline.rocks.id}.svc.edge.scw.cloud."
  ttl      = 300
}

# Ownership challenge from the external-domain onboarding; created once the
# token is known (kept permanently — Scaleway re-checks it periodically).
resource "scaleway_domain_record" "rocks_scaleway_challenge" {
  count = var.rocks_scaleway_challenge != "" ? 1 : 0

  dns_zone = var.rocks_domain
  name     = "_scaleway-challenge"
  type     = "TXT"
  data     = var.rocks_scaleway_challenge
  ttl      = 600
}

resource "scaleway_domain_record" "rocks_null_mx" {
  dns_zone = var.rocks_domain
  name     = ""
  type     = "MX"
  data     = "."
  priority = 0
  ttl      = 3600
}

resource "scaleway_domain_record" "rocks_spf" {
  dns_zone = var.rocks_domain
  name     = ""
  type     = "TXT"
  data     = "v=spf1 -all"
  ttl      = 3600
}

resource "scaleway_domain_record" "rocks_dmarc" {
  dns_zone = var.rocks_domain
  name     = "_dmarc"
  type     = "TXT"
  data     = "v=DMARC1; p=reject;"
  ttl      = 3600
}
