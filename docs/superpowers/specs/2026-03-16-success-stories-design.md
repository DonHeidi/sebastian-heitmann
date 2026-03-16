# Success Stories Section — Design Spec

## Overview

Add a "Success Stories" section to the portfolio site showcasing case studies in a staggered 2-column card grid with large vertical text, plus individual detail pages for each story.

## Content Collection

**Location:** `src/content/cases/`

Astro Content Collection with Zod schema defining:

- `title` (string) — project name (e.g. "DDP - APP")
- `subtitle` (string) — short label (e.g. "LOREM IPSUM")
- `excerpt` (string) — brief description for the card
- `image` (string) — path to image asset in `src/assets/cases/`
- `order` (number) — controls position in the grid

Markdown body is rendered on the detail page.

**Placeholder entries:** 4 stories with placeholder text and images.

## Components

### `success-stories-section.astro`

**Purpose:** Full section component added to `index.astro` after `HighlightSection`.

**Layout:**
- CSS Grid with two areas: vertical text column (narrow) and card grid column
- Vertical text "SUCCESS STORY" on the left, using `writing-mode: vertical-lr` + `transform: rotate(180deg)` to read bottom-to-top
- Vertical text uses `AntonSC` font, large size, rgba white with low opacity for subtlety
- Card grid is a 2-column layout with staggered rows (left column offset upward, right column offset downward via `margin-top` or grid row offsets)
- "BOOK A CALL" CTA centered below the grid, using existing `CallToAction` component
- Section padding follows existing pattern: ~144px inline, 6rem block

**Responsive:**
- Desktop (>1440px): full layout with large vertical text
- Tablet (768px): vertical text shrinks, grid gaps reduce
- Mobile (375px): vertical text stays but smaller, single column grid, stagger removed

### `success-story-card.astro`

**Props:** `title`, `subtitle`, `excerpt`, `image`, `slug`

**Visual treatment:**
- Glassmorphism: `backdrop-filter: blur(14px)`, `background: rgba(22, 24, 48, 0.7)`, `border: 1px solid rgba(255, 255, 255, 0.04)`
- Image at top with border-radius matching card corners
- Title in `AntonSC` font
- Body text in `SpaceGrotesk`
- "READ MORE.." link at bottom styled with underline and arrow, linking to `/cases/[slug]`
- Hover: `translateY(-6px)` with enhanced shadow, consistent with existing highlight cards
- Multi-layer box shadow matching existing card patterns

### `src/pages/cases/[slug].astro`

**Purpose:** Dynamic detail page for each success story.

**Layout:**
- Navigation at top (reuse existing `Navigation` component)
- Full-width hero image
- Title and subtitle using existing `Headline` component
- Rendered markdown body using existing `Body` typography styles
- Back link to home page
- Same dark theme with `GridBackgroundContainer`
- Uses `getStaticPaths()` from the content collection

## Assets

**Placeholder images:** 4 images in `src/assets/cases/` — will use the existing `fb.jpg` asset duplicated or generic placeholder images.

## Integration

- Import and add `SuccessStoriesSection` to `src/pages/index.astro` after `HighlightSection` (before `UseCases`)
- Content collection config in `src/content.config.ts` (or existing config file)

## Design Tokens

All styling uses existing CSS custom properties:
- `--clr-magenta`, `--clr-blue`, `--clr-green` for accents
- `--clr-bg-primary` (#111222) for backgrounds
- `--clr-white` for text
- Glassmorphism values consistent with `highlight.astro` patterns
- Responsive breakpoints: 1440px, 768px, 375px
