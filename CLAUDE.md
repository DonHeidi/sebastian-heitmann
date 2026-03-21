# Sebastian Heitmann - Personal Portfolio Site

## Project Overview

Astro-based personal portfolio/fractional CTO landing page for Sebastian Heitmann. Precision Swiss design with light/dark mode and multi-locale support (en-us, en-gb, de-de).

## Tech Stack

- **Framework:** Astro 6 with built-in i18n routing
- **Runtime/Package Manager:** Bun (managed via mise)
- **Styling:** Scoped SCSS in components, CSS custom properties for theming
- **Fonts:** Instrument Serif (display), DM Sans (body) via Google Fonts; IBM Plex Mono (mono) self-hosted in public/fonts/

## Commands

```bash
bun run dev       # Start dev server
bun run build     # Production build
bun run preview   # Preview production build
bun install       # Install dependencies
```

## Project Structure

```
src/
├── i18n/
│   ├── types.ts              # Strings interface (shared shape for all locales)
│   ├── utils.ts              # getStrings(), Locale type, localeConfig
│   ├── en-us.ts              # US English strings
│   ├── en-gb.ts              # British English strings
│   └── de-de.ts              # German strings
├── layouts/
│   └── Layout.astro          # Shared HTML shell, head, theme, hreflang, redirect
├── pages/
│   ├── index.astro           # en-us homepage (default locale, no prefix)
│   ├── cases/[id].astro      # en-us case detail
│   ├── en-gb/
│   │   ├── index.astro       # en-gb homepage
│   │   └── cases/[id].astro  # en-gb case detail
│   └── de-de/
│       ├── index.astro       # de-de homepage
│       └── cases/[id].astro  # de-de case detail
├── components/               # All accept strings as props
│   ├── navigation.astro      # Nav bar with language picker, theme toggle, CTA
│   ├── hero.astro            # Hero section with sidebar metadata
│   ├── logo-section.astro    # Trust/company logos
│   ├── situations-section.astro
│   ├── proof-section.astro   # Results, testimonials, engagement pricing
│   ├── contact-section.astro # Contact form
│   └── footer.astro          # Footer with social links
├── content/cases/
│   ├── en-us/                # US English case studies
│   ├── en-gb/                # British English case studies
│   └── de-de/                # German case studies
├── assets/                   # Images (profile photo, logos)
public/fonts/                 # Self-hosted IBM Plex Mono font files
```

## Internationalization (i18n)

### Locales

| Locale | URL | Default |
|--------|-----|---------|
| en-us | `/` (no prefix) | Yes |
| en-gb | `/en-gb/` | No |
| de-de | `/de-de/` | No |

### How it works

- Astro i18n routing configured in `astro.config.mjs` with `prefixDefaultLocale: false`
- UI strings live in `src/i18n/{locale}.ts` — typed with shared `Strings` interface
- Components receive string sections as props (e.g., `hero={s.hero}`)
- Pages are thin wrappers: get locale via `Astro.currentLocale`, call `getStrings(locale)`, pass to components
- Case studies in `src/content/cases/{locale}/` — filtered by locale prefix in `getStaticPaths`
- First-visit redirect: inline script on default locale pages detects `navigator.language` and redirects once (stored in localStorage)
- Language picker in nav with flag + label dropdown

### Adding a new locale

1. Add locale to `astro.config.mjs` `i18n.locales`
2. Add to `Locale` type in `src/i18n/utils.ts`
3. Create `src/i18n/{new-locale}.ts` implementing the `Strings` interface
4. Add entry in `localeConfig` in utils.ts
5. Create `src/pages/{new-locale}/index.astro` and `cases/[id].astro`
6. Create `src/content/cases/{new-locale}/` with case study files
7. Update hreflang alternates in all page files

## Conventions

### Commit Messages

Uses conventional commits via commitizen (cz-conventional-changelog):
- `feat(scope): description` for features
- `fix(scope): description` for bug fixes
- `refactor(scope): description` for refactors
- `cicd(scope): description` for CI/CD changes

### Component Patterns

- All components use `--v8-*` CSS custom properties that adapt to light/dark mode
- Components accept typed string props — no hardcoded user-visible text
- Responsive breakpoints: 1440px, 768px, 375px
- Scoped SCSS `<style>` blocks per component

### Design System

- **Light/dark mode:** Controlled by `html.dark` / `html.light` class. Inline script in `<head>` reads localStorage, falls back to `prefers-color-scheme`. Three-option toggle (system/light/dark) in navigation.
- **CSS custom properties:** `--v8-bg`, `--v8-text`, `--v8-accent`, `--v8-border`, `--v8-font-display`, `--v8-font-body`, `--v8-font-mono`
- **Dark accent:** #FF3B00 (orange-red), **Light accent:** #B82A00 (deep red)
- **Status color:** Dark: #00DC82, Light: #1A7A52
- Responsive font sizing with per-breakpoint scales
