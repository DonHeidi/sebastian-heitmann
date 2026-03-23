# Sebastian Heitmann — Monorepo

## Project Overview

Bun workspaces monorepo containing the personal portfolio website and supporting services.

## Monorepo Structure

```
apps/
├── website/          # Astro 6 portfolio site
└── mail-service/     # Scaleway serverless contact form handler
docs/                 # Shared project documentation
```

## Tech Stack

- **Runtime/Package Manager:** Bun (managed via mise) with workspaces
- **Website:** Astro 6, SCSS, TypeScript
- **Mail Service:** TypeScript, Scaleway Transactional Email API

## Commands

```bash
bun install                          # Install all workspace dependencies

# Website
cd apps/website
bun run dev                          # Start dev server
bun run build                        # Production build
bun run preview                      # Preview production build

# Mail Service
cd apps/mail-service
bun run build                        # Bundle for deployment
```

---

## Website (`apps/website/`)

Astro-based personal portfolio/fractional CTO landing page. Precision Swiss design with light/dark mode and multi-locale support (en-us, en-gb, de-de).

### Website Structure

```
apps/website/
├── src/
│   ├── i18n/                    # Locale string files and types
│   ├── layouts/Layout.astro     # Shared HTML shell, head, theme, hreflang
│   ├── pages/                   # Locale-prefixed page routes
│   ├── components/              # All accept strings as props
│   ├── content/cases/           # Case studies per locale
│   └── assets/                  # Images
├── public/fonts/                # Self-hosted IBM Plex Mono
├── astro.config.mjs
└── package.json
```

### Internationalization (i18n)

| Locale | URL | Default |
|--------|-----|---------|
| en-us | `/` (no prefix) | Yes |
| en-gb | `/en-gb/` | No |
| de-de | `/de-de/` | No |

- UI strings in `src/i18n/{locale}.ts` — typed with shared `Strings` interface
- Components receive string sections as props
- Case studies in `src/content/cases/{locale}/`
- First-visit redirect detects `navigator.language`, redirects once (localStorage)
- Language picker: inline segmented control (US/GB/DE)

### Fonts

Instrument Serif (display), DM Sans (body) via Google Fonts; IBM Plex Mono (mono) self-hosted.

### Design System

- **Light/dark mode:** `html.dark` / `html.light` class, three-option toggle (system/light/dark)
- **CSS custom properties:** `--v8-bg`, `--v8-text`, `--v8-accent`, `--v8-border`, `--v8-font-display`, `--v8-font-body`, `--v8-font-mono`
- **Dark accent:** #FF3B00, **Light accent:** #B82A00
- Responsive breakpoints: 1440px, 1024px, 768px, 375px

---

## Mail Service (`apps/mail-service/`)

Scaleway serverless function that receives contact form submissions and sends emails via Scaleway Transactional Email API.

### Environment Variables

| Variable | Description |
|----------|-------------|
| `SCW_SECRET_KEY` | Scaleway API secret key |
| `SCW_PROJECT_ID` | Scaleway project ID |
| `MAIL_RECIPIENT` | Email address to receive contact form messages |
| `MAIL_SENDER` | Sender email address (must be verified in Scaleway) |

---

## Conventions

### Commit Messages

Uses conventional commits:
- `feat(scope): description` for features
- `fix(scope): description` for bug fixes
- `refactor(scope): description` for refactors
- `cicd(scope): description` for CI/CD changes

### Component Patterns

- All components use `--v8-*` CSS custom properties that adapt to light/dark mode
- Components accept typed string props — no hardcoded user-visible text
- Scoped SCSS `<style>` blocks per component
