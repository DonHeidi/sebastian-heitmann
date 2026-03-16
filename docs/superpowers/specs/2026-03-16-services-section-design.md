# Services Section — Design Spec

## Overview

Replace the placeholder `UseCases` component with an "Our Services" accordion section. Each accordion item expands to show a service description and links to related case studies. Only one item can be open at a time.

## Section Component (`services-section.astro`)

**Section ID:** `id="services"` — matches the existing nav anchor `<a href="#services">My Services</a>` in `navigation.astro`.

**Header area:**
- Heading "Our Services" using existing `Headline` component (`element="h2"`, `as="h3"`)
- Body text description using existing `Body` component
- Left-aligned, max-width ~50ch for readability

**Accordion area:**
- 4 `<details>` elements stacked vertically, full-width
- Each `<summary>` contains:
  - Title text in `AntonSC` font, right-aligned
  - `mdi:chevron-up` icon (from existing `@iconify-json/mdi`) on the far right
  - Icon rotates 180deg when `<details>` is open (CSS `details[open] summary .icon { transform: rotate(180deg) }`)
- Expanded content (`<div>` inside `<details>`, after `<summary>`):
  - Description paragraph in `SpaceGrotesk`
  - Links to related cases styled as simple anchor elements with underline (linking to `/cases/[slug]`)
- Separator: `border-bottom: 1px solid rgba(255, 255, 255, 0.08)` between items
- Client-side `<script>`: on `toggle` event, if a `<details>` is opened, close all other `<details>` in the section

**Responsive:**
- Desktop: `padding-inline: 144px`, `padding-block: 6rem`
- 1440px: `padding-inline: 80px`
- 768px: `padding-inline: 2rem`, `padding-block: 4rem`
- 375px: `padding-inline: 1.25rem`, `padding-block: 3rem`

## Service Data

Hardcoded array in the component (4 items, static data — no content collection needed):

1. **UX & UI** — description about user experience and interface design. Links to: `ddp-app`, `mobile-dashboard`
2. **Solution Design** — description about architecture and technical planning. Links to: `saas-platform`, `analytics-engine`
3. **Product Development** — description about building and shipping products. Links to: `ddp-app`, `saas-platform`
4. **Operations & Evolution** — description about maintenance and growth. Links to: `mobile-dashboard`, `analytics-engine`

Each item: `{ title: string, description: string, caseLinks: { label: string, slug: string }[] }`

## Integration

- Remove `UseCases` import and `<UseCases />` from `src/pages/index.astro`
- Delete `src/components/use-cases.astro`
- Import and add `ServicesSection` in the same position (after `SuccessStoriesSection`)

## Design Tokens

Uses existing CSS custom properties:
- `--clr-bg-primary` (#111222) for background
- `--clr-font-primary` for body text
- `--clr-white` for heading text
- Responsive breakpoints: 1440px, 768px, 375px
- `AntonSC` for titles, `SpaceGrotesk` for body/descriptions
