# Diagnostics Report

**Piece:** "76 Hours, Public Repository: An AI-Development Claim You Can Actually Check" — a verifiable case study of AI-agent-built website + infrastructure
**Length class:** Long-form, 2,877 words (via `count-words`, body only, headline excluded)
**Piece type:** Credible Talking Head / case study (descriptive register per tonality.md), with Opinion elements in the closing section

---

### Issues found

**1. Slow intro** — Four full paragraphs plus a bullet list (~16 sentences) run before the first H2. The core promise ("This case is built to be checked... roughly 76 supervised person-hours") lands around sentence 10; the ~5-sentence guideline is exceeded by the second paragraph ("The capability underneath those claims is real, and it is scaling fast...").
- *Why:* Every sentence before the promise delays the payoff the headline already made, and the reader's patience is spent before the piece starts delivering.
- *Suggested fix:* Compress paragraph 2 to two sentences — keep the Bun/Rust stat and the "same movement at a much smaller scale" contrast, cut "What ships scales with what runs, and generative software development already spans that entire range." Then merge paragraph 4 into paragraph 3 (see issue 2), landing the promise by sentence 6–7.

**2. Low Rate of Revelation (intro scope repetition)** — The scope is listed twice back to back. Paragraph 3: "the design system, two languages, an article platform, a contact backend, and the full cloud infrastructure." Paragraph 4: "a website in two languages, the serverless email service behind its contact form, and the cloud infrastructure and deployment tooling that run all of it." The second list restates the first with different nouns.
- *Why:* Sentences that restate the previous sentence's information stall the story instead of advancing it.
- *Suggested fix:* Keep one list (the paragraph-4 version is the more concrete) and cut the other. Also trim the intervention-taxonomy preview in "What the human contribution was" ("Missing context means the agent could not have known better. The fix is information. A wrong approach means... The fix is confrontation.") — the "Where the agents failed" closing paragraph re-derives this same dichotomy in full, so the earlier passage can shrink to one sentence plus the forward-reference.

**3. Mid-piece sag** — "What the human contribution was" (roughly the 60% mark) is the only section with no concrete artifact: no number, no table, no anecdote, no named tool. Three paragraphs of abstract role description ("solution architect, technical lead, and QA at once") that defer their evidence to the next section ("the next section makes both kinds concrete").
- *Why:* Long-form pieces dip at 40–70% when middle points carry less weight than the sections around them, and this section is pure assertion between two evidence-heavy neighbors.
- *Suggested fix:* Move one small concrete example into the section itself — e.g., one actual task description you wrote, or a one-line instance of a redirect — so the section proves rather than only claims. The trim from issue 2 frees the word budget.

**4. Monotone rhythm (long-sentence runs)** — Three runs of consecutive long sentences: (a) all of intro paragraph 2; (b) the end of the €8,360 paragraph — "The gap between those quotes and €8,360 is..." followed by "The comparison is scope-for-scope rather than invoice-for-invoice — a client project would skip some of the design exploration counted here and add content work that is not — but the order of magnitude holds."; (c) the varlock paragraph ending — "The clearest case: one agent wrote a helper script... exactly the plaintext exposure varlock exists to prevent." followed by "The agent was trading results for technical debt, and it had no sense of the technical tax — the invisible interest a convenient shortcut accrues in maintenance, coupling, and security, payable later and payable by someone else."
- *Why:* Short follows long, long follows short — multiple long sentences in a row turn the prose monotone and are easier to hear than see.
- *Suggested fix:* Break each run with one short sentence. In (c), "The script ran. It was convenient." style beats already exist earlier in that section — split "The agent was trading results for technical debt" off as its own short sentence and let the "technical tax" definition follow.

**5. Missing structural rest stops (mild)** — The varlock story runs three dense unbroken paragraphs after its bolded opener ("**The second failure is the more instructive one,**"), and the final section "What this case proves, and what it doesn't" runs five paragraphs with no bold, no anchor, no visual break.
- *Why:* At long-form length the eye needs headers, bolded declarations, or pull-worthy lines to keep scanning; these two stretches are the longest anchor-free runs in the piece.
- *Suggested fix:* Bold one load-bearing line in each stretch — "The distinction between the two failures matters if you are evaluating this way of working." is a natural anchor in the failures section; "Which suggests what to ask for when someone offers you AI-accelerated development" (or the three-item ask itself) in the closing section.

**6. Voice: dangling negation** — "None of it is hard engineering, and that is the point — the showcase is not what was built." The sentence defines by negation and never supplies the positive half: the showcase is not what was built... but what? The reader has to guess "the working method / the measured cost" — which the paragraph never states.
- *Why:* Tonality.md flags defining ideas mainly through negation; the preferred move is mechanism-first positive framing with the consequence second.
- *Suggested fix:* Complete the thought in the same sentence — name what the showcase *is* (the supervised process and its measured cost) instead of leaving the reframe hanging.

**7. Voice: slogan without visible mechanism (mild)** — "What ships scales with what runs" (intro, paragraph 2) is an aphorism whose meaning is opaque on first read; the reader can't reconstruct the relation it compresses.
- *Why:* Tonality.md allows compressed claims only when the sentence still contains a recoverable distinction; this one reads as rhythm rather than reasoning.
- *Suggested fix:* Either unpack it into the plain relation (output scales with the number of agents running) or cut it — issue 1 already marks this sentence as cuttable, which solves both flags at once. Related, lower priority: the "not X, but Y" construction appears ~6 times across the piece ("not a page but a working system," "not because of seniority, but," "Not ten — three to five," "not that you should believe the numbers, but that you can check them"). Each individually earns its place, but the density is noticeable in one sitting; converting one or two to positive statements would thin it out. Keep the final one — it's the piece's landing.

---

### Clean checks

- **Headline/intro match is tight.** "76 Hours, Public Repository... You Can Actually Check" is exactly what the intro sets up and the piece delivers — number, artifact, verifiability.
- **Main points don't blur.** Frameworks genuinely vary: a table section, a method section, a before/after narrative, bolded failure stories. Distinct shapes, distinct rhythms.
- **Self-reference ratio is sound.** For a first-person case study, personal material is consistently converted into reader takeaways ("If your organization wants to know...", "what to ask for when someone offers you..."), matching both the Golden Rule and tonality.md's descriptive register. The single soft promotion (specialization worth asking about) stays "the setting."
- **No forced conclusion.** The final section qualifies the claim rather than recapping it, and the last paragraph is an Extended Final Main Point that lands on the piece's core distinction.
- **Word count on target.** 2,877 words sits inside the 2,500–3,000 target; no padding or cutting needed for length alone (the trims above are absorbed by the addition in issue 3).
- **Voice consistency otherwise strong.** Claims are split into true and conditional parts throughout ("Not ten — three to five, on this project, under conditions I will qualify"), mechanisms are visible, and no generic-AI-abstraction passages found.
