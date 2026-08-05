---
title: 'Blickwerk — privacy-first web analytics'
summary: 'Cookieless web analytics, under construction: a Kotlin/Ktor event pipeline over ClickHouse, Postgres, and Redis with a TypeScript dashboard. No cookies, no fingerprinting, no personal data at rest.'
kind: 'case-study'
role: 'Design and development'
stack: ['Kotlin', 'Ktor', 'TypeScript', 'ClickHouse', 'PostgreSQL', 'Redis']
cover: ../../../assets/cover-art-goggles-grin.png
startDate: 2026-07-22
links: []
featured: false
draft: false
---

## The setup

Blickwerk is a privacy-first web analytics platform: no cookies, no fingerprinting, no personal data at rest. A Kotlin/Ktor server ingests events, the analytics schema lives in ClickHouse, the live-visitor stream runs over Redis pub/sub, and a TypeScript dashboard renders the panels, charts, and filters. Postgres and an auth service sit alongside.

## What makes it interesting

Events are enriched server-side instead of tracked client-side: browser, OS, device class, country/region/city (via a local DB-IP database, no external lookups), referrer source, and UTM parameters, on both the event and session level. The read API is contracted in OpenAPI: core stats with previous-period comparison, zero-filled time series in the site's timezone, top-N breakdowns with filters, conversion goals, and a live visitor count streamed as SSE.

## Setlist: stack highlights

- Kotlin/Ktor ingest and read API over ClickHouse, PostgreSQL, and Redis
- Server-side enrichment: browser, OS, device class, geo, referrer source, UTM
- OpenAPI-contracted read side with an SSE live-visitor stream

## Status

Under construction, Apache-2.0. The whole loop already runs locally behind one command, gated by a full-loop Playwright end-to-end suite.
