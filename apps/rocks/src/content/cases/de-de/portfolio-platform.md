---
title: 'sebastian-heitmann.dev — Website und Cloud-Plattform'
summary: 'Eine zweisprachige Astro-Website mit vollständig terraformter Scaleway-Plattform dahinter: CDN, Serverless Functions, DNS und Transaktions-E-Mail — deployt aus einem Bun-Monorepo.'
kind: 'case-study'
role: 'Design, Entwicklung und Betrieb'
stack: ['Astro', 'TypeScript', 'Tailwind v4', 'Bun', 'Terraform', 'Scaleway']
cover: ../../../assets/cover-art-sparks-crew.png
startDate: 2026-05-01
links:
  - label: 'Live-Website'
    url: 'https://www.sebastian-heitmann.dev'
featured: true
draft: false
---

## Ausgangslage

sebastian-heitmann.dev ist eine zweisprachige (Englisch/Deutsch) statische Website, gebaut mit Astro und einem Precision-Swiss-Designsystem, ausgeliefert über Scaleway Object Storage hinter einem Edge-Services-CDN.

## Was daran interessant ist

Alles um die Website herum ist Code. Terraform verwaltet Projekt, Bucket, CDN-Pipeline, DNS-Zone, eine Serverless Function für das Kontaktformular und die Transaktions-E-Mail-Domain. Secrets landen nie auf der Platte: Ein varlock-Schema pro Workspace löst sie zur Laufzeit aus Proton Pass auf. Deploys sind zwei idempotente Skripte.

## Setlist: Stack-Highlights

- Astro Islands für Interaktivität, Tailwind v4 für das Precision-Swiss-Designsystem
- Terraform-verwaltete Scaleway-Plattform: CDN, Serverless Functions, DNS, Transaktions-E-Mail
- varlock + Proton Pass für Secrets, sodass nichts Sensibles je auf der Platte landet

## Ergebnis

Eine Website, deren gesamte Plattform sich mit drei Befehlen von einer frischen Maschine wiederherstellen lässt — und deren DNS inklusive produktiver Microsoft-365-Mail-Records ohne Registrar-Wechsel dokumentiert und reversibel von GoDaddy zu Scaleway umgezogen ist.
