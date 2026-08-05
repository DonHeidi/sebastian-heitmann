---
title: 'TypeScript Best Practices — Skills für Coding-Agents'
summary: 'Meinungsstarke TypeScript-Best-Practice-Skills für KI-Coding-Agents, im Design-Stadium: Skills als Produkt, versionslose Templates und eine erste Scheibe für das Projekt-Setup auf der Bun-Toolchain.'
kind: 'project'
role: 'Konzept und Design'
stack: ['Agent-Skills', 'TypeScript', 'Bun', 'Markdown']
cover: ../../../assets/cover-art-blue-menagerie.png
startDate: 2026-06-30
links: []
featured: false
draft: false
---

## Ausgangslage

Ein Repository meinungsstarker TypeScript-Best-Practice-Skills für KI-Coding-Agents. Die Konventionen leben in Skills (eine SKILL.md plus kopierbare Template-Dateien), die andere Projekte und Agents konsumieren, statt in einem Dokument, das Menschen sich merken sollen.

## Was daran interessant ist

Das Design setzt auf Frische statt Gedächtnis: Templates enthalten keine gepinnten Dependency-Versionen, weil Agents regelmäßig ein Major-Release hinterherhängen; Versionen werden zur Installationszeit aus der Registry aufgelöst. Es gibt keine ausführbaren Skripte, keinen Generator und kein dist: Ein fähiger Agent führt das Setup selbst aus, angeleitet vom Skill.

## Setlist: Stack-Highlights

- Skills als Produkt: SKILL.md plus Copy-in-Templates, kein Build-Schritt
- Frische statt Gedächtnis: keine Versionen aus dem Modellgedächtnis
- Erste Scheibe: TypeScript-Projekt-Setup auf der Bun-Toolchain

## Stand

Design-Stadium. Der erste Skill hat ein abgenommenes Design; weitere Bereiche (Type-Design, Code-Style, Testing) sind als spätere Scheiben eingeplant.
