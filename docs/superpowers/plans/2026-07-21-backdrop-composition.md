# Home-Page Backdrop Composition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the "V1 mixed" backdrop system (quiet field + hero print / proof schematic / contact orbital moments) on the home page, replacing the old scattered dots/grid backdrop there.

**Architecture:** Shared `.bd-*` CSS vocabulary in `global.css` (`@layer components`); each moment is a static, `aria-hidden`, absolutely-positioned layer component mounted as first child of its host section; host sections get `relative isolate` (load-bearing: without a stacking context, opaque section backgrounds hide `-z-10` layers). No JS positioning. Home pages set `showBackdrop={false}`; all other pages keep the old backdrop untouched.

**Tech Stack:** Astro 7, React/TSX, Tailwind v4, plain CSS in `@layer components`.

**Spec:** `docs/superpowers/specs/2026-07-20-backdrop-composition-design.md`

## Global Constraints

- Work in `/home/donheidi/code/sebastian-heitmann-v8` (worktree, branch `feat/v8-asterisk-migration`).
- Colors/fonts exclusively via `--v8-*` tokens; CSS-var utility syntax is the repo's bracket form `text-[var(--v8-accent)]` (parenthesis syntax was declined repo-wide).
- Stroke width 1px everywhere; opacity tiers: mid 0.16, faint 0.09, fill-faint 0.12, node 0.20, accent 0.85, labels 0.35.
- Never put `reveal` and any `transition-*` utility on the same element (`global.css` invariant).
- Tailwind v4 gotcha: arbitrary properties emit before standard utilities — arbitrary-property overrides that must beat a standard utility need a variant prefix.
- Backdrop layers carry Tailwind utilities ONLY for geometry (position/size/display) — never for properties the `.bd-*` classes declare.
- Conventional commits with trailer: `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`
- The dev server runs as a daemon at http://localhost:4321 (`astro dev` from `apps/website`; manage with `astro dev status|logs|stop`).
- Visual verification uses Chrome DevTools MCP (`new_page`/`navigate_page`, `emulate` viewport, `take_screenshot`, `evaluate_script`) — screenshot each affected viewport in light AND dark; scroll the page once first so reveal animations settle.

---

### Task 1: `.bd-*` backdrop vocabulary in global.css

**Files:**
- Modify: `apps/website/src/styles/global.css` (append after the `.page-backdrop` block's closing `}` of its `@layer components`, before the grain overlay comment at ~line 237)

**Interfaces:**
- Produces: CSS classes `.bd-dots`, `.bd-grid-fine`, `.bd-grid-full`, `.bd-stroke-mid`, `.bd-stroke-faint`, `.bd-fill-faint`, `.bd-node`, `.bd-accent-fill`, `.bd-dim-label` — consumed by all moment components in Tasks 2–5.

- [ ] **Step 1: Append the vocabulary block**

Insert this after the existing `@layer components { ... }` block that contains `.page-backdrop` (keep that block untouched) :

```css
/* ------------------------------------------------------------------ */
/* Backdrop composition vocabulary (`.bd-*`) for the home-page         */
/* backdrop moments — see                                              */
/* docs/superpowers/specs/2026-07-20-backdrop-composition-design.md.   */
/* Unlike `.page-backdrop`, these classes DO co-occur with Tailwind    */
/* utilities on the same elements. That is safe because the utilities  */
/* set only geometry (position/size/display) and never the properties  */
/* declared here, so utilities-beats-components layering cannot bite.  */
/* ------------------------------------------------------------------ */
@layer components {
  .bd-dots {
    background-image: radial-gradient(circle, var(--v8-dot-color) 1px, transparent 1.5px);
    background-size: 18px 18px;
    mask-image: radial-gradient(ellipse 60% 60% at 50% 50%, black 0%, transparent 75%);
    -webkit-mask-image: radial-gradient(ellipse 60% 60% at 50% 50%, black 0%, transparent 75%);
  }

  .bd-grid-fine {
    background-image:
      linear-gradient(to right, var(--v8-grid-medium) 1px, transparent 1px),
      linear-gradient(to bottom, var(--v8-grid-medium) 1px, transparent 1px),
      linear-gradient(to right, var(--v8-grid-fine) 1px, transparent 1px),
      linear-gradient(to bottom, var(--v8-grid-fine) 1px, transparent 1px);
    background-size: 40px 40px, 40px 40px, 8px 8px, 8px 8px;
    mask-image: radial-gradient(ellipse 65% 65% at 50% 50%, black 0%, transparent 78%);
    -webkit-mask-image: radial-gradient(ellipse 65% 65% at 50% 50%, black 0%, transparent 78%);
  }

  /* full 5cm/1cm/1mm engineering grid, faded toward its top-left —    */
  /* used as the hero anchor, cropped by the section's bottom-right    */
  .bd-grid-full {
    background-image:
      linear-gradient(to right, var(--v8-grid-major) 1px, transparent 1px),
      linear-gradient(to bottom, var(--v8-grid-major) 1px, transparent 1px),
      linear-gradient(to right, var(--v8-grid-medium) 1px, transparent 1px),
      linear-gradient(to bottom, var(--v8-grid-medium) 1px, transparent 1px),
      linear-gradient(to right, var(--v8-grid-fine) 1px, transparent 1px),
      linear-gradient(to bottom, var(--v8-grid-fine) 1px, transparent 1px);
    background-size: 200px 200px, 200px 200px, 40px 40px, 40px 40px, 8px 8px, 8px 8px;
    mask-image: radial-gradient(ellipse 115% 115% at 100% 100%, black 42%, transparent 78%);
    -webkit-mask-image: radial-gradient(ellipse 115% 115% at 100% 100%, black 42%, transparent 78%);
  }

  .bd-stroke-mid   { stroke: var(--v8-text); stroke-width: 1; opacity: 0.16; }
  .bd-stroke-faint { stroke: var(--v8-text); stroke-width: 1; opacity: 0.09; }
  .bd-fill-faint   { fill: var(--v8-text); opacity: 0.12; }
  .bd-node         { stroke: var(--v8-text); stroke-width: 1; fill: none; opacity: 0.2; }
  .bd-accent-fill  { fill: var(--v8-accent); opacity: 0.85; }
  .bd-dim-label {
    fill: var(--v8-text);
    opacity: 0.35;
    font-family: var(--v8-font-mono);
    font-size: 11px;
    letter-spacing: 0.08em;
  }
}
```

- [ ] **Step 2: Verify the classes compile**

Run: `curl -s 'http://localhost:4321/src/styles/global.css' | grep -c 'bd-dots\|bd-grid-full\|bd-accent-fill'`
Expected: a count ≥ 3 (dev server serves the CSS as a JS module; the class names appear escaped).

- [ ] **Step 3: Commit**

```bash
cd /home/donheidi/code/sebastian-heitmann-v8
git add apps/website/src/styles/global.css
git commit -m "feat(website): add .bd-* backdrop composition vocabulary

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Hero print moment

**Files:**
- Create: `apps/website/src/components/backdrop/hero-print-moment.tsx`
- Modify: `apps/website/src/components/hero.tsx:14` (section className + mount)

**Interfaces:**
- Consumes: `.bd-*` classes from Task 1.
- Produces: `HeroPrintMoment` (no props), mounted inside the hero section.

- [ ] **Step 1: Create the moment component**

```tsx
export function HeroPrintMoment() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* anchor: engineering grid cropped by the bottom-right corner */}
      <div className="bd-grid-full absolute right-0 bottom-0 h-[42%] w-[58%] lg:h-[64%] lg:w-[46%]" />
      {/* texture: dots emerge above the anchor on the right rail */}
      <div className="bd-dots absolute top-[90px] right-[110px] hidden h-[400px] w-[320px] lg:block" />
      {/* connector: dimension line on the anchor's top edge */}
      <svg
        className="absolute right-[80px] bottom-[calc(64%+6px)] hidden h-10 w-[400px] lg:block"
        viewBox="0 0 400 40"
        fill="none"
      >
        <path className="bd-stroke-mid" d="M10 28 H390 M10 20 V36 M390 20 V36" />
        <text x="185" y="14" className="bd-dim-label">
          1440
        </text>
      </svg>
      {/* counterweight: registration mark */}
      <svg
        className="absolute top-9 right-[180px] hidden h-[100px] w-[100px] lg:block"
        viewBox="0 0 100 100"
        fill="none"
      >
        <g className="bd-stroke-faint" transform="translate(50 50)">
          <circle r="13" />
          <path d="M-21 0H21 M0 -21V21" />
        </g>
      </svg>
      {/* crop marks, bottom-left */}
      <svg
        className="absolute bottom-6 left-6 hidden h-[70px] w-[70px] lg:block"
        viewBox="0 0 70 70"
        fill="none"
      >
        <path className="bd-stroke-faint" d="M10 60 H60 M10 10 V60" />
      </svg>
      {/* accent: the --v8-asterisk brand mark — the page's single strong accent */}
      <span className="absolute right-9 bottom-[calc(64%+44px)] hidden font-mono text-[26px] text-[var(--v8-accent)] opacity-90 lg:block">
        *
      </span>
    </div>
  );
}
```

- [ ] **Step 2: Mount it in the hero**

In `apps/website/src/components/hero.tsx`, add the import and change the section root. The className gains `relative isolate`; the moment is the section's first child:

```tsx
import { HeroPrintMoment } from './backdrop/hero-print-moment';
```

```tsx
    <section className="relative isolate mx-auto flex min-h-auto max-w-[1440px] items-center px-6 pt-10 pb-[60px] md:px-12 md:pt-[60px] md:pb-20 lg:min-h-[calc(100vh-80px)] lg:px-20 lg:pt-20 lg:pb-[120px]">
      <HeroPrintMoment />
```

- [ ] **Step 3: Verify visually**

At http://localhost:4321/ (viewport 1440×900, then 768×1024): desktop shows grid anchor bottom-right, dot cluster + registration mark on the right rail, dimension line with "1440", asterisk near the right edge — nothing behind the headline or copy. Tablet shows ONLY the grid anchor. Check light and dark.

- [ ] **Step 4: Commit**

```bash
git add apps/website/src/components/backdrop/hero-print-moment.tsx apps/website/src/components/hero.tsx
git commit -m "feat(website): add engineering-print backdrop moment to hero

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Proof schematic moment

**Files:**
- Create: `apps/website/src/components/backdrop/proof-schematic-moment.tsx`
- Modify: `apps/website/src/components/proof-section.tsx:19-22` (section className + mount)

**Interfaces:**
- Consumes: `.bd-*` classes from Task 1.
- Produces: `ProofSchematicMoment` (no props), mounted inside `#proof`.

- [ ] **Step 1: Create the moment component**

```tsx
export function ProofSchematicMoment() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* texture: dots trail the traces into the corner */}
      <div className="bd-dots absolute right-0 bottom-0 h-[200px] w-[260px] lg:h-[320px] lg:w-[380px]" />
      <svg
        className="absolute right-0 bottom-0 h-[340px] w-[400px] lg:h-[520px] lg:w-[620px]"
        viewBox="0 0 620 520"
        fill="none"
      >
        <g className="bd-stroke-mid">
          <path d="M620 140 H460 L390 210 V320 L330 380 V520" />
          <path d="M620 230 H510 L450 290 V400 L410 440 V520" />
          <path d="M620 320 H550 L500 370 V520" />
        </g>
        <g className="bd-node">
          <circle cx="460" cy="140" r="5" />
          <circle cx="390" cy="320" r="5" />
          <circle cx="510" cy="230" r="5" />
          <rect x="495" y="365" width="10" height="10" />
        </g>
        <g className="bd-fill-faint">
          <circle cx="360" cy="470" r="2" />
          <circle cx="560" cy="420" r="2" />
          <circle cx="300" cy="500" r="2" />
          <circle cx="580" cy="180" r="2" />
        </g>
        {/* accent on the lower trace bend — below the glass engagement cards */}
        <circle cx="410" cy="440" r="4.5" className="bd-accent-fill" />
      </svg>
    </div>
  );
}
```

- [ ] **Step 2: Mount it in the proof section**

In `apps/website/src/components/proof-section.tsx`: add the import, add `isolate` to the already-`relative` section, mount as first child (before the CORNERS spans):

```tsx
import { ProofSchematicMoment } from './backdrop/proof-schematic-moment';
```

```tsx
    <section
      id="proof"
      className="relative isolate mx-auto max-w-[1440px] py-[60px] px-6 md:px-12 md:py-20 lg:border-t lg:border-border lg:px-20 lg:py-[120px]"
    >
      <ProofSchematicMoment />
```

- [ ] **Step 3: Verify visually**

At http://localhost:4321/#proof (1440×900 and 768×1024, light + dark, after scrolling once): traces + nodes bottom-right; red accent node BELOW the engagement cards, never behind a card; dots trail to the corner. Tablet: smaller cluster in the corner strip.

- [ ] **Step 4: Commit**

```bash
git add apps/website/src/components/backdrop/proof-schematic-moment.tsx apps/website/src/components/proof-section.tsx
git commit -m "feat(website): add schematic backdrop moment to proof section

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: Contact orbital moment

**Files:**
- Create: `apps/website/src/components/backdrop/contact-orbital-moment.tsx`
- Modify: `apps/website/src/components/contact-section.tsx:21` (section className + mount)

**Interfaces:**
- Consumes: `.bd-*` classes from Task 1.
- Produces: `ContactOrbitalMoment` (no props), mounted inside `#contact`. The `isolate` here is what makes the layer visible at all — the band's `bg-surface-alt` is opaque.

- [ ] **Step 1: Create the moment component**

```tsx
export function ContactOrbitalMoment() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* texture: dots below the form */}
      <div className="bd-dots absolute right-[60px] bottom-0 h-[160px] w-[260px] lg:bottom-4 lg:h-[200px]" />
      {/* arcs sweep up behind the form; outer arcs at the faint tier (approved) */}
      <svg
        className="absolute right-0 bottom-0 h-[410px] w-[700px] md:h-[700px] md:w-[1200px]"
        viewBox="0 0 1200 700"
        fill="none"
      >
        <g className="bd-stroke-mid">
          <circle cx="1450" cy="1000" r="430" />
          <circle cx="1450" cy="1000" r="520" />
        </g>
        <g className="bd-stroke-faint">
          <circle cx="1450" cy="1000" r="700" />
          <circle cx="1450" cy="1000" r="850" />
          <path d="M1192 656 l-13 -12 M940 684 l-14 -10" />
        </g>
        {/* satellite accent on an inner arc, below the form */}
        <circle cx="1060" cy="657" r="4.5" className="bd-accent-fill" />
      </svg>
      {/* counterweight: reticle in the gap between headline and form columns */}
      <svg
        className="absolute top-[10%] left-[44%] hidden h-[110px] w-[110px] lg:block"
        viewBox="0 0 110 110"
        fill="none"
      >
        <g className="bd-stroke-faint" transform="translate(55 55)">
          <circle r="24" />
          <path d="M-38 0H-13 M13 0H38 M0 -38V-13 M0 13V38" />
        </g>
      </svg>
    </div>
  );
}
```

- [ ] **Step 2: Mount it in the contact section**

In `apps/website/src/components/contact-section.tsx`: add the import; the section gains `relative isolate`; mount as first child:

```tsx
import { ContactOrbitalMoment } from './backdrop/contact-orbital-moment';
```

```tsx
    <section id="contact" className="relative isolate bg-surface-alt px-6 py-[60px] md:px-12 md:py-20 lg:px-20 lg:py-[120px]">
      <ContactOrbitalMoment />
```

- [ ] **Step 3: Verify visually**

At http://localhost:4321/#contact (1440×900, 768×1024, 375×812; light + dark): arcs visible over the opaque band (if invisible, `isolate` is missing); inner arcs in the corner at mid tier, outer arcs crossing behind the form at faint tier; satellite + dots below the form; reticle only on desktop, in the column gap. Mobile: arc cluster confined to the corner below the stacked form.

- [ ] **Step 4: Commit**

```bash
git add apps/website/src/components/backdrop/contact-orbital-moment.tsx apps/website/src/components/contact-section.tsx
git commit -m "feat(website): add orbital backdrop moment to contact section

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: Quiet-field seam patches

**Files:**
- Modify: `apps/website/src/components/situations-section.tsx:10`
- Modify: `apps/website/src/components/featured-articles-section.tsx:34`

**Interfaces:**
- Consumes: `.bd-dots`, `.bd-grid-fine` from Task 1.
- Produces: two field patches anchored to section seams. These layers have NO `overflow-hidden` — the patches deliberately extend above their sections.

- [ ] **Step 1: Situations seam dots**

In `apps/website/src/components/situations-section.tsx`, the section root gains `relative isolate` and the patch layer as first child. The patch sits entirely ABOVE the opaque band (bottom edge 20px above it) so the band never cuts it mid-density:

```tsx
    <section className="reveal relative isolate mt-16 bg-surface-alt py-10 px-6 md:px-12 lg:px-20 lg:py-20">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="bd-dots absolute top-[-320px] left-[6%] h-[300px] w-[280px]" />
      </div>
```

- [ ] **Step 2: Writing seam grid patch**

In `apps/website/src/components/featured-articles-section.tsx`, the section root gains `relative isolate` and the patch layer as first child (straddles the seam: 150px above, 150px into the section):

```tsx
    <section id="writing" className="relative isolate mx-auto max-w-[1440px] border-t border-border py-12 px-6 md:px-12 lg:py-[120px] lg:px-20">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="bd-grid-fine absolute top-[-150px] left-[8%] h-[300px] w-[430px]" />
      </div>
```

- [ ] **Step 3: Verify visually**

At 1440×900, light + dark: dots fade out ~20px above the situations band's top-left corner (no hard cut); the fine-grid patch straddles the left rail at the seam above "WRITING". Zigzag reads: hero-right → situations-left → proof-right → writing-left → contact-right.

- [ ] **Step 4: Commit**

```bash
git add apps/website/src/components/situations-section.tsx apps/website/src/components/featured-articles-section.tsx
git commit -m "feat(website): add quiet-field seam patches to home sections

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 6: Retire the old backdrop on the home page

**Files:**
- Modify: `apps/website/src/pages/index.astro:77` (`showBackdrop={true}` → `{false}`)
- Modify: `apps/website/src/pages/de-de/index.astro:84` (`showBackdrop={true}` → `{false}`)

**Interfaces:**
- Consumes: nothing new. All other pages keep `showBackdrop` and the untouched `.page-backdrop` CSS.

- [ ] **Step 1: Flip both flags**

`pages/index.astro`:
```astro
<Layout locale={locale} title={s.meta.title} description={s.meta.description} alternates={alternates} includeRedirectScript={true} showBackdrop={false}>
```

`pages/de-de/index.astro`:
```astro
<Layout locale={locale} title={s.meta.title} description={s.meta.description} alternates={alternates} showBackdrop={false}>
```

- [ ] **Step 2: Verify the old backdrop is gone from home but alive elsewhere**

Run: `curl -s http://localhost:4321/ | grep -c 'page-backdrop'` → Expected: `0`
Run: `curl -s http://localhost:4321/articles/ | grep -c 'page-backdrop'` → Expected: ≥ 1

- [ ] **Step 3: Commit**

```bash
git add apps/website/src/pages/index.astro apps/website/src/pages/de-de/index.astro
git commit -m "feat(website): replace scattered home backdrop with composed moments

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 7: Full verification sweep + cleanup

**Files:**
- Delete: `apps/website/prototypes/backdrop-lab.astro`, `apps/website/prototypes/backdrop-lab-home.astro` (untracked)

- [ ] **Step 1: Full-page visual sweep**

http://localhost:4321/ and /de-de/ at 1440×900, 768×1024, 375×812 — light AND dark. Checklist per viewport: nothing above whisper opacity behind text except the approved contact arcs; exactly one strong accent visible per viewport; no patch cut mid-density by an opaque band; no tangent (barely-touching) collisions.

- [ ] **Step 2: Computed-style asserts**

In the browser (evaluate_script on http://localhost:4321/):
```js
// no element combines reveal with a transition-* utility
[...document.querySelectorAll('.reveal')].filter(el =>
  [...el.classList].some(c => c.startsWith('transition-'))).length === 0
// contact arcs resolve their tiers
getComputedStyle(document.querySelector('#contact .bd-stroke-mid')).opacity === '0.16'
```

- [ ] **Step 3: Production build gate**

```bash
cd /home/donheidi/code/sebastian-heitmann-v8/apps/website && bun run build
```
Expected: green, **33 pages**, `grep -c backdrop-lab dist/sitemap-0.xml` → 0.

- [ ] **Step 4: Delete the prototypes**

```bash
rm /home/donheidi/code/sebastian-heitmann-v8/apps/website/prototypes/backdrop-lab.astro \
   /home/donheidi/code/sebastian-heitmann-v8/apps/website/prototypes/backdrop-lab-home.astro
rmdir /home/donheidi/code/sebastian-heitmann-v8/apps/website/prototypes
```
(Untracked files — no commit needed; the validated geometry now lives in the spec and the components.)

---

### Task 8: Deploy

- [ ] **Step 1: Deploy**

```bash
cd /home/donheidi/code/sebastian-heitmann-v8 && ./scripts/deploy-website.sh
```
Expected: rebuild + prune + chunk assertion + full upload, no errors.

- [ ] **Step 2: Purge the CDN cache**

```bash
cd /home/donheidi/code/sebastian-heitmann-v8 && ./scripts/scw edge-services purge-request create \
  pipeline-id=cca87f11-b109-4ca3-83b6-a6aaf89dcadc all=true -o json
```
Expected: `"status": "done"`.

- [ ] **Step 3: Verify production**

```bash
curl -s https://www.sebastian-heitmann.dev/ | grep -c 'bd-grid-full'   # ≥ 1
curl -s https://www.sebastian-heitmann.dev/ | grep -c 'page-backdrop'  # 0
```
Plus one desktop screenshot of the live hero (light or dark) confirming the moment renders.

## Self-review notes

- Spec coverage: vocabulary (T1), three moments with exact validated geometry (T2–T4), seam patches with the no-clip requirement (T5), old-backdrop retirement scoped to home only (T6), verification incl. computed-style asserts and both locales (T7), deploy + purge (T8). Out-of-scope items (other pages, motion, registry extraction) have no tasks — correct.
- Class-name consistency: `.bd-*` names in T1 match every usage in T2–T5; `HeroPrintMoment`/`ProofSchematicMoment`/`ContactOrbitalMoment` names match their mounts.
- No placeholders; every code step shows complete code.
