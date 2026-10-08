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
| 2026-10-08 | `style-lab/assets/2026-10-08-avatar-chat-prototype.html` | Avatar chat (Ron's avatar asides) | proposed | Clicking the talk-pose avatar raises a full-width RPG dialogue panel from the bottom (max 25% of the screen; full width and line height 1.8 per Ron 2026-10-08; chat text (Ron) 24px phones, 28px tablets, 44px laptops 1280+, 46px at 1600+, 50px at 1920+, 54px at 2200+): Kyoto Dusk window with white pixel frame, portrait and name, Pixelify Sans text typed letter by letter, long text split into mini-pages with NEXT, then CLOSE. Includes a tweak panel for rise time, typing speed and text size. Built from the FF convention; Ron's RPG chat bubble reference not yet seen. Preview: https://claude.ai/artifact/TRMdiXuvno9JMb47kxuyJq |
| 2026-10-01 | `style-lab/assets/2026-10-01-ron8bit-character-sheet-v19.html` | Ron's 8-bit persona | approved | Draft 19 (Ron): front walk. Step 1 his right leg forward with the bigger foot, left hand forward and bigger; Step 2 mirrored; both steps 1 px taller than standing. Side walk unchanged from draft 18. Ron approved the character 2026-10-01 as the reference for future portfolio animation; implementation to be decided later. |
| 2026-10-01 | `style-lab/assets/2026-10-01-ron8bit-character-sheet-v18.html` | Ron's 8-bit persona | dropped | Draft 18 (Ron): Pass A front hand loses its dark outline. Replaces draft 17. Ron: "i think were good". |
| 2026-10-01 | `style-lab/assets/2026-10-01-ron8bit-character-sheet-v17.html` | Ron's 8-bit persona | dropped | Draft 17 (Ron): Pass A near hand centered, leaning back; Pass B near hand centered, leaning forward, far hand one unoutlined pixel. Replaces draft 16. |
| 2026-10-01 | `style-lab/assets/2026-10-01-ron8bit-character-sheet-v16.html` | Ron's 8-bit persona | dropped | Draft 16 (Ron): hands only. Pass A front hand half visible, back hand closer to the body; Step B far hand 1 px higher; Pass B a sliver of the far hand behind the body. Replaces draft 15. |
| 2026-10-01 | `style-lab/assets/2026-10-01-ron8bit-character-sheet-v15.html` | Ron's 8-bit persona | dropped | Draft 15 (Ron): Pass A front hand 2x2 and a sliver of the back foot; Pass B hand further forward, back foot in front, other foot 1 px right. Replaces draft 14. |
| 2026-10-01 | `style-lab/assets/2026-10-01-ron8bit-character-sheet-v14.html` | Ron's 8-bit persona | dropped | Draft 14 (Ron): Step A approved as is. Pass A legs together, near hand swung back, far hand peeking in front; Step B far hand forward and higher, far leg forward, near leg back with heel lifted; Pass B legs together. Replaces draft 13. |
| 2026-10-01 | `style-lab/assets/2026-10-01-ron8bit-character-sheet-v13.html` | Ron's 8-bit persona | dropped | Draft 13 (Ron): pass frames open into a small V with both shoes grounded, front leg 1 px further left, back leg 1 px further right. Replaces draft 12. |
| 2026-10-01 | `style-lab/assets/2026-10-01-ron8bit-character-sheet-v12.html` | Ron's 8-bit persona | dropped | Draft 12 (Ron): side views keep only the front Terracotta flannel check, toward the walking direction. Replaces draft 11. |
| 2026-10-01 | `style-lab/assets/2026-10-01-ron8bit-character-sheet-v11.html` | Ron's 8-bit persona | dropped | Draft 11 (Ron): side walk is a real stride (step, pass, step, pass), legs cross under the body on each pass where the body rises 1 px; hands 2 px; preview `style-lab/previews/2026-10-01-ron8bit-side-walk-stride.gif` at 1 s per frame. Replaces draft 10. |
| 2026-10-01 | `style-lab/assets/2026-10-01-ron8bit-character-sheet-v10.html` | Ron's 8-bit persona | dropped | Draft 10 (Ron): walking bounce, body 1 px higher on step frames (feet stay grounded), back down when standing; side walk at 1 s per frame (Ron: 2 s too slow). Replaces draft 9. |
| 2026-10-01 | `style-lab/assets/2026-10-01-ron8bit-character-sheet-v9.html` | Ron's 8-bit persona | dropped | Draft 9 (Ron): side view approved; side walk is now four frames (stand, step A, stand, step B) with arms and legs swinging. Replaces draft 8. |
| 2026-10-01 | `style-lab/assets/2026-10-01-ron8bit-character-sheet-v8.html` | Ron's 8-bit persona | dropped | Draft 8 (Ron): front hair from draft 7 approved. Side view gets lower, rounder hair and a small ponytail with a Terracotta tie (side only). Replaces draft 7. |
| 2026-10-01 | `style-lab/assets/2026-10-01-ron8bit-character-sheet-v7.html` | Ron's 8-bit persona | dropped | Draft 7 (Ron): right side curves out 1 px instead of a straight edge; its point sits lower than the center crest. Front approved; replaced by draft 8. |
| 2026-10-01 | `style-lab/assets/2026-10-01-ron8bit-character-sheet-v6.html` | Ron's 8-bit persona | dropped | Draft 6 (Ron): dark tuft on the top right trimmed into a pointed tip with Kyoto Dusk highlights. Replaced by draft 7. |
| 2026-10-01 | `style-lab/assets/2026-10-01-ron8bit-character-sheet-v5.html` | Ron's 8-bit persona | dropped | Draft 5 (Ron): right side of the hair tapered in 1 px toward the ear. Replaced by draft 6. |
| 2026-10-01 | `style-lab/assets/2026-10-01-ron8bit-character-sheet-v4.html` | Ron's 8-bit persona | dropped | Draft 4 (Ron): fringe covers more forehead and the top of the left eye; trousers rise 1 px into the torso. Replaced by draft 5. |
| 2026-10-01 | `style-lab/assets/2026-10-01-ron8bit-character-sheet-v3.html` | Ron's 8-bit persona | dropped | Draft 3 (Ron): legs 2 px shorter; hair 2 px taller, swept up and right with curl tips and waves. Replaced by draft 4. |
| 2026-10-01 | `style-lab/assets/2026-10-01-ron8bit-character-sheet-v2.html` | Ron's 8-bit persona | dropped | Draft 2 (Ron): lighter trimmed beard, bigger curly and wavy hair, his identity. Replaces draft 1; replaced by draft 3. |
| 2026-10-01 | `style-lab/assets/2026-10-01-ron8bit-character-sheet-v1.html` (sprites in `style-lab/ron8bit/ff.py`) | Ron's 8-bit persona | dropped | Draft 1 character sheet: 16x24 Final Fantasy III/VI-scale sprite from Ron's profile photo; front, side, back, walk, expressions, talk pose with chat bubble. Japanese palette only. Replaced by draft 2. |
| 2026-10-01 | `style-lab/assets/2026-10-01-example-palette-drift.svg` | Example only | proposed | Sample to show the style agent's output: layered palette shapes with a slow drift loop. Not placed on any page. |

## Decisions log

Dated style decisions Ron makes or approves.

- **2026-10-01** Style agent created (Ron): flair and visual creativity unique to Ron, using only his design-system colors, prompted by him, tracking and creating video, images and animations. Never layout or design system changes.
- **2026-10-01** Blocks as a metaphor (Ron): the animated blocks stand for building, each block a skill (building, creating, making sense of design, communication). Only in the hero for now; may join the storytelling later.
- **2026-10-01** Scope widened (Ron): includes the animated springy blocks, to tweak together for visual appeal, and the Cotton Candy theme, which Ron may or may not use on the project pages.
- **2026-10-01** 8-bit persona approved (Ron): draft 19 is the character reference (sprites in `style-lab/ron8bit/ff.py`; sheet `style-lab/assets/2026-10-01-ron8bit-character-sheet-v19.html`; side and front walk GIFs in `style-lab/previews/`). Saved for animating on the portfolio later, with chat-bubble annotations; where and how to implement it is still to be decided.
- **2026-10-08** Persona's role (Ron): the 8-bit character is Ron's avatar. Its primary purpose is to annotate his thoughts and feelings beyond what his written voice in the content already says, through chat bubbles. It adds an aside; it never repeats or replaces the content.
- **2026-10-08** Avatar chat type size (Ron): large RPG-style text that keeps the "game" ratio of big type on screen, like old RPGs on small screens. Chat text 20px phones, 38px laptops (raised from 30px: laptop looked small), 42px at 1600+ (38 x 1600/1440), 40px at 1920+, 48px at 2200+ (tablets 18px); line height 1.8; the panel is full width and at most a quarter of the screen tall.
- **2026-10-08** Chat page length (Ron): a chat page shows at most 3 lines; longer text continues on the next page with NEXT.
- **2026-10-08** Chat text sizes revised (Ron): 24px phones (640 and below), 28px tablets, 44px laptops (1280+), 50px at 1600+, 54px at 1920+, 58px at 2200+. Replaces the earlier sizes above.
- **2026-10-08** Chat text above laptops trimmed 4px (Ron): 46px at 1600+, 50px at 1920+, 54px at 2200+. Phones 24, tablets 28, laptops 44 unchanged.
- **2026-10-08** Chat speaker label (Ron): no portrait in the dialogue box; just the name "Ron" in the same pixel style (Vanilla, bold), at the same size as the chat text at every breakpoint.
- **2026-10-08** Chat box spacing (Ron): NEXT/CLOSE uses the chat text size at every breakpoint; on laptops and up the box is 50px taller than its quarter-screen height, so the box is no longer a strict 1/4 there; 4px between the text area and the NEXT row, and 4px from NEXT to the bottom of the box.
- **2026-10-08** Even chat frame (Ron): the space under NEXT matches the space above the name and text (same top and bottom padding; NEXT uses the text's 1.8 line height). Replaces the 4px bottom gap; the 4px gap between the text area and NEXT stays.
- **2026-10-08** NEXT size (Ron): a fixed 40px on laptops and up (1280+), 4px under laptop chat text; below laptops it stays at the chat text size. The frame spacing stays even.
