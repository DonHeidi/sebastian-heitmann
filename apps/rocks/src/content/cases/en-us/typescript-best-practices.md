---
title: 'TypeScript best practices — skills for coding agents'
summary: 'Opinionated TypeScript best-practice skills for AI coding agents, design stage: skills as the product, versionless templates, and a first slice covering project setup on the Bun toolchain.'
kind: 'project'
role: 'Concept and design'
stack: ['Agent skills', 'TypeScript', 'Bun', 'Markdown']
cover: ../../../assets/cover-art-blue-menagerie.png
startDate: 2026-06-30
links: []
featured: false
draft: false
---

## The setup

A repository of opinionated TypeScript best-practice skills for AI coding agents. The conventions live inside skills (a SKILL.md plus copyable template files) that other projects and agents consume, rather than in a document humans are supposed to remember.

## What makes it interesting

The design commits to freshness over memory: templates carry no pinned dependency versions, because agents are routinely a major release behind, so versions resolve from the registry at install time. There are no executable scripts, no generator, and no dist: a capable agent performs the setup itself, guided by the skill.

## Setlist: stack highlights

- Skills as the product: SKILL.md plus copy-in templates, no build step
- Freshness over memory: no dependency versions authored from model memory
- First slice: TypeScript project setup on the Bun toolchain

## Status

Design stage. The first skill has an approved design; further areas (type design, code style, testing) are scoped as later slices.
