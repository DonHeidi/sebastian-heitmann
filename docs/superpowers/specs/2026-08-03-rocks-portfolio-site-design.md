# sebastian-heitmann.rocks — Portfolio Site Design

**Date:** 2026-08-03
**Status:** Approved

## Purpose

`sebastian-heitmann.rocks` is Sebastian's portfolio site: case studies and projects. It is distinct from `sebastian-heitmann.dev`, which is the fractional-CTO landing page and hosts the blog. The two sites share one brand (the `--v8-asterisk` design system) and one monorepo.

The domain is registered at GoDaddy. DNS hosting moves to Scaleway Domains and DNS, following the same external-domain onboarding used for `.dev`.

## Scope

In scope:

- New Astro 7 app `apps/rocks` in the Bun workspaces monorepo
- Terraform for hosting and DNS in the existing `infra/` root (same state, same Scaleway project `sebastian-heitmann-dev`)
- Deploy script `scripts/deploy-rocks.sh`
- Runbook for the GoDaddy → Scaleway DNS onboarding

Out of scope (deliberate):

- Contact form (contact relays through `sebastian-heitmann.dev`)
- Blog content (stays on `.dev`; `.rocks` shows curated teasers linking there)
- Migrating `.dev` content (the old case-study collection no longer exists on `.dev`; `.rocks` content is new and provided by Sebastian)
- Shared design-system package (tokens are copied, not extracted; extraction is a possible later refactor)
- Consolidating the two deploy scripts

## The Astro App (`apps/rocks`)

New Bun workspace mirroring `apps/website` conventions: Astro 7, Tailwind v4, TypeScript, self-hosted IBM Plex Mono plus Instrument Serif and DM Sans, `--v8-*` design tokens and the required `@layer components` rules copied into its own `src/styles/global.css`. Light/dark mode with the same three-option toggle. No mail endpoint, so no meaningful `.env.schema`.

### Pages

Each page exists at `/` (en-us, unprefixed) and under `/de-de/`:

- `/` : portfolio landing. Hero/intro, featured case studies, project grid, blog-teaser section linking to `.dev` articles, footer.
- `/cases/[slug]` : case-study detail pages rendered from the content collection.
- `404`.

Legal pages are not duplicated: the footer links to `sebastian-heitmann.dev/imprint` and `sebastian-heitmann.dev/privacy` (and to `.dev` for contact).

### Content Model

One content collection, `src/content/cases/{en-us,de-de}/`, with a typed schema:

| Field | Type | Notes |
|-------|------|-------|
| `title` | string | |
| `summary` | string | Used on cards and meta description |
| `kind` | `"case-study"` \| `"project"` | Projects render as lighter grid cards; case studies get detail pages |
| `role` | string | |
| `stack` | string[] | |
| `dates` | start/end | |
| `links` | { label, url }[] | Live site, repo, etc. |
| `cover` | image | Via the collection `image()` helper; referenced through `getImage()` only |
| `featured` | boolean | Surfaces on the landing hero section |
| `draft` | boolean | Excluded from builds |

Content is provided by Sebastian; the implementation ships the schema, layouts, and rendering, seeded with whatever entries he supplies during the build.

### Blog Teasers

Curated per-locale data files, `src/data/blog-teasers.{en-us,de-de}.ts`: title, teaser text, absolute URL to the `.dev` article. Rendered as cards on the landing page. No build-time fetching of feeds; the list is hand-edited, which gives editorial control and keeps builds deterministic.

### i18n

Same mechanism as `.dev`: `src/i18n/{en-us,de-de}.ts` typed by a shared `Strings` interface, components receive string sections as props, hreflang pairs in the layout, first-visit `navigator.language` redirect (once, via localStorage), inline segmented US/DE language picker.

## Infrastructure

All new Terraform lives in the existing `infra/` root (same S3-backed state, same project), in new files following the per-concern layout: `rocks-storage.tf`, `rocks-cdn.tf`, `rocks-redirect.tf`, `rocks-dns.tf`. New variables: `rocks_domain` (default `sebastian-heitmann.rocks`) and `bind_rocks_apex_domain` (default `false`).

### Hosting

- **Bucket** `sebastian-heitmann-rocks`: website config and ACL handling identical to the existing website bucket.
- **Edge Services pipeline** `sebastian-heitmann-rocks`, reusing the existing `scaleway_edge_services_plan.main`, with the same stage chain: backend (`is_website = true`) → cache → TLS (managed cert) → DNS stage on `www.sebastian-heitmann.rocks` → head stage.
- **Cost caveat:** the starter plan includes one pipeline; the second pipeline likely bills extra or needs a plan bump. Confirm pricing in the Scaleway console before `apply`.

### Apex Redirect

Second `scaleway_function` in the existing `apex-redirect` namespace, deploying the same handler zip with `REDIRECT_TARGET = "https://www.sebastian-heitmann.rocks"`. The `scaleway_function_domain` binding for the `.rocks` apex is gated behind `bind_rocks_apex_domain`, because managed-cert issuance requires the apex to resolve to the function, which only happens after NS delegation. The handler itself is unchanged (path and query preserved, 301).

### DNS Zone

Zone registration via `POST /domain/v2beta1/external-domains` is a manual one-time step (not terraformable). `rocks-dns.tf` then manages all records:

- Apex `ALIAS` → redirect function `domain_name`
- `www` `CNAME` → `<pipeline-id>.svc.edge.scw.cloud.`
- `_scaleway-challenge` TXT (kept permanently; Scaleway re-checks)
- No-mail hygiene, since `.rocks` sends and receives no mail:
  - Null MX (RFC 7505): apex `MX 0 .`
  - SPF: apex TXT `v=spf1 -all`
  - DMARC: `_dmarc` TXT `v=DMARC1; p=reject;`

### Onboarding Runbook

A runbook at `docs/runbooks/<date>-rocks-dns-onboarding.md` (dated the day the cutover is executed), modeled on the `.dev` apex cutover runbook:

1. Export the current GoDaddy `.rocks` zone (archived next to the runbook, for rollback)
2. Set the `_scaleway-challenge` TXT at GoDaddy
3. Register the external domain with Scaleway
4. Apply Terraform (zone records, bucket, pipeline, redirect function)
5. Pre-delegation checks: `dig` the expected records against `ns0.dom.scw.cloud`
6. Switch NS at GoDaddy to `ns0/ns1.dom.scw.cloud`
7. After delegation propagates: set `bind_rocks_apex_domain = true`, re-apply, verify apex cert issuance and the 301
8. Rollback: switch NS back to GoDaddy (the exported zone still exists there)

## Deployment

New `scripts/deploy-rocks.sh`, a trimmed copy of `deploy-website.sh`:

- Build `apps/rocks` with a plain `bun run build`: the app has no secrets and no baked-in endpoint. The script's upload steps use the deploy credentials from `infra/.env.schema` via varlock, exactly like `deploy-website.sh`
- Prune orphaned `dist/_astro/` assets (same cross-referencing logic)
- rclone-upload to the `sebastian-heitmann-rocks` bucket, objects `public-read`
- No automatic purge step, matching `deploy-website.sh`: Scaleway Edge purge has proven unreliable in this repo's operational history (purges report success without evicting), so the durable mitigation is no-cache HTML rather than purging on deploy. Purging stays a manual, by-name operation, documented in AGENTS.md
- The `.dev` script's mail-endpoint consistency check is dropped: no contact form here

Deploy order for first launch: Terraform apply first (pipeline id feeds the `www` CNAME), then website deploy. There is no build-time endpoint dependency, so subsequent site deploys are independent of Terraform.

## Error Handling

- Deploy script aborts early without valid Scaleway credentials (same guard as the existing scripts)
- Terraform changes go through a reviewed `plan` before any `apply`
- The runbook's pre-delegation `dig` checks gate the NS switch; rollback is an NS switch back to GoDaddy

## Verification

- `bun run build` and `bun run preview` locally; visual verification via DevTools screenshots at the standard breakpoints (1440/1024/768/375) in both themes and both locales before user review
- `terraform validate` and reviewed `plan` output
- Existing apex-redirect tests (`bun test` in `apps/apex-redirect`) continue to pass unchanged
- Post-launch smoke checks (in the runbook): `https://www.sebastian-heitmann.rocks` serves the site, apex 301s to www with path/query preserved, both locales resolve, TLS valid on apex and www
