# rocks v3 Neo-Retro Poster Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reset the `apps/rocks` visual direction to modern rock/metal/punk neo-retro: Anton poster type, `SEBASTIAN ✳ HEITMANN` masthead with the "Unconventionally effective" tagline, duotone imagery with hover color reveal, and retirement of the graffiti/backdrop-art treatments.

**Architecture:** Pure front-end evolution of the shipped v2. New primitives (`Masthead`, `SectionHeader`, `DuotonePanel`) replace the graffiti wordmarks and backdrop moments; one new self-hosted font asset (Anton); a small `Strings` change (`hero.headingParts` → `hero.tagline`); a real cleanup sweep deletes everything retired. Spec: `docs/superpowers/specs/2026-08-04-rocks-v3-neo-retro-design.md`.

**Tech Stack:** Astro 7, React 19 TSX (static components), Tailwind v4 + `@layer components` CSS, `astro:assets`, self-hosted woff2.

## Global Constraints

- All `--v8-*` tokens unchanged except ONE addition: `--v8-font-poster: 'Anton', 'Arial Narrow', sans-serif` (v8-wildcard layer). Both themes first-class for every treatment.
- No new runtime dependencies (Anton is a static asset). No aged-paper/grunge textures, no halftone simulation. Duotone only, with hover full-color reveal.
- Copy frozen except `hero.headingParts` → `hero.tagline` (en `Unconventionally effective`, de `Unkonventionell effektiv`; CSS uppercases display text).
- Cases stay as cards (owner decision: NO tour-date table). Asterisk mark system, pixel rocker, torn-edge masks all stay.
- All motion stays motion-safe; the duotone hover reveal is a color transition and is exempt from the reduced-motion gate.
- Components accept typed string props; no hardcoded user-visible text.
- en/de page pairs stay structurally parallel. Conventional commits. Work only in the worktree branch `worktree-feat-rocks-portfolio-site`; push only in the final task.
- Verification per task: `cd apps/rocks && bun run build` clean; visual tasks screenshot via dev server (:4321 Astro daemon; Chrome DevTools MCP or the Playwright fallback earlier SDD reports describe; screenshots → the plan's SDD workspace `screenshots/` dir).

---

### Task 1: Anton font asset, token, preload

**Files:**
- Create: `apps/rocks/public/fonts/Anton-Regular.woff2`
- Modify: `apps/rocks/src/styles/v8-fonts.css` (append `@font-face`)
- Modify: `apps/rocks/src/styles/v8-theme.css` (add `--v8-font-poster` next to the other font tokens in `:root`)
- Modify: `apps/rocks/src/layouts/Layout.astro` (preload link)

**Interfaces:**
- Produces: `var(--v8-font-poster)` resolving to loaded Anton; utility usage pattern `font-[family-name:var(--v8-font-poster)]`.

- [ ] **Step 1: Fetch Anton (latin, 400) as woff2**

```bash
cd apps/rocks/public/fonts
curl -fsSL -o Anton-Regular.woff2 "https://cdn.jsdelivr.net/fontsource/fonts/anton@latest/latin-400-normal.woff2"
file Anton-Regular.woff2   # expect: Web Open Font Format (Version 2)
```

If jsdelivr is unreachable, fallback: `curl -fsSLA "Mozilla/5.0" "https://fonts.googleapis.com/css2?family=Anton&display=swap"`, take the `latin` block's woff2 URL, download that. Anton is SIL OFL licensed; no attribution file needed in-repo, but note the license in the `@font-face` comment.

- [ ] **Step 2: Declare and tokenize**

Append to `v8-fonts.css`:

```css
/* Anton (SIL OFL) — the v8-wildcard poster face. Display lines only. */
@font-face {
  font-family: 'Anton';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/Anton-Regular.woff2') format('woff2');
}
```

In `v8-theme.css` `:root`, next to the existing font tokens:

```css
  --v8-font-poster: 'Anton', 'Arial Narrow', sans-serif;
```

In `Layout.astro`, add alongside the existing font preloads:

```html
<link rel="preload" href="/fonts/Anton-Regular.woff2" as="font" type="font/woff2" crossorigin>
```

- [ ] **Step 3: Verify** — `bun run build`; `ls dist/fonts/Anton-Regular.woff2`; grep a built HTML head for the preload.
- [ ] **Step 4: Commit** — `git add apps/rocks && git commit -m "feat(rocks): self-host Anton as the v8-wildcard poster face"`

---

### Task 2: DuotonePanel primitive + duotone CSS

**Files:**
- Modify: `apps/rocks/src/styles/global.css` (new documented `@layer components` block)
- Create: `apps/rocks/src/components/duotone-panel.astro`

**Interfaces:**
- Consumes: nothing new.
- Produces: `.v8-duotone` / hover-reveal CSS and `DuotonePanel` Astro component with props `{ src: ImageMetadata; alt: string; widths: number[]; sizes: string; eager?: boolean; class?: string; imgClass?: string }`. It renders the duotone wrapper + `<Image>`; callers put torn-clip wrappers OUTSIDE it when they want torn edges.

- [ ] **Step 1: CSS**

```css
@layer components {
  /* v8-wildcard duotone: accent-ink poster treatment. The wrapper paints the
     accent; the grayscale image multiplies over it, mapping highlights to
     accent and shadows to black in both themes. Hover reveals full color:
     a color transition, deliberately outside the reduced-motion gate. */
  .v8-duotone {
    background-color: var(--v8-accent);
    isolation: isolate;
    overflow: hidden;
  }
  .v8-duotone > img {
    display: block;
    mix-blend-mode: multiply;
    filter: grayscale(1) contrast(1.06) brightness(1.04);
    transition: filter 0.35s ease, opacity 0.35s ease;
  }
  .v8-duotone:hover > img,
  .v8-duotone:focus-within > img {
    mix-blend-mode: normal;
    filter: none;
  }
}
```

- [ ] **Step 2: Component `duotone-panel.astro`**

```astro
---
import { Image } from 'astro:assets';
import type { ImageMetadata } from 'astro';

interface Props {
  src: ImageMetadata;
  alt: string;
  widths: number[];
  sizes: string;
  eager?: boolean;
  class?: string;
  imgClass?: string;
}

const { src, alt, widths, sizes, eager = false, class: className = '', imgClass = '' } = Astro.props;
---

<div class={`v8-duotone ${className}`}>
  <Image
    src={src}
    alt={alt}
    widths={widths}
    sizes={sizes}
    loading={eager ? 'eager' : 'lazy'}
    fetchpriority={eager ? 'high' : 'auto'}
    class={`h-full w-full object-cover ${imgClass}`}
  />
</div>
```

- [ ] **Step 3: Verify** — build clean (component unreferenced yet). Quick visual sanity: temporarily apply to the hero image in the dev server if convenient, screenshot dark + light (accent-on-black vs accent-on-cream ramps), then revert the temp usage. If the multiply ramp looks muddy, adjust contrast/brightness values in the CSS (they are starting values, not sacred).
- [ ] **Step 4: Commit** — `git commit -am "feat(rocks): add duotone panel primitive with hover color reveal"`

---

### Task 3: Masthead + tagline + hero rebuild

**Files:**
- Modify: `apps/rocks/src/i18n/types.ts`, `en-us.ts`, `de-de.ts` (`hero.headingParts` → `hero.tagline`)
- Create: `apps/rocks/src/components/masthead.tsx`
- Modify: `apps/rocks/src/components/hero.tsx` + `apps/rocks/src/components/hero-section.astro` (rebuild; whatever split currently exists, keep the file roles but replace the treatments)
- Modify: both index pages (mount changes)
- Delete: `apps/rocks/src/components/backdrop/hero-stage-moment.tsx` (+ its mounts)

**Interfaces:**
- Consumes: `AsteriskMark`, `DuotonePanel`, Anton token (Tasks 1-2).
- Produces: `Masthead({ nameFirst, nameLast, tagline })` all strings (rendered uppercase via CSS); `Strings['hero'] = { kicker: string; tagline: string; intro: { before, struck, replacement, after } }`.

- [ ] **Step 1: Strings** — replace `headingParts` with `tagline: string` in `types.ts`; en `tagline: 'Unconventionally effective'`; de `tagline: 'Unkonventionell effektiv'`. `kicker` and `intro` unchanged. Fix all compile fallout in this task (hero renders the new shape; nothing else consumed `headingParts` except the hero and its `word` prop wiring, which dies here — the `GraffitiWord` component itself is deleted in Task 5).
- [ ] **Step 2: `masthead.tsx`**

```tsx
import { AsteriskMark } from './asterisk-mark';

export interface MastheadProps {
  nameFirst: string;   // 'Sebastian'
  nameLast: string;    // 'Heitmann'
  tagline: string;
}

export function Masthead({ nameFirst, nameLast, tagline }: MastheadProps) {
  return (
    <div>
      <h1 className="reveal flex flex-wrap items-center gap-x-4 gap-y-1 font-[family-name:var(--v8-font-poster)] text-[clamp(3.25rem,10vw,8.5rem)] leading-[0.95] tracking-[0.01em] text-foreground uppercase">
        <span>{nameFirst}</span>
        <span className="inline-flex shrink-0 items-center" aria-hidden="true">
          <AsteriskMark size={56} tone="accent" misregister className="v8-masthead-mark" />
        </span>
        <span>{nameLast}</span>
      </h1>
      <p className="reveal mt-5 flex items-center gap-4 font-mono text-[clamp(0.7rem,1.4vw,0.95rem)] tracking-[0.32em] text-foreground uppercase">
        <span className="h-[2px] flex-1 bg-primary" aria-hidden="true" />
        <span>{tagline}</span>
        <span className="h-[2px] flex-1 bg-primary" aria-hidden="true" />
      </p>
    </div>
  );
}
```

The asterisk divider must scale with the type: replace the hardcoded `size` with an em-scaled wrapper during visual iteration (e.g. wrapper `w-[0.6em] h-[0.6em]` with the mark at 100%; `AsteriskMark` takes px, so either compute from a CSS clamp via `em` sizing on the wrapper and `size={100}` + `w-full h-full` styling, or accept a responsive triplet like the hero previously used). The screenshot is the acceptance test: mark visually centered between the names, about 0.55-0.65 of the cap height, at 375 and 1440.

- [ ] **Step 3: Hero rebuild** — the hero block becomes: `kicker` (small mono over-line, unchanged style), `Masthead` (names hardcoded as props from the page: they are the site owner's name, passed as literals `nameFirst="Sebastian" nameLast="Heitmann"` from the section — names are brand, not locale copy), intro paragraph (unchanged strikethrough rendering), and the guitar-player panel now rendered through `DuotonePanel` (`eager`, same widths/sizes as before) INSIDE the existing torn-clip wrapper (keep `#v8-torn-panel` and the accent echo). Delete the `GraffitiWord` usage and the `word` prop. Unmount and delete `hero-stage-moment.tsx`; keep the layout two-zone (text left, panel right at `md+`, stacked mobile). The demoted 220px backdrop asterisk from the old moment is gone with it; the masthead's asterisk carries the brand now.
- [ ] **Step 4: Visual iteration** — 1440/768/375 × themes × locales: masthead fills the width like a poster logo without clipping; tagline bar rules align; duotone panel ramps correctly in both themes; hover reveals color.
- [ ] **Step 5: Build + commit** — `git commit -am "feat(rocks): anton masthead with tagline bar and duotone hero panel"`

---

### Task 4: Section headers, cards, about, detail restyle

**Files:**
- Create: `apps/rocks/src/components/section-header.tsx`
- Modify: `apps/rocks/src/components/case-card.tsx` (Anton title + optional duotone cover)
- Modify: both index pages, `about-section` (headers swap; about avatar goes duotone inside its torn clip)
- Modify: both `cases/[slug].astro` (Anton title; cover via `DuotonePanel`; drop `DetailMoment` mounts)
- Delete: `apps/rocks/src/components/backdrop/detail-moment.tsx`

**Interfaces:**
- Consumes: Anton token, `AsteriskMark`, `DuotonePanel`.
- Produces: `SectionHeader({ title })` — Anton uppercase over a heavy accent rule with a small asterisk; `CaseCard` gains optional `cover?: ImageMetadata` handling internally via a slot-free approach: the card stays `.tsx`, so the cover panel is passed as a rendered child (`coverPanel?: ReactNode`) from the calling `.astro` page (which renders `DuotonePanel` — `.astro` components cannot be rendered inside `.tsx`).

- [ ] **Step 1: `section-header.tsx`**

```tsx
import { AsteriskMark } from './asterisk-mark';

export interface SectionHeaderProps {
  title: string;
}

export function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <div className="reveal">
      <h2 className="flex items-center gap-3 font-[family-name:var(--v8-font-poster)] text-2xl tracking-[0.02em] text-foreground uppercase md:text-3xl">
        <AsteriskMark size={18} tone="accent" className="v8-spin-hover" />
        {title}
      </h2>
      <div className="mt-3 h-[3px] w-full bg-primary" aria-hidden="true" />
    </div>
  );
}
```

- [ ] **Step 2: Swap headers** — in both index pages and the about section, replace each kicker `<h2>` (mono + small asterisk) with `<SectionHeader title={t.cases.sectionTitle} />` etc. The section titles come from the SAME Strings keys (`Setlist: Cases`, `Side Projects`, `From the .dev Press`, `About`/`Über mich`); no copy changes.
- [ ] **Step 3: Cards** — `case-card.tsx`: `<h3>` moves to `font-[family-name:var(--v8-font-poster)] text-2xl uppercase tracking-[0.02em]`; add optional `coverPanel?: ReactNode` rendered (when present) as the first element of the article, full-bleed to the card's padding box (`-mx-6 -mt-6 md:-mx-8 md:-mt-8 mb-5` wrapper). Calling pages render `<CaseCard ... coverPanel={e.data.cover ? <DuotonePanel src={e.data.cover} alt="" widths={[480, 768]} sizes="(max-width: 768px) 100vw, 50vw" class="aspect-[16/9]" /> : undefined} />`. Cover alt is empty (decorative next to the title). No entries have covers yet; the path must typecheck and build.
- [ ] **Step 4: Detail pages** — title `<h1>` to Anton uppercase (same utility string as the card h3 but `text-4xl md:text-5xl`); replace the existing plain cover `<Image>` block with `DuotonePanel` (same widths/sizes, keep placement above the prose); remove the `DetailMoment` mount + import in both locale files; delete `backdrop/detail-moment.tsx`.
- [ ] **Step 5: About avatar duotone** — wrap the avatar `<Image>` in the about section with the duotone treatment: since the about section already clips with the torn shape, apply the `.v8-duotone` wrapper inside the clip (an Astro-side change if the section is `.astro`; if it is `.tsx`, pass the panel as a child the same way as cards).
- [ ] **Step 6: Visual iteration + build + commit** — `git commit -am "feat(rocks): poster section headers, anton titles, duotone covers and avatar"`

---

### Task 5: 404 restyle + full cleanup sweep

**Files:**
- Modify: `apps/rocks/src/pages/404.astro` (Anton heading replaces GraffitiWord)
- Delete: `apps/rocks/src/components/graffiti-word.tsx`
- Modify: `apps/rocks/src/styles/global.css` (remove `.misregister-text`; remove `.bd-*` rules if unreferenced; consolidate the duplicate `.case-prose ul` blocks; remove the redundant `.v8-headbang-hover .v8-frame-2` rule)
- Modify: `apps/rocks/src/i18n/{types,en-us,de-de}.ts` (remove the now-unconsumed `annotations` section)

**Interfaces:**
- Consumes: Anton token; existing `notFound` strings (unchanged).
- Produces: a tree with zero references to retired code.

- [ ] **Step 1: 404 heading** — replace the sr-only h1 + `GraffitiWord` pair with a real Anton `<h1>`:

```astro
<h1 class="font-[family-name:var(--v8-font-poster)] text-[clamp(3.5rem,12vw,9rem)] leading-[0.95] text-foreground uppercase">
  {t.notFound.heading}
</h1>
```

(The heading string already contains the period; keep the misregistered giant `AsteriskMark` backdrop, ticket-stub link, and animated `PixelRocker` untouched.)

- [ ] **Step 2: Delete retired code** — remove `graffiti-word.tsx` and every import of it (grep `GraffitiWord` — after Task 3 the hero no longer uses it; the 404 was the last consumer). Remove the `annotations` key from `Strings` and both locale files (its only consumer was the deleted `HeroStageMoment`). Grep `bd-` under `apps/rocks/src`: if the only hits are the CSS definitions themselves, delete the `.bd-*` block from `global.css`; if something still references a class, keep exactly the referenced rules and delete the rest.
- [ ] **Step 3: CSS consolidation** — merge the two `.case-prose ul` rule blocks into the later (asterisk-bullet) one, keeping a single documented block; delete `.misregister-text` and its `::before`; delete the redundant `.v8-headbang-hover .v8-frame-2 { visibility: hidden; }` line (the global `.v8-frame-2` rule already covers it).
- [ ] **Step 4: Verify** — `bun run build` clean; `grep -rn "GraffitiWord\|misregister-text\|HeroStageMoment\|DetailMoment\|annotations" apps/rocks/src` returns nothing (except the word "annotations" if it appears in unrelated comments — read any hit); 404 renders in dev with the Anton heading, both themes.
- [ ] **Step 5: Commit** — `git commit -am "feat(rocks): anton 404 and retire graffiti, backdrop art, and dead styles"`

---

### Task 6: Visual verification matrix

**Files:** none (fixes only, `fix(rocks): …` commits).

- [ ] **Step 1:** 40-shot matrix: pages `/`, `/de-de/`, `/cases/portfolio-platform/`, `/de-de/cases/portfolio-platform/`, `/404` × widths 1440/1024/768/375 × dark/light, into the SDD workspace `screenshots/matrix-v3/`. Scroll or force-reveal below-fold sections before shooting (the reveal animation previously hid the teaser section in full-page captures — known blind spot).
- [ ] **Step 2:** Specific checks: (a) masthead unclipped and poster-scaled at every width, asterisk divider sized right; (b) tagline bar rules render in both themes; (c) duotone ramps correct in both themes on hero panel and avatar; hover reveal captured on the hero panel (screenshot mid-hover); (d) Anton actually rendering (not fallback: compare a masthead crop against Arial Narrow shapes — Anton is much blacker/tighter); (e) reduced-motion: rocker static, no motion regressions; (f) no dangling layout gaps where the backdrop moments used to render.
- [ ] **Step 3:** Fix every defect, re-screenshot, commit fixes.

---

### Task 8: Center-stage hero composition (owner feedback 2026-08-04)

**Owner directives:** "I know, the image of the guitar player is not that big but can you make it center stage? Also center the Sebastian Heitmann."

**Files:**
- Modify: `apps/rocks/src/components/masthead.tsx`, `apps/rocks/src/components/hero.tsx` / `hero-section.astro`, both index pages if wiring changes

**Poster stack (single centered column, in this order):** kicker over-line (centered), masthead (centered: names + asterisk divider centered as a lockup; stacked variant on mobile also centered), tagline bar (centered; keep rules both sides), the guitar-player panel center stage (torn mask + duotone + hover reveal + eager, centered, `max-w` around 600-680px so the 1024px source stays sharp at 2x; full column width below `md`), then the intro paragraph centered beneath it (`max-w-[58ch] mx-auto text-center`, strikethrough intact).

- [ ] **Step 1:** Rework the hero markup to the centered stack; masthead gets a centered variant (`justify-center text-center`); keep all existing treatments (duotone, torn clip, accent echo) intact.
- [ ] **Step 2:** Visual iteration at 1440/1024/768/375 × both themes × both locales: the composition must read as a poster column (masthead lockup centered above the artwork, no ragged asymmetry), no clipping, panel sharp (not upscaled past ~680px CSS width), tagline rules balanced.
- [ ] **Step 3:** `bun run build` clean; commit `feat(rocks): center-stage poster hero composition`.

---

### Task 9: Full-bleed poster background hero (owner feedback 2026-08-04)

**Owner directive:** "Can you make it so, that it spans the whole 'poster' as the background art?" — the guitar-player image becomes the background of the entire hero poster block, content layered on top.

**Files:**
- Modify: `apps/rocks/src/components/hero.tsx` / `hero-section.astro` (and `duotone-panel.astro` only if it needs a fill/background variant prop — keep any change additive)

**Composition:**
- Hero block: `relative`, min-height around `92svh` (poster presence; iterate), full-bleed within the page (edge to edge of the viewport is acceptable for this block even though inner content keeps the max-width container).
- The image: absolutely positioned `inset-0`, `object-cover` (portrait source: keep the figure's head/guitar in frame; iterate `object-position`), inside the `.v8-duotone` wrapper so the whole background is duotone ink; widths extended for large screens (add 1440, 1920 to the `widths` list; keep eager + fetchpriority high). Upscaling softness beyond the 1024px source is accepted by the owner; duotone hides most of it.
- A scrim over the image, under the content: theme-aware gradient (e.g. `bg-gradient-to-t from-[var(--v8-bg)] via-[color-mix(in_srgb,var(--v8-bg)_55%,transparent)] to-transparent` plus a subtle full-area tint if needed) so kicker/masthead/tagline/intro stay AA-contrast legible in BOTH themes, in BOTH duotone and hover-revealed states. Iterate until legible; screenshots judge.
- Hover reveal: keep (it is the signature move) but verify legibility in the revealed state too; if revealed-state legibility cannot be held with a reasonable scrim, gate the reveal to the image area below the text block and say so in the report.
- Torn language: the side tears disappear at full bleed; keep a torn BOTTOM edge on the hero block (reuse the torn-clip technique as a bottom-edge clip or an SVG tear strip between hero and the cases section) so the ripped-poster gesture survives. The accent echo may be dropped if it fights the full-bleed look (judgment call, note it).
- Content stack on top (unchanged order, centered): kicker, masthead, tagline bar, intro. The intro may move INTO the poster block (over the scrim) or sit just below it; pick what reads better and note the choice.

- [ ] **Step 1:** Rework the hero to the layered full-bleed composition.
- [ ] **Step 2:** Visual iteration at 1440/1024/768/375 × both themes × both locales × duotone-and-revealed states: legibility everywhere, sensible crop focus at every ratio, torn bottom edge reads as a rip, no layout shift on hover.
- [ ] **Step 3:** `bun run build` clean; commit `feat(rocks): full-bleed poster background hero`.

---

### Task 10: Masthead to the top of the poster (owner feedback 2026-08-04)

**Owner directive:** "Sebastian Heitmann to the top" — the lockup anchors the TOP of the full-bleed poster (reference: the AC/DC bill, logo on top, artwork below it), instead of the current vertically-centered stack.

**Files:**
- Modify: `apps/rocks/src/components/hero.tsx` (stack alignment; scrim re-weighting if needed)

**Composition:** kicker + masthead + tagline bar move to the top of the poster block (top padding roughly nav-clearance + `2-3rem`; iterate); the artwork's focal area (helmet/guitar) then owns the middle/lower poster — adjust `object-position` if the lockup now covers the figure's head; the intro moves to the BOTTOM of the poster (above the torn edge, over the bottom gradient) or tucks under the tagline if bottom placement reads worse — judgment call, note it. Re-weight the scrim to protect the top band (top-heavy gradient) since the radial center wash no longer sits behind the text.

- [ ] **Step 1:** Rework the stack alignment + scrim weighting.
- [ ] **Step 2:** Visual iteration at 1440/1024/768/375 × themes × locales × both duotone/revealed states: lockup crisp at the top, figure not decapitated by the text band, intro legible at its new position, tear intact, no hover layout shift.
- [ ] **Step 3:** `bun run build` clean; commit `feat(rocks): anchor the masthead to the top of the poster`.

---

### Task 11: "Previously at" billing-block credits in the poster (owner feedback 2026-08-04)

**Owner directive:** include the `.dev` site's "Previously at" companies in the poster; he referenced how movie posters present awards. Chosen treatment (controller): the movie-poster **billing block** — the condensed typographic credits strip at a poster's bottom edge — with asterisk separators. Text only, no logos.

**Files:**
- Modify: `apps/rocks/src/i18n/{types,en-us,de-de}.ts` (new `credits` section — owner-requested content, sanctioned copy addition)
- Modify: `apps/rocks/src/components/hero.tsx` (credits strip in the poster's bottom zone)

**Strings:** `credits: { label: string; names: string[] }` — en `{ label: 'Previously at', names: ['Jung von Matt', 'synvert', 'Granny & Smith', 'OFFIS'] }`; de `{ label: 'Zuvor bei', names: [same four names] }` (labels/names verbatim from the `.dev` site's `logos` section).

**Treatment:** centered strip at the poster's very bottom (below the intro, above the torn edge), movie-billing-block register: tiny letter-spaced mono eyebrow (the label, uppercase), beneath it one line of the four names in Anton uppercase at small size (roughly `text-sm md:text-base`, tracking wide), separated by small accent `AsteriskMark`s (~10px, wrappers not className for sizing). Wraps to two centered lines at narrow widths without orphaning a separator (separators only BETWEEN names; a flex-wrap row of name+mark pairs with the last mark omitted). Must stay legible over the bottom gradient in both themes and both duotone/revealed states; strengthen the bottom gradient slightly if needed (do not touch the width-scoped top-band fix from the previous task).

- [ ] **Step 1:** Strings + strip implementation.
- [ ] **Step 2:** Visual iteration at 1440/1024/768/375 × themes × locales × both states: billing-block reads as poster credits, no separator orphans, legible everywhere, tear untouched, no hover layout shift.
- [ ] **Step 3:** `bun run build` clean; commit `feat(rocks): previously-at billing block in the poster`.

---

### Task 7: Final verification, push, PR update

- [ ] **Step 1:** `cd apps/rocks && rm -rf dist && bun run build` — clean; no raw PNGs in dist; `dist/fonts/Anton-Regular.woff2` present.
- [ ] **Step 2:** `cd apps/apex-redirect && bun test` — 6/6 (regression tripwire).
- [ ] **Step 3:** Controller pushes (updates PR #15) and posts a PR comment summarizing v3. (The final whole-branch review happens before this step, per the SDD process.)

---

### Task 12: Hard text shadow on the tagline (owner feedback 2026-08-04)

**Owner directive:** "can you add a hard text shadow to Unconventionally Effective?"

- [ ] Give the tagline text in `apps/rocks/src/components/masthead.tsx` a HARD shadow (solid offset, zero blur) in the accent ink: `text-shadow: 2px 2px 0 var(--v8-accent)` as the starting value; iterate offset (1.5-3px) for legibility at the tagline's small size, both themes, both duotone/revealed hero states. The shadow echoes the misregistered-print brand language.
- [ ] Screenshot 1440 + 375, both themes; `bun run build` clean; commit `feat(rocks): hard accent shadow on the tagline`.

---

### Task 13: Cover-art library wired in (owner feedback 2026-08-04)

**Owner directive:** nine cover-art images added to assets for projects/cases; use them; rename them (controller renamed: cover-art-{sparks-crew, red-suits, red-shades, painted-crew, masked-duo, blue-menagerie, goggles-grin, giant-tree, cosmic-soul}.png, all 1024×1024).

- [ ] Commit all nine renamed assets (`git add apps/rocks/src/assets/cover-art-*.png`).
- [ ] Wire `cover-art-sparks-crew.png` (blue-duotone crew with ember sparks: the closest tonal match to the site's ink-and-accent system) as the `cover` of the `portfolio-platform` case entry in BOTH locale files (`cover: ../../../assets/cover-art-sparks-crew.png` relative from `src/content/cases/<locale>/` — verify the relative path against how Astro content image() resolves; adjust as needed).
- [ ] This is the FIRST real exercise of the cover pipeline (coverPanel slot on cards + DuotonePanel on detail pages): visually verify the card cover (landing, both locales, both themes, hover reveal) and the detail-page cover panel; fix any latent defects the real data exposes (the path was previously build-verified only).
- [ ] The remaining eight covers stay as an uncommitted-into-content library (committed as files) for future entries; list them in the report.
- [ ] `bun run build` clean (no raw PNGs in dist); commit content change as `feat(rocks): sparks-crew cover art for the portfolio-platform case` (assets may share this commit).

---

### Task 14: Theme-native hero artwork + poster wrinkle morphism (owner feedback 2026-08-04)

**Owner directives:** "I also added a light themes guitar player" / "we can add a bit of morphism by adding a wrinkle to the poster. I added two wrinkle textures if you need them."

**Assets (untracked, commit them):** `guitar-player-light.png` (1024×1536, white/orange keyboard-guitarist on near-white — light-theme counterpart), `wrinkle-dark.jpg` (720×1280), `wrinkle-light.jpg` (736×1308).

- [ ] **Theme-native artwork:** dark theme keeps `guitar-player.png`; light theme renders `guitar-player-light.png` instead. The site themes by `html.dark`/`html.light` class and `@custom-variant dark` exists, so `dark:`/class-based visibility works. Render both, toggle via CSS (`hidden dark:block` pattern or equivalent); decide loading (both eager, or eager the default-theme image and document the tradeoff). Judgment call to iterate: whether the light artwork keeps the duotone treatment or renders raw (it is already palette-native; raw likely reads better and the hover reveal then applies only where duotone does) — screenshots decide, document the call.
- [ ] **Wrinkle morphism:** overlay the theme-matched wrinkle texture across the whole hero poster (above the artwork, below or above the scrim — iterate), blend mode `overlay`/`soft-light`/`multiply` at tuned opacity, `background-size: cover` (small sources upscale; acceptable for a soft texture) or tiled if cover looks stretched. The poster should read subtly crumpled/physical, NOT grunge-dirty; text legibility must not degrade in any theme/state. Textures load lazily (decorative, below nothing) via CSS background or an aria-hidden img.
- [ ] **Spec amendment:** the v3 spec's "no aged-paper/grunge textures" line gets an owner-decision amendment sentence sanctioning the poster wrinkle (docs/superpowers/specs/2026-08-04-rocks-v3-neo-retro-design.md, Out of Scope section).
- [ ] Visual iteration at 1440/1024/768/375 × themes × locales × duotone/revealed states; `bun run build` clean (no raw source images in dist beyond known orphans); commits: `feat(rocks): theme-native hero artwork` and `feat(rocks): wrinkle morphism on the poster` (spec edit may ride the second).

---

### Task 15: Real paper tear on the poster's bottom edge (owner feedback 2026-08-04)

**Owner directive:** "The roughed up edge on the bottom doesn't look good. It should look more like a tear."

- [ ] Rework the hero's bottom edge from the current jittered clip into something that reads as an actual ripped sheet: large-scale asymmetric tear path (amplitude roughly 12-28px with a few deep V-rips, low-frequency waviness underneath, fine jitter only as seasoning — uniform sawtooth is the failure mode), PLUS a visible torn-fiber edge: a thin light line hugging the tear path (exposed paper fiber; in light theme a subtle shadow below it sells depth, in dark theme the light fiber line itself does). Implementation stays CSS/SVG (clip-path + an edge element following the same generated path); keep the wrinkle overlay and all hero content unaffected; no layout shift.
- [ ] Iterate with close-up screenshots of the tear zone at 1440 + 375, both themes, until it reads "someone ripped this poster off the wall", then full-hero sanity shots.
- [ ] `bun run build` clean; commit `fix(rocks): make the poster's bottom edge read as a real tear`.

---

### Task 16: Case teasers as album covers (owner feedback 2026-08-04)

**Owner directive:** "make the teaser for the case study square and add the copy onto the image to make it look like a single or album cover art."

- [ ] Rework `CaseCard` into a square (aspect-square) album-cover tile: the cover art fills the whole card (duotone + hover full-color reveal, clean edges); the copy composites ONTO the artwork like a sleeve: setlist number (`01 /`) top-left and the rotated stamp top-right in mono, the title in Anton uppercase over a bottom gradient scrim, summary/role/stack REMOVED from the tile (the detail page owns them; an album cover carries title and label marks, not liner notes). The whole tile links to the detail page (kind case-study) or the external link (kind project).
- [ ] Entries WITHOUT cover art get a generated sleeve: solid `--v8-bg-surface` ground with a big rough `AsteriskMark` (tone faint, misregister) and the same overlaid copy — so the grid stays coherent as content grows.
- [ ] Grid: squares likely want 3 columns at `lg` (2 at md, 1 below); iterate visually. Both locale pages parallel. Accessibility: the tile link's accessible name is the title; overlaid text must stay AA-legible over every cover in both themes and both duotone/revealed states (scrim strength per tile, not per artwork).
- [ ] Visual iteration incl. the seed entry's sparks-crew cover + at least one placeholder-sleeve mock (temporarily unset cover on a copy? No: verify the placeholder path with a temporary draft entry deleted before commit, or by temporarily removing the cover in the dev server only); screenshots at 1440/768/375 × themes × locales.
- [ ] `bun run build` clean; commit `feat(rocks): album-cover case tiles`.

---

### Task 17: Light-theme poster unification (owner feedback 2026-08-05, screenshots)

**Owner directives:** (1) light-theme tagline: "The shadow doesn't work here" — the black hard shadow smears against near-black text on light paper. (2) mobile light theme "looks like a different poster. Align it with the higher width pages" — the raw light artwork's own near-white ground reads as a separate grey panel on the cream page (hard seam, large empty gap above it, wrinkle not continuous through the art).

- [ ] **Tagline shadow:** scope the black hard shadow to dark theme only (`dark:` variant). In light theme try (a) no shadow and (b) a subtle paper-light letterpress offset (e.g. `1.5px 1.5px 0 rgba(255,255,255,0.9)`); pick by screenshot, document the call.
- [ ] **Merge the light artwork into the sheet:** render the light guitar player with `mix-blend-mode: multiply` (its near-white ground disappears into the cream paper and the wrinkle texture reads THROUGH the art — one continuous sheet, no seam) instead of raw-on-panel. Verify the flames/orange survive multiply acceptably; tune contrast/brightness filter if the figure washes out. Hover behavior in light theme stays none (already so).
- [ ] **Align mobile composition with desktop:** per-theme crop/scale so the light image at small widths composes like the desktop poster (figure placed proportionally, no dead band between tagline and art, intro/billing not colliding); the existing `scale(1.4)` mobile trick was tuned on the dark art — retune or branch per theme as needed. Both themes at 375/768 must read as the SAME poster as 1440, just narrower.
- [ ] Visual iteration at 1440/1024/768/375 × BOTH themes × locales (dark must not regress); `bun run build` clean; commit `fix(rocks): unify the light-theme poster and scope the tagline shadow`.

---

### Task 18: Mobile hero placement under the nav (owner feedback 2026-08-05)

**Owner directive:** "On mobile, the placement of the hero is off. It doesn't sit under the nav like the desktop version."

- [ ] Reproduce FIRST: screenshot the nav/hero seam at 375 and 768 (both themes) and diagnose the actual offset (suspects: the hero's `calc(100svh - 6rem)` height paired with a mobile nav that wraps taller than 6rem; the masthead block's top padding tuned for desktop nav clearance; any fixed/sticky nav behavior differing by width).
- [ ] Fix so the poster starts immediately below the nav at every width, matching the desktop relationship (options: measure-free CSS such as the hero filling the remaining viewport via flex column on a `min-h-svh` page wrapper instead of hardcoded rem subtraction; or width-scoped clearance values). No magic numbers that break when the nav wraps differently in de-de (its longer CTA wraps the nav to three rows at 375 — test that case explicitly).
- [ ] Verify 375/768/1024/1440 × themes × locales: no gap, no overlap, poster fold-fill preserved at desktop, tear/billing intact; `bun run build` clean; commit `fix(rocks): seat the hero under the nav at every width`.

---

### Task 19: One continuous mobile poster (owner feedback 2026-08-05, round 2 screenshot)

**Owner directive:** dark-mobile screenshot shows the poster split in two: an orange band (masthead area) ending in a hard horizontal seam, then the artwork as a separate dark block. "This is no better."

**Diagnosis:** the `max-lg` `scale(1.4)` + shifted `transform-origin` crop slides the artwork's top edge DOWN below the poster's top; the region above it exposes the `.v8-duotone` wrapper's accent ground (blended with the wrinkle) → the orange band + seam. The scale-hack approach has failed twice (light seam, now dark band).

- [ ] **Remove the mobile scale/transform crop entirely** (both themes). The art layer covers the poster by construction: `absolute inset-0` + `object-cover`, full stop. Composition control comes ONLY from per-theme/per-breakpoint `object-position` (and, if the helmet still collides with text at small widths, scrim adjustments — never uncovered regions).
- [ ] **Acceptance bar (hard):** at 375/430/768, both themes, both locales, duotone AND revealed: the poster is ONE continuous sheet — no horizontal edge, band, or ground-color region anywhere between the nav seam and the tear. Compare each mobile shot side-by-side against the 1440 shot of the same theme: same poster, narrower.
- [ ] Desktop (1024+) must remain pixel-identical (it never used the scale trick). Protected: scrim bands (the 1024-1362 band and light-theme additions), tear, billing block, wrinkle.
- [ ] `bun run build` clean; commit `fix(rocks): cover the full poster with artwork on mobile`.

---

### Task 20: Photographic tear via mask image (owner decision 2026-08-05)

**Owner directive:** "using an image of an actual paper tear is better than using a polypath to cut it out." Controller sourced a licensed texture: TextureLabs Paper 314 (https://texturelabs.org/wp-content/uploads/Texturelabs_Paper_314S.jpg, 1920×1388, torn-edge fiber lines on black; license: free commercial website use, no attribution, DO NOT commit the original file to the repo — public repo redistribution is barred; commit only the processed derivative).

- [ ] **Generate the mask:** write `apps/rocks/scripts/generate-tear-mask.mjs` (Bun + the already-installed `sharp`): download the source to the OS temp dir (not the repo), crop a band around ONE clean edge line (pick the most fibrous full-width line), then per-column: find the fiber boundary, render white above / black below with the fiber's own grayscale forming the transition. Output `apps/rocks/src/assets/tear-mask.png` (1920 wide, roughly 160-260 tall, grayscale, committed). The script is deterministic and documents the source URL + license in a header comment.
- [ ] **Swap the hero edge from clip-path to CSS mask:** restructure so the maskable stack (art + scrims + wrinkle) sits in ONE wrapper masked via `mask-image: linear-gradient(#fff,#fff), url(tear-mask.png)` (gradient sized to fill all but the strip height, strip anchored bottom, `mask-mode: luminance`, `mask-size: 100% <strip>`, no-repeat, appropriate `mask-composite`/positioning — iterate); content (masthead, intro, billing) stays unmasked above. The generated `HERO_TEAR`/`HERO_TEAR_SM` clip paths and the drawn fiber SVG RETIRE (the photo brings its own fiber). Keep: scrim behavior, wrinkle continuity, per-theme art, no layout shift, mobile continuity from Task 19 (mask scales with width; verify fiber reads at 375 and 1920).
- [ ] **Fiber visibility per theme:** on dark the fiber's white detail reads as exposed paper (good); on light verify the edge against the cream page (a subtle shadow under the mask edge may be needed — additive only).
- [ ] Visual iteration at 375/768/1024/1440 × themes × locales incl. tear close-ups; `bun run build` clean; commits: `feat(rocks): generate photographic tear mask` (script + asset) and `feat(rocks): photographic tear edge via css mask` (hero swap).

---

### Task 21: Whitened paper fiber on the tear (owner feedback 2026-08-05)

**Owner directive:** "make the paper tear a bit more paper like by whitening the tear" — the torn edge should show visible white paper fiber, like exposed pulp on a real rip.

- [ ] Extend `generate-tear-mask.mjs` to ALSO emit `apps/rocks/src/assets/tear-fiber.png`: the boundary band's fiber detail rendered as white-with-alpha (transparent elsewhere), same 1920 width and boundary geometry as the mask so the two derivatives align by construction.
- [ ] Overlay it at the hero's bottom edge (aria-hidden, pointer-events-none, above the wrinkle, below content), scaled identically to the mask strip (`100% <strip-height>`, bottom-anchored) so the white fiber hugs the cut. Tune opacity per theme (dark: strong — this is where it pops; light: subtler, the paper below is already light; a slight warm tint toward the paper tone is allowed if pure white looks clinical).
- [ ] Verify alignment at 375/768/1440 both themes (fiber must sit ON the edge at every width, no floating white line offset from the cut); hover states unchanged; `bun run build` clean; commit `feat(rocks): whitened paper fiber on the tear edge`.

---

### Task 22: Case tiles as CD jewel cases (owner feedback 2026-08-05)

**Owner directive:** "Now to the cd cover for the cases on the home. I like to make them look like a cd case."

- [ ] Rework `CaseCard` so each tile reads as a CD JEWEL CASE containing the cover art (front-on view). The vocabulary that sells it (all CSS/SVG, no image assets, no new deps):
  - **Spine:** a vertical bar on the left edge (roughly 7-10% of tile width), visually distinct (darker plastic tone), carrying the case's hinge geometry: small notch marks near top and bottom (the hinge teeth). Optional: the title in tiny rotated mono on the spine like a real CD spine — iterate, drop it if it doubles the title awkwardly.
  - **Plastic gloss:** subtle diagonal highlight streaks across the front (low-opacity white linear-gradients, 1-2 streaks), a brighter thin edge highlight top/left and shadow bottom/right (bevel), and a faint overall sheen. Must read in BOTH themes without washing out the duotone art or the overlaid copy.
  - **Existing tile content stays:** duotone cover art (with hover full-color reveal), overlaid number/stamp/title, whole-tile link, placeholder sleeve for coverless entries (the plastic case wraps the placeholder art the same way).
- [ ] The gloss/spine layers must not break the hover reveal, AA text contrast (per-tile scrim may be retuned additively), or the square grid (spine included WITHIN the square tile).
- [ ] Visual iteration at 1440/768/375 × themes × locales, duotone + revealed, incl. a close-up of one tile per theme (does it read "CD case" at a glance?) and a placeholder-sleeve check (temporary entry, reverted before commit).
- [ ] `bun run build` clean; commit `feat(rocks): cd jewel case treatment for case tiles`.

---

### Task 23: Hover flips the case to its back (owner feature 2026-08-05)

**Owner directive:** "change the behavior of the on hover. I like to flip the case horizontally, so that the back appears. The background art is just the image without the orange tint and some information about the case study. I thought about maybe making it reminiscent to the track list but with tech and roles or similar."

- [ ] **Flip mechanic:** hover (and `:focus-within` for keyboard) rotates the tile 180° on the Y axis (CSS `perspective` on the grid cell, `transform-style: preserve-3d`, `backface-visibility: hidden` on both faces, ~0.5-0.7s ease). This REPLACES the duotone hover reveal on tiles (the front stays permanently duotone; remove the tile-scoped reveal, do not touch the hero's reveal). Under `prefers-reduced-motion: reduce`: no rotation — instant face swap (opacity) or no flip at all, judged; touch devices keep tap-to-navigate on the front (back is a pointer-hover bonus).
- [ ] **The back face:** a mirrored jewel-case back — spine edge continuity on the right, same plastic gloss/bevel language, ribbed 6px hinge teeth mirrored. Background: the SAME cover art in full color (no duotone tint), darkened/blurred just enough under the panel for legibility. Over it, the CD-back idiom: a track-list panel (semi-translucent dark panel like printed back inlays) listing the case study's data as tracks: numbered rows from `stack` (01, 02, ... in mono, dotted leaders optional), a `role` line, the year; labels via NEW `Strings.caseBack` section (e.g. `{ tracksLabel: 'Stack' / 'Stack', roleLabel, yearLabel }` — reuse existing `cases.roleLabel` where sensible instead of duplicating). Placeholder-sleeve entries: same back panel over the sleeve ground.
- [ ] **Integrity:** whole-tile link still works from BOTH faces (the link must not be duplicated in the a11y tree — one stretched link, faces are presentational); accessible name unchanged; no layout shift; grid/aspect untouched; both locales parallel; AA contrast on the back panel.
- [ ] Visual iteration at 1440/768 both themes both locales: front, mid-flip feel, back; reduced-motion emulation; `bun run build` clean; commit `feat(rocks): flip case tiles to a track-list back on hover`.

---

### Task 25: Case entries from Sebastian's repositories (owner request 2026-08-05)

**Owner directive:** "Can you add some more cases from my repositories?"

- [ ] Research via `gh` (READMEs + repo metadata; several repos are private — the local gh auth is the owner's): draft content entries in BOTH locales for: `blickwerk` (case-study), `job-directory` (case-study), `v8-asterisk` (case-study), `sub-tracker` (project), `typescript-best-practices` (project). Facts ONLY from the repos (description, README, languages, first/last commit dates for startDate); role is honest ("Design and development" etc.); NO invented outcomes or clients; summaries in the site's dry register; German is real German. Entries whose repos are private get no source link (links: [] or a live URL only if the README names one, e.g. blickwerk/job-directory live deployments if documented).
- [ ] Covers from the committed library (owner may reassign): blickwerk → cover-art-goggles-grin, job-directory → cover-art-red-suits, v8-asterisk → cover-art-red-shades, sub-tracker → cover-art-masked-duo, typescript-best-practices → cover-art-blue-menagerie. `featured: false` for all (portfolio-platform stays the featured lead); kind per above; draft: false.
- [ ] Verify: build clean; landing shows six tiles (4 case studies incl. seed, 2 projects) in both locales; detail pages emit for the case-study kinds; jewel-case grid + flip work per tile (spot screenshots). Commit `feat(rocks): five case entries drafted from the owner's repositories`.
- [ ] PR note + report must flag: copy is DRAFTED FOR OWNER REVIEW.

### Task 26: Per-tile pose variance (owner request 2026-08-05)

**Owner directive:** "this will sell even better, when we apply different tilts"

- [ ] Give each tile a deterministic individual rest pose instead of the uniform rotateY(22) rotateX(8): a small fixed set of pose variants (4-6 combos varying rotY roughly 12-28deg, INCLUDING one or two turned the other way — negative rotY showing the opening edge instead of the spine — and rotX 5-10deg, always top-leaning-back positive), selected by `index % variants.length` (SSR-deterministic, no randomness). The hover flip still settles at the mirrored-bias back (adjust per-variant if a negative-rotY rest makes 170° read wrong — judge visually; per-variant settle angles are fine).
- [ ] Legibility bar: front copy AA-legible at the extreme variants both themes; the grid reads as casually-placed cases, not chaos (screenshots of the six-tile grid at 1440 + 768 both themes judge it).
- [ ] Build clean; commit `feat(rocks): individual resting tilts per case tile`.

---

### Task 27: Large-screen typography scale (owner feedback 2026-08-05)

**Owner directive:** "It looks good up until 1080 but on larger screens, the copy gets hard to read, especially when it is kept small."

- [ ] **Fluid root scale:** in `global.css`, give `html` a root font-size that stays 16px up to ~1440px viewport width and grows fluidly to ~19px by ~2560px (e.g. `font-size: clamp(16px, calc(16px + (100vw - 1440px) * 0.003), 19px)` — exact curve iterated visually; must be a no-op at and below 1440 so nothing regresses). Everything rem-based (Tailwind text scale, spacing, the masthead clamp's rem cap) then grows together, preserving compositions.
- [ ] **Convert pixel-pinned TEXT sizes to rem** so they participate: audit every `text-[Npx]` in apps/rocks/src (mono labels 9/10/11/13px are the worst offenders the owner means) and convert to rem-based arbitrary values (`text-[0.6875rem]` etc. — same rendered size at root 16, scaling above). Letter-spacing in em already scales. Do NOT convert physical/decorative px: hinge teeth height, crack width, borders, tear/mask geometry, blur/offset values, the favicon.
- [ ] **Audit line-height + measure:** where copy blocks (intro, case prose, about body, back-inlay track list) grow, confirm max-width containers (`max-w-[58ch]` etc.) are ch/rem-based so measure scales sanely; fix any px-based text containers.
- [ ] Verify at 1080 (unchanged - pixel-diff a page), 1440 (unchanged or imperceptibly larger), 1920 and 2560 (copy comfortably larger, compositions intact: hero poster, jewel-case grid incl. spine titles + track-list backs, billing block, detail pages, footer) — both themes, both locales. Check the jewel case: cqw-based depth is container-relative (unaffected), but rem-based paddings inside tiles will grow slightly — confirm no overflow/clipping in the tiles at 2560.
- [ ] `bun run build` clean; commit `feat(rocks): fluid large-screen typography scale`.
