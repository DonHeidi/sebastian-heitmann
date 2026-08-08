# Product Validation Offer Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a bilingual Product Validation offer page on `sebastian-heitmann.dev` that sells a fixed-price Product Validation Sprint from €4,900 net over 3–4 weeks.

**Architecture:** A fourth offer page built exactly like `ai-process-automation.astro`: a thin `.astro` route per locale, all markup in one build-time TSX content component, all copy in the shared typed `Strings` i18n objects. One genuinely new component (`FaqSection`, native `<details>`), one contained refactor (`ProofSection` link props), no new visual primitives and no client JavaScript.

**Tech Stack:** Astro 7, React 19 as build-time templating only, Tailwind v4 with `--v8-*` custom properties, TypeScript, Bun.

**Source spec:** `docs/superpowers/specs/2026-08-08-product-validation-page-design.md` (committed). Section references below like "spec §6.4" point at it.

## Global Constraints

- **No client JavaScript.** No `client:*` directives, no hydrated islands, no `<script>` in the new components. Interactivity comes from native HTML elements only.
- **No new visual primitives.** Reuse the tokens, helpers, and patterns already in `ai-process-automation-content.tsx`.
- **No new dependencies.** Do not add packages. `bun add` is never run in this plan.
- **Both locales stay in lockstep.** `Strings` is one interface; every key added must exist in both `en-us.ts` and `de-de.ts`, and every string array must have the same length in both.
- **Price string is exactly** `From €4,900 net` (EN) and `ab 4.900 € netto` (DE).
- **Timeline string is exactly** `3–4 weeks` (EN, en dash U+2013) and `3–4 Wochen` (DE).
- **Package name stays English in both locales:** `Product Validation Sprint`.
- **Claims discipline.** Never write "prove demand", "guarantee validation", "validate the business", or "guarantee product-market fit". Use "test assumptions", "collect evidence", "measure interest", "reduce uncertainty", "expose weak positioning".
- **Banned words:** disruptive, game-changing, revolutionary, unfair advantage, 10x, growth hacking.
- **No invented business facts.** No testimonials, client logos, performance numbers, guarantees, or credentials beyond what this plan contains.
- **No analytics.** Do not add tracking attributes, scripts, or event helpers. Deferred deliberately (spec §12).
- **No new structured data.** Do not add `Service`, `Offer`, or `FAQPage` JSON-LD.
- **Type gate:** `bunx tsc --noEmit` from `apps/website` must exit 0.
- **Build gate:** `bun run build` from `apps/website` must complete with 37 pages built (35 today plus the two new routes).
- All commands run from `apps/website` unless stated otherwise.

---

## File Structure

| File | Responsibility |
|---|---|
| `src/i18n/types.ts` | Adds `FaqItem`, `FaqContent`, and the `productValidation` block on `Strings` |
| `src/i18n/en-us.ts` | English copy |
| `src/i18n/de-de.ts` | German copy |
| `src/components/product-validation-content.tsx` | All nine page sections and their local layout helpers |
| `src/components/faq-section.tsx` | Reusable native-disclosure FAQ, consumes `FaqContent` |
| `src/pages/product-validation.astro` | English route shell |
| `src/pages/de-de/produkt-validierung.astro` | German route shell |
| `src/components/navigation.tsx` | Two `routeMap` entries so the language picker crosses slugs |
| `src/components/proof-section.tsx` | `aiLink` + `webDevLink` collapse into a `deliverLinks` array |
| `src/pages/index.astro`, `src/pages/de-de/index.astro` | Pass `deliverLinks` including the new page |

---

### Task 1: i18n contract and copy

**Files:**
- Modify: `src/i18n/types.ts` (append `FaqItem` / `FaqContent` exports, add `productValidation` to `Strings`)
- Modify: `src/i18n/en-us.ts` (append `productValidation` before the closing `};`)
- Modify: `src/i18n/de-de.ts` (same position)

**Interfaces:**
- Consumes: nothing.
- Produces: `Strings['productValidation']` with the exact shape below, plus exported `FaqItem` and `FaqContent` interfaces. Tasks 2, 3, and 4 read from this shape. Every field name here is load-bearing.

- [ ] **Step 1: Add the type contract**

Append to `src/i18n/types.ts`, above `export interface Strings {`:

```ts
export interface FaqItem {
  question: string;
  /** One entry per rendered paragraph. */
  answer: string[];
}

export interface FaqContent {
  eyebrow: string;
  headline: string;
  items: FaqItem[];
}
```

Then add this block inside `Strings`, immediately after the `aiProcessAutomation` block and before the interface's closing brace:

```ts
  productValidation: {
    meta: {
      title: string;
      description: string;
    };
    hero: {
      eyebrow: string;
      headline: string;
      intro: string;
      supporting: string;
      /** Price and timeline, rendered as glass chips. */
      meta: string[];
      cta: string;
      secondaryCta: string;
    };
    whatThisIs: {
      eyebrow: string;
      headline: string;
      body: string[];
      capabilities: string[];
    };
    offer: {
      eyebrow: string;
      headline: string;
      name: string;
      price: string;
      description: string;
      includedLabel: string;
      included: string[];
      excludedLabel: string;
      excluded: string[];
      /** Timeline and pricing conditions, rendered as mono metadata. */
      meta: string[];
      legalNote: string;
      cta: string;
    };
    whyStartHere: {
      eyebrow: string;
      headline: string;
      intro: string;
      questionsLead: string;
      questions: string[];
      closing: string[];
    };
    situations: {
      eyebrow: string;
      headline: string;
      items: Array<{ title: string; body: string[] }>;
    };
    process: {
      eyebrow: string;
      headline: string;
      steps: Array<{ title: string; description: string[] }>;
    };
    differentiation: {
      eyebrow: string;
      headline: string;
      body: string[];
    };
    whatComesNext: {
      eyebrow: string;
      headline: string;
      intro: string[];
      items: Array<{ title: string; body: string }>;
      journey: string[];
      journeyNote: string;
      addOnsIntro: string;
      addOns: string[];
      addOnsNote: string;
    };
    faq: FaqContent;
    contact: {
      headline: string;
      intro: string;
    };
  };
```

- [ ] **Step 2: Run the type check and watch it fail**

Run: `bunx tsc --noEmit`
Expected: FAIL, twice. `src/i18n/en-us.ts` and `src/i18n/de-de.ts` both report
`Property 'productValidation' is missing in type ... but required in type 'Strings'`.

This is the red state. Both locale files are now provably out of contract.

- [ ] **Step 3: Add the English copy**

Append to `src/i18n/en-us.ts`, immediately before the final `};`:

```ts
  productValidation: {
    meta: {
      title: 'Product Validation for Startups — Sebastian Heitmann',
      description:
        'Test your product idea before committing to an MVP. Positioning, research, product website, lead capture and analytics in a fixed-price Product Validation Sprint.',
    },
    hero: {
      eyebrow: 'Product Validation',
      headline: 'Find out whether people want it before you build the whole thing.',
      intro:
        'Turn your product idea into a real market test: clear positioning, a professional product website, lead collection, and the infrastructure to measure whether people are interested.',
      supporting: 'Fixed-price product validation for startups and new digital products.',
      meta: ['From €4,900 net', '3–4 weeks'],
      cta: 'Discuss your product',
      secondaryCta: "See what's included",
    },
    whatThisIs: {
      eyebrow: 'What this is',
      headline: 'Put the idea in front of customers.',
      body: [
        'You do not need a finished product to find out whether your idea resonates.',
        'A Product Validation Sprint turns an early concept into something you can actually launch, share, advertise, and put in front of potential customers.',
        'Together, we work out what you are selling, who it is for, and why somebody should care. I then turn that into a complete product website designed to generate measurable interest.',
        'The result is not a mock-up sitting in Figma. It is a real website, running on your domain, ready for customers.',
      ],
      capabilities: [
        'Product positioning and value proposition',
        'Competitor and market research',
        'Website structure and messaging',
        'Custom visual design',
        'Responsive implementation',
        'Waitlist, signup, or lead capture',
        'Analytics and conversion tracking',
        'Technical SEO and social sharing setup',
        'Launch support',
      ],
    },
    offer: {
      eyebrow: 'The offer',
      headline: 'One package. A clear outcome.',
      name: 'Product Validation Sprint',
      price: 'From €4,900 net',
      description:
        'For founders and teams who have a product idea but do not yet need, or want, to commit to building the complete product.',
      includedLabel: 'Included',
      included: [
        'Initial product and positioning workshop',
        'Competitor and market review',
        'Definition of target users and core proposition',
        'Website concept and information architecture',
        'Copy development and refinement',
        'Custom visual design',
        'Responsive website development',
        'Lead, waitlist, or early-access form',
        'Analytics and conversion events',
        'Technical SEO fundamentals',
        'Social and Open Graph presentation',
        'Deployment and production setup',
        'Two structured revision rounds',
        'Source code handover',
      ],
      excludedLabel: 'Not included unless scoped separately',
      excluded: [
        'Full application or MVP development',
        'Paid advertising or media budget',
        'Ongoing performance marketing',
        'Large-scale customer research or participant recruitment',
        'Full corporate identity development',
        'Professional photography or video production',
        'Legal advice or preparation of legal documents',
      ],
      meta: ['Typical timeline: 3–4 weeks', 'Fixed price once scope is agreed'],
      legalNote:
        'Privacy, imprint, terms, and similar pages can be technically integrated when the appropriate texts are provided.',
      cta: 'Discuss your product',
    },
    whyStartHere: {
      eyebrow: 'Why start here',
      headline: 'An MVP is an expensive way to test a sentence.',
      intro:
        'A surprising amount can be learned before building dashboards, authentication, billing systems, APIs, and application logic.',
      questionsLead: 'The first questions are usually much simpler:',
      questions: [
        'Does the right person understand what this is?',
        'Does the problem matter enough to them?',
        'Does the proposition make them curious enough to act?',
      ],
      closing: [
        'A product website cannot prove that a company will succeed. But it can expose weak positioning, unclear audiences, lack of interest, and incorrect assumptions before those assumptions become software.',
        'That makes it useful whether the next step is development, fundraising, customer interviews, or deciding not to pursue the idea at all.',
      ],
    },
    situations: {
      eyebrow: 'When this makes sense',
      headline: 'Built for the stage before the big build.',
      items: [
        {
          title: 'You have an idea',
          body: [
            'You know what you want to create, but it still mostly exists in documents, conversations, or your head.',
            'We turn it into a proposition other people can understand and react to.',
          ],
        },
        {
          title: 'You are preparing an MVP',
          body: [
            'Before committing development budget, you want a public presence, early leads, and a clearer view of the market.',
            'The validation site becomes the first layer of the eventual product launch.',
          ],
        },
        {
          title: 'You are talking to investors or partners',
          body: [
            'You need something more convincing than a pitch deck but do not yet have a finished product.',
            'A real product presence gives the idea context and makes it easier to demonstrate.',
          ],
        },
        {
          title: 'You built something but cannot explain it',
          body: [
            'Sometimes the technology exists before the positioning does.',
            'We work backwards from the product and turn its capabilities into a proposition customers can understand.',
          ],
        },
      ],
    },
    process: {
      eyebrow: 'Process',
      headline: 'From idea to market in four steps.',
      steps: [
        {
          title: 'Understand',
          description: [
            'We start with the product, customer, problem, alternatives, and assumptions behind the idea.',
            'The goal is not to produce documentation. It is to identify what actually needs to be communicated and tested.',
          ],
        },
        {
          title: 'Position',
          description: [
            'I research the market and relevant competitors and turn what we learn into a clear proposition, page structure, messaging, and calls to action.',
            'At this point, we should be able to explain the product without explaining the technology behind it.',
          ],
        },
        {
          title: 'Build',
          description: [
            'I design and develop the complete website.',
            'No handover between strategist, designer, developer, and project manager. The concept stays connected to the implementation.',
          ],
        },
        {
          title: 'Launch and learn',
          description: [
            'The site goes live with lead capture and analytics in place.',
            'You can start sending prospects, communities, investors, campaigns, or early customers to it and see what happens.',
          ],
        },
      ],
    },
    differentiation: {
      eyebrow: 'More than landing-page development',
      headline: 'The website is the experiment. Not the product being sold.',
      body: [
        'There are plenty of people who can build a landing page.',
        'The more important work happens before that: determining what the page should say, whom it should convince, and what response would actually tell you something useful.',
        'My background combines software development, product and project work, technical consulting, UX methods, and AI-supported execution.',
        'That means I can work on the proposition without losing sight of what would eventually have to be built behind it.',
        'And if the validation works, the project does not have to stop at the website.',
      ],
    },
    whatComesNext: {
      eyebrow: 'What can come next',
      headline: 'Validate first. Build when there is a reason to.',
      intro: [
        'The Product Validation Sprint is designed to stand on its own.',
        'But it can become the first stage of a larger product engagement.',
      ],
      items: [
        {
          title: 'Interactive prototype',
          body: 'For concepts that need more than static screens, selected interactions or a realistic product prototype can be built.',
        },
        {
          title: 'MVP definition',
          body: 'Turn what was learned during validation into priorities, requirements, technical decisions, and a realistic first product scope.',
        },
        {
          title: 'MVP development',
          body: 'If there is enough evidence to proceed, the project can move from proposition into working software.',
        },
      ],
      journey: ['Product idea', 'Validation', 'Prototype', 'MVP', 'Product'],
      journeyNote: 'You do not need to commit to that entire path upfront.',
      addOnsIntro: 'Depending on the product, the validation sprint can be extended with:',
      addOns: [
        'Interactive product prototype',
        'Fake-door or simulated product flows',
        'Additional landing-page variants',
        'A/B testing',
        'Newsletter or CRM integration',
        'Booking or demo flows',
        'Founder and customer interview support',
        'Additional market research',
        'Brand identity development',
        'Product architecture and MVP scoping',
      ],
      addOnsNote: 'These are scoped separately because not every product needs them.',
    },
    faq: {
      eyebrow: 'Questions',
      headline: 'Common questions',
      items: [
        {
          question: 'Do I need to have a finished product?',
          answer: [
            'No. That is precisely the point.',
            'The service works best when there is already a reasonably concrete product idea, but substantial development has not yet taken place.',
          ],
        },
        {
          question: 'Is this just a landing page?',
          answer: [
            'No. The landing page is one deliverable.',
            'The engagement includes the work required to determine what it should communicate: positioning, market context, proposition, structure, messaging, design, implementation, and measurement.',
          ],
        },
        {
          question: 'Can you guarantee that this validates my idea?',
          answer: [
            'No. Validation is evidence, not certainty.',
            'A website can help measure interest and test assumptions, but lack of signups can have many causes: proposition, audience, traffic source, pricing, timing, or the idea itself.',
            'The purpose is to learn more cheaply than by immediately building the complete product.',
          ],
        },
        {
          question: 'Do you also build the MVP?',
          answer: [
            'Yes, when that makes sense.',
            'MVP development is a separate engagement because its scope depends heavily on what is being built. The validation sprint can be used to define that scope.',
          ],
        },
        {
          question: 'What technology do you use?',
          answer: [
            'I generally build lightweight, fast websites using modern web technologies rather than locking the project into a visual website builder.',
            'You receive the source code and can continue working with me or another developer.',
          ],
        },
        {
          question: 'Can I use the website for fundraising?',
          answer: [
            'Yes.',
            'The site can serve simultaneously as your public product presence, validation channel, and something concrete to show investors, partners, and early customers.',
          ],
        },
        {
          question: 'Why €4,900 when I can get a landing page much cheaper?',
          answer: [
            'Because you can.',
            'If you already know exactly what the product is, exactly how it should be positioned, have finished copy and design, and only need somebody to implement a page, this is probably the wrong service.',
            'This engagement is for the stage where those questions still need to be resolved.',
          ],
        },
      ],
    },
    contact: {
      headline: 'Put your idea in front of the market.',
      intro:
        'Tell me what you are thinking about building, where you currently are, and what you want to learn before committing to the full product.',
    },
  },
```

- [ ] **Step 4: Re-run the type check**

Run: `bunx tsc --noEmit`
Expected: still FAIL, but only once now, for `src/i18n/de-de.ts`. If `en-us.ts` still errors, a key name or nesting level is wrong; fix it against the contract in Step 1 before continuing.

- [ ] **Step 5: Add the German copy**

Append the same block to `src/i18n/de-de.ts`, immediately before the final `};`, translated. Rules:

- **Structural contract:** identical key names, identical array lengths, identical paragraph splits. If the English `body` has four entries, German has four entries.
- **Register:** match the existing `aiProcessAutomation` German copy in this file. Formal *Sie*, plain declarative sentences, no exclamation marks, no anglicised marketing filler.
- **Locked terms**, use exactly:

| English | German |
|---|---|
| Product Validation Sprint (`offer.name`) | Product Validation Sprint |
| `From €4,900 net` | `ab 4.900 € netto` |
| `3–4 weeks` | `3–4 Wochen` |
| `Typical timeline: 3–4 weeks` | `Typischer Zeitraum: 3–4 Wochen` |
| `Fixed price once scope is agreed` | `Festpreis nach Abstimmung des Leistungsumfangs` |
| `Product Validation` (hero eyebrow) | `Produktvalidierung` |
| `Discuss your product` | `Über Ihr Produkt sprechen` |
| `See what's included` | `Leistungsumfang ansehen` |
| `Included` | `Enthalten` |
| `Not included unless scoped separately` | `Nicht enthalten, sofern nicht separat beauftragt` |
| `Questions` / `Common questions` | `Fragen` / `Häufige Fragen` |
| journey chips | `Produktidee`, `Validierung`, `Prototyp`, `MVP`, `Produkt` |
| meta title | `Produktvalidierung für Startups — Sebastian Heitmann` |

- **Claims discipline applies to German too.** No `Nachfrage beweisen`, no `Product-Market-Fit garantieren`. Use `Annahmen testen`, `Belege sammeln`, `Interesse messen`, `Unsicherheit reduzieren`.
- Keep `MVP`, `Startup`, `Prototyp`, `Open Graph`, and `A/B-Testing` untranslated; they are standard in German product writing.

- [ ] **Step 6: Run the type check and the build**

Run: `bunx tsc --noEmit`
Expected: PASS, exit 0, no output.

Run: `bun run build`
Expected: `35 page(s) built`, `Complete!`. Route count is unchanged because no page consumes the strings yet.

- [ ] **Step 7: Commit**

```bash
git add src/i18n/types.ts src/i18n/en-us.ts src/i18n/de-de.ts
git commit -m "feat(website): add product validation i18n contract and copy"
```

---

### Task 2: Page shells and the first three sections

Delivers a reachable page whose hero and price block are complete. This is the commercially load-bearing part, so it gets its own review gate.

**Files:**
- Create: `src/components/product-validation-content.tsx`
- Create: `src/pages/product-validation.astro`
- Create: `src/pages/de-de/produkt-validierung.astro`

**Interfaces:**
- Consumes: `Strings['productValidation']` from Task 1.
- Produces: `ProductValidationContent` (named export) taking `{ content: Strings['productValidation'] }`, and the local helpers `Eyebrow`, `CtaLink`, `JumpLink`, `ChipRow`, `CornerMarks`, `RuledList`, plus the `sectionBase` and `glassCard` class constants. Tasks 3 and 4 add sections to this same file and reuse these helpers verbatim.

- [ ] **Step 1: Create the content component with helpers and sections 1 to 3**

Create `src/components/product-validation-content.tsx`:

```tsx
import { Fragment, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { DotRule } from './dot-rule';
import type { Strings } from '@/i18n/types';

export interface ProductValidationContentProps {
  content: Strings['productValidation'];
}

const contactUrl = '#contact';

// Uniform section padding — the site-wide `sectionBase` rhythm, lifted from
// ai-process-automation-content.tsx. This page is unbanded: every section keeps
// the ambient page background, so there is no "first section of a band" variant.
const sectionBase = 'px-6 pt-10 pb-10 md:px-12 md:pt-[60px] md:pb-[60px] lg:px-20 lg:pt-20 lg:pb-20';

// Shared glass-card tokens (the `--v8-glass-*` custom properties).
const glassCard =
  'bg-[var(--v8-glass-bg)] shadow-[0_1px_0_var(--v8-glass-highlight)_inset,0_24px_60px_-36px_rgba(0,0,0,0.25)] backdrop-blur-[12px] backdrop-saturate-[1.4]';

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="mb-8 flex items-center gap-6">
      <span className="shrink-0 font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
        {children}
      </span>
      <DotRule />
    </div>
  );
}

function CtaLink({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a
      href={href}
      className={cn(
        'group inline-flex items-center gap-3 self-start border-b border-primary py-4 no-underline transition-[gap] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:gap-5',
        className,
      )}
    >
      <span className="font-mono text-xs tracking-[0.08em] text-foreground uppercase">{children}</span>
      <span className="text-base text-primary transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1">
        &rarr;
      </span>
    </a>
  );
}

// In-page jump, matching the "details" link on the AI page's offering cards.
function JumpLink({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a
      href={href}
      className={cn(
        'group inline-flex items-center gap-2.5 self-start font-mono text-[10px] tracking-[0.08em] text-primary uppercase no-underline transition-[gap] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:gap-4',
        className,
      )}
    >
      <span>{children}</span>
      <span className="text-[13px] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-[3px]">
        &darr;
      </span>
    </a>
  );
}

// Glass chips. `connected` draws the dotted run between items (used for the
// journey line); without it the chips are a plain meta row (used in the hero).
function ChipRow({ items, connected = false, className = '' }: { items: string[]; connected?: boolean; className?: string }) {
  return (
    <div role="list" className={cn('flex flex-wrap items-center gap-2 md:gap-3', className)}>
      {items.map((label, i) => (
        <Fragment key={label}>
          {connected && i > 0 && (
            <span
              aria-hidden="true"
              className="h-2 w-4 shrink-0 bg-left bg-repeat-x opacity-85 md:w-7"
              style={{
                backgroundImage: 'radial-gradient(circle, var(--v8-text-muted) 0.85px, transparent 1.4px)',
                backgroundSize: '6px 8px',
              }}
            />
          )}
          <span
            role="listitem"
            className="border border-[var(--v8-glass-border)] bg-[var(--v8-glass-bg)] px-3 py-2 font-mono text-[11px] tracking-[0.08em] whitespace-normal text-text-secondary uppercase shadow-[0_1px_0_var(--v8-glass-highlight)_inset] backdrop-blur-[12px] backdrop-saturate-[1.4] md:px-4 md:py-2.5 md:whitespace-nowrap"
          >
            {label}
          </span>
        </Fragment>
      ))}
    </div>
  );
}

// Two opposing corner ticks, the AI page's card framing.
function CornerMarks({ accent = false }: { accent?: boolean }) {
  const tone = accent ? 'text-primary' : 'text-text-faint';
  return (
    <>
      <span aria-hidden="true" className={cn('pointer-events-none absolute top-2 left-2 h-3 w-3 border-t border-l', tone)} />
      <span aria-hidden="true" className={cn('pointer-events-none absolute right-2 bottom-2 h-3 w-3 border-r border-b', tone)} />
    </>
  );
}

// Bordered-row list, used for included/excluded scope and any enumerated set.
function RuledList({ items }: { items: string[] }) {
  return (
    <ul className="flex list-none flex-col gap-0 p-0">
      {items.map((item) => (
        <li
          key={item}
          className="border-b border-border py-3 font-sans text-[15px] leading-[1.6] font-light text-text-secondary first:border-t"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

export function ProductValidationContent({ content }: ProductValidationContentProps) {
  return (
    <>
      {/* 1. Hero — unbanded, follows the page's ambient theme */}
      <section className="reveal px-6 pt-[120px] pb-10 md:px-12 md:pt-[140px] md:pb-[60px] lg:px-20 lg:pt-[160px] lg:pb-20">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6">
          <span className="mb-2 font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
            {content.hero.eyebrow}
          </span>
          <h1 className="font-display text-[clamp(40px,6vw,72px)] leading-[1.05] tracking-[-0.02em] text-foreground italic">
            {content.hero.headline}
          </h1>
          <p className="max-w-[640px] font-sans text-xl leading-[1.65] font-light text-text-secondary">
            {content.hero.intro}
          </p>
          <p className="max-w-[640px] font-sans text-[17px] leading-[1.65] font-light text-text-tertiary">
            {content.hero.supporting}
          </p>
          <ChipRow items={content.hero.meta} className="mt-4" />
          <div className="mt-8 flex flex-col items-start gap-4 md:flex-row md:items-center md:gap-10">
            <CtaLink href={contactUrl}>{content.hero.cta}</CtaLink>
            <JumpLink href="#package">{content.hero.secondaryCta}</JumpLink>
          </div>
        </div>
      </section>

      {/* 2. What this is */}
      <section className="reveal">
        <div className={`mx-auto max-w-[1440px] ${sectionBase}`}>
          <Eyebrow>{content.whatThisIs.eyebrow}</Eyebrow>
          <h2 className="mb-8 font-display text-[clamp(32px,4vw,48px)] leading-[1.1] tracking-[-0.01em] text-foreground">
            {content.whatThisIs.headline}
          </h2>
          <div className="mb-10 max-w-[640px]">
            {content.whatThisIs.body.map((p) => (
              <p key={p} className="mb-5 font-sans text-[17px] leading-[1.65] font-light text-text-secondary last:mb-0">
                {p}
              </p>
            ))}
          </div>
          <ul className="grid grid-cols-1 gap-0 p-0 lg:grid-cols-2 lg:gap-x-12">
            {content.whatThisIs.capabilities.map((item) => (
              <li
                key={item}
                className="relative border-b border-border py-2.5 pl-[22px] font-mono text-xs leading-[1.5] tracking-[0.04em] text-text-secondary transition-colors hover:text-foreground"
              >
                <span aria-hidden="true" className="absolute top-2.5 left-0 text-[10px] text-primary">
                  ✱
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. Offer — single corner-framed package card with scope boundaries */}
      <section className="reveal" id="package">
        <div className={`mx-auto max-w-[1440px] ${sectionBase} scroll-mt-[100px]`}>
          <Eyebrow>{content.offer.eyebrow}</Eyebrow>
          <h2 className="mb-8 font-display text-[clamp(32px,4vw,48px)] leading-[1.1] tracking-[-0.01em] text-foreground">
            {content.offer.headline}
          </h2>
          <div className={cn('relative flex flex-col border border-border-accent py-7 px-6 md:py-11 md:px-10', glassCard)}>
            <CornerMarks accent />
            <div className="mb-7 flex flex-wrap items-baseline gap-3 border-b border-border pb-5 md:flex-nowrap md:gap-5">
              <h3 className="font-display text-[clamp(26px,2.4vw,32px)] leading-[1.1] text-foreground italic">
                {content.offer.name}
              </h3>
              <span className="ml-auto font-mono text-sm tracking-[0.04em] text-primary">{content.offer.price}</span>
            </div>
            <p className="mb-9 max-w-[640px] font-sans text-lg leading-[1.65] font-light text-text-secondary">
              {content.offer.description}
            </p>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12">
              <div className="flex flex-col">
                <h4 className="mb-5 font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
                  {content.offer.includedLabel}
                </h4>
                <RuledList items={content.offer.included} />
              </div>
              <div className="flex flex-col">
                <h4 className="mb-5 font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
                  {content.offer.excludedLabel}
                </h4>
                <RuledList items={content.offer.excluded} />
              </div>
            </div>
            <ChipRow items={content.offer.meta} className="mt-9" />
            <p className="mt-7 max-w-[640px] font-sans text-sm leading-[1.6] font-light text-muted-foreground italic">
              {content.offer.legalNote}
            </p>
            <CtaLink href={contactUrl} className="mt-6">
              {content.offer.cta}
            </CtaLink>
          </div>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Create the English route**

Create `src/pages/product-validation.astro`. This mirrors `src/pages/ai-process-automation.astro` line for line:

```astro
---
import Layout from '../layouts/Layout.astro';
import { getRelativeLocaleUrl } from 'astro:i18n';
import { Navigation } from '../components/navigation';
import ThemeToggle from '@/components/theme-toggle.astro';
import { ProductValidationContent } from '../components/product-validation-content';
import { ContactSection } from '../components/contact-section';
import ContactForm from '@/components/contact-form.astro';
import { Footer } from '../components/footer';
import { getStrings, getHreflangAlternates } from '../i18n/utils';
import type { Locale } from '../i18n/utils';

const locale = Astro.currentLocale as Locale;
const s = getStrings(locale);
const mailEndpoint = import.meta.env.PUBLIC_MAIL_ENDPOINT || '';
const contact = { ...s.contact, headline: s.productValidation.contact.headline, intro: s.productValidation.contact.intro };

const alternates = getHreflangAlternates('/product-validation', '/de-de/produkt-validierung');
---
<Layout
    locale={locale}
    title={s.productValidation.meta.title}
    description={s.productValidation.meta.description}
    alternates={alternates}
>
    <Navigation nav={s.nav} languagePicker={s.languagePicker} locale={locale} currentPath={Astro.url.pathname}>
        <ThemeToggle labels={s.nav.themeToggle} />
    </Navigation>
    <main>
        <ProductValidationContent content={s.productValidation} />
        <ContactSection contact={contact}>
            <ContactForm strings={contact} endpoint={mailEndpoint} />
        </ContactSection>
    </main>
    <Footer footer={s.footer} privacyHref={getRelativeLocaleUrl(locale, 'privacy')} imprintHref={getRelativeLocaleUrl(locale, 'imprint')} />
</Layout>
```

- [ ] **Step 3: Create the German route**

Create `src/pages/de-de/produkt-validierung.astro` with identical content to Step 2, except the relative import depth (`../../` instead of `../`) for `Layout`, `Navigation`, `ProductValidationContent`, `ContactSection`, `Footer`, and `i18n/utils`. The `@/`-prefixed imports (`theme-toggle.astro`, `contact-form.astro`) stay unchanged. Compare against `src/pages/de-de/ki-prozess-automation.astro` to confirm the depth convention.

- [ ] **Step 4: Type check and build**

Run: `bunx tsc --noEmit`
Expected: PASS, exit 0.

Run: `bun run build`
Expected: `37 page(s) built`, `Complete!`. If it still says 35, the new `.astro` files are not where Astro expects them.

- [ ] **Step 5: Verify in the browser**

Start the dev server if it is not running: `bun run dev` (Astro 7 daemonizes; check with `bunx astro dev status`).

Visit `http://localhost:4321/product-validation` and `http://localhost:4321/de-de/produkt-validierung`. Confirm:
- The hero fits above the fold at 1440x900 with the headline, intro, both chips, and both CTAs visible.
- `From €4,900 net` and `3–4 weeks` are both readable.
- "See what's included" scrolls to the package card and the card is not hidden behind the sticky nav.
- The package card shows both the Included and the Not-included columns side by side at desktop width and stacked at 375px.

- [ ] **Step 6: Commit**

```bash
git add src/components/product-validation-content.tsx src/pages/product-validation.astro src/pages/de-de/produkt-validierung.astro
git commit -m "feat(website): add product validation page shell, hero, and offer"
```

---

### Task 3: Sections 4 to 8

**Files:**
- Modify: `src/components/product-validation-content.tsx` (append five sections inside the returned fragment, after the offer section)

**Interfaces:**
- Consumes: `sectionBase`, `glassCard`, `Eyebrow`, `CtaLink`, `ChipRow`, `CornerMarks` from Task 2; `content.whyStartHere`, `content.situations`, `content.process`, `content.differentiation`, `content.whatComesNext` from Task 1.
- Produces: a local `VerticalDotRule` component and `DotBulletList`, both used only within this file.

- [ ] **Step 1: Add the two remaining local helpers**

Insert above `export function ProductValidationContent`:

```tsx
// Vertical dotted spine for the process steps; horizontal counterpart is `DotRule`.
function VerticalDotRule() {
  return (
    <span
      aria-hidden="true"
      className="absolute top-4 bottom-4 left-[3px] w-2 bg-repeat-y opacity-85"
      style={{
        backgroundImage: 'radial-gradient(circle, var(--v8-text-muted) 0.85px, transparent 1.4px)',
        backgroundSize: '8px 6px',
        backgroundPosition: '50% 0',
      }}
    />
  );
}

// Emphasis list with the accent dot marker.
function DotBulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex list-none flex-col gap-0 p-0">
      {items.map((item, i) => (
        <li
          key={item}
          className="group relative border-b border-border py-6 pl-8 font-sans text-xl leading-[1.6] font-light text-text-tertiary transition-colors duration-300 first:border-t hover:text-foreground"
          style={{ transitionDelay: `${i * 0.06}s` }}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-0 h-2 w-2 -translate-y-1/2 rounded-full bg-primary transition-transform duration-300 group-hover:scale-[1.3]"
          />
          {item}
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 2: Append sections 4 to 8**

Insert immediately after the closing `</section>` of the offer block, still inside the fragment:

```tsx
      {/* 4. Why start here */}
      <section className="reveal">
        <div className={`mx-auto max-w-[1440px] ${sectionBase}`}>
          <Eyebrow>{content.whyStartHere.eyebrow}</Eyebrow>
          <h2 className="mb-8 font-display text-[clamp(32px,4vw,48px)] leading-[1.1] tracking-[-0.01em] text-foreground">
            {content.whyStartHere.headline}
          </h2>
          <p className="mb-6 max-w-[640px] font-sans text-xl leading-[1.65] font-light text-text-secondary">
            {content.whyStartHere.intro}
          </p>
          <p className="mb-8 max-w-[640px] font-sans text-[17px] leading-[1.65] font-light text-text-tertiary">
            {content.whyStartHere.questionsLead}
          </p>
          <DotBulletList items={content.whyStartHere.questions} />
          <div className="mt-10 max-w-[640px]">
            {content.whyStartHere.closing.map((p) => (
              <p key={p} className="mb-5 font-sans text-[17px] leading-[1.65] font-light text-text-secondary last:mb-0">
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* 5. When this makes sense — 2x2 situation cards */}
      <section className="reveal">
        <div className={`mx-auto max-w-[1440px] ${sectionBase}`}>
          <Eyebrow>{content.situations.eyebrow}</Eyebrow>
          <h2 className="mb-8 font-display text-[clamp(32px,4vw,48px)] leading-[1.1] tracking-[-0.01em] text-foreground">
            {content.situations.headline}
          </h2>
          <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:gap-x-4 lg:gap-y-7">
            {content.situations.items.map((item) => (
              <article
                key={item.title}
                className={cn(
                  'relative flex flex-col gap-5 border border-[var(--v8-glass-border)] py-7 px-6 transition-colors duration-300 hover:border-muted-foreground md:gap-6 md:py-9 md:px-8',
                  glassCard,
                )}
              >
                <CornerMarks />
                <h3 className="font-display text-[clamp(22px,2.2vw,28px)] leading-[1.15] text-foreground italic">
                  {item.title}
                </h3>
                <div>
                  {item.body.map((p) => (
                    <p key={p} className="mb-4 font-sans text-base leading-[1.65] font-light text-text-secondary last:mb-0">
                      {p}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Process — dotted spine */}
      <section className="reveal">
        <div className={`mx-auto max-w-[1440px] ${sectionBase}`}>
          <Eyebrow>{content.process.eyebrow}</Eyebrow>
          <h2 className="mb-8 font-display text-[clamp(32px,4vw,48px)] leading-[1.1] tracking-[-0.01em] text-foreground">
            {content.process.headline}
          </h2>
          <ol className="relative flex flex-col gap-2 pl-7 md:pl-9">
            <VerticalDotRule />
            {content.process.steps.map((step, i) => (
              <li key={step.title} className="relative grid grid-cols-[36px_1fr] gap-4 py-5 md:grid-cols-[48px_1fr] md:gap-6">
                <span
                  aria-hidden="true"
                  className="absolute top-[27px] left-[-25px] h-2 w-2 rounded-full bg-primary md:left-[-33px]"
                />
                <span className="pt-1.5 font-mono text-xs tracking-[0.14em] text-primary">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="max-w-[640px]">
                  <h3 className="mb-2 font-display text-[clamp(20px,2.2vw,26px)] leading-[1.2] text-foreground italic">
                    {step.title}
                  </h3>
                  {step.description.map((p) => (
                    <p key={p} className="mb-4 font-sans text-base leading-[1.65] font-light text-text-secondary last:mb-0">
                      {p}
                    </p>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 7. Differentiation */}
      <section className="reveal">
        <div className={`mx-auto max-w-[1440px] ${sectionBase}`}>
          <Eyebrow>{content.differentiation.eyebrow}</Eyebrow>
          <h2 className="mb-8 font-display text-[clamp(32px,4vw,48px)] leading-[1.1] tracking-[-0.01em] text-foreground">
            {content.differentiation.headline}
          </h2>
          <div className="max-w-[640px]">
            {content.differentiation.body.map((p) => (
              <p key={p} className="mb-5 font-sans text-[17px] leading-[1.65] font-light text-text-secondary last:mb-0">
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* 8. What comes next — follow-on cards, journey line, optional add-ons */}
      <section className="reveal">
        <div className={`mx-auto max-w-[1440px] ${sectionBase}`}>
          <Eyebrow>{content.whatComesNext.eyebrow}</Eyebrow>
          <h2 className="mb-8 font-display text-[clamp(32px,4vw,48px)] leading-[1.1] tracking-[-0.01em] text-foreground">
            {content.whatComesNext.headline}
          </h2>
          <div className="mb-10 max-w-[640px]">
            {content.whatComesNext.intro.map((p) => (
              <p key={p} className="mb-5 font-sans text-xl leading-[1.65] font-light text-text-secondary last:mb-0">
                {p}
              </p>
            ))}
          </div>
          <div className="mb-12 flex flex-col gap-6 lg:grid lg:grid-cols-3 lg:gap-x-4">
            {content.whatComesNext.items.map((item) => (
              <article
                key={item.title}
                className={cn(
                  'relative flex flex-col gap-4 border border-[var(--v8-glass-border)] py-7 px-6 transition-colors duration-300 hover:border-muted-foreground md:py-9 md:px-8',
                  glassCard,
                )}
              >
                <CornerMarks />
                <h3 className="font-display text-[clamp(20px,2vw,24px)] leading-[1.15] text-foreground italic">
                  {item.title}
                </h3>
                <p className="font-sans text-base leading-[1.65] font-light text-text-secondary">{item.body}</p>
              </article>
            ))}
          </div>
          <ChipRow items={content.whatComesNext.journey} connected className="mb-6" />
          <p className="mb-12 max-w-[640px] font-sans text-[17px] leading-[1.65] font-light text-text-secondary">
            {content.whatComesNext.journeyNote}
          </p>
          <p className="mb-6 max-w-[640px] font-sans text-[17px] leading-[1.65] font-light text-text-secondary">
            {content.whatComesNext.addOnsIntro}
          </p>
          <ul className="mb-8 flex max-w-[900px] list-none flex-wrap gap-2.5 p-0">
            {content.whatComesNext.addOns.map((item) => (
              <li
                key={item}
                className="border border-border px-4 py-2.5 font-mono text-xs tracking-[0.04em] text-text-secondary transition-colors hover:border-muted-foreground hover:text-foreground"
              >
                {item}
              </li>
            ))}
          </ul>
          <p className="max-w-[640px] font-sans text-[17px] leading-[1.65] font-light text-muted-foreground italic">
            {content.whatComesNext.addOnsNote}
          </p>
        </div>
      </section>
```

- [ ] **Step 3: Type check and build**

Run: `bunx tsc --noEmit`
Expected: PASS, exit 0.

Run: `bun run build`
Expected: `37 page(s) built`, `Complete!`.

- [ ] **Step 4: Verify in the browser**

At `http://localhost:4321/product-validation`, confirm:
- The four situation cards form a 2x2 grid at 1440 and stack at 375.
- The process spine renders one dot per step, aligned with each step's number.
- The journey chips read `Product idea → Validation → Prototype → MVP → Product` with dotted connectors, and wrap without overflowing at 375.
- Nothing scrolls horizontally at 375.

- [ ] **Step 5: Commit**

```bash
git add src/components/product-validation-content.tsx
git commit -m "feat(website): add product validation rationale, process, and next steps"
```

---

### Task 4: FaqSection component and the FAQ block

**Files:**
- Create: `src/components/faq-section.tsx`
- Modify: `src/components/product-validation-content.tsx` (import and render it as the ninth section)

**Interfaces:**
- Consumes: `FaqContent` from Task 1.
- Produces: `FaqSection` (named export) taking `{ faq: FaqContent }`. Written generically so the other three offer pages can adopt it later.

- [ ] **Step 1: Create the component**

Create `src/components/faq-section.tsx`:

```tsx
import { DotRule } from './dot-rule';
import type { FaqContent } from '@/i18n/types';

export interface FaqSectionProps {
  faq: FaqContent;
}

// Native <details>/<summary>. The disclosure state is exposed to assistive tech
// and operated by keyboard for free, which is the only option consistent with
// the project rule that no React ships to the client — there is no `client:*`
// directive anywhere in this codebase and this component must not need one.
export function FaqSection({ faq }: FaqSectionProps) {
  return (
    <section className="reveal">
      <div className="mx-auto max-w-[1440px] px-6 pt-10 pb-10 md:px-12 md:pt-[60px] md:pb-[60px] lg:px-20 lg:pt-20 lg:pb-20">
        <div className="mb-8 flex items-center gap-6">
          <span className="shrink-0 font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
            {faq.eyebrow}
          </span>
          <DotRule />
        </div>
        <h2 className="mb-8 font-display text-[clamp(32px,4vw,48px)] leading-[1.1] tracking-[-0.01em] text-foreground">
          {faq.headline}
        </h2>
        <div className="max-w-[900px]">
          {faq.items.map((item) => (
            <details
              key={item.question}
              className="group border-b border-border first:border-t"
            >
              <summary className="flex cursor-pointer list-none items-start gap-4 py-5 font-sans text-lg leading-[1.5] font-light text-text-secondary transition-colors hover:text-foreground [&::-webkit-details-marker]:hidden">
                <span
                  aria-hidden="true"
                  className="mt-1 shrink-0 text-xs text-primary transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-open:rotate-45"
                >
                  ✱
                </span>
                <span className="group-open:text-foreground">{item.question}</span>
              </summary>
              <div className="max-w-[640px] pb-6 pl-8">
                {item.answer.map((p) => (
                  <p key={p} className="mb-4 font-sans text-base leading-[1.65] font-light text-text-tertiary last:mb-0">
                    {p}
                  </p>
                ))}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Render it as the ninth section**

In `src/components/product-validation-content.tsx`, add to the imports:

```tsx
import { FaqSection } from './faq-section';
```

and insert immediately after the closing `</section>` of the "what comes next" block, as the last element in the fragment:

```tsx
      {/* 9. FAQ */}
      <FaqSection faq={content.faq} />
```

- [ ] **Step 3: Type check and build**

Run: `bunx tsc --noEmit`
Expected: PASS, exit 0.

Run: `bun run build`
Expected: `37 page(s) built`, `Complete!`.

- [ ] **Step 4: Verify behaviour and semantics**

At `http://localhost:4321/product-validation`:
- All seven questions are visible, all answers collapsed on load.
- Clicking a question opens it; the `✱` marker rotates.
- **Keyboard:** Tab reaches each summary, Enter and Space both toggle it.
- **No JavaScript required:** confirm the built output ships none by running
  `grep -rl "faq" dist/_astro/*.js` and expecting no match, and that
  `dist/product-validation/index.html` contains `<details` and `<summary`.

- [ ] **Step 5: Commit**

```bash
git add src/components/faq-section.tsx src/components/product-validation-content.tsx
git commit -m "feat(website): add reusable faq section and product validation faq"
```

---

### Task 5: Navigation, homepage entry point, and the ProofSection refactor

**Files:**
- Modify: `src/components/navigation.tsx` (two `routeMap` entries)
- Modify: `src/components/proof-section.tsx:7-9, 19, 117-140` (collapse `aiLink` + `webDevLink` into `deliverLinks`)
- Modify: `src/pages/index.astro:84`, `src/pages/de-de/index.astro:91`

**Interfaces:**
- Consumes: the routes created in Task 2.
- Produces: `ProofSectionProps.deliverLinks?: Array<{ label: string; href: string }>`, replacing `aiLink` and `webDevLink`. `tpmLink` is unchanged.

- [ ] **Step 1: Add the routeMap entries**

In `src/components/navigation.tsx`, add to the `routeMap` object, after the `ki-prozess-automation` entry:

```ts
  '/product-validation': {
    'en-us': '/product-validation',
    'de-de': '/produkt-validierung',
  },
  '/produkt-validierung': {
    'en-us': '/product-validation',
    'de-de': '/produkt-validierung',
  },
```

- [ ] **Step 2: Refactor ProofSection to a link array**

In `src/components/proof-section.tsx`, replace the two props in `ProofSectionProps`:

```ts
  webDevLink?: { label: string; href: string };
  tpmLink?: { label: string; href: string };
  aiLink?: { label: string; href: string };
```

with:

```ts
  tpmLink?: { label: string; href: string };
  /** Links shown on the featured "Deliver" card, in order. */
  deliverLinks?: Array<{ label: string; href: string }>;
```

Update the signature to `export function ProofSection({ proof, tpmLink, deliverLinks }: ProofSectionProps) {`.

Then replace both the `{e.featured && aiLink && (...)}` and `{e.featured && webDevLink && (...)}` blocks with one mapped block:

```tsx
                {e.featured &&
                  deliverLinks?.map((link, li) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className={`group inline-flex items-center gap-2.5 font-mono text-[10px] tracking-[0.08em] text-primary uppercase no-underline transition-[gap] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:gap-4 ${
                        li === 0 ? 'mt-auto border-t border-border pt-4' : 'pt-3'
                      }`}
                    >
                      <span>{link.label}</span>
                      <span className="text-[13px] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[3px]">
                        &rarr;
                      </span>
                    </a>
                  ))}
```

The first link keeps `mt-auto border-t border-border pt-4` and the rest get `pt-3`, which reproduces the current markup exactly for the two existing links.

- [ ] **Step 3: Observe the regression before fixing it**

Run: `bun run build`, then load `http://localhost:4321/`.
Expected: the build **succeeds** and the two existing links **disappear** from the featured Deliver card.

This is the red state, and it is a silent one. `tsc` does not parse `.astro` files and the Astro compiler strips prop types rather than checking them, so nothing fails loudly: `index.astro` still passes `aiLink` and `webDevLink`, which the component now ignores. Confirm the links are gone with your own eyes before Step 4, so you know Step 6's check is actually testing something.

- [ ] **Step 4: Update both homepage call sites**

In `src/pages/index.astro` line 84, replace the `ProofSection` invocation with:

```astro
        <ProofSection proof={s.proof} tpmLink={{ label: 'Technical project management', href: '/technical-project-management' }} deliverLinks={[
            { label: 'AI-powered products & processes', href: '/ai-process-automation' },
            { label: 'Web development for local businesses', href: '/web-development' },
            { label: 'Product validation for startups', href: '/product-validation' },
        ]} />
```

In `src/pages/de-de/index.astro` line 91:

```astro
        <ProofSection proof={s.proof} tpmLink={{ label: 'Technisches Projektmanagement', href: '/de-de/technisches-projektmanagement' }} deliverLinks={[
            { label: 'KI-gestützte Produkte & Prozesse', href: '/de-de/ki-prozess-automation' },
            { label: 'Webentwicklung für lokale Unternehmen', href: '/de-de/web-entwicklung' },
            { label: 'Produktvalidierung für Startups', href: '/de-de/produkt-validierung' },
        ]} />
```

Link order is deliberate: the two pre-existing links keep their current positions, so the visual diff on the homepage is one added row.

- [ ] **Step 5: Type check and build**

Run: `bunx tsc --noEmit`
Expected: PASS, exit 0.

Run: `bun run build`
Expected: `37 page(s) built`, `Complete!`.

- [ ] **Step 6: Verify the wiring**

- On `http://localhost:4321/`, the featured Deliver card shows three links, the first two unchanged in position and styling, the third being "Product validation for startups". The first has a top border, the others do not.
- The same on `http://localhost:4321/de-de/`.
- On `/product-validation`, click DE in the language picker: it lands on `/de-de/produkt-validierung`, not the German homepage. Click EN: back to `/product-validation`.
- View source on `/product-validation` and confirm three `<link rel="alternate" hreflang=...>` tags pointing at the absolute trailing-slash URLs for `en`, `de-DE`, and `x-default`.

- [ ] **Step 7: Commit**

```bash
git add src/components/navigation.tsx src/components/proof-section.tsx src/pages/index.astro src/pages/de-de/index.astro
git commit -m "feat(website): link product validation from nav routing and the homepage"
```

---

### Task 6: Full verification pass and pull request

**Files:**
- Modify: any file needing a fix found during verification

**Interfaces:**
- Consumes: everything from Tasks 1 to 5.
- Produces: a pushed branch and an open pull request.

- [ ] **Step 1: Clean build from scratch**

```bash
rm -rf dist
bunx tsc --noEmit && bun run build
```
Expected: type check exit 0, `37 page(s) built`, `Complete!`.

- [ ] **Step 2: Visual pass**

Using Chrome DevTools, screenshot `/product-validation` and `/de-de/produkt-validierung` at 1440, 768, and 375 in **both** light and dark themes (12 screenshots). Check each for:
- No horizontal scrolling at any width.
- Section padding rhythm consistent with `/ai-process-automation` viewed side by side.
- Glass cards legible in light mode, corner marks visible but not dominant.
- Price and timeline chips never truncated or wrapped mid-token.
- Journey chips readable at 375.
- German copy not overflowing its containers; German compounds are longer than the English source, so check the situation card titles and the excluded-scope list especially.

Fix every defect found before proceeding. Do not hand over a page you have not looked at.

- [ ] **Step 3: Keyboard pass**

Tab through `/product-validation` from the top. Confirm a visible focus ring on: both hero CTAs, the package CTA, each of the seven FAQ summaries, and each contact form field. Confirm Enter and Space toggle FAQ items, and that the "See what's included" link moves focus into the package section.

- [ ] **Step 4: Content audit against the constraints**

```bash
grep -niE "disruptive|game-chang|revolutionar|unfair advantage|10x|growth hack" src/i18n/en-us.ts src/i18n/de-de.ts
grep -niE "prove demand|guarantee valid|validate the business|product-market fit|nachfrage bewe" src/i18n/en-us.ts src/i18n/de-de.ts
```
Expected: no matches from either command.

Then confirm by reading that the evidence-not-certainty qualification appears both in the "Why start here" closing and in the third FAQ answer, in both locales.

- [ ] **Step 5: Confirm the deferred items really are absent**

```bash
grep -rniE "analytics|gtag|plausible|umami|data-track" src/components/product-validation-content.tsx src/components/faq-section.tsx src/pages/product-validation.astro
grep -rn "application/ld+json" src/pages/product-validation.astro src/components/product-validation-content.tsx
```
Expected: no matches. The only permitted occurrences of "analytics" are inside the i18n copy, where it describes a client deliverable.

- [ ] **Step 6: Push and open the pull request**

```bash
git push -u origin worktree-feat-product-validation-page
gh pr create --title "feat(website): product validation offer page" --body "$(cat <<'EOF'
Adds a fourth offer page targeting startup founders pre-MVP, sold as a
fixed-price Product Validation Sprint from EUR 4,900 net over 3-4 weeks.
Bilingual, reachable at /product-validation and /de-de/produkt-validierung.

Spec: docs/superpowers/specs/2026-08-08-product-validation-page-design.md

- Nine sections reusing the AI page's design vocabulary, no new primitives
- New reusable FaqSection built on native <details>, zero client JS
- ProofSection's aiLink/webDevLink props collapse into a deliverLinks array,
  producing identical markup for the two existing links
- CTA analytics deferred: the site has no analytics implementation to follow
  conventions from. The four CTAs to instrument later are noted in the spec.

Verified: tsc clean, 37 pages built, visual pass at 1440/768/375 in light and
dark on both locales, keyboard pass over CTAs and FAQ disclosures.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

Stop after the PR is open. Sebastian rebase-merges; do not merge locally.

---

## Self-Review

**Spec coverage.** Spec §4 route map is Tasks 2 and 5. §5 design language is Tasks 2, 3, 4. §6.1 to §6.9 map to Tasks 2 (6.1 to 6.3), 3 (6.4 to 6.8), and 4 (6.9). §6.10 contact is Task 2 Step 2, via the shared `ContactSection` with two overrides. §7 `FaqSection` is Task 4. §8 `ProofSection` refactor is Task 5. §9 SEO is Task 2 Step 2 (meta, hreflang) and Task 1 (title and description strings); the "no new structured data" rule is verified in Task 6 Step 5. §10 accessibility is Task 6 Step 3 plus the semantics built into Tasks 2 to 4. §11 out-of-scope is enforced by Global Constraints. §12 deferred items are verified absent in Task 6 Step 5. §13 verification is Task 6.

**Naming consistency.** The spec calls section 6.3 "Package" while the i18n key is `offer` (`package` is a reserved word in strict-mode TypeScript and a poor property name here). The anchor is `#package`, matching the spec's `id="package"`. Task 2 uses `content.offer` and `id="package"` consistently, and Task 1's contract defines `offer`.

**Type consistency.** `FaqContent` is defined in Task 1, consumed in Task 4. `deliverLinks` is defined and consumed within Task 5. `ProductValidationContent` is defined in Task 2 and imported in the routes in the same task. `content.process.steps[].description` is `string[]` here, unlike the AI page's `string`; Task 3 renders it as a paragraph loop accordingly.

**Known plan-time gap.** The German copy in Task 1 Step 5 is specified by a locked-terms table plus structural rules rather than written out verbatim, because the translation is a writing task rather than a transcription. Every key name, array length, and fixed term is pinned, so a wrong translation is a copy defect, not a structural one, and Task 6 Step 4 audits the claims discipline in both locales.
