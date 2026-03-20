# V4 — Swiss Editorial Design Spec

## Overview

A light-theme, editorial-grid version of the portfolio site at `/v4`. Inspired by Swiss poster design and Bloomberg-style editorial layouts. Uses condensed sans-serif display type paired with a refined serif body — the strongest possible contrast to the dark, tech-forward v1/v2/v3 versions.

Same section structure and content as v1-v3. Different visual language.

## Design System

### Color Palette

| Role | Variable | Value | Usage |
|------|----------|-------|-------|
| Background | `--clr-bg-primary` | `#FAFAF7` | Page background — warm off-white |
| Surface | `--clr-bg-surface` | `#F0EDE8` | Subtle card/section lift |
| Text primary | `--clr-text-primary` | `#1A1A18` | Headlines, body — warm near-black |
| Text secondary | `--clr-text-muted` | `#6B6862` | Descriptions, muted copy |
| Accent | `--clr-accent` | `#C8102E` | Deep vermillion — sparingly used |
| Border | `--clr-border` | `#1A1A18` | Thin black rules (1px) |
| Border light | `--clr-border-light` | `rgba(26, 26, 24, 0.12)` | Subtle dividers |
| White | `--clr-white` | `#FFFFFF` | Card backgrounds, button text |

### Typography

| Role | Font | Weight | Size (desktop) | Details |
|------|------|--------|----------------|---------|
| Display | Bebas Neue | 400 | 72–96px | Condensed uppercase, tight leading (0.95) |
| Body | Libre Baskerville | 400 | 18–20px | Refined serif, line-height 1.65 |
| Body bold | Libre Baskerville | 700 | 18–20px | Emphasis within body text |
| Labels | Bebas Neue | 400 | 11–14px | Uppercase, letter-spacing 0.15em |

Self-hosted as WOFF2 in `public/fonts/`. Subset to latin + latin-ext.

### Spacing

- Section gaps: 120px
- Group gaps: 48px
- Element gaps: 16–24px
- Horizontal padding: 144px → 80px (≤1440px) → 2rem (≤768px) → 1.25rem (≤375px)

### Visual Rules

- **Thin rules, not cards.** 1px solid black rules separate sections. No glassmorphism, no gradients, no blur.
- **Square corners everywhere.** 0px border-radius on all elements (cards, buttons, inputs, photo).
- **Red used in exactly 3 places:** section numbers (01/02/03), primary CTA button, one 40px horizontal accent rule in the hero.
- **No decorative backgrounds.** White space does the work.
- **No colored stats.** All stats in black except the first number (red).

## Components

### Navigation

- Full-width, thin 1px rule below
- Logo left: "sebastian-heitmann.dev" in Bebas Neue, uppercase
- Links right: "SERVICES", "PROCESS", "RESULTS" in Bebas Neue 14px, letter-spacing 0.15em
- Contact CTA: underlined text only, no pill/button shape
- Background: transparent (page background shows through)

### Hero

Two-column asymmetric layout on a conceptual 12-column grid.

**Left column (7 cols):**
- Name: Bebas Neue 96px, `line-height: 0.95`, `letter-spacing: -1px`
- Role: Libre Baskerville italic 24px, `color: var(--clr-text-muted)`
- Red accent rule: 40px wide, 3px thick, separating headline group from body
- Body text: Libre Baskerville 20px, max-width 480px, `line-height: 1.65`
- Stats row: numbers in Bebas Neue 48px (all black, first number red), labels in Bebas Neue 11px with 0.15em tracking, separated by 1px vertical dividers (32px tall)
- CTAs: primary = solid `#C8102E` background, white Bebas Neue text, square corners, `padding: 16px 40px`. Secondary = plain Libre Baskerville text with `→` arrow

**Right column (4 cols, 1 col gutter):**
- Photo: 280×340px, square crop (no border-radius), no rotation, `filter: saturate(0.85) contrast(1.05)`
- Subtle `box-shadow: 0 2px 20px rgba(0,0,0,0.08)`
- Social icons below: horizontal row, black, 20px, no rotation, `opacity: 0.5`, hover to 1

### Logo Bar

- Full-width thin 1px rule top and bottom
- No background treatment — transparent
- Labels: Bebas Neue 11px uppercase, 0.15em tracking, `color: var(--clr-text-muted)`
- Company names: Libre Baskerville 16px, regular weight, `opacity: 0.4`, hover to 0.6
- Layout: row with vertical 1px divider between groups (same as v1)

### Services Section

**Header:**
- Overline: Bebas Neue 14px uppercase with tracking, "WHAT I OFFER"
- Headline: Bebas Neue 72px, "How I Help"
- Description: Libre Baskerville 20px, `color: var(--clr-text-muted)`, max-width 500px

**Service blocks** (no card backgrounds — separated by thin rules):
- Section number: Bebas Neue 20px, `color: var(--clr-accent)` (red)
- Title: Bebas Neue 32px
- Description: Libre Baskerville 20px, `color: var(--clr-text-muted)`
- Bullets: Libre Baskerville 18px, preceded by em dash `—`, no colored dots
- "Ideal for" line: Libre Baskerville italic 16px, `color: var(--clr-text-muted)`
- Two-column grid layout per block (description left, bullets right) — same as v1

**Engagement models** (horizontal strips, no card backgrounds):
- Thin 1px rule between each strip
- Left: title in Bebas Neue 24px, description in Libre Baskerville 18px
- Right: price in Bebas Neue 40px, unit in Libre Baskerville 18px
- Featured plan: 3px red left border (the only color in this section besides the section numbers)

**Decorative text block:**
- "THE RIGHT PLAN FOR YOUR BUSINESS" in Bebas Neue
- `color: rgba(26, 26, 24, 0.06)` — barely visible, black-on-white version of v1's treatment

**CTA:**
- "Not sure which fits? Let's talk." in Libre Baskerville
- Button: solid red, square corners, white Bebas Neue text

### How I Work Section

**Header:**
- Overline: Bebas Neue 14px uppercase, "HOW I WORK"
- Headline: Typewriter component (same text as v1) styled in Bebas Neue 56px
- Description: Libre Baskerville 18px, muted

**Four cards in a row:**
- Background: `#FFFFFF`
- Border: 1px solid `#1A1A18`
- Border-radius: 0 (square)
- Step number: Bebas Neue 64px, `color: rgba(26, 26, 24, 0.08)`
- Title: Bebas Neue 28px
- Description: Libre Baskerville 16px, `color: var(--clr-text-muted)`, `line-height: 1.65`
- First card only: 3px red top-border accent
- No colored accent bars on other cards — just the border

### Success Stories Section

**Layout:** 2×2 grid (not horizontal scroll). Each card ~equal width.

**Vertical text:** "SUCCESS STORY" in Bebas Neue, `color: rgba(26, 26, 24, 0.06)` — very faint, same position as v1

**Cards:**
- Background: `#FFFFFF`
- Border: 1px solid `rgba(26, 26, 24, 0.12)`
- Border-radius: 0
- Metric: Bebas Neue 32px, red for the number
- Title: Bebas Neue 20px uppercase
- Description: Libre Baskerville 16px, `color: var(--clr-text-muted)`
- Tag: Bebas Neue 11px uppercase with 0.15em tracking, preceded by a red dot (6px), no pill background

**Gradient image placeholders:** Subtle warm gradient `linear-gradient(135deg, rgba(200, 16, 46, 0.06), #FAFAF7 70%)` — red tint version

**CTA:** Same red button style

### Contact Section

- Centered layout
- Headline: Bebas Neue 96px, "Let's Talk"
- Subtitle: Libre Baskerville italic 18px, `color: var(--clr-text-muted)`
- Form inputs: 1px solid `rgba(26, 26, 24, 0.2)` border, 0 border-radius, white background, no blur
- Focus state: `border-color: var(--clr-accent)`
- Labels: Bebas Neue 11px uppercase, 0.15em tracking
- Input text: Libre Baskerville 16px
- Placeholder: `color: rgba(26, 26, 24, 0.3)`
- Select dropdown: same treatment, custom chevron icon
- Submit button: solid `#C8102E`, square corners, white Bebas Neue text, `padding: 16px 48px`
- Hover: slightly darker red (`#A80D25`)

### Footer

- Thin 1px rule top
- Background: `#F0EDE8` (surface color — subtle distinction from page)
- Three-column layout: brand left, links center, socials right
- Logo: Bebas Neue 22px
- Tagline: Libre Baskerville 13px, muted
- Links: Libre Baskerville 14px, `color: var(--clr-text-muted)`, hover to primary
- Social icons: black, 20px, `opacity: 0.4`, hover to 0.8
- Copyright/legal: Libre Baskerville 12px, muted
- "Built with" line: Libre Baskerville 11px, very muted

## Version Switcher

Add v4 entry to the versions array:

```js
{ id: 'v4', href: '/v4/', label: 'Editorial' }
```

Update `type Props` to include `'v4'`:

```ts
type Props = {
    currentVersion: 'v1' | 'v2' | 'v3' | 'v4';
}
```

New link style for `--v4`:

```scss
&__link--v4 {
    background: rgba(250, 250, 247, 0.95);
    border: 1px solid rgba(26, 26, 24, 0.15);
    color: rgba(26, 26, 24, 0.6);
    font-family: 'Libre Baskerville', serif;

    .version-switcher__dot { background: #C8102E; }
}
```

All other version pages (v1, v2, v3) need their VersionSwitcher to show v4 links.

## Scroll Animations

Same IntersectionObserver pattern as v1-v3, but subtler:

```scss
.reveal {
    opacity: 0;
    transform: translateY(12px); /* 12px instead of 20px — more restrained */
    transition: opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1),
                transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
}
```

Stagger children use `translateY(10px)`.

## File Structure

```
src/
├── pages/v4/index.astro              # Page + global styles + font-face + scroll script
├── components/v4/
│   ├── navigation.astro              # Masthead-style nav
│   ├── hero.astro                    # Asymmetric two-column hero
│   ├── logo-section.astro            # Company names between rules
│   ├── services-section.astro        # Services + engagement models
│   ├── how-i-work-section.astro      # 4-step process cards
│   ├── success-stories-section.astro # 2×2 grid case studies
│   ├── contact-section.astro         # Centered form
│   └── footer.astro                  # Minimal footer
```

Each component is self-contained with scoped SCSS (same pattern as v1-v3). Typewriter component is reused from `src/components/copy/typewriter.astro`.

## Responsive Behavior

Same breakpoints as v1-v3: 1440px, 768px, 375px.

Key mobile adaptations:
- Hero: stacks to single column, headline drops to ~48px
- Services grid: single column
- How I Work cards: stack vertically
- Success Stories: 1-column stack (no scroll)
- Contact form rows: stack to single column
- Navigation: stacks logo above links

## What This Version Does NOT Have

- No decorative backgrounds (no grid SVG, no radial gradients, no starfield, no scanlines)
- No glassmorphism or backdrop-filter
- No rounded corners anywhere
- No colored stat numbers (except the first, in red)
- No colored accent bars per section (only red, only in specific places)
- No rotation on photo or social icons
- No horizontal scroll on success stories
