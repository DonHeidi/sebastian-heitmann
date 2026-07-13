# --v8-asterisk Design System & Website Tailwind/shadcn Migration — Design

**Date:** 2026-07-13
**Status:** Approved design, pending implementation plan

## Purpose

Formalize the `--v8-*` visual language (the 8th AI-iterated design version — the name
stuck) into a shared design system called **--v8-asterisk**, and migrate the portfolio
website from scoped SCSS to Tailwind v4 + shadcn/ui. The system is shared with the
`job-directory` repo, which already consumes the same token names.

## Context (from codebase audit, 2026-07-13)

- **apps/website**: Astro 6.0.4, no React, no Tailwind. ~5,800 lines of scoped SCSS
  across 15 components. Canonical tokens in `src/layouts/Layout.astro`
  (`html.dark` / `html.light` blocks + `:root` font tokens). Light mode is pure white
  (`#FFFFFF` family). Gotchas: per-section light/dark banding via SCSS mixins in the
  TPM and web-projects content pages; `@media print` token overrides in `cv-section`;
  `astro:assets`-dependent deploy-script orphan pruning.
- **../job-directory**: Bun monorepo; `apps/web` is TanStack Start + React 19 +
  Tailwind v4, with an `@theme inline` bridge mapping shadcn semantic tokens onto
  `--v8-*` and three hand-made shadcn primitives (Radix). Light mode is warm cream
  (`#FAF7F0` family). Its landing app hand-copies the tokens (drift risk).
- Dark palette is identical in both repos: bg `#0C0C0C`, text `#F2F0EB`,
  accent `#FF3B00`. Fonts everywhere: Instrument Serif (display), DM Sans (body),
  IBM Plex Mono (mono).

## Ecosystem facts the design relies on (verified 2026-07)

- Tailwind v4 (4.3.x) is CSS-first: tokens in `@theme`, no `tailwind.config.js`;
  Astro integration is the `@tailwindcss/vite` plugin (`@astrojs/tailwind` is
  deprecated). `@theme inline` maps utilities to runtime-swappable CSS variables.
- shadcn CLI 4.x installs from **GitHub registries**: any public repo with a
  `registry.json` at root → `npx shadcn add <owner>/<repo>/<item>`. Items can be
  themes (`registry:theme` with `cssVars`), plain files, and UI components.
  Base UI is the default primitive library since July 2026 (Radix still supported).
- TanStack Start was evaluated and **rejected** as the website framework: prerendered
  pages still ship and hydrate the full React tree (~100 kB gzip floor, no islands
  mode), defeating the "as little React in the frontend as possible" goal. Astro +
  React islands satisfies both actual drivers (author in TSX, literal shadcn/ui reuse)
  at zero JS for static content.

## Decisions

| Decision | Choice |
|---|---|
| Website framework | Stay on Astro, **upgrade 6 → 7** as a first verified step |
| Component authoring | **Everything TSX** — all 15 components become React, statically rendered; `.astro` remains only for pages + Layout shell |
| shadcn usage | Literal shadcn/ui components (Base UI primitives) |
| Client JS | Three islands only: ContactForm, ThemeToggle, LanguagePicker |
| DS location | Dedicated **public GitHub repo `v8-asterisk`** (branded `--v8-asterisk`), consumed via shadcn GitHub registry |
| Light palette | Canonical = **warm cream** (job-directory values); website adopts it (visual refresh accepted); pure-white ships as `v8-light-white` override variant |
| Migration depth | **Full** — all SCSS replaced by Tailwind + tokens; `sass` removed; CV print output must be preserved |
| Dependencies | Latest versions, always installed via `bun add` (never hand-edited into package.json) |
| Testing environment | **Storybook (latest, Vite builder) in the `v8-asterisk` repo** — stories per primitive, theme/variant switching, token docs. No Storybook in this repo |
| job-directory | Out of scope; adopts the registry in a follow-up (token contract already compatible) |

## Architecture

### 1. `v8-asterisk` repo (new, public)

```
v8-asterisk/
├── registry.json            # shadcn registry index
├── registry/
│   ├── theme/               # registry:theme — token CSS (three layers, below)
│   ├── fonts/               # registry:item — @font-face + woff2 (Instrument Serif, DM Sans, IBM Plex Mono)
│   └── ui/                  # registry:ui — button, card, input, textarea, label, badge, avatar, toggle-group
├── .storybook/              # Storybook: primitives, dark/cream/white switching, token documentation
└── README.md                # branded --v8-asterisk
```

Consumers: `npx shadcn add DonHeidi/v8-asterisk/<item>` (namespace alias `@v8` in each
project's `components.json`). Copy-in semantics: each project owns its copies; updates
are re-pulled deliberately.

### 2. Token architecture (theme CSS, three layers)

1. **v8 core variables** — source of truth, existing names (`--v8-bg`, `--v8-text`,
   `--v8-accent`, `--v8-border`, `--v8-font-*`, …) declared on `.dark` / `.light`
   classes (matches both repos' existing `html.dark`/`html.light` convention) and
   `:root` for theme-independent tokens. Canonical light = warm cream. A separate
   `v8-light-white` layer overrides the light values for projects that opt in.
2. **shadcn contract aliases** — `--background: var(--v8-bg)`,
   `--foreground: var(--v8-text)`, `--primary: var(--v8-accent)`,
   `--ring: var(--v8-accent)`, `--border: var(--v8-border)`, `--card`, `--muted`,
   `--input`, plus newly minted paired foregrounds (`--primary-foreground`, …).
   Note: `--v8-accent` maps to shadcn `--primary`, **not** shadcn `--accent`
   (a subtle hover surface). `--radius: 0.375rem` — matches job-directory's existing
   bridge and the small rounding visible in its shipped UI (not hard-square).
   **Semantic status ladder** (the job-directory briefing UI uses more states than
   the single `--v8-accent-status` token): `--success` (green, absorbs
   `--v8-accent-status`), `--warning` (amber), `--destructive` (red), each with a
   paired foreground and a soft tinted-surface variant (the pale green/amber/red
   card backgrounds in top/borderline/rejected states) → Badge/Card variants cover
   these out of the box.
3. **Tailwind `@theme inline`** — maps the contract to utilities (`bg-background`,
   `text-primary`, `font-display`, …); `@custom-variant dark` matching nested `.dark`
   classes so section-scoped theming works.

Because tokens live on `.dark`/`.light` classes (not only `html`), a
`<section class="light">` re-scopes the entire token set for its subtree — this
replaces the SCSS banding mixins in the two long content pages with one class per
section.

### 3. Website migration (apps/website)

- **Plumbing**: `bun add` `@astrojs/react` `react` `react-dom` `tailwindcss`
  `@tailwindcss/vite`; Vite plugin in `astro.config.mjs`; `src/styles/global.css`
  imports Tailwind + registry theme; `shadcn` init with `@v8` namespace; `@/*` alias.
- **Components**: all 15 → `.tsx`. Static (no directive → zero JS): hero,
  capabilities, situations, proof, logos, featured-articles, article-card,
  author-card, article-cta, footer, article-view, CV, TPM content, web-projects
  content. Islands: ContactForm (shadcn Input/Textarea/Label/Button; same
  fetch-to-Scaleway logic, aria-live status preserved), ThemeToggle (ToggleGroup;
  keeps `localStorage.theme` + `html.dark`/`html.light` contract + anti-FOUC inline
  script), LanguagePicker.
- **i18n**: unchanged — typed string sections passed as props from `.astro` pages.
- **Icons**: `lucide-react` + `@icons-pack/react-simple-icons` in TSX (inline SVG,
  statically rendered); `astro-icon` removed once unused.
- **Images**: `getImage()` stays in `.astro` frontmatter; TSX receives processed URLs
  as props. Keeps OG-meta rule and deploy-script orphan pruning intact.
- **CV print**: `@media print` A4 styles preserved as a dedicated plain-CSS file for
  the CV page; print output verified before the old SCSS is deleted.
- **Cleanup**: delete Layout's global SCSS (reset/backdrop/reveal utilities move to
  `global.css` as plain CSS), `bun remove sass`.

## Execution order

1. Create `v8-asterisk` repo: theme, fonts, initial primitives, registry.json,
   Storybook, README.
2. Website worktree — **Astro 6 → 7 upgrade**, verified on its own.
3. Website plumbing (React, Tailwind, shadcn init, theme import) — site still renders
   from SCSS at this point; tokens now come from the registry.
4. Migrate bottom-up: primitives → leaf components (cards, CTA) → sections (hero,
   capabilities, situations, proof, logos, featured, footer, nav + islands) → giants
   (article-view, TPM, web-projects, CV last with print check).
5. Cleanup (SCSS + sass + astro-icon removal).
6. Full verification.

## Verification

- `bun run build` green after every phase.
- Per-page before/after screenshots, both themes, both locales (Chrome DevTools).
  Bar is structural parity with improved details — refresh accepted, not pixel parity.
- CV print preview against A4 (hard preservation requirement).
- `deploy-website.sh` dry run — orphan-pruning must still resolve all URLs.
- Contact form: success/error/sending states against the real endpoint contract.

## Out of scope

- job-directory migration (follow-up: swap its hand-rolled bridge + landing token copy
  for registry pulls).
- mail-service, infra, content changes.

## Follow-ups (not this effort)

- job-directory adopts `@v8` registry; landing app dedupes `tokens.css`.
- Additional primitives added to the registry as either project needs them.
