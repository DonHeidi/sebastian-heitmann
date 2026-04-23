# Web Projects Service Page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a bilingual service landing page at `/web-projects` (EN) and `/de-de/webprojekte` (DE) for AI-supported website projects targeting local businesses.

**Architecture:** Single shared Astro component (`web-projects-content.astro`) renders 11 sections from i18n strings. Two thin route files wire Layout + Navigation + Footer + the content component. All copy lives in the existing i18n locale files under a `webProjects` key. No external dependencies.

**Tech Stack:** Astro 6, SCSS, TypeScript, existing i18n system (`getStrings`, `getHreflangAlternates`), `--v8-*` design tokens.

---

### Task 1: Add i18n type definition

**Files:**
- Modify: `apps/website/src/i18n/types.ts`

- [ ] **Step 1: Add `webProjects` type to Strings interface**

Add after the `cv` block (around line 166), before the closing `}`:

```typescript
  webProjects: {
    meta: { title: string; description: string };
    hero: { eyebrow: string; headline: string; subline: string; cta: string };
    problem: { eyebrow: string; intro: string; items: string[] };
    approach: { eyebrow: string; headline: string; body: string[] };
    comparison: {
      eyebrow: string;
      headline: string;
      columnHeaders: string[];
      rows: Array<{ label: string; cells: string[] }>;
    };
    ai: {
      eyebrow: string;
      headline: string;
      intro: string;
      doesLabel: string;
      does: string[];
      doesNotLabel: string;
      doesNot: string[];
      closing: string;
    };
    packages: {
      eyebrow: string;
      headline: string;
      intro: string;
      items: Array<{
        name: string;
        audience: string;
        features: string[];
        delivery: string;
      }>;
    };
    addons: {
      eyebrow: string;
      headline: string;
      items: Array<{
        name: string;
        description: string;
        features: string[];
      }>;
    };
    scope: {
      eyebrow: string;
      headline: string;
      includedLabel: string;
      included: string[];
      notIncludedLabel: string;
      notIncluded: string[];
    };
    consulting: {
      eyebrow: string;
      headline: string;
      body: string[];
      cta: string;
    };
    faq: {
      eyebrow: string;
      items: Array<{ q: string; a: string }>;
    };
    cta: {
      headline: string;
      body: string;
      button: string;
      note: string;
    };
  };
```

- [ ] **Step 2: Verify types compile**

Run: `cd apps/website && npx astro check 2>&1 | head -20`
Expected: Type errors in en-us.ts and de-de.ts (missing `webProjects` key) — that's expected, we add the content in Tasks 2-3.

- [ ] **Step 3: Commit**

```bash
git add apps/website/src/i18n/types.ts
git commit -m "feat(website): add webProjects i18n type definition"
```

---

### Task 2: Add English copy to en-us.ts

**Files:**
- Modify: `apps/website/src/i18n/en-us.ts`

- [ ] **Step 1: Add `webProjects` content block**

Add before the closing `} satisfies Strings;`. The full copy comes from the approved content in the conversation. Translate the German copy to English — key sections:

- **hero**: "A web presence that works — not just exists." / Professional web presence for local businesses...
- **problem**: "Most local businesses face the same dilemma." + 4 pain points
- **approach**: "Not a template business. A thought-through web project." + 3 paragraphs
- **comparison**: 7-row grid comparing DIY builders / cheap freelancers / this offer across concept, design, tech, GDPR, SEO, running costs, maintenance
- **ai**: "AI is the tool. Not the replacement." + does/doesn't lists
- **packages**: Kompakt / Business / Professional with scope and delivery times
- **addons**: Setup & Go-live / Operations & Support
- **scope**: Included vs not-included lists
- **consulting**: "When it's about more than a website." bridge to cycle offer
- **faq**: 8 Q&A pairs
- **cta**: "Let's discuss your web project."

The copy MUST be the English translation of the approved German copy from the conversation, maintaining the same confident-but-not-salesy tone.

- [ ] **Step 2: Commit**

```bash
git add apps/website/src/i18n/en-us.ts
git commit -m "feat(website): add English web-projects copy"
```

---

### Task 3: Add German copy to de-de.ts

**Files:**
- Modify: `apps/website/src/i18n/de-de.ts`

- [ ] **Step 1: Add `webProjects` content block**

Same structure as Task 2, using the original German copy from the conversation verbatim. All section content was already approved.

- [ ] **Step 2: Verify types compile**

Run: `cd apps/website && npx astro check 2>&1 | head -20`
Expected: No type errors (both locale files now have `webProjects`).

- [ ] **Step 3: Commit**

```bash
git add apps/website/src/i18n/de-de.ts
git commit -m "feat(website): add German web-projects copy"
```

---

### Task 4: Create the shared page component

**Files:**
- Create: `apps/website/src/components/web-projects-content.astro`

This is the main implementation task. The component accepts `content: Strings['webProjects']` and `locale: Locale` as props and renders all 11 sections.

- [ ] **Step 1: Create component with all 11 sections**

The component structure follows existing site patterns:

```
Section 1 — Hero: display heading + subline + CTA (same pattern as hero.astro but simpler)
Section 2 — Problem: eyebrow + intro + item list (same pattern as situations-section)
Section 3 — Approach: eyebrow + headline + body paragraphs
Section 4 — Comparison: eyebrow + headline + 4-column responsive grid with hairlines
Section 5 — AI: eyebrow + headline + intro + two lists (does/doesn't)
Section 6 — Packages: eyebrow + headline + intro + 3 package cards in a grid
Section 7 — Add-ons: eyebrow + headline + 2 add-on blocks
Section 8 — Scope: eyebrow + headline + two columns (included/not included)
Section 9 — Consulting bridge: eyebrow + headline + body + CTA link
Section 10 — FAQ: eyebrow + details/summary list
Section 11 — CTA: headline + body + button + note
```

**Design patterns to follow:**
- Max-width: `1440px`, padding: `80px` (1024: `48px`, 768: `24px`)
- Eyebrows: `var(--v8-font-mono)`, 10px, 0.12em letter-spacing, uppercase, `--v8-text-muted`
- Headlines: `var(--v8-font-display)`, clamp sizing, 400 weight
- Body: `var(--v8-font-body)`, 17-18px, 300 weight, `--v8-text-secondary`
- Section dividers: eyebrow + extending `1px solid var(--v8-border)` rule (like capabilities, situations)
- Lists: `var(--v8-font-body)`, items separated by `1px` hairlines, accent dot on hover (like situations)
- Comparison grid: `repeat(4, 1fr)` on desktop, `repeat(2, 1fr)` at 1024px, `1fr` at 768px — same hairline pattern as capabilities-section
- Package cards: bordered blocks, name in serif italic, features as mono list items
- FAQ: native `<details>` + `<summary>`, styled with mono question text, body answer, chevron indicator
- CTA section: dark/light bg-alt background, serif headline, body text, accent-underlined button link

**Key implementation details:**
- Use `getRelativeLocaleUrl(locale, '/')` + `#contact` for CTA links back to homepage contact form
- Use `getRelativeLocaleUrl(locale, '')` for the consulting bridge CTA (links to homepage or a future /consulting route)
- All sections get `class="reveal"` for the existing scroll-triggered fade-in
- Comparison grid cells: first column is the row label (mono, muted), other 3 columns are the comparison values
- Package delivery time uses mono font in accent color

- [ ] **Step 2: Commit**

```bash
git add apps/website/src/components/web-projects-content.astro
git commit -m "feat(website): create web-projects page component"
```

---

### Task 5: Create EN route page

**Files:**
- Create: `apps/website/src/pages/web-projects.astro`

- [ ] **Step 1: Create the route file**

Follow the exact pattern from `src/pages/cv.astro` or `src/pages/index.astro`:

```astro
---
import Layout from '../layouts/Layout.astro';
import Navigation from '../components/navigation.astro';
import WebProjectsContent from '../components/web-projects-content.astro';
import Footer from '../components/footer.astro';
import { getStrings, getHreflangAlternates } from '../i18n/utils';
import type { Locale } from '../i18n/utils';

const locale = Astro.currentLocale as Locale;
const s = getStrings(locale);
const alternates = getHreflangAlternates();
---
<Layout
    locale={locale}
    title={s.webProjects.meta.title}
    description={s.webProjects.meta.description}
    alternates={alternates}
>
    <Navigation nav={s.nav} languagePicker={s.languagePicker} />
    <main>
        <WebProjectsContent content={s.webProjects} locale={locale} />
    </main>
    <Footer footer={s.footer} />
</Layout>
```

- [ ] **Step 2: Commit**

```bash
git add apps/website/src/pages/web-projects.astro
git commit -m "feat(website): add EN web-projects route"
```

---

### Task 6: Create DE route page

**Files:**
- Create: `apps/website/src/pages/de-de/webprojekte.astro`

- [ ] **Step 1: Create the route file**

Identical structure to Task 5 but with adjusted import paths (one level deeper):

```astro
---
import Layout from '../../layouts/Layout.astro';
import Navigation from '../../components/navigation.astro';
import WebProjectsContent from '../../components/web-projects-content.astro';
import Footer from '../../components/footer.astro';
import { getStrings, getHreflangAlternates } from '../../i18n/utils';
import type { Locale } from '../../i18n/utils';

const locale = Astro.currentLocale as Locale;
const s = getStrings(locale);
const alternates = getHreflangAlternates();
---
<Layout
    locale={locale}
    title={s.webProjects.meta.title}
    description={s.webProjects.meta.description}
    alternates={alternates}
>
    <Navigation nav={s.nav} languagePicker={s.languagePicker} />
    <main>
        <WebProjectsContent content={s.webProjects} locale={locale} />
    </main>
    <Footer footer={s.footer} />
</Layout>
```

- [ ] **Step 2: Commit**

```bash
git add apps/website/src/pages/de-de/webprojekte.astro
git commit -m "feat(website): add DE webprojekte route"
```

---

### Task 7: Configure hreflang alternates

**Files:**
- Modify: `apps/website/src/i18n/utils.ts`

The `getHreflangAlternates()` function needs to know that `/web-projects` and `/de-de/webprojekte` are alternates of each other. Check if this is handled automatically by Astro's i18n routing or if it needs manual mapping.

- [ ] **Step 1: Check how `getHreflangAlternates` works**

Read `src/i18n/utils.ts` and determine if the asymmetric slugs (`web-projects` vs `webprojekte`) are handled automatically. If Astro's routing handles this via the file structure, no changes needed. If the function uses `Astro.url.pathname` to derive alternates, it may need a manual mapping for this asymmetric case.

- [ ] **Step 2: Add mapping if needed**

If the function doesn't handle asymmetric slugs, add a route mapping:
```typescript
const routeMap: Record<string, string> = {
  '/web-projects': '/de-de/webprojekte',
  '/de-de/webprojekte': '/web-projects',
};
```

- [ ] **Step 3: Commit (if changes were needed)**

```bash
git add apps/website/src/i18n/utils.ts
git commit -m "fix(website): add hreflang mapping for web-projects/webprojekte"
```

---

### Task 8: Verify in browser

- [ ] **Step 1: Start dev server and check EN page**

```bash
cd apps/website && bun run dev
```

Navigate to `http://localhost:4321/web-projects` — verify:
- All 11 sections render
- Dark and light mode both work
- Responsive at 1440, 1024, 768 breakpoints
- Comparison grid is readable
- FAQ details/summary opens/closes
- CTA links point to homepage #contact
- No console errors

- [ ] **Step 2: Check DE page**

Navigate to `http://localhost:4321/de-de/webprojekte` — verify same checklist with German copy.

- [ ] **Step 3: Check hreflang**

View page source, confirm `<link rel="alternate" hreflang="de-de" href="...webprojekte">` appears on EN page and vice versa.

- [ ] **Step 4: Check language switcher**

Toggle between EN/DE using the site's language picker — verify it correctly navigates between `/web-projects` and `/de-de/webprojekte`.

---

### Task 9: Final commit and cleanup

- [ ] **Step 1: Squash or final commit if needed**

If all verification passes:
```bash
git add -A
git commit -m "feat(website): web-projects service landing page (EN + DE)

New bilingual service page for AI-supported website projects targeting
local businesses. 11 sections: hero, problem, approach, comparison grid,
AI usage, 3 packages (Kompakt/Business/Professional), add-ons, scope,
consulting bridge, FAQ, CTA. No pricing shown — scope and delivery only."
```

---

## Notes

- **No nav link needed yet** — the page lives as a standalone subpage, discoverable via direct link or future homepage CTA. Adding a nav link is a separate decision.
- **No pricing on the page** — packages show scope and delivery time only. Euro amounts come in conversation.
- **The comparison table** is the trickiest visual element — it needs to be readable at 768px. At mobile, consider stacking each row as a card rather than trying to render a 4-column table.
- **The FAQ section** is the first use of `<details>/<summary>` on this site. Style it to match the editorial rhythm (mono question, body answer, accent chevron, hairline between items).
