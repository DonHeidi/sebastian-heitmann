# Plans Section — Design Spec

## Overview

Add a pricing/plans section showcasing three service tiers with colored cards, a CTA, and a large heading. The section sits after the services accordion and before the footer area.

## Section Component (`plans-section.astro`)

**Section ID:** `id="plans"` — matches the existing nav anchor `<a href="#plans">Plans</a>` in `navigation.astro`.

**Layout (top to bottom):**

1. **CTA:** "BOOK A CALL" centered, using existing `CallToAction` component (primary variant)
2. **Card grid:** 3-column grid inside `GridBackgroundContainer`, with padding above/below for breathing room
3. **Heading:** "THE RIGHT PLAN FOR YOUR BUSINESS" using `Headline` component. "RIGHT PLAN" highlighted with existing `CopyHighlight` component (magenta). Remaining text in `rgba(255, 255, 255, 0.15)` for a muted/watermark effect.

**Responsive:**
- Default: `padding-inline: 144px`, `padding-block: 6rem`, 3-column grid
- 1440px: `padding-inline: 80px`
- 768px: `padding-inline: 2rem`, `padding-block: 4rem`, single-column grid
- 375px: `padding-inline: 1.25rem`, `padding-block: 3rem`

## Card Component (`plan-card.astro`)

**Props:**
- `title` (string) — tier name
- `price` (string) — display price (e.g. "$2,500/mo")
- `features` (string[]) — list of included features
- `variant` ('magenta' | 'blue' | 'green') — card background color
- `featured` (boolean) — whether to show as the elevated/recommended card

**Visual treatment:**
- Solid background fill using variant color from CSS custom properties (`--clr-magenta`, `--clr-blue`, `--clr-green`)
- Border-radius: 12px
- Padding: ~2rem
- Title in `AntonSC` font, white
- Price in `AntonSC` font, large size, white
- Features list in `SpaceGrotesk` font, white with slight opacity
- Featured card: `transform: translateY(-1.5rem)` to appear elevated, plus a small green accent badge/tag rotated ~15deg, positioned at the top overlapping the card edge. Badge text: "Popular" or similar, using `AntonSC`, green background with glassmorphism
- Non-featured cards: standard positioning

**Placeholder content:**

1. **Starter** (magenta)
   - Price: "$2,500/mo"
   - Features: "Weekly strategy sessions", "Technical architecture review", "Team mentoring", "Code review oversight"

2. **Growth** (blue, featured)
   - Price: "$5,000/mo"
   - Features: "Everything in Starter", "Hands-on product development", "Sprint planning & delivery", "Vendor & hiring support", "Performance monitoring"

3. **Enterprise** (green)
   - Price: "$9,000/mo"
   - Features: "Everything in Growth", "Full-time embedded CTO", "Board & investor reporting", "Security & compliance oversight", "Custom integrations"

## Integration

- Import and add `PlansSection` to `src/pages/index.astro` after `ServicesSection`
- Uses existing components: `CallToAction`, `GridBackgroundContainer`, `Headline`, `CopyHighlight`

## Files

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `src/components/plan-card.astro` | Individual pricing card |
| Create | `src/components/plans-section.astro` | Section with CTA, grid, heading |
| Modify | `src/pages/index.astro` | Add PlansSection import and component |

## Design Tokens

Uses existing CSS custom properties:
- `--clr-magenta` (#FF007B), `--clr-blue` (#00B7FF), `--clr-green` (#00E08E)
- `--clr-bg-primary` (#111222)
- `--clr-white` (#fff)
- Responsive breakpoints: 1440px, 768px, 375px
