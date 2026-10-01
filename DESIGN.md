# Design system

The single source of truth for how the portfolio looks. Values live as CSS custom properties on `:root` in `src/styles.css`; this file explains them and records why they were chosen. `npm run design:check` flags any styling value that bypasses them.

## Rules

1. **Colors are tokens.** Outside `:root`, CSS uses `var(--…)`, never a raw hex, `rgb()` or `rgba()`. A new color is added to `:root` first, with a comment, and logged below. JS/JSX may only use hex values that already exist as tokens (the shader gradient and springy boxes need literal strings). The one exception is the per-project `accent` in `src/projects.js`, which feeds `--accent`.
2. **Type sizes come from the scale.** Fixed sizes use the px scale below. Fluid display sizes use a `--fs-*` token; add one rather than writing a new `clamp()`.
3. **Spacing comes from the scale.** Padding, margin and gap use the px steps below (fluid `clamp()` spacing is fine for section rhythm).
4. **Radii are tokens.** `var(--radius-*)`, or `50%` for circles.
5. **Reuse components before adding new ones**: `.button` / `.button--primary`, `.tags`, `.eyebrow`, `.section-title`, `.page-title`, `.container`, `Reveal` (scroll-in motion), `Page` (route transition), `Lightbox` (click to enlarge).
6. **Light theme, dark type, everywhere.** No reversed (light-on-dark) text sections. The dark `--canvas` exists only behind work images.
7. **Log decisions.** Any change to a token, a scale or a rule above gets a dated line in the decisions log, with the reason.

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
- **Links and CTAs to the work are editorial text links**, not buttons (`.text-cta`, `.text-cta--lg`): Geist Semibold with one emphasized word, e.g. "See selected *work*", "Read the *case study*". In the header, the current page shows in the emphasis italic instead of a pill.
- **Link hover is Matcha**: links grow slightly (scale 1.04) and turn `--positive` green, emphasized words included. No underlines. Scaling is skipped for reduced-motion users.
- **Emphasis is one treatment everywhere**: any `<em>` is Instrument Serif italic filled with the `--emphasis` gradient (Kyoto Dusk into Roasted Terracotta). The global `em` rule in `styles.css` does this; never restyle `em` per component or give it another color. Use it in headings only (the Terracotta end is too light for body-size text), at most one emphasis per heading.
- Primary buttons are Charcoal Brew with white type (9.9:1).

## Type

Brand typeface: **Geist** for everything, display and body (`--font` and `--display` both point to it). Ron chose it over Inter Tight because it is a little more open and has more character in its end points, while staying compact. Weights: 400 body, 500 UI, 600 headings.

Emphasis face: **Instrument Serif Italic** (`--serif`). The contrast between Geist and this italic is part of the brand. Instrument Serif regular is also used for numbers (chapter and card numbers).

Don't add other font families. Ron rejected serif headings and wider sans faces such as Instrument Sans.

- Body: 17px / 1.65.
- Fixed scale (px): **12, 13, 14, 15, 16, 17, 18, 21, 22, 26**. Labels and eyebrows 12–13 (eyebrows uppercase, 0.12em tracking); UI and buttons 14–15; body 16–18; small headings 21–26.
- Display scale (fluid, max size on desktop). Every title uses one of these; never write a new `clamp()` for a title.

| Token | Max | Used for |
| --- | --- | --- |
| `--fs-hero` | 64px | Home hero headline |
| `--fs-display` | 56px | Case study titles, footer headline |
| `--fs-page` | 48px | Page titles (About, Resume) |
| `--fs-section` | 40px | Section titles, stat numbers |
| `--fs-title` | 32px | Next-project title, About teaser title |
| `--fs-title-sm` | 28px | Chapter titles, project card titles |
- Headings: weight 600, tracking −0.03em (−0.045em at hero size), line-height ~1.08.

## Spacing

Scale (px): **2, 4, 6, 8, 10, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64, 80, 96, 120, 140, 160**. Page gutter is `--gutter` (16–40px fluid); max content width `--max` 1200px.

## Radius and depth

`--radius-xs` 8px (focus rings, small chips) · `--radius-sm` 12px (thumbnails) · `--radius` 20px (cards) · `--radius-lg` 28px (large cards, heroes) · `--radius-pill` 999px (buttons, tags, nav links) · `50%` circles. One shadow: `--shadow`.

## Motion

Easing `--ease` cubic-bezier(0.22, 1, 0.36, 1). Route changes go through `Page`; scroll-ins through `Reveal`. Motion respects `prefers-reduced-motion` via `MotionConfig`.

## Known inconsistencies (to fix page by page)

Run `npm run design:check` for the live list. At the time this file was written it reported 36 items, mainly: one-off fluid font sizes that should collapse into a few `--fs-*` tokens (titles were consolidated on 2026-10-01; subtitle sizes remain), a 19px body size, off-scale spacing (13/22px button padding, 14px nav links, 128px, 88px), and radii of 10/14/36/2px. The hero section's own values are left for the homepage work. Fix these as each page is revised rather than in one sweep, so every change can be checked visually.

## Decisions log

Newest first. Format: date, decision, why.

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
