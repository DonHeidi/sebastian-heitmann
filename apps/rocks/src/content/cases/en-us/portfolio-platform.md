---
title: 'sebastian-heitmann.dev — site and cloud platform'
summary: 'A bilingual Astro site with a fully terraformed Scaleway platform behind it: CDN, serverless functions, DNS, and transactional email — deployed from a Bun monorepo.'
kind: 'case-study'
role: 'Design, development, and operations'
stack: ['Astro', 'TypeScript', 'Tailwind v4', 'Bun', 'Terraform', 'Scaleway']
cover: ../../../assets/cover-art-sparks-crew.png
startDate: 2026-05-01
links:
  - label: 'Live site'
    url: 'https://www.sebastian-heitmann.dev'
featured: true
draft: false
---

## The setup

sebastian-heitmann.dev is a bilingual (English/German) static site built with Astro and a precision-Swiss design system, served from Scaleway Object Storage behind an Edge Services CDN.

## What makes it interesting

Everything around the site is code. Terraform manages the project, bucket, CDN pipeline, DNS zone, a serverless contact-form function, and the transactional-email domain. Secrets never touch disk: a varlock schema per workspace resolves them from Proton Pass at runtime. Deploys are two idempotent scripts.

## Setlist: stack highlights

- Astro islands for interactivity, Tailwind v4 for the precision-Swiss design system
- Terraform-managed Scaleway platform: CDN, serverless functions, DNS, transactional email
- varlock + Proton Pass for secrets, so nothing sensitive ever touches disk

## Outcome

A site whose entire platform can be rebuilt from a clean machine with three commands, and whose DNS — including live Microsoft 365 mail records — moved registrar-free from GoDaddy to Scaleway with a documented, reversible runbook.
