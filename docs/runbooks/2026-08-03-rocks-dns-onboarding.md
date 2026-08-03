# Runbook: DNS onboarding for sebastian-heitmann.rocks

**Goal:** bring `sebastian-heitmann.rocks` from "registered at GoDaddy on default
parked DNS" to a live site: `https://www.sebastian-heitmann.rocks` served from
Scaleway Object Storage behind Edge Services, and
`https://sebastian-heitmann.rocks/<path>` 301-redirecting to the `www` equivalent
with path and query preserved.

**Current state (2026-08-03):** the domain is registered at GoDaddy and sits on
GoDaddy's default parked DNS (no meaningful records). It has never sent or
received mail and none is planned, so unlike the `.dev` cutover this is a clean
build, not a faithful recreation of an existing zone. The zone carries explicit
"no mail" records instead: null MX (RFC 7505), an SPF that authorizes nothing,
and a reject-all DMARC. See `infra/rocks-dns.tf` for the exact record set.

**Pattern:** same as the `.dev` apex cutover
(`docs/runbooks/2026-08-02-apex-dns-cutover.md`) and the same code path as
job-directory.eu: DNS hosting (not registration) moves to Scaleway Domains and
DNS, `www` points at an Edge Services pipeline, and the apex is ALIASed to a
tiny redirect function (`apps/apex-redirect/`, redeployed here under the name
`apex-redirect-rocks`) that holds the apex's managed TLS cert and 301s
everything to `www`.

All of the infrastructure this runbook provisions already exists in code
(`infra/rocks-storage.tf`, `infra/rocks-cdn.tf`, `infra/rocks-redirect.tf`,
`infra/rocks-dns.tf`) and gated behind `terraform apply`; nothing below invents
new resources, it sequences turning them on safely.

---

## Step 0: export the GoDaddy zone (rollback baseline)

Before touching anything, capture whatever GoDaddy currently holds for the
domain, even though it's expected to be just the default parking page records.
Same convention as the `.dev` cutover's `2026-08-02-godaddy-zone-export.txt`.

GoDaddy console → sebastian-heitmann.rocks → DNS → export the zone (or record
each row manually if no export button is offered), and save it as:

```
docs/runbooks/2026-08-03-godaddy-rocks-zone-export.txt
```

(re-date the filename to the day this step is actually executed). This is the
rollback path: if the cutover needs to be undone, switching nameservers back
to GoDaddy's defaults restores whatever this export captured.

## Step 1: register the external domain with Scaleway

Registers `sebastian-heitmann.rocks` as an external domain in the
`sebastian-heitmann-dev` Scaleway project (same project as `.dev`, id
`e4c697f5-26ab-40d2-8064-dc25be1484d6`), which is the prerequisite for hosting
its DNS zone at Scaleway. This is a one-time manual API call, not
terraformable (mirrors the `.dev` cutover's step 1):

```bash
cd <repo> && node_modules/.bin/varlock run --path infra -- bash -c \
  'curl -sS -X POST "https://api.scaleway.com/domain/v2beta1/external-domains" \
   -H "X-Auth-Token: $SCW_SECRET_KEY" -H "Content-Type: application/json" \
   -d "{\"domain\":\"sebastian-heitmann.rocks\",\"project_id\":\"e4c697f5-26ab-40d2-8064-dc25be1484d6\"}"'
```

The response includes a `_scaleway-challenge` validation token. Record it here:

> **Challenge token:** `<fill in at execution: value returned by the API call above>`

> **DEADLINE:** as with `.dev`, Scaleway deletes the pending external domain if
> the challenge TXT record (step 2 below) is not visible within **48 hours** of
> registration, and the whole onboarding must finish within **14 days**. If it
> lapses, re-run the call above (harmless, returns a new token) and update the
> token both here and in `infra/variables.tf`.

## Step 2: set the challenge TXT at GoDaddy

GoDaddy console → sebastian-heitmann.rocks → DNS → Add record:

- Type: `TXT`
- Name: `_scaleway-challenge`
- Value: `<the token from Step 1>`
- TTL: 600 (or lowest offered)

⚠️ Do NOT open/save GoDaddy's "Weiterleitung" (forwarding) dialog during any of
this: saving it resets the domain to GoDaddy's default nameservers.

Wait for Scaleway to validate the domain: the dot next to the domain in
console → Domains & DNS → External domains turns green, and Scaleway sends a
confirmation email (usually under an hour).

## Step 3: commit the token and apply infrastructure

Once validated, commit the token into Terraform and build the redirect
handler, then apply:

```bash
# infra/variables.tf: set rocks_scaleway_challenge default to the token from Step 1
cd apps/apex-redirect && bun run build && cd -
./scripts/apply-infra.sh
```

This is the first `apply` that creates the `.rocks`-specific resources: the
zone records in `infra/rocks-dns.tf` (apex ALIAS, `www` CNAME, the challenge
TXT, null MX, SPF, DMARC), the `sebastian-heitmann-rocks` Object Storage
bucket (`infra/rocks-storage.tf`), the `sebastian-heitmann-rocks` Edge
Services pipeline (`infra/rocks-cdn.tf`), and the `apex-redirect-rocks`
function (`infra/rocks-redirect.tf`). `bind_rocks_apex_domain` defaults to
`false` in `infra/variables.tf`, so the apex custom-domain binding (and its
cert issuance) is skipped for now: safe to apply pre-delegation since the
records only exist on Scaleway's not-yet-delegated nameservers and nothing
live changes.

## Step 4: first deploy

Populate the bucket before any DNS is pointed at it, so there's content to
serve the moment delegation completes:

```bash
./scripts/deploy-rocks.sh
```

## Step 5: pre-delegation checks

Query Scaleway's nameservers directly (not the public resolver, since NS
hasn't been delegated yet) and compare against `infra/rocks-dns.tf`:

```bash
dig @ns0.dom.scw.cloud www.sebastian-heitmann.rocks CNAME +short
dig @ns0.dom.scw.cloud sebastian-heitmann.rocks A +short      # apex ALIAS resolution
dig @ns0.dom.scw.cloud _scaleway-challenge.sebastian-heitmann.rocks TXT +short
dig @ns0.dom.scw.cloud sebastian-heitmann.rocks MX +short     # null MX: "0 ."
dig @ns0.dom.scw.cloud sebastian-heitmann.rocks TXT +short    # SPF: "v=spf1 -all"
dig @ns0.dom.scw.cloud _dmarc.sebastian-heitmann.rocks TXT +short  # "v=DMARC1; p=reject;"
```

The `www` CNAME should resolve to `<rocks pipeline id>.svc.edge.scw.cloud`
(get the id with `terraform output -raw rocks_cdn_pipeline_id`, run from
`infra/` with the S3-backend credentials the deploy scripts export). The apex
`A` lookup should resolve through the ALIAS to the redirect function's IPs
(compare against `dig +short A $(terraform output -raw
rocks_apex_redirect_endpoint)`). Do not proceed to Step 6 on any mismatch:
there is no mail blast radius here (this domain never carries mail), but a
mismatch means the zone in Terraform state doesn't match what's about to go
live.

## Step 6: switch nameservers at GoDaddy

GoDaddy console → sebastian-heitmann.rocks → **Nameservers** (NOT the
forwarding dialog) → change to custom:

- `ns0.dom.scw.cloud`
- `ns1.dom.scw.cloud`

Propagation: minutes to ~48 hours depending on the registry TTL for NS
records.

## Step 7: after propagation, bind the apex and verify

Confirm delegation first:

```bash
dig +short NS sebastian-heitmann.rocks     # → ns0/ns1.dom.scw.cloud
```

Then flip the apex binding on, commit, and re-apply:

```bash
# infra/variables.tf: set bind_rocks_apex_domain default to true
./scripts/apply-infra.sh
```

This provisions the apex's managed Let's Encrypt cert (needs the ALIAS
resolving publicly, hence waiting until after Step 6). Then verify the actual
goal:

```bash
curl -sI https://sebastian-heitmann.rocks/x?y=1 | head -3
# expect: 301, location: https://www.sebastian-heitmann.rocks/x?y=1

curl -s -o /dev/null -w '%{http_code} %{url_effective}\n' -L https://sebastian-heitmann.rocks/x?y=1
# expect: 200 https://www.sebastian-heitmann.rocks/x?y=1

curl -sI https://www.sebastian-heitmann.rocks | head -3
# expect: 200, valid TLS (no cert warning)
```

Spot-check the bilingual routing and a case page:

```bash
curl -s -o /dev/null -w '%{http_code}\n' https://www.sebastian-heitmann.rocks/de-de/
curl -s -o /dev/null -w '%{http_code}\n' https://www.sebastian-heitmann.rocks/cases/portfolio-platform/
```

Both should return `200`.

---

## Rollback

At any point before or after Step 6, switch GoDaddy's nameservers back to its
defaults; the exported zone from Step 0 (parked defaults) is what comes back.
The Scaleway zone keeps existing and keeps working in the background, so a
retry only means switching NS forward again, no re-registration needed unless
the 14-day validity window (Step 1) has lapsed.

## Cost note

Before the apply in Step 3, confirm the Edge Services plan covers a second
pipeline: console → Edge Services → plan usage. `sebastian-heitmann-rocks`
will be the second pipeline in this project alongside
`sebastian-heitmann-website` (`.dev`). Bump the plan first if the current tier
caps pipeline count.
