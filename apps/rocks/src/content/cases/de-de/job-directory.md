---
title: 'Job Directory — Arbeitsbereich für die Jobsuche'
summary: 'Ein persönlicher Arbeitsbereich für die Jobsuche: Ein externer Agent schickt kuratierte Stellen und Briefings per POST in eine Postgres-gestützte TanStack-Start-App; Shortlist, Bewerbungspipeline, Outreach-Entwürfe und Anschreiben-Review an einem Ort.'
kind: 'case-study'
role: 'Design und Entwicklung'
stack: ['TypeScript', 'Bun', 'TanStack Start', 'PostgreSQL', 'Drizzle', 'better-auth']
cover: ../../../assets/cover-art-red-suits.png
startDate: 2026-06-06
links: []
featured: false
draft: false
---

## Ausgangslage

Job Directory ist ein persönlicher Arbeitsbereich für die Jobsuche in einem Bun-Monorepo: eine TanStack-Start-App über Postgres (Drizzle ORM auf Buns nativem SQL-Treiber, serverseitig pro Request gerendert), die kuratierte Stellenanzeigen, datumsbasierte Briefings, eine Shortlist und eine Bewerbungspipeline mit Tabellen- und Kanban-Ansicht bündelt.

## Was daran interessant ist

Die Kuration läuft von Maschine zu Maschine: Ein externer Agent schickt Stellen und Briefings per POST über eine API-Key-gesicherte HTTP-API, dokumentiert als OpenAPI 3.1 mit interaktiver Referenz. Der Mensch arbeitet auf der anderen Seite: Stellen durch einen Status-Funnel triagieren, Outreach entwerfen, CV und Anschreiben pro Stelle zuschneiden und zu jeder Stelle Feedback hinterlassen, das der Agent als Trainingssignal zurückbekommt. Der Zugang ist doppelt gesichert: Jede Seite verlangt Session und aktives Entitlement, ein frischer Account landet also erst einmal auf der Billing-Seite, nicht in der App.

## Setlist: Stack-Highlights

- TanStack Start auf der Bun-Runtime, Postgres über Bun.sql und Drizzle-Migrationen
- Agenten-HTTP-API mit OpenAPI-3.1-Contract und API-Key-Auth
- Bewerbungs-Funnel mit Tabellen- und Kanban-Ansicht plus Review-Queue für Anschreiben

## Stand

Privat und in aktiver Entwicklung: ein Werkzeug, gebaut, um genau eine Jobsuche gut zu führen, mit einer Kurationsschleife zwischen Agent und Nutzer.
