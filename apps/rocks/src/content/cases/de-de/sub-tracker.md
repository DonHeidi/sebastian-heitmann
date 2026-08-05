---
title: 'Sub-Tracker — Prototyp eines Abo-Trackers'
summary: 'Ein Abo-Tracker-Prototyp in einem Bun-Monorepo: TanStack Start über SQLite und Drizzle, mit Envelope-Verschlüsselung pro Nutzer und einem Transaktionsmail-Adapter mit typisierten Fehlern.'
kind: 'project'
role: 'Design und Entwicklung'
stack: ['TypeScript', 'Bun', 'TanStack Start', 'SQLite', 'Drizzle', 'better-auth']
cover: ../../../assets/cover-art-masked-duo.png
startDate: 2026-05-12
links: []
featured: false
draft: false
---

## Ausgangslage

Sub-Tracker ist ein Abo-Tracker im Prototyp-Stadium, aufgebaut als Bun-Workspaces-Monorepo: eine TanStack-Start-Web-App (React 19), ein Devtools-CLI und ein geteiltes Datenbank-Package auf SQLite via Drizzle, gestylt mit Tailwind v4 und shadcn/ui.

## Was daran interessant ist

Nutzerdaten sind pro Nutzer Envelope-verschlüsselt: Jeder Account bekommt einen eigenen Data Encryption Key, umhüllt von einem Master-Key, ohne beide bleiben die Daten unlesbar. Transaktionsmails laufen durch einen einzigen, per Env ausgewählten Adapter (Console, SMTP gegen ein lokales Mailpit oder Scaleway), dessen Fehler als permanent oder transient typisiert sind; jeder Flow entscheidet selbst, ob ein fehlgeschlagener Versand die Operation abbricht oder geloggt und ignoriert wird.

## Setlist: Stack-Highlights

- TanStack Start (React 19), SSR-first, Tailwind v4, shadcn/ui
- Envelope-Verschlüsselung pro Nutzer über SQLite und Drizzle, Auth via better-auth
- Mail-Adapter mit Console-, SMTP- und Scaleway-Transport und typisierten Fehlern

## Stand

Prototyp-Stadium, privat.
