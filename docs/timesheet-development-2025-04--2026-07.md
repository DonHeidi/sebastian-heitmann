# Development Timesheet — sebastian-heitmann monorepo

**Period:** 2025-04-10 – 2026-07-13
**Scope:** Development work only. Article/copy writing (content creation) is excluded.
**Total: 76 person-hours** (defensible range: 70–85)

## Methodology

- Derived from the full git history (285 commits), clustered into work sessions:
  a gap of more than ~1–2 hours between commits starts a new session.
- Hours per session = session wall-clock (first to last commit) plus a lead-in
  estimate scaled to the apparent complexity of the diff. This measures
  supervision/direction time, not commit count — appropriate for an
  agentic-development workflow where AI agents author the commits.
- Automated commits (nightly `chore(job-directory): publish job scan` at 02:30)
  are counted as 0 hours.
- Sessions mixing development and content were split; pure copy/wording changes
  retain 0.25 h implementation overhead.

## Timesheet by day

| Date | Task / Result | Hours |
|---|---|---:|
| 2025-04-10 | Project scaffolding: Bun + Astro + SASS, index page, blueprint background | 1.00 |
| 2025-04-16 | Icon support via astro-icon | 1.00 |
| 2025-04-17 | Hero section (1440px), headline refactor, logo section | 2.00 |
| 2025-04-18 | Typewriter component | 1.00 |
| 2025-08-12 | Nix flake dev environment | 1.00 |
| 2026-01-02 | Migrate dev env from flake to mise (PR #1) | 0.50 |
| 2026-03-16 | Highlights section; success stories (spec→plan→impl); services accordion (spec→plan→impl); plans spec | 4.50 |
| 2026-03-17 | Plans section implementation + homepage integration | 1.00 |
| 2026-03-18 | Why-me section; FAQ bento (spec + 6 components); footer + contact form | 3.50 |
| 2026-03-20 | Design exploration: v2 landing page + iteration, v3 variant, spaceship/cyberpunk versions, v4 Swiss Editorial, v5 Brutalist | 4.50 |
| 2026-03-21 | Precision Swiss (v8/v9) consolidation as primary design; light/dark theme system; i18n (3 locales, spec→impl) | 4.00 |
| 2026-03-23 | Mobile responsiveness + 404; monorepo conversion; mail-service CORS + contact form wiring; Terraform/Scaleway infra (function, storage, CDN) + first deploy | 6.50 |
| 2026-03-24 | Copy change implementation (title, billing models) | 0.25 |
| 2026-03-25 | Remove en-gb locale | 0.25 |
| 2026-03-31 | Imprint + privacy pages (DE/EN); self-host Google Fonts (GDPR); language-switch fixes | 1.50 |
| 2026-04-01 | Reference removal | 0.25 |
| 2026-04-06 | Logo section spacing fix | 0.25 |
| 2026-04-07 | Visual polish; JSON-LD structured data; OG/Twitter meta tags | 1.50 |
| 2026-04-09 | Hero pitch implementation, deploy docs fix | 0.25 |
| 2026-04-10 | robots.txt + sitemap; CV page (bento grid + PDF export); articles system (spec→plan→impl, case study migration) | 4.00 |
| 2026-04-11 | Article detail layout tweak | 0.25 |
| 2026-04-13 | Featured-articles section; semantic tags + BlogPosting JSON-LD; reading time | 1.50 |
| 2026-04-14 | Article layout refactors: glassmorphism panel, shared article-view, sticky sidebar; per-page OG metadata | 2.50 |
| 2026-04-15 | TEM infra + deploy scripts; orphan-image pruning in deploy; favicon | 2.00 |
| 2026-04-17 | Capabilities section | 1.00 |
| 2026-04-19 | CV fix | 0.25 |
| 2026-04-23 | Web development service page implementation; contrast/section fixes | 1.50 |
| 2026-04-26 | Logo images with dark strip background | 0.75 |
| 2026-04-29 | Article heading readability fix | 0.25 |
| 2026-05-01 | Technical project management page implementation | 1.00 |
| 2026-05-03 | CV print letterhead | 0.75 |
| 2026-05-11 | Blueprint backdrop redesign (anchored blobs, dotted rules, glass refresh) | 1.50 |
| 2026-05-12 | Backdrop cross-viewport/Firefox fixes; Bing verification | 1.50 |
| 2026-05-14 | Backdrop scoping to home; light-mode color softening | 1.00 |
| 2026-05-24 | Remove gradient blobs | 0.25 |
| 2026-05-25 | Terraform remote state on Scaleway Object Storage + AWS env shim | 1.50 |
| 2026-05-26 | Article/deploy fixes; public README; job-directory Astro app initial version | 2.50 |
| 2026-05-28 | Job-directory: migrate to TanStack Start with SQLite + REST API | 2.50 |
| 2026-06-03 | Job-directory: Tailwind 4 + shadcn; shortlist/feedback/outreach/status workflows | 2.50 |
| 2026-06-04 | Extract job-directory into its own repository | 0.50 |
| 2026-06-13 | varlock + Proton Pass secret management (specs + implementation) | 1.75 |
| 2026-06-15 | scw wrapper script; fresh-checkout end-to-end deploy fixes | 2.50 |
| 2026-06-18 | Infra hardening (provider locks, tfvars removal); fresh-machine runbook; optional PUBLIC_MAIL_ENDPOINT | 2.00 |
| 2026-06-24 | Fractional CTO rebrand + white light theme (PR #4) | 2.00 |
| 2026-06-29 | CV: agentic skills entry | 0.75 |
| 2026-06-30 | CV: expand lead generation entry | 0.50 |
| 2026-07-04 | Email signature logo assets; CV lead-gen consolidation | 1.00 |
| 2026-07-08 | CTO summary implementation, en-gb reference cleanup | 0.25 |
| 2026-07-13 | --v8-asterisk design system + Tailwind/shadcn migration spec | 1.00 |
| | **Total** | **76.00** |

## Summary by workstream

| Workstream | Hours |
|---|---:|
| Design system, theming, visual design (v1–v5 exploration, Precision Swiss, backdrops) | ~20 |
| Homepage sections & components | ~13 |
| Infrastructure & deployment (Terraform, Scaleway, remote state, secrets, deploy scripts) | ~14 |
| Articles system (collections, layouts, SEO plumbing) | ~7 |
| Job-directory app | ~8 |
| CV page & iterations | ~5.5 |
| i18n | ~4 |
| Service pages (implementation share) | ~2.5 |
| Legal/GDPR pages, SEO, meta | ~3.5 |
| Tooling & project setup (Astro init, flake/mise, monorepo) | ~4 |

## Monthly totals

| Month | Hours |
|---|---:|
| 2025-04 | 5.00 |
| 2025-08 | 1.00 |
| 2026-01 | 0.50 |
| 2026-03 | 26.00 |
| 2026-04 | 16.25 |
| 2026-05 | 12.50 |
| 2026-06 | 12.50 |
| 2026-07 | 2.25 |
| **Total** | **76.00** |
