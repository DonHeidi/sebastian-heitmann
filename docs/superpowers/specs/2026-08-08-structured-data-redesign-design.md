# Structured Data Redesign

Date: 2026-08-08
Status: Approved design

## Problem

JSON-LD on the two sites is duplicated, contradictory, and inline in two layout
templates. Three concrete defects:

**The sites contradict each other.** `apps/website/src/layouts/Layout.astro:61`
declares `https://www.sebastian-heitmann.dev` to be a `ProfessionalService` with
a street address and a price range. `apps/rocks/src/layouts/Layout.astro:55`
declares the same URL, via `sameAs`, to be a `Person`. Neither node carries an
`@id`, so which claim a crawler honours is arbitrary.

**Entities multiply.** Article pages emit a `BlogPosting` whose `author` is an
anonymous inline `Person` and whose `publisher` is an anonymous inline
`Organization`, both named "Sebastian Heitmann", neither linked to the layout's
`ProfessionalService`. One human is described by up to four unlinked nodes.

**Description bleed.** Both layouts stamp the current page's meta description
onto the identity node. Google sees roughly 24 copies of the same entity with 24
different descriptions, including on `404` and `privacy`.

**Nothing describes the actual offerings.** The three service pages publish
concrete, named, individually priced packages in rendered copy. None of it
reaches structured data. The only price signal on the entire site is
`priceRange: "$$"`, a `LocalBusiness` field meaning "moderately priced" that
carries no numbers.

## Goals

1. Entity/knowledge-graph identity: one Sebastian Heitmann across `.dev`,
   `.rocks`, LinkedIn and GitHub.
2. Make each site's purpose legible: `.dev` is the business site, `.rocks` is the
   portfolio.
3. Rich-results eligibility where it is honestly available.
4. Correctness and maintainability: one typed source, guarded by a build gate.

Explicitly **not** a goal: local SEO for Tostedt or Hamburg. This decision drives
the removal of the `LocalBusiness` framing and the postal address.

## Entity model

One `Person`. No `Organization`. Sebastian trades under his own name with no
distinct brand, so an `Organization` node named identically to the `Person` would
recreate the ambiguity this work removes.

```
PERSON_ID = "https://www.sebastian-heitmann.dev/#person"
```

Both domains emit this node byte-identically for a given locale. The site
distinction lives one level down, in the `WebSite` node and in the page-level
types:

| | `.dev` (business) | `.rocks` (portfolio) |
|---|---|---|
| `WebSite.description` | fractional CTO services | portfolio of work |
| Home | `WebPage` + `Service` | `CollectionPage` of works |
| Detail pages | `Service`, `provider` → person | `CreativeWork`, `creator` → person |
| Articles | `BlogPosting`, `author` → person | none, teasers link out |

Cross-site linkage:

```
Person.url    = https://www.sebastian-heitmann.dev
Person.sameAs = [ .dev, .rocks, LinkedIn, GitHub ]
```

`Person.knowsAbout` derives from the 16 items in `capabilities.categories`, so
adding a capability requires no structured-data change.

### Deleted

`ProfessionalService`, `PostalAddress`, `priceRange`, the anonymous inline
`Organization` publisher, the anonymous inline `Person` author, and the
description bleed. The address remains on the imprint page, where German law
requires it, but leaves structured data entirely.

## Offerings

Four `Service` nodes. The governing principle: **an offering without a published
price still gets a node, it just gets no price node.** Omitting it would
understate what is sold; inventing a price would be a content mismatch and is a
documented cause of structured-data manual actions.

### Home page: umbrella

One `Service` (`…/#service`, "Technology consulting") whose catalogue holds the
three engagement models. These are ways of engaging the umbrella, not separately
purchasable products, so they carry `name` and `description` only. No
`priceSpecification`: no figures are published, and a price node without a price
is noise. The billing arrangement is already stated in the rendered description.

| Offer | Billing (in description) |
|---|---|
| Advise | hourly |
| Deliver | fixed price per delivery cycle |
| Partner | monthly retainer |

### `/web-development`

Two groups, mirroring the page's own structure:

```
Service "Web Development"
 └─ OfferCatalog
     ├─ OfferCatalog "Packages"
     │    Kompakt €549+ · Business €749+ · Professional €949+
     └─ OfferCatalog "Add-ons"
          Setup & Go-live (no published price) ·
          Compact €39/mo+ · Business €69/mo+ · Professional €99/mo+
```

Seven offers. Monthly plans use `UnitPriceSpecification` with
`referenceQuantity: { value: 1, unitCode: "MON" }`.

### `/ai-process-automation`

Three offers, two priced. `valueAddedTaxIncluded: false`, because the copy says
"net".

| Offer | Price |
|---|---|
| AI Prototype | `minPrice: 4200` EUR |
| AI Product | `minPrice: 10990` EUR |
| Custom AI System | none, "priced individually by scope" |

### `/technical-project-management`

`Service` with no `hasOfferCatalog`. The page bills hourly and publishes no rate.
If a rate is ever published it becomes one `UnitPriceSpecification` with
`unitCode: "HUR"`.

### Price representation

All published figures are "from" prices, so they map to
`priceSpecification.minPrice`, never to `price`. `price: 549` would assert an
exact cost and would be false.

Totals per locale: 13 offer nodes (3 umbrella + 7 + 3 + 0), 26 across both
locales, against zero today.

### Type choice: `Service`, not `Product`

Google renders price snippets for `Product`, not for `Service`. Typing consulting
packages as `Product` to farm that snippet was considered and rejected: `Product`
is defined for goods, `availability: InStock` is meaningless for an engagement,
and misuse risks a spammy-structured-data manual action. `Service` + `Offer` is
truthful, feeds the knowledge graph and LLM crawlers, and is already eligible
should Google ship service price snippets.

## Architecture

### `packages/structured-data/`

A new workspace package. The root `workspaces` glob widens from `["apps/*"]` to
`["apps/*", "packages/*"]`. Pure TypeScript with no Astro dependency, so it is
testable with plain `bun test`.

Exports typed builders rather than blobs:

```ts
PERSON_ID
person(locale)               // the one canonical node
website(site, locale)        // per-domain, about + publisher -> PERSON_ID
webPage({ url, title, ... })
service({ ... })
creativeWork({ ... })
blogPosting({ ... })
profilePage({ ... })
breadcrumbs(pathname, title)
graph(...nodes)              // wraps in { "@context", "@graph" }
```

### One graph per page, assembled by the layout

Both `Layout.astro` files stop hardcoding blobs. Each assembles
`[person, website, webPage, breadcrumbs]` from props it already requires
(`locale`, `title`, `description`, `canonical`), concatenates an optional `nodes`
prop, and emits a single `@graph` in one `<script type="application/ld+json">`.

The article templates lose their separate `<script slot="head">` entirely. A
service page becomes:

```astro
<Layout ... nodes={[service({ id: 'web-development', ... })]}>
```

### Per-page node map

`.dev`:

| Route | Added nodes |
|---|---|
| `index` | `WebPage`, `mainEntity` → person; umbrella `Service`; `ItemList` of the three service URLs |
| `web-development` | `Service` + nested `OfferCatalog` (7 offers) |
| `ai-process-automation` | `Service` + `OfferCatalog` (3 offers) |
| `technical-project-management` | `Service`, no offers |
| `cv` | `ProfilePage`, `mainEntity` → person, plus a partial `{ "@id": PERSON_ID, "hasOccupation": [...] }` |
| `articles/index` | `CollectionPage` + `Blog` + `ItemList` |
| `articles/[slug]` | `BlogPosting`, `author`/`publisher` → person, `isPartOf` → `Blog` |
| `imprint`, `privacy` | `WebPage` only |
| `404` | nothing |

`.rocks`:

| Route | Added nodes |
|---|---|
| `index` | `CollectionPage`, `about` → person; `ItemList` of cases |
| `cases/[slug]` | `CreativeWork`, `creator` → person, `dateCreated` from `startDate`, `keywords` from `stack`, `genre` from `kind`, `url` from `links` |
| `404` | nothing |

The `cv` partial node is standard JSON-LD: a second node sharing an `@id` merges
into the first on the consumer side. It keeps the `Person` identical everywhere
while letting the CV page alone carry employment history.

German routes get the same structure with localized names and their own `@id` on
the German URL, linked to the English variant by the existing hreflang tags.

## Extensibility

Ordered by what a future addition costs:

1. **Content collections: zero work.** Articles and cases come from
   `getCollection`. Adding `cases/en-us/blickwerk.md` makes it appear in the
   English `ItemList` and get its own `CreativeWork` with no structured-data
   change.
2. **Services: one registry entry.** `apps/website/src/data/services.ts` becomes
   the single declaration, consumed by both the home `ItemList` and each service
   page. A fourth offering cannot be forgotten in the ItemList.
3. **Any other new page: zero work by construction.** The layout emits a correct
   baseline from props it already requires. Breadcrumb labels derive from the
   pathname and the page's own `title`, so there is no route table to maintain.

```ts
type ServiceDef = {
  id: string            // '#service-web-development'
  path?: string         // undefined = umbrella on the home page
  i18nKey: string
  serviceType: string
  areaServed: string[]
  offers: OfferDef[]    // may be empty
}
type OfferDef = {
  i18nKey: string
  priceMin?: number     // omitted when no figure is published
  currency?: 'EUR'
  vatIncluded?: boolean // false for the AI tiers, which say "net"
  billing?: 'one-time' | 'monthly' | 'hourly' | 'per-cycle'
}
```

### Price source

Prices stay as display strings for rendering and gain structured fields
alongside, in the same i18n entry: `price: 'from €549'` plus `priceMin: 549`,
`currency: 'EUR'`.

Parsing the display string was rejected. English renders `from €549`, German
renders `ab 549 €` with a non-breaking space. A parser needs locale-specific
handling and fails silently on one side. Explicit fields are type-checked and
cannot diverge in only one locale.

## Validation

`scripts/check-structured-data.ts`, run over `dist/**/*.html` after build and
wired into both `deploy-website.sh` and `deploy-rocks.sh` as an abort gate, in
the same manner as the existing `PUBLIC_MAIL_ENDPOINT` mismatch check. There is
no CI in the repo, so the deploy scripts are the enforcement point.

Assertions:

- exactly one `ld+json` block per page, which parses and carries `@context` and
  `@graph`
- exactly one node carrying `PERSON_ID`, deep-equal to the canonical node for
  that locale
- every internal `{"@id": ...}` reference resolves to a node in the same graph
- no node ships an empty or `undefined` required field
- every `Offer` has a `name`; any `priceSpecification` present has both a numeric
  `minPrice` and a `priceCurrency`
- `404` is exempt

Unit tests in `packages/structured-data/` cover the builders directly, including
that `person('en-us')` and `person('de-de')` share an `@id`.

This also satisfies the SEO build gate outstanding since the hreflang work.

## Out of scope

`apps/rocks/src/content/cases/` holds six German cases but only two English ones
(`blickwerk`, `job-directory`), so the English `ItemList` will be four items
shorter until the translations land. `AGENTS.md` requires both locales. Noted,
not fixed here.
