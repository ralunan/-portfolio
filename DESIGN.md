# Design system

The single source of truth for how the portfolio looks. Values live as CSS custom properties on `:root` in `src/styles/tokens.css`; this file explains them and records why they were chosen. `npm run design:check` flags any styling value that bypasses them.

## Rules

1. **Colors are tokens.** Outside `:root`, CSS uses `var(--…)`, never a raw hex, `rgb()` or `rgba()`. A new color is added to `:root` first, with a comment, and logged below. JS/JSX may only use hex values that already exist as tokens (the shader gradient and springy boxes need literal strings). The one exception is the per-project `accent` in `src/projects.js`, which feeds `--accent`.
2. **Type sizes come from the scale.** Fixed sizes use the px scale below. Fluid display sizes use a `--fs-*` token; add one rather than writing a new `clamp()`.
3. **Spacing comes from the scale, in multiples of 4px.** Padding, margin and gap use the px steps below, every one divisible by 4, so there is no odd spacing (Ron, 2026-10-01). Fluid `clamp()` spacing is fine for section rhythm, but its min and max should also be multiples of 4 (the check doesn't verify fluid values yet, so review them by eye).
4. **Radii are tokens.** `var(--radius-*)`, or `50%` for circles.
5. **Reuse components before adding new ones**: `.button` / `.button--primary`, `.tags`, `.card` (card surface), `.eyebrow`, `.section-title`, `.page-title`, `.container`, `Reveal` (scroll-in motion), `Page` (route transition), `Lightbox` (click to enlarge).
6. **Light theme, dark type, everywhere.** No reversed (light-on-dark) text sections. The dark `--canvas` exists only behind work images.
7. **Body text is 16px (`--fs-body`).** Paragraphs inherit it from `body`; don't set another paragraph size. The only exception is the home hero's intro line at 18px (`--fs-hero-intro`). A new exception needs Ron's approval and a log line (Ron, 2026-10-01).
8. **First content sits a set gap below the header.** Every page starts its first content `--page-top` from the top: the header height plus `--header-gap`. The gap is 24px on desktop and phones 400px and wider, 20px from 376 to 399px, and 16px at 375px and narrower (Ron, 2026-10-08). Phones top-align the first content rather than centering it. Pages don't add their own extra top padding on phones. On the home Selected Work screen the header is already in its compact scrolled state, so the gap is measured from that shorter header (Ron, 2026-10-09).
9. **Log decisions.** Any change to a token, a scale or a rule above gets a dated line in the decisions log, with the reason.

## Color

The site theme is Ron's Japanese palette (since 2026-10-01): **Kyoto Dusk** #5B5F8D, **Matcha Cream** #9BB29E, **Roasted Terracotta** #DA6B51, **Vanilla Foam** #F1DCBA, **Charcoal Brew** #484149. Each has a token (`--kyoto-dusk`, `--matcha-cream`, `--roasted-terracotta`, `--vanilla-foam`, `--charcoal-brew`), plus `--charcoal-deep` #2b262c for the darkest surfaces and pale washes (`--vanilla-wash`, `--matcha-wash`, `--dusk-wash`) for soft card backgrounds.

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | #fbf7f0 | Page background, a light Vanilla Foam wash |
| `--surface` / `--surface-2` | #ffffff / #f6eee1 | Cards, raised areas |
| `--text` | Charcoal Brew #484149 | Headings, primary type, primary button |
| `--body` | #554e56 | Long-form paragraphs |
| `--muted` / `--faint` | #6f6770 / #958d93 | Secondary and tertiary type |
| `--line` / `--line-strong` / `--line-hover` | Charcoal at 10% / 20% / 30% | Borders |
| `--ink-accent` | Kyoto Dusk | Links, focus |
| `--emphasis` | Kyoto Dusk to Roasted Terracotta | Gradient on every emphasized word |
| `--brand-a` / `--brand-b` | Kyoto Dusk / Roasted Terracotta | Nav monogram, About photo glow |
| `--accent` | per project | Set from `projects.js`; tints cards, chapter numbers, outcomes |
| `--canvas` | `--charcoal-deep` | Behind work images only (transparent boards with white labels) |
| `--orb-a` / `--orb-b` | Vanilla Foam / pale Matcha | Ambient background orbs |
| `--success` | deep Matcha #7fa184 | Availability dot |

**Project accents** use the palette: Walmart UX Research = Matcha Cream, Cashi = Kyoto Dusk, Fashion = Roasted Terracotta. A new project picks one of the five, or Ron adds a new palette color first.

**Accent as text.** Matcha and Terracotta are too light for small text on white, so accent-colored text (tags, chapter and card numbers, eyebrows) always uses `color-mix(in srgb, var(--accent) 55%, var(--charcoal-deep))`, which passes 4.5:1 for all three accents. Fills, borders and glows can use the raw accent.

**Cotton Candy pastels** (`--cotton-*`) are reserved for the home hero's shader gradient.

**Utility**: `--white`, `--glass`, `--nav-glass`, `--tint-hover`, `--tint-active`, `--scrim`, `--overlay`, `--on-dark-*` (lightbox), `--success-ring`.

## Text colors

Every piece of text uses a role token, never a palette color directly. Contrast is measured on the page background `--bg` #fbf7f0 (WCAG AA needs 4.5:1 for body-size text, 3:1 for large text).

| Role | Token | Color | Contrast | Where it's used |
| --- | --- | --- | --- | --- |
| Headings (h1, h2) | `--heading` | Charcoal Brew #484149 | 9.2:1 | Page, section and chapter titles |
| Subheadings (h3, h4) | `--subheading` | Kyoto Dusk #5B5F8D | 5.7:1 | Card titles, job titles, timeline places, sub-blocks |
| Body | `--body` | #554e56 (Charcoal, lighter) | 7.5:1 | Paragraphs, lists |
| Secondary | `--muted` | #6f6770 | 5.1:1 | Taglines, intros, meta values, nav links |
| Caption | `--faint` | #756d74 | 4.7:1 | Meta labels, footer, image captions |
| Labels / eyebrows | `--label` | Terracotta ink #a65646 | 4.9:1 | Uppercase section labels ("SELECTED WORK", "EXPERIENCE") |
| Links | `--link`, `--link-hover` | Kyoto Dusk, then Terracotta ink | 5.7 / 4.9:1 | Inline links in running text |
| Emphasis (words) | `--emphasis` | Kyoto Dusk to Roasted Terracotta gradient | 5.7 to 3.2:1, heading sizes only | Every `<em>`: Instrument Serif italic |
| Highlight (marker) | `--highlight-bg` | Vanilla Foam behind Charcoal type | 7.4:1 | `<mark>` for key phrases and metrics |
| Positive | `--positive` | Matcha ink #557a5c | 4.6:1 | Results, link hover |
| Project accent text | `color-mix(accent 55%, --charcoal-deep)` | per project | 4.5:1+ | Tags, chapter and card numbers on case studies |

Rules:
- Raw Matcha Cream, Roasted Terracotta and Vanilla Foam are too light for text (2.1 to 3.2:1). Use them for fills, borders, glows and markers; for text use `--terracotta-ink` and `--matcha-ink`.
- **Links and CTAs to the work are editorial text links**, not buttons (`.text-cta`, `.text-cta--lg`): Geist Semibold with one emphasized word, e.g. "See selected *work*", "Read the *case study*". The header is not emphasized: its current page is just darker Charcoal text, with no pill or italic (Ron: the italic was hard to read and a lone pill looked odd).
- **Link hover is Matcha**: links grow slightly (scale 1.04) and turn `--positive` green, emphasized words included, on hover and on keyboard focus alike. No underlines. Scaling is skipped for reduced-motion users.
- **Emphasis is one treatment everywhere**: any `<em>` is Instrument Serif italic filled with the `--emphasis` gradient (Kyoto Dusk into Roasted Terracotta). The global `em` rule in `src/styles/base.css` does this; never restyle `em` per component or give it another color. Use it in headings only (the Terracotta end is too light for body-size text), at most one emphasis per heading.
- Primary buttons are Charcoal Brew with white type (9.9:1).

## Type

Brand typeface: **Geist** for everything, display and body (`--font` and `--display` both point to it). Ron chose it over Inter Tight because it is a little more open and has more character in its end points, while staying compact. Weights: 400 body, 500 UI, 600 headings.

Emphasis face: **Instrument Serif Italic** (`--serif`). The contrast between Geist and this italic is part of the brand. Instrument Serif regular is also used for numbers (chapter and card numbers). One exception: the home work-stage counter ("1 of 3") is set entirely in Instrument Serif at weight 600, which the browser synthesizes as bold (2026-10-01, Ron).

Don't add other font families. Ron rejected serif headings and wider sans faces such as Instrument Sans.

- Body: `--fs-body` 16px / 1.65 on every screen size. The home hero's intro line is `--fs-hero-intro` 18px. See rule 7.
- Fixed scale (px): **12, 13, 14, 15, 16, 17, 18, 21, 22, 26**. Labels and eyebrows 12–13 (eyebrows uppercase, 0.12em tracking); UI and buttons 14–15; body 16–18; small headings 21–26.
- Display scale (fluid, max size on desktop). Every title uses one of these; never write a new `clamp()` for a title.

| Token | Max | Used for |
| --- | --- | --- |
| `--fs-hero` | 64px | Home hero headline |
| `--fs-display` | 56px | Case study titles, footer headline |
| `--fs-page` | 48px | Page titles (About, Resume) |
| `--fs-section` | 40px | Section titles |
| `--fs-title` | 32px | Next-project title, About teaser title |
| `--fs-title-sm` | 28px | Chapter titles |
- Headings: weight 600, tracking −0.03em (−0.045em at hero size), line-height ~1.08.

**Card type by breakpoint** (Ron, 2026-10-09, set with the Card Type Dial). Cards don't use the fluid display scale: each text role has a `--fs-card-*` token that steps up at fixed widths (in `tokens.css`). Used by the home highlight cards and project cards; reuse these tokens for cards on case-study pages so they match. Sizes in px:

| Token | Role | ≤640 | 641–960 | 961–1279 | 1280–1599 | 1600–1999 | 2000–2199 | 2200+ |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `--fs-card-stat` | Highlight number | 28 | 36 | 40 | 46 | 50 | 56 | 64 |
| `--fs-card-stat-label` | Highlight label | 14 | 16 | 16 | 16 | 18 | 20 | 22 |
| `--fs-card-num` | Project number (01) | 24 | 28 | 32 | 36 | 40 | 44 | 52 |
| `--fs-card-tag` | Project tags | 12 | 12 | 12 | 14 | 16 | 16 | 18 |
| `--fs-card-title` | Project title | 24 | 30 | 26 | 32 | 36 | 40 | 48 |
| `--fs-card-tagline` | Project tagline | 16 | 16 | 16 | 16 | 20 | 20 | 24 |
| `--fs-card-cta` | Project "Read the case study" | 18 | 18 | 18 | 20 | 24 | 26 | 30 |

Ron set 641–1999 and phones by eye; 2000+ continue his 1280→1600 step (he couldn't view those widths). Tablets list one card per row, so their title runs larger than on small laptops. To retune, rebuild the dial from `tools/sizing-dial/` (PR #24).

## Spacing

Scale (px), all multiples of 4: **4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 56, 64, 80, 96, 120, 140, 160** (plus 1px for hairlines). (2, 6 and 10 were dropped on 2026-10-01; existing uses are flagged by the check and get fixed page by page.) Page gutter is `--gutter` (16–40px fluid); max content width `--max` 1200px.

## Radius and depth

`--radius-xs` 8px (focus rings, small chips) · `--radius-sm` 12px (thumbnails) · `--radius` 20px (cards) · `--radius-lg` 28px (large cards, heroes) · `--radius-pill` 999px (buttons, tags, nav links) · `50%` circles. One shadow: `--shadow`.

**Card.** `.card` (`src/styles/components/card.css`) is the shared card surface, taken from the project card (Ron, 2026-10-01): `--surface` background, 1px `--line` border, `--radius-lg` corners, `--shadow`, and equal padding on all four sides. Padding is 24px by default; change it by setting `--card-pad` on the card itself (not on a parent), using a value from the spacing scale. Layout, alignment and hover come from the component using it, not from `.card`. Used by the home Highlights. **Stacked card** (`.card--stacked`, Ron, 2026-10-01): a solid back card in `--card-back` (Kyoto Dusk by default, any palette color) sits 8px down and to the right with the same corners, and replaces the hairline stroke. It is drawn as a hard-edged offset shadow alongside `--shadow`; this is the one exception to the single-shadow rule. **Card text length** (Ron, 2026-10-01): body text in a row of cards stays within 3 lines; edit the copy first. If it truly needs a 4th line, every card in the group grows to the same height (the highlights grid uses `grid-auto-rows: 1fr`), so cards never differ in height. The project card, How I work cards, case-study outcome cards and resume blocks share this look but not the class yet; move them onto `.card` only when Ron approves.

## Motion

Easing `--ease` cubic-bezier(0.22, 1, 0.36, 1). Route changes go through `Page`; scroll-ins through `Reveal`. Motion respects `prefers-reduced-motion` via `MotionConfig`.

## Known inconsistencies (to fix page by page)

Run `npm run design:check` for the live list. At the time this file was written it reported 36 items, mainly: one-off fluid font sizes that should collapse into a few `--fs-*` tokens (titles were consolidated on 2026-10-01; subtitle sizes remain), a 19px body size, off-scale spacing (13/22px button padding, 14px nav links, 128px, 88px), and radii of 10/14/36/2px. The hero section's own values are left for the homepage work. Fix these as each page is revised rather than in one sweep, so every change can be checked visually.

## Decisions log

Newest first. Format: date, decision, why.

- **2026-10-08** Avatar bubble text by width (Ron approved, with the avatar sizes): 14px phones, 15px tablets, 16px at 1280+, 18px at 1600+, 20px at 1920+, 22px at 2200+ (`--invite-fs`). Part of the RPG exception to the type scale.
- **2026-10-08** Avatar bubble (Ron): stays 4s (was 3s). Whenever it hides it plays the pop-in in reverse, shrinking back into its tail in the same steps. When the pointer leaves him, the bubble stays the same 4s before hiding, as when it first appears.
- **2026-10-08** Avatar bubble (Ron): the invite bubble hides 3s after it appears and he goes back to the idle front walk. Hovering him (or keyboard focus) brings the bubble back with a short stepped pop-in from the tail, and he switches to the talk pose while it shows.
- **2026-10-08** Avatar timing (Ron): reading delay before he walks in is 3s (was 6s). When he isn't annotating he idles with the approved front walk in place (Step 1, Stand, Step 2, Stand at 1s per frame); he switches to the talk pose while the bubble or chat is up.
- **2026-10-08** Avatar size by width (Ron, set with the sizing dial): 3x the 16x24 sprite on phones and tablets (72px tall), 4x on laptops 1280+ (96px), 5x at 1600+ and 1920+ (120px), 6x at 2200+ (144px). Whole-number scales keep the pixels crisp. `--avatar-px` in `styles/home/avatar.css`.
- **2026-10-08** Ron's 8-bit avatar on the home hero (Ron): after a reading delay he walks in at the bottom right, stands in his talk pose with an invite bubble, and opens the avatar chat box on click. The chat box and invite bubble are an RPG dialogue style kept outside the design system on purpose, with large "game ratio" type (Ron, approved from the style-lab prototype): pixel font `--font-game` (Pixelify Sans, used only here), chat text 24/28/44/46/50/54px by width, bubble 15px, page count 13px, chat padding 14px (10px on phones), light text on a Kyoto Dusk to deep-dusk window with a white pixel frame (`--rpg-*` tokens). These are exceptions to rules 3, 6 and 7 and to the single brand font. The five `--avatar-*` tokens are sprite shades flattened from the palette (persona approved 2026-10-01), used only by the sprite.
- **2026-10-08** Header gap rule (Ron): on phones the first content of every page sits 16px below the header at 375px and narrower, 20px from 376 to 399px, and 24px from 400px (desktop unchanged at 24px). Tokens `--nav-height`, `--header-gap`, `--page-top`. The home hero top-aligns on phones instead of centering (it was 1px from the header on an iPhone SE and 95–152px on larger phones). About, Resume and case studies drop their extra 40px top padding on phones. At 375px and narrower the header links wrap to two lines, so `--nav-height` is 95px there.
- **2026-10-09** Project card size by width (Ron): on big screens the Selected Work stage widens and the card grows with the same proportions, so it fills the window. Below 1600px unchanged (1200px wide, card up to 492px tall); 1600+: 1400px / 576px; 2000+: 1680px / 688px; 2200+: 2080px / 896px (breakpoints shared with the hero and avatar). The card still shrinks on shorter windows. Card type and the rest of the home page width are unchanged for now.
- **2026-10-09** Rule 8 now applies to home Selected Work (Ron): the highlights start `--header-gap` below the compact scrolled header (16/20/24px on phones, 24px from tablet up), replacing a fixed 128px top padding on phones and tablets (62–64px gap) and the centered group on laptops and desktops (30px on laptops, 95px at 1920, 275px at 2560). On tall screens the group stays at the top and the spare space goes below the project card. Reason: the same spacing below the header as every other page.
- **2026-10-09** Highlight cards always fit the page width (Ron): below about 1280px the label box narrows below 22 characters and labels wrap to more lines, instead of the fourth card running off the right edge (it overflowed by up to about 160px at 1024px). All cards still grow together.
- **2026-10-09** Card type by breakpoint (Ron): highlight and project card text gets its own `--fs-card-*` tokens stepping up at 641/961/1280/1600/2000/2200px, set by Ron in the Card Type Dial (2000+ extrapolated from his 1280→1600 step, his OK). Replaces `--fs-section` for highlight numbers, `--fs-title-sm` for project titles and fixed 14/22/18px for labels, numbers and CTAs on the home cards. Reason: type that fits each card size on every screen, ready to reuse on the project pages.
- **2026-10-09** Highlights to Selected Work gap (Ron): from 1600px wide up, about 40px of open space between the highlights' back card and the "Selected work" eyebrow (44px margin, the back card takes 8px); laptops and under keep about 24px (28px margin). Reason: more breathing room on big screens.
- **2026-10-09** Project card text starts at the top (Ron): on the laptop/desktop work stage the card's text column is top-aligned instead of vertically centered, with top padding matching the highlights-to-"Selected work" gap: 24px up to 1599px, 40px from 1600px. Sides and bottom stay 40px.
- **2026-10-09** Larger project cards (Ron): from 2000px up (cards 688px+ tall), 20px more space between the card text and its "Read the case study" link (40px instead of 20px), to fill the taller card. Not at 1600px: there the card is often too short and the link ran into the bottom padding.
- **2026-10-09** Avatar stays fixed in the bottom-right corner across the homepage (Ron): he no longer scrolls away with the hero, so he stays in place through the hero-to-Selected Work hand-off. The transition itself is unchanged. He sits above the page and below the nav and chat box.
- **2026-10-01** Spacing rule: every padding, margin and gap is a multiple of 4px, so there is no odd spacing (Ron). 36 and 44 join the scale; 2, 6 and 10 leave it. Home hero headline-to-intro gap now steps with width: 24px (phones and below 1280), 28px (1280+), 36px (1440+), 44px (1920+) for page balance on large screens (Ron asked for 30/38/44; rounded to the 4px rule).
- **2026-10-01** Body text drops to 16px site-wide (was 17px, 16px on phones), and the home hero's intro line to 18px (was 17–20px fluid) (Ron). Both are now tokens (`--fs-body`, `--fs-hero-intro`) and rule 7 makes 16px body a standing rule. Older paragraphs that still set their own size (About story 18px, case-study outcome cards 19px) are exceptions to fix page by page.
- **2026-10-01** Card text rule (Ron): card body text stays within 3 lines. If copy can't be cut and runs to 4, all cards in the group grow to the same height so they stay uniform.
- **2026-10-01** Highlight cards (Ron): labels left-aligned inside their text box, numbers stay centered and take `--subheading` (Kyoto Dusk, 6.1:1 on white; the card-title role, recommended by design-steward). A solid back card (`.card--stacked`, Kyoto Dusk by default) offset 8px replaces the hairline stroke, so the cards look stacked. Ron picked Kyoto Dusk for the back card over Roasted Terracotta and one palette color per card.
- **2026-10-01** Highlight cards (Ron): number and label centered (labels later left-aligned, above), every number at the same height across the row, and every label in the same size text box (22 characters wide, three lines tall) so each card has the same spacing around its content. The card surface becomes the reusable `.card` component (see Radius and depth). Only the Highlights use it for now.
- **2026-10-01** Home Highlights become cards in the project card's style (Ron), so cards look consistent: `--surface` background, `--line` border, `--radius-lg` corners, `--shadow`, equal padding on all sides (24px; 32px on windows taller than 900px) and a 16px gap. The divider line above the highlights is removed. Replaces the extra top and bottom padding added for tall windows earlier. No hover, since the stats aren't links. Kept local to the highlights until Ron decides whether it becomes a shared card style.
- **2026-10-01** Home hero: "trust." gets a white (`--surface`) box with an `--radius-xs` corner that wipes in left to right (0.8s, `--ease`) after the headline settles, for readability over the gradient and to draw the eye (Ron). Hero headline line-height rises to 1.12 (hero only) so the box clears the line above. Reduced motion shows the box without the wipe. "trust." always sits alone on the last line (hard return), and the word is indented so its box sits flush with the headline's left edge, with even padding on both sides of the word (Ron). Hero-only treatment; `<mark>` stays the Vanilla Foam marker.
- **2026-10-01** Home hero text padding keeps growing past 1600px and 2000px (168px at 1600, about 248px at 1920, about 464px at 2560; hero-only breakpoints at 1600 and 2000px), so the text sits closer to the boxes on wide screens instead of leaving a widening empty gap (Ron).
- **2026-10-01** Work stage project counter (Ron): "1 of 3" sits flush right on the "Case studies from Walmart" line, aligned to the card edge. All Instrument Serif with synthesized bold (weight 600; the face has one weight): the current number at `--fs-title` (32px on desktop) in Terracotta ink so it reads as a number, not a lowercase "l", and "of 3" at 21px in `--muted`. Sized up from 26/18px because a serif on a tinted background reads small (Ron). Picked over Geist versions (B4, B4b) and lighter weights, so the counter reads as one editorial unit.
- **2026-10-01** Work stage entry reworked (Ron): the next project peeks from the bottom edge of the window, shifted 75px off center (second card right, third card left) and tilted 5°, so visitors know there is more. Its whole top edge shows (the lower corner about 5% of the card height above the window edge), with the higher corner tucked behind the active card. On scroll it travels diagonally up into the center and straightens with the half-speed bounce; the outgoing card still fades up behind the highlights. A 10° tilt was tried and dropped: it hid too much of the next card (Ron).
- **2026-10-01** Work stage on desktop (Ron): the card stays 32px under the "Case studies" heading at every size instead of centering in the leftover space, which disconnected it from the heading. On windows taller than 900px the highlights get about 20% more height as padding (type unchanged), and the highlights, heading and card center together in the window. Laptops are unchanged.
- **2026-10-01** Work stage tuned (Ron): cards now enter alternately from the left, right, then left, and still leave by fading up behind the highlights. Motion runs at half speed so each change reads clearly. Card height is capped at 492px (25% taller than on a 1280x800 laptop) and centered under the heading, so cards stay a sensible size on big monitors.
- **2026-10-01** Selected work on laptop and desktop pins the highlights and swaps one project card per scroll step: the outgoing card fades up behind the highlights, the next rises tilted 5° and springs level with a small bounce (Ron: one project at a time keeps focus, with a bit of fun). Tilt only while moving so resting cards stay readable. "Case studies from Walmart" drops to `--fs-title-sm` there so a card fits on 768px-tall laptops. Phones, short windows and reduced motion keep the stacked list.
- **2026-10-01** Hero "About me" link removed so the hero has one clear action; About stays in the header (Ron). Highlights stats moved to the top of Selected work so visitors get a snapshot of his experience before the case studies (Ron). Spacing to be tuned in a later pass.
- **2026-10-01** Hero "About me" loses its pill and becomes a text link with an arrow (Ron).
- **2026-10-01** Header pill removed too; the current page is marked by darker text only (Ron).
- **2026-10-01** Header current page reverted to the plain pill; the italic hurt legibility there (Ron). Keyboard focus gets the same Matcha state as hover.
- **2026-10-01** Work CTAs and the header become editorial text links with an emphasized word (option C). Hover grows the link slightly and turns it Matcha green instead of underlining (Ron). Matcha ink deepened to #557a5c so the hover reads as green.
- **2026-10-01** All titles scaled down about 25% and collapsed onto six display tokens (Ron: titles felt too large in Geist). Max sizes now step down by 8px: hero 64 (was about 81 on desktop), case and footer titles 56 (were 84 and 88), page titles 48 (72), section titles 40 (52), smaller titles 32 and 28.
- **2026-10-01** Geist becomes the brand typeface for display and body, replacing Inter and Inter Tight (Ron). Emphasis is always Instrument Serif italic with the Kyoto Dusk to Terracotta gradient, the same treatment everywhere (Ron).
- **2026-10-01** Text color roles defined (Ron asked): Charcoal Brew headings, Kyoto Dusk subheadings, Terracotta-ink labels and highlights, Vanilla Foam marker, Matcha-ink positive. All roles pass WCAG AA on the page background.
- **2026-10-01** Japanese palette becomes the site-wide color theme (Ron): Charcoal Brew type, Vanilla Foam background, Kyoto Dusk links and accent, palette colors as project accents. Cotton Candy kept for the home hero gradient only. Charcoal Brew stays out of the springy boxes.
- **2026-10-01** Design system and consistency check introduced. Raw colors in `styles.css` replaced with tokens (no visual change).
- **2026-10-01** Charcoal Brew #484149 removed from the springy boxes. Too dark against the light hero (Ron).
- **2026-10-01** Hero text left-anchored at 1200px+, boxes on the right and slightly cropped off the edge.
- **2026-10-01** Home hero: Shader Gradient "09 Cotton Candy" plus springy boxes reshuffling every 6s, desktop only.
- **2026-10-01** Japanese box palette: Kyoto Dusk, Matcha Cream, Roasted Terracotta, Vanilla Foam.
- **2026-10-01** Light theme with dark type across the whole site (Ron). Work images keep a dark canvas because some boards are transparent PNGs with white labels.
- **2026-10-01** v2 moved from v1's full-screen screens to scrolling, product-focused case studies with one shared route transition.
- **2026-10-01** Work order: global theme, then homepage, then each case study one at a time, all on the shared theme (Ron).
