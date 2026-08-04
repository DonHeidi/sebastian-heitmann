# rocks v2 "Punk" Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give sebastian-heitmann.rocks its "rock'n'roll meets engineering" identity: asterisk brand mark, engineering backdrop art, punk print treatments, swagger copy, pixel rocker easter egg.

**Architecture:** Pure front-end evolution of `apps/rocks` v1 (already on this branch). New presentational components (`AsteriskMark`, `HeroStageMoment`, `DetailMoment`, `PixelRocker`), CSS utilities in `global.css`, a `Strings` copy rewrite, and page rewiring. No infra, deploy, content, or dependency changes. Spec: `docs/superpowers/specs/2026-08-03-rocks-v2-punk-design.md`.

**Tech Stack:** Astro 7, React 19 TSX (static components; no new islands), Tailwind v4 utilities + `@layer components` CSS, SVG.

## Global Constraints

- All `--v8-*` tokens unchanged; every treatment must work in `.dark` AND `.light`
- Fonts unchanged; no new dependencies; no new React islands (all new components are static)
- No hardcoded user-visible text in components: all copy flows through `Strings` (mono annotation labels like `EST. 1440 PX` count as user-visible → they live in `Strings` too)
- All motion inside `@media (prefers-reduced-motion: no-preference)`; reduced motion = static
- Backdrop components: `aria-hidden="true"`, `pointer-events-none`, absolutely positioned, `-z-10`, parent gets `relative`
- The pixel rocker must NOT resemble any real person (no Slash likeness: no top hat)
- en-us unprefixed, de-de under `/de-de/`; the en/de page pairs stay structurally parallel
- Conventional commits; work only in this worktree (branch `worktree-feat-rocks-portfolio-site`); never push until the final task
- Verification for each task: `cd apps/rocks && bun run build` clean; visual tasks additionally screenshot with the dev server (Astro 7 dev daemonizes: start with `bun run dev`, stop with `bunx astro dev stop`)

---

### Task 1: AsteriskMark component, motion/print CSS utilities, favicon

**Files:**
- Create: `apps/rocks/src/components/asterisk-mark.tsx`
- Modify: `apps/rocks/src/styles/global.css` (append one `@layer components` block)
- Replace: `apps/rocks/public/favicon.svg`

**Interfaces:**
- Produces: `AsteriskMark({ size, rotation = 8, tone = 'ink', misregister = false, spin = false, className = '' })` — `size: number` (px), `tone: 'accent' | 'ink' | 'faint'`, `misregister: boolean` (accent ghost copy offset behind), `spin: boolean` (slow rotation, motion-safe). Also CSS classes `.misregister-text`, `.v8-spin-slow`, `.v8-spin-hover` and keyframes `v8-rotate`.

- [ ] **Step 1: Write `src/components/asterisk-mark.tsx`**

The mark: six spokes on a 100×100 viewBox, 60° apart, deliberately uneven lengths, round caps. This exact geometry is the brand mark — copy it verbatim:

```tsx
export interface AsteriskMarkProps {
  /** Rendered width/height in px. */
  size: number;
  /** Degrees; the mark's natural tilt is 8. */
  rotation?: number;
  tone?: 'accent' | 'ink' | 'faint';
  /** Render an accent ghost copy offset behind the mark (off-register print). */
  misregister?: boolean;
  /** Slow continuous rotation (motion-safe only). */
  spin?: boolean;
  className?: string;
}

const TONE: Record<NonNullable<AsteriskMarkProps['tone']>, string> = {
  accent: 'var(--v8-accent)',
  ink: 'var(--v8-text)',
  faint: 'var(--v8-border)',
};

// Six spokes, 60° apart, uneven lengths (44/36/42/38/45/37): hand-set, not the font glyph.
function spokes(stroke: string) {
  const lengths = [44, 36, 42, 38, 45, 37];
  return (
    <g stroke={stroke} strokeWidth={9} strokeLinecap="round">
      {lengths.map((len, i) => {
        const a = (i * 60 * Math.PI) / 180;
        return (
          <line
            key={i}
            x1={50 - Math.cos(a) * len * 0.18}
            y1={50 - Math.sin(a) * len * 0.18}
            x2={50 + Math.cos(a) * (len / 2)}
            y2={50 + Math.sin(a) * (len / 2)}
          />
        );
      })}
    </g>
  );
}

export function AsteriskMark({
  size,
  rotation = 8,
  tone = 'ink',
  misregister = false,
  spin = false,
  className = '',
}: AsteriskMarkProps) {
  return (
    <span
      className={`inline-block ${spin ? 'v8-spin-slow' : ''} ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        style={{ transform: `rotate(${rotation}deg)`, display: 'block', overflow: 'visible' }}
      >
        {misregister && (
          <g transform="translate(3.5 3)" opacity={0.9}>
            {spokes('var(--v8-accent)')}
          </g>
        )}
        {spokes(TONE[tone])}
      </svg>
    </span>
  );
}
```

- [ ] **Step 2: Append the print/motion utilities to `src/styles/global.css`**

New documented `@layer components` block (same multi-block convention the file already uses):

```css
@layer components {
  /* v2 punk print/motion utilities. Misregistration = off-register zine
     printing: an accent ghost behind the ink original. Text version needs
     data-text="<same text>" on the element. All motion is motion-safe. */
  .misregister-text {
    position: relative;
    display: inline-block;
  }
  .misregister-text::before {
    content: attr(data-text);
    position: absolute;
    left: 3px;
    top: 3px;
    color: var(--v8-accent);
    opacity: 0.9;
    z-index: -1;
  }

  @keyframes v8-rotate {
    to {
      transform: rotate(360deg);
    }
  }
  @media (prefers-reduced-motion: no-preference) {
    .v8-spin-slow {
      animation: v8-rotate 60s linear infinite;
    }
    .v8-spin-hover:hover {
      animation: v8-rotate 1.2s linear infinite;
    }
  }
}
```

- [ ] **Step 3: Replace `public/favicon.svg`**

Same six-spoke geometry, accent on ink, precomputed (no build step). Copy verbatim:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="geometricPrecision">
  <rect width="32" height="32" fill="#0C0C0C"/>
  <g transform="translate(16 16) rotate(8)" stroke="#FF3B00" stroke-width="3.4" stroke-linecap="round">
    <line x1="-2.5" y1="0" x2="7" y2="0"/>
    <line x1="-1.1" y1="-1.9" x2="2.9" y2="5"/>
    <line x1="1.2" y1="-2.1" x2="-3.4" y2="5.8"/>
    <line x1="2.2" y1="0" x2="-6.1" y2="0"/>
    <line x1="1.3" y1="2.3" x2="-3.6" y2="-6.2"/>
    <line x1="-1.1" y1="1.9" x2="3" y2="-5.2"/>
  </g>
</svg>
```

After writing it, screenshot a browser tab (dev server) and confirm the mark reads as an asterisk at 16px. Adjust stroke-width (3.0-3.8 range) if it smudges; keep geometry.

- [ ] **Step 4: Verify build** — `cd apps/rocks && bun run build`: clean (component unreferenced yet).

- [ ] **Step 5: Commit** — `git add apps/rocks && git commit -m "feat(rocks): add asterisk brand mark, print utilities, and favicon"`

---

### Task 2: Copy rewrite (Strings interface + both locales)

**Files:**
- Modify: `apps/rocks/src/i18n/types.ts`
- Modify: `apps/rocks/src/i18n/en-us.ts`
- Modify: `apps/rocks/src/i18n/de-de.ts`

**Interfaces:**
- Produces (consumed by Tasks 3-6) — the `Strings` sections change to exactly:

```ts
hero: {
  kicker: string;                // 'Portfolio'
  headingParts: { misregistered: string; rest: string }; // heading = misregistered + rest
  intro: { before: string; struck: string; replacement: string; after: string };
};
annotations: {                   // mono backdrop labels (hero stage moment)
  setlist: string;               // 'SETLIST: CASES' / 'SETLIST: FALLSTUDIEN'
  est: string;                   // 'EST. 1440 PX' (both locales)
};
cases: {
  sectionTitle: string;          // now 'Setlist: Cases' / 'Setlist: Fallstudien'
  stampCaseStudy: string;        // 'CASE STUDY' / 'FALLSTUDIE'
  stampProject: string;          // 'PROJECT' / 'PROJEKT'
  readCase: string; roleLabel: string; stackLabel: string; linksLabel: string;
  periodLabel: string; ongoing: string; backToOverview: string;   // unchanged
};
projects: { sectionTitle: string };   // 'Side Projects' both locales
teasers: { sectionTitle: string; intro: string; readOn: string };  // sectionTitle reworded
notFound: { heading: string; body: string; backHome: string };     // reworded
```

All other sections (`meta`, `nav`, `languagePicker`, `themeToggle`, `footer`) unchanged.

- [ ] **Step 1: Update `types.ts`** to the shape above (add `annotations`, `hero.headingParts`, `hero.intro` object, `cases.stampCaseStudy`, `cases.stampProject`; `hero.heading`/`hero.intro`-as-string are removed).

- [ ] **Step 2: Update `en-us.ts`** — new/changed values exactly:

```ts
hero: {
  kicker: 'Portfolio',
  headingParts: { misregistered: 'Loud', rest: ' where it counts.' },
  intro: {
    before: 'Everything here shipped. The ',
    struck: 'portfolio',
    replacement: 'setlist',
    after: ' below: built end to end, tuned in production.',
  },
},
annotations: { setlist: 'SETLIST: CASES', est: 'EST. 1440 PX' },
// cases: sectionTitle: 'Setlist: Cases', stampCaseStudy: 'CASE STUDY', stampProject: 'PROJECT' (rest unchanged)
// projects: sectionTitle: 'Side Projects'
// teasers: sectionTitle: 'From the .dev Press' (intro/readOn unchanged)
// notFound: heading: 'NO ENCORE.', body: 'This page never made the setlist.', backHome: 'Back to the show'
```

- [ ] **Step 3: Update `de-de.ts`** — new/changed values exactly:

```ts
hero: {
  kicker: 'Portfolio',
  headingParts: { misregistered: 'Laut', rest: ', wo es zählt.' },
  intro: {
    before: 'Alles hier ist live gegangen. ',
    struck: 'Portfolio',
    replacement: 'Setlist',
    after: ' unten: komplett selbst gebaut, in Produktion feinjustiert.',
  },
},
annotations: { setlist: 'SETLIST: FALLSTUDIEN', est: 'EST. 1440 PX' },
// cases: sectionTitle: 'Setlist: Fallstudien', stampCaseStudy: 'FALLSTUDIE', stampProject: 'PROJEKT'
// projects: sectionTitle: 'Side Projects'
// teasers: sectionTitle: 'Aus der .dev Presse'
// notFound: heading: 'KEINE ZUGABE.', body: 'Diese Seite hat es nie auf die Setlist geschafft.', backHome: 'Zurück zur Show'
```

- [ ] **Step 4: Fix the compile fallout NOW** — `hero.tsx` and the 404 page still read the old shapes. Make the minimal interim edits so the build passes (hero.tsx: render `headingParts.misregistered + headingParts.rest` as plain text and join the intro parts with the replacement, skipping the struck word; 404: strings unchanged in shape). Tasks 4 and 6 replace these interims with the real treatments.

- [ ] **Step 5: Verify build** — clean; grep the built HTML: `grep -o 'NO ENCORE' dist/404.html` and `grep -o 'Setlist' dist/de-de/index.html` both hit.

- [ ] **Step 6: Commit** — `git commit -am "feat(rocks): rewrite copy with setlist attitude in both locales"`

---

### Task 3: Engineering backdrop kit (`.bd-*` CSS + two moment components)

**Files:**
- Modify: `apps/rocks/src/styles/global.css` (append the `.bd-*` block copied from apps/website)
- Create: `apps/rocks/src/components/backdrop/hero-stage-moment.tsx`
- Create: `apps/rocks/src/components/backdrop/detail-moment.tsx`

**Interfaces:**
- Consumes: `AsteriskMark` (Task 1), `Strings['annotations']` (Task 2).
- Produces: `HeroStageMoment({ annotations })` with `annotations: Strings['annotations']`; `DetailMoment()` (no props).

- [ ] **Step 1: Copy the `.bd-*` vocabulary** — open `apps/website/src/styles/global.css`, locate the documented `@layer components` block(s) defining the backdrop vocabulary (`.bd-grid-full`, `.bd-dots`, `.bd-stroke-mid`, `.bd-stroke-faint`, `.bd-dim-label` and any custom properties they reference), and copy those rules verbatim into a new documented block in `apps/rocks/src/styles/global.css`. Copy only the `.bd-*` rules and their direct dependencies, not unrelated blocks. If a rule references an asset (e.g. an SVG data URI), copy it as-is.

- [ ] **Step 2: Write `hero-stage-moment.tsx`** — modeled on `apps/website/src/components/backdrop/hero-print-moment.tsx` (read it first), with the asterisk crashing through:

```tsx
import { AsteriskMark } from '../asterisk-mark';
import type { Strings } from '../../i18n/types';

export interface HeroStageMomentProps {
  annotations: Strings['annotations'];
}

export function HeroStageMoment({ annotations }: HeroStageMomentProps) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* anchor: engineering grid cropped by the bottom-right corner */}
      <div className="bd-grid-full absolute right-0 bottom-0 h-[42%] w-[58%] lg:h-[60%] lg:w-[44%]" />
      {/* texture: dot field on the right rail */}
      <div className="bd-dots absolute top-[90px] right-[110px] hidden h-[360px] w-[300px] lg:block" />
      {/* connector: dimension line annotating the layout width */}
      <svg className="absolute right-[80px] bottom-[calc(60%+6px)] hidden h-10 w-[400px] lg:block" viewBox="0 0 400 40" fill="none">
        <path className="bd-stroke-mid" d="M10 28 H390 M10 20 V36 M390 20 V36" />
        <text x="170" y="14" className="bd-dim-label">{annotations.est}</text>
      </svg>
      {/* setlist annotation, stamped sideways on the left rail */}
      <span className="bd-dim-label absolute left-6 top-[38%] hidden origin-left -rotate-90 lg:block">
        {annotations.setlist}
      </span>
      {/* registration mark */}
      <svg className="absolute top-9 right-[180px] hidden h-[100px] w-[100px] lg:block" viewBox="0 0 100 100" fill="none">
        <g className="bd-stroke-faint" transform="translate(50 50)">
          <circle r="13" />
          <path d="M-21 0H21 M0 -21V21" />
        </g>
      </svg>
      {/* the rock element: big misregistered asterisk, bleeding off the right edge */}
      <div className="absolute -right-16 top-16 opacity-90 md:-right-10 md:top-10">
        <AsteriskMark size={280} misregister spin className="md:hidden" />
        <AsteriskMark size={420} misregister spin className="hidden md:block" />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Write `detail-moment.tsx`**:

```tsx
export function DetailMoment() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* crop marks, top-left */}
      <svg className="absolute top-6 left-6 hidden h-[70px] w-[70px] lg:block" viewBox="0 0 70 70" fill="none">
        <path className="bd-stroke-faint" d="M10 60 V10 H60" />
      </svg>
      {/* faint grid corner, bottom-right */}
      <div className="bd-grid-full absolute right-0 bottom-0 hidden h-[28%] w-[30%] opacity-60 lg:block" />
    </div>
  );
}
```

- [ ] **Step 4: Verify build** clean; **Step 5: Commit** — `git commit -am "feat(rocks): add engineering backdrop kit with stage and detail moments"`

---

### Task 4: Hero redesign + landing wiring (both locales)

**Files:**
- Modify: `apps/rocks/src/components/hero.tsx` (full rewrite below)
- Modify: `apps/rocks/src/pages/index.astro` and `apps/rocks/src/pages/de-de/index.astro` (wrap hero region, mount `HeroStageMoment`)

**Interfaces:**
- Consumes: `AsteriskMark`, `.misregister-text`, `HeroStageMoment`, `Strings['hero']`, `Strings['annotations']`.
- Produces: `Hero({ hero })` unchanged signature (`hero: Strings['hero']`).

- [ ] **Step 1: Rewrite `hero.tsx`**:

```tsx
import type { Strings } from '../i18n/types';

export interface HeroProps {
  hero: Strings['hero'];
}

export function Hero({ hero }: HeroProps) {
  return (
    <header className="mx-auto max-w-[1440px] px-6 pt-16 pb-12 md:px-20 md:pt-28 md:pb-20">
      <p className="reveal font-mono text-[11px] tracking-[0.2em] text-primary uppercase">{hero.kicker}</p>
      <h1 className="reveal mt-4 max-w-[14ch] font-[family-name:var(--v8-font-display)] text-[clamp(3.5rem,9vw,7.5rem)] leading-[0.95] text-foreground">
        <span className="misregister-text" data-text={hero.headingParts.misregistered}>
          {hero.headingParts.misregistered}
        </span>
        {hero.headingParts.rest}
      </h1>
      <p className="reveal mt-8 max-w-[58ch] text-base leading-relaxed text-muted-foreground md:text-lg">
        {hero.intro.before}
        <s className="opacity-60">{hero.intro.struck}</s>{' '}
        <strong className="font-medium text-foreground">{hero.intro.replacement}</strong>
        {hero.intro.after}
      </p>
    </header>
  );
}
```

- [ ] **Step 2: Wire the backdrop into both index pages** — in `index.astro` and `de-de/index.astro`: import `HeroStageMoment`, wrap the hero region so the moment can anchor:

```astro
<div class="relative overflow-hidden">
  <HeroStageMoment annotations={t.annotations} />
  <Hero hero={t.hero} />
</div>
```

(Keep both files parallel; the rest of the page structure is untouched in this task.)

- [ ] **Step 3: Verify visually** — dev server, screenshot `/` and `/de-de/` at 1440 and 375, both themes: poster heading with accent ghost on the first word, strikethrough intro, big asterisk bleeding off the right edge BEHIND text, grid/dots/labels visible but subordinate. Fix what's off before committing.

- [ ] **Step 4: Build + commit** — `git commit -am "feat(rocks): poster hero with misregistration and stage backdrop"`

---

### Task 5: Setlist treatment (cards, numbering, stamps, section kickers)

**Files:**
- Modify: `apps/rocks/src/components/case-card.tsx`
- Modify: `apps/rocks/src/components/teaser-card.tsx` (asterisk bullet only)
- Modify: `apps/rocks/src/pages/index.astro` + `apps/rocks/src/pages/de-de/index.astro` (section headers, numbering)

**Interfaces:**
- Consumes: `AsteriskMark`, `Strings['cases']` (incl. new stamp labels).
- Produces: `CaseCard({ data, href, strings, index })` — new required `index: number` (0-based; renders `01 /`); `data` gains `startDate: Date` in `CaseCardData` (for the stamp year).

- [ ] **Step 1: Update `case-card.tsx`** — add to `CaseCardData`: `startDate: Date`. New props: `index: number`. Card top row becomes number + stamp:

```tsx
// inside the <article>, before the <h3>:
<div className="flex items-start justify-between">
  <span className="font-mono text-[11px] tracking-[0.1em] text-muted-foreground">
    {String(index + 1).padStart(2, '0')} /
  </span>
  <span className="rotate-2 border border-border px-2 py-1 font-mono text-[9px] tracking-[0.14em] text-muted-foreground uppercase">
    {data.kind === 'case-study' ? strings.stampCaseStudy : strings.stampProject}{' '}
    {data.startDate.getFullYear()}
  </span>
</div>
<h3 className="mt-4 font-[family-name:var(--v8-font-display)] text-3xl text-foreground">{data.title}</h3>
```

(The `<h3>` grows from `text-2xl` to `text-3xl`; everything else in the card stays.)

- [ ] **Step 2: Section kickers with asterisk bullets** — in both index pages, each section `<h2>` becomes:

```astro
<h2 class="reveal flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
  <AsteriskMark size={12} tone="accent" className="v8-spin-hover" />
  {t.cases.sectionTitle}
</h2>
```

(same pattern for projects and teasers sections; import `AsteriskMark` in both pages). Pass `index={i}` and the now-required `startDate` through the existing `.map((e, i) => ...)` calls. Cases grid stays 2-col; card map callbacks change to `(e, i)`.

- [ ] **Step 3: `teaser-card.tsx`** — no structural change; the section-level asterisk kicker covers the teasers. Only change: the `readOn` link color already accents; leave the card file untouched if nothing is needed (then don't commit it).

- [ ] **Step 4: Verify visually** (both locales, both themes, 1440/375: numbering aligned, stamps not clipped, hover-spin works) then build + commit — `git commit -am "feat(rocks): setlist numbering, stamps, and asterisk kickers"`

---

### Task 6: Detail pages + 404 + footer cameo + pixel rocker

**Files:**
- Create: `apps/rocks/src/components/pixel-rocker.tsx`
- Modify: `apps/rocks/src/pages/cases/[slug].astro` + `apps/rocks/src/pages/de-de/cases/[slug].astro` (DetailMoment, spec-block styling, stamp)
- Modify: `apps/rocks/src/pages/404.astro`
- Modify: `apps/rocks/src/components/footer.tsx` (ink asterisk + rocker cameo)
- Modify: `apps/rocks/src/styles/global.css` (`.case-prose li::before` bullets, sprite animation)

**Interfaces:**
- Consumes: `AsteriskMark`, `DetailMoment`, `Strings['notFound']`, `Strings['cases']` stamps.
- Produces: `PixelRocker({ size, animated = false })` — `size: number` px height; `animated: boolean` (headbang loop, motion-safe; static frame otherwise).

- [ ] **Step 1: Write `pixel-rocker.tsx`** — hand-crafted pixel art, 16×20 logical pixels, two frames (head up strumming / head down), rendered as SVG rects with `shape-rendering="crispEdges"`. Palette: hair/boots `var(--v8-text)`, skin `var(--v8-text-secondary)`, jacket `var(--v8-bg-surface)` outlined `var(--v8-border)`, guitar `var(--v8-text-tertiary)`, shirt-asterisk pixel `var(--v8-accent)`. NO top hat (no Slash likeness). Implementation approach (the pixel maps below are the starting point; iterate visually until it reads at 40px):

```tsx
export interface PixelRockerProps {
  /** Rendered height in px (width scales 16:20). */
  size: number;
  /** Headbang loop (motion-safe). Static frame 1 otherwise. */
  animated?: boolean;
}

// 16 wide × 20 tall. Legend: . empty, H hair, S skin, J jacket, A accent
// asterisk pixel, G guitar, B boots. Frame 1 head up, frame 2 head down.
const FRAME1 = [
  '......HHHH......',
  '.....HHHHHH.....',
  '.....HSSSSH.....',
  '.....HSSSSH.....',
  '......SSSS......',
  '....JJJJJJJJ....',
  '...JJJJJJJJJJ...',
  '...JJJAAJJJJJ...',
  '...JJJJJJJJJJ...',
  '..SSJJJJJJJJSS..',
  '..S.JJJJJJJJ.S..',
  '....JJJJJJJJ....',
  '..GGGGGGGG......',
  '..G......G......',
  '....JJJJ.JJJ....',
  '....JJJ...JJ....',
  '....JJJ...JJ....',
  '....JJJ...JJ....',
  '...BBBB..BBB....',
  '...BBBB..BBB....',
];
const FRAME2 = [
  '................',
  '................',
  '......HHHH......',
  '.....HHHHHH.....',
  '.....HSSSSH.....',
  '....JHSSSSHJ....',
  '...JJJJJJJJJJ...',
  '...JJJAAJJJJJ...',
  '...JJJJJJJJJJ...',
  '..SSJJJJJJJJSS..',
  '..S.JJJJJJJJ.S..',
  '....JJJJJJJJ....',
  '..GGGGGGGG......',
  '..G......G......',
  '....JJJJ.JJJ....',
  '....JJJ...JJ....',
  '....JJJ...JJ....',
  '....JJJ...JJ....',
  '...BBBB..BBB....',
  '...BBBB..BBB....',
];

const COLOR: Record<string, string> = {
  H: 'var(--v8-text)',
  S: 'var(--v8-text-secondary)',
  J: 'var(--v8-bg-surface)',
  A: 'var(--v8-accent)',
  G: 'var(--v8-text-tertiary)',
  B: 'var(--v8-text)',
};

function Frame({ map }: { map: string[] }) {
  return (
    <>
      {map.flatMap((row, y) =>
        row.split('').map((c, x) =>
          COLOR[c] ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={COLOR[c]} /> : null
        )
      )}
    </>
  );
}

export function PixelRocker({ size, animated = false }: PixelRockerProps) {
  const width = (size * 16) / 20;
  return (
    <span className={`inline-block ${animated ? 'v8-headbang' : ''}`} style={{ width, height: size }} aria-hidden="true">
      <svg viewBox="0 0 16 20" width={width} height={size} shapeRendering="crispEdges" style={{ display: 'block' }}>
        <g className="v8-frame-1"><Frame map={FRAME1} /></g>
        <g className="v8-frame-2"><Frame map={FRAME2} /></g>
      </svg>
    </span>
  );
}
```

And in `global.css` (same v2 utilities block):

```css
  /* Pixel rocker headbang: two-frame swap via visibility (robustly
     animatable, unlike display), motion-safe. Static = frame 1. */
  .v8-frame-2 { visibility: hidden; }
  @media (prefers-reduced-motion: no-preference) {
    @keyframes v8-frame-a { 0%, 49.9% { visibility: visible; } 50%, 100% { visibility: hidden; } }
    @keyframes v8-frame-b { 0%, 49.9% { visibility: hidden; } 50%, 100% { visibility: visible; } }
    .v8-headbang .v8-frame-1 { animation: v8-frame-a 0.8s steps(1) infinite; }
    .v8-headbang .v8-frame-2 { animation: v8-frame-b 0.8s steps(1) infinite; }
  }
```

**Iterate visually:** render him at 80px on the 404 via the dev server, screenshot, and adjust the pixel maps until the figure clearly reads as a long-haired guitarist mid-headbang. The maps above are a starting sketch, not sacred. Both frames must keep the accent asterisk pixels and stay recognizably the same figure.

- [ ] **Step 2: 404 rewrite** (`404.astro`) — AMENDED by spec v2.1: the heading uses the graffiti wordmark, not `.misregister-text`. Replace the `<h1>` in the template below with:

```astro
<h1 class="sr-only">{t.notFound.heading}</h1>
<GraffitiWord word={locale === 'de-de' ? 'keine-zugabe' : 'no-encore'} height={140} className="max-w-full" />
```

(import `GraffitiWord` from `../components/graffiti-word`; Task 9 defines it; run Task 9 before this task). Original template follows, with that one substitution applied:

```astro
---
import Layout from '../layouts/Layout.astro';
import { getStrings } from '../i18n/utils';
import { AsteriskMark } from '../components/asterisk-mark';
import { PixelRocker } from '../components/pixel-rocker';

const locale = 'en-us';
const t = getStrings(locale);
---

<Layout locale={locale} title={t.meta.notFoundTitle} description={t.notFound.body}>
  <main class="relative mx-auto flex min-h-[80vh] max-w-[1440px] flex-col items-start justify-center overflow-hidden px-6 md:px-20">
    <div aria-hidden="true" class="pointer-events-none absolute -right-20 top-1/2 -z-10 -translate-y-1/2 opacity-80">
      <AsteriskMark size={480} misregister />
    </div>
    <h1 class="font-[family-name:var(--v8-font-display)] text-[clamp(3.5rem,10vw,8rem)] leading-[0.95] text-foreground">
      <span class="misregister-text" data-text={t.notFound.heading}>{t.notFound.heading}</span>
    </h1>
    <p class="mt-6 text-muted-foreground">{t.notFound.body}</p>
    <div class="mt-10 flex items-end gap-6">
      <a href="/" class="border border-dashed border-border px-5 py-3 font-mono text-[10px] tracking-[0.12em] text-foreground uppercase no-underline transition-colors hover:border-primary hover:text-primary">
        {t.notFound.backHome}
      </a>
      <PixelRocker size={80} animated />
    </div>
  </main>
</Layout>
```

(The dashed border is the ticket-stub read; keep it.)

- [ ] **Step 3: Detail pages** — in both `[slug].astro` files, parallel edits: import `DetailMoment`, make `<main>` `relative` and mount `<DetailMoment />` as its first child; restyle the meta `<dl>` as a spec block: add to the `<dl>` classes `border border-border bg-surface p-5` (replacing `border-y ... py-5`) and drop in a stamp chip above it:

```astro
<span class="mt-8 inline-block rotate-2 border border-border px-2 py-1 font-mono text-[9px] tracking-[0.14em] text-muted-foreground uppercase">
  {t.cases.stampCaseStudy} {entry.data.startDate.getFullYear()}
</span>
```

(adjust the `<dl>`'s `mt-8` to `mt-3` since the stamp now carries the top margin).

- [ ] **Step 4: `.case-prose` asterisk bullets** — in the existing `.case-prose` block of `global.css`:

```css
  .case-prose ul {
    list-style: none;
    padding-left: 1.4rem;
  }
  .case-prose ul li {
    position: relative;
  }
  .case-prose ul li::before {
    content: '*';
    position: absolute;
    left: -1.4rem;
    top: 0.05em;
    font-family: var(--v8-font-mono);
    color: var(--v8-accent);
  }
```

- [ ] **Step 5: Footer cameo** — in `footer.tsx`: prepend a small ink asterisk to the copyright span and append a rocker cameo to the socials group:

```tsx
// copyright span becomes:
<span className="flex flex-1 items-center gap-2 font-mono text-[11px] text-muted-foreground">
  <AsteriskMark size={11} tone="ink" />
  {footer.copyright}
</span>
// at the end of the socials flex div:
<span className="v8-spin-hover"><PixelRocker size={22} /></span>
```

(Static in the footer: `animated` stays false; the hover spin is enough of a wink. Import both components.)

- [ ] **Step 6: Verify visually** — 404 (rocker headbangs, heading misregisters, ticket button), a detail page (spec block, stamp, asterisk bullets need a `<ul>` in content: temporarily verify with the seed entry by adding a 3-item list to it ONLY if it lacks one — the seed has none, so add a short "Setlist" ul of the three stack highlights to both locale seed files; that is real content improvement, keep it), footer cameo. Both themes. Fix, build, commit — `git commit -am "feat(rocks): detail spec blocks, punk 404 with pixel rocker, footer cameo"`

---

### Task 7: Full visual verification matrix

**Files:** none (fixes only, committed as `fix(rocks): …`).

- [ ] **Step 1:** Dev server up; screenshot matrix: pages `/`, `/de-de/`, `/cases/portfolio-platform/`, `/de-de/cases/portfolio-platform/`, `/404` × widths 1440/1024/768/375 × themes dark/light (40 shots) into the SDD workspace screenshots dir.
- [ ] **Step 2:** Specific checks beyond the matrix: (a) reduced-motion: emulate `prefers-reduced-motion: reduce` and confirm hero mark static + rocker static frame; (b) graffiti wordmarks (hero + 404) legible and un-clipped at 375 in BOTH themes; (c) backdrop art never overlaps interactive elements (click a nav link with the moment present); (d) favicon renders in a browser tab in both themes; (e) hero image (if integrated by then) loads as webp/avif variants, keeps aspect ratio at all widths, and reads as a deliberate framed panel in light theme.
- [ ] **Step 3:** Fix every defect, re-screenshot, commit fixes.

---

### Task 9: Graffiti wordmarks + hero heading rework (spec v2.1)

**Files:**
- Create: `apps/rocks/src/components/graffiti-word.tsx`
- Modify: `apps/rocks/src/components/hero.tsx` (heading treatment swap)

**Interfaces:**
- Consumes: `Strings['hero']` (unchanged shape).
- Produces: `GraffitiWord({ word, height, className = '' })` — `word: 'loud' | 'laut' | 'no-encore' | 'keine-zugabe'`, `height: number` (px; width scales per word's aspect), `className?: string`. Renders `aria-hidden` SVG artwork (callers provide the accessible text themselves).

- [ ] **Step 1: Write `graffiti-word.tsx`** — hand-drawn lettering artwork, NOT a font. One component; per-word SVG groups in a `WORDS` record: `{ viewBox: string; art: JSX.Element }`. Drawing rules (the craft is the deliverable; iterate visually until it convinces):
  - Chunky uneven block caps in the spirit of the hand-painted Green Day logo: each letter a single filled path with an irregular outline (8-14 jitter vertices per edge, ±2-4 units on a ~100-unit letter height), letters varying ±4% in height, per-letter rotation ±3°, baseline shifting ±3 units, tight overlapping spacing
  - Fill `var(--v8-accent)`; add 10-20 speckle dots/flecks per word (tiny irregular polygons, same fill, opacity 0.5-0.9) scattered just outside letter edges
  - No SVG filters (crisp at any scale, no filter-rendering variance); pure paths
  - Words: `loud` ("Loud"), `laut` ("Laut"), `no-encore` ("NO ENCORE."), `keine-zugabe` ("KEINE ZUGABE.")
  - `shape-rendering: geometricPrecision`; component root `<span aria-hidden="true">` sized by `height`
- [ ] **Step 2: Rework the hero heading in `hero.tsx`** — replace the `.misregister-text` span with the wordmark inline in the heading; keep the serif for the rest and the accessible name intact:

```tsx
<h1 className="reveal mt-4 max-w-[14ch] font-[family-name:var(--v8-font-display)] text-[clamp(3.5rem,9vw,7.5rem)] leading-[0.95] text-foreground">
  <span className="sr-only">{hero.headingParts.misregistered}</span>
  <GraffitiWord
    word={hero.headingParts.misregistered.toLowerCase() === 'laut' ? 'laut' : 'loud'}
    height={110}
    className="mr-3 inline-block align-[-0.12em] md:h-[unset]"
  />
  {hero.headingParts.rest}
</h1>
```

  Scale the wordmark against the clamped serif size during visual iteration (it should read as the same headline, painted over): adjust `height`/alignment values freely; the code above is the starting point, the screenshot is the acceptance test.
- [ ] **Step 3: Visual iteration** — dev server; screenshot `/` and `/de-de/` at 1440/768/375, both themes, plus an isolated render of all four words (temp scratch page allowed, deleted before commit). Acceptance: reads as hand-painted lettering (not vector-clean, not a font), legible at 375, sits on one visual baseline with the serif remainder.
- [ ] **Step 4: Build + commit** — `git commit -am "feat(rocks): hand-drawn graffiti wordmarks for display words"`

---

### Task 10: Hero image integration (blocked until the file exists)

**Files:**
- Consume: the image Sebastian drops in `apps/rocks/src/assets/` (any name; flaming keyboard-rocker artwork)
- Modify: `apps/rocks/src/components/hero.tsx`, both index pages if wiring changes, `apps/rocks/src/components/backdrop/hero-stage-moment.tsx` (asterisk demotes to supporting role)

**Interfaces:**
- Consumes: `<Image>` from `astro:assets` ONLY (repo gotcha: never `ImageMetadata.src`).

- [ ] **Step 1:** The file exists: `apps/rocks/src/assets/guitar-player.png` (1024×1536 PNG). AMENDED per owner feedback (2026-08-04): the image must be **masked to look roughed up** — not a clean rectangle. Build an inline SVG `clipPath` (in the hero markup, `clipPathUnits="objectBoundingBox"`) whose outline is a jagged, torn-paper/ripped-poster edge: 10-16 irregular vertices per side, asymmetric, with one or two deeper tears; optionally 2-3 small irregular "chipped" notches. Apply via `clip-path: url(#...)` on the Image wrapper. Keep a faint border effect if it still reads (a rough-edged shadow or an offset accent echo of the same clip shape behind it is welcome; iterate visually). The torn edge must survive both themes and all widths.
- [ ] **Step 2:** Hero layout becomes two-zone at `md:`: text left, artwork right — the image as a bordered panel (`border border-border`), roughly 40% width at `md+`, full-width below the text on mobile. The image is the likely LCP, so pass `loading="eager"` and `fetchpriority="high"`: `<Image src={art} loading="eager" fetchpriority="high" widths={[480, 768, 1080]} sizes="(max-width: 768px) 100vw, 40vw" />`, with `alt` from a new `hero.artAlt` string added to `Strings` (both locales; short factual description, e.g. 'Helmeted figure playing a keyboard like a guitar, engulfed in flames' / German equivalent). In light theme it stays a dark framed panel by design.
- [ ] **Step 3:** Demote the backdrop asterisk: in `hero-stage-moment.tsx`, drop the misregistered giant to a single ~220px mark positioned so it doesn't fight the image (visual iteration decides: overlapping the panel's top-left corner is the starting idea).
- [ ] **Step 4:** Visual iteration (1440/768/375 × themes), build, commit — `git commit -am "feat(rocks): flaming rocker hero artwork"`

---

### Task 11: Owner feedback fixes (LOUD legibility, headbang hover, rougher asterisk)

**Files:**
- Modify: `apps/rocks/src/components/graffiti-word.tsx` (the `loud` word's D)
- Modify: `apps/rocks/src/components/footer.tsx` + `apps/rocks/src/styles/global.css` (hover behavior)
- Modify: `apps/rocks/src/components/asterisk-mark.tsx` (+ `apps/rocks/public/favicon.svg` if it still reads at 16px)

**Owner feedback verbatim (2026-08-04):** "While the SVG for LAUT works, the one for LOUD doesn't. The O und D are not distinguishable enough leading do reading louo." / "The sprite for the Rock'n'Roller was meant to be animated differently. I meant like heaving him headbang, not rotate." / "The asterisk looks to cleanr [too clean]."

- [ ] **Step 1: Fix the LOUD `D`** — redraw the D in the `loud` wordmark so it cannot be read as an O: hard flat vertical left stem (painted-straight, minor wobble only), squared top-left and bottom-left corners, the bowl flattened on the left where it meets the stem, counter (inner hole) D-shaped (flat left edge) not round. Keep the paint register (wobble, speckle) of the other letters. Verify with an isolated 500% render AND in the hero at 375/1440: the acceptance test is that the word unambiguously reads LOUD.
- [ ] **Step 2: Footer cameo headbangs on hover (no rotation)** — remove `v8-spin-hover` from the rocker's wrapper in `footer.tsx`. Add to the v2 utilities block in `global.css` a hover-scoped variant of the existing frame-swap (same keyframes, applied under `:hover` and motion-safe):

```css
  .v8-headbang-hover .v8-frame-2 { visibility: hidden; }
  @media (prefers-reduced-motion: no-preference) {
    .v8-headbang-hover:hover .v8-frame-1 { animation: v8-frame-a 0.8s steps(1) infinite; }
    .v8-headbang-hover:hover .v8-frame-2 { animation: v8-frame-b 0.8s steps(1) infinite; }
  }
```

Wrap the footer `PixelRocker` in `class="v8-headbang-hover"`. The 404 rocker keeps its always-on `animated` behavior unchanged.
- [ ] **Step 3: Roughen the AsteriskMark** — the mark currently renders as clean round-capped strokes; give it the hand-set print register of the wordmarks: replace each stroked `<line>` spoke with a filled irregular quad/path (wobbled edges, slightly varying widths along the spoke, blunt uneven tips), add 4-8 tiny flecks around the mark (like GraffitiWord speckle, same fill, low opacity), keep the misregister ghost offset working (the ghost uses the same rough spokes). MUST stay legible at 12px (section kickers) — verify a kicker screenshot. Then decide the favicon: apply the same roughness only if a 16px render still reads as an asterisk; otherwise leave the favicon geometry clean and note it.
- [ ] **Step 4:** Visual verification (hero + kicker + footer hover + 404 both themes), `bun run build` clean, commit as `fix(rocks): rougher asterisk, legible LOUD, headbang hover cameo`.

---

### Task 8: Final verification and PR update

- [ ] **Step 1:** `cd apps/rocks && rm -rf dist && bun run build` — clean, 5 pages.
- [ ] **Step 2:** `cd apps/apex-redirect && bun test` — 6/6 (nothing here should touch it; this is the regression tripwire).
- [ ] **Step 3:** Controller (not a subagent) pushes the branch — PR #15 updates automatically — and comments on the PR summarizing v2.
