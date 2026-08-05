---
title: 'Blickwerk — Privacy-First-Webanalyse'
summary: 'Cookielose Webanalyse im Aufbau: eine Kotlin/Ktor-Event-Pipeline über ClickHouse, Postgres und Redis mit einem TypeScript-Dashboard. Keine Cookies, kein Fingerprinting, keine gespeicherten personenbezogenen Daten.'
kind: 'case-study'
role: 'Design und Entwicklung'
stack: ['Kotlin', 'Ktor', 'TypeScript', 'ClickHouse', 'PostgreSQL', 'Redis']
cover: ../../../assets/cover-art-goggles-grin.png
startDate: 2026-07-22
links: []
featured: false
draft: false
---

## Ausgangslage

Blickwerk ist eine Privacy-First-Webanalyse: keine Cookies, kein Fingerprinting, keine gespeicherten personenbezogenen Daten. Ein Kotlin/Ktor-Server nimmt Events entgegen, das Analyseschema liegt in ClickHouse, der Live-Besucher-Stream läuft über Redis Pub/Sub, ein TypeScript-Dashboard zeigt Panels, Charts und Filter. Daneben sitzen Postgres und ein Auth-Service.

## Was daran interessant ist

Events werden serverseitig angereichert statt clientseitig getrackt: Browser, OS, Geräteklasse, Land/Region/Stadt (über eine lokale DB-IP-Datenbank, ohne externe Lookups), Referrer-Quelle und UTM-Parameter, auf Event- wie auf Session-Ebene. Die Read-API ist per OpenAPI-Contract festgelegt: Kernmetriken mit Vorperioden-Vergleich, lückenlos gefüllte Zeitreihen in der Zeitzone der Site, Top-N-Breakdowns mit Filtern, Conversion-Goals und ein Live-Besucherzähler als SSE-Stream.

## Setlist: Stack-Highlights

- Kotlin/Ktor-Ingest und Read-API über ClickHouse, PostgreSQL und Redis
- Serverseitige Anreicherung: Browser, OS, Geräteklasse, Geo, Referrer-Quelle, UTM
- OpenAPI-Contract auf der Leseseite mit SSE-Live-Besucher-Stream

## Stand

Im Aufbau, Apache-2.0. Die komplette Strecke läuft lokal bereits hinter einem einzigen Befehl, abgesichert durch eine durchgängige Playwright-End-to-End-Suite.
