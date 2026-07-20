# AI Process Automation Product Page — Design

**Date:** 2026-07-20
**Status:** Approved (user waived spec review)

## Goal

Add a product page for AI-powered product and process development, linked from the
featured "Deliver — Per Cycle" engagement card on the homepage. German content was
provided by the user; the English version is an idiomatic translation in the site's
existing voice.

## Routes

| Locale | Path |
|--------|------|
| en-us | `/ai-process-automation` |
| de-de | `/de-de/ki-prozess-automation` |

Hreflang alternates follow the `web-development.astro` pattern (en, de-DE, x-default).

## Architecture

Mirrors the existing product-page pattern (`webProjects` / `technicalProjectManagement`):

- `src/i18n/types.ts` — new `aiProcessAutomation` section in `Strings`.
- `src/i18n/en-us.ts` / `src/i18n/de-de.ts` — content per locale. German is the
  user's draft with typo cleanup (stray URL removed from the prototype section).
  Prices stay in EUR: "from €4,200 net" / "ab 4.200 € netto".
- `src/components/ai-process-automation-content.astro` — new content component
  reusing the established visual language: mono eyebrow + dotted rule section
  headers, display-italic headlines, glass cards, `--v8-*` tokens, `reveal`
  animations, breakpoints at 1440/1024/768/375.
- `src/pages/ai-process-automation.astro` and
  `src/pages/de-de/ki-prozess-automation.astro` — page shells with Navigation,
  content component, ContactSection (page-specific headline/intro), Footer.
- `src/components/navigation.astro` — add both slugs to the locale path map so the
  language picker switches between the two versions.
- `src/components/proof-section.astro` — new optional `aiLink` prop; the featured
  engagement card renders it as a second link alongside the existing
  web-development link.
- `src/pages/index.astro` + `src/pages/de-de/index.astro` — pass `aiLink`.

## Page structure

1. **Hero** — eyebrow, headline ("Building AI-powered products and processes" /
   "KI-gestützte Produkte und Prozesse entwickeln"), thesis subline ("AI only
   creates durable value once it is embedded in a working process."), CTA to
   `#contact`.
2. **Approach intro** — connecting AI models, classic automation, existing systems,
   and human decisions into one workflow; three entry points (prototype, first
   production release, custom system).
3. **Offerings** — three stacked full-width blocks (not 3-column cards, the lists
   are too long): AI Prototype, AI Product, Custom AI System. Each block: name +
   price header, tagline, description, two-column split (scope | outcome).
4. **Example: Job Directory** — case block with component list, human-in-the-loop
   paragraph, external link to https://www.job-directory.eu/.
5. **Typical use cases** — list section, closing with the "not every process needs
   AI" note.
6. **How the collaboration starts** — five numbered steps.
7. **After the first release** — development & operations list.
8. **CTA + contact** — "Discuss a project" bridge with the four "describe to me"
   bullets, then shared `ContactSection`.

## Out of scope

- No FAQ section (not in the draft).
- No navigation menu entry; the page is reached via the homepage card (matching
  the other product pages).
- Deployment is unchanged; the page ships with the next `deploy-website.sh` run.
