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

### Task 7: Final verification, push, PR update

- [ ] **Step 1:** `cd apps/rocks && rm -rf dist && bun run build` — clean; no raw PNGs in dist; `dist/fonts/Anton-Regular.woff2` present.
- [ ] **Step 2:** `cd apps/apex-redirect && bun test` — 6/6 (regression tripwire).
- [ ] **Step 3:** Controller pushes (updates PR #15) and posts a PR comment summarizing v3. (The final whole-branch review happens before this step, per the SDD process.)
