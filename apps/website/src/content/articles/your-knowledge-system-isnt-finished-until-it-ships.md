---
title: "Your Knowledge System Isn't Finished Until It Ships"
category: "shipping-with-ai"
subline: "A second brain that maintains itself beautifully and produces nothing is a museum"
abstract: "Andrej Karpathy just published how he uses an LLM to manage his personal knowledge base. Most readers will build the wrong thing — a clean wiki that produces nothing. The step nobody's writing about is wiring your second brain into an agent that produces on your behalf, while you stay on the parts a system can't do for you. Output is delegable. Outcome is not. That's the line."
type: "article"
tags: ["AI Writing", "Knowledge Management", "Agents", "Workflow", "Craft"]
author: "sebastian-heitmann"
publishedAt: 2026-04-15
authorship: "ai-assisted"
draft: false
displayFrontpage: true
---

Andrej Karpathy — co-founder of OpenAI, former head of AI at Tesla, the person behind the deep-learning explainers half the internet has watched — [just published](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) how he uses an LLM to manage his personal knowledge base.

Most of the people reading that gist are going to build the wrong thing. They'll spend the next month organising their notes, setting up ingestion scripts, watching the LLM cross-reference their documents, admiring the compounding artifact they've built — and then stop. Because organising knowledge feels like progress, and a clean wiki feels like something.

**It isn't.**

A second brain that maintains itself beautifully and produces nothing is a museum. The move that matters is wiring it into an agent that produces — while you stay on the parts a system can't do for you.

## The system everyone's building stops one step short

If you write online, build products, or think for a living, Karpathy's gist is worth reading. It lays out a pattern for letting an AI maintain your notes, wiki, research, and references — keeping them clean, cross-linked, and current without the human tax that usually eats second-brain systems alive. The LLM ingests new sources, synthesises cross-references, flags contradictions, and lints for stale claims. You curate and ask questions. It does the grunt work. His framing of the system as a "persistent, compounding artifact" is the right mental model — knowledge that accumulates instead of being rediscovered on every query. It's elegant, and it works. The pattern is sharp and he's the right person to sharpen it.

I use Tiago Forte's CODE method — capture, organise, distil, express — to set up my own knowledge system. That also works. Capture is easy. Organising is easier than you'd think once you commit to a structure. Distilling takes practice but becomes habit. Express is the part that never quite gets automated, because expressing is where the craft lives, and craft doesn't systematise well.

Both patterns stop at the same place. They treat the LLM as a tireless bookkeeper — capturing, organising, maintaining — and leave the "do something with it" problem for the human. The assumption is that once the knowledge is clean enough, output takes care of itself. It doesn't. A tireless bookkeeper gives you a cleaner shelf. A tireless producer gives you work in the world. Those are different systems, and most people are building the first when the leverage is in the second.

Output is its own problem, and a clean wiki is not the same thing as an agent that can produce with your voice, your structural preferences, and your editorial standards. That's the third step.

Turning distilled knowledge into an agent that produces on your behalf — not a wiki that sits there waiting to be queried, but a system that renders your thinking into whatever the moment calls for. A post. A review. A reply. A framework applied to a fresh problem. That's the step nobody's writing about, and it's the step that turns a second brain from an interesting personal project into something that changes how you work.

## The AI can produce output. It cannot produce outcome.

That's the whole argument. Everything else is detail.

By *output* I mean the thing an AI produces: a 1,200-word post in your voice, a distilled thread for a character-limited platform, a rewritten intro, a critical review that spots what's missing from a draft. By *outcome* I mean whether the piece actually lands — whether it reaches the right person, whether it's the right idea for this moment, whether the argument holds up when someone who disagrees reads it. Most of the AI writing discourse conflates the two. When a tool produces plausible text, people say "writing is solved." They're looking at output and ignoring outcome.

Here's the concrete version. I built a Claude Code plugin that runs every stage of my online writing except the part where I decide whether it's worth writing and whether it lands. It discovers my writing purpose, maps my content territory, explores ideas until they have substance, structures posts against proven frameworks, rates them against six quality dimensions, and distils long-form pieces into micro-posts for platforms with character limits. The config is two files. One declares my purpose — motivation, audience, category, point of view, style, vision. The other maps my content buckets — which topics I own, and for whom. Every skill in the plugin reads them. Every review pass checks against them. The writing that used to take me days now takes hours.

It's good — at the output level. At the outcome level, the piece still has to be the right thing to say, in the right voice, at the right moment, to the right people. No amount of config can tell me that.

Here's a specific way the gap shows up. The rate skill recently flagged a piece of mine as low on credibility — it thought the source I cited was fabricated. The source wasn't fabricated. The agent was just being suspicious: the quote fit the argument too neatly, the authority was too well-matched, and it concluded the whole thing looked too convenient to be real. It was wrong. But to know it was wrong, I had to step in, check the source, confirm the citation, and decide what to do about it. The agent produced a clean output — a structured credibility score with specific reasoning. The outcome — is the claim actually sound, is the source actually real, does this make my argument stronger or weaker — was mine to rule on.

That's the pattern in miniature. The agent operates on what it can see. The outcome sits in the context it doesn't have access to.

You might think this line moves as models get smarter. It doesn't, because the line isn't about capability. Even a perfect model can't know what I believe today that I didn't believe last month. It can't know which of my draft ideas I'm actually excited about, versus which one is in the pipeline because it seemed reasonable on the day I outlined it. Models will keep getting better at producing. That doesn't change which decisions are mine.

The plugin doesn't replace my judgement. It compresses my judgement — voice, frameworks, review criteria, audience definitions — into a form an agent can execute. The thinking is upstream, in files. Execution is downstream, and the agent handles it cleanly. But whether a specific piece clears the outcome bar never leaves my desk.

I'm writing this piece with that plugin right now. It found the structure, checked the claims against my purpose, flagged the points that were doing two jobs, and suggested rewrites for the parts that were flat. But it couldn't tell me whether you should be reading this today or something else.

**Output is delegable. Outcome is not. That's the line.**

## I could automate more. I choose not to.

Here's the part that's uncomfortable to say out loud.

Nothing stops an agent from deciding what I should write about next. The tools exist to scan my calendar, track the industry conversations I care about, rank topics by relevance against my content buckets, and hand me a prioritised weekly brief. I could let an agent pick my ideas, schedule my posting cadence, and draft without my involvement until I show up to edit. The technology is there. I don't want it. Direction is the part I refuse to delegate — not because an agent can't do it, but because the point of writing online is to say what I think, and outsourcing *what to think about* is a strange thing to do with that.

This is where I part ways with the maximalist automation argument.

The question isn't what *can* I automate. It's what *should* I. Once you start drawing that line, the second brain stops being a productivity project and becomes a craft decision: which parts of the work stay mine, and why. The answer is different for everyone. For me, it's direction, opinion, and outcome. Everything else can be compressed into config and handed off.

Here's the test I run on any piece of my workflow. If I automate this, does the output carry less of me? Not less of my voice — voice is compressible, and config captures it fine. Less of my *choosing*. Less of my wrestling with which things are worth saying. If the answer is yes, it stays with me, even if the efficiency gain would be real.

The reason to write online is to say what you think. Letting an agent pick what you think about means publishing research the agent did, dressed in your voice. There's a word for that, and it isn't authorship.

## The new loop: AI output as a creative trigger

The conventional model is *AI drafts, human edits*. That's not the model that works.

The model that works is this: AI produces, AI surfaces what's missing, human creates the thing that fills the gap. The AI's output is a trigger for the creative process, not a substitute for it.

Here's what that loop looks like in practice. The rate skill runs over a draft and returns a scorecard across six dimensions — clarity of thesis, originality, structure and flow, credibility, writing quality, positioning power. It doesn't just give numbers. It names what's weak and why: a point doing two jobs, an intro setting up a promise the body doesn't keep, a claim that lacks backing, a section that's structurally correct but emotionally flat. The diagnosis is specific enough to act on.

What the agent cannot do is make the move that answers the diagnosis. It can tell me a section is flat. It can't produce the original line that brings it back to life. It can tell me an argument is thin on credibility. It can't tell me which of my actual experiences would strengthen it, because it doesn't know my actual experiences — only the compressed version of me that lives in the config. Those moves are mine. After the diagnostic, the blank page isn't a blank page anymore. It's a very specific question with my name on it.

The same pattern runs earlier, at the idea stage. The explore-idea skill asks me questions about a topic. The questions that hit are the ones that surface something I hadn't named yet — an angle I'd half-considered, a contradiction I'd been avoiding, a story I hadn't thought belonged. The agent produced the question. The answer came from me, because the answer was already in me somewhere — the question was just the right prompt to pull it out.

That's a different experience from editing a draft. It's closer to the agent running ahead on the trail and marking the places a human has to walk. Attention gets pointed at exactly the parts that need judgement, story, or opinion. The rest is handled while I was working on those.

I've tried the other version — letting the agent go all the way through without the reveal-and-create loop. What comes out is technically fine. It's also flat. The thing that makes writing interesting is a specific human trying to work out a specific problem, and an agent that smooths every rough edge will sand that out too. A clean draft with no rough edges is usually a piece with nothing in it worth remembering.

**The AI doesn't replace creative work. It reveals where creative work has to happen.**

And that changes the economics. Writing stops being hours of generating plus hours of refining. It becomes minutes of generating, one cycle of diagnosis, and then the creative hit where the real work has always been — the moves that are mine to make and nobody else's. The system doesn't speed up the thinking. It just stops wasting my thinking on anything else.

## Build the system. Keep the craft parts human.

If you're reading Karpathy's gist and getting ideas, here's the version I'd build.

Build the wiki. Do the Forte distillation. Let the LLM maintain your knowledge base. All of that is genuinely valuable, and none of it is the finish line. The wiki is an input. What you want on the other side of it is an agent that can render your distilled knowledge into whatever the moment calls for — not as a generic assistant, but as a system aligned with your purpose, your voice, your content territory, and your review criteria.

Compress the parts you can compress. Voice. Frameworks. Structural preferences. Review checklists. Anything that's *how* you work, not *what* you decide to work on. Put it in config files the agent can read on every run, so the system stays aligned without you having to restate it.

Reserve the parts that must stay yours. Direction. Opinion. Outcome. These are the parts that give the work its meaning, and outsourcing them means whatever you publish is a ghost of what it could have been.

Treat the agent's output as a prompt for your creative work, not a replacement for it. The agent running the diagnostic is doing you a favour; the move that lands is still yours to make.

And don't optimise for the wrong metric. The tempting measure is how much of the work the agent is doing. The right measure is how much better the output is when you've drawn the line well. An agent that does 95% of the work and produces 70% of the quality is worse than an agent that does 70% of the work and produces 110%. The second version is the one you're building for, even when it means the agent does less than it could.

## The value you bring is your view.

Here's what the automation discourse keeps missing. What a reader can get from an AI, they can get from any AI. What they can only get from you is your opinion, your view, your specific angle on the thing in front of them. That's the value you contribute as an individual — not the research, not the structure, not the rhythm of the prose. The take. The position. The specific way you see it.

The smoother the AI gets, the more this matters. Every output gets polished. Every draft gets competent. Every piece reads like it was written by someone who knew what they were doing. In a world where that's the floor, the thing that separates one piece from another is everything the system can't generate on its own:

- **Whose direction is behind it** — what they chose to write about, and why they chose it now instead of later.
- **Whose opinion is inside it** — the stake in the ground, not the neutral survey of every angle.
- **Whose outcome they were chasing** — the specific reader, the specific moment, the specific effect the piece was built for.
- **Whose experience it draws on** — the lived detail that no config file can encode.
- **Whose judgement shows up in the edits** — the moves that answered the agent's diagnostics, made by a person who knew which moves would land.

Every item on that list is yours. Every item is what makes a piece worth reading in a world where the mechanics are free.

Forte's method can organise your thinking. Karpathy's pattern can maintain it. The agent can render it. What nobody can do, except you, is decide what you think and why it matters.

Admire the second brain less. Wire it to something that ships. And then remember the shape of what you've built: the system doesn't create value. It multiplies yours. The wiki, the agent, the output — all of it is leverage on whatever you bring to the top of the stack. Bring your view, your judgement, your specific way of seeing, and the system amplifies all of it. Bring nothing, and it amplifies nothing.

You are the multiplier. Everything else is just the coefficient.
