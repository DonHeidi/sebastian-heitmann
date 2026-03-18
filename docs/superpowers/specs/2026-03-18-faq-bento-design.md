# FAQ Bento Section — Design Spec

## Overview

A bento-grid section below the "Why Me" header, showcasing career history, volunteer work, skills, and a photo in an asymmetric grid of glassmorphic cards.

## Section Component (`faq-bento-section.astro`)

**Placement:** After `WhyMeSection` in `index.astro`. No section ID needed (the `#why-me` anchor covers the header above).

**Layout:** CSS Grid with named template areas:

```
"career    career    voluntary"
"career    career    voluntary"
"skills    skills    photo"
"skills    skills    photo"
```

- Grid gap: 1.5rem
- Section padding follows standard pattern: 144px → 80px → 2rem → 1.25rem inline

**Responsive:**
- Desktop: 3-column grid with named areas as above
- 768px: Single column, all cards stack vertically (career → voluntary → skills → photo)
- 375px: Reduced padding

## Shared Card Wrapper (`bento-card.astro`)

**Props:** `gridArea` (string), `class` (optional string)

A wrapper providing shared glassmorphism styling:
- `backdrop-filter: blur(14px)`
- `background: rgba(22, 24, 48, 0.7)`
- `border: 1px solid rgba(255, 255, 255, 0.04)`
- `border-radius: 12px`
- Multi-layer box shadow matching existing card patterns
- `overflow: hidden`
- Sets `grid-area` via `define:vars`
- Renders `<slot />` for content

## Career Card (`bento-career-card.astro`)

**Tabbed view** with company list on the left and role details on the right.

**Left panel:** List of company names as tab buttons, each with:
- Company name in `AntonSC`
- Role title in `SpaceGrotesk` (smaller, muted)
- Active tab highlighted with magenta left border

**Right panel:** Details for the selected company:
- Company name + role title header
- Date range
- Bullet points describing projects, tasks, and tools

**Companies (from screenshot):**
1. **i22** — Sr. Agile Project Manager
2. **Jung von Matt** — Technical Consultant (Feb 2020 to Mar 2021), Jr. Technical Project Manager (Sep 2019 to Jan 2020). Projects: sales platform rollout, intranet migration, gap analysis, IT satisfaction. Tools: Scrum, Confluence, Jira, Next.js, Contentful, Keynote
3. **Datadrivers** — Sr. Consultant Project Operations
4. **Granny & Smith** — Technical Consultant
5. **Offis** — Research Assistant
6. **Pool Position** — Software Developer
7. **SyneriaX** — Project Lead .Net
8. **Goldkalb** — Software Developer

**Client-side JS:** Tab switching — clicking a company name shows that company's details. First company selected by default.

**Card heading:** "Former Career" in magenta `AntonSC` at top of the card.

## Voluntary Card (`bento-voluntary-card.astro`)

**Card heading:** "Voluntary" in magenta `AntonSC`.

**Content:** List of volunteer positions, each with:
- Organization name (small, muted)
- Role title in `AntonSC` (green color)
- Date range (small, muted)
- Bullet points of responsibilities

**Positions (from screenshot):**
1. **GMLS Consulting e.V.** — Member of the Advisory Board (since May 2020)
   - Sparring partner for development of the club
   - Mediation in internal conflicts within the association
2. **JDNetwork e.V.** — Fellow Software Development (Oct 2018 to Mar 2020)
   - Development of a decentralized membership management system
3. **GMLS Consulting e.V.** — Head of Quality & Innovation Management (Dec 2018 to Apr 2019)
   - IT Operations (e.g. MS 365 Administration)
   - Developing a strategy for the department
4. **GMLS Consulting e.V.** — Chairman of the Board (Sep 2017 to Nov 2018)
   - Maintain partner network
   - Acquisition of projects, work shops, and trainings
   - Development of a vision and strategy for the club
   - Heading internal projects
5. **GMLS Consulting e.V.** — Head of Acquisition & Project Management (Dec 2016 to Sep 2018)
   - Acquisition of consulting projects
   - Project Controlling
6. **Municipality of Ritterhude** — Voluntary Social Year (Aug 2013 to Jul 2014)
   - Day care in the Werschenrege kindergarten
   - Afternoon care in the Ritterbude primary school

## Skills Card (`bento-skills-card.astro`)

**Card heading:** "Skills" in magenta `AntonSC`.

**Content:** Skills grouped by category, each category with:
- Category name as a subheading (green color, `AntonSC`)
- Tags displayed as inline pill/chip elements in `SpaceGrotesk` (monospace style)

**Categories (from screenshot):**
1. **Technical Project Management:** Requirements Engineering, Workshop Facilitating, Scrum, Kanban, Design Sprint, Jira, Confluence, MS 365, Google Workspace, iWork
2. **Software Development:** Kotlin, Java, TypeScript, JavaScript, Next.js, React, Vert.x, WSL 2, HTML/CSS, Gradle, esbuild, Design Patterns, Maven, Contentful, Unit Testing, AWS
3. **Solution Design:** Plant UML, MVP/MVC, API Design, openAPI, UML, SOA, Headless, Feasibility Analysis, graphQL, serverless, Adobe XD, Figma

## Photo Card (`bento-photo-card.astro`)

Simple card containing the existing profile photo (`src/assets/fb.jpg`) rendered via Astro `<Image />` component. Image fills the card with `object-fit: cover`, border-radius matching the card corners.

## Files

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `src/components/bento-card.astro` | Shared glassmorphism card wrapper |
| Create | `src/components/bento-career-card.astro` | Tabbed career history |
| Create | `src/components/bento-voluntary-card.astro` | Volunteer positions list |
| Create | `src/components/bento-skills-card.astro` | Skills tags by category |
| Create | `src/components/bento-photo-card.astro` | Profile photo card |
| Create | `src/components/faq-bento-section.astro` | Bento grid section |
| Modify | `src/pages/index.astro` | Add FaqBentoSection after WhyMeSection |

## Design Tokens

- Glassmorphism values consistent with existing cards
- `--clr-magenta` for card headings
- `--clr-green` for category labels and role titles
- `--clr-blue` for accents
- `AntonSC` for headings/titles, `SpaceGrotesk` for body/tags
- Responsive breakpoints: 1440px, 768px, 375px
