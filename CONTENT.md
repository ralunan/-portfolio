# Content and voice

The single source of truth for how the portfolio reads. `DESIGN.md` governs how the site looks; this file governs what it says. The `content-writer` agent (`.claude/agents/content-writer.md`) reviews and drafts copy against it.

**Scope (Ron, 2026-10-01):** content only, meaning the wording and logic of the entire portfolio. The writer can scan the whole site and recommend changes at the portfolio, project or component level, keeping Ron's voice consistent everywhere. It never makes layout or design system changes.

## Who we're writing for

Hiring managers and design leads filling **senior UX / product designer** roles. They skim first, read second. In under a minute they want to know:

1. **Can he own a problem end to end?** Framing, tradeoffs, judgment, not just screens.
2. **Is he creative?** Does he explore widely, reframe problems, and push past the first answer?
3. **Is he a good collaborator?** Who did he work with, how did he bring them along, and what did he give them that made their job easier?
4. **Did it matter?** What changed for customers or the business because of the work?

Every piece of copy should answer at least one of these. If it answers none, cut it.

## Voice

Ron sounds like a senior designer explaining his work to a smart friend: professional, warm and easy to follow. The site has a fun, animated feel, and the writing should carry the same personality (Ron, 2026-10-01).

- **Easy to understand first.** A reader should get the design idea without knowing design terminology. Prefer everyday words; when a term matters, explain it in plain language right after.
- **Introduce, then simplify.** It's fine to open on a complex topic. Name it, then unpack it so the reader understands it by the end of the paragraph. For example: "Connecting Cashi sounds simple, but every customer arrives in a different situation."
- **Brief over exhaustive.** One or two examples make the point; don't list every case. Cut any sentence the reader wouldn't miss (Ron, 2026-10-01).
- **Professional, with personality.** Light, human touches are welcome (a vivid image, a short punchy line). Never jokey, never slang, never at the cost of clarity.

- **Specific over impressive.** "Every account state: member or not, approved or denied, linked or not" beats "complex, multi-layered user flows".
- **Show the judgment.** Say what was decided and why, and what was ruled out. Seniority shows in the reasoning, not in adjectives.
- **Lead with the point.** Open a section with the problem, decision or outcome, then the process that got there. Never open with "I started by…".
- **"I" for my decisions, "we" for team outcomes.** Name the partners (Product, Engineering, Research, Accessibility, Content, local market teams, data science). Collaboration is proven by naming who and how, not by saying "collaborative".
- **Creativity is breadth plus a reframe.** Show how many directions were explored and the new way of seeing the problem ("organize results by occasion, not category"), then how the strongest one was chosen.
- **Plain words, short sentences.** One idea per sentence. Most sentences under 25 words.
- **Warm, not casual.** First person, contractions are fine. Case studies stay professional; the 404 page, footer and home page can be more playful.

### Words to avoid

passionate, seamless, leverage, utilize, delightful, robust, cutting-edge, innovative, synergy, world-class, best-in-class, journey (except the literal customer journey), "helped to", "was responsible for", "various", "a lot of". No exclamation marks.

Unexplained jargon: terms like *touchpoint*, *happy path*, *account states*, *use case*, *source of truth*, *component library*, *handoff* or *design system* can appear, but only with a plain-language explanation nearby the first time on a page.

## Honesty rules

- **Never invent facts, numbers, names or outcomes.** Every claim must trace to `resume.txt`, `aboutme.txt`, a project `.txt` file, `src/projects.js`, or something Ron said.
- **No metric? Describe the observable change**: a decision someone made, a team that adopted the work, a roadmap it shaped, time it saved.
- **Gaps become questions, not filler.** When a section would be stronger with a fact we don't have (a launch date, an adoption number, a quote), write `[Ron: …?]` in the draft and list the question in the report.
- Respect confidentiality the source already states (for example, Fashion shows only shareable explorations).

## Shapes and lengths

| Piece | Where it lives | Guideline |
| --- | --- | --- |
| Hero headline | `components/home/Hero.jsx` (`heroWords` + the `<em>` word) | One line of value, under 12 words, one emphasized word |
| Hero sub | `components/home/Hero.jsx` | 1–2 sentences, under 35 words |
| Section titles | `section-title` in home components and pages | Under 8 words, may carry one `<em>` word |
| Highlights | `STATS` in `components/home/Highlights.jsx` | A short value (number or word) + a label under 10 words |
| How I work | `APPROACH` in `components/home/Approach.jsx` | 2–4 word title + one sentence under 25 words |
| About teaser | `components/home/AboutTeaser.jsx` | Title under 10 words + 2–3 sentences |
| Project tagline | `tagline` in `src/projects.js` | One sentence, under 25 words: who it helped and how |
| Project meta | `meta` in `src/projects.js` | Short labels, no sentences |
| Outcomes | `outcomes` in `src/projects.js` | Three lines, each under 12 words, starting with a verb or a result |
| Image captions | `images` in `src/projects.js` | Under 8 words, says what the image shows |
| Case study chapters | `Projects/<folder>/<file>.txt` | 1–3 short paragraphs per chapter |
| About page | `aboutme.txt` | Story paragraphs, each with one clear beat |
| Resume | `resume.txt` | Bullets start with a strong verb; one outcome per bullet |

### Case study arc

Chapter 1 is always **Context** + **Problem statement**. After that, each chapter should move the story forward:

1. **Context**: the product, the customer, the stakes, and Ron's role in one or two paragraphs.
2. **Problem statement**: the tension in one or two sentences. Rendered as a highlighted card, so it must stand alone.
3. **Process chapters**: what Ron did, why, with whom, and what it unlocked. Show at least one decision and one collaboration moment.
4. **Impact**: what changed, for whom. Close with what Ron learned or would do next only if it's genuinely useful.

## Formatting rules the site depends on

Copy changes can break pages. Before proposing an edit, respect these (full detail in `CLAUDE.md`):

- In `.txt` files a line starting with `## ` starts a section, and a line starting with a single `#` is a sub-heading.
- `## Context` and `## Problem statement` must keep those exact names.
- **Don't rename, add, remove or reorder `##` chapters without Ron's approval.** Images are matched to chapters by number (`2_x.png` belongs to chapter 2), so moving a chapter moves its images.
- A chapter with an empty body is intentional (images only). Suggest copy for it, but don't treat it as an error.
- In the resume, a single long line under a role becomes a bullet of that role; keep lines that should be bullets over ~90 characters, and keep org / title-and-dates lines short.
- In JSX, emphasis is one `<em>` word or short phrase per heading, never in the nav.

## Decisions log

Dated voice and content decisions Ron makes or approves.

- 2026-10-01: Voice set to senior UX / product designer, written for hiring managers looking for creativity and collaboration (Ron).
- 2026-10-01: Voice is professional but approachable, matching the site's fun, animated personality. Avoid unexplained jargon; introduce complex topics, then simplify them as the reader goes. The writer may also suggest improvements to voice and communication (Ron).
- 2026-10-01: Keep copy brief: one or two examples, not exhaustive lists (Ron, after the Cashi sample).
- 2026-10-01: Writer's scope is wording and logic only, across the whole portfolio, with recommendations at portfolio, project or component level; no layout or design system changes (Ron).
