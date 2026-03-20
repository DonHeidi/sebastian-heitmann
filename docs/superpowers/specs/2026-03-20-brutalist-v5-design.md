# V5 — Brutalist / Raw Web Design Spec

## Design Direction

"The Manifesto" — the page reads like a declaration. Massive typography dominates. Sparse, confrontational, typographically driven. Signals confidence and competence through restraint. Someone who doesn't need polish to prove they ship.

## Global Foundation

### Typography

- **Font family:** Space Mono (Google Fonts, self-hosted)
- **Display:** Space Mono Bold — all headings, buttons, emphasis
- **Body:** Space Mono Regular — all body text, labels, metadata
- **No font mixing.** One family, two weights.

### Color Palette

| Token              | Value     | Role                              |
|--------------------|-----------|-----------------------------------|
| `--clr-bg`         | `#FFFFFF` | Pure white background             |
| `--clr-text`       | `#000000` | Pure black text                   |
| `--clr-accent`     | `#FF6200` | Construction orange (used sparingly) |
| `--clr-border`     | `#000000` | Structural borders                |
| `--clr-muted`      | `#666666` | Secondary/label text              |

### Spacing Rhythm

| Context       | Desktop  | Tablet   | Mobile   |
|---------------|----------|----------|----------|
| Section gaps  | `120px`  | `80px`   | `60px`   |
| Group gaps    | `48px`   | `40px`   | `32px`   |
| Element gaps  | `16px`   | `16px`   | `12px`   |

- Max content width: `1200px`, **left-aligned** within the `1440px` container (intentional asymmetry, not centered)

### Structural Rules

- Section dividers: `4px solid black`, full viewport width
- No `border-radius` anywhere — `0` on everything
- No shadows, gradients, blur, glassmorphism, or decorative elements
- Background: pure white, nothing else
- Hover states: instant `color` and `background-color` inversion, `transition: none`

### Scroll Animations

Same reveal system as other versions:

```scss
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1),
              transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
}
.reveal.revealed { opacity: 1; transform: translateY(0); }
.stagger { opacity: 0; transform: translateY(16px); }
.stagger-1 { transition-delay: 0.1s; }
.stagger-2 { transition-delay: 0.2s; }
.stagger-3 { transition-delay: 0.3s; }
.stagger-4 { transition-delay: 0.4s; }
```

---

## Navigation

- **Not sticky** — scrolls away. Content is what matters.
- Height: `60px`, content vertically centered.
- Bottom edge: `2px solid black` rule, full viewport width.
- **Left:** `SEBASTIAN HEITMANN` — Space Mono Bold, `14px`, uppercase, `letter-spacing: 0.1em`. Black.
- **Right:** Horizontal links — `WORK`, `SERVICES`, `CONTACT`. Same styling as name. No separators.
- **Hover:** White text on black background, hard cut, no transition. Padding creates rectangular hit area that fills with black.
- **Mobile:** Name left, hamburger right (three horizontal `2px` black lines, no animation). Menu drops as full-width black block with white text links stacked vertically.

---

## Hero

Sparse, confrontational, typographically dominant.

- **Name:** `SEBASTIAN HEITMANN`
  - Space Mono Bold
  - `96px` desktop / `56px` tablet / `40px` mobile
  - Uppercase, black, left-aligned
  - `line-height: 1.0`, `letter-spacing: -0.03em`
- **Role:** `FRACTIONAL CTO & PRODUCT ENGINEER`
  - Space Mono Regular, `18px`, uppercase, `letter-spacing: 0.15em`
  - Muted (`#666666`)
  - `24px` below name
- **Orange accent:** Single thick vertical bar (`6px` wide, `--clr-accent`) to the left of the role text. Only color on the viewport.
- **CTA:** `LET'S TALK`
  - `2px solid black` border, black text
  - Space Mono Bold, `14px`, uppercase, `letter-spacing: 0.1em`
  - Padding: `16px 32px`
  - Hover: inverts to white text on black fill. No transition.
  - `48px` below role text
- **Spacing:** `160px` top padding, `120px` bottom padding (desktop). Name floats in silence.
- **No image.** No profile photo. No decoration.
- **Bottom:** `4px solid black` full-width rule.

---

## Logo Section (Clients)

Company names as text, not logos.

- **Section label:** `CLIENTS` — Space Mono Regular, `12px`, uppercase, `letter-spacing: 0.2em`, muted. Left-aligned. `24px` above content.
- **Company names:** Space Mono Bold, `16px`, uppercase, `letter-spacing: 0.05em`, black.
- **Layout:** Single horizontal row on desktop, wrapping naturally. Separated by `·` (middle dot) in muted color. `32px` horizontal spacing between names.
- **Mobile:** Two columns.
- **No hover effects** — names are credentials, not links.
- **Bottom:** `4px solid black` full-width rule.
- **Padding:** `60px` top and bottom.

---

## Services Section

Vertical stack of text blocks. No cards, no grid.

- **Section label:** `SERVICES` — Space Mono Regular, `12px`, uppercase, `letter-spacing: 0.2em`, muted. Left-aligned.
- **Each service:**
  - `4px solid black` left border
  - `24px` left padding from border
  - **Name:** Space Mono Bold, `28px`, uppercase, black
  - **Description:** Space Mono Regular, `16px`, `line-height: 1.6`, black. `max-width: 640px`. `12px` below name.
  - **Engagement model:** Space Mono Regular, `13px`, muted, uppercase, `letter-spacing: 0.1em`. `8px` below description.
- **Spacing between services:** `48px`
- **Hover:** Left border shifts from black to construction orange. Instant, no transition.
- **Bottom:** `4px solid black` full-width rule.
- **Padding:** `80px` top and bottom.

---

## How I Work (Process)

Four-step numbered sequence. Linear, methodical.

- **Section label:** `PROCESS` — Space Mono Regular, `12px`, uppercase, `letter-spacing: 0.2em`, muted. Left-aligned.
- **Each step:**
  - **Number:** Space Mono Bold, `64px`, construction orange. Only use of orange in this section.
  - **Step name:** Space Mono Bold, `22px`, uppercase, black. Beside the number on desktop.
  - **Description:** Space Mono Regular, `16px`, `line-height: 1.6`, black. `max-width: 520px`. `8px` below name.
- **Layout:** Single column, left-aligned. `56px` between steps. Numbers in fixed-width left column (`80px`), text block to the right — consistent vertical lane.
- **No connecting lines, arrows, or progress indicators.** Numbers are enough.
- **Mobile:** Same two-column structure holds. Numbers shrink to `48px`.
- **Bottom:** `4px solid black` full-width rule.
- **Padding:** `80px` top and bottom.

---

## Success Stories (Work)

Case studies as dense text blocks. No images, no testimonial cards.

- **Section label:** `WORK` — Space Mono Regular, `12px`, uppercase, `letter-spacing: 0.2em`, muted. Left-aligned.
- **Each story** separated by `2px solid black` horizontal rules (thinner than section dividers — hierarchy through border weight):
  - **Company/project name:** Space Mono Bold, `20px`, uppercase, black.
  - **What was done:** Space Mono Regular, `16px`, `line-height: 1.6`, black. Two to three sentences max. `8px` below name.
  - **Key stat:** Space Mono Bold, `14px`, uppercase, construction orange, `letter-spacing: 0.1em`. `12px` below description. One stat per story (e.g., `3X REVENUE GROWTH`, `12-WEEK DELIVERY`).
- **Layout:** Vertical stack, full content width. `40px` padding top and bottom per story.
- **Hover:** Background inverts to black, all text flips to white, orange stat stays orange. Hard cut.
- **Bottom:** `4px solid black` full-width rule.
- **Padding:** `80px` top and bottom for the section.

---

## Contact Section

A brutalist form. Functional, exposed.

- **Section label:** `CONTACT` — Space Mono Regular, `12px`, uppercase, `letter-spacing: 0.2em`, muted. Left-aligned.
- **Headline:** `LET'S WORK TOGETHER`
  - Space Mono Bold, `48px` desktop / `32px` mobile, uppercase, black
  - `24px` below label
- **Form fields** stacked vertically, `32px` between them:
  - **Label:** Space Mono Regular, `12px`, uppercase, `letter-spacing: 0.15em`, black. `8px` below label.
  - **Input/textarea:** `2px solid black` border. No border-radius. Space Mono Regular, `16px`, black text. `16px` padding. White background. Full content width.
  - **Focus state:** Border thickens to `4px`. No outline glow, no color change.
  - **Fields:** `NAME`, `EMAIL`, `MESSAGE` (textarea, `160px` height)
- **No placeholder text** — labels are sufficient.
- **Submit button:** `SEND`
  - Space Mono Bold, `14px`, uppercase, `letter-spacing: 0.1em`
  - Black background, white text. `16px 48px` padding.
  - Hover: inverts to white background, black text, `2px solid black` border. No transition.
- **Bottom:** `4px solid black` full-width rule.
- **Padding:** `80px` top and bottom.

---

## Footer

Minimal. Almost an afterthought.

- **Layout:** Single row on desktop. Left and right sides.
- **Left:** `© 2026 SEBASTIAN HEITMANN` — Space Mono Regular, `12px`, uppercase, `letter-spacing: 0.1em`, muted.
- **Right:** Social links as text — `GITHUB`, `LINKEDIN`, `EMAIL`. Space Mono Regular, `12px`, uppercase, `letter-spacing: 0.1em`, black. `24px` horizontal spacing between.
- **Hover:** Invert — white text on black rectangle. No transition.
- **Mobile:** Stacks — links on top, copyright below. Left-aligned.
- **No top rule** — previous section's bottom rule serves as boundary.
- **Padding:** `40px` top and bottom. Deliberately compact.

---

## Version Switcher Updates

- Add v5 entry: `{ id: 'v5', href: '/v5/', label: 'Brutalist' }`
- Style `.version-switcher__link--v5`:
  - `border-radius: 0`
  - `backdrop-filter: none`
  - Space Mono font
  - Dot color: `#FF6200` (construction orange)

---

## Font Files Required

- `public/fonts/SpaceMono-Regular.woff2`
- `public/fonts/SpaceMono-Bold.woff2`

Source: Google Fonts (OFL license)

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/pages/v5/index.astro` | Page scaffold, global styles, CSS custom properties |
| `src/components/v5/navigation.astro` | Top nav bar |
| `src/components/v5/hero.astro` | Hero section |
| `src/components/v5/logo-section.astro` | Client names |
| `src/components/v5/services-section.astro` | Services with left borders |
| `src/components/v5/how-i-work-section.astro` | Numbered process steps |
| `src/components/v5/success-stories-section.astro` | Case study blocks |
| `src/components/v5/contact-section.astro` | Brutalist form |
| `src/components/v5/footer.astro` | Minimal footer |
| Update `src/components/version-switcher.astro` | Add v5 entry |

---

## Responsive Breakpoints

- Desktop: `1440px` container, `1200px` content (left-aligned)
- Tablet: `768px`
- Mobile: `375px`

All breakpoints follow existing project conventions.
