# Hero repositioning: lead with the outcome thesis

**Date:** 2026-08-07
**Status:** Approved, pending implementation
**Scope:** Hero copy and the qualifier that follows the title. Copy only, both locales.

## Problem

The title has already moved from "Fractional CTO" to "Technology Consultant", because
"Fractional CTO" did not sell into the DACH SME market: the term is only legible to
VC-adjacent founders, and it presupposes the buyer already believes they need a
technology executive.

The hero copy did not move with it, and it now works against the new positioning in
two ways.

**It sells the wrong value axis.** The pitch closes on "One person replacing a team at a
fraction of the cost and twice the speed." That is a price-buyer's argument. It invites
comparison against a cheap agency instead of against the full-time hire the buyer cannot
get or afford, and it anchors the engagement conversation on rate rather than judgment.

**The new title is the most crowded label in the market.** Bare "Technology Consultant"
puts the site on the same shelf as IT-Systemhäuser and generic Digitalisierungsberater,
who compete on day rate. Nothing in the hero says why this one rather than that one.

There is also a smaller internal contradiction: the hero claims to replace teams, while
the technical-project-management page describes coordinating and aligning them.

## Goal

Lead with the argument the articles already make, and attach a qualifier that says which
shelf this is on, so the crowded label stops doing all the work alone.

## Decisions

Settled with the user before writing this spec:

1. **Primary buyer:** mid-sized companies and startups across DACH, remote-friendly. The
   local web-development line is a side business and does not drive hero copy.
2. **Value axis:** judgment and outcomes, not cost and speed. Cost may appear later in the
   funnel; it does not appear in the hero.
3. **Qualifier:** AI is the wedge. "AI-powered products & processes" is both the strongest
   current offer and what DACH SMEs are actively budgeting for.
4. **German title:** stays "Technology Consultant". The term is current in DACH tech and
   startup circles, and keeping it holds the brand consistent across locales.
5. **Direction:** the article thesis as the lead ("Output is cheap now. Outcomes are not."),
   chosen over two alternatives: a capability lead ("I build rather than describe") and a
   throughput lead ("One seat. The whole delivery chain.").

### Why the thesis lead, given it is the least literal of the three

It is the most differentiated framing and it is demonstrably the author's own: the same
argument runs through the articles, most directly in "Your Knowledge System Isn't Finished
Until It Ships" ("Output is delegable. Outcome is not."). That makes the essays read as
the argument behind the homepage rather than as detached content marketing.

The cost is that a thesis is not a self-introduction. A cold visitor needs the second
paragraph to learn who is speaking. This is mitigated by the pitch paragraph, which
carries the identity and the offer immediately after, and by the hero's stat column
(role, focus, experience, projects, status), which states the role independently of
the prose.

The hero deliberately rhymes with the article line without repeating it verbatim, so the
two do not read as copy-paste.

## Copy

### English (`src/i18n/en-us.ts`)

`hero.pitchLead`:

> Output is cheap now. Outcomes are not.

`hero.pitch`:

> AI made producing software easy. Deciding what to build, judging what's good, and
> carrying it into production didn't get easier. Developer, project manager, consultant:
> I've been all three. Today they're one role. I build AI-powered products and processes
> and own them from first prototype to production.

### German (`src/i18n/de-de.ts`)

`hero.pitchLead`:

> Output ist billig geworden. Outcome nicht.

`hero.pitch`:

> KI hat es leicht gemacht, Software zu produzieren. Zu entscheiden, was gebaut wird, zu
> beurteilen, was gut ist, und es in Produktion zu bringen: das ist nicht leichter
> geworden. Entwickler, Projektmanager, Berater. Ich war jedes davon. Heute sind sie eine
> Rolle. Ich entwickle KI-gestützte Produkte und Prozesse und verantworte sie vom ersten
> Prototyp bis in die Produktion.

The structure in both locales is: thesis, then why it stays hard, then who is speaking,
then what is sold. The pitch absorbs the qualifier ("from prototype to production"), so
the qualifier does not need its own line in the hero.

"Output"/"Outcome" stay untranslated in the German. Both are current usage in German
business language, the contrast survives intact, and translating them ("Ergebnis" for
both) would collapse the distinction the sentence depends on.

## Changes

| File | Key | Change |
|------|-----|--------|
| `src/i18n/en-us.ts` | `hero.pitchLead` | New thesis line |
| `src/i18n/en-us.ts` | `hero.pitch` | New pitch paragraph |
| `src/i18n/en-us.ts` | `meta.description` | `Technology Consultant. AI-powered products & processes, from prototype to production.` |
| `src/i18n/en-us.ts` | `hero.focus.value` | `Architecture, Delivery, Teams` → `AI, Architecture, Delivery` |
| `src/i18n/de-de.ts` | `hero.pitchLead` | New thesis line |
| `src/i18n/de-de.ts` | `hero.pitch` | New pitch paragraph |
| `src/i18n/de-de.ts` | `meta.description` | `Technology Consultant. KI-gestützte Produkte & Prozesse, vom Prototyp bis zur Produktion.` |
| `src/i18n/de-de.ts` | `hero.focus.value` | `Architektur, Entwicklung, Teams` → `KI, Architektur, Entwicklung` |

`meta.description` also feeds the JSON-LD `description` in `src/layouts/Layout.astro` and
the Open Graph description, so both follow from the same edit.

`hero.focus.value` changes because "Teams" no longer matches a hero built on owning
outcomes, and because the AI wedge should appear in the stat column as well as the prose.

## Explicitly unchanged

- `meta.title` and `hero.role.value`. The title move is already done.
- `hero.cta`, `hero.ctaNote` ("Direct to my inbox. No funnel. I read every message.").
- `hero.experience`, `hero.projects`, `hero.status`.
- The article author card (`src/content/authors/sebastian-heitmann.json`). Its `role` is
  already "Technology Consultant" and its description remains accurate.
- Everything below the hero. The capabilities cards, situations list, results tiles,
  engagement ladder, and service pages already sit coherently under this framing.

No structural, layout, or component changes. This is a copy edit to two files.

## Risks

**The thesis does not name the speaker.** Handled by the pitch paragraph and the stat
column, as described above. If analytics later show hero bounce worsening, the fallback is
the capability lead ("I build rather than describe"), which was the runner-up and needs no
other change.

**Line-length regression.** `pitchLead` grows from one clause to two sentences and `pitch`
grows by roughly 15%. Both paragraphs are capped at `max-w-[520px]` inside the hero's
right column (`md:grid-cols-[180px_1fr]`, `lg:grid-cols-[220px_1fr]`), so the text reflows
rather than overflowing. What needs checking is vertical: the taller block must not crowd
the CTA or push the hero past the fold at 375px.

## Verification

1. `bun run build` passes.
2. Screenshot the hero at 1440px and 375px, light and dark, both locales: no clipping, no
   overflow, and the pitch does not crowd the CTA.
3. Confirm the new `meta.description` appears in the rendered `<meta name="description">`,
   the OG description, and the JSON-LD `description` on `/` and `/de-de/`.
4. Confirm no remaining occurrence of "fraction of the cost" or "Bruchteil der Kosten" in
   `dist/`.
