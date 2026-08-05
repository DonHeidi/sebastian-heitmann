---
title: '--v8-asterisk — a design system as a shadcn registry'
summary: 'The --v8-* token language formalized as a shadcn registry: warm cream and near-black, an orange-red accent, Instrument Serif, DM Sans, and IBM Plex Mono, installable one item at a time.'
kind: 'case-study'
role: 'Design and development'
stack: ['TypeScript', 'CSS', 'shadcn', 'Storybook', 'Bun']
cover: ../../../assets/cover-art-red-shades.png
startDate: 2026-07-13
links: []
featured: false
draft: false
---

## The setup

--v8-asterisk is the design system behind this site: the --v8-* CSS token language (an AI agent's eighth design iteration; the label stuck) formalized as a shadcn registry, with theme, fonts, and UI components each published as an installable registry item.

## What makes it interesting

The system is distribution-first. Instead of a component library to depend on, it ships as registry items that copy into the consuming project with a single `npx shadcn add` per item, so every consumer owns its code. The visual language is fixed: warm cream and near-black surfaces, an orange-red accent (#FF3B00 in dark, #B82A00 in light), Instrument Serif for display, DM Sans for body, IBM Plex Mono for mono, plus an optional pure-white light variant.

## Setlist: stack highlights

- The --v8-* token vocabulary packaged as theme and fonts registry items
- UI components distributed shadcn-style: copied in, not depended on
- Storybook as the development surface, on the Bun toolchain

## Status

The registry themes the owner's sites, including the one you are reading.
