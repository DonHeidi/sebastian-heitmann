# Diagnostics Report (Round 2 — after structural pass, em-dash refactor, and external review)

**Piece:** "76 Hours, Public Repository: An AI-Development Claim You Can Actually Check" — a verifiable case study of AI-agent-built software with a measured 76-hour supervision cost
**Length class:** Long-form — 3,204 words body (via count-words; 3,158 excluding the deliberate evidence appendix)
**Piece type:** Credible Talking Head (case study / build log) with Opinion elements

---

### Issues found

**1. Slow intro** — The promise lands at sentence 10. Paragraph 1 (5 sentences) sets the problem, paragraph 2 (4 sentences, the Bun/Rust anecdote) adds scale context, and only then does paragraph 3 open with the payoff: "This case is built to be checked." That is 9 sentences before the reader learns what this piece delivers.
- *Why:* An intro that runs past ~5 sentences before the payoff slows the Rate of Revelation exactly where the reader decides whether to stay.
- *Suggested fix:* Compress paragraph 2 to one sentence (the eleven-days/$165k figures and the "same movement at a much smaller scale" positioning can share a sentence) or move the Bun example into "What this case proves, and what it doesn't," where scale context is already being discussed. Cutting "The capability underneath those claims is real, and it is scaling fast." costs nothing — the Bun sentence proves it without announcing it.

**2. Intro map doesn't match the section sequence** — The bullet list promises four things ("what the 76 hours actually bought / how the hours were counted / what the human contribution consisted of / and where the approach broke"), but the piece delivers seven sections, and "The repository contains its own historical baseline" interrupts the promised sequence between bullet 3 and bullet 4 unannounced.
- *Why:* The 1/3/1 + Bullets framework works because the reader gets an instant map of what's coming; a section the map didn't announce breaks the contract the intro just set.
- *Suggested fix:* Add a fifth bullet (e.g., the baseline comparison against the hand-coded start), placed between "how the hours were counted" and "what the human contribution consisted of" to match reading order — or fold the baseline section into "What 76 hours bought" as its closing beat.

**3. Low Rate of Revelation (three local spots)** —
(a) In the money paragraph: "That gap is what the compression is worth in money. A production system arrived a full price bracket below what the market charges for the same scope." — the second sentence restates the first in different words.
(b) In the varlock passage: "The project needs no plaintext secret files..." is followed two sentences later by "Those properties are why I use it: it eliminates the plaintext credential files that otherwise accumulate in every project." — the same property stated twice.
(c) "That is how the task structure distributed it." (in the "Mapped onto familiar roles" paragraph) adds rhythm but no new information.
- *Why:* Sentences that restate the previous sentence stall the story; every sentence should advance the reader.
- *Suggested fix:* (a) Cut one of the two — keep whichever framing ("gap" or "price bracket") you want echoed later, delete the other. (b) Cut "it eliminates the plaintext credential files that otherwise accumulate in every project" and end at "Those properties are why I use it." (c) Cut the sentence outright.

**4. Word count over target** — Body is 3,158 words excluding the appendix (3,204 with it) against a 2,500–3,000 target: roughly 160–200 words over.
- *Why:* The target was set for a reason; the overage is concentrated, not spread, so it is cheaply recoverable.
- *Suggested fix:* The cuts in issues 1 and 3 recover ~120 words. The transcript paragraph in "What the human contribution was" (~180 words, "For the most recent slice of the project...") can shed the tally detail ("363 shell commands, 117 file edits, 67 sub-agents dispatched" could become one number) for another ~40. That lands the piece inside target without touching any argument.

**5. Voice: "not X, but Y / X rather than Y" contrast density** — The construction appears roughly a dozen times across the piece: "the showcase is not the technology but the working method," "reconstructed human working time, not elapsed project duration," "The claim is low effective cost, not overnight delivery," "an afternoon, not a research project," "a quarter, not a month of part-time attention," "Not ten: three to five," "measured rather than remembered," "a class of mistake rather than an instance of one," "an annoyance rather than becoming a crisis," "not that you should believe the numbers, but that you can check them."
- *Why:* The tonality file flags repeated "Not X, but Y" loops as a manufactured-feeling pattern — each instance carries a real distinction here, but at this density the device becomes audible.
- *Suggested fix:* Keep the load-bearing ones (the closer, "Not ten: three to five," "measured rather than remembered") and rewrite the two or three weakest as plain statements: "an afternoon, not a research project" — the sentence already says clustering takes an afternoon, so the negation adds only rhythm; "a quarter, not a month of part-time attention" can state the conventional estimate directly. Pruning three instances is enough to break the pattern.

**6. Missing structural rest stops in two sections** — "How the hours were counted" (5 paragraphs) and "What the human contribution was" (5 paragraphs, including the ~180-word transcript paragraph) run as unbroken prose with no bolds, subheads, or visual anchors. "Where the agents failed" shows the fix already — its bolded paragraph openers ("**The first is a knowledge failure.**") give the eye landing points the two earlier sections lack.
- *Why:* At long-form length the eye needs bolded declarations or anchors to keep scanning; long unbroken runs are where readers drop out.
- *Suggested fix:* Apply the failures section's device backward: bold the opening clause of each paragraph in "What the human contribution was" ("**I decided the technology**...", "**I structured the work as tasks**...", "**That work has a peculiar property: it is invisible in the repository.**") and split the transcript paragraph after "...67 sub-agents dispatched." so the interpretation ("That is one human instruction every eight minutes...") stands as its own paragraph.

---

### Clean checks

- **Headline/intro promise match is tight** — "76 Hours, Public Repository... You Can Actually Check" is delivered verbatim by paragraph 3 (76 hours, public repo link, documented method). No overpromise.
- **Main points don't blur** — sections vary in framework and texture: table + zoom-in, pure reasoning, data paragraph, short narrative comparison, bolded two-failure structure, fast closes. Rhythm across sections is genuinely varied.
- **Self-reference ratio is right for the type** — first-person material is consistently converted into transferable takeaways ("count your instructions... you have the same ratio for your own work," the vendor checklist); the project stays the setting, the reader's evaluation problem stays the story.
- **No forced conclusion** — "What to ask a vendor" is a Strong Opinion close that lands the argument rather than recapping it, and the appendix after the rhetorical close is a deliberate evidence exhibit, correctly separated.
- **Monotone rhythm** — sentence length alternates well throughout; short sentences ("This case is built to be checked." "The error category disappeared." "The agents wrote the code.") reliably break the long runs.
- **No mid-piece sag** — the 40–70% zone (human contribution, historical baseline) carries some of the piece's strongest material (the invisibility-in-git observation, the March 2026 evening comparison).
- **No generic AI abstraction or over-sharpened claims** — every capability claim is grounded in a workflow or number, and the qualifications ("on this project, under conditions I will qualify," "the pace of a first attempt") match the tonality file's commitment rules.
