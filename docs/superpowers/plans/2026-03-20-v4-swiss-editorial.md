# V4 Swiss Editorial Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a v4 Swiss Editorial light-theme version of the portfolio at `/v4` with Bebas Neue + Libre Baskerville, deep vermillion accent, and editorial grid layout.

**Architecture:** Self-contained Astro page at `src/pages/v4/index.astro` with 8 scoped components in `src/components/v4/`. Same content as v1-v3, different visual language. Reuses the shared `version-switcher.astro` and `copy/typewriter.astro` components.

**Tech Stack:** Astro 6, scoped SCSS, self-hosted WOFF2 fonts, CSS grid

**Spec:** `docs/superpowers/specs/2026-03-20-swiss-editorial-v4-design.md`

---

### Task 1: Download and Commit Font Files

**Files:**
- Create: `public/fonts/BebasNeue-Regular.woff2`
- Create: `public/fonts/LibreBaskerville-Regular.woff2`
- Create: `public/fonts/LibreBaskerville-Bold.woff2`
- Create: `public/fonts/LibreBaskerville-Italic.woff2`

- [ ] **Step 1: Download Bebas Neue Regular as WOFF2**

Download from Google Fonts API (latin + latin-ext subsets):

```bash
curl -o public/fonts/BebasNeue-Regular.woff2 \
  "https://fonts.gstatic.com/s/bebasneue/v14/JTUSjIg69CK48gW7PXoo9Wlhyw.woff2"
```

If the direct URL doesn't work, use `npx google-font-installer` or download from https://fonts.google.com/specimen/Bebas+Neue, convert with `woff2_compress`, and place in `public/fonts/`.

- [ ] **Step 2: Download Libre Baskerville Regular, Bold, Italic as WOFF2**

```bash
curl -o public/fonts/LibreBaskerville-Regular.woff2 \
  "https://fonts.gstatic.com/s/librebaskerville/v14/kmKnZrc3Hgbbcjq75U4uslyuy4kn0pNeYRI4CN2V.woff2"
curl -o public/fonts/LibreBaskerville-Bold.woff2 \
  "https://fonts.gstatic.com/s/librebaskerville/v14/kmKiZrc3Hgbbcjq75U4uslyuy4kn0qNcaxYaDc2V2ro.woff2"
curl -o public/fonts/LibreBaskerville-Italic.woff2 \
  "https://fonts.gstatic.com/s/librebaskerville/v14/kmKhZrc3Hgbbcjq75U4uslyuy4kn0qNcWxcQDI-JGxPY.woff2"
```

- [ ] **Step 3: Verify all 4 files exist and are non-empty**

```bash
ls -la public/fonts/BebasNeue-Regular.woff2 public/fonts/LibreBaskerville-*.woff2
```

Expected: 4 files, each > 10KB.

- [ ] **Step 4: Commit**

```bash
git add public/fonts/BebasNeue-Regular.woff2 public/fonts/LibreBaskerville-*.woff2
git commit -m "feat(v4): add Bebas Neue and Libre Baskerville font files"
```

---

### Task 2: Create Page Scaffold and Version Switcher Update

**Files:**
- Create: `src/pages/v4/index.astro`
- Modify: `src/components/version-switcher.astro`

This task creates the page shell with global styles, CSS variables, font-face declarations, and the scroll animation script. It also updates the shared version switcher to include v4.

- [ ] **Step 1: Create `src/pages/v4/index.astro`**

Model after `src/pages/v3/index.astro` for structure. Key differences:
- Font-face declarations for Bebas Neue (400) and Libre Baskerville (400, 700, italic)
- CSS variables from spec: `--clr-bg-primary: #FAFAF7`, `--clr-bg-surface: #F0EDE8`, `--clr-text-primary: #1A1A18`, `--clr-text-muted: #6B6862`, `--clr-accent: #C8102E`, `--clr-border: #1A1A18`, `--clr-border-light: rgba(26, 26, 24, 0.12)`, `--clr-white: #FFFFFF`
- Body background: `#FAFAF7` — no decorative backgrounds, no gradients, no grid SVG
- Body color: `var(--clr-text-primary)`
- Reveal animation uses `translateY(12px)` instead of 20px
- Stagger uses `translateY(10px)` instead of 16px
- Include `prefers-reduced-motion` media query
- Import all v4 components from `../../components/v4/`
- Import VersionSwitcher with `currentVersion="v4"`
- Same scroll IntersectionObserver script as v1-v3

```astro
---
import Navigation from '../../components/v4/navigation.astro';
import Hero from '../../components/v4/hero.astro';
import LogoSection from '../../components/v4/logo-section.astro';
import ServicesSection from '../../components/v4/services-section.astro';
import HowIWorkSection from '../../components/v4/how-i-work-section.astro';
import SuccessStoriesSection from '../../components/v4/success-stories-section.astro';
import ContactSection from '../../components/v4/contact-section.astro';
import Footer from '../../components/v4/footer.astro';
import VersionSwitcher from '../../components/version-switcher.astro';
---
```

- [ ] **Step 2: Update `src/components/version-switcher.astro`**

Three changes per spec:

1. Update Props type to include `'v4'`
2. Add `{ id: 'v4', href: '/v4/', label: 'Editorial' }` to the versions array
3. Add `&__link--v4` SCSS block with all properties from the spec:

```scss
&__link--v4 {
    background: rgba(250, 250, 247, 0.95);
    border: 1px solid rgba(26, 26, 24, 0.15);
    color: rgba(26, 26, 24, 0.6);
    font-family: 'Libre Baskerville', serif;
    backdrop-filter: none;
    border-radius: 0;

    .version-switcher__dot { background: #C8102E; }
}
```

- [ ] **Step 3: Verify dev server starts**

```bash
bun run dev
```

Expected: Server starts. Visiting `/v4/` shows a blank page (components not yet created) but no build errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/v4/index.astro src/components/version-switcher.astro
git commit -m "feat(v4): add page scaffold with global styles and update version switcher"
```

---

### Task 3: Navigation Component

**Files:**
- Create: `src/components/v4/navigation.astro`

Reference: `src/components/navigation.astro` (v1) for content/structure.

- [ ] **Step 1: Create the component**

Key differences from v1:
- Font: Bebas Neue for logo and links (not Anton)
- Logo: uppercase
- Links: 14px with `letter-spacing: 0.15em`
- Contact CTA: `text-decoration: underline` only, no pill/border/background
- 1px rule below the nav: `border-bottom: 1px solid var(--clr-border)`
- All colors use the v4 light-theme variables
- `margin-top: 3.75rem` same as v1
- Responsive: at ≤768px logo stacks above links (flexbox column), links wrap inline, padding 2rem. At ≤375px padding 1.25rem, link font-size 12px.

- [ ] **Step 2: Verify in browser**

```bash
bun run dev
```

Visit `/v4/`. Nav should show with thin rule below, all text black on off-white.

- [ ] **Step 3: Commit**

```bash
git add src/components/v4/navigation.astro
git commit -m "feat(v4): add editorial navigation component"
```

---

### Task 4: Hero Component

**Files:**
- Create: `src/components/v4/hero.astro`

Reference: `src/components/hero.astro` (v1) for content. Same text, stats, CTAs, photo, and social links.

- [ ] **Step 1: Create the component**

Key structural differences from v1:
- CSS grid layout: `grid-template-columns: 1fr 340px; column-gap: 80px; align-items: center`
- Overline: Libre Baskerville 20px, accent words use `color: var(--clr-accent)` and `font-weight: 700` (single red color, not multi-color)
- Name: Bebas Neue 96px, `line-height: 0.95`, `letter-spacing: -1px`
- Role: Libre Baskerville italic 24px, `color: var(--clr-text-muted)`
- Red accent rule: `<div>` or `<hr>` — 40px wide, 3px thick, `background: var(--clr-accent)`
- Body: Libre Baskerville 20px, `max-width: 480px`, `line-height: 1.65`
- Stats: numbers in Bebas Neue 48px, all `color: var(--clr-text-primary)` except first which is `color: var(--clr-accent)`. Labels in Bebas Neue 11px, `letter-spacing: 0.15em`, `text-transform: uppercase`. Dividers: 1px wide, 32px tall, `background: var(--clr-border-light)`
- Primary CTA: `background: var(--clr-accent)`, `color: var(--clr-white)`, Bebas Neue, `border-radius: 0`, `padding: 16px 40px`. Hover: `background: #A80D25`
- Secondary CTA: Libre Baskerville, `color: var(--clr-text-primary)`, plain text with `→`
- Photo: `width: 100%; max-width: 280px`, `border-radius: 0`, no `transform: rotate()`, `filter: saturate(0.85) contrast(1.05)`, `box-shadow: 0 2px 20px rgba(0,0,0,0.08)`
- Social icons: no rotation, `color: var(--clr-text-primary)`, `opacity: 0.5`, hover to 1
- Responsive ≤768px: `grid-template-columns: 1fr`, headline ~48px, single column stack
- Responsive ≤375px: headline ~40px, tighter padding

- [ ] **Step 2: Verify in browser**

Visit `/v4/`. Hero should show two-column layout with large condensed type on left, square photo on right, red accent rule visible.

- [ ] **Step 3: Commit**

```bash
git add src/components/v4/hero.astro
git commit -m "feat(v4): add editorial hero component"
```

---

### Task 5: Logo Section Component

**Files:**
- Create: `src/components/v4/logo-section.astro`

Reference: `src/components/logo-section.astro` (v1) for content.

- [ ] **Step 1: Create the component**

Key differences from v1:
- `border-top: 1px solid var(--clr-border)` and `border-bottom: 1px solid var(--clr-border)` — full black rules
- No `background` or `background: linear-gradient(...)` — transparent
- Labels: Bebas Neue 11px, `text-transform: uppercase`, `letter-spacing: 0.15em`, `color: var(--clr-text-muted)`
- Company names: Libre Baskerville 16px, `color: var(--clr-text-primary)`, `opacity: 0.4`, hover `opacity: 0.6`
- Divider: `background: var(--clr-border-light)`
- Same company names: Jung von Matt, Synergy, Granny & Smith, OFFIS | Pool Position GmbH, mobilespace GmbH

- [ ] **Step 2: Verify in browser, commit**

```bash
git add src/components/v4/logo-section.astro
git commit -m "feat(v4): add editorial logo section component"
```

---

### Task 6: Services Section Component

**Files:**
- Create: `src/components/v4/services-section.astro`

Reference: `src/components/services-section.astro` (v1) for content. Same services, engagement models, and decorative text.

- [ ] **Step 1: Create the component**

This is the largest component. Key differences from v1:

**Header:**
- Overline: Bebas Neue 14px, uppercase, `letter-spacing: 0.15em`, plain text "WHAT I OFFER"
- Headline: Bebas Neue 72px
- Description: Libre Baskerville 20px, muted

**Service blocks** — no `background`, no `border-radius`, separated by 1px rules:
- Section number: Bebas Neue 20px, `color: var(--clr-accent)`
- Title: Bebas Neue 32px, `color: var(--clr-text-primary)`
- Description: Libre Baskerville 20px, `color: var(--clr-text-muted)`
- Bullets: Libre Baskerville 18px, use `—` em dash prefix instead of colored dots. `color: var(--clr-text-muted)`
- "Ideal for": Libre Baskerville italic 16px, muted
- Two-column grid per block (same as v1)

**Engagement models** — no card backgrounds:
- Thin 1px rules between strips (not card borders)
- Title: Bebas Neue 24px, desc: Libre Baskerville 18px
- Price: Bebas Neue 40px right-aligned, unit: Libre Baskerville 18px
- Featured plan: `border-left: 3px solid var(--clr-accent)`, `padding-left: 33px`

**Decorative text:** Bebas Neue, `color: rgba(26, 26, 24, 0.06)`

**CTA:** Libre Baskerville text + solid red button (same style as hero primary CTA)

- [ ] **Step 2: Verify in browser, commit**

```bash
git add src/components/v4/services-section.astro
git commit -m "feat(v4): add editorial services section component"
```

---

### Task 7: How I Work Section Component

**Files:**
- Create: `src/components/v4/how-i-work-section.astro`

Reference: `src/components/how-i-work-section.astro` (v1) for content. Same 4 steps (Discovery, Strategy, Delivery, Handoff). Reuses `src/components/copy/typewriter.astro`.

- [ ] **Step 1: Create the component**

Key differences from v1:
- Import Typewriter from `../copy/typewriter.astro` (shared component, same relative path pattern)
- **IMPORTANT:** The Typewriter component has hardcoded `color: #fff` and `font-family: 'AntonSC'` in its scoped styles. These will render as white-on-white on the v4 light background. Override in the component's scoped SCSS using `:global()`:

```scss
:global(.headline) {
    font-family: 'Bebas Neue', sans-serif !important;
    color: var(--clr-text-primary) !important;
    font-size: 56px;
}
:global(.cursor) {
    background-color: var(--clr-text-primary) !important;
}
```

- Overline: Bebas Neue 14px, `text-transform: uppercase`, `letter-spacing: 0.15em`
- Typewriter headline: styled in Bebas Neue 56px via the `:global()` overrides above
- Description: Libre Baskerville 18px, muted
- Cards: `background: #FFFFFF`, `border: 1px solid #1A1A18`, `border-radius: 0`, `padding: 32px 28px`
- First card only: `border-top: 3px solid var(--clr-accent)` — others just the 1px border
- Step number: Bebas Neue 64px, `color: rgba(26, 26, 24, 0.08)`
- Title: Bebas Neue 28px, `color: var(--clr-text-primary)`
- Description: Libre Baskerville 16px, muted, `line-height: 1.65`
- No colored accent bars — just the single red top-border on card 1
- Responsive ≤768px: cards stack vertically

- [ ] **Step 2: Verify in browser, commit**

```bash
git add src/components/v4/how-i-work-section.astro
git commit -m "feat(v4): add editorial how-i-work section component"
```

---

### Task 8: Success Stories Section Component

**Files:**
- Create: `src/components/v4/success-stories-section.astro`

Reference: `src/components/success-stories-section.astro` (v1) for content. Same 4 case studies.

- [ ] **Step 1: Create the component**

Key differences from v1:
- **Layout: 2×2 grid** instead of horizontal scroll: `display: grid; grid-template-columns: 1fr 1fr; gap: 20px`
- Vertical text: Bebas Neue, `color: rgba(26, 26, 24, 0.06)` — very faint on light background
- Cards: `background: #FFFFFF`, `border: 1px solid rgba(26, 26, 24, 0.12)`, `border-radius: 0`
- Image placeholders: `linear-gradient(135deg, rgba(200, 16, 46, 0.06), #FAFAF7 70%)` — subtle red tint
- Metric: Bebas Neue 32px, `color: var(--clr-accent)` (red)
- Title: Bebas Neue 20px, uppercase
- Description: Libre Baskerville 16px, muted
- Tag: Bebas Neue 11px, `text-transform: uppercase`, `letter-spacing: 0.15em`, no pill background. Preceded by a 6px red dot (`::before` pseudo-element)
- CTA: same red button style
- Responsive ≤768px: `grid-template-columns: 1fr` (single column stack)
- No inline `flex: 0 0 Xpx` widths on cards (grid handles sizing)

- [ ] **Step 2: Verify in browser, commit**

```bash
git add src/components/v4/success-stories-section.astro
git commit -m "feat(v4): add editorial success stories section component"
```

---

### Task 9: Contact Section Component

**Files:**
- Create: `src/components/v4/contact-section.astro`

Reference: `src/components/contact-section.astro` (v1) for content. Same form fields.

- [ ] **Step 1: Create the component**

Key differences from v1:
- Headline: Bebas Neue 96px, `color: var(--clr-text-primary)`
- Subtitle: Libre Baskerville italic 18px, muted
- Labels: Bebas Neue 11px, `text-transform: uppercase`, `letter-spacing: 0.15em`
- Inputs: `border: 1px solid rgba(26, 26, 24, 0.2)`, `border-radius: 0`, `background: #FFFFFF`, no `backdrop-filter`
- Input text: Libre Baskerville 16px, `color: var(--clr-text-primary)`
- Placeholder: `color: rgba(26, 26, 24, 0.3)`
- Focus: `border-color: var(--clr-accent)`
- Select: same treatment as inputs, custom chevron icon via `astro-icon`
- Textarea: same treatment
- Submit: `background: var(--clr-accent)`, `border-radius: 0`, `color: var(--clr-white)`, Bebas Neue 20px, `padding: 16px 48px`. Hover: `background: #A80D25`
- Responsive ≤768px: form rows stack, headline ~48px
- Responsive ≤375px: headline ~40px

- [ ] **Step 2: Verify in browser, commit**

```bash
git add src/components/v4/contact-section.astro
git commit -m "feat(v4): add editorial contact section component"
```

---

### Task 10: Footer Component

**Files:**
- Create: `src/components/v4/footer.astro`

Reference: `src/components/footer.astro` (v1) for content. Same links, socials, legal.

- [ ] **Step 1: Create the component**

Key differences from v1:
- `border-top: 1px solid var(--clr-border-light)`
- `background: var(--clr-bg-surface)` (#F0EDE8)
- Logo: Bebas Neue 22px, `color: var(--clr-text-primary)`
- Tagline: Libre Baskerville 13px, muted
- Links: Libre Baskerville 14px, muted, hover to primary
- Social icons: `color: var(--clr-text-primary)`, `opacity: 0.4`, hover to 0.8
- Copyright: Libre Baskerville 12px, muted
- Legal links: same
- "Built with" line: Libre Baskerville 11px, very muted
- Responsive: same stacking behavior as v1

- [ ] **Step 2: Verify in browser, commit**

```bash
git add src/components/v4/footer.astro
git commit -m "feat(v4): add editorial footer component"
```

---

### Task 11: Visual Review and Polish

**Files:**
- Modify: any v4 component that needs adjustment

- [ ] **Step 1: Full-page visual review at desktop (1440px)**

```bash
bun run dev
```

Visit `/v4/` and check each section against the spec. Key things to verify:
- Off-white background, no dark elements bleeding through
- Bebas Neue condensed headlines render correctly (not fallback)
- Libre Baskerville body text renders correctly (not fallback)
- Red accent appears only in permitted locations
- All borders are 1px solid, all corners are square (0px radius)
- Version switcher shows and links work (can navigate to v1/v2/v3 and back)
- Scroll reveal animations fire on scroll

- [ ] **Step 2: Mobile review at 375px**

Use browser DevTools responsive mode at 375px width. Check:
- All sections stack to single column
- Text is readable (no overflow, no tiny text)
- Navigation wraps correctly
- Hero photo stacks below text content

- [ ] **Step 3: Fix any issues found, commit**

```bash
git add -A src/components/v4/ src/pages/v4/
git commit -m "fix(v4): visual polish and responsive adjustments"
```

- [ ] **Step 4: Production build test**

```bash
bun run build
```

Expected: Build succeeds with no errors.
