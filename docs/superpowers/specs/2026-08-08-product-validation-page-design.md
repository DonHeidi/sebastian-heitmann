# Product Validation Offer Page

**Date:** 2026-08-08
**Status:** Approved, ready for planning
**Scope:** `apps/website` only

## 1. Objective

A dedicated offer page on `sebastian-heitmann.dev` for **Product Validation**, sitting
alongside the three existing offer pages (Web Development, Technical Project Management,
AI-Powered Products & Processes). It targets startup founders and small product teams
who have a digital product idea and want to test demand before committing budget to an MVP.

Commercial proposition: **From €4,900 net. 3–4 weeks. Idea to live market test.**

The page must make clear that the buyer is not purchasing a landing page. They are
purchasing a structured validation engagement whose output is a deployed product website
plus measurable market feedback.

This is not part of the local-SMB website offer on `/web-development`.

## 2. Positioning

| | |
|---|---|
| Service name | Product Validation |
| Package name | Product Validation Sprint (kept in English on both locales) |
| Core promise | Find out whether people want it before you build the whole thing. |
| Key distinction | The website is the validation artifact. The service sold is reduced uncertainty before MVP development. |

Buyer questions the page answers: is the idea understandable, does the audience care,
is the positioning strong enough, can real interest be generated before building the
application, and what should be built first if the signal is positive.

### Language rules

Use: startup, founder, product, MVP, validation, market, customers, evidence, interest,
proposition.

Avoid overusing: strategy, transformation, innovation, consulting, solution, digital
experience.

Never use: disruptive, game-changing, revolutionary, unfair advantage, 10x, growth hacking.

**Claims discipline.** Say "test assumptions", "collect evidence", "measure interest",
"reduce uncertainty", "expose weak positioning". Never say "prove demand", "guarantee
validation", "validate the business", or "guarantee product-market fit". The qualification
that validation produces evidence rather than certainty must survive into the shipped copy
in both Section 4 and the FAQ.

No invented services, prices, guarantees, testimonials, logos, performance claims, or
credentials.

## 3. Decisions taken during brainstorming

Five points where the source specification met the repository, and how each was resolved.

1. **Bilingual, not English-only.** The source spec says English. Every page here ships
   en-us and de-de, and `Strings` is one shared interface that forces both locale files to
   stay in lockstep. The page ships in both locales with a German route.
2. **No CTA analytics.** The source spec requires tracking via "existing analytics
   conventions". This site has no analytics: no script, no event helper, nothing beyond
   boilerplate in the privacy page. That acceptance criterion is **deferred** and recorded
   in section 12 below. No tracking attributes, no new platform.
3. **Nine sections, not twelve.** The source spec's §3 (package Included list) and §10
   (Scope boundaries Included column) are near-duplicates, and §8 (What can come next) and
   §9 (Optional additions) are adjacent ideas. Scope boundaries merge into the package
   block; optional add-ons merge into What comes next. All content is retained, nothing is
   stated twice, and the page keeps the site's rhythm.
4. **Price reads `From €4,900 net`.** The neighbouring AI page already uses
   `From €4,200 net` / `ab 4.200 € netto`, and net versus gross matters to German B2B
   buyers.
5. **Homepage entry point added.** The page gets a link from `ProofSection` so it is not
   orphaned in site navigation.

### Revision, 2026-08-08 (after first build)

The page as first built read as an inventory: nine sections, each one eyebrow, headline,
list, and roughly 50 discrete list items across ten screens. The deliverables in particular
appeared three times, since section 6.2's capability list restated 8 of its 9 items from the
package's Included list. Decision 3 above removed one duplication; it missed the larger one.

Cut, on the rule that anything already stated elsewhere goes:

- **Section 6.2 loses its capability list entirely.** It is a subset of the Included list one
  section below. Section 6.2 is now prose only.
- **The Included list groups 14 atoms into 6 lines**, by phase rather than by deliverable. As
  a side effect the included and excluded columns now balance rather than leaving a void.
- **The add-on tag grid becomes two sentences.** Ten tags were a fourth inventory.
- **The FAQ drops from 7 questions to 5.** "What technology do you use?" duplicates the
  package's source-code-handover promise; "Can I use the website for fundraising?" duplicates
  situation card 3. The five that remain each answer an objection nothing else on the page
  answers.

Measured result: 9,205px to 8,326px at 1440, about 10%. Worth recording that this was far
less than the 40% estimated before the cut. Per-section measurement shows why: section
padding alone is 1,280px (15% of the page) and no single section is fat. The remaining
length is nine sections of genuine content, so further shortening means removing sections or
changing the page's shape, not trimming more lists.

### Second revision, 2026-08-08 (after comparing against a reference page)

Compared against `featherflow.com/product-websites`, evidently the source of the original
brief: same $4,900, same 3 to 4 weeks, same pre-MVP framing. Two things the comparison
settled.

**The offer block is a pricing card, not a scope table.** The reference states its
deliverables as 3 to 6 word noun phrases in a narrow column. The first revision above had
reduced 14 short items to 6 long ones, cutting the count while raising the density, which is
why the card still read as broad. It is now a 420px column: name, price, timeline, eight
short lines, CTA. Scope exclusions moved out beside it. They inform rather than sell, and
they were most of what made the card feel wide.

**The page needed something to look at.** Measured against the reference, this page had
roughly half the copy (1,102 words against about 2,000) and more height. The reference is
denser because it carries five portfolio cards and a testimonial. Section 6.2b now shows
Job Directory: a live product website with positioning and a capture form, screenshotted and
framed in the glass treatment, placed between "what this is" and the price so the reader sees
the artifact before being asked to value it.

Two constraints on that section, both deliberate:

- **It is Sebastian's own product, and the copy says so** — but not in the opening line. The
  section leads with the artifact and what it contains; attribution lands afterwards, framed
  as method ("this is the sequence I run on my own bets"). Hiding the ownership was rejected;
  so was opening on it, which weakens the pitch for no honesty gain.
- **No outcome is claimed.** No signup counts, no validation results, no client. Job Directory
  is pre-launch, and the copy says the product behind the site is still in development.

Note for whoever maintains this: Job Directory is now the example on two offer pages, this one
and the AI page. Different facet each time, but it does signal a thin portfolio, and a second
example would be worth having.

## 4. Route and file map

| Path | Purpose |
|---|---|
| `src/pages/product-validation.astro` | EN page shell, mirroring `ai-process-automation.astro` |
| `src/pages/de-de/produkt-validierung.astro` | DE twin |
| `src/components/product-validation-content.tsx` | All nine sections, build-time TSX |
| `src/components/faq-section.tsx` | New reusable FAQ component |
| `src/i18n/types.ts` | `productValidation` block on `Strings`, plus exported `FaqContent` |
| `src/i18n/en-us.ts`, `src/i18n/de-de.ts` | Copy for both locales |
| `src/components/navigation.tsx` | Two `routeMap` entries for the language picker |
| `src/components/proof-section.tsx` | `deliverLinks` refactor (section 8 below) |
| `src/pages/index.astro`, `src/pages/de-de/index.astro` | Pass the new link |

The German slug `produkt-validierung` follows the established hyphenation habit
(`web-entwicklung`, `ki-prozess-automation`, `technisches-projektmanagement`).

The page shell is a near copy of `ai-process-automation.astro`: `Layout`, `Navigation`
with `ThemeToggle`, the content component, `ContactSection` wrapping `ContactForm`, and
`Footer`. The contact block overrides only `headline` and `intro`, so the existing
one-business-day response promise in the shared `contact` strings is reused unchanged and
no conflicting promise appears.

`@astrojs/sitemap` picks up both routes automatically. No config change needed.

## 5. Design language

Every section reuses what the AI page already established. No new visual primitives.

- `sectionBase` padding rhythm, `reveal` animation class, `max-w-[1440px]` containers
- `Eyebrow` plus `DotRule` section headers
- `glassCard` tokens and the corner-mark spans
- `CtaLink` for primary calls to action, the down-arrow variant for in-page jumps
- `VerticalDotRule` for the numbered process spine
- The glass chip row with dotted connectors for the journey line
- The bordered-row list, the `✱` bullet list, the dot bullet list, and the tag grid
- `--v8-*` custom properties throughout, so light and dark both work by construction

Visual emphasis goes to the main promise, the price, the timeline, what is included, the
four-step process, and the validation to MVP path.

Mobile: all sections readable and correctly ordered at 375px. Pricing and package scope
must never depend on hover.

## 6. Section by section

Copy below is the shipped English text. German is a translation written during
implementation, matching the register of the existing German offer pages.

### 6.1 Hero

Unbanded, tall top padding, matching the AI page hero.

- **Eyebrow:** Product Validation
- **H1:** Find out whether people want it before you build the whole thing.
- **Intro:** Turn your product idea into a real market test: clear positioning, a
  professional product website, lead collection, and the infrastructure to measure whether
  people are interested.
- **Supporting line:** Fixed-price product validation for startups and new digital products.
- **Meta chips** (glass chip row, no connectors): `From €4,900 net` and `3–4 weeks`
- **Primary CTA:** Discuss your product, linking to `#contact`
- **Secondary CTA:** See what's included, linking to `#package`, using the down-arrow style

Both numbers appear in the hero so the offer is unambiguous without scrolling.

### 6.2 What this is

- **Eyebrow:** What this is
- **H2:** Put the idea in front of customers.
- **Body:**
  1. You do not need a finished product to find out whether your idea resonates.
  2. A Product Validation Sprint turns an early concept into something you can actually
     launch, share, advertise, and put in front of potential customers.
  3. Together, we work out what you are selling, who it is for, and why somebody should
     care. I then turn that into a complete product website designed to generate
     measurable interest.
  4. The result is not a mock-up sitting in Figma. It is a real website, running on your
     domain, ready for customers.
- **Capabilities** (`✱` bullet list, two columns on desktop):
  Product positioning and value proposition / Competitor and market research / Website
  structure and messaging / Custom visual design / Responsive implementation / Waitlist,
  signup, or lead capture / Analytics and conversion tracking / Technical SEO and social
  sharing setup / Launch support

Note that "analytics and conversion tracking" here describes a deliverable of the client
engagement, not instrumentation of this website. Decision 2 above is unaffected.

### 6.3 Package (`id="package"`)

A single corner-framed glass card. One package, so no multi-tier grid.

- **Eyebrow:** The offer
- **H2:** One package. A clear outcome.
- **Package title:** Product Validation Sprint
- **Price:** From €4,900 net
- **Description:** For founders and teams who have a product idea but do not yet need, or
  want, to commit to building the complete product.
- **Included** (bordered-row list, label "Included"):
  Initial product and positioning workshop / Competitor and market review / Definition of
  target users and core proposition / Website concept and information architecture / Copy
  development and refinement / Custom visual design / Responsive website development /
  Lead, waitlist, or early-access form / Analytics and conversion events / Technical SEO
  fundamentals / Social and Open Graph presentation / Deployment and production setup /
  Two structured revision rounds / Source code handover
- **Not included unless scoped separately** (second column, same list treatment):
  Full application or MVP development / Paid advertising or media budget / Ongoing
  performance marketing / Large-scale customer research or participant recruitment / Full
  corporate identity development / Professional photography or video production / Legal
  advice or preparation of legal documents
- **Metadata** (mono): Typical timeline: 3–4 weeks · Fixed price once scope is agreed
- **Legal note** (muted italic footnote): Privacy, imprint, terms, and similar pages can be
  technically integrated when the appropriate texts are provided.
- **CTA:** Discuss your product

The legal note is deliberately worded so nothing on the page reads as an offer of legal
advice or legal drafting.

### 6.4 Why start here

- **Eyebrow:** Why start here
- **H2:** An MVP is an expensive way to test a sentence.
- **Intro:** A surprising amount can be learned before building dashboards, authentication,
  billing systems, APIs, and application logic.
- **Lead-in:** The first questions are usually much simpler:
- **Questions** (dot bullet list):
  Does the right person understand what this is? / Does the problem matter enough to them? /
  Does the proposition make them curious enough to act?
- **Closing:**
  1. A product website cannot prove that a company will succeed. But it can expose weak
     positioning, unclear audiences, lack of interest, and incorrect assumptions before
     those assumptions become software.
  2. That makes it useful whether the next step is development, fundraising, customer
     interviews, or deciding not to pursue the idea at all.

### 6.5 When this makes sense

Four glass cards, 2 by 2 on desktop, stacked on mobile, subgrid-aligned.

- **Eyebrow:** When this makes sense
- **H2:** Built for the stage before the big build.

| Card | Copy |
|---|---|
| You have an idea | You know what you want to create, but it still mostly exists in documents, conversations, or your head. We turn it into a proposition other people can understand and react to. |
| You are preparing an MVP | Before committing development budget, you want a public presence, early leads, and a clearer view of the market. The validation site becomes the first layer of the eventual product launch. |
| You are talking to investors or partners | You need something more convincing than a pitch deck but do not yet have a finished product. A real product presence gives the idea context and makes it easier to demonstrate. |
| You built something but cannot explain it | Sometimes the technology exists before the positioning does. We work backwards from the product and turn its capabilities into a proposition customers can understand. |

Each card body is two paragraphs, split at the sentence boundary shown.

### 6.6 Process

Numbered steps on the `VerticalDotRule` spine, exactly the AI page pattern.

- **Eyebrow:** Process
- **H2:** From idea to market in four steps.

| Step | Title | Copy |
|---|---|---|
| 01 | Understand | We start with the product, customer, problem, alternatives, and assumptions behind the idea. The goal is not to produce documentation. It is to identify what actually needs to be communicated and tested. |
| 02 | Position | I research the market and relevant competitors and turn what we learn into a clear proposition, page structure, messaging, and calls to action. At this point, we should be able to explain the product without explaining the technology behind it. |
| 03 | Build | I design and develop the complete website. No handover between strategist, designer, developer, and project manager. The concept stays connected to the implementation. |
| 04 | Launch and learn | The site goes live with lead capture and analytics in place. You can start sending prospects, communities, investors, campaigns, or early customers to it and see what happens. |

### 6.7 Differentiation

Prose section, matching the AI page's approach block.

- **Eyebrow:** More than landing-page development
- **H2:** The website is the experiment. Not the product being sold.
- **Body:**
  1. There are plenty of people who can build a landing page.
  2. The more important work happens before that: determining what the page should say,
     whom it should convince, and what response would actually tell you something useful.
  3. My background combines software development, product and project work, technical
     consulting, UX methods, and AI-supported execution.
  4. That means I can work on the proposition without losing sight of what would eventually
     have to be built behind it.
  5. And if the validation works, the project does not have to stop at the website.

### 6.8 What comes next

- **Eyebrow:** What can come next
- **H2:** Validate first. Build when there is a reason to.
- **Intro:** The Product Validation Sprint is designed to stand on its own. But it can
  become the first stage of a larger product engagement.
- **Follow-on cards** (three, same card treatment as 6.5):

| Card | Copy |
|---|---|
| Interactive prototype | For concepts that need more than static screens, selected interactions or a realistic product prototype can be built. |
| MVP definition | Turn what was learned during validation into priorities, requirements, technical decisions, and a realistic first product scope. |
| MVP development | If there is enough evidence to proceed, the project can move from proposition into working software. |

- **Journey line**, rendered with the glass chip row and dotted connectors, displayed
  prominently: `Product idea` → `Validation` → `Prototype` → `MVP` → `Product`
- **Journey note:** You do not need to commit to that entire path upfront.
- **Add-ons intro:** Depending on the product, the validation sprint can be extended with:
- **Add-ons** (tag grid): Interactive product prototype / Fake-door or simulated product
  flows / Additional landing-page variants / A/B testing / Newsletter or CRM integration /
  Booking or demo flows / Founder and customer interview support / Additional market
  research / Brand identity development / Product architecture and MVP scoping
- **Add-ons note:** These are scoped separately because not every product needs them.

### 6.9 FAQ

Seven entries, rendered by the new `FaqSection` component (section 7 below).

- **Eyebrow:** Questions
- **H2:** Common questions

| Question | Answer |
|---|---|
| Do I need to have a finished product? | No. That is precisely the point. The service works best when there is already a reasonably concrete product idea, but substantial development has not yet taken place. |
| Is this just a landing page? | No. The landing page is one deliverable. The engagement includes the work required to determine what it should communicate: positioning, market context, proposition, structure, messaging, design, implementation, and measurement. |
| Can you guarantee that this validates my idea? | No. Validation is evidence, not certainty. A website can help measure interest and test assumptions, but lack of signups can have many causes: proposition, audience, traffic source, pricing, timing, or the idea itself. The purpose is to learn more cheaply than by immediately building the complete product. |
| Do you also build the MVP? | Yes, when that makes sense. MVP development is a separate engagement because its scope depends heavily on what is being built. The validation sprint can be used to define that scope. |
| What technology do you use? | I generally build lightweight, fast websites using modern web technologies rather than locking the project into a visual website builder. You receive the source code and can continue working with me or another developer. |
| Can I use the website for fundraising? | Yes. The site can serve simultaneously as your public product presence, validation channel, and something concrete to show investors, partners, and early customers. |
| Why €4,900 when I can get a landing page much cheaper? | Because you can. If you already know exactly what the product is, exactly how it should be positioned, have finished copy and design, and only need somebody to implement a page, this is probably the wrong service. This engagement is for the stage where those questions still need to be resolved. |

Answers are stored as string arrays so multi-paragraph answers render as separate
paragraphs.

### 6.10 Contact

The shared `ContactSection` and `ContactForm`, with two overrides:

- **Headline:** Put your idea in front of the market.
- **Intro:** Tell me what you are thinking about building, where you currently are, and
  what you want to learn before committing to the full product.

Everything else, including the response-time promise and all form labels, comes from the
shared `contact` strings untouched.

## 7. New component: `FaqSection`

No FAQ component exists in `src/components`. This one is built to be reused by the other
three offer pages later, so its props are generic.

```ts
export interface FaqItem {
  question: string;
  /** One entry per paragraph. */
  answer: string[];
}

export interface FaqContent {
  eyebrow: string;
  headline: string;
  items: FaqItem[];
}
```

Implementation is native `<details>` and `<summary>`, one per item, inside the standard
section wrapper. The native disclosure element gives expanded and collapsed state to
assistive technology and full keyboard operation with **zero client JavaScript**, which is
the only approach consistent with the project rule that no React ships to the client.

Rows use the existing bordered-list treatment. The `✱` marker rotates on open via
`group-open:` variants. The default marker is suppressed (`[&::-webkit-details-marker]:hidden`,
`list-none`). Summary text uses the body font at list-row size; answers use the muted
secondary body style.

`FaqContent` is exported from `src/i18n/types.ts` so other pages can adopt the shape.

## 8. `ProofSection` refactor

The featured "Deliver / Per Cycle" engagement card is where a fixed-price sprint belongs.
It already carries two links through ad-hoc `aiLink` and `webDevLink` props plus a
conditional padding expression (`aiLink ? 'pt-3' : 'mt-auto border-t border-border pt-4'`).

Replace those two props with one array:

```ts
deliverLinks?: Array<{ label: string; href: string }>;
```

Rendered as a mapped list on the featured card: index 0 keeps
`mt-auto border-t border-border pt-4`, subsequent entries get `pt-3`. That produces
byte-identical markup for the two existing links and makes the third a data change rather
than another conditional. `tpmLink` on the Advise card is unchanged.

New link label: **Product validation for startups** (EN) and the German equivalent, added
to `deliverLinks` in both `index.astro` files.

## 9. SEO and metadata

Titles follow the site's existing em-dash separator convention rather than the source
spec's pipe.

| | EN | DE |
|---|---|---|
| Title | Product Validation for Startups — Sebastian Heitmann | Produktvalidierung für Startups — Sebastian Heitmann |
| Description | Test your product idea before committing to an MVP. Positioning, research, product website, lead capture and analytics in a fixed-price Product Validation Sprint. | German translation of the same |

`getHreflangAlternates('/product-validation', '/de-de/produkt-validierung')` supplies
canonical and hreflang, matching every other asymmetric-slug page.

Target intent: product validation, startup product validation, validate product idea, test
startup idea, MVP validation, product landing page, startup landing page. Visible copy is
not keyword-stuffed for these.

**No new structured data.** `Layout.astro` emits a single global `ProfessionalService`
block and the site has no per-page service schema. Adding `Service`, `Offer`, or `FAQPage`
markup here would introduce exactly the new schema strategy the source spec forbids. If
per-page service schema is wanted later, it should be designed once for all four offer
pages.

## 10. Accessibility

- One `h1` (the hero headline), `h2` per section, `h3` for cards, steps, and column labels
- FAQ uses native `<details>` so expanded state is exposed without ARIA plumbing
- All interactive elements are links or native disclosures, so keyboard operation and
  visible focus come from the global styles
- Price, timeline, scope, and card bodies are always-visible text, never hover-revealed
- Semantic `ul`/`ol` for every list, `ol` for the process steps
- Descriptive link text ("Discuss your product", "See what's included"), no bare "here"
- Decorative corner marks, dot rules, and chip connectors carry `aria-hidden="true"`
- Contrast comes from the existing `--v8-*` token pairs, unchanged in both themes

## 11. Out of scope

- No page builder, no Webflow, no Framer, no additional CSS framework
- No hydrated React islands, no `client:*` directives
- No redesign of existing pages beyond the contained `ProofSection` link refactor
- No new global visual language or new design primitives
- No changes to the mail service, infrastructure, or deploy scripts

## 12. Acceptance criteria

Met by this design:

- Dedicated Product Validation page on an appropriate route, in both locales
- Visually matches the existing site, reusing existing components and primitives
- Hero communicates the offer without scrolling, including price and timeline
- `From €4,900 net` and `3–4 weeks` visible and unambiguous
- Service clearly differentiated from ordinary landing-page development
- Base package includes actual website implementation, no split design and build prices
- All included deliverables and all scope exclusions represented
- Legal work not presented as part of the service
- Four-step process present
- `Product idea → Validation → Prototype → MVP → Product` progression present
- FAQ implemented
- CTAs lead into the site's existing contact flow
- Responsive and keyboard accessible
- Metadata implemented
- Build and type checks pass

**Deferred, with reason:**

- *CTA click tracking.* The site has no analytics implementation to follow conventions
  from. Adding one would require choosing a platform, updating the privacy page, and
  possibly infrastructure work, all outside this page's scope. If analytics is introduced
  later, the four CTAs to instrument are: hero primary, hero secondary, package, and final
  contact.
- *FAQPage and Service structured data.* Same reasoning as section 9.

## 13. Verification

1. `bun run build` in `apps/website`, which runs the type check and the production build.
2. Visual pass at 1440, 768, and 375 in both light and dark, on both locales, via Chrome
   DevTools. Defects fixed before handover.
3. Keyboard pass: tab through hero CTAs, package CTA, all seven FAQ disclosures, and the
   contact form.
4. Confirm the language picker crosses correctly between `/product-validation` and
   `/de-de/produkt-validierung`.
5. Confirm the homepage link renders on both locales and that the two pre-existing deliver
   links are unchanged.

Work happens in the `feat-product-validation-page` worktree and is delivered as a pull
request for rebase-merge.
