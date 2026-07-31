# CV PDF Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the `/cv` content with the newer CV in `build.mjs` and rebuild the page in the print PDF's layout language.

**Architecture:** One two-column row primitive (`CvRow`) replaces both the dot-and-stem timeline and the bento card grid. Highlights move from plain strings to a structured `CvHighlight` type so the locale files stay markup-free. The screen layout converges on the print layout, which lets `cv-print.css` shrink to a palette-and-scale override.

**Tech Stack:** Astro 7, React (static TSX, no hydration), Tailwind v4 with `--v8-*` tokens, TypeScript strict.

**Spec:** `docs/superpowers/specs/2026-07-30-cv-pdf-alignment-design.md`

## Global Constraints

- **No test framework in this repo.** Every task's gate is `bunx tsc --noEmit` (run from `apps/website`) plus, where the task touches rendering, `bun run build`. `astro build` does **not** type-check TSX — esbuild strips types without checking — so `tsc` is the real gate and must be run separately.
- **Content is verbatim** from `~/Documents/applications/lucid-labs/source/build.mjs`: the `de` object (lines 7–162) and the `en` object (lines 164–306). No paraphrasing, no invented facts, no reordering of entries.
- **`en` spreads `de`**, so `communityActivitiesLabel` is `Mentoring & Talks` in **both** locales. This is intentional; do not translate it.
- **No user-visible text in components.** All copy arrives as typed props (`AGENTS.md`).
- **No `<style>` blocks, no SCSS.** Tailwind utilities only; decorative CSS that utilities cannot express goes in `src/styles/global.css` under `@layer components`.
- **Components are static TSX**, rendered without a `client:*` directive. A React `onClick` would be dropped from the emitted HTML — the download button's handler stays in the page `<script>`.
- **Scope is `/cv` and `/de-de/cv` only.** Do not touch homepage strings, `hero`, or `content/authors/`.
- Colour comes from existing tokens: `text-foreground`, `text-text-secondary`, `text-text-tertiary`, `text-text-dim`, `text-text-faint`, `text-muted-foreground`, `text-primary`, `border-border`, `border-border-accent`, `bg-background`, `bg-primary`.

## File Structure

| File | Responsibility |
|---|---|
| `src/i18n/types.ts` | `CvLink`, `CvHighlight`, migrated `Strings['cv']` |
| `src/i18n/en-us.ts`, `de-de.ts` | The CV content |
| `src/components/cv/cv-row.tsx` | Two-column primitive — mono side column + body |
| `src/components/cv/cv-tags.tsx` | Square bordered chip list |
| `src/components/cv/cv-highlight.tsx` | One `CvHighlight` → bold lead, links, body, tech run |
| `src/components/cv/cv-experience-entry.tsx` | Role, company, description, highlight list |
| `src/components/cv/cv-section.tsx` | Composition; section labels and ordering |
| `src/styles/cv-print.css` | Print palette, scale, pagination |
| `src/styles/global.css` | Bento rules removed |
| `src/pages/cv.astro`, `src/pages/de-de/cv.astro` | Import path update |

---

### Task 1: Presentational primitives

Additive only — nothing consumes these yet, so the tree stays compiling throughout.

**Files:**
- Modify: `apps/website/src/i18n/types.ts` (add two exported interfaces; leave `Strings['cv']` alone)
- Create: `apps/website/src/components/cv/cv-row.tsx`
- Create: `apps/website/src/components/cv/cv-tags.tsx`
- Create: `apps/website/src/components/cv/cv-highlight.tsx`

**Interfaces:**
- Consumes: nothing
- Produces: `CvLink`, `CvHighlight` (types); `CvRow({ side, sideSub?, children, className? })`, `CvTags({ items })`, `CvHighlight({ highlight })` (components)

- [ ] **Step 1: Add the two types to `types.ts`**

Add above the `Strings` interface:

```ts
export interface CvLink {
  label: string;
  href: string;
}

export interface CvHighlight {
  /** Bold lead-in. */
  lead: string;
  /** Link rendered inside the bold lead, in parentheses. */
  leadLink?: CvLink;
  /** Plain (non-bold) parenthetical after the lead, e.g. a date range. */
  leadNote?: string;
  /** Suppress the colon between lead and text — a few entries read as one sentence. */
  omitColon?: boolean;
  /** Body copy. */
  text: string;
  /** Trailing link in the body. */
  link?: CvLink;
  /** Mono tech run, joined with " · ". */
  tech?: string[];
}
```

- [ ] **Step 2: Create `cv-row.tsx`**

```tsx
import type { ReactNode } from 'react';

export interface CvRowProps {
  /** Mono left column — a period, or a group label. */
  side: ReactNode;
  /** Second line beneath the side column, e.g. location. */
  sideSub?: ReactNode;
  children: ReactNode;
  className?: string;
}

// The PDF's single layout rhythm: a narrow mono column carrying date and
// location on the left, content on the right. Under 768px it collapses to one
// column, with the side column running horizontally above the body.
export function CvRow({ side, sideSub, children, className = '' }: CvRowProps) {
  return (
    <div
      className={`cv-row grid grid-cols-1 gap-x-8 md:grid-cols-[140px_1fr] lg:grid-cols-[180px_1fr] lg:gap-x-10 ${className}`}
    >
      <div className="cv-row__side flex flex-row items-baseline gap-3 pb-1.5 md:flex-col md:items-start md:gap-0.5 md:pt-[3px] md:pb-0">
        <span className="cv-row__period font-mono text-[12px] leading-[1.55] tracking-[0.04em] whitespace-nowrap text-foreground">
          {side}
        </span>
        {sideSub ? (
          <span className="cv-row__loc font-mono text-[11px] leading-[1.55] tracking-[0.04em] text-text-faint">
            {sideSub}
          </span>
        ) : null}
      </div>
      <div className="cv-row__body">{children}</div>
    </div>
  );
}
```

- [ ] **Step 3: Create `cv-tags.tsx`**

```tsx
export interface CvTagsProps {
  items: string[];
}

// The PDF's `.tag`: square, not rounded. Chips never wrap internally.
export function CvTags({ items }: CvTagsProps) {
  return (
    <div className="cv-tags flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          className="cv-tag border border-border px-2.5 py-1 font-mono text-[12px] whitespace-nowrap text-text-secondary transition-colors duration-200 hover:border-border-accent hover:text-foreground"
        >
          {item}
        </span>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Create `cv-highlight.tsx`**

Render order is **lead** ` (leadLink)` ` (leadNote)` `:` ` text` ` link` ` tech`. `leadLink` sits inside the bold run, `leadNote` outside it — that is what the PDF does.

```tsx
import type { CvHighlight as CvHighlightData } from '@/i18n/types';

export interface CvHighlightProps {
  highlight: CvHighlightData;
}

// Accent dash marker — a 5x2 block, matching the PDF's `li::before`. Kept as a
// shared class so cv-print.css can target it without knowing the utilities.
const dashBullet =
  "relative before:absolute before:top-[10px] before:left-0 before:h-[2px] before:w-[5px] before:bg-primary before:content-['']";

export function CvHighlight({ highlight }: CvHighlightProps) {
  const { lead, leadLink, leadNote, omitColon, text, link, tech } = highlight;

  return (
    <li
      className={`cv-highlight ${dashBullet} pl-4 font-sans text-[15px] leading-[1.6] font-light text-text-dim`}
    >
      <strong className="cv-highlight__lead font-medium text-foreground">
        {lead}
        {leadLink ? (
          <>
            {' ('}
            <a className="underline underline-offset-2 hover:text-primary" href={leadLink.href}>
              {leadLink.label}
            </a>
            {')'}
          </>
        ) : null}
      </strong>
      {leadNote ? <span className="cv-highlight__note"> ({leadNote})</span> : null}
      {omitColon ? ' ' : ': '}
      {text}
      {link ? (
        <a className="cv-highlight__link underline underline-offset-2 hover:text-primary" href={link.href}>
          {link.label}
        </a>
      ) : null}
      {tech ? (
        <span className="cv-highlight__tech ml-1 font-mono text-[12px] tracking-[0.02em] text-muted-foreground">
          {tech.join(' · ')}
        </span>
      ) : null}
    </li>
  );
}
```

- [ ] **Step 5: Type-check**

Run from `apps/website`: `bunx tsc --noEmit`
Expected: no output (clean). If it reports `Cannot find module '@/i18n/types'`, the `@/*` path alias is in `tsconfig.json` — check the import spelling rather than changing config.

- [ ] **Step 6: Commit**

```bash
git add apps/website/src/i18n/types.ts apps/website/src/components/cv/
git commit -m "feat(cv): add row, tag, and highlight primitives for the PDF layout"
```

---

### Task 2: Schema migration, content, and section rewrite

This task is deliberately large: a `Strings['cv']` change cannot compile without its consumers changing in the same commit. Do not try to split it.

**Files:**
- Modify: `apps/website/src/i18n/types.ts` (the `cv` block)
- Modify: `apps/website/src/i18n/en-us.ts` (the `cv` block, ~lines 178–300)
- Modify: `apps/website/src/i18n/de-de.ts` (the `cv` block, same region)
- Create: `apps/website/src/components/cv/cv-experience-entry.tsx`
- Create: `apps/website/src/components/cv/cv-section.tsx`
- Delete: `apps/website/src/components/cv-section.tsx`
- Modify: `apps/website/src/pages/cv.astro:5` (import path)
- Modify: `apps/website/src/pages/de-de/cv.astro:5` (import path)

**Interfaces:**
- Consumes: `CvRow`, `CvTags`, `CvHighlight`, `CvLink` from Task 1
- Produces: `CvSection({ cv })` — same prop name and shape the pages already pass

- [ ] **Step 1: Migrate the `cv` block in `types.ts`**

Apply exactly these changes; leave `meta`, `headline`, `downloadLabel` as they are.

```ts
    identity: {            // was `print`
      name: string;
      address: string;
      contact: string;
    };
    experience: Array<{
      period: string;
      role: string;
      company?: string;          // optional — the sabbatical entry has none
      location: string;
      description: string;
      highlights?: CvHighlight[];  // optional and structured
    }>;
    earlierExperience: Array<{
      period: string;
      role: string;
      company: string;
      // `location` removed — not in the CV data
    }>;
    communityActivitiesLabel: string;   // added
    // `currentFocus` and `currentFocusLabel` removed
```

- [ ] **Step 2: Replace the `cv` content in `en-us.ts`**

Source: the `en` object in `~/Documents/applications/lucid-labs/source/build.mjs`, lines 164–306. Read that file directly — do not transcribe from this plan, and do not reorder entries.

Conversion rules for the HTML in `highlights`:

| Source | Becomes |
|---|---|
| `<strong>X</strong>` | `lead: 'X'` (strip any trailing colon — the component adds it) |
| `(Apr 2026 – present)` after the bold run | `leadNote: 'Apr 2026 – present'` |
| `<a href="H">L</a>` inside the bold run | `leadLink: { label: 'L', href: 'H' }` |
| `<a href="H">L</a>` at the end of the body | `link: { label: 'L', href: 'H' }` |
| `<span class="tech">A · B · C</span>` | `tech: ['A', 'B', 'C']` |
| no colon after the bold run | `omitColon: true` |

Worked example — this source line:

```
'<strong>Mobile app for Pool Position GmbH</strong> (Apr 2026 – present): porting core web app features to mobile <span class="tech">TypeScript · React Native · AWS · Claude Code</span>'
```

becomes:

```ts
{
  lead: 'Mobile app for Pool Position GmbH',
  leadNote: 'Apr 2026 – present',
  text: 'porting core web app features to mobile',
  tech: ['TypeScript', 'React Native', 'AWS', 'Claude Code'],
},
```

Second worked example — link inside the lead:

```
'<strong>Job Directory (<a href="https://www.job-directory.eu">www.job-directory.eu</a>):</strong> platform for AI-agent-curated job postings and freelance briefs; automated curation over an HTTP API (demo upcoming) <span class="tech">TypeScript · Bun · TanStack Start · SQLite · Scaleway Cloud · Terraform</span>'
```

becomes:

```ts
{
  lead: 'Job Directory',
  leadLink: { label: 'www.job-directory.eu', href: 'https://www.job-directory.eu' },
  text: 'platform for AI-agent-curated job postings and freelance briefs; automated curation over an HTTP API (demo upcoming)',
  tech: ['TypeScript', 'Bun', 'TanStack Start', 'SQLite', 'Scaleway Cloud', 'Terraform'],
},
```

Third worked example — the no-colon entry:

```
'<strong>Client relationship management</strong> and coordination with third-party suppliers'
```

becomes:

```ts
{
  lead: 'Client relationship management',
  omitColon: true,
  text: 'and coordination with third-party suppliers',
},
```

Also in this step: rename `print:` to `identity:`, add `communityActivitiesLabel: 'Mentoring & Talks'`, delete `currentFocus` and `currentFocusLabel`, and drop `location` from every `earlierExperience` entry. Keep the existing `meta`, `headline` and `downloadLabel` values.

- [ ] **Step 3: Replace the `cv` content in `de-de.ts`**

Same procedure against the `de` object, lines 7–162. `communityActivitiesLabel` is `'Mentoring & Talks'` here too — English, matching the German PDF. Note the DE counterpart of the no-colon entry (`Kundenbetreuung`) **does** take a colon, so it gets no `omitColon`.

- [ ] **Step 4: Create `cv-experience-entry.tsx`**

```tsx
import type { Strings } from '@/i18n/types';
import { CvHighlight } from './cv-highlight';

export interface CvExperienceEntryProps {
  entry: Strings['cv']['experience'][number];
}

export function CvExperienceEntry({ entry }: CvExperienceEntryProps) {
  return (
    <div className="cv-entry">
      <h3 className="cv-entry__role font-display text-[22px] leading-[1.2] tracking-[-0.01em] text-foreground md:text-[24px]">
        {entry.role}
      </h3>
      {entry.company ? (
        <span className="cv-entry__company mt-0.5 mb-2 block font-mono text-[11px] tracking-[0.14em] text-primary uppercase">
          {entry.company}
        </span>
      ) : null}
      <p className="cv-entry__description mb-2 max-w-[680px] font-sans text-[16px] leading-[1.6] font-light text-text-tertiary">
        {entry.description}
      </p>
      {entry.highlights?.length ? (
        <ul className="cv-entry__highlights flex max-w-[680px] list-none flex-col gap-1 p-0">
          {entry.highlights.map((h) => (
            <CvHighlight key={h.lead} highlight={h} />
          ))}
        </ul>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 5: Create `cv-section.tsx`**

Section order is fixed by the spec. The one detail that is easy to get wrong: **Languages and Soft Skills are rows inside Skills & Expertise**, not sections of their own.

```tsx
import type { ReactNode } from 'react';
import type { Strings } from '@/i18n/types';
import { CvRow } from './cv-row';
import { CvTags } from './cv-tags';
import { CvExperienceEntry } from './cv-experience-entry';

export interface CvSectionProps {
  cv: Strings['cv'];
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="cv-section-header mt-14 mb-8 flex items-center gap-4 md:mt-16 md:mb-10">
      <span className="cv-section-label shrink-0 font-mono text-[11px] tracking-[0.28em] text-muted-foreground uppercase">
        {children}
      </span>
      <span className="cv-section-line h-px flex-1 bg-border" />
    </div>
  );
}

function GroupLabel({ children }: { children: ReactNode }) {
  return (
    <span className="cv-group-label font-mono text-[10px] leading-[1.6] tracking-[0.14em] text-muted-foreground uppercase">
      {children}
    </span>
  );
}

export function CvSection({ cv }: CvSectionProps) {
  return (
    <section className="cv mx-auto max-w-[1100px] px-6 pt-[120px] pb-20 md:px-12 lg:px-20 lg:pt-[160px] lg:pb-[120px]">
      <header className="cv-header reveal">
        <div className="cv-header__top flex items-start justify-between gap-8">
          <div>
            <div className="cv-eyebrow mb-2 font-mono text-[11px] tracking-[0.28em] text-muted-foreground uppercase">
              {cv.headline}
            </div>
            <h1 className="cv-name font-display text-[clamp(40px,5vw,64px)] leading-[1.05] tracking-[-0.02em] text-foreground">
              {cv.identity.name}
            </h1>
            <div className="cv-contact mt-3 font-mono text-[12px] leading-[1.6] tracking-[0.04em] text-text-secondary">
              <p className="cv-contact__address">{cv.identity.address}</p>
              <p className="cv-contact__contact">{cv.identity.contact}</p>
            </div>
          </div>
          {/* Click handler lives in the CV pages' <script> — this component
              renders statically (no hydration), so a React onClick would be
              silently dropped from the emitted HTML. */}
          <button
            type="button"
            className="cv-download group mt-3 inline-flex shrink-0 items-center gap-2 border border-border bg-transparent px-5 py-2.5 transition-[border-color,gap] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:gap-3 hover:border-primary"
          >
            <span className="cv-download__text font-mono text-[12px] tracking-[0.08em] text-foreground uppercase">
              {cv.downloadLabel}
            </span>
            <span className="cv-download__arrow text-[14px] text-primary transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0.5">
              &darr;
            </span>
          </button>
        </div>
        <p className="cv-summary mt-8 max-w-[860px] border-t border-border pt-6 font-sans text-[18px] leading-[1.65] font-light text-text-secondary">
          {cv.summary}
        </p>
      </header>

      {/* Experience */}
      <SectionLabel>{cv.experienceLabel}</SectionLabel>
      <div className="cv-experience flex flex-col gap-9">
        {cv.experience.map((entry) => (
          <CvRow
            key={`${entry.role}-${entry.period}`}
            side={entry.period}
            sideSub={entry.location}
            className="reveal"
          >
            <CvExperienceEntry entry={entry} />
          </CvRow>
        ))}
      </div>

      {/* Earlier positions */}
      <SectionLabel>{cv.earlierExperienceLabel}</SectionLabel>
      <div className="cv-earlier reveal flex flex-col gap-2">
        {cv.earlierExperience.map((entry) => (
          <CvRow key={`${entry.company}-${entry.period}`} side={entry.period}>
            <span className="cv-earlier__role font-sans text-[15px] font-normal text-text-tertiary">
              {entry.role}
            </span>
            <span className="cv-earlier__company ml-3 font-mono text-[11px] tracking-[0.08em] text-text-faint">
              {entry.company}
            </span>
          </CvRow>
        ))}
      </div>

      {/* Skills & Expertise — languages and soft skills live INSIDE this section */}
      <SectionLabel>{cv.skillsLabel}</SectionLabel>
      <div className="cv-skills reveal flex flex-col gap-6">
        {cv.skillGroups.map((group) => (
          <CvRow key={group.label} side={<GroupLabel>{group.label}</GroupLabel>}>
            <CvTags items={group.skills} />
          </CvRow>
        ))}
        <CvRow side={<GroupLabel>{cv.languagesLabel}</GroupLabel>}>
          <div className="cv-langs flex flex-wrap gap-x-12 gap-y-4">
            {cv.languages.map((lang) => (
              <div key={lang.language} className="cv-lang">
                <div className="cv-lang__name font-display text-[20px] leading-[1.25] text-foreground">
                  {lang.language}
                </div>
                <div className="cv-lang__level font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
                  {lang.level}
                </div>
              </div>
            ))}
          </div>
        </CvRow>
        <CvRow side={<GroupLabel>{cv.softSkillsLabel}</GroupLabel>}>
          <p className="cv-plain-list font-sans text-[15px] leading-[1.6] font-light text-text-secondary">
            {cv.softSkills.join(' · ')}
          </p>
        </CvRow>
      </div>

      {/* Education */}
      <SectionLabel>{cv.educationLabel}</SectionLabel>
      <div className="cv-education reveal flex flex-col gap-6">
        {cv.education.map((entry) => (
          <CvRow key={`${entry.institution}-${entry.period}`} side={entry.period}>
            <div className="cv-edu">
              <div className="cv-edu__degree font-display text-[20px] leading-[1.25] text-foreground">
                {entry.degree}
              </div>
              <div className="cv-edu__institution mt-0.5 font-mono text-[10px] tracking-[0.14em] text-primary uppercase">
                {entry.institution}
              </div>
              <p className="cv-edu__desc mt-1 font-sans text-[14px] leading-[1.55] font-light text-text-dim">
                {entry.description}
              </p>
            </div>
          </CvRow>
        ))}
      </div>

      {/* Certifications */}
      <SectionLabel>{cv.certificationsLabel}</SectionLabel>
      <div className="cv-certifications reveal flex flex-col gap-5">
        {cv.certifications.map((cert) => (
          <CvRow key={`${cert.name}-${cert.date}`} side={cert.date}>
            <div className="cv-cert">
              <div className="cv-cert__name font-sans text-[15px] font-medium text-foreground">
                {cert.name}
              </div>
              <div className="cv-cert__issuer font-mono text-[11px] tracking-[0.06em] text-text-faint">
                {cert.issuer}
              </div>
            </div>
          </CvRow>
        ))}
      </div>

      {/* Community */}
      <SectionLabel>{cv.communityLabel}</SectionLabel>
      <div className="cv-community reveal flex flex-col gap-3">
        {cv.communityRoles.map((entry) => (
          <CvRow key={`${entry.organization}-${entry.period}`} side={entry.period}>
            <span className="cv-community__role font-sans text-[15px] font-normal text-text-tertiary">
              {entry.role}
            </span>
            <span className="cv-community__org ml-3 font-mono text-[11px] tracking-[0.08em] text-text-faint">
              {entry.organization}
            </span>
          </CvRow>
        ))}
        <CvRow
          className="mt-3"
          side={<GroupLabel>{cv.communityActivitiesLabel}</GroupLabel>}
        >
          <ul className="cv-activities flex list-none flex-col gap-1 p-0">
            {cv.communityActivities.map((activity) => (
              <li
                key={activity}
                className="cv-activity relative pl-4 font-sans text-[15px] leading-[1.6] font-light text-text-dim before:absolute before:top-[10px] before:left-0 before:h-[2px] before:w-[5px] before:bg-primary before:content-['']"
              >
                {activity}
              </li>
            ))}
          </ul>
        </CvRow>
      </div>

      {/* Interests */}
      <SectionLabel>{cv.interestsLabel}</SectionLabel>
      <div className="cv-interests reveal">
        <CvRow side="">
          <p className="cv-plain-list font-sans text-[15px] leading-[1.6] font-light text-text-secondary">
            {cv.interests.join(' · ')}
          </p>
        </CvRow>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Delete the old component and update both page imports**

```bash
git rm apps/website/src/components/cv-section.tsx
```

In `apps/website/src/pages/cv.astro` change:
`import { CvSection } from '../components/cv-section';`
to
`import { CvSection } from '../components/cv/cv-section';`

In `apps/website/src/pages/de-de/cv.astro` change:
`import { CvSection } from '../../components/cv-section';`
to
`import { CvSection } from '../../components/cv/cv-section';`

- [ ] **Step 7: Type-check**

Run from `apps/website`: `bunx tsc --noEmit`
Expected: clean. Errors naming `currentFocus`, `print`, or `location` mean a locale file still carries a removed field.

- [ ] **Step 8: Build**

Run from `apps/website`: `bun run build`
Expected: `[build] 35 page(s) built`, no warnings about missing props.

- [ ] **Step 9: Commit**

```bash
git add -A apps/website/src
git commit -m "feat(cv): replace CV content and rebuild the page in the PDF layout"
```

---

### Task 3: Rewrite the print stylesheet

**Files:**
- Modify: `apps/website/src/styles/cv-print.css` (full rewrite, currently 230 lines)

**Interfaces:**
- Consumes: the class names emitted in Task 2 — `.cv`, `.cv-header`, `.cv-eyebrow`, `.cv-name`, `.cv-contact`, `.cv-summary`, `.cv-section-header`, `.cv-section-label`, `.cv-row`, `.cv-row__side`, `.cv-entry__role`, `.cv-entry__company`, `.cv-highlight`, `.cv-tag`, `.cv-download`
- Produces: nothing consumed downstream

- [ ] **Step 1: Confirm which old selectors are now dead**

Run from the repo root:

```bash
grep -oE '\.(bento|cv)[a-z0-9_-]*(__[a-z0-9-]+)?' apps/website/src/styles/cv-print.css | sort -u
```

Every `.bento-*`, `.cv-entry__dot`, `.cv-entry__stem`, `.cv-entry__marker`, `.cv-entry__aside`, `.cv-timeline`, `.cv-headline`, `.cv-print-*` and `.cv-rule` selector is dead — those elements no longer exist.

- [ ] **Step 2: Rewrite the file**

Keep the palette block (lines 1–36 of the current file) verbatim — it is still correct. Replace everything after it. The screen layout is already the print layout, so this only rescales.

```css
@page { size: A4; margin: 11.5mm 16mm; }

@media print {
  /* --- palette: unchanged from the previous stylesheet --- */
  html {
    --v8-bg: #fff !important;
    --v8-bg-alt: #f5f5f2 !important;
    --v8-bg-surface: #f0eeea !important;
    --v8-text: #111 !important;
    --v8-text-muted: rgba(0,0,0,0.72) !important;
    --v8-text-secondary: rgba(0,0,0,0.85) !important;
    --v8-text-tertiary: rgba(0,0,0,0.78) !important;
    --v8-text-dim: rgba(0,0,0,0.72) !important;
    --v8-text-faint: rgba(0,0,0,0.6) !important;
    --v8-accent: #B82A00 !important;
    --v8-border: rgba(0,0,0,0.15) !important;
    --v8-border-accent: rgba(184,42,0,0.3) !important;
    scrollbar-gutter: auto !important;
    width: auto !important;
  }
  body {
    background: #fff !important;
    width: auto !important;
    min-width: 0 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  nav, footer, .cv-download { display: none !important; }
  .reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
  main { display: block !important; width: 100% !important; }

  /* --- page shell --- */
  .cv {
    padding: 0 !important;
    max-width: none !important;
    width: 100% !important;
    display: block !important;
    font-size: 9.8px !important;
  }

  /* --- header --- */
  .cv-header { margin-bottom: 8px !important; }
  .cv-eyebrow { font-size: 7.5px !important; letter-spacing: 0.28em !important; margin-bottom: 5px !important; }
  .cv-name { font-size: 29px !important; line-height: 1.1 !important; margin-bottom: 7px !important; }
  .cv-contact { font-size: 8px !important; letter-spacing: 0.06em !important; line-height: 1.55 !important; margin-top: 0 !important; }
  .cv-summary {
    font-size: 10.3px !important;
    line-height: 1.48 !important;
    margin-top: 0 !important;
    padding-top: 9px !important;
    max-width: none !important;
  }

  /* --- section labels --- */
  .cv-section-header { margin: 8px 0 6.5px !important; gap: 12px !important; }
  .cv-section-label { font-size: 7.5px !important; letter-spacing: 0.28em !important; }

  /* --- the row primitive --- */
  .cv-row {
    grid-template-columns: 26mm 1fr !important;
    column-gap: 6mm !important;
    break-inside: avoid !important;
  }
  .cv-row__side { flex-direction: column !important; padding-top: 2.5px !important; gap: 1px !important; }
  .cv-row__period { font-size: 7.8px !important; letter-spacing: 0.05em !important; line-height: 1.55 !important; }
  .cv-row__loc { font-size: 7.8px !important; line-height: 1.55 !important; }
  .cv-group-label { font-size: 6.8px !important; letter-spacing: 0.14em !important; }

  /* --- experience --- */
  .cv-experience { gap: 5.5px !important; }
  .cv-entry__role { font-size: 14px !important; line-height: 1.2 !important; }
  .cv-entry__company { font-size: 7.5px !important; letter-spacing: 0.14em !important; margin: 1.5px 0 4px !important; }
  .cv-entry__description { font-size: 9.3px !important; margin-bottom: 1.5px !important; max-width: none !important; }
  .cv-entry__highlights { gap: 1px !important; max-width: none !important; }
  .cv-highlight { font-size: 8.8px !important; line-height: 1.31 !important; padding-left: 11px !important; hyphens: auto; }
  .cv-highlight::before { top: 5px !important; }
  .cv-highlight__tech { font-size: 7.2px !important; letter-spacing: 0.03em !important; }

  /* --- earlier positions, community rows --- */
  .cv-earlier { gap: 2px !important; }
  .cv-earlier__role, .cv-community__role { font-size: 9.3px !important; }
  .cv-earlier__company, .cv-community__org { font-size: 7.5px !important; letter-spacing: 0.08em !important; }
  .cv-community { gap: 4.5px !important; }

  /* --- skills --- */
  .cv-skills { gap: 9px !important; }
  .cv-tags { gap: 4.5px !important; }
  .cv-tag { font-size: 7.8px !important; padding: 3px 7px !important; letter-spacing: 0.04em !important; }
  .cv-lang__name { font-size: 12.5px !important; line-height: 1.25 !important; }
  .cv-lang__level { font-size: 6.8px !important; letter-spacing: 0.16em !important; }
  .cv-langs { gap: 30px !important; }
  .cv-plain-list { font-size: 9.3px !important; }

  /* --- education, certifications --- */
  .cv-education { gap: 8px !important; }
  .cv-edu__degree { font-size: 12.5px !important; line-height: 1.25 !important; }
  .cv-edu__institution { font-size: 7px !important; letter-spacing: 0.14em !important; }
  .cv-edu__desc { font-size: 8.3px !important; }
  .cv-certifications { gap: 7px !important; }
  .cv-cert__name { font-size: 9.8px !important; }
  .cv-cert__issuer { font-size: 7.5px !important; letter-spacing: 0.06em !important; }

  /* --- activities --- */
  .cv-activity { font-size: 8.8px !important; line-height: 1.45 !important; padding-left: 11px !important; }
  .cv-activity::before { top: 5px !important; }

  /* Skills starts page 2, matching the source PDF. The selector targets the
     section label that directly precedes the skills block. */
  .cv-skills-break { break-before: page !important; }
}
```

- [ ] **Step 3: Add the page-break hook**

The `.cv-skills-break` class needs to exist in the markup. In `cv-section.tsx`, change the Skills section label to:

```tsx
      <div className="cv-skills-break">
        <SectionLabel>{cv.skillsLabel}</SectionLabel>
      </div>
```

- [ ] **Step 4: Build and render to PDF**

```bash
cd apps/website && bun run build && bun run preview &
```

Note the port from the output — Astro falls back past 4321 if it is taken, and it binds IPv6, so use `http://[::1]:<port>/`.

```bash
google-chrome-stable --headless --disable-gpu --no-sandbox \
  --user-data-dir=.shots/profile --virtual-time-budget=8000 \
  --print-to-pdf=.shots/cv-en.pdf --no-pdf-header-footer "http://[::1]:<port>/cv/"
```

Expected: two pages; Skills & Expertise starts page 2; section order matches `CV_Sebastian_Heitmann_EN.pdf`.

- [ ] **Step 5: Commit**

```bash
git add apps/website/src/styles/cv-print.css apps/website/src/components/cv/cv-section.tsx
git commit -m "style(cv): rewrite the print stylesheet against the new CV markup"
```

---

### Task 4: Remove the bento CSS

**Files:**
- Modify: `apps/website/src/styles/global.css` (delete lines 210–271)

**Interfaces:**
- Consumes: nothing
- Produces: nothing

- [ ] **Step 1: Confirm nothing references the classes**

```bash
grep -rn "bento" apps/website/src/ || echo "no source references"
```

Expected: only `global.css` matches. Any `.tsx` match means Task 2 is incomplete — stop and fix that first.

- [ ] **Step 2: Delete the block**

Remove the comment header and every rule from `/* CV bento grid — named-area responsive layout. */` through `.bento-area--interests { grid-area: interests; }` inclusive.

- [ ] **Step 3: Build and confirm the class is gone from the output**

```bash
cd apps/website && bun run build && grep -rl "bento" dist/ || echo "no bento in dist"
```

Expected: `no bento in dist`.

- [ ] **Step 4: Commit**

```bash
git add apps/website/src/styles/global.css
git commit -m "refactor(cv): drop the bento grid rules the CV no longer uses"
```

---

### Task 5: Visual verification

No code changes. This task exists because the previous four can all pass their gates while the page still looks wrong.

**Files:** none modified

- [ ] **Step 1: Capture both locales at three widths**

Serve the build, then for each of `1440,1000`, `768,1000`, `375,800` and each of `/cv/`, `/de-de/cv/`:

```bash
google-chrome-stable --headless --disable-gpu --no-sandbox --hide-scrollbars \
  --user-data-dir=.shots/profile --virtual-time-budget=8000 \
  --window-size=1440,1000 --screenshot=.shots/en-cv-1440.png \
  "http://[::1]:<port>/cv/"
```

Theme handling: the toggle stores `localStorage.theme` (`'light' | 'dark' | 'system'`) and `Layout.astro`'s inline script applies the matching class to `<html>`, falling back to `prefers-color-scheme`. Headless Chrome's CLI cannot seed same-origin `localStorage`, so these captures render whichever theme the system preference resolves to. Cover the other theme one of two ways:

1. Preferred — drive the page through the chrome-devtools MCP, `evaluate_script` `localStorage.setItem('theme','light')`, reload, then screenshot.
2. Fallback — rely on the Task 3 print render, which forces the full light palette via `cv-print.css` and therefore already exercises light mode end to end.

Do not add a `?theme=` query parameter to the app for testing purposes.

- [ ] **Step 2: Check each screenshot against the source PDF**

Specifically confirm:
- The side column reads as one mono block; the period does not wrap mid-range
- Company names are accent-coloured and uppercase
- Highlight bullets are dashes, not discs
- Tag chips are square
- Languages and Soft Skills sit under the Skills & Expertise label, with no label of their own
- At 375px the side column sits above its content rather than squeezing into a column

- [ ] **Step 3: Confirm the dropped content is actually gone**

```bash
grep -ri "AWS Cloud Practitioner\|Google UX Designer\|Fractional" apps/website/dist/cv/ || echo "clean"
```

Expected: `clean`. These strings belong to the removed current-focus list and the old title.

- [ ] **Step 4: Report the out-of-scope inconsistencies**

Do not fix these. List for the user:
- `hero.pitch` and the homepage timeline still imply continuous self-employment since Jun 2023
- `src/content/authors/sebastian-heitmann.json` carries no company name
- The CV summary wording has diverged from the homepage pitch

---

## Self-Review

**Spec coverage:** Data model → Task 1 Step 1 and Task 2 Step 1. Content replacement → Task 2 Steps 2–3. Header realignment → Task 2 Step 5. Row primitive → Task 1 Step 2. Section order → Task 2 Step 5. Marks → Tasks 1 and 2. Colour → Global Constraints. Components split → Tasks 1 and 2. Print stylesheet → Task 3. Cleanup → Task 4. Out-of-scope reporting → Task 5 Step 4. Verification → Tasks 2, 3, 4 and 5. No gaps.

**Type consistency:** `CvHighlight` fields (`lead`, `leadLink`, `leadNote`, `omitColon`, `text`, `link`, `tech`) are identical in Task 1 Step 1, Task 1 Step 4 and Task 2 Step 2. `CvRow` props (`side`, `sideSub`, `children`, `className`) match every call site in Task 2 Step 5. `identity` is used consistently after the rename.

**Placeholder scan:** No TBDs. Task 5 Step 1's theme handling was under-specified in the first draft; resolved by reading `theme-toggle.tsx` and `Layout.astro` — the key is `localStorage.theme` and the class lands on `<html>`, so the plan now names both routes to a light-mode capture rather than guessing at a query parameter.
