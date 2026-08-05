---
title: '--v8-asterisk — ein Designsystem als shadcn-Registry'
summary: 'Die --v8-*-Token-Sprache, formalisiert als shadcn-Registry: warmes Creme und Fast-Schwarz, ein orangeroter Akzent, Instrument Serif, DM Sans und IBM Plex Mono, installierbar Item für Item.'
kind: 'case-study'
role: 'Design und Entwicklung'
stack: ['TypeScript', 'CSS', 'shadcn', 'Storybook', 'Bun']
cover: ../../../assets/cover-art-red-shades.png
startDate: 2026-07-13
links: []
featured: false
draft: false
---

## Ausgangslage

--v8-asterisk ist das Designsystem hinter dieser Website: die --v8-*-CSS-Token-Sprache (die achte Design-Iteration eines KI-Agenten; das Label ist geblieben), formalisiert als shadcn-Registry, mit Theme, Fonts und UI-Komponenten als jeweils einzeln installierbaren Registry-Items.

## Was daran interessant ist

Das System ist auf Distribution ausgelegt. Statt einer Komponentenbibliothek als Abhängigkeit liefert es Registry-Items, die per `npx shadcn add` in das konsumierende Projekt kopiert werden, jedes Projekt besitzt seinen Code also selbst. Die visuelle Sprache steht fest: warme Creme- und Fast-Schwarz-Flächen, ein orangeroter Akzent (#FF3B00 im Dark Mode, #B82A00 im Light Mode), Instrument Serif für Display, DM Sans für Fließtext, IBM Plex Mono für Mono, dazu eine optionale reinweiße Light-Variante.

## Setlist: Stack-Highlights

- Das --v8-*-Token-Vokabular, paketiert als Theme- und Fonts-Registry-Items
- UI-Komponenten shadcn-artig verteilt: kopiert statt als Abhängigkeit
- Storybook als Entwicklungsoberfläche, auf der Bun-Toolchain

## Stand

Die Registry themet die Websites des Betreibers, inklusive der, die Sie gerade lesen.
