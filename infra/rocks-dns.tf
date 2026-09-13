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

# GOTCHA — this record can be replaced OUT OF BAND by Edge Services. The
# pipeline's DNS stage is `type = managed`, so when the zone is hosted at
# Scaleway, re-submitting that stage (PATCH /edge-services/v1beta1/dns-stages/
# <id>, which the go-live needed to clear a stale dns_cname_resolve warning)
# makes Edge Services DELETE this CNAME and create its own — same value, new
# record id, ttl 60. Terraform's state then points at a dead id and plans to
# CREATE, which would leave two CNAMEs on one name.
#
# Recovery: `terraform state rm scaleway_domain_record.rocks_www` then
# `terraform import scaleway_domain_record.rocks_www <zone>/<new-record-id>`,
# then apply to restore the declared ttl. Verify no duplicate afterwards:
#   ./scripts/scw dns record list sebastian-heitmann.rocks -o json | jq '.[] | select(.name=="www")'
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

# Null MX (RFC 7505): "this domain accepts no mail".
#
# GOTCHA — do not "fix" this by changing `data`. On CREATE, Scaleway qualifies
# the "." target against the zone and stores `0 sebastian-heitmann.rocks.`,
# which is the OPPOSITE of a null MX (it advertises the domain as its own mail
# exchanger); the provider then fails its read-back with
#   record with type MX and data .sebastian-heitmann.rocks. not found
# and leaves the bad record behind, unmanaged. The API's PATCH path accepts "."
# correctly and stores `0 .`, so the record was repaired out-of-band and then
# imported into state — after which plan is clean and stays clean.
#
# If this resource is ever destroyed and recreated, expect the same broken
# create. Repair with a PATCH to
#   /domain/v2beta1/dns-zones/<zone>/records   (changes[].set, data ".")
# then: terraform import scaleway_domain_record.rocks_null_mx <zone>/<record-id>
# Verify on the wire, not via a public resolver (they cache aggressively):
#   python3 scripts/dns-probe.py <ns-ip> sebastian-heitmann.rocks MX   -> "0 ."
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
