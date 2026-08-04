# sebastian-heitmann.rocks v3 — Neo-Retro Poster Direction

**Date:** 2026-08-04
**Status:** Approved (design approved in conversation; spec is the record)
**Supersedes:** the graffiti/punk visual treatments of `2026-08-03-rocks-v2-punk-design.md`. The v2 structural work (sections, cards, i18n, pixel rocker, asterisk mark, torn masks) carries forward except where this spec retires it.

## Direction

Sebastian was not satisfied with the graffiti direction and supplied five vintage concert-poster references (AC/DC 1979 and Hamburg 1979, KISS Market Square, Aerosmith Peace Out, Linkin Park Hamburg). The shared DNA: typeset print-shop discipline, one or two ink colors, duotone/halftone photography as the centerpiece, massive condensed uppercase mastheads, structured information blocks. His framing: "rock/metal/punk neo-retro", a modern approach, not literal vintage pastiche. No aged-paper texture. The modern layer is interaction: duotone imagery that reveals full color on hover.

He describes himself as **"Unconventionally effective"**; that is the tagline.

He is creating cover artwork for the case entries to fit the theme; the design must be ready to receive it (the `cover` schema field exists).

Decisions from conversation: cases stay as cards (explicitly NO tour-date table); Anton approved as the display face; keep the asterisk mark system, the pixel rocker, and the torn-edge masks; retire the engineering backdrop art and the graffiti wordmarks.

## Type System

- **Anton** (SIL OFL, single 400 weight) self-hosted at `public/fonts/Anton-Regular.woff2`, declared in `v8-fonts.css`, exposed as `--v8-font-poster` in the v8-wildcard token layer, preloaded in the Layout.
- All display type on `.rocks` is Anton uppercase: masthead, tagline bar, section headers, case titles, 404 heading.
- Instrument Serif drops out of use on this site (token remains defined, nothing renders it). DM Sans body and IBM Plex Mono unchanged.
- The `GraffitiWord` component and its usages are deleted.

## Masthead and Tagline

- `SEBASTIAN ✳ HEITMANN` in Anton at poster scale; the rough `AsteriskMark` sits between the names as the logo divider. One line at desktop widths, stacked on mobile.
- Beneath it a ruled tagline bar: `UNCONVENTIONALLY EFFECTIVE` / `UNKONVENTIONELL EFFEKTIV`, letter-spaced, horizontal rules left and right.
- The v2 intro paragraph (including its strikethrough moment) stays as sub-copy. The "Loud where it counts." / "Laut, wo es zählt." heading retires; `hero.headingParts` is replaced by `hero.tagline` in `Strings` (values above; CSS handles uppercasing).

## Duotone Imagery

- One reusable treatment, defined once (component `DuotonePanel` wrapping `astro:assets` `<Image>` plus the filter): accent ink + black duotone mapped through the theme tokens, so dark theme reads as accent-on-black poster ink and light theme as accent-on-cream.
- **Hover reveals full color** (subtle transition; fine under reduced motion since it is a color change, not movement; touch devices simply see duotone).
- Applied to: the guitar-player hero panel (torn mask kept), the About avatar (torn mask kept), and case cover art on cards and detail pages (clean-edged panels; torn edges stay reserved for hero and About so the gesture keeps meaning).

## Structure and Ornament

- Engineering backdrop props retire: `HeroStageMoment` and `DetailMoment` are deleted, along with their mounts.
- Section headers: Anton uppercase over a heavy accent rule with a small asterisk mark (replaces the small mono kickers).
- Setlist numbering (`01 /`) and rotated tour-date stamps on cards stay.
- Modern generous spacing; no aged-paper texture anywhere.
- Asterisk mark system stays throughout (masthead, section headers, footer, favicon). Pixel rocker stays (404 animated, footer hover-headbang cameo).

## Page-by-Page

**Landing (`/`, `/de-de/`).** Masthead block (masthead, tagline bar, intro sub-copy, duotone guitar-player panel with torn edge and hover reveal). Then, in current order with the new headers: Setlist: Cases (cards gain a duotone cover panel when the entry has `cover`), Side Projects, From the .dev Press, About (torn duotone avatar, same copy and `.dev` chip). Footer unchanged.

**Case detail (both locales).** Anton uppercase title; spec-block `<dl>` and stamp stay; cover art (when present) renders as a full-width duotone panel with hover reveal above the prose; `.case-prose` asterisk bullets stay; no backdrop moment.

**404.** `NO ENCORE.` / `KEINE ZUGABE.` in Anton as a real, visible h1 (the sr-only pattern was only needed while the heading was artwork), rough asterisk backdrop stays, ticket-stub button and headbanging rocker stay.

## Copy

Frozen except: `hero.headingParts` replaced by `hero.tagline` as above. Everything else exactly as shipped in v2.

## Cleanup (paid in this cycle)

- Delete: `graffiti-word.tsx`, `backdrop/hero-stage-moment.tsx`, `backdrop/detail-moment.tsx`, the `.misregister-text` utility, unused `.bd-*` rules if nothing references them after the backdrop removal.
- Consolidate the duplicate `.case-prose ul` rule blocks into one.
- No dangling imports or dead Strings keys.

## Out of Scope

- No aged-paper/grunge textures, no halftone dot simulation (duotone only)
- No tour-date table for cases (owner decision)
- No changes to `.dev`, infra, deploy scripts, or content entries
- No new runtime dependencies (Anton is a static asset)

## Verification

- `bun run build` clean; no raw PNGs in dist; Anton woff2 emitted and preloaded; no references to deleted components
- Full screenshot matrix: 5 pages, 4 widths (1440/1024/768/375), both themes, both locales; hover-reveal captured on at least the hero panel and one card; reduced-motion emulation shows static rocker and no motion regressions
- Existing SEO output (hreflang, canonicals, sitemap) unchanged
