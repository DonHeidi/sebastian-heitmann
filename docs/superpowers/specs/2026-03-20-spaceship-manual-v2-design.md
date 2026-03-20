# V2 "Spaceship Manual" Landing Page

## Summary

Add a second visual version of the portfolio site at `/v2/` with a "spaceship manual" aesthetic — retro NASA technical precision meets modern aerospace engineering. Same content as the current site, completely different visual skin. A floating version switcher pill allows navigation between versions.

## Approach

Full page copy with reskinned styles. Each v2 component is its own file with rewritten `<style>` blocks. No shared styling between v1 and v2 beyond the version switcher component.

`v2/index.astro` includes its own:
- Complete CSS reset (duplicated from v1's `<style is:global>` block)
- V2-specific CSS custom properties and `@font-face` declarations
- IntersectionObserver script and `.reveal`/`.stagger` CSS classes (matching v1 animation behavior)
- `<head>` with same meta tags as v1, plus `<link rel="canonical" href="/">` to avoid duplicate content issues. Title: "Sebastian Heitmann — Fractional CTO"

## Visual Identity

### Color Palette

| Role              | Value                          |
|-------------------|--------------------------------|
| Background        | `#0A0E17` (deep navy-black)    |
| Surface           | `#111827` (panel backgrounds)  |
| Grid/lines        | `rgba(59, 130, 246, 0.08)`     |
| Text primary      | `#C8D6E5` (cool gray-blue)     |
| Text muted        | `rgba(200, 214, 229, 0.5)`     |
| Accent            | `#3B82F6` (bright technical blue) |
| Accent secondary  | `#F59E0B` (amber — warnings/status) |
| Danger/stamp      | `#EF4444` (decorative stamps)  |

### Typography

- **Font:** IBM Plex Mono (Regular 400, Bold 700), self-hosted WOFF2
- **Headings:** Uppercase, wide letter-spacing, bold weight
- **Body:** Regular weight, standard letter-spacing
- **All text monospaced** — no display/sans-serif mixing

### Visual Treatments

- Faint blueprint grid background (SVG pattern)
- Thin solid 1px borders (accent color) instead of glassmorphism
- Corner markers on cards (L-shaped bracket crop marks)
- Section numbering: `01 //`, `02 //`, etc. prepended to section headings
- Decorative stamps: `[CLASSIFIED]`, `[AUTHORIZED PERSONNEL]` — subtle, rotated, low opacity
- Data-style formatting for stats (tabular monospaced figures)

## Routing

- Current site: `/` (unchanged)
- New version: `/v2/` via `src/pages/v2/index.astro`

## File Structure

```
src/
├── pages/
│   ├── index.astro              # Current site (unchanged)
│   └── v2/
│       └── index.astro          # V2 landing page + v2 global styles
├── components/
│   ├── (existing components unchanged)
│   ├── version-switcher.astro   # Shared floating pill switcher
│   └── v2/
│       ├── navigation.astro
│       ├── hero.astro
│       ├── logo-section.astro
│       ├── services-section.astro
│       ├── how-i-work-section.astro
│       ├── success-stories-section.astro
│       ├── contact-section.astro
│       ├── footer.astro
│       └── typewriter.astro
public/
└── fonts/
    ├── IBMPlexMono-Regular.woff2
    └── IBMPlexMono-Bold.woff2
```

## Version Switcher

- Component: `src/components/version-switcher.astro`
- Position: `fixed`, bottom-right corner
- Behavior: Simple `<a>` link to the other version, no JS required
- On `/`: label says "Manual Edition", links to `/v2/`
- On `/v2/`: label says "Original", links to `/`
- Styling adapts to whichever page it's on (warm tone on v1, blueprint tone on v2)
- Props: `currentVersion: "v1" | "v2"` to control label/link/styling

## Fonts

- Download IBM Plex Mono Regular and Bold as WOFF2
- Place in `public/fonts/`
- `@font-face` declarations in `src/pages/v2/index.astro` global styles

## Sections (same content, new skin)

Each section maps 1:1 from the current site:

1. **Navigation** — Top bar with section anchors, monospaced, thin border-bottom
2. **Hero/Header** — Stats and headline, technical data layout, section-numbered
3. **Logo Section** — Credibility strip, bordered grid of logos
4. **Services** — Service tiers in bordered cards with corner markers
5. **How I Work** — 4-step process, numbered steps. V2 includes its own typewriter component (`src/components/v2/typewriter.astro`) using IBM Plex Mono instead of AntonSC
6. **Success Stories** — Case cards in bordered containers
7. **Contact** — Form with technical-style input fields (thin borders, monospaced placeholders)
8. **Footer** — Links and socials, minimal, bordered top

## Out of Scope

- Content changes (copy stays identical)
- Case detail pages (`/cases/[id]`) — only the landing page gets a v2
- Mobile-specific design variations beyond standard responsive behavior
