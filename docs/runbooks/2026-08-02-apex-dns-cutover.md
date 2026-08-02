# Runbook: apex DNS cutover to Scaleway (fix the apex 404)

**Goal:** `https://sebastian-heitmann.dev/<path>` (notably `/imprint/`) must reach the
same content as `https://www.sebastian-heitmann.dev/<path>`. Today GoDaddy's domain
forwarding 301s only the bare root and 404s every other path.

**Fix:** move DNS hosting (NOT registration) from GoDaddy to Scaleway Domains and DNS,
point the apex via an ALIAS record at a tiny redirect function (`apps/apex-redirect/`)
that 301s with path + query preserved, and bind the apex as the function's custom
domain for a managed TLS cert. Same pattern as job-directory.eu.

**State (2026-08-02):** the external domain is already registered with Scaleway DNS
(project `sebastian-heitmann-dev`, via `POST /domain/v2beta1/external-domains`).
Validation token: `e2724349-3400-481f-886f-2d5d4866544c`.

> **DEADLINE:** Scaleway deletes the pending external domain if the challenge TXT
> record (step 1) is not visible within **48 hours** of registration
> (registered 2026-08-02 09:13 UTC), and the whole onboarding must finish within
> **14 days**. If it lapses, re-register (harmless, new token):
>
> ```bash
> cd <repo> && node_modules/.bin/varlock run --path infra -- bash -c \
>   'curl -sS -X POST "https://api.scaleway.com/domain/v2beta1/external-domains" \
>    -H "X-Auth-Token: $SCW_SECRET_KEY" -H "Content-Type: application/json" \
>    -d "{\"domain\":\"sebastian-heitmann.dev\",\"project_id\":\"e4c697f5-26ab-40d2-8064-dc25be1484d6\"}"'
> ```
>
> then update the token in `infra/dns.tf` and in step 1.

---

## Zone snapshot (authoritative GoDaddy export, 2026-08-02)

Raw export archived at `2026-08-02-godaddy-zone-export.txt` (the rollback
baseline). `me@sebastian-heitmann.dev` is live Microsoft 365 mail — the MX/SPF
rows are the ones that must never go missing.

| Name | Type | Value | Note |
|------|------|-------|------|
| `@` | A | `15.197.225.128`, `3.33.251.168` | GoDaddy forwarding ALB — **replaced** by ALIAS |
| `@` | MX 0 | `sebastianheitmann-dev02c.mail.protection.outlook.com` | Microsoft 365 |
| `@` | TXT | `v=spf1 include:secureserver.net -all` | SPF (M365 via GoDaddy) |
| `@` | TXT | `NETORGFT9959061.onmicrosoft.com` | MS domain verification |
| `@` | TXT | `NETORGFT9253916.onmicrosoft.com` | MS domain verification |
| `@` | TXT | `google-site-verification=m-jIF1hAu_xIehyXmlrKne0iDKkVH_KNOOfzwroiiWY` | |
| `www` | CNAME | `cca87f11-b109-4ca3-83b6-a6aaf89dcadc.svc.edge.scw.cloud` | Edge pipeline (Terraform-derived in dns.tf) |
| `autodiscover` | CNAME | `autodiscover.outlook.com` | M365 |
| `sip` | CNAME | `sipdir.online.lync.com` | M365 |
| `lyncdiscover` | CNAME | `webdir.online.lync.com` | M365 |
| `msoid` | CNAME | `clientconfig.microsoftonline-p.net` | M365 legacy sign-in |
| `_sip._tls` | SRV | `100 1 443 sipdir.online.lync.com` | M365 SfB/Teams |
| `_sipfederationtls._tcp` | SRV | `100 1 5061 sipfed.online.lync.com` | M365 federation |
| `email` | CNAME | `email.secureserver.net` | GoDaddy webmail entry |
| `_domainconnect` | CNAME | `_domainconnect.gd.domaincontrol.com` | GoDaddy-only — **dropped** on purpose |
| `core` | CNAME | `core.sebastian-heitmann.dev` | self-referential loop, resolves to nothing — **dropped** on purpose |
| `contact` | MX 10 | `blackhole.tem.scaleway.com` | Scaleway TEM |
| `contact` | TXT | `v=spf1 include:_spf.tem.scaleway.com -all` | TEM SPF |
| `e4c697f5-…._domainkey.contact` | TXT | `v=DKIM1; …` (full key) | TEM DKIM (from `scaleway_tem_domain` in dns.tf) |
| `_dmarc.contact` | TXT | `v=DMARC1; p=none` | TEM DMARC |

No AAAA, CAA, apex `_dmarc`, `selector1/2._domainkey`, `enterpriseregistration/enrollment`,
or `mta-sts` records existed. (An apex DMARC record is a worthwhile follow-up after
the cutover, but out of scope: recreate faithfully first.)

---

## Cutover sequence

Steps 1, 5 are manual GoDaddy console actions; everything else is repo tooling.

### 1. Add the challenge TXT at GoDaddy — DO THIS FIRST (48 h deadline)

GoDaddy console → sebastian-heitmann.dev → DNS → Add record:

- Type: `TXT`
- Name: `_scaleway-challenge`
- Value: `e2724349-3400-481f-886f-2d5d4866544c`
- TTL: 600 (or lowest offered)

⚠️ **Do NOT open/save the "Weiterleitung" (forwarding) dialog** during any of this —
saving it resets the domain to GoDaddy's default nameservers.

### 2. Wait for Scaleway validation

The dot next to the domain in [console → Domains & DNS → External domains] turns
green and Scaleway sends a confirmation email (checked periodically, usually < 1 h).

### 3. Apply infrastructure (creates zone records + redirect function)

`bind_apex_domain` defaults to `false`, so this is safe pre-cutover — the records
exist only on Scaleway's (not yet delegated) nameservers, and nothing live changes:

```bash
./scripts/apply-infra.sh
```

### 4. Verify the Scaleway zone against the snapshot BEFORE delegating

Query Scaleway's nameservers directly and compare each row with the snapshot table:

```bash
for q in "MX sebastian-heitmann.dev" "TXT sebastian-heitmann.dev" \
         "CNAME www.sebastian-heitmann.dev" "CNAME autodiscover.sebastian-heitmann.dev" \
         "CNAME sip.sebastian-heitmann.dev" "CNAME lyncdiscover.sebastian-heitmann.dev" \
         "CNAME email.sebastian-heitmann.dev" "CNAME msoid.sebastian-heitmann.dev" \
         "SRV _sip._tls.sebastian-heitmann.dev" "SRV _sipfederationtls._tcp.sebastian-heitmann.dev" \
         "MX contact.sebastian-heitmann.dev" \
         "TXT contact.sebastian-heitmann.dev" "TXT _dmarc.contact.sebastian-heitmann.dev" \
         "TXT e4c697f5-26ab-40d2-8064-dc25be1484d6._domainkey.contact.sebastian-heitmann.dev" \
         "A sebastian-heitmann.dev"; do
  echo "== $q"; dig +short @ns0.dom.scw.cloud $q
done
```

Expected deltas vs the snapshot: apex `A` now resolves via the ALIAS to the
function's IPs (compare against `dig +short A $(cd infra && terraform output -raw
apex_redirect_endpoint)`), and `_domainconnect` is gone. **Everything else must
match. Do not proceed on any MX/TXT mismatch — that's the mail blast radius.**

### 5. Switch nameservers at GoDaddy

GoDaddy console → sebastian-heitmann.dev → **Nameservers** (NOT the forwarding
dialog) → change to custom:

- `ns0.dom.scw.cloud`
- `ns1.dom.scw.cloud`

The old forwarding config becomes moot. Propagation: minutes to ~48 h (registry
TTL for NS is typically 1 h for .dev).

### 6. Verify mail immediately after propagation

```bash
dig +short NS sebastian-heitmann.dev          # → ns0/ns1.dom.scw.cloud
dig +short MX sebastian-heitmann.dev          # → 0 sebastianheitmann-dev02c.mail.protection.outlook.com
```

Send a test mail from an external account to `me@sebastian-heitmann.dev` and
confirm receipt. Also confirm the website is untouched:
`curl -s -o /dev/null -w '%{http_code}' https://www.sebastian-heitmann.dev/imprint/` → `200`.

### 7. Bind the apex custom domain (cert)

Flip the default of `bind_apex_domain` in `infra/variables.tf` to `true`, commit,
then `./scripts/apply-infra.sh`. Scaleway provisions the managed Let's Encrypt
cert for the apex (needs the ALIAS resolving publicly — that's why this waits
until after step 5).

### 8. Final verification (the actual goal)

```bash
curl -sI https://sebastian-heitmann.dev/imprint/ | head -3       # 301 → https://www.sebastian-heitmann.dev/imprint/
curl -s -o /dev/null -w '%{http_code} %{url_effective}\n' -L https://sebastian-heitmann.dev/imprint/   # 200
curl -sI 'https://sebastian-heitmann.dev/imprint/?x=1' | grep -i location                              # query preserved
```

---

## Rollback

DNS hosting: at GoDaddy, set nameservers back to `ns39.domaincontrol.com` /
`ns40.domaincontrol.com`. The GoDaddy zone records still exist (nothing there was
deleted) — the old apex-forwarding + all mail records come back with the NS.

## Post-cutover notes

- GoDaddy DNS records and the forwarding config are dead weight once NS points at
  Scaleway; leave them as the rollback path for a few weeks, then optionally clean up.
- All future record changes go through `infra/dns.tf` — the GoDaddy DNS editor no
  longer has any effect.
- Apex DMARC is now published (`p=none`, reports to the contact mailbox). To
  complete the mail-authentication story: enable DKIM for the domain in the
  M365 Defender portal, paste the two tenant-specific CNAME targets into
  `m365_dkim_cnames` in `infra/variables.tf`, apply, then press "Enable" in the
  portal once the CNAMEs resolve. After a few clean weeks of DMARC reports,
  tighten the policy to `p=quarantine`, later `p=reject`.
- Other follow-up worth considering: raising the apex/www TTLs from the
  cutover-friendly 300 s.
