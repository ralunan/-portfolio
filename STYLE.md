# Style and visual flair

The playbook for the `style-agent` (`.claude/agents/style-agent.md`): the visual artifacts that make the portfolio feel vivid and unmistakably Ron's, such as illustrations, textures, images, short videos and animations. `DESIGN.md` governs how the site is built (tokens, type, layout, components); `CONTENT.md` governs what it says; this file governs the extra layer of flair, and keeps a log of every artifact made.

**Scope (Ron, 2026-10-01):** the style agent creates flair and visual creativity, unique to Ron, using his design-system colors. Ron prompts it. It tracks and creates visual artifacts (video, images, animations and similar). It never redesigns layout or the design system.

**Also in scope (Ron, 2026-10-01):** the home hero's animated springy blocks, which Ron and the agent will tune together for visual appeal (colors, shapes, sizes, bounce, rhythm), and the Cotton Candy theme, which Ron may or may not use when he revises the project pages.

**What the blocks mean (Ron, 2026-10-01):** the animated blocks are metaphors for building. Each block can stand for one of Ron's skills: building, creating, making sense of design, and communication. Today they appear only in the hero, but Ron may bring them into his storytelling as the portfolio grows. Any block idea the agent proposes should keep this meaning: blocks are skills, and arranging them is building.

## How it works

1. **Ron prompts.** The agent works only on what Ron asks for: a section, a page, a mood ("make the About teaser feel warmer"). It does not go looking for places to decorate.
2. **The agent proposes.** It makes the artifact as a file in `style-lab/` and shows Ron a preview with a short note: what it is, where it would sit, and why it fits.
3. **Ron approves, tweaks or drops it.** Every outcome is recorded in the artifact log below.
4. **Approved artifacts are applied separately.** Placing an artifact on a page is a normal change to one component, done by the main session, checked by `design-steward`, on its own branch and draft PR. The style agent never edits `src/`.

## Rules

1. **Palette only.** Every color in an artifact comes from the Japanese palette or its derived tokens in `src/styles/tokens.css`: Kyoto Dusk #5B5F8D, Matcha Cream #9BB29E, Roasted Terracotta #DA6B51, Vanilla Foam #F1DCBA, Charcoal Brew #484149, plus `--charcoal-deep`, the `--*-wash` tints, `--terracotta-ink`, `--matcha-ink`, `--bg` and white. Tints are allowed only as opacity of those colors. The Cotton Candy pastels (`--cotton-*` tokens) are a second, optional palette: use them for the hero, or for project-page proposals when Ron asks, and label any proposal that uses them as Cotton Candy so Ron can choose. Never mix a new color in; Charcoal Brew stays out of the springy blocks.
2. **Brand fonts only.** If an artifact includes type, it is Geist, with Instrument Serif Italic for an emphasized word (same gradient treatment as `DESIGN.md`). Previews load the real fonts before any screenshot.
3. **Flair, not structure.** No changes to layout, spacing, the type scale, tokens, components or copy. An artifact decorates a space that already exists; if an idea needs a layout change, the agent says so in one line and leaves it to Ron.
4. **Motion is Ron's call.** Animation inside an artifact (a looping illustration, a video) is fine to propose. The site's interactions, scroll behavior, transitions and existing motion are never changed unless Ron names them. Any proposed animation states how it behaves for reduced-motion visitors (a still frame).
5. **Springy blocks are tuned together.** The blocks' look and motion (colors, shapes, sizes, bounce, reshuffle rhythm) are open to proposals because Ron named them. Proposals come as a preview or short video plus the exact values to change; the agent does not edit `SpringyBoxes.jsx` or `hero.css`. The hero work has its own thread, which applies anything Ron approves.
6. **One component at a time.** An artifact is proposed for one place. Reusing it elsewhere, or site-wide, is a separate question for Ron.
7. **Light theme, dark type.** Artifacts sit on the light page; no dark sections behind text. Text over an artifact keeps WCAG AA contrast.
8. **Light on the page.** Prefer SVG and CSS-friendly formats. Raster images as WebP or PNG under 300 KB, video as MP4/WebM under 2 MB with a poster frame. Nothing blocks the page from loading.
9. **Original work.** Artifacts are made from scratch or from Ron's own material. No stock imagery, third-party logos or other people's artwork.

## Visual language

The starting point for what "Ron" looks like. The agent refines this with Ron and logs changes.

- **Calm, crafted, a bit playful.** Like the springy boxes: soft geometry with a little bounce, never loud.
- **Soft geometry.** Rounded rectangles, circles, arcs and ribbons, echoing the radius tokens and the hero boxes.
- **Layered washes.** Overlapping translucent palette shapes on the Vanilla background, with Kyoto Dusk and Terracotta as the deeper notes and Matcha and Vanilla as the light ones.
- **Gentle motion.** Slow drifts and breathing loops with the site easing (`--ease`), many seconds per cycle, so they never compete with the content.
- **Product-focused.** Flair supports the work: framing a case study, hinting at a process, celebrating an outcome. It never hides screens or text.

## Themes and elements it works with

| Element | Where it lives | What the agent can propose |
| --- | --- | --- |
| Japanese palette | `src/styles/tokens.css` | The default for every artifact |
| Cotton Candy palette | `--cotton-*` in `tokens.css`; the hero shader gradient (`HeroGradient.jsx`) | Hero variations, and project-page treatments if Ron wants them |
| Springy blocks | `components/home/SpringyBoxes.jsx`, `styles/home/hero.css` | Colors from the palettes, shapes, sizes, bounce and rhythm, shown as previews with exact values |

## Where artifacts live

- `style-lab/assets/`: the artifact files (SVG, PNG/WebP, MP4/WebM, Lottie JSON, etc.), named `<yyyy-mm-dd>-<place>-<idea>.<ext>`.
- `style-lab/previews/`: preview screenshots or frames shown to Ron.
- `style-lab/` is not loaded by the site. An approved artifact moves into the site when it is applied.

## Artifact log

Newest first. Status: **proposed**, **approved**, **applied**, **dropped**.

| Date | Artifact | For | Status | Notes |
| --- | --- | --- | --- | --- |
| 2026-10-01 | `style-lab/assets/2026-10-01-ron8bit-character-sheet-v3.html` | Ron's 8-bit persona | proposed | Draft 3 (Ron): legs 2 px shorter; hair 2 px taller, swept up and right with curl tips and waves. Replaces draft 2. |
| 2026-10-01 | `style-lab/assets/2026-10-01-ron8bit-character-sheet-v2.html` | Ron's 8-bit persona | dropped | Draft 2 (Ron): lighter trimmed beard, bigger curly and wavy hair, his identity. Replaces draft 1; replaced by draft 3. |
| 2026-10-01 | `style-lab/assets/2026-10-01-ron8bit-character-sheet-v1.html` (sprites in `style-lab/ron8bit/ff.py`) | Ron's 8-bit persona | dropped | Draft 1 character sheet: 16x24 Final Fantasy III/VI-scale sprite from Ron's profile photo; front, side, back, walk, expressions, talk pose with chat bubble. Japanese palette only. Replaced by draft 2. |
| 2026-10-01 | `style-lab/assets/2026-10-01-example-palette-drift.svg` | Example only | proposed | Sample to show the style agent's output: layered palette shapes with a slow drift loop. Not placed on any page. |

## Decisions log

Dated style decisions Ron makes or approves.

- **2026-10-01** Style agent created (Ron): flair and visual creativity unique to Ron, using only his design-system colors, prompted by him, tracking and creating video, images and animations. Never layout or design system changes.
- **2026-10-01** Blocks as a metaphor (Ron): the animated blocks stand for building, each block a skill (building, creating, making sense of design, communication). Only in the hero for now; may join the storytelling later.
- **2026-10-01** Scope widened (Ron): includes the animated springy blocks, to tweak together for visual appeal, and the Cotton Candy theme, which Ron may or may not use on the project pages.
