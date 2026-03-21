# Sebastian Heitmann - Personal Portfolio Site

## Project Overview

Astro-based personal portfolio/fractional CTO landing page for Sebastian Heitmann. Precision Swiss design with light/dark mode support.

## Tech Stack

- **Framework:** Astro 6
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
├── pages/
│   ├── index.astro              # Main landing page + global styles + theme variables
│   └── cases/[id].astro         # Case study detail pages
├── components/
│   ├── navigation.astro         # Top nav bar with theme toggle
│   ├── hero.astro               # Hero section with sidebar metadata
│   ├── logo-section.astro       # Trust/company logos
│   ├── situations-section.astro # "When to reach out" section
│   ├── proof-section.astro      # Results, testimonials, engagement pricing
│   ├── contact-section.astro    # Contact form
│   └── footer.astro             # Footer with social links
├── assets/                      # Images (profile photo, logos)
├── content/cases/               # Case study markdown files
public/fonts/                    # Self-hosted IBM Plex Mono font files
```

## Conventions

### Commit Messages

Uses conventional commits via commitizen (cz-conventional-changelog):
- `feat(scope): description` for features
- `fix(scope): description` for bug fixes
- `refactor(scope): description` for refactors
- `cicd(scope): description` for CI/CD changes

### Component Patterns

- All components use `--v8-*` CSS custom properties that adapt to light/dark mode
- Responsive breakpoints: 1440px, 768px, 375px
- Scoped SCSS `<style>` blocks per component — no global CSS files beyond index.astro

### Design System

- **Light/dark mode:** Controlled by `html.dark` / `html.light` class. Inline script in `<head>` reads localStorage, falls back to `prefers-color-scheme`. Toggle button in navigation.
- **CSS custom properties:** `--v8-bg`, `--v8-text`, `--v8-accent`, `--v8-border`, `--v8-font-display`, `--v8-font-body`, `--v8-font-mono`
- **Dark accent:** #FF3B00 (orange-red), **Light accent:** #B82A00 (deep red)
- **Status color:** Dark: #00DC82, Light: #1A7A52
- Responsive font sizing with per-breakpoint scales
