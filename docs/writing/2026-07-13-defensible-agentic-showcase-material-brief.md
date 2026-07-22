# Material Brief: The Defensible Showcase — 76 Hours of Agentic Development, With Receipts

**Core idea:** Every AI-development claim you've heard is unverifiable — "10x faster" with nothing behind it. This case publishes the opposite: a complete production website and infrastructure built in ~76 supervised person-hours, with the git history, the estimation method, and the failure stories all on the table. The showcase isn't the technology (deliberately modest); it's the defensibility of the evidence — and what the work actually consisted of: orchestration, not implementation.

**Audience:** Skeptical prospective clients — founders, SME decision-makers, team leads who hear "10x with AI" everywhere and trust none of it. They should leave thinking: "this is the first AI-productivity claim I could actually audit."

**Reader stakes:** They're being sold AI acceleration constantly and can't tell substance from hype. Dismissing it all means missing a real cost structure shift; believing it naively means buying vaporware. This piece gives them a calibrated middle: what the speedup really is, what it costs in supervision, and what evidence to demand.

**Content bucket:** Niche Audience — "Building products with AI workflows — what actually works, not the demo" / "What a one-person agency can deliver that a traditional team setup can't." Secondary: Industry — architecture/tooling/workflow decisions.

**Likely format:** Blog article (canonical, 2,500–3,000 words per purpose.md), published in the site's own articles collection — which is itself part of the evidence, since the article lives inside the artifact it describes. LinkedIn/X derivatives later via distill.

**Credibility angle:** First-party operator evidence. The author built it, supervised it, and published the timesheet. The repo provides a within-project control group (2025 hand-coding vs. 2026 orchestration). The claim connects to his previously published thesis ("Software Development Is Becoming a Management Discipline") — this case is that article's lived proof. Authorship flag: ai-assisted, consistent with site convention.

---

## Live Threads

### The defensible number
~76 development person-hours (defensible range 70–85) from April 2025 to July 2026, with the real work concentrated March–July 2026. Method fully disclosed: cluster 285 commits into sessions (>1–2h gap = new session), count session wall-clock plus complexity-scaled lead-in, exclude content writing and automated cron commits. Key insight: session wall-clock is the *right* metric for agentic work because the human hours ARE the supervision wall-clock — a burst of 12 agent commits in 90 minutes counts as 90 minutes, so agent speed doesn't inflate the number. Monthly totals published (March 2026: 26h; April: 16.25h; May: 12.5h; June: 12.5h). Full timesheet exists in `docs/timesheet-development-2025-04--2026-07.md`.

### The control group in the repo
Same person, same repo, two eras. April 2025, conventional hand-coding: ~5 hours bought a hero section, a logo strip, and a typewriter component. March 23, 2026, agentic orchestration: one ~6.5-hour session bought mobile responsiveness fixes, a 404 page, a monorepo conversion, a wired-up serverless contact form, and complete deployed Terraform infrastructure (function, object storage, CDN). The comparison controls for developer, project, and codebase — only the workflow changed. Strongest single piece of evidence; more persuasive than any external benchmark.

### The role thesis: orchestration is the work
What the human actually did: decided the technology and explained how to use it; shaped context and engineered the agent's project-scoped knowledge; decided infrastructure and hosting approach; created tasks with descriptions; enforced a distinct path of understanding → planning → designing → implementing → testing → reviewing. Each step needed human intervention — the AI gets lost — but the role was orchestration, not implementation. When problems occurred: provide more context or directly challenge the agent. Self-description: "Solution Architect, Technical Lead, QA, and similar — not because of the responsibility but how the set of tasks were structured. I was the technical project manager with the autonomy/authority of a technical director or CTO." Direct continuation of the published "management discipline" thesis.

### Supervision reality — two failure stories
Two concrete, deliberately mundane failure categories that prove supervision was real work:

1. **Stale knowledge (dependencies from memory):** Instead of adding dependencies through the package manager, the agent wrote dependency entries from memory — outdated versions. Consequences: potential security issues, missed capabilities, and worst: mismatched dependency trees — "you suddenly manage multiple versions of the same software without any particular reason." Intervention became a standing rule: dependencies only via `bun add`, always latest.
2. **Missing judgment (the varlock story):** Confronted with a new technology (varlock), the agent was confused *even with fetched web documentation*. Not hallucination — "trying to be too convenient and trading results for technical debt. It doesn't understand the technical tax." This story defeats the obvious rebuttal ("just give it web access"): the failure isn't missing knowledge, it's missing judgment about invisible cost curves. Knowledge failures are fixable with tools; judgment failures are why the human hours exist.

### What varlock is (context capsule for the story)
Brief reader-facing summary needed in the article: varlock is a schema-driven env/config manager — a committed `.env.schema` per workspace is the single source of truth for config shape; non-secret values are committed defaults, secrets resolve at process start via function resolvers (here: `protonPass(pass://…)` against a Proton Pass vault via pass-cli). Nothing sensitive ever lands on disk; every dev/deploy command runs behind `varlock run --`. Why the author uses it: no plaintext `.env` files, deploys portable to any machine with vault access, schema doubles as config documentation, explicit `@sensitive` marking instead of naming conventions. (Source: `docs/superpowers/specs/2026-06-12-varlock-proton-pass-design.md`.)

### Honest caveats as a feature
The defensibility comes from what is NOT claimed: (a) fast in person-hours, not calendar time — ~70h spread over four months of part-time attention; the honest claim is low effective cost, not overnight delivery. (b) Near-ideal conditions for agentic work: greenfield, solo, well-documented stack, no legacy constraints, no coordination overhead. (c) Therefore the defensible claim is "roughly 3–5x compression on this project" — not "development is now 5x faster" in general. The first survives scrutiny; the second invites it. Not padding the estimate is itself the credibility move.

---

## Evidence, Examples, And Stories

- 285 commits, April 2025 – July 2026; session-clustered timesheet totaling 76.0 dev hours; monthly breakdown available.
- Scope shipped in those hours: multi-locale (EN/DE) site with custom design system and light/dark theming, five throwaway design explorations (one 4.5h afternoon), content/articles system with SEO plumbing, GDPR/legal pages, CV page with PDF export, serverless contact-form backend, full Terraform IaC on Scaleway (function, storage, CDN, TEM, remote state), secrets management (varlock + Proton Pass), portable deploy tooling — plus a separate job-directory app built, migrated to another framework, and extracted (~8h).
- The March 23, 2026 session (control-group anecdote) — one evening, deployed infrastructure.
- The spec → plan → implement commit cadence visible in the history (minutes apart) as the agentic signature; 2025 commits show the older rhythm.
- Dependency-versions-from-memory story (standing-rule intervention).
- Varlock confusion story (judgment failure despite documentation).
- Nine fix-commits on one badge element (March 20) — honest texture of iteration cost, usable as a light aside.
- The article publishes inside the site it describes — the artifact is the receipt.

## Strong Takes

- Commits are no longer evidence of effort; supervision wall-clock is. Counting commits or diff size to measure agentic work is meaningless.
- Agentic tooling reduces the development work, not the work on the side — the side-work (architecture, task structuring, review, challenge) IS the job now.
- The agent optimizes for visible outcomes and is structurally blind to the technical tax; pricing in invisible cost is the human's irreplaceable contribution.
- A claim you can't audit is marketing; a claim with a published method is an invoice you'd defend.
- Software development is becoming a management discipline — this project is the demonstration.

## Reader Stakes

- Decision-makers can't distinguish real AI acceleration from hype and are making build/buy/hire decisions on bad priors.
- Misreading the cost structure: the money no longer buys typing, it buys judgment — a different thing to hire for and to evaluate.
- What they should demand from anyone selling AI-accelerated development: auditable evidence, stated method, disclosed failure modes. (Thread deliberately left open — see Thin Spots.)

## Tensions And Objections

- "10x claims are everywhere" vs. a 3–5x claim with receipts — deliberately smaller number, deliberately stronger.
- Person-hours vs. calendar time — the article must not let readers conflate them.
- "Just give the agent internet access" — defeated by the varlock story (judgment, not knowledge).
- Ideal-case objection — conceded up front: greenfield, solo, no legacy. Generalization explicitly declined.
- The author sells this as a service (one-person agency) — bias is disclosed by the site context itself; full-disclosure stance mitigates.
- AI-assisted authorship of an article about AI-assisted work — flagged via the site's existing `authorship: "ai-assisted"` convention; consistent with the author's published philosophy that well-generated content should carry a real POV.

## Sharp Language

- "the technical tax"
- "trading results for technical debt"
- "the repo contains its own control group"
- "person-hours, not calendar time"
- "orchestrated rather than implemented"
- "technical project manager with the autonomy of a CTO"
- "you suddenly manage multiple versions of the same software without any particular reason"
- "the artifact is the receipt"

## Parking Lot

- A separate practitioner-facing piece on the session-clustering estimation method itself (how to build a defensible timesheet from git history) — more technical audience than this article.
- A piece on standing rules / context engineering: converting caught agent errors into durable project constraints (CLAUDE.md/AGENTS.md as management artifacts).
- The 1-in-10 experiment framing: this site as one experiment in the portfolio.
- Pricing agentic work: at the author's €110/h rate the showcase cost €8,360 — under the €20–40k an agency would quote for the same scope. Hourly billing hands the whole 3–5x compression to the client; value/scope-based pricing shares it. The published timesheet is the trust instrument that makes non-hourly pricing sellable. Natural sequel to the showcase article, same skeptical-buyer audience.

## Resolved (formerly Thin Spots)

- **The reader's move (author's call):** Generative software development is a young but promising field. When problems occur, the costs are lower than expected most of the time. The concrete recommendation: seek out developers who *specialize* in generative development — not generic developers with AI tools bolted on. The specialization (context engineering, supervision discipline, knowing the failure modes) is what converts the promise into the receipts.
- **Verifiability (author's call):** The repository will be made public — readers can audit the git history directly. History was scanned before publication (no secrets, no keys, only placeholder examples and public-domain email addresses ever committed). The article additionally includes a **tabular overview of what was built, translated for non-technical readers** — the on-ramp for decision-makers who won't read a git log. The table + public repo + published method = the full defensibility stack: every layer of the claim is inspectable at the reader's preferred depth.
