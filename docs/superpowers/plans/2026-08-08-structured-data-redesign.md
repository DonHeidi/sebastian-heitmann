# Structured Data Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the contradictory inline JSON-LD on `sebastian-heitmann.dev` and `sebastian-heitmann.rocks` with one canonical `Person` entity, per-domain `WebSite` nodes, and faithful `Service`/`Offer` markup for the 13 published offerings per locale, all emitted from a shared typed package and guarded by a deploy gate.

**Architecture:** A new `packages/structured-data` workspace exports typed node builders with no Astro dependency. Each app's `Layout.astro` assembles `[person, website, webPage, breadcrumbs]` plus an optional `nodes` prop into a single `@graph` in one `<script type="application/ld+json">`. Page-specific nodes are passed in by the pages themselves. A post-build script validates every emitted graph and aborts both deploy scripts on violation.

**Tech Stack:** Bun workspaces, TypeScript, Astro 7, `bun test`.

**Spec:** `docs/superpowers/specs/2026-08-08-structured-data-redesign-design.md`

## Global Constraints

- **Canonical person id is `https://www.sebastian-heitmann.dev/#person`**, verbatim, on both domains. Never derive it from the current origin.
- **No `Organization` node anywhere.** Sebastian trades under his own name.
- **Never emit `ProfessionalService`, `PostalAddress`, `priceRange`, or a postal address in any form.** The address stays in the rendered imprint page only.
- **All published prices are "from" prices.** They map to `priceSpecification.minPrice`, never to `price`.
- **An offering with no published price still gets an `Offer` node**, carrying `name` and `description` but no `priceSpecification`. Never invent a figure.
- **Price numbers come from explicit structured fields** (`priceMin`, `currency`, `vatIncluded`) added alongside the display string. Never parse the display string.
- **One `<script type="application/ld+json">` per page**, containing exactly one `@graph`.
- **`404` pages emit no JSON-LD at all.**
- Commit style is conventional commits (`feat(scope):`, `fix(scope):`, `refactor(scope):`, `docs(scope):`).
- Work happens in the worktree `.claude/worktrees/feat-structured-data` on branch `worktree-feat-structured-data`. All paths below are relative to that worktree root.

---

## File Structure

**Created:**

| File | Responsibility |
|---|---|
| `packages/structured-data/package.json` | Workspace manifest, `exports` → `src/index.ts` |
| `packages/structured-data/tsconfig.json` | Standalone TS config for `bun test` |
| `packages/structured-data/src/types.ts` | Shared node/reference types |
| `packages/structured-data/src/graph.ts` | `graph()`, `ref()` |
| `packages/structured-data/src/person.ts` | `PERSON_ID`, `person()` |
| `packages/structured-data/src/site.ts` | `website()`, `webPage()`, `breadcrumbs()` |
| `packages/structured-data/src/offerings.ts` | `service()`, `offer()`, `offerCatalog()` |
| `packages/structured-data/src/content.ts` | `blog()`, `blogPosting()`, `creativeWork()`, `itemList()`, `profilePage()`, `personOccupations()`, `personKnowsAbout()` |
| `packages/structured-data/src/validate.ts` | `validateGraph()`, shared by the deploy gate and its unit tests |
| `packages/structured-data/src/index.ts` | Re-exports |
| `packages/structured-data/test/*.test.ts` | One test file per source module |
| `apps/website/src/data/services.ts` | The four-service registry |
| `scripts/check-structured-data.ts` | Post-build validator |

**Modified:**

| File | Change |
|---|---|
| `package.json:4` | `workspaces` glob widened to include `packages/*` |
| `apps/website/package.json`, `apps/rocks/package.json` | Add the workspace dependency |
| `apps/website/src/i18n/types.ts` | Structured price fields on offer-bearing types |
| `apps/website/src/i18n/en-us.ts`, `de-de.ts` | Populate those fields |
| `apps/website/src/layouts/Layout.astro:61-88` | Delete blob, assemble graph |
| `apps/rocks/src/layouts/Layout.astro:55-68` | Delete blob, assemble graph |
| `apps/website/src/pages/*.astro` (11 routes) | Pass `nodes` |
| `apps/rocks/src/pages/*.astro` (5 routes) | Pass `nodes` |
| `scripts/deploy-website.sh`, `scripts/deploy-rocks.sh` | Add the gate |
| `AGENTS.md` | Document the package and the gate |

---

## Task 1: Workspace package, graph primitives, and the Person node

**Files:**
- Modify: `package.json:4`
- Create: `packages/structured-data/package.json`
- Create: `packages/structured-data/tsconfig.json`
- Create: `packages/structured-data/src/types.ts`
- Create: `packages/structured-data/src/graph.ts`
- Create: `packages/structured-data/src/person.ts`
- Create: `packages/structured-data/src/index.ts`
- Test: `packages/structured-data/test/person.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `type Locale = 'en-us' | 'de-de'`; `type Node = Record<string, unknown>`; `type Ref = { '@id': string }`; `PERSON_ID: string`; `ref(id: string): Ref`; `graph(...nodes: Array<Node | null | undefined>): Node`; `person(locale: Locale): Node`.

**`person()` takes no page-specific data.** Both sites must emit it byte-identically, so anything one page knows and others do not (capabilities, employment history) goes in a separate partial node sharing the `@id`. See `personKnowsAbout` and `personOccupations` in Task 4.

- [ ] **Step 1: Widen the workspaces glob**

In `package.json`, change line 4 from `"workspaces": ["apps/*"],` to:

```json
  "workspaces": ["apps/*", "packages/*"],
```

- [ ] **Step 2: Create the package manifest**

`packages/structured-data/package.json`:

```json
{
  "name": "@sh/structured-data",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": { ".": "./src/index.ts" },
  "scripts": { "test": "bun test" },
  "devDependencies": { "@types/bun": "^1.3.14" }
}
```

`packages/structured-data/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noEmit": true,
    "types": ["bun"],
    "verbatimModuleSyntax": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*.ts", "test/**/*.ts"]
}
```

- [ ] **Step 3: Write the failing test**

`packages/structured-data/test/person.test.ts`:

```ts
import { describe, expect, test } from 'bun:test';
import { PERSON_ID, person, graph, ref } from '../src/index';

describe('person', () => {
  test('carries the canonical dev-hosted @id regardless of locale', () => {
    expect(person('en-us')['@id']).toBe('https://www.sebastian-heitmann.dev/#person');
    expect(person('de-de')['@id']).toBe(person('en-us')['@id']);
  });

  test('is a Person, never an Organization or ProfessionalService', () => {
    expect(person('en-us')['@type']).toBe('Person');
  });

  test('never carries an address or a price range', () => {
    const node = person('en-us');
    expect(node.address).toBeUndefined();
    expect(node.priceRange).toBeUndefined();
  });

  test('sameAs links both domains and both profiles', () => {
    expect(person('en-us').sameAs).toEqual([
      'https://www.sebastian-heitmann.dev',
      'https://www.sebastian-heitmann.rocks',
      'https://www.linkedin.com/in/sebastian-heitmann/',
      'https://github.com/DonHeidi',
    ]);
  });

  test('carries no page-specific data, so both sites can emit it identically', () => {
    const node = person('en-us');
    expect('knowsAbout' in node).toBe(false);
    expect('hasOccupation' in node).toBe(false);
  });

  test('en and de differ only in jobTitle', () => {
    const en = { ...person('en-us') };
    const de = { ...person('de-de') };
    delete en.jobTitle;
    delete de.jobTitle;
    expect(en).toEqual(de);
  });
});

describe('graph', () => {
  test('wraps nodes in a single @context/@graph envelope', () => {
    expect(graph({ '@type': 'WebPage' })).toEqual({
      '@context': 'https://schema.org',
      '@graph': [{ '@type': 'WebPage' }],
    });
  });

  test('drops null and undefined nodes so callers can inline conditionals', () => {
    expect((graph({ '@type': 'WebPage' }, null, undefined)['@graph'] as unknown[]).length).toBe(1);
  });

  test('ref produces a bare @id reference', () => {
    expect(ref(PERSON_ID)).toEqual({ '@id': PERSON_ID });
  });
});
```

- [ ] **Step 4: Run the test to verify it fails**

Run: `cd packages/structured-data && bun test`
Expected: FAIL, `Cannot find module '../src/index'`.

- [ ] **Step 5: Implement the types and graph primitives**

`packages/structured-data/src/types.ts`:

```ts
export type Locale = 'en-us' | 'de-de';

/** A schema.org node. Deliberately loose: schema.org is open-world and every
 *  builder in this package is responsible for its own shape. */
export type Node = Record<string, unknown>;

/** A by-@id reference to a node defined elsewhere in the graph, or on another
 *  page. Referencing rather than re-describing is what keeps the entity single. */
export type Ref = { '@id': string };
```

`packages/structured-data/src/graph.ts`:

```ts
import type { Node, Ref } from './types';

export function ref(id: string): Ref {
  return { '@id': id };
}

/** Drop empty values so builders can pass optionals through unconditionally.
 *  An `undefined` that reaches JSON.stringify vanishes silently; an empty array
 *  or string does not, and ships as a meaningless claim. */
export function compact(node: Node): Node {
  const out: Node = {};
  for (const [key, value] of Object.entries(node)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value) && value.length === 0) continue;
    if (typeof value === 'string' && value.trim() === '') continue;
    out[key] = value;
  }
  return out;
}

export function graph(...nodes: Array<Node | null | undefined>): Node {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes.filter((node): node is Node => node != null),
  };
}
```

- [ ] **Step 6: Implement the Person node**

`packages/structured-data/src/person.ts`:

```ts
import { compact } from './graph';
import type { Locale, Node } from './types';

export const DEV_ORIGIN = 'https://www.sebastian-heitmann.dev';
export const ROCKS_ORIGIN = 'https://www.sebastian-heitmann.rocks';

/** The single canonical identity, hosted on .dev and referenced verbatim from
 *  .rocks. Both sites must emit this byte-identically for a given locale, which
 *  is what scripts/check-structured-data.ts enforces. */
export const PERSON_ID = `${DEV_ORIGIN}/#person`;

const JOB_TITLE: Record<Locale, string> = {
  'en-us': 'Technology Consultant',
  'de-de': 'Technology Consultant',
};

/** Takes no page-specific data on purpose: .dev and .rocks must emit this
 *  byte-identically, which scripts/check-structured-data.ts relies on. Anything
 *  one page knows and others do not belongs in a partial node sharing this @id
 *  (see personKnowsAbout / personOccupations). */
export function person(locale: Locale): Node {
  return compact({
    '@type': 'Person',
    '@id': PERSON_ID,
    name: 'Sebastian Heitmann',
    jobTitle: JOB_TITLE[locale],
    url: DEV_ORIGIN,
    email: 'me@sebastian-heitmann.dev',
    knowsLanguage: ['de', 'en'],
    sameAs: [
      DEV_ORIGIN,
      ROCKS_ORIGIN,
      'https://www.linkedin.com/in/sebastian-heitmann/',
      'https://github.com/DonHeidi',
    ],
  });
}
```

`packages/structured-data/src/index.ts`:

```ts
export type { Locale, Node, Ref } from './types';
export { graph, ref, compact } from './graph';
export { PERSON_ID, DEV_ORIGIN, ROCKS_ORIGIN, person } from './person';
```

- [ ] **Step 7: Run the test to verify it passes**

Run: `cd packages/structured-data && bun test`
Expected: PASS, 9 tests.

- [ ] **Step 8: Verify the workspace link resolves from both apps**

Add to `apps/website/package.json` `dependencies` and `apps/rocks/package.json` `dependencies`:

```json
    "@sh/structured-data": "workspace:*",
```

Run from the worktree root: `bun install`
Then: `test -L node_modules/@sh/structured-data && echo LINKED`
Expected: `LINKED`.

This step exists because Astro/Vite must be able to consume raw TypeScript from a linked workspace package. If the website build in Task 7 fails to resolve or transpile it, the fallback is a `paths` alias in each app's `tsconfig.json` plus a matching `resolve.alias` in `astro.config.mjs`. Do not discover that at the end.

- [ ] **Step 9: Commit**

```bash
git add package.json packages/structured-data apps/website/package.json apps/rocks/package.json bun.lock
git commit -m "feat(structured-data): add the shared package and canonical Person node"
```

---

## Task 2: WebSite, WebPage, and breadcrumbs

**Files:**
- Create: `packages/structured-data/src/site.ts`
- Modify: `packages/structured-data/src/index.ts`
- Test: `packages/structured-data/test/site.test.ts`

**Interfaces:**
- Consumes: `PERSON_ID`, `ref`, `compact`, `Locale`, `Node` from Task 1.
- Produces:
  - `type SiteKey = 'dev' | 'rocks'`
  - `website(site: SiteKey, locale: Locale, description: string): Node`
  - `webPage(input: { url: string; title: string; description: string; site: SiteKey; locale: Locale; type?: string }): Node`
  - `breadcrumbs(input: { pathname: string; title: string; site: SiteKey; locale: Locale }): Node | null`
  - `siteId(site: SiteKey): string`, `originFor(site: SiteKey): string`

- [ ] **Step 1: Write the failing test**

`packages/structured-data/test/site.test.ts`:

```ts
import { describe, expect, test } from 'bun:test';
import { PERSON_ID, website, webPage, breadcrumbs, siteId } from '../src/index';

describe('website', () => {
  test('is about and published by the one person, by reference', () => {
    const node = website('dev', 'en-us', 'Fractional CTO services');
    expect(node.about).toEqual({ '@id': PERSON_ID });
    expect(node.publisher).toEqual({ '@id': PERSON_ID });
  });

  test('each domain gets its own id and description', () => {
    expect(siteId('dev')).toBe('https://www.sebastian-heitmann.dev/#website');
    expect(siteId('rocks')).toBe('https://www.sebastian-heitmann.rocks/#website');
    expect(website('rocks', 'en-us', 'Portfolio of work').description).toBe('Portfolio of work');
  });

  test('carries the BCP-47 tag for the locale', () => {
    expect(website('dev', 'de-de', 'x').inLanguage).toBe('de-DE');
    expect(website('dev', 'en-us', 'x').inLanguage).toBe('en-US');
  });
});

describe('webPage', () => {
  test('is part of its site and identified by its own url', () => {
    const node = webPage({
      url: 'https://www.sebastian-heitmann.dev/cv/',
      title: 'CV', description: 'd', site: 'dev', locale: 'en-us',
    });
    expect(node['@id']).toBe('https://www.sebastian-heitmann.dev/cv/');
    expect(node.isPartOf).toEqual({ '@id': siteId('dev') });
    expect(node['@type']).toBe('WebPage');
  });

  test('accepts a narrower page type', () => {
    const node = webPage({
      url: 'https://www.sebastian-heitmann.rocks/', title: 'Work',
      description: 'd', site: 'rocks', locale: 'en-us', type: 'CollectionPage',
    });
    expect(node['@type']).toBe('CollectionPage');
  });
});

describe('breadcrumbs', () => {
  test('returns null on a home page, which has nothing to trail', () => {
    expect(breadcrumbs({ pathname: '/', title: 'Home', site: 'dev', locale: 'en-us' })).toBeNull();
    expect(breadcrumbs({ pathname: '/de-de/', title: 'Start', site: 'dev', locale: 'de-de' })).toBeNull();
  });

  test('trails Home > leaf for a top-level page', () => {
    const node = breadcrumbs({ pathname: '/cv/', title: 'CV', site: 'dev', locale: 'en-us' })!;
    expect(node['@type']).toBe('BreadcrumbList');
    expect(node.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.sebastian-heitmann.dev/' },
      { '@type': 'ListItem', position: 2, name: 'CV' },
    ]);
  });

  test('includes the intermediate segment for a nested page', () => {
    const node = breadcrumbs({
      pathname: '/articles/some-post/', title: 'Some Post', site: 'dev', locale: 'en-us',
    })!;
    const items = node.itemListElement as Array<Record<string, unknown>>;
    expect(items.length).toBe(3);
    expect(items[1]).toEqual({
      '@type': 'ListItem', position: 2, name: 'Articles',
      item: 'https://www.sebastian-heitmann.dev/articles/',
    });
    expect(items[2]).toEqual({ '@type': 'ListItem', position: 3, name: 'Some Post' });
  });

  test('strips the locale prefix so German trails do not carry a de-de crumb', () => {
    const node = breadcrumbs({
      pathname: '/de-de/lebenslauf/', title: 'Lebenslauf', site: 'dev', locale: 'de-de',
    })!;
    const items = node.itemListElement as Array<Record<string, unknown>>;
    expect(items.length).toBe(2);
    expect(items[0]).toEqual({
      '@type': 'ListItem', position: 1, name: 'Home',
      item: 'https://www.sebastian-heitmann.dev/de-de/',
    });
  });

  test('the last crumb carries no item, per Google guidance', () => {
    const node = breadcrumbs({ pathname: '/cv/', title: 'CV', site: 'dev', locale: 'en-us' })!;
    const items = node.itemListElement as Array<Record<string, unknown>>;
    expect(items[items.length - 1]!.item).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd packages/structured-data && bun test test/site.test.ts`
Expected: FAIL, `website is not a function` (or an export error).

- [ ] **Step 3: Implement**

`packages/structured-data/src/site.ts`:

```ts
import { compact, ref } from './graph';
import { DEV_ORIGIN, PERSON_ID, ROCKS_ORIGIN } from './person';
import type { Locale, Node } from './types';

export type SiteKey = 'dev' | 'rocks';

const BCP47: Record<Locale, string> = { 'en-us': 'en-US', 'de-de': 'de-DE' };

/** Site-level display names. Not localized: both are proper nouns. */
const SITE_NAME: Record<SiteKey, string> = {
  dev: 'Sebastian Heitmann',
  rocks: 'Sebastian Heitmann — Work',
};

/** Label for the first breadcrumb. The only string this module localizes. */
const HOME_LABEL: Record<Locale, string> = { 'en-us': 'Home', 'de-de': 'Start' };

export function originFor(site: SiteKey): string {
  return site === 'dev' ? DEV_ORIGIN : ROCKS_ORIGIN;
}

export function siteId(site: SiteKey): string {
  return `${originFor(site)}/#website`;
}

export function website(site: SiteKey, locale: Locale, description: string): Node {
  return compact({
    '@type': 'WebSite',
    '@id': siteId(site),
    name: SITE_NAME[site],
    description,
    url: `${originFor(site)}/`,
    inLanguage: BCP47[locale],
    about: ref(PERSON_ID),
    publisher: ref(PERSON_ID),
  });
}

export function webPage(input: {
  url: string;
  title: string;
  description: string;
  site: SiteKey;
  locale: Locale;
  type?: string;
}): Node {
  return compact({
    '@type': input.type ?? 'WebPage',
    '@id': input.url,
    url: input.url,
    name: input.title,
    description: input.description,
    inLanguage: BCP47[input.locale],
    isPartOf: ref(siteId(input.site)),
  });
}

/** Derived from the pathname, so a page added later needs no route table.
 *  Intermediate segments are title-cased from the slug; only /articles/ and
 *  /cases/ are ever nested today, and both title-case cleanly. */
export function breadcrumbs(input: {
  pathname: string;
  title: string;
  site: SiteKey;
  locale: Locale;
}): Node | null {
  const origin = originFor(input.site);
  const localePrefix = input.locale === 'de-de' ? '/de-de' : '';
  const homeUrl = `${origin}${localePrefix}/`;

  const rest = input.pathname
    .replace(/^\/de-de/, '')
    .split('/')
    .filter(Boolean);

  if (rest.length === 0) return null;

  const items: Node[] = [
    { '@type': 'ListItem', position: 1, name: HOME_LABEL[input.locale], item: homeUrl },
  ];

  // Every segment but the last is a real intermediate page with its own URL.
  rest.slice(0, -1).forEach((segment, index) => {
    items.push({
      '@type': 'ListItem',
      position: index + 2,
      name: titleCase(segment),
      item: `${origin}${localePrefix}/${rest.slice(0, index + 1).join('/')}/`,
    });
  });

  // Google asks that the final crumb omit `item`: it is the current page.
  items.push({ '@type': 'ListItem', position: items.length + 1, name: input.title });

  return { '@type': 'BreadcrumbList', itemListElement: items };
}

function titleCase(segment: string): string {
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
```

Append to `packages/structured-data/src/index.ts`:

```ts
export type { SiteKey } from './site';
export { website, webPage, breadcrumbs, siteId, originFor } from './site';
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd packages/structured-data && bun test`
Expected: PASS, all tests across both files.

- [ ] **Step 5: Commit**

```bash
git add packages/structured-data
git commit -m "feat(structured-data): add WebSite, WebPage and derived breadcrumbs"
```

---

## Task 3: Service and Offer builders

**Files:**
- Create: `packages/structured-data/src/offerings.ts`
- Modify: `packages/structured-data/src/index.ts`
- Test: `packages/structured-data/test/offerings.test.ts`

**Interfaces:**
- Consumes: `PERSON_ID`, `ref`, `compact` from Task 1; `SiteKey` from Task 2.
- Produces:
  - `type OfferInput = { name: string; description?: string; priceMin?: number; currency?: string; vatIncluded?: boolean; billing?: 'one-time' | 'monthly' | 'hourly' | 'per-cycle' }`
  - `offer(input: OfferInput): Node`
  - `offerCatalog(name: string, items: Array<Node>): Node`
  - `service(input: { id: string; name: string; description?: string; serviceType?: string; areaServed?: string[]; catalog?: Node }): Node`

- [ ] **Step 1: Write the failing test**

`packages/structured-data/test/offerings.test.ts`:

```ts
import { describe, expect, test } from 'bun:test';
import { PERSON_ID, offer, offerCatalog, service } from '../src/index';

describe('offer', () => {
  test('a "from" price becomes minPrice, never price', () => {
    const node = offer({ name: 'Kompakt', priceMin: 549, currency: 'EUR' });
    expect(node.priceSpecification).toEqual({
      '@type': 'PriceSpecification', minPrice: 549, priceCurrency: 'EUR',
    });
    expect(node.price).toBeUndefined();
  });

  test('a monthly price becomes a UnitPriceSpecification per month', () => {
    const node = offer({ name: 'Compact Support', priceMin: 39, currency: 'EUR', billing: 'monthly' });
    expect(node.priceSpecification).toEqual({
      '@type': 'UnitPriceSpecification',
      minPrice: 39,
      priceCurrency: 'EUR',
      referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitCode: 'MON' },
    });
  });

  test('an hourly price uses the HUR unit code', () => {
    const node = offer({ name: 'Advise', priceMin: 180, currency: 'EUR', billing: 'hourly' });
    const spec = node.priceSpecification as Record<string, unknown>;
    expect((spec.referenceQuantity as Record<string, unknown>).unitCode).toBe('HUR');
  });

  test('a net price records that VAT is excluded', () => {
    const node = offer({ name: 'AI Prototype', priceMin: 4200, currency: 'EUR', vatIncluded: false });
    expect((node.priceSpecification as Record<string, unknown>).valueAddedTaxIncluded).toBe(false);
  });

  test('an unpriced offering still gets a node, with no price at all', () => {
    const node = offer({ name: 'Setup & Go-live', description: 'Everything needed to go online.' });
    expect(node['@type']).toBe('Offer');
    expect(node.name).toBe('Setup & Go-live');
    expect(node.description).toBe('Everything needed to go online.');
    expect(node.priceSpecification).toBeUndefined();
  });

  test('a priceMin without a currency is a programming error', () => {
    expect(() => offer({ name: 'Broken', priceMin: 100 })).toThrow(/currency/i);
  });
});

describe('service', () => {
  test('is provided by the one person, by reference', () => {
    const node = service({ id: 'https://www.sebastian-heitmann.dev/web-development/#service', name: 'Web Development' });
    expect(node.provider).toEqual({ '@id': PERSON_ID });
    expect(node['@type']).toBe('Service');
  });

  test('carries a nested catalog when one is supplied', () => {
    const node = service({
      id: 'https://www.sebastian-heitmann.dev/web-development/#service',
      name: 'Web Development',
      catalog: offerCatalog('Web Development', [
        offerCatalog('Packages', [offer({ name: 'Kompakt', priceMin: 549, currency: 'EUR' })]),
      ]),
    });
    const catalog = node.hasOfferCatalog as Record<string, unknown>;
    expect(catalog['@type']).toBe('OfferCatalog');
    expect((catalog.itemListElement as unknown[]).length).toBe(1);
  });

  test('omits hasOfferCatalog entirely when nothing is published', () => {
    const node = service({
      id: 'https://www.sebastian-heitmann.dev/technical-project-management/#service',
      name: 'Technical Project Management',
    });
    expect('hasOfferCatalog' in node).toBe(false);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd packages/structured-data && bun test test/offerings.test.ts`
Expected: FAIL, `offer is not a function`.

- [ ] **Step 3: Implement**

`packages/structured-data/src/offerings.ts`:

```ts
import { compact, ref } from './graph';
import { PERSON_ID } from './person';
import type { Node } from './types';

export type Billing = 'one-time' | 'monthly' | 'hourly' | 'per-cycle';

export type OfferInput = {
  name: string;
  description?: string;
  /** Published "from" price. Omit when the page publishes no figure: the offer
   *  still gets a node, it just gets no price node. */
  priceMin?: number;
  currency?: string;
  /** false when the copy says "net". Omitted when the copy is silent. */
  vatIncluded?: boolean;
  billing?: Billing;
};

/** UN/CEFACT codes. Only the recurring billings need one. */
const UNIT_CODE: Partial<Record<Billing, string>> = { monthly: 'MON', hourly: 'HUR' };

export function offer(input: OfferInput): Node {
  if (input.priceMin !== undefined && !input.currency) {
    throw new Error(`offer "${input.name}": priceMin requires a currency`);
  }

  return compact({
    '@type': 'Offer',
    name: input.name,
    description: input.description,
    priceSpecification: input.priceMin === undefined ? undefined : priceSpec(input),
  });
}

function priceSpec(input: OfferInput): Node {
  const unitCode = input.billing ? UNIT_CODE[input.billing] : undefined;

  return compact({
    '@type': unitCode ? 'UnitPriceSpecification' : 'PriceSpecification',
    minPrice: input.priceMin,
    priceCurrency: input.currency,
    valueAddedTaxIncluded: input.vatIncluded,
    referenceQuantity: unitCode
      ? { '@type': 'QuantitativeValue', value: 1, unitCode }
      : undefined,
  });
}

export function offerCatalog(name: string, items: Node[]): Node {
  return compact({ '@type': 'OfferCatalog', name, itemListElement: items });
}

export function service(input: {
  id: string;
  name: string;
  description?: string;
  serviceType?: string;
  areaServed?: string[];
  catalog?: Node;
}): Node {
  return compact({
    '@type': 'Service',
    '@id': input.id,
    name: input.name,
    description: input.description,
    serviceType: input.serviceType,
    areaServed: input.areaServed,
    provider: ref(PERSON_ID),
    hasOfferCatalog: input.catalog,
  });
}
```

Append to `packages/structured-data/src/index.ts`:

```ts
export type { Billing, OfferInput } from './offerings';
export { offer, offerCatalog, service } from './offerings';
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd packages/structured-data && bun test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/structured-data
git commit -m "feat(structured-data): add Service and Offer builders"
```

---

## Task 4: Content node builders

**Files:**
- Create: `packages/structured-data/src/content.ts`
- Modify: `packages/structured-data/src/index.ts`
- Test: `packages/structured-data/test/content.test.ts`

**Interfaces:**
- Consumes: `PERSON_ID`, `ref`, `compact` from Task 1; `siteId`, `SiteKey` from Task 2.
- Produces:
  - `blog(site: SiteKey, name: string): Node`
  - `blogPosting(input: { url: string; headline: string; description: string; datePublished: string; dateModified?: string; image?: string; keywords?: string[]; locale: Locale; blogId?: string }): Node`
  - `creativeWork(input: { url: string; name: string; description: string; dateCreated?: string; keywords?: string[]; genre?: string; sameAs?: string[]; image?: string; locale: Locale }): Node`
  - `itemList(items: Array<{ url: string; name: string }>): Node`
  - `profilePage(input: { url: string; title: string; description: string; site: SiteKey; locale: Locale }): Node`
  - `personOccupations(entries: Array<{ role: string; company?: string }>): Node`
  - `personKnowsAbout(items: string[]): Node`

- [ ] **Step 1: Write the failing test**

`packages/structured-data/test/content.test.ts`:

```ts
import { describe, expect, test } from 'bun:test';
import {
  PERSON_ID, blog, blogPosting, creativeWork, itemList, profilePage,
  personOccupations, personKnowsAbout, siteId,
} from '../src/index';

describe('blogPosting', () => {
  test('author and publisher are the same single person, by reference', () => {
    const node = blogPosting({
      url: 'https://www.sebastian-heitmann.dev/articles/x/',
      headline: 'X', description: 'd', datePublished: '2026-01-01', locale: 'en-us',
    });
    expect(node.author).toEqual({ '@id': PERSON_ID });
    expect(node.publisher).toEqual({ '@id': PERSON_ID });
  });

  test('never inlines an anonymous Organization publisher', () => {
    const node = blogPosting({
      url: 'https://www.sebastian-heitmann.dev/articles/x/',
      headline: 'X', description: 'd', datePublished: '2026-01-01', locale: 'en-us',
    });
    expect(JSON.stringify(node)).not.toContain('Organization');
  });

  test('joins keywords and links back to its blog', () => {
    const node = blogPosting({
      url: 'https://www.sebastian-heitmann.dev/articles/x/',
      headline: 'X', description: 'd', datePublished: '2026-01-01', locale: 'en-us',
      keywords: ['astro', 'seo'], blogId: `${siteId('dev')}-blog`,
    });
    expect(node.keywords).toBe('astro, seo');
    expect(node.isPartOf).toEqual({ '@id': `${siteId('dev')}-blog` });
  });

  test('omits dateModified when the article was never revised', () => {
    const node = blogPosting({
      url: 'https://www.sebastian-heitmann.dev/articles/x/',
      headline: 'X', description: 'd', datePublished: '2026-01-01', locale: 'en-us',
    });
    expect('dateModified' in node).toBe(false);
  });
});

describe('creativeWork', () => {
  test('is created by the one person and carries its portfolio facts', () => {
    const node = creativeWork({
      url: 'https://www.sebastian-heitmann.rocks/cases/blickwerk/',
      name: 'Blickwerk', description: 'd', dateCreated: '2025-03-01',
      keywords: ['Astro', 'TypeScript'], genre: 'case-study', locale: 'en-us',
    });
    expect(node.creator).toEqual({ '@id': PERSON_ID });
    expect(node.genre).toBe('case-study');
    expect(node.keywords).toBe('Astro, TypeScript');
    expect(node.dateCreated).toBe('2025-03-01');
  });
});

describe('itemList', () => {
  test('numbers entries from one and carries urls', () => {
    const node = itemList([
      { url: 'https://www.sebastian-heitmann.dev/web-development/', name: 'Web Development' },
      { url: 'https://www.sebastian-heitmann.dev/cv/', name: 'CV' },
    ]);
    expect(node['@type']).toBe('ItemList');
    expect(node.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Web Development', url: 'https://www.sebastian-heitmann.dev/web-development/' },
      { '@type': 'ListItem', position: 2, name: 'CV', url: 'https://www.sebastian-heitmann.dev/cv/' },
    ]);
  });
});

describe('profilePage and personOccupations', () => {
  test('the profile page points at the canonical person', () => {
    const node = profilePage({
      url: 'https://www.sebastian-heitmann.dev/cv/', title: 'CV',
      description: 'd', site: 'dev', locale: 'en-us',
    });
    expect(node['@type']).toBe('ProfilePage');
    expect(node.mainEntity).toEqual({ '@id': PERSON_ID });
  });

  test('occupations are a partial node that merges into the person by @id', () => {
    const node = personOccupations([
      { role: 'Fractional CTO', company: 'Independent' },
      { role: 'Sabbatical' },
    ]);
    expect(node['@id']).toBe(PERSON_ID);
    expect(node['@type']).toBeUndefined();
    expect(node.hasOccupation).toEqual([
      { '@type': 'OrganizationRole', roleName: 'Fractional CTO', namedPosition: 'Independent' },
      { '@type': 'Role', roleName: 'Sabbatical' },
    ]);
  });

  test('capabilities are also a partial node, so person() stays identical everywhere', () => {
    const node = personKnowsAbout(['System Architecture', 'Design Sprints']);
    expect(node).toEqual({
      '@id': PERSON_ID,
      knowsAbout: ['System Architecture', 'Design Sprints'],
    });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd packages/structured-data && bun test test/content.test.ts`
Expected: FAIL, `blog is not a function`.

- [ ] **Step 3: Implement**

`packages/structured-data/src/content.ts`:

```ts
import { compact, ref } from './graph';
import { PERSON_ID } from './person';
import { siteId, type SiteKey } from './site';
import type { Locale, Node } from './types';

const BCP47: Record<Locale, string> = { 'en-us': 'en-US', 'de-de': 'de-DE' };

export function blog(site: SiteKey, name: string): Node {
  return compact({
    '@type': 'Blog',
    '@id': `${siteId(site)}-blog`,
    name,
    publisher: ref(PERSON_ID),
    isPartOf: ref(siteId(site)),
  });
}

export function blogPosting(input: {
  url: string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  keywords?: string[];
  locale: Locale;
  blogId?: string;
}): Node {
  return compact({
    '@type': 'BlogPosting',
    '@id': `${input.url}#article`,
    url: input.url,
    headline: input.headline,
    description: input.description,
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    image: input.image ? [input.image] : undefined,
    keywords: input.keywords?.length ? input.keywords.join(', ') : undefined,
    inLanguage: BCP47[input.locale],
    author: ref(PERSON_ID),
    publisher: ref(PERSON_ID),
    isPartOf: input.blogId ? ref(input.blogId) : undefined,
    mainEntityOfPage: ref(input.url),
  });
}

export function creativeWork(input: {
  url: string;
  name: string;
  description: string;
  dateCreated?: string;
  keywords?: string[];
  genre?: string;
  sameAs?: string[];
  image?: string;
  locale: Locale;
}): Node {
  return compact({
    '@type': 'CreativeWork',
    '@id': `${input.url}#work`,
    url: input.url,
    name: input.name,
    description: input.description,
    dateCreated: input.dateCreated,
    genre: input.genre,
    keywords: input.keywords?.length ? input.keywords.join(', ') : undefined,
    image: input.image,
    sameAs: input.sameAs,
    inLanguage: BCP47[input.locale],
    creator: ref(PERSON_ID),
  });
}

export function itemList(items: Array<{ url: string; name: string }>): Node {
  return {
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

export function profilePage(input: {
  url: string;
  title: string;
  description: string;
  site: SiteKey;
  locale: Locale;
}): Node {
  return compact({
    '@type': 'ProfilePage',
    '@id': input.url,
    url: input.url,
    name: input.title,
    description: input.description,
    inLanguage: BCP47[input.locale],
    isPartOf: ref(siteId(input.site)),
    mainEntity: ref(PERSON_ID),
  });
}

/** A partial node sharing the Person's @id. Consumers merge nodes by @id, so
 *  this enriches the canonical Person on the home page alone without making that
 *  page's Person node differ from every other page's. */
export function personKnowsAbout(items: string[]): Node {
  return { '@id': PERSON_ID, knowsAbout: items };
}

/** Same mechanism, for the CV page's employment history. */
export function personOccupations(entries: Array<{ role: string; company?: string }>): Node {
  return {
    '@id': PERSON_ID,
    hasOccupation: entries.map((entry) =>
      compact({
        '@type': entry.company ? 'OrganizationRole' : 'Role',
        roleName: entry.role,
        namedPosition: entry.company,
      })
    ),
  };
}
```

Append to `packages/structured-data/src/index.ts`:

```ts
export {
  blog, blogPosting, creativeWork, itemList, profilePage,
  personOccupations, personKnowsAbout,
} from './content';
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd packages/structured-data && bun test`
Expected: PASS across all four test files.

- [ ] **Step 5: Commit**

```bash
git add packages/structured-data
git commit -m "feat(structured-data): add article, work, list and profile builders"
```

---

## Task 5: Structured price fields in the i18n strings

**Files:**
- Modify: `apps/website/src/i18n/types.ts:228-250` (webProjects packages/addons), `:348-360` (aiProcessAutomation offerings)
- Modify: `apps/website/src/i18n/en-us.ts` (lines ~496-600, ~826-915)
- Modify: `apps/website/src/i18n/de-de.ts` (same sections)

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: `priceMin?: number`, `currency?: 'EUR'`, `vatIncluded?: boolean`, `billing?: 'one-time' | 'monthly'` on every offer-bearing i18n item. Task 6 reads these.

**Why explicit fields:** English renders `from €549`, German renders `ab 549 €` with a non-breaking space (` `). A parser needs locale-specific handling and fails silently on one side.

- [ ] **Step 1: Write the failing test**

Create `apps/website/test/i18n-prices.test.ts`:

```ts
import { describe, expect, test } from 'bun:test';
import { enUs } from '../src/i18n/en-us';
import { deDe } from '../src/i18n/de-de';
import type { Strings } from '../src/i18n/types';

const locales: Array<[string, Strings]> = [['en-us', enUs], ['de-de', deDe]];

describe.each(locales)('%s prices', (_name, s) => {
  test('every web package publishes a structured minimum', () => {
    expect(s.webProjects.packages.items.map((i) => i.priceMin)).toEqual([549, 749, 949]);
    for (const item of s.webProjects.packages.items) {
      expect(item.currency).toBe('EUR');
      expect(item.billing).toBe('one-time');
    }
  });

  test('support add-ons are monthly, and Setup & Go-live stays unpriced', () => {
    const priced = s.webProjects.addons.items.filter((i) => i.priceMin !== undefined);
    expect(priced.map((i) => i.priceMin)).toEqual([39, 69, 99]);
    for (const item of priced) expect(item.billing).toBe('monthly');

    const unpriced = s.webProjects.addons.items.filter((i) => i.priceMin === undefined);
    expect(unpriced.length).toBe(1);
    expect(unpriced[0]!.price).toBeUndefined();
  });

  test('the two priced AI tiers are net, the third has no figure', () => {
    const items = s.aiProcessAutomation.offerings.items;
    expect(items.map((i) => i.priceMin)).toEqual([4200, 10990, undefined]);
    for (const item of items.slice(0, 2)) {
      expect(item.currency).toBe('EUR');
      expect(item.vatIncluded).toBe(false);
    }
  });

  test('a structured minimum never contradicts the rendered string', () => {
    const all = [
      ...s.webProjects.packages.items,
      ...s.webProjects.addons.items,
      ...s.aiProcessAutomation.offerings.items,
    ];
    for (const item of all) {
      if (item.priceMin === undefined) continue;
      const digits = (item.price ?? '').replace(/[^0-9]/g, '');
      expect(digits).toContain(String(item.priceMin));
    }
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd apps/website && bun test test/i18n-prices.test.ts`
Expected: FAIL, `expected [undefined, undefined, undefined] to equal [549, 749, 949]`.

- [ ] **Step 3: Extend the Strings type**

In `apps/website/src/i18n/types.ts`, the `webProjects.packages.items` element (currently lines 232-238) becomes:

```ts
      items: Array<{
        name: string;
        price: string;
        /** Structured mirror of `price` for JSON-LD. Display strings differ by
         *  locale ("from €549" vs "ab 549 €"); this does not. */
        priceMin?: number;
        currency?: 'EUR';
        vatIncluded?: boolean;
        billing?: 'one-time' | 'monthly';
        audience: string;
        features: string[];
        delivery: string;
      }>;
```

The `webProjects.addons.items` element (currently lines 244-249) becomes:

```ts
      items: Array<{
        name: string;
        price?: string;
        priceMin?: number;
        currency?: 'EUR';
        vatIncluded?: boolean;
        billing?: 'one-time' | 'monthly';
        description: string;
        features: string[];
      }>;
```

The `aiProcessAutomation.offerings.items` element gains the same four optional fields after `priceNote?: string;`.

- [ ] **Step 4: Populate both locale files**

In `apps/website/src/i18n/en-us.ts` and `apps/website/src/i18n/de-de.ts`, add the structured fields next to each existing `price`. Values are identical in both files; only the display strings differ.

`webProjects.packages.items` (en-us lines 498, 514, 530; de-de same lines):

| Item | Added fields |
|---|---|
| Kompakt | `priceMin: 549, currency: 'EUR', billing: 'one-time',` |
| Business | `priceMin: 749, currency: 'EUR', billing: 'one-time',` |
| Professional | `priceMin: 949, currency: 'EUR', billing: 'one-time',` |

`webProjects.addons.items`:

| Item | Added fields |
|---|---|
| Setup & Go-live | none: it publishes no figure |
| Compact Support / Kompakt Support | `priceMin: 39, currency: 'EUR', billing: 'monthly',` |
| Business Support | `priceMin: 69, currency: 'EUR', billing: 'monthly',` |
| Professional Support | `priceMin: 99, currency: 'EUR', billing: 'monthly',` |

`aiProcessAutomation.offerings.items`:

| Item | Added fields |
|---|---|
| AI Prototype | `priceMin: 4200, currency: 'EUR', vatIncluded: false,` |
| AI Product | `priceMin: 10990, currency: 'EUR', vatIncluded: false,` |
| Custom AI System | none: "priced individually by scope" |

Example, en-us around line 498:

```ts
        {
          name: 'Kompakt',
          price: 'from €549',
          priceMin: 549,
          currency: 'EUR',
          billing: 'one-time',
          audience: '…',
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `cd apps/website && bun test test/i18n-prices.test.ts`
Expected: PASS, 8 tests (4 per locale).

- [ ] **Step 6: Confirm nothing rendered changed**

Run: `cd apps/website && bun run build`
Expected: build succeeds. The display strings were not touched, so no rendered price changes.

- [ ] **Step 7: Commit**

```bash
git add apps/website/src/i18n apps/website/test
git commit -m "feat(website): add structured price fields alongside the display strings"
```

---

## Task 6: The services registry

**Files:**
- Create: `apps/website/src/data/services.ts`
- Test: `apps/website/test/services.test.ts`

**Interfaces:**
- Consumes: `Strings` from `apps/website/src/i18n/types.ts` (with Task 5's fields); `service`, `offer`, `offerCatalog`, `itemList` from `@sh/structured-data`.
- Produces:
  - `SERVICE_PATHS: Record<ServiceKey, Record<Locale, string>>` where `ServiceKey = 'umbrella' | 'web' | 'tpm' | 'ai'`
  - `serviceNode(key: ServiceKey, locale: Locale, strings: Strings): Node`
  - `serviceListItems(locale: Locale, strings: Strings): Array<{ url: string; name: string }>`

- [ ] **Step 1: Write the failing test**

`apps/website/test/services.test.ts`:

```ts
import { describe, expect, test } from 'bun:test';
import { enUs } from '../src/i18n/en-us';
import { deDe } from '../src/i18n/de-de';
import { serviceNode, serviceListItems, SERVICE_PATHS } from '../src/data/services';

describe('serviceNode', () => {
  test('web development publishes seven offers across two groups', () => {
    const node = serviceNode('web', 'en-us', enUs);
    const groups = (node.hasOfferCatalog as any).itemListElement;
    expect(groups.length).toBe(2);
    const count = groups.reduce((n: number, g: any) => n + g.itemListElement.length, 0);
    expect(count).toBe(7);
  });

  test('web development prices survive into the offers', () => {
    const node = serviceNode('web', 'en-us', enUs);
    const packages = (node.hasOfferCatalog as any).itemListElement[0].itemListElement;
    expect(packages.map((o: any) => o.priceSpecification.minPrice)).toEqual([549, 749, 949]);
  });

  test('the unpriced add-on is present and has no price node', () => {
    const node = serviceNode('web', 'en-us', enUs);
    const addons = (node.hasOfferCatalog as any).itemListElement[1].itemListElement;
    const setup = addons.find((o: any) => o.name === 'Setup & Go-live');
    expect(setup).toBeDefined();
    expect(setup.priceSpecification).toBeUndefined();
  });

  test('AI publishes three offers, two of them net-priced', () => {
    const offers = (serviceNode('ai', 'en-us', enUs).hasOfferCatalog as any).itemListElement;
    expect(offers.length).toBe(3);
    expect(offers[0].priceSpecification.valueAddedTaxIncluded).toBe(false);
    expect(offers[2].priceSpecification).toBeUndefined();
  });

  test('technical project management has no catalog: no rate is published', () => {
    expect('hasOfferCatalog' in serviceNode('tpm', 'en-us', enUs)).toBe(false);
  });

  test('the umbrella carries the three engagement models, unpriced', () => {
    const offers = (serviceNode('umbrella', 'en-us', enUs).hasOfferCatalog as any).itemListElement;
    expect(offers.map((o: any) => o.name)).toEqual(['Advise', 'Deliver', 'Partner']);
    for (const o of offers) expect(o.priceSpecification).toBeUndefined();
  });

  test('German ids live on German URLs', () => {
    expect(serviceNode('web', 'de-de', deDe)['@id'])
      .toBe('https://www.sebastian-heitmann.dev/de-de/web-entwicklung/#service');
  });

  test('every service is reachable from the home list', () => {
    expect(serviceListItems('en-us', enUs).map((i) => i.url)).toEqual([
      'https://www.sebastian-heitmann.dev/web-development/',
      'https://www.sebastian-heitmann.dev/technical-project-management/',
      'https://www.sebastian-heitmann.dev/ai-process-automation/',
    ]);
    expect(Object.keys(SERVICE_PATHS)).toContain('umbrella');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd apps/website && bun test test/services.test.ts`
Expected: FAIL, `Cannot find module '../src/data/services'`.

- [ ] **Step 3: Implement**

`apps/website/src/data/services.ts`:

```ts
import { offer, offerCatalog, service, type Node } from '@sh/structured-data';
import type { Locale } from '../i18n/utils';
import type { Strings } from '../i18n/types';

const ORIGIN = 'https://www.sebastian-heitmann.dev';

export type ServiceKey = 'umbrella' | 'web' | 'tpm' | 'ai';

/** The single declaration of where each service lives. Adding a fourth offering
 *  means one entry here plus its page: it cannot be forgotten in the home list. */
export const SERVICE_PATHS: Record<ServiceKey, Record<Locale, string>> = {
  umbrella: { 'en-us': '/', 'de-de': '/de-de/' },
  web: { 'en-us': '/web-development/', 'de-de': '/de-de/web-entwicklung/' },
  tpm: {
    'en-us': '/technical-project-management/',
    'de-de': '/de-de/technisches-projektmanagement/',
  },
  ai: { 'en-us': '/ai-process-automation/', 'de-de': '/de-de/ki-prozess-automation/' },
};

/** Services that have their own page, in the order the home page lists them. */
const LISTED: ServiceKey[] = ['web', 'tpm', 'ai'];

export function serviceId(key: ServiceKey, locale: Locale): string {
  return `${ORIGIN}${SERVICE_PATHS[key][locale]}#service`;
}

export function serviceUrl(key: ServiceKey, locale: Locale): string {
  return `${ORIGIN}${SERVICE_PATHS[key][locale]}`;
}

function serviceName(key: ServiceKey, s: Strings): string {
  switch (key) {
    case 'umbrella': return s.meta.title;
    case 'web': return s.webProjects.meta.title;
    case 'tpm': return s.technicalProjectManagement.meta.title;
    case 'ai': return s.aiProcessAutomation.meta.title;
  }
}

function catalogFor(key: ServiceKey, s: Strings): Node | undefined {
  switch (key) {
    case 'umbrella':
      // Engagement models: how you buy, not separately priced products. The
      // billing arrangement is stated in the rendered description; no figures
      // are published, so no price node.
      return offerCatalog(s.proof.engagementLabel, s.proof.engagements.map((e) =>
        offer({ name: e.model, description: e.description })
      ));

    case 'web':
      return offerCatalog(s.webProjects.meta.title, [
        offerCatalog(s.webProjects.packages.eyebrow, s.webProjects.packages.items.map((i) =>
          offer({
            name: i.name, description: i.audience,
            priceMin: i.priceMin, currency: i.currency,
            vatIncluded: i.vatIncluded, billing: i.billing,
          })
        )),
        offerCatalog(s.webProjects.addons.eyebrow, s.webProjects.addons.items.map((i) =>
          offer({
            name: i.name, description: i.description,
            priceMin: i.priceMin, currency: i.currency,
            vatIncluded: i.vatIncluded, billing: i.billing,
          })
        )),
      ]);

    case 'ai':
      return offerCatalog(s.aiProcessAutomation.offerings.eyebrow,
        s.aiProcessAutomation.offerings.items.map((i) =>
          offer({
            name: i.name, description: i.tagline,
            priceMin: i.priceMin, currency: i.currency,
            vatIncluded: i.vatIncluded, billing: i.billing,
          })
        ));

    case 'tpm':
      // Billed hourly with no published rate. Inventing one would be a content
      // mismatch, so this service ships without a catalog.
      return undefined;
  }
}

export function serviceNode(key: ServiceKey, locale: Locale, s: Strings): Node {
  return service({
    id: serviceId(key, locale),
    name: serviceName(key, s),
    areaServed: ['DE', 'AT', 'CH'],
    catalog: catalogFor(key, s),
  });
}

export function serviceListItems(locale: Locale, s: Strings): Array<{ url: string; name: string }> {
  return LISTED.map((key) => ({ url: serviceUrl(key, locale), name: serviceName(key, s) }));
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd apps/website && bun test test/services.test.ts`
Expected: PASS, 8 tests.

If the import of `@sh/structured-data` fails to resolve, apply the tsconfig `paths` fallback noted in Task 1 Step 8 before continuing.

- [ ] **Step 5: Commit**

```bash
git add apps/website/src/data apps/website/test
git commit -m "feat(website): add the service registry backing the offer markup"
```

---

## Task 7: The `.dev` layout emits the graph

**Files:**
- Modify: `apps/website/src/layouts/Layout.astro:1-31` (frontmatter), `:61-88` (delete blob)

**Interfaces:**
- Consumes: `person`, `website`, `webPage`, `breadcrumbs`, `graph`, `Node` from `@sh/structured-data`.
- Produces: a `nodes?: Node[]` prop on `Layout`. Tasks 8 and 9 pass page-specific nodes through it.

- [ ] **Step 1: Rewrite the frontmatter**

Replace `apps/website/src/layouts/Layout.astro` lines 1-31 with:

```astro
---
import '../styles/global.css';
import { localeConfig, getStrings } from '../i18n/utils';
import type { Locale } from '../i18n/utils';
import {
  breadcrumbs, graph, person, webPage, website, type Node,
} from '@sh/structured-data';

type Props = {
  locale: Locale;
  title: string;
  description: string;
  alternates?: Array<{ hreflang: string; href: string }>;
  includeRedirectScript?: boolean;
  ogType?: string;
  ogImage?: string;
  canonical?: string;
  /** Page-specific schema.org nodes, merged into this page's single @graph.
   *  The identity, site, page and breadcrumb nodes are added automatically. */
  nodes?: Node[];
  /** Narrower schema.org type for this document, e.g. 'CollectionPage'. */
  pageType?: string;
  /** 404 opts out of structured data entirely: there is no entity to describe. */
  noStructuredData?: boolean;
};

const {
  locale,
  title,
  description,
  alternates = [],
  includeRedirectScript = false,
  ogType = 'website',
  ogImage,
  canonical,
  nodes = [],
  pageType,
  noStructuredData = false,
} = Astro.props;
const htmlLang = localeConfig[locale].htmlLang;
const siteOrigin = 'https://www.sebastian-heitmann.dev';
const canonicalUrl = canonical ?? `${siteOrigin}${Astro.url.pathname}`;
const resolvedOgImage = ogImage ?? (ogType === 'website' ? `${siteOrigin}/og-image.jpg` : undefined);

const s = getStrings(locale);

// A page that supplies its own primary node (Service, BlogPosting, ProfilePage)
// still gets a WebPage: the WebPage describes the document, the other node
// describes the thing the document is about.
const structuredData = noStructuredData
  ? null
  : graph(
      person(locale),
      website('dev', locale, s.meta.description),
      webPage({
        url: canonicalUrl,
        title,
        description,
        site: 'dev',
        locale,
        type: pageType,
      }),
      breadcrumbs({ pathname: Astro.url.pathname, title, site: 'dev', locale }),
      ...nodes,
    );
---
```

- [ ] **Step 2: Replace the hardcoded blob**

Delete lines 61-88 (the `ProfessionalService` script) and put in their place:

```astro
        {structuredData && (
            <script type="application/ld+json" set:html={JSON.stringify(structuredData)} />
        )}
```

- [ ] **Step 3: Build and inspect the emitted graph**

Run:

```bash
cd apps/website && bun run build && \
  node -e "const m=require('fs').readFileSync('dist/index.html','utf8').match(/<script type=\"application\/ld\+json\">([\s\S]*?)<\/script>/); console.log(JSON.stringify(JSON.parse(m[1]),null,2))"
```

Expected: a single `@graph` containing `Person` (with `@id` `https://www.sebastian-heitmann.dev/#person`), `WebSite`, `WebPage`. No `ProfessionalService`, no `address`, no `priceRange`, no `BreadcrumbList` (this is the home page).

- [ ] **Step 4: Confirm the old markup is gone site-wide**

Run:

```bash
cd apps/website && ! grep -rq "ProfessionalService\|priceRange\|Kastanienallee" dist && echo CLEAN
```

Expected: `CLEAN`.

- [ ] **Step 5: Commit**

```bash
git add apps/website/src/layouts/Layout.astro
git commit -m "refactor(website): assemble one JSON-LD graph in the layout"
```

---

## Task 8: `.dev` pages supply their own nodes

**Files:**
- Modify: `apps/website/src/pages/index.astro:75`, `de-de/index.astro`
- Modify: `apps/website/src/pages/web-development.astro:21`, `technical-project-management.astro:20`, `ai-process-automation.astro:20`, and the three `de-de/` counterparts
- Modify: `apps/website/src/pages/cv.astro:16`, `de-de/cv.astro`
- Modify: `apps/website/src/pages/articles/index.astro`, `de-de/articles/index.astro`
- Modify: `apps/website/src/pages/articles/[slug].astro:76-107,130`, `de-de/articles/[slug].astro`
- Modify: `apps/website/src/pages/404.astro`

**Interfaces:**
- Consumes: `nodes`, `pageType` and `noStructuredData` props from Task 7; `serviceNode`, `serviceListItems` from Task 6; `blog`, `blogPosting`, `itemList`, `profilePage`, `personOccupations`, `personKnowsAbout` from Task 4.
- Produces: nothing consumed later.

- [ ] **Step 1: Home pages**

In `apps/website/src/pages/index.astro`, add to the frontmatter:

```ts
import { itemList, personKnowsAbout } from '@sh/structured-data';
import { serviceNode, serviceListItems } from '../data/services';

const structuredNodes = [
  // Capabilities enrich the canonical Person from the home page alone, as a
  // partial node sharing its @id. Keeping them out of person() is what lets
  // .dev and .rocks emit that node byte-identically.
  personKnowsAbout(s.capabilities.categories.flatMap((category) => category.items)),
  serviceNode('umbrella', locale, s),
  itemList(serviceListItems(locale, s)),
];
```

and pass it on line 75: `<Layout ... nodes={structuredNodes}>`.

Apply the same change to `apps/website/src/pages/de-de/index.astro`, adjusting the relative import depth to `../../data/services`.

- [ ] **Step 2: Service pages**

In `apps/website/src/pages/web-development.astro`, add to the frontmatter:

```ts
import { serviceNode } from '../data/services';
```

and to the `<Layout>` call: `nodes={[serviceNode('web', locale, s)]}`.

Repeat with key `'tpm'` for `technical-project-management.astro` and `'ai'` for `ai-process-automation.astro`. For the three `de-de/` counterparts, use the same keys with import depth `../../data/services`.

- [ ] **Step 3: CV pages**

In `apps/website/src/pages/cv.astro`, add:

```ts
import { profilePage, personOccupations } from '@sh/structured-data';
import { absoluteUrl } from '../i18n/utils';

const cvUrl = absoluteUrl('/cv');
const structuredNodes = [
  profilePage({
    url: cvUrl, title: s.cv.meta.title, description: s.cv.meta.description,
    site: 'dev', locale,
  }),
  personOccupations(s.cv.experience.map((e) => ({ role: e.role, company: e.company }))),
];
```

and pass `nodes={structuredNodes}`. Mirror in `de-de/cv.astro` with `absoluteUrl('/de-de/cv')`.

- [ ] **Step 4: Article index pages**

`apps/website/src/pages/articles/index.astro` already builds `sorted` (line 20, newest first) and passes `title={`Articles — Sebastian Heitmann`}`. Add to the frontmatter, after the `sorted` declaration:

```ts
import { blog, itemList } from '@sh/structured-data';
import { absoluteUrl } from '../../i18n/utils';

const structuredNodes = [
  // The Blog node is the parent every BlogPosting points at via isPartOf.
  blog('dev', 'Articles'),
  itemList(sorted.map((article) => ({
    url: absoluteUrl(`/articles/${article.id}`),
    name: article.data.title,
  }))),
];
```

Then change the `<Layout>` call to add `pageType="CollectionPage"` and `nodes={structuredNodes}`.

The literal `'Articles'` mirrors the page's own hardcoded `title`; there is no `nav` string for it. In `de-de/articles/index.astro`, use the corresponding German literal that page already hardcodes in its `title`, with the ` — Sebastian Heitmann` suffix removed, and prefix the URLs with `/de-de`:

```ts
  itemList(sorted.map((article) => ({
    url: absoluteUrl(`/de-de/articles/${article.id.replace(/^de-de\//, '')}`),
    name: article.data.title,
  }))),
```

Note the `id` prefix strip: that page's collection filter keeps entries whose `id` starts with `de-de/`, so the raw `id` would double the locale segment.

- [ ] **Step 5: Article detail pages**

In `apps/website/src/pages/articles/[slug].astro`, delete the hand-written `jsonLd` object at lines 76-107 and the `<script slot="head" type="application/ld+json" ...>` at line 130. Replace the object with:

```ts
import { blog, blogPosting, siteId } from '@sh/structured-data';

const structuredNodes = [
  blogPosting({
    url: canonicalUrl,
    headline: entry.data.title,
    description: entry.data.abstract,
    datePublished: publishedISO,
    dateModified: modifiedISO,
    image: heroImageUrl,
    keywords: entry.data.tags,
    locale,
    blogId: `${siteId('dev')}-blog`,
  }),
];
```

and pass `nodes={structuredNodes}` on the `<Layout>` call. The `article:*` meta tags on lines 131-137 stay as they are.

Mirror in `de-de/articles/[slug].astro`, whose hardcoded `inLanguage: 'de-DE'` at line 113 is now supplied by the `locale` argument and must be deleted along with the rest of the object.

- [ ] **Step 6: 404**

In `apps/website/src/pages/404.astro`, add `noStructuredData` to the `<Layout>` call.

- [ ] **Step 7: Build and verify the full site**

Run: `cd apps/website && bun run build`

Then verify each claim:

```bash
cd apps/website
# One script per page, everywhere.
for f in $(find dist -name '*.html'); do
  n=$(grep -c 'application/ld+json' "$f" || true)
  [ "$f" = "dist/404.html" ] && [ "$n" -ne 0 ] && echo "404 should be empty: $f"
  [ "$f" != "dist/404.html" ] && [ "$n" -ne 1 ] && echo "expected 1, got $n: $f"
done; echo "script-count check done"

# The offers actually landed.
grep -o '"minPrice":[0-9]*' dist/web-development/index.html | sort -u
```

Expected: no lines from the first loop other than `script-count check done`; the second prints `"minPrice":39`, `549`, `69`, `749`, `949`, `99`.

- [ ] **Step 8: Commit**

```bash
git add apps/website/src/pages
git commit -m "feat(website): emit per-page structured data for services, articles and CV"
```

---

## Task 9: The `.rocks` site

**Files:**
- Modify: `apps/rocks/src/layouts/Layout.astro:1-28` (frontmatter), `:55-68` (delete blob)
- Modify: `apps/rocks/src/pages/index.astro`, `de-de/index.astro`, `cases/[slug].astro`, `de-de/cases/[slug].astro`, `404.astro`

**Interfaces:**
- Consumes: everything from Tasks 1-4.
- Produces: nothing consumed later.

- [ ] **Step 1: Rewrite the layout frontmatter**

Apply the same shape as Task 7 to `apps/rocks/src/layouts/Layout.astro`, including the `nodes`, `pageType` and `noStructuredData` props, with `site: 'rocks'` throughout and `siteOrigin = 'https://www.sebastian-heitmann.rocks'`. The `.rocks` layout has no `ogImage` prop; leave that difference intact. Its `website()` description is the portfolio description from its own `s.meta.description`.

```ts
const structuredData = noStructuredData
  ? null
  : graph(
      person(locale),
      website('rocks', locale, s.meta.description),
      webPage({ url: canonicalUrl, title, description, site: 'rocks', locale, type: pageType }),
      breadcrumbs({ pathname: Astro.url.pathname, title, site: 'rocks', locale }),
      ...nodes,
    );
```

Because `person()` takes no page-specific data, this node is already identical to the one `.dev` emits. Step 6 verifies that.

- [ ] **Step 2: Delete the old Person blob**

Remove lines 55-68 and replace with the same conditional script block from Task 7 Step 2.

- [ ] **Step 3: Home pages list the cases**

`apps/rocks/src/pages/index.astro` already builds `entries` (line 20: all non-draft cases for the locale, featured first) and derives slugs via `e.id.split('/').slice(1).join('/')`. Add to the frontmatter, after the `caseHref` declaration:

```ts
import { itemList } from '@sh/structured-data';
import { absoluteUrl } from '../i18n/utils';

const caseSlug = (e: (typeof entries)[number]) => e.id.split('/').slice(1).join('/');

const structuredNodes = [
  itemList(entries.map((e) => ({
    url: absoluteUrl(`/cases/${caseSlug(e)}`),
    name: e.data.title,
  }))),
];
```

`entries` covers both `case-study` and `project` kinds, which is what the list should advertise. Then add `pageType="CollectionPage"` and `nodes={structuredNodes}` to the `<Layout>` call.

Mirror in `de-de/index.astro`, whose `locale` is `'de-de'`, so `absoluteUrl` must receive `/de-de/cases/${caseSlug(e)}`.

- [ ] **Step 4: Case detail pages**

In `apps/rocks/src/pages/cases/[slug].astro`, add:

```ts
import { creativeWork } from '@sh/structured-data';

const structuredNodes = [
  creativeWork({
    url: canonicalUrl,
    name: entry.data.title,
    description: entry.data.summary,
    dateCreated: entry.data.startDate.toISOString().slice(0, 10),
    keywords: entry.data.stack,
    genre: entry.data.kind,
    sameAs: entry.data.links.map((link) => link.url),
    locale,
  }),
];
```

Pass `nodes={structuredNodes}`. Mirror in `de-de/cases/[slug].astro`.

- [ ] **Step 5: 404**

Add `noStructuredData` to the `<Layout>` call in `apps/rocks/src/pages/404.astro`.

- [ ] **Step 6: Build and verify the identity matches `.dev` byte for byte**

Run:

```bash
cd apps/rocks && bun run build
cd ../..
node -e "
const fs=require('fs');
const pick=(p)=>JSON.parse(fs.readFileSync(p,'utf8').match(/ld\+json\">([\s\S]*?)<\/script>/)[1])
  ['@graph'].find(n=>n['@id']==='https://www.sebastian-heitmann.dev/#person');
const a=pick('apps/website/dist/index.html'), b=pick('apps/rocks/dist/index.html');
console.log(JSON.stringify(a)===JSON.stringify(b) ? 'IDENTICAL' : 'DIVERGED');
console.log(JSON.stringify(b,null,2));
"
```

Expected: `IDENTICAL`, followed by a `Person` node with no `knowsAbout` and no `hasOccupation`.

If it prints `DIVERGED`, something page-specific leaked into `person()`. The fix is always to move that field into a partial node sharing the `@id`, never to make the two sites' identity nodes differ.

- [ ] **Step 7: Commit**

```bash
git add apps/rocks packages/structured-data apps/website/src
git commit -m "feat(rocks): emit the shared identity graph and case study markup"
```

---

## Task 10: The validation gate

**Files:**
- Create: `scripts/check-structured-data.ts`
- Modify: `scripts/deploy-website.sh`, `scripts/deploy-rocks.sh`
- Test: `packages/structured-data/test/validate.test.ts`

**Interfaces:**
- Consumes: `PERSON_ID` from Task 1.
- Produces: `validateGraph(graph: unknown, opts: { path: string }): string[]` (a list of human-readable violations, empty when valid), exported from `packages/structured-data/src/validate.ts` so it is unit-testable without a build.

- [ ] **Step 1: Write the failing test**

`packages/structured-data/test/validate.test.ts`:

```ts
import { describe, expect, test } from 'bun:test';
import { PERSON_ID, validateGraph } from '../src/index';

const valid = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'Person', '@id': PERSON_ID, name: 'Sebastian Heitmann' },
    { '@type': 'WebSite', '@id': 'https://www.sebastian-heitmann.dev/#website', about: { '@id': PERSON_ID } },
  ],
};

describe('validateGraph', () => {
  test('accepts a well-formed graph', () => {
    expect(validateGraph(valid, { path: 'index.html' })).toEqual([]);
  });

  test('rejects a missing @context or @graph', () => {
    expect(validateGraph({ '@graph': [] }, { path: 'x' })[0]).toMatch(/@context/);
    expect(validateGraph({ '@context': 'https://schema.org' }, { path: 'x' })[0]).toMatch(/@graph/);
  });

  test('rejects zero or duplicate person nodes', () => {
    expect(validateGraph({ ...valid, '@graph': [valid['@graph'][1]] }, { path: 'x' })[0])
      .toMatch(/exactly one/);
    expect(validateGraph({ ...valid, '@graph': [...valid['@graph'], valid['@graph'][0]] }, { path: 'x' })[0])
      .toMatch(/exactly one/);
  });

  test('rejects the deleted vocabulary', () => {
    const bad = { ...valid, '@graph': [...valid['@graph'], { '@type': 'ProfessionalService', priceRange: '$$' }] };
    const errors = validateGraph(bad, { path: 'x' }).join(' ');
    expect(errors).toMatch(/ProfessionalService/);
    expect(errors).toMatch(/priceRange/);
  });

  test('rejects a dangling internal reference', () => {
    const bad = {
      ...valid,
      '@graph': [...valid['@graph'], { '@type': 'Service', provider: { '@id': 'https://www.sebastian-heitmann.dev/#nope' } }],
    };
    expect(validateGraph(bad, { path: 'x' })[0]).toMatch(/#nope/);
  });

  test('rejects an offer with no name, or a price with no currency', () => {
    const noName = { ...valid, '@graph': [...valid['@graph'], { '@type': 'Offer' }] };
    expect(validateGraph(noName, { path: 'x' })[0]).toMatch(/name/);

    const noCurrency = {
      ...valid,
      '@graph': [...valid['@graph'], {
        '@type': 'Offer', name: 'X',
        priceSpecification: { '@type': 'PriceSpecification', minPrice: 549 },
      }],
    };
    expect(validateGraph(noCurrency, { path: 'x' })[0]).toMatch(/priceCurrency/);
  });

  test('rejects an empty string field', () => {
    const bad = { ...valid, '@graph': [...valid['@graph'], { '@type': 'WebPage', name: '' }] };
    expect(validateGraph(bad, { path: 'x' })[0]).toMatch(/empty/);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd packages/structured-data && bun test test/validate.test.ts`
Expected: FAIL, `validateGraph is not a function`.

- [ ] **Step 3: Implement the validator**

`packages/structured-data/src/validate.ts`:

```ts
import { PERSON_ID } from './person';
import type { Node } from './types';

const FORBIDDEN_TYPES = ['ProfessionalService', 'LocalBusiness', 'PostalAddress'];
const FORBIDDEN_KEYS = ['priceRange', 'address', 'streetAddress'];

export function validateGraph(input: unknown, opts: { path: string }): string[] {
  const errors: string[] = [];
  const at = (message: string) => `${opts.path}: ${message}`;

  if (typeof input !== 'object' || input === null) return [at('not a JSON object')];
  const doc = input as Record<string, unknown>;

  if (doc['@context'] !== 'https://schema.org') errors.push(at('missing or wrong @context'));
  if (!Array.isArray(doc['@graph'])) return [...errors, at('missing @graph array')];

  const nodes = doc['@graph'] as Node[];

  const people = nodes.filter((n) => n['@id'] === PERSON_ID && n['@type'] === 'Person');
  if (people.length !== 1) {
    errors.push(at(`expected exactly one Person node with ${PERSON_ID}, found ${people.length}`));
  }

  // Every @id defined anywhere in the graph, including nested nodes.
  const defined = new Set<string>();
  walk(nodes, (node) => {
    const id = node['@id'];
    if (typeof id === 'string' && Object.keys(node).length > 1) defined.add(id);
  });

  walk(nodes, (node) => {
    const type = node['@type'];
    if (typeof type === 'string' && FORBIDDEN_TYPES.includes(type)) {
      errors.push(at(`forbidden @type "${type}"`));
    }

    for (const key of Object.keys(node)) {
      if (FORBIDDEN_KEYS.includes(key)) errors.push(at(`forbidden key "${key}"`));
      const value = node[key];
      if (typeof value === 'string' && value.trim() === '') {
        errors.push(at(`empty string on "${key}"`));
      }
      if (value === undefined) errors.push(at(`undefined value on "${key}"`));
    }

    // A bare {"@id": "..."} is a reference. It must resolve to a node defined
    // in this graph, or be one of the stable ids that legitimately live on
    // another page of the same site.
    const id = node['@id'];
    if (typeof id === 'string' && Object.keys(node).length === 1) {
      if (!defined.has(id) && !isCrossPage(id)) {
        errors.push(at(`dangling reference to ${id}`));
      }
    }

    if (type === 'Offer') {
      if (typeof node.name !== 'string' || !node.name) errors.push(at('Offer without a name'));
      const spec = node.priceSpecification as Node | undefined;
      if (spec) {
        if (typeof spec.minPrice !== 'number') errors.push(at(`Offer "${node.name}": non-numeric minPrice`));
        if (typeof spec.priceCurrency !== 'string') errors.push(at(`Offer "${node.name}": missing priceCurrency`));
        if ('price' in spec) errors.push(at(`Offer "${node.name}": use minPrice, not price`));
      }
    }
  });

  return errors;
}

/** Ids that legitimately live on another page of the same site: the person, the
 *  website, the blog, and any #service anchor. Anything else must be defined in
 *  the same graph, or it is a typo. */
function isCrossPage(id: string): boolean {
  if (!id.startsWith('https://www.sebastian-heitmann.')) return false;
  return id.endsWith('/#person') || id.endsWith('/#website')
    || id.endsWith('-blog') || id.endsWith('#service');
}

function walk(value: unknown, visit: (node: Node) => void): void {
  if (Array.isArray(value)) {
    for (const item of value) walk(item, visit);
    return;
  }
  if (typeof value !== 'object' || value === null) return;
  const node = value as Node;
  visit(node);
  for (const child of Object.values(node)) walk(child, visit);
}
```

Append to `packages/structured-data/src/index.ts`:

```ts
export { validateGraph } from './validate';
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd packages/structured-data && bun test`
Expected: PASS across all five test files.

- [ ] **Step 5: Write the build-time runner**

`scripts/check-structured-data.ts`:

```ts
#!/usr/bin/env bun
/* Post-build gate. Walks a dist/ tree, extracts the single JSON-LD block from
 * every page, and validates it. Wired into both deploy scripts, which are the
 * only enforcement point: this repo has no CI. */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { validateGraph } from '@sh/structured-data';

const dist = process.argv[2];
if (!dist) {
  console.error('usage: check-structured-data.ts <dist-dir>');
  process.exit(2);
}

const SCRIPT_RE = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;

function htmlFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return htmlFiles(path);
    return path.endsWith('.html') ? [path] : [];
  });
}

const errors: string[] = [];
let checked = 0;

for (const file of htmlFiles(dist)) {
  const rel = file.slice(dist.length + 1);
  const html = readFileSync(file, 'utf8');
  const blocks = [...html.matchAll(SCRIPT_RE)];

  // 404 has no entity to describe and is excluded from indexing anyway.
  if (rel === '404.html') {
    if (blocks.length > 0) errors.push(`${rel}: expected no JSON-LD, found ${blocks.length}`);
    continue;
  }

  if (blocks.length !== 1) {
    errors.push(`${rel}: expected exactly one JSON-LD block, found ${blocks.length}`);
    continue;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(blocks[0]![1]!);
  } catch (cause) {
    errors.push(`${rel}: JSON-LD does not parse (${(cause as Error).message})`);
    continue;
  }

  errors.push(...validateGraph(parsed, { path: rel }));
  checked += 1;
}

if (errors.length > 0) {
  console.error(`structured data invalid in ${dist} — refusing to deploy.`);
  for (const error of errors) console.error(`  ${error}`);
  process.exit(1);
}

console.log(`structured data OK (${checked} pages checked in ${dist})`);
```

- [ ] **Step 6: Run it against both built sites**

Run:

```bash
cd /home/donheidi/code/sebastian-heitmann/.claude/worktrees/feat-structured-data
bun scripts/check-structured-data.ts apps/website/dist
bun scripts/check-structured-data.ts apps/rocks/dist
```

Expected: `structured data OK (N pages checked ...)` for both, exit 0. Fix any reported violation before continuing: the gate is the deliverable, so a violation here is a real defect in Tasks 7-9.

- [ ] **Step 7: Prove the gate actually fails**

Run:

```bash
cd /home/donheidi/code/sebastian-heitmann/.claude/worktrees/feat-structured-data
cp apps/website/dist/cv/index.html /tmp/cv-backup.html
sed -i 's/"@type":"Person"/"@type":"ProfessionalService"/' apps/website/dist/cv/index.html
bun scripts/check-structured-data.ts apps/website/dist; echo "exit=$?"
cp /tmp/cv-backup.html apps/website/dist/cv/index.html
```

Expected: reports `forbidden @type "ProfessionalService"` and `exit=1`.

- [ ] **Step 8: Wire into both deploy scripts**

Both scripts already define `ROOT_DIR` on line 4 and `cd` into their app directory before building, so `dist` is the correct relative target.

In `scripts/deploy-website.sh`, immediately after the `bun run build` on line 68, insert:

```bash
# Structured data is emitted by a shared package and referenced across pages by
# @id; a broken graph is invisible in the rendered page and in the build output.
# Gate it here, the same way PUBLIC_MAIL_ENDPOINT drift is gated above. This
# repo has no CI, so the deploy scripts are the only enforcement point.
bun "$ROOT_DIR/scripts/check-structured-data.ts" dist
```

`set -euo pipefail` on line 2 makes the non-zero exit abort the deploy, so no explicit `|| exit 1` is needed.

Add the identical line after `bun run build` on line 37 of `scripts/deploy-rocks.sh`.

- [ ] **Step 9: Verify the deploy scripts still parse**

Run: `bash -n scripts/deploy-website.sh && bash -n scripts/deploy-rocks.sh && echo OK`
Expected: `OK`.

- [ ] **Step 10: Commit**

```bash
git add packages/structured-data scripts
git commit -m "feat(scripts): gate deploys on structured data validity"
```

---

## Task 11: Documentation

**Files:**
- Modify: `AGENTS.md`

- [ ] **Step 1: Document the package**

Add a `## Structured Data (`packages/structured-data/`)` section after the Rocks section, covering:

- One canonical `Person` (`https://www.sebastian-heitmann.dev/#person`), emitted byte-identically by both sites. No `Organization`.
- `ProfessionalService`, the postal address and `priceRange` are deliberately absent; the address lives in the rendered imprint only.
- Prices are "from" prices: `priceSpecification.minPrice`, never `price`. Numbers come from `priceMin`/`currency`/`vatIncluded` in the i18n files, never from parsing the display string.
- An offering with no published price still gets an `Offer`, without a price node.
- New pages need no structured-data work: the layout emits a correct baseline. Pass `nodes` only for a page-specific type; pass `noStructuredData` for error pages.
- Adding a service means one entry in `apps/website/src/data/services.ts`.
- `scripts/check-structured-data.ts` runs inside both deploy scripts and aborts the deploy on violation.

- [ ] **Step 2: Update the monorepo structure block**

In the `## Monorepo Structure` fenced block, add:

```
packages/
└── structured-data/  # Shared schema.org node builders for both sites
```

- [ ] **Step 3: Note the workspaces change**

In `## Tech Stack`, amend the runtime line to note that workspaces now cover `apps/*` and `packages/*`.

- [ ] **Step 4: Commit**

```bash
git add AGENTS.md
git commit -m "docs: document the shared structured data package and its deploy gate"
```

---

## Final verification

- [ ] `cd packages/structured-data && bun test` passes
- [ ] `cd apps/website && bun test` passes
- [ ] `cd apps/website && bun run build` succeeds
- [ ] `cd apps/rocks && bun run build` succeeds
- [ ] `bun scripts/check-structured-data.ts apps/website/dist` exits 0
- [ ] `bun scripts/check-structured-data.ts apps/rocks/dist` exits 0
- [ ] `! grep -rq "ProfessionalService\|priceRange\|Kastanienallee" apps/website/dist apps/rocks/dist`
- [ ] The `Person` node in `apps/website/dist/index.html` and `apps/rocks/dist/index.html` are byte-identical
- [ ] Paste `apps/website/dist/web-development/index.html` into the Google Rich Results Test and confirm no errors
- [ ] Paste `apps/website/dist/articles/<any>/index.html` into the Rich Results Test and confirm the Article result is detected
