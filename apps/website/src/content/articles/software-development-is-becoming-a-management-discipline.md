---
title: "Software Development Is Becoming a Management Discipline. The Old Managers Aren't Invited."
category: "leadership-management"
subline: "Agents aren't replacing engineers — they're replacing the coordination layer above them"
abstract: "Agentic coding doesn't just speed up engineers. It collapses three roles — designer, tech lead, project manager — onto a single operator running multiple projects in parallel. The bottleneck isn't agent throughput; it's the ceiling on sustainable human decisions per day. This piece maps what's actually breaking, who walks away from it, and the practices — Knowledge as Code, judgment-first juniors, decision-capacity org design — that hold up under the new load."
type: "article"
tags: ["AI Agents", "Engineering Leadership", "Org Design", "Knowledge as Code"]
author: "sebastian-heitmann"
headerImage: "../../assets/articles/management-discipline-header.png"
headerDetailImage: "../../assets/articles/management-discipline-detail.png"
publishedAt: 2026-04-13
authorship: "ai-assisted"
draft: false
displayFrontpage: true
---

**The hardest day I've had this year wasn't writing code. It was managing five AI agents for six straight hours.**

By the time I closed my laptop, I was more exhausted than after any week of running a five-person team. The problem wasn't the code, and it wasn't the agents. It was the volume of decisions — somewhere between fifty and a hundred of them — packed into a window where a manager would normally make a handful.

**That day taught me something most coverage of agentic coding keeps missing.**

Agents aren't replacing the engineers. They're replacing the layer that exists *above* the engineers — the coordination, the handoffs, the project management, the part of the org chart that exists to reduce the cost of communication overhead. And the layer that's collapsing is the one most leaders are still trying to protect.

Here's what's actually breaking in software, who walks away from it, and what to do about it tomorrow morning.

## The Hidden Cost Isn't Speed. It's Decisions.

Most arguments about AI productivity are arguments about throughput. Agents ship features faster, write tests faster, refactor faster. The pitch sells itself.

But that framing misses the bottleneck. **The constraint isn't how fast the agents move. It's how many high-quality decisions you can sustain in a day.**

When I orchestrate five agents in parallel, I'm making roughly ten to twenty decisions per agent over the course of an active session. Multiply that out: fifty to a hundred active decisions in a window where a traditional manager might make ten. Each decision is small — accept this approach or reject it, narrow this scope or widen it, change the file structure or live with it — but the cumulative load is what eats the day. I've cut some of it with Domain-Driven Design and tighter context management, both of which reduce the number of "phantom" decisions an agent generates by re-deriving context from scratch. The load is still real.

Here's the part that changed how I think about it. Sitting in a meeting is *passive cognitive load*. You can be sixty percent present and the meeting still happens. Orchestrating agents is *active cognitive load*. You cannot be sixty percent present without the output collapsing on you. This is why "AI makes you ten times more productive" is misleading — it counts the throughput and ignores the focus tax.

My personal cap is about five hours of deep work before concentration starts to slip. Not "useless" — just degraded. Sharper engineers will have higher caps, and rituals around batching and context pruning will lift everyone's. **But there's a ceiling, and the next chapter of the productivity story is going to be about that ceiling, not about agent speed.**

The companies that pretend otherwise will burn out their best operators by Q3.

## "Agent Fatigue" Is the Wrong Frame. This Is Three Roles Collapsed Into One — Multiplied By Every Project.

There are articles about agent fatigue popping up everywhere. Most of them are too deep in the tech bubble to bridge to the right discipline.

What I'm describing isn't fatigue from interacting with AI. **It's a process with multiple decision-makers collapsing into a single person — and then multiplied by every project that person is running in parallel.** Design decisions used to belong to a designer or a senior engineer. Architecture decisions used to belong to a tech lead. Project decisions used to belong to a PM. Now all three decision streams land on the same desk, in the same window, simultaneously. Then you multiply by however many projects are in flight.

The tools are new. **The work isn't.** It's three jobs' worth of decision-making, performed by someone who used to write code for a living — across two, three, sometimes five concurrent codebases.

If you accept that frame, the question stops being "how do we make agents less tiring" and starts being "what does the org chart look like when one engineer is doing the work of a designer, a tech lead, and a project manager — across multiple projects in parallel?"

## Linear Is Killing Its Own Product. They're Right.

The cleanest external signal I've seen on this is from Linear, the issue-tracking company. On their public roadmap page (linear.app/next), they argue that **issue tracking itself is ending**.

This is not a bystander making the claim. It's the incumbent. A company whose product *is* issue tracking is publicly telling you that the category is collapsing.

Why would they say that? Because they understand what issue tracking actually does. **Issue tracking exists to coordinate humans across handoffs.** A ticket is a contract between two people: the one who described the work and the one who'll do it. The PM writes it. The engineer picks it up. The QA confirms it. The EM tracks the throughput. Every column in your Kanban is a handoff between roles.

If you remove the handoffs — because one engineer-operator owns the requirement, the architecture, the implementation, and the validation, with agents providing the capacity — the ticket loses its job. So does the column. So does the board. So does, eventually, the role that existed to manage it.

This is the second-order effect that "AI replaces engineers" coverage keeps missing. The engineers aren't being replaced. **The coordination layer that existed to keep multiple engineers from stepping on each other is being replaced.** PMs, EMs, scrum masters, ticket triagers, status-update generators — that's the layer that's structurally redundant when one person plus agents owns the loop end-to-end.

The reason Linear can say it out loud is the same reason Block could fire 4,000 people: tech-native companies see the change first because they have nothing structural protecting the old layer.

**Capacity is provided by agents now. Humans are part of the loop — but not the workforce behind it.**

## But Most Companies Won't See This for Years. Here's Why.

The collapse isn't happening at the same speed everywhere. There are three tiers, and the difference between them is *workflow inertia*, not technical capability.

**Tier 1 — Tech-native operators.** Block, agencies, indies, AI-first startups. They can adapt because they don't have a thirty-year-old workflow protecting the old org chart. Block firing four thousand people earlier this year is the most visible cut at the enterprise end. The corporate-comms shift became unmistakable in March, when Business Insider began tracking layoff memos as AI-era strategy manifestos rather than cost-cutting announcements.

At the smaller end, look at Black Forest Labs — a small, elite team out of Germany shipping the FLUX image-generation models that have moved the entire market, with an engineering footprint that would barely staff a single feature team at a traditional incumbent. AI-first companies of that shape are already shipping production software at scales that used to require twenty- and thirty-person teams, with engineering headcounts in the single digits. The org-chart shift isn't coming. It's already running, in real time, at the top of the market.

**Tier 2 — Mid-tier digital companies.** Established SaaS, mid-sized product orgs, digital agencies with twenty to two hundred people. They will move, but slower. They have one foot in the new model and one foot in process they haven't dared to retire. Expect headcount freezes, then quiet attrition in the PM and EM ranks, then an awkward reorg announcement in 2027 or 2028. Predictable lag of one to three years behind the operators.

**Tier 3 — Regulated incumbents.** Banking, automotive, pharma — anywhere a regulator sits on the other side of every production change. **The constraint isn't AI capability; it's the workflow the AI has to fit into.** New audit frameworks and compliance tooling have to land before the org chart can move. Years away. Maybe a decade.

This map matters because most "AI is changing everything" coverage flattens it. The reality is staggered, and **the staggering itself is a strategic opening** — for consultancies, for one-person operators, and for anyone selling into the gap between tier 1 and tier 3.

## We Don't Need Fewer Juniors. We Need a Different Junior.

The "AI is killing junior engineering jobs" headline is half right. The old junior role is dead. **A new junior role is needed — and nobody's designed it yet.**

The old junior role was about throughput. You hired juniors to write the code that seniors didn't have time to write. They paid their dues by shipping the unglamorous tickets. Their value scaled with how fast they could produce code that mostly worked.

Agents do that now, faster and cheaper. So that role is gone.

But the new role, if you design it right, is more interesting than the old one. It's not entry-level production. **It's entry-level domain expertise — in software itself.**

The clearest analogy: it's how a software developer used to learn accounting in order to ship a better invoicing feature. The developer didn't need to *be* an accountant. They needed to understand accounting deeply enough to model it, interrogate it, and judge whether the system they'd built actually reflected how accountants think.

That's the new junior. **Programming languages as a domain, not a usable tool.** They learn type systems, paradigms, architecture patterns, failure modes — not to produce code, but to read what agents produced, challenge architectural decisions, design test strategies, and study where things go wrong. Their value scales with judgment, not throughput.

*The developer who used to learn accounting now needs juniors who learn programming the way that developer learned accounting.* The discipline of software is becoming its own external domain.

I'm not sure "junior" is even the right word — it carries throughput-era baggage. Maybe apprentice. Maybe software analyst. Maybe something the field hasn't named yet. But the role is real, and the companies that figure out how to hire and train for it first will have a five-year advantage over the ones still posting "looking for a junior who can ship features fast."

## Knowledge as Code Is the New High-Leverage Repo Artifact

**Knowledge as Code (KaC) is the practice of version-controlling your domain language alongside your code, so humans and agents share one understanding of what things mean.**

The mechanism is mundane: Markdown files in the repo that fix the meaning of every term that matters. The agent reads them on every session and stops re-inventing terms, drifting from the model, or generating decisions that exist purely because it didn't know what something was called. Fewer phantom decisions. Less fatigue. Higher sustainable hours. It's the cheapest, most underrated lever in the entire stack.

Here's what it looks like in practice. In a billing codebase I worked in, the word "subscription" meant three different things depending on who you asked: the Stripe object, our internal contract record, and the customer-facing plan. Every agent session re-litigated which one was meant — sometimes producing code that conflated all three. A two-page `UBIQUITOUS_LANGUAGE.md` that said *Subscription = the Stripe object; Contract = our internal record; Plan = the marketing-facing tier* killed an entire category of phantom decisions overnight. Not better prompts. Not a smarter model. A glossary.

It also reframes what the engineer-operator and the new junior actually *produce*. The high-leverage artifact stops being the API endpoint and becomes the glossary, the architecture decision record, the explicit naming of the domain. **It becomes more important to write a good glossary than it is to actually write an API endpoint.** Code is the cheap part now. Meaning is the expensive part.

We've already accepted Infrastructure as Code. We've accepted Policy as Code. KaC is the next member of the family:

- **IaC** — infrastructure becomes reproducible.
- **CaC** — configuration becomes auditable.
- **PaC** — governance becomes enforceable.
- **KaC** — domain understanding becomes shared between humans and agents, and version-controlled like everything else.

If you do nothing else this quarter, do this one. Spend a week writing the glossary your codebase has always been missing. Drop it in the repo as `UBIQUITOUS_LANGUAGE.md`. Reference it from your agent prompts. Watch your decision count drop.

If you're a founder or a team lead in tier 1 or tier 2, the smart move isn't waiting for the dust to settle. It's redesigning your team around decision capacity now, hiring for judgment instead of throughput, and writing the Knowledge as Code your repo has always been missing.

**Meaning has always been the expensive part. Build your team around it.**
