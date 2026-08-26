---
title: 'sebastian-heitmann.rocks — the site you are standing in'
summary: 'This portfolio is its own flagship case: a Swiss design system bent into punk, UI elements built as physical objects, and a CRT monitor that is a real raytraced 3D model, baked at build time.'
kind: 'case-study'
role: 'Design, development, and operations'
stack: ['Astro', 'TypeScript', 'Tailwind v4', 'Bun', 'SDF raymarching', 'Scaleway']
cover: ../../../assets/cover-art-cosmic-soul.png
startDate: 2026-08-03
links:
  - label: 'Live site'
    url: 'https://www.sebastian-heitmann.rocks'
featured: true
draft: false
---

## The setup

You are looking at it. This site is the case study, and every claim below can be checked by scrolling.

sebastian-heitmann.dev is the business card for my consulting practice, and it has to stay composed. The portfolio needed a different stage: a place where the work performs instead of being described. That split is the founding decision. The `.rocks` domain is not a joke, it is the brief.

## The outcome

A portfolio that demonstrates instead of claims. Every technique below is live on the page you are reading: flip a case, spin a button, switch the monitor off. The site is the proof of work, and if the way it is built speaks to you, that is the pitch, delivered.

## What was built

- A bilingual (English/German) portfolio site, statically built with Astro 7. No client-side framework ships; interactivity is a few kilobytes of plain TypeScript.
- A concert-poster design language on top of my Swiss design system: Anton display type, duotone photography, torn-paper edges, a concrete ground photographed from real concrete.
- The setlist: case studies and side projects presented as 3D CD jewel cases that flip open, with the track list and the link printed on the back of the case.
- The press section: teasers for my essays as die-cut admission tickets, stub, perforation, and notched corners punched out of brushed metal. The writing itself lives on sebastian-heitmann.dev; the tickets are the tour posters.
- Magnetic controls: every button and link is a floating metal object with press, tilt, and grip-spin physics and a spring return.
- The about section: a raytraced CRT monitor showing my bio as live terminal output, with a working power button.
- Light and dark themes, reduced-motion support, and no-JavaScript fallbacks throughout.
- Its own terraformed Scaleway platform: storage, CDN, and DNS, following the same pattern as the .dev stack.

## Bending the system

The site runs on the same design system as `.dev`, a precision-Swiss vocabulary of tokens, type, and spacing. Instead of building a second system, I bent the existing one: same tokens, same components underneath, but pushed into concert-poster territory. Anton masthead, torn-paper edges, duotone photography, a concrete background photographed from actual concrete. The working rule for every page: visuals tell the story, copy stays quiet.

The organizing metaphor is a show. Case studies are a setlist; the tiles are CD jewel cases that flip to a track-list back, and the link lives on the back of the case, where a real CD's contents live. Blog teasers are admission tickets, die-cut with a stub, a perforation line, and notched corners. The cutouts are real: mask layers punch holes through the card so the concrete shows through, like die-cut paper.

## Objects, not elements

The interaction language treats UI as physical objects. Buttons and links are brushed metal, and each piece is cut from a different region of the same photographed steel sheet, because identical grain is what gives a texture away. They float like magnets: hover puts pressure on the edge under the cursor and tilts it, a click presses the piece into its depth rather than squashing it flat, and while held it can be gripped, spun, and dragged against its spring. Release and it swings home on a damped oscillation, overshooting once and settling, because real objects do not ease-out.

None of this ships a framework. The physics is a few dumb event handlers writing CSS custom properties; the browser's transition engine does the smoothing. The site sends no client-side React at all.

## The monitor that refused to be faked

The about section wanted a 90s terminal: my bio as `cat about.txt` on a CRT. That turned into the hardest fight on the site, and the best story.

Every standard trick failed in sequence. CSS 3D transforms produced walls that detached at the corners. Slicing the body into stacked DOM planes worked visually but polluted the markup with dozens of non-semantic divs. Painting it on a canvas produced gradients pretending to be geometry: vent slots that curved where no curvature existed, a case with no believable depth. The verdict after each attempt was the same question: does this look like a 3D model to you? It did not, because it was not one.

So it became one. A build-time script raymarches a real 3D model of the monitor, defined as signed distance fields: a body that is deeper than it is wide, cooling vents subtracted from the flank as actual geometry, a recessed power socket, per-pixel lighting from one key light. The render bakes to a PNG; the browser never pays for it. The live terminal is real DOM, seated into the rendered glass by a homography, so the text stays selectable and accessible inside a raytraced object. The power button works: clicking it collapses the picture to a bright line the way tubes died, and the latching cap swaps between two raytraced sprites, pressed in when on, proud when off.

Five approaches went in the bin before the sixth worked. That is not wasted time, it is how you find the boundary of a medium: each failure narrowed the problem until the remaining answer was obvious.

## Deep dive: the machinery

![Pipeline: an offline SDF raymarcher renders the CRT to baked images and camera metadata at authoring time; at runtime a homography seats the live DOM terminal in the rendered glass](../../../assets/diagrams/rocks-crt.svg)

The browser never computes any 3D; the terminal stays real, selectable DOM. The raymarcher is a plain Bun script, no engine and no dependencies beyond an image encoder. The monitor body is a 2D rounded-rectangle profile lofted through depth with a bulge-then-taper curve, marched with supersampling, shaded with a Blinn-style key light, and auto-framed by projecting extreme points before the render. It also emits metadata: the glass corners, projected to screen space, ship as normalized coordinates that the page turns into a CSS `matrix3d` homography at runtime. One camera renders the pixels and places the DOM.

The magnet system composes two layers per control: a mover that translates toward the pointer and a tilter that rotates under it, so position and rotation spring independently. Spring returns are CSS `linear()` easing curves whose progress deliberately passes 1.0. Grip behavior runs on pointer capture, with click suppression after real dragging so spinning an object never accidentally navigates.

The jewel cases and tickets are CSS-only objects: multi-layer masks with explicit compositing for the die-cuts, silhouette-tracing drop shadows, and a no-JavaScript fallback that keeps every card navigable on touch devices even before any script loads.

The platform below is the same terraformed Scaleway pattern as sebastian-heitmann.dev, with its own bucket, CDN pipeline, and DNS zone. That story is told in the .dev case.
