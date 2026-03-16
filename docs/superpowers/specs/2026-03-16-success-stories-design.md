# Success Stories Section — Design Spec

## Overview

Add a "Success Stories" section to the portfolio site showcasing case studies in a staggered 2-column card grid with large vertical text, plus individual detail pages for each story.

## Content Collection

**Location:** `src/content/cases/`

**Config** (`src/content.config.ts`):

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const cases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cases' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    subtitle: z.string(),
    excerpt: z.string(),
    image: image(),
    order: z.number(),
  }),
});

export const collections = { cases };
```

The `image` field uses Astro's `image()` schema helper for full image optimization support with the `<Image />` component.

Each entry's `id` (derived from the filename, e.g. `ddp-app` from `ddp-app.md`) serves as the slug for routing. Note: Astro 6 uses `entry.id`, not `entry.slug`.

Markdown body is rendered on the detail page.

**Placeholder entries:** 4 stories with placeholder text and images.

## Components

### `success-stories-section.astro`

**Purpose:** Full section component added to `index.astro` after `HighlightSection`.

**Section ID:** `id="cases"` — matches the existing nav anchor `<a href="#cases">Cases</a>` in `navigation.astro`.

**Layout:**
- CSS Grid with two areas: vertical text column (narrow, ~6rem) and card grid column
- Vertical text "SUCCESS STORY" on the left, using `writing-mode: vertical-lr` + `transform: rotate(180deg)` to read bottom-to-top
- Vertical text uses `AntonSC` font, large size (~8rem), `rgba(255, 255, 255, 0.08)` for subtlety
- Card grid is a 2-column layout with stagger: right column offset downward by `6rem` via `margin-top`
- "BOOK A CALL" CTA centered below the grid, using existing `CallToAction` component (primary variant)
- Section padding follows existing pattern: ~144px inline, 6rem block

**Responsive:**
- Desktop (>1440px): full layout with large vertical text (~8rem)
- Tablet (768px): vertical text shrinks to ~4rem, grid gaps reduce, stagger offset reduces to 3rem
- Mobile (375px): vertical text ~2rem and stays vertical, single column grid, stagger removed

### `success-story-card.astro`

**Props:** `title`, `subtitle`, `excerpt`, `image` (ImageMetadata from content collection), `slug`

**Visual treatment:**
- Glassmorphism: `backdrop-filter: blur(14px)`, `background: rgba(22, 24, 48, 0.7)`, `border: 1px solid rgba(255, 255, 255, 0.04)`
- Image at top with border-radius matching card corners, rendered via Astro `<Image />` component
- Title in `AntonSC` font
- Body text in `SpaceGrotesk`
- "READ MORE.." link at bottom — a simple styled `<a>` element (not the `CallToAction` component) with underline and ` -->` appended via CSS `::after`, to avoid script overhead from reusing `CallToAction` inside repeated cards
- Hover: `translateY(-6px)` with enhanced shadow, consistent with existing highlight cards
- Multi-layer box shadow matching existing card patterns

### `src/pages/cases/[slug].astro`

**Purpose:** Dynamic detail page for each success story.

**`<head>`:** Each page includes its own `<head>` with:
- `<meta name="viewport">` and `<meta charset="utf-8">`
- `<title>{story.title} — Sebastian Heitmann</title>`
- Same font imports as `index.astro`

Note: `Navigation` is currently embedded inside `header.astro`, not used standalone. For the detail page, import `Navigation` directly — it works as a standalone component since it has no dependency on `header.astro` internals.

**Layout:**
- Navigation at top (import `Navigation` component directly)
- Full-width hero image via Astro `<Image />`
- Title and subtitle using existing `Headline` component
- Rendered markdown body using existing `Body` typography styles
- Back link to home page
- Same dark theme with `GridBackgroundContainer`
- Uses `getStaticPaths()` with `getCollection('cases')`, mapping `entry.id` as the slug param

## Assets

**Placeholder images:** 4 images in `src/assets/cases/` — will use the existing `fb.jpg` asset as placeholder for all cards initially.

## Integration

- Import and add `SuccessStoriesSection` to `src/pages/index.astro` after `HighlightSection` (before `UseCases`)
- Create `src/content.config.ts` with the schema shown above

## Design Tokens

All styling uses existing CSS custom properties:
- `--clr-magenta`, `--clr-blue`, `--clr-green` for accents
- `--clr-bg-primary` (#111222) for backgrounds
- `--clr-white` for text
- Glassmorphism values consistent with `highlight.astro` patterns
- Responsive breakpoints: 1440px, 768px, 375px
