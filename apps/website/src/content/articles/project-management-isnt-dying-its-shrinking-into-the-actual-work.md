---
title: "Project Management Isn't Dying — It's Shrinking Into The Actual Work"
category: "leadership-management"
subline: "The ticket is dead. The work it was pretending to do never was."
abstract: "The apparatus around software delivery — tickets, sprints, standups, boards — is dissolving because the unit of execution has shrunk past the management overhead built around it. What remains is context management: curating what agents assume, qualifying requests before code gets written, and reviewing output after. The PM skills that matter — sense-making, translation, stakeholder alignment — don't vanish; they relocate into the engineer's orbit. This piece maps that relocation from the perspective of someone who has been an engineer, a project manager, and is now shipping as a one-person agency without a single ticket."
type: "article"
tags: ["Project Management", "AI Agents", "Agentic Workflows", "Context Management", "Engineering Leadership"]
author: "sebastian-heitmann"
headerImage: "../../assets/articles/project-management-header.png"
headerDetailImage: "../../assets/articles/project-management-detail.png"
publishedAt: 2026-04-17
authorship: "ai-assisted"
draft: false
displayFrontpage: true
---

**Project management isn't dying — it's shrinking into the work itself.**

The ticket, the sprint, the standup, the board: the apparatus that used to sit around the work is dissolving into it. The real PM skills — sense-making, translation, keeping the picture of the world in sync — don't vanish; they relocate, mostly into the engineer's orbit. I've consulted companies on agile practices, I was a project manager after I was an engineer, and I'm currently shipping a product as a one-person agency without a single ticket. What I'm seeing isn't a tool change. It's the unit of execution shrinking past the management overhead built around it.

**Where that overhead goes is the part most of the "AI replaces project managers" noise is missing.**

## I don't manage tickets. I manage context.

**On my current project, I don't track work in any traditional sense.** There is no Jira, no Trello, no GitHub Projects board with columns labeled To Do, In Progress, and Done. The standard apparatus isn't ignored — it's absent by design.

When I want to know what's been done, I ask the agent. It reads the git log, carries the conversation context from my last session, and tells me what landed in the past few days, what's open, and what the sensible next step is. When I want to capture an idea for later, I don't make a card in a backlog — I describe the idea to the agent and it attaches the note to the work it relates to, so the context travels with the thing it's commenting on rather than disappearing into a separate tool.

This sounds like productivity-theater minimalism. It isn't. **It works because the underlying job of a ticket — shared understanding of what's happening — is now being served by a faster, tighter medium.** A row in a database was never the goal. The goal was a picture of state that was up to date, complete enough to act on, and specific to the piece of work in front of me. Git commits plus a conversation with an agent give me that picture faster than any Kanban board ever did, and they do it without the ceremony of moving a card between columns to signal a thing that already happened.

The artifact collapses into the work. **That's the whole move.**

## The ticket was always an artifact of bad unit economics.

Here's the history nobody wants to tell: **the ticket exists because the unit of execution used to be too big for anyone to hold in their head.**

When a single piece of work took days or weeks, and the person doing it wouldn't see the person who asked for it for an entire sprint, you needed an artifact. You needed a row in a database. You needed columns, states, assignees, comments, attachments, and changelogs — because the work was opaque and slow, and because the organization spanning the work was wider than any one conversation could cover. The ticket wasn't a feature of mature engineering. **It was coping.**

Now the unit is smaller. A feature that used to take a week takes an afternoon. A bug that used to need a handoff gets fixed in the same session as the person who reported it. The work no longer needs its own database record to be legible to the people around it — you can describe what you did in a commit, in a comment, in a conversation, and that description is up to date with reality in a way a card on a board almost never was.

**Tickets aren't dying because tooling killed them. They're dying because the problem they were solving is shrinking to nothing.**

That's a different story. The companies investing harder in their ticketing workflows right now are not modernizing. They're optimizing the horse and cart.

## Context management is real work — and it's broader than status tracking.

When I say "I manage context," I don't just mean I track what's done. I mean something harder and less glamorous.

**My current project is built with TanStack Start.** It's a young framework — not Next.js, not Remix, not any of the stacks LLMs have seen a million examples of. That underrepresentation in training data has a specific consequence: the agent, left to its own priors, drifts. It will try to turn my server-rendered multi-page app into a single-page application, because that's the shape most of its training data took. It will reach for a Next.js pattern inside a file that's supposed to follow TanStack Start's fullstack conventions. It will quietly import the wrong mental model into my codebase.

Every one of those drifts I have to catch — and the move that scales is to write each catch down once, where the next run reads it. **The framework itself becomes the domain.** A growing set of instruction files captures how TanStack Start wants to be used: what's idiomatic, what to prefer over the Next.js reflex, which patterns to flag for review, which file shapes are non-negotiable. That isn't babysitting. **It's curating the boundaries of what the agent assumes — which is the modern equivalent of writing a domain model, except the domain isn't the business; it's the framework.**

Take TanStack Start's server functions. They rhyme with Next.js server actions, and that rhyme is exactly where the agent drifts. So I wrote down what a server function actually is in this framework, when to reach for one, and which file shapes are non-negotiable around it. That note is now the first thing the agent reads before touching those files. **Every missing shared word is a future drift. Every ambiguous term is a future hallucination.** Ubiquitous language is an old DDD concept, but I hadn't thought to apply it to human-agent collaboration until I saw Matt Pocock do something close to it in [*Building a REAL feature with Claude Code: every step explained*](https://www.youtube.com/watch?v=hX7yG1KVYhI). **Domain-driven design isn't architect ceremony anymore. It's infrastructure.**

## The engineer's new job is qualification and review.

**The coding part of the job is shrinking. The parts around it are growing.**

The productive work has relocated to two places. **At the front end**, the engineer qualifies the request — turns a vague ask ("make this feel faster," "users want dark mode," "we need to handle edge cases better") into something that can be executed, and catches the wrong thing being asked for before a line of code gets written. **At the back end**, the engineer reviews the output — reads what the agent produced, intervenes when it drifts, decides whether to accept, reject, redirect, or rewrite.

The middle — the typing — is the part that's disappearing. That isn't a downgrade. **Qualifying well is harder than typing. Reviewing well is harder than typing.** It's also where taste, experience, and domain knowledge actually live.

**Qualification is the part most people underestimate.** When a stakeholder says "users want dark mode," the engineer's job is no longer to go build a toggle. It's to ask the questions that decide whether the real problem is contrast, battery life, the lighting of a specific common workspace, or a surface-level request being used to dodge a harder conversation. Those questions used to belong to a product manager. Now the engineer either asks them, or sets up an agent to ask them. Either way, **the answer shapes what gets built — and the judgment about whether the request even deserves building in the first place is the part of the job that's getting more valuable, not less.**

## Show, don't tell — prototyping replaces speccing.

**Agent output is cheap enough now that prototyping a working version beats describing the intended version.** The old spec-review-build-demo cycle is flattening into build-show-correct. Feedback loops that used to take weeks take minutes.

Concretely: I don't walk into a first client meeting with a slide deck anymore. I walk in with a first iteration — a working version of what I think they're asking for, good enough to click through, wrong in interesting ways. **The meeting isn't a presentation; it's a correction loop.** They point at what's off, I change it, we look again. What used to be a week of spec → review → build → demo happens in ninety minutes, and the thing we're arguing about is the actual product, not a description of it.

**When you can iterate on the actual thing instead of a description of the thing, whoever has taste wins.**

## If removing the ceremony breaks your team, the ceremony wasn't the problem.

The most common objection: **what about a team of six engineers shipping a regulated product to two hundred stakeholders?**

The test is the same either way. Strip the ceremony and watch what happens. Either the team still ships — in which case the ceremony was overhead — or the team can't ship, in which case the ceremony was papering over organizational rot. Neither conclusion is flattering for the old process.

**If removing the ceremony breaks your team, the organization is flawed, not the technical process.**

## What actually happens to project managers.

I'll say this as someone who used to be one: **the role as we know it is redundant.** Not because project managers have been failing at their jobs — because the unit of execution they were built around has shrunk past them. You cannot run sprint ceremonies on work that finishes in an afternoon. You cannot refine a backlog that doesn't need to exist. You cannot manage stakeholders through an artifact that no longer represents reality.

**But the underlying skills are durable.** Sense-making. Translation between non-technical and technical audiences. Stakeholder alignment. Keeping work value-driven rather than politics-driven. Holding the shared picture of the world steady when everyone else is in the weeds. Those don't vanish. They relocate. Some of them move into the engineer's orbit, because the engineer is now the one with enough context to qualify a request well. Some of them move into whoever ends up owning the knowledge layer — the ubiquitous language, the domain model, the shared dictionary that the agents read from.

**The people I expect to make that transition well are the PMs who were always, secretly, frustrated by the ceremony.** The ones who knew the standups weren't the point. The ones who could never fully explain why the Jira board felt like a decoy, but who ran the best sprints anyway — because they were doing the real work (keeping the picture of the world in sync) under cover of the fake work (moving cards between columns). Those people are about to be able to do the real work directly. The ceremony was slowing them down all along.

Call it "Context Manager" or "Knowledge Engineer" — whatever the name, the skill set already exists inside every PM who ever ran a good sprint. **Knowledge management inside an engineering context is becoming its own discipline.**

**The ticket is dead. The work it was pretending to do never was.**
