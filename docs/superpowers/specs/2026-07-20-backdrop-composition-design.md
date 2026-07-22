# Home-Page Backdrop Composition ("V1 Mixed") — Design

## Goal

Replace the home page's scattered dots/grid backdrop (~26 independent radial-gradient
mask blobs with no shared spatial logic) with one composed backdrop system: a quiet
dot/grid field plus three fully-composed "moments", each speaking one technical shape
language, unified by a shared treatment. Futuristic/technical accents on top of the
editorial --v8-asterisk design.

**Scope: home page only** (`/` and `/de-de/`). Other pages keep the existing backdrop
until a follow-up iteration. Validated interactively in the (now-parked) prototypes
`apps/website/prototypes/backdrop-lab.astro` and `backdrop-lab-home.astro`.

## Composition rules (adopted grammar)

- **Unit of composition:** hybrid — one persistent quiet field across the page plus
  composed moments at hero, proof, and contact. Every other section gets field only.
- **Element roles per moment:** one anchor (large, cropped by a section/viewport edge),
  optional counterweight, connectors, low-contrast texture, at most **one strong accent
  per viewport**.
- **One dominant language per moment.** Mixing languages within a moment is not allowed;
  the mix happens across the page (print → schematic → orbital).
- **Clustering:** dots are never free-floating; they are texture inside a moment's
  cluster (clear overlap) or a seam patch anchored to a section boundary. No
  evenly-distributed patches, no barely-touching tangents.
- **Safe zones:** no decorative element crosses a text column above whisper opacity.
  Exception (user-approved): the contact moment's outer orbit arcs pass behind the form
  at the faint tier.
- **Shared treatment** (what makes different languages feel related):
  - stroke width 1px everywhere
  - opacity tiers: `mid` 0.16, `faint` 0.09, `fill-faint` 0.12, `node` 0.20; accent 0.85
  - annotations: `--v8-font-mono`, 11px, tracking 0.08em, opacity 0.35
  - dot texture: 18px lattice of 1px `--v8-dot-color` dots, soft ellipse mask
    (`radial-gradient(ellipse 60% 60% at 50% 50%, black 0%, transparent 75%)`)
  - engineering grid: existing three-scale pattern (200/40/8px) with
    `--v8-grid-major/medium/fine`
  - colors exclusively via `--v8-*` tokens (theme adapts automatically)

## The system

### Quiet field (page level)

Two patches anchored to section seams, continuing the page's zigzag rhythm
(hero-right → situations-left → proof-right → writing-left → contact-right):

| Patch | Anchor | Geometry |
|---|---|---|
| dots | situations band, straddling its top-left corner; fade completes before the opaque band edge | left 6%, 280×300px, bottom edge ≈ 20px above the band |
| fine grid (40/8px layers) | left rail at the seam above the writing section | left 8%, 430×300px |

### Moment 1 — Hero: engineering print

- **Anchor:** mm/cm/5cm grid patch, right 0 / bottom 0, 46% × 64% of the section,
  masked `radial-gradient(ellipse 115% 115% at 100% 100%, black 42%, transparent 78%)`.
- **Texture:** dot patch 320×400px at right 110px / top 90px — dots emerge above the
  grid anchor on the right rail, overlapping the registration mark (deliberate cluster).
- **Connector:** horizontal dimension line (end ticks + centered mono label "1440"),
  400×40px at right 80px, sitting on the grid anchor's top edge.
- **Counterweight:** registration mark (circle + cross, faint) 100×100px at
  right 180px / top 36px; crop-mark pair (faint) bottom-left.
- **Accent:** one `*` glyph, `--v8-accent`, mono 26px, right 36px, just above the grid
  anchor — the page's single strongest accent and the --v8-asterisk brand mark.

### Moment 2 — Proof: schematic

- SVG 620×520px, right 0 / bottom 0 of the section: three 45°-bend traces exiting the
  right edge and running to the section bottom; nodes (2 circles r5, 1 circle, 1 pad
  rect 10×10) at bends; 4 via dots (fill-faint).
- **Texture:** dot patch 380×320px in the bottom-right corner, trailing the traces.
- **Accent:** one filled node r4.5 at the lower trace bend (svg 410,440) — below the
  glass engagement cards, never behind them.

### Moment 3 — Contact: orbital

- SVG 1200×700px, right 0 / bottom 0 of the contact band. Orbit center pushed
  off-canvas (svg 1450,1000). Arcs with **depth falloff**: r430 + r520 at `mid`,
  r700 + r850 at `faint` — the outer arcs sweep up behind the form at whisper level
  (approved), the inner ones stay in the corner.
- Two orbit ticks (faint) on the inner arcs.
- **Texture:** dot patch 260×200px at right 60px / bottom 16px — below the form.
- **Accent:** satellite dot r4.5 on an inner arc (svg 760,657), below the form.
- **Counterweight:** reticle (circle r24 + cross ticks, faint) 110×110px at
  left 44% / top 10% — in the empty gap between headline and form columns.

### Responsive tiers

Content columns span the full width below `lg`, so moments reduce:

- **< 1024px:**
  - hero: only the grid anchor survives (58% × 42%); dimension line, registration
    mark, crop marks, dots, and asterisk are hidden.
  - schematic: svg scales to 400×340px, dots to 260×200px (corner strip below the
    stacked cards; accent lands below the cards).
  - orbital: reticle hidden (its column gap no longer exists); dots pinned to
    bottom 0, height 160px.
- **< 768px:** orbital svg scales to 700×410px so arcs stay in the corner below the
  stacked form.

## Implementation architecture

- **Moments live inside their section components** (`hero.tsx`, `proof-section.tsx`,
  `contact-section.tsx`) as an `aria-hidden` absolutely-positioned layer
  (`absolute inset-0 -z-10 overflow-hidden pointer-events-none`), first child of the
  section. No JS positioning — everything is static CSS/SVG.
- **Host sections need `relative isolate`.** `isolate` is load-bearing: without a
  stacking context on the section, a negative-z-index layer paints behind the
  *root*, and any opaque section background (the contact band) hides it entirely.
- The **quiet-field patches** live inside the section *preceding* the seam they mark
  (dots in capabilities, grid in proof), bottom-anchored and clipped. This is forced by
  how `-z-10` works: it only paints behind its **own** section's content, so a patch
  hosted below the seam and bled upward lands *on top of* the previous section's cards
  and text. Hosting it in the preceding (transparent) section puts it genuinely behind
  content. Patches must also stay within the viewport width — an unclipped wide patch
  creates document-level horizontal overflow on phones.
- Sections whose component is **shared** with non-home pages (`ContactSection`) must
  gate their moment behind an opt-in prop, or the composition silently ships beyond
  the home-page scope.
- Shared vocabulary (dot patch, grid patch, stroke-tier classes) goes in
  `global.css` under `@layer components` as `.bd-*` classes (backdrop namespace),
  documented like the existing `.page-backdrop` block. SVGs are inline JSX per moment.
- **Old backdrop removal:** delete the `.page-backdrop__dots` / `__grid` mask-blob
  rules and Layout's backdrop markup for the home page. Other pages currently sharing
  `showBackdrop` keep working: retain a minimal `.page-backdrop` (dots+grid without
  the blob masks, or unchanged CSS) until the follow-up that rolls the system out
  site-wide — decision: **keep the existing backdrop untouched for non-home pages**
  and simply stop rendering it on the home page (`showBackdrop={false}`).
- **Reveal interplay:** backdrop layers are static (no `.reveal`); never put `reveal`
  and `transition-*` utilities on the same element (see `global.css` invariant
  comment; the wrapper pattern from `featured-articles-section` applies).
- Tailwind gotcha (documented during this work): arbitrary properties emit *before*
  standard utilities — any arbitrary `grid-template-columns`-style override that must
  beat a standard utility needs a variant prefix (`md:[...]`).

## Testing / verification

- Visual pass at 1440 / 768 / 375, light **and** dark, over each moment viewport and
  both seam patches (DevTools MCP screenshots; defects fixed before review).
- Assert computed styles where cheap: contact arcs' stroke opacity tiers; no element
  with both `reveal` and `transition-*`.
- `bun run build` green; no new pages emitted; sitemap unchanged.

## Out of scope

- Other pages (articles, CV, content pages) — follow-up iteration.
- Motion/parallax on backdrop elements.
- Extracting `.bd-*` primitives into the `v8-asterisk` registry repo (only if a
  second consumer appears).
- IndexNow/SEO work, deploy pipeline changes (PR #10 covers deploys).

## Prototype provenance

`apps/website/prototypes/backdrop-lab-home.astro` holds the validated geometry
(V1 variant); `backdrop-lab.astro` holds the shape-language comparison. Both are
reference-only, excluded from routing, and get deleted once the implementation lands.
