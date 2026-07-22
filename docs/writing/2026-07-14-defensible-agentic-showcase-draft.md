# 76 Hours, Public Repository: An AI-Development Claim You Can Actually Check

Most claims about AI-accelerated software development arrive as a multiplier. Five times faster, ten times cheaper, one developer replacing a team. The numbers grow with every retelling while the evidence stays at zero, so decision-makers have adjusted the only way they can: they discount everything. That reaction is rational, because a claim you cannot check is indistinguishable from marketing, however true it might happen to be.

In July 2026, the creator of the Bun runtime documented how roughly half a million lines of Zig were [ported to Rust in eleven days](https://bun.com/blog/bun-in-rust), using up to 64 AI agents in parallel and approximately $165,000 in API usage. The project in this article comes from the same movement at a much smaller scale: one to five agents at a time on a $100-a-month subscription. What hasn't kept pace, at either end of that range, is the answer an outsider needs: what was actually done, what did it cost, and can the result be trusted?

This case is built to be checked. Between March and July 2026, I rebuilt my website and everything behind it with AI agents writing effectively all of the code: a website in two languages, the serverless email service behind its contact form, and the cloud infrastructure and deployment tooling that run all of it, defined as code. The development took roughly 76 supervised person-hours. The [repository is public](https://github.com/DonHeidi/sebastian-heitmann), the estimation method is documented inside it, and the places where the agents failed are part of the account. None of it is hard engineering, and that is the point: the showcase is the working method and its measured cost.

Five things have to be on the table for that to work:

- what the 76 hours actually bought,
- how the hours were counted,
- what the human contribution consisted of,
- how the pace compares against my own hand-coded baseline,
- and where the approach broke.

## What 76 hours bought

A few boundaries first, because the number is only honest with them attached.

The 76 hours cover development work only. Writing the text of articles and marketing copy is content creation: a real cost, but a different discipline, and mixing the two would hide what the development itself costs. Research is outside the count for the same reason: reading, evaluating technologies, and forming opinions about tools happened before and between the measured sessions, as it does on any project.

The figure represents reconstructed human working time, not elapsed project duration. The work spread across roughly four months of part-time attention, in sessions between fifteen minutes and six and a half hours, alongside client work and everything else.

And the total includes the project's beginnings: about six and a half of the 76 hours were conventional hand-coding from the 2025 start, before agents entered the picture. They stay in the count because they are part of what shipped, and they become useful later in this article as a point of comparison.

Here is what shipped in those hours, translated out of the commit log into plain terms:

| Deliverable | In plain terms | Hours |
|---|---|---|
| Visual design & design system | The site's typography, colors, and light/dark mode, including five complete design directions that were built, compared, and discarded before the final one | ≈ 18 |
| Pages & sections | Homepage, service pages, a CV page with print-ready PDF export, error pages | ≈ 18 |
| Cloud infrastructure & deployment | Hosting, CDN, a serverless email service behind the contact form, and deploy scripts, all defined as code, so the entire setup can be rebuilt from a fresh machine | ≈ 14 |
| A second application | A job-directory app: built, migrated to a different framework, later extracted into its own project | ≈ 8 |
| Article platform | The publishing system this article appears on: listings, categories, reading time, structured data for search engines | ≈ 7 |
| Two languages | Full English and German versions of every page, with correct URLs and search-engine signals | ≈ 4 |
| Legal & search visibility | Imprint, privacy policy, GDPR-compliant self-hosted fonts, sitemaps and metadata | ≈ 3.5 |
| Project setup & tooling | Repository structure, reproducible development environment, secrets management | ≈ 3.5 |

The figures are rounded per area; the repository carries a [day-level timesheet](https://github.com/DonHeidi/sebastian-heitmann/blob/main/docs/timesheet-development-2025-04--2026-07.md) with the dated work log, the exact numbers, and the grouping rules. Reading the table takes a minute. Reading the git history behind it takes an afternoon.

Translated into money, the table becomes a value statement. At my average consulting rate of €110 per hour, the 76 hours value the development work at €8,360. Based on my conventional working pace and professional experience, I estimate that the same scope would take roughly 200 to 400 hours without agents: at the same rate, €22,000 to €44,000 in development work. The comparison is scope-for-scope rather than invoice-for-invoice. A client project would probably skip some of the design exploration counted here and add content work that is excluded from this calculation. The order of magnitude nevertheless holds.

One line of the table deserves a closer look, because it shows where the compression actually lands. In a single afternoon of about four and a half hours, the agents built five complete design directions as clickable pages: a spaceship-manual theme, a cyberpunk theme, a Swiss editorial layout, a brutalist layout, and the dark variant that eventually won. Under conventional development, each direction would have cost days, so the honest choice would have been to compare sketches and commit early. Here, exploration became cheap enough to compare finished artifacts instead. The final design was chosen from five real candidates in the browser. The compression does not just make the same work faster; it changes which decisions you can afford to make properly.

## How the hours were counted

The repository holds 285 commits between April 2025 and July 2026. Counting them would measure nothing useful, because agents wrote them. Commit counts and diff sizes now measure agent throughput, and agent throughput is cheap. The scarce resource is human attention, because that is what a client would actually be paying for. The method therefore counts that instead.

Commits cluster into work sessions: a gap of more than one to two hours starts a new session. A session costs its wall-clock span from first to last commit, plus a lead-in estimate for the thinking that precedes a single-commit session, scaled to the complexity of the change. Automated commits (a nightly data job that committed on schedule at 02:30) count as zero. Content writing is excluded, as above. Commits from parallel branches and worktrees sort onto one shared timeline, and overlapping periods merge into a single session rather than adding up: several agents working simultaneously do not create several human hours.

**This measure has a property worth pausing on: agent speed cannot inflate it.** When agents produce twelve commits in ninety minutes, the method records ninety minutes. What remains is an estimate of the human-side session time: the specifying, reviewing, redirecting, and waiting that occurred inside that window.

The residual uncertainty runs in both directions. Lead-in estimates for single-commit sessions are necessarily approximate and can move the total either way. Session wall-clock includes some waiting for agents to finish, which tends to overstate active attention; work performed before the first commit or without a resulting commit is missed, which tends to understate it. I therefore publish a range of 70 to 85 hours around the central estimate of 76, and I would defend any point inside it.

A number with a method can be challenged, recomputed, and applied to someone else's repository.

The method also transfers. Any team already working with agents has a git history in which the same session structure is visible, and clustering it takes an afternoon. If your organization wants to know what its AI-assisted work actually costs in human attention, this is a cheaper and more honest instrument than asking people to estimate their own hours after the fact.

## What the human contribution was

The agents wrote the code. Here is what I did in the hours the timesheet records.

**I decided the technology and explained how to use it.** I chose the framework, the hosting approach, the infrastructure design, and the tooling, and encoded those decisions, the project's conventions, and its known pitfalls into instruction files the agents load with every task. This context engineering is ongoing work rather than setup: every convention an agent cannot infer is a convention someone has to write down, and every caught mistake becomes a candidate for the file.

**I structured the work as tasks with explicit descriptions** (what the change is, what it must not touch, and what done looks like) and held every task to the same path: understand, plan, design, implement, test, review. Each step needed intervention at some point, because agents drift. They lose the thread during long tasks or optimize for finishing rather than finishing well. When a problem appeared, my job was either to supply context the agent could not have had or to confront a shortcut it should not have taken. Telling those two apart quickly is where the supervision hours concentrate; the section on failures shows one of each kind.

**That work has a peculiar property: it is invisible in the repository.** Git records what the agents wrote, but not what I prevented. Redirects and rejected shortcuts appear in the output only as absences, such as the outdated dependencies that are not there. Supervision leaves exactly two traces. The hours, measured in the published timesheet. And the rules: every intervention that generalized became a line in the instruction files, which is why the repository's agent instructions read like a fossil record of caught mistakes.

**For the most recent slice of the project, the traces go one level deeper.** The agent platform keeps a transcript of every working session, and retention preserved the last month of them: eleven sessions between mid-June and mid-July, covering the deployment tooling and the work on this article. In that month I sent 114 instructions, about 3,400 words in total (roughly the length of this article). The agents answered with over 1,700 messages: 363 shell commands, 117 file edits, 67 sub-agents dispatched.

That is one human instruction every eight minutes of active session time, each answered by about fifteen agent messages. None of the 114 was a mid-task abort; corrections arrived as the next instruction, and 26 times an agent paused to put a decision to me before proceeding. Whether that month is representative of all 76 hours I cannot show; the earlier transcripts have expired. But it is measured rather than remembered, and the measurement transfers: count your instructions, count the agent's actions, and you have the same ratio for your own work.

Mapped onto familiar roles, the work combined solution architecture, technical leadership, and quality assurance. I have argued on this site before that software development is becoming a management discipline; this project is what that argument looks like when it is carried out. The 76 hours contain almost no typing of code, and they were still the binding constraint on everything the agents produced.

## The repository contains its own historical baseline

The project started in April 2025 as a conventional, hand-coded build. Those early sessions are still in the history, and they make an unusually clean comparison possible. The comparison keeps several important factors constant: the same developer, project, and repository. The main change was the working method, although the individual tasks were not identical.

**In April 2025, about five hours of hand-coding** produced a hero section, a logo strip, and an animated text component: the beginnings of a landing page.

**On the evening of March 23, 2026, one session of about six and a half hours** produced mobile responsiveness fixes, an error page, a restructuring of the repository into a monorepo, a working contact-form backend, and the complete cloud infrastructure (storage, CDN, serverless function), defined in code and deployed to production.

The monthly totals extend the comparison beyond a single evening. March 2026 holds 26 of the 76 hours, and those 26 hours delivered the homepage build-out, the five design explorations, the consolidation into the final design system, the two-language support, the monorepo restructuring, and the deployed infrastructure. At my conventional pace, that list would have filled a quarter.

The rhythm of the commits tells the same story at a glance. The 2025 entries arrive slowly, one hand-built component at a time. The 2026 entries arrive in bursts minutes apart, following a repeating pattern: a design document, then an implementation plan, then the implementation in small reviewed steps. That pattern is the visible trace of the working method described in the previous section.

Across the whole project, the comparison works out to roughly a three-to-five-fold compression against my own conventional pace. Not ten: three to five, on this project, under conditions I will qualify at the end. The smaller number is the one that survives scrutiny.

## Where the agents failed

Two failures from this project are worth telling in detail, because they mark the current boundary of what agents do well on their own, and because they are different in kind.

**The first is a knowledge failure.** When a task needed a new library, the agents tended to write the dependency entry directly into the project's package file, from memory, instead of asking the package manager to install the current version. Model memory is training data, and training data ages: the versions were outdated. Outdated dependencies raise security exposure and forfeit newer capabilities, but the more immediate damage is subtler: related packages drift out of alignment, and you suddenly manage multiple versions of the same software without any particular reason. The intervention was unglamorous: a standing rule in the project instructions that dependencies must be added through the package manager rather than entered from memory, with the current compatible version verified. The error category disappeared. Much of supervision turns out to work this way: noticing a class of mistake rather than an instance of one, then converting it into a durable constraint, the way a technical lead does with a team.

**The second failure is the more instructive one,** because it survives better tooling. Late in the project I introduced varlock, a schema-driven configuration tool. Each part of the project commits a schema file describing the configuration it needs; non-secret values live in the schema as defaults, and secrets resolve at process start from an encrypted vault. The project needs no plaintext secret files, the schema doubles as documentation, and deployments become portable to any machine with vault access. Those properties are why I use it.

varlock is newer than the agents' training data. Confronted with it, the agents were confused, and they stayed confused even after fetching the current documentation from the web. What they produced was subtler than hallucination: it ran, and it was convenient. It also quietly traded the tool's guarantees away. The clearest case: one agent wrote a helper script that read the resolved environment and printed the secrets out, so that later steps could use the values directly, thereby recreating the plaintext exposure that varlock exists to prevent. The agent was trading results for technical debt. It did not account for the technical tax: the invisible interest a convenient shortcut accrues through maintenance, coupling, and security costs. That interest is paid later, often by someone else.

**The distinction between the two failures matters if you are evaluating this way of working.** Knowledge failures are fixable with tools: give the agent the package manager, give it the documentation, and the gap closes. Judgment failures are not, because judgment concerns costs that never appear in the output. The code runs either way; whether it should have been written that way is a cost the agent did not reliably account for while optimizing toward completion. Accounting for it is what the supervising human is for, and it is where most of the 76 hours went.

## What this case proves, and what it doesn't

The conditions favored the approach, and the claim has to carry them. This was greenfield work: solo, on a modern and well-documented stack, with no legacy constraints and no coordination overhead between people. The defensible statement is that agentic development compressed this project by roughly three to five times against my own conventional pace, at a measured supervision cost of 76 hours. A general claim that software development is now five times faster does not follow from one favorable case. I am not making it.

The conditions also cut the other way. The 76 hours include experimentation a second project would not repeat: Scaleway was a new platform to me, and I was developing the working method itself, the task structure, the standing rules, and the failure catalog, while using it on the project. Both are one-time investments that transfer to the next project, which makes the pace measured here the pace of a first attempt.

Generative software development is a young field. Two observations from this project make me read it as a promising one. First, when problems occurred, fixing them cost less than I expected most of the time. The working method reviews everything in small steps, so problems surfaced while they were still one redirect away from being fixed: a stubborn badge element that took nine attempts in a single afternoon stayed an annoyance rather than becoming a crisis. Second, the failures had structure. They repeated in categories, and categories can be managed with rules, as the dependency story showed.

Both observations carry the same condition: they hold when the operator notices.

## What to ask a vendor

That condition suggests what to ask when someone offers you AI-accelerated development: the evidence behind their numbers, the method behind the evidence, and the failure stories behind the method. A vendor who has genuinely done this work has all three and can produce them without preparation, because supervision generates them as a by-product. A vendor who can produce only the multiplier has not provided evidence of the supervision that should generate the rest. The tools are available to everyone; the failure catalog, and the habit of converting it into standing rules, accumulates only through supervised practice.

[The repository is public](https://github.com/DonHeidi/sebastian-heitmann), including the [day-level timesheet](https://github.com/DonHeidi/sebastian-heitmann/blob/main/docs/timesheet-development-2025-04--2026-07.md) and the grouping rules behind every number in this article. That is what defensible means here: every number can be checked. The site you are reading is the artifact they describe.
