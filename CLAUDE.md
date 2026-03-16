# Sebastian Heitmann - Personal Portfolio Site

## Project Overview

Astro-based personal portfolio/fractional CTO landing page for Sebastian Heitmann.

## Tech Stack

- **Framework:** Astro 6
- **Runtime/Package Manager:** Bun (managed via mise)
- **Styling:** Scoped SCSS in components, CSS custom properties for theming
- **Icons:** astro-icon with @iconify-json/mdi and @iconify-json/simple-icons
- **Fonts:** Anton, AntonSC (display), SpaceGrotesk (body) — self-hosted in public/fonts/

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
├── pages/index.astro              # Main landing page + global styles
├── components/
│   ├── header.astro               # Hero section
│   ├── navigation.astro           # Top nav bar
│   ├── logo-section.astro         # Trust/company logos
│   ├── highlight-section.astro    # Feature highlights grid
│   ├── highlight.astro            # Individual highlight card
│   ├── use-cases.astro            # Use cases section
│   ├── grid-background-container.astro  # Reusable grid background
│   ├── copy/                      # Typography components
│   │   ├── headline.astro         # H1-H6, supports `element` and `as` props
│   │   ├── body.astro             # Body text
│   │   ├── overline.astro         # Labels/overlines
│   │   ├── highlight.astro        # Inline color highlights (magenta/blue/green)
│   │   └── typewriter.astro       # Animated typing effect
│   └── interactive/
│       └── call-to-action.astro   # CTA button (primary/secondary variants)
├── assets/                        # Images (profile photo, logos)
public/fonts/                      # Self-hosted font files
```

## Conventions

### Commit Messages

Uses conventional commits via commitizen (cz-conventional-changelog):
- `feat(scope): description` for features
- `fix(scope): description` for bug fixes
- `refactor(scope): description` for refactors
- `cicd(scope): description` for CI/CD changes

### Component Patterns

- Typography components (Headline, Body, Overline) accept `element` prop for HTML tag and `as` prop for visual styling
- Color highlights use three brand colors: magenta (#FF007B), blue (#00B7FF), green (#00E08E)
- Dark theme with primary background #111222
- Responsive breakpoints: 1440px, 768px, 375px
- Scoped SCSS `<style>` blocks per component — no global CSS files beyond index.astro

### Design System

- CSS custom properties for colors (`--clr-magenta`, `--clr-blue`, `--clr-green`, `--clr-bg-primary`, `--clr-white`)
- Glassmorphism effects via backdrop-filter
- Grid-based decorative backgrounds
- Responsive font sizing with per-breakpoint scales
