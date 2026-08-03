# sebastian-heitmann.rocks v2 — "Rock'n'Roll Meets Engineering"

**Date:** 2026-08-03
**Status:** Approved (design approved in conversation; spec is the record)
**Builds on:** `2026-08-03-rocks-portfolio-site-design.md` (v1, shipped on this branch)

## Direction

The v1 site is correct but quiet. v2 gives it the attitude the `.rocks` TLD promises: rock'n'roll meets engineering, a bit punk, with full brand recognition. The engineering half already exists in the repo (the `.dev` backdrop vocabulary: blueprint grids, dot fields, dimension lines, registration and crop marks). The rock half is what v2 adds: gig-poster scale, swagger copy, and the asterisk elevated from a typographic accent to a first-class brand mark.

Punk shows up as controlled print misbehavior, not chaos: misregistered printing, stamps, one strikethrough. Everything stays inside the `--v8-*` token system, both themes, both locales.

## Non-negotiables (brand recognition)

- All `--v8-*` tokens unchanged; dark and light themes both first-class
- Fonts unchanged (Instrument Serif display, DM Sans body, IBM Plex Mono)
- Nav and footer structure, border/spacing discipline, and the reveal animation stay
- No new runtime dependencies

## The Asterisk Mark

One drawn SVG mark: six spokes, slightly uneven lengths, rotated a few degrees off-square. Geometric but visibly hand-set, like a print-shop dingbat. Component `AsteriskMark` (`src/components/asterisk-mark.tsx`) with props:

- `size` (px number rendered as width/height)
- `rotation` (degrees, default the mark's natural off-square tilt)
- `tone`: `'accent' | 'ink' | 'faint'` (mapped to `var(--v8-accent)`, `var(--v8-text)`, `var(--v8-border)`-ish faint)
- `misregister` (boolean): renders the mark twice, an accent-toned copy offset 3-4px behind the ink copy, like off-register zine printing. The signature effect.

Usage system: huge misregistered hero mark bleeding off-canvas, small accent marks replacing section-kicker bullets, giant mark on the 404, tiny ink mark by the footer copyright, and the favicon.

## Engineering Backdrop Art

The `.bd-*` vocabulary (grid fields, dot fields, stroke classes, dim labels) is copied from `apps/website/src/styles/global.css` into the rocks `global.css` (documented in place, same copy-not-extract policy as v1). Two backdrop components in the `.dev` "moment" tradition, both `aria-hidden`, absolutely positioned, `-z-10`, `pointer-events-none`:

- `HeroStageMoment` (`src/components/backdrop/hero-stage-moment.tsx`): cropped engineering grid anchoring the bottom-right, dot-field texture on a rail, one dimension line annotating the heading width, a registration mark, and mono annotations that read like setlist/spec hybrids (`SETLIST: CASES`, `EST. 1440 PX`). The big rotating misregistered asterisk crashes through it.
- `DetailMoment` (`src/components/backdrop/detail-moment.tsx`): slim version for case detail pages: crop marks and a faint grid corner.

## Type and Punk Treatments

- Hero heading at poster scale: Instrument Serif, `clamp(3.5rem, 9vw, 7.5rem)`, tight leading
- Misregistration on one hero word: accent-colored duplicate offset behind the ink word (CSS-only, reusable utility class `.misregister-text` in `global.css`)
- Exactly one strikethrough moment in the hero intro (~~portfolio~~ setlist); a single act of vandalism, not a theme
- Case cards get a rotated (2-3°) mono stamp chip like a tour-date stamp showing kind/year
- Setlist numbering on case entries: `01 /`, `02 /` in mono

## Motion

- Hero mark: slow continuous CSS rotation (~60s linear), barely perceptible
- Small marks: spin-on-hover
- Pixel rocker: sprite-sheet headbang loop via CSS `steps()`
- Everything inside `@media (prefers-reduced-motion: no-preference)`; reduced motion shows static frames

## Pixel Rocker Sprite

A generic pixel-art rocker (long hair, leather, guitar, mid-headbang), deliberately NOT a recognizable real person (no Slash likeness: publicity-rights and brand-focus reasons, agreed in conversation). Tiny asterisk on his shirt to bind him to the system. Hand-crafted pixel art as SVG frames or a single SVG sprite sheet, animated with CSS `steps()`. Placement:

- 404 page: headbanging next to "NO ENCORE."
- Footer: tiny static-by-default cameo in the corner (animates on hover)

Component `PixelRocker` (`src/components/pixel-rocker.tsx`) with `size` and `animated` props.

## Page-by-Page

**Landing (`/`, `/de-de/`).** Hero: poster type, misregistered word, big rotating asterisk, `HeroStageMoment`, strikethrough intro moment. Cases section as setlist (numbered entries, stamps, asterisk kicker bullets). Projects same treatment, lighter. Teasers keep card layout; kicker reworded (see copy). Footer: tiny ink asterisk by the copyright + pixel rocker cameo.

**Case detail (`/cases/[slug]`, both locales).** `DetailMoment` backdrop, meta `<dl>` restyled as a spec block with a stamp chip, asterisk list bullets inside `.case-prose` (CSS `li::before`, no content changes).

**404.** Giant misregistered asterisk, heading "NO ENCORE." / "KEINE ZUGABE.", one dry body line, back-home link styled as a ticket-stub button, headbanging pixel rocker.

**Favicon.** The asterisk mark, accent on ink background, replacing the copied "sh" wordmark favicon.

## Copy Rewrite

Both locale files change; the `Strings` interface gains/renames keys as needed (e.g. `hero.headingMisregisterWord`, `cases.setlistKicker`, strikethrough parts split into typed segments so components never hardcode text). Direction, final wording at implementers' discretion within this register:

- EN hero heading: "Loud where it counts." Intro: engineering counterweight, contains the ~~portfolio~~ setlist strikethrough, e.g. "Everything here shipped. The ~~portfolio~~ setlist below: built end to end, tuned in production."
- DE hero: real German with the same attitude, not translated idioms. Heading direction: "Laut, wo es zählt." Intro mirrors the strikethrough (~~Portfolio~~ Setlist).
- Section kickers: `SETLIST: CASES` / `SETLIST: FALLSTUDIEN`; teasers `FROM THE .DEV PRESS` / `AUS DER .DEV PRESSE`; projects `SIDE PROJECTS` / `SIDE PROJECTS` (mono, uppercase)
- 404: "NO ENCORE." / "KEINE ZUGABE." with one dry line ("This page never made the setlist." / "Diese Seite hat es nie auf die Setlist geschafft.")
- Tone rule: confident, dry, specific. No exclamation marks. The engineering half grounds every rock claim.

## Out of Scope

- No photos, no new icon-library imagery (the existing lucide theme-toggle icons stay), no generative texture beyond the `.bd-*` kit (decided in conversation)
- No marquees, scroll-jacking, or sound
- No changes to `.dev`, infra, deploy, or content entries
- No new dependencies

## Amendment v2.1 (2026-08-03, same day): Visuals Tell the Story

Mid-execution course correction from Sebastian: "I don't want the copy to tell the story but the visual appeal of the site," with the hand-painted Green Day logo as the reference for display lettering ("if we are going to use font highlights, we should lean more into graffiti art"). Decisions:

- **Copy freezes as written** (the v2 rewrite stays), but no further copy-driven design. All new storytelling investment is visual.
- **Graffiti wordmarks replace clean typographic highlights.** A new `GraffitiWord` asset set: hand-drawn SVG lettering (chunky uneven caps, rough painted edges, speckle, accent color) for the display words `Loud`, `Laut`, `NO ENCORE.`, `KEINE ZUGABE.`. The hero heading renders its highlighted word as the wordmark artwork (serif for the rest); the 404 heading uses its wordmark. The `.misregister-text` utility is retired from headings; the `AsteriskMark` misregister print effect stays (it is texture, not typography).
- **Hero artwork: Sebastian's flaming keyboard-rocker image** (AI artwork he created; file lands at `apps/rocks/src/assets/`). It anchors the landing hero's right side through `astro:assets` (never `ImageMetadata.src`); the big asterisk moves to a supporting role. In light theme the dark image sits as a framed poster panel (deliberate). Until the file exists in the repo, hero integration is blocked on it and other tasks proceed.
- Everything else in this spec (setlist cards, stamps, kickers, backdrop kit, pixel rocker, motion rules, tokens) stands.

## Verification

- `bun run build` clean; all five pages emit
- Full screenshot matrix (both themes, both locales, 1440/1024/768/375) with specific checks: backdrop art behind content, misregistration legible at 375px, stamps not clipping card layouts, reduced-motion query verified by emulation (no rotation, static sprite), favicon renders in both themes
- Existing SEO output (hreflang, canonicals, sitemap) unchanged
