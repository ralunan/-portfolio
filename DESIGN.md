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

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | #f7f6fb | Page background |
| `--surface` / `--surface-2` | #ffffff / #f1f0f7 | Cards, raised areas |
| `--text` | #16171d | Headings, primary type |
| `--body` | #3d414c | Long-form paragraphs |
| `--muted` / `--faint` | #5a5f6e / #868b98 | Secondary and tertiary type |
| `--line` / `--line-strong` / `--line-hover` | 8% / 16% / 28% ink | Borders |
| `--ink-accent` | #5a5ce6 | Links, hero italic gradient start |
| `--accent` | per project | Set from `projects.js`; tints cards, chapter numbers, outcomes |
| `--canvas` | #1d1e25 | Behind work images only (transparent boards with white labels) |
| `--brand-a` / `--brand-b` | #667eea / #764ba2 | Nav monogram, About photo glow (nod to v1) |

**Japanese palette** (springy boxes): `--kyoto-dusk` #5B5F8D, `--matcha-cream` #9BB29E, `--roasted-terracotta` #DA6B51, `--vanilla-foam` #F1DCBA.

**Cotton Candy pastels** (hero gradient, orbs, soft cards): `--cotton-lilac`, `--cotton-mist`, `--cotton-sky`, `--cotton-pink`, `--cotton-aqua`, `--cotton-blush`, `--orb-a`, `--orb-b`, `--hero-em-b`.

**Utility**: `--white`, `--black`, `--glass`, `--nav-glass`, `--tint-hover`, `--tint-active`, `--scrim`, `--overlay`, `--on-dark-*` (lightbox), `--success` / `--success-ring` (availability dot).

Project accents: Walmart UX Research #0e9fb5, Cashi #6b5cf0, Fashion #e8643a.

## Type

Fonts: **Inter** (UI and body, 400/500/600), **Inter Tight** (`--display`, headings), **Instrument Serif** italic (`--serif`, used for `<em>` accents in headings).

- Body: 17px / 1.65.
- Fixed scale (px): **12, 13, 14, 15, 16, 17, 18, 21, 22, 26**. Labels and eyebrows 12–13 (eyebrows uppercase, 0.12em tracking); UI and buttons 14–15; body 16–18; small headings 21–26.
- Fluid display tokens: `--fs-hero` clamp(44px, 8vw, 104px), `--fs-page` clamp(40px, 6vw, 72px), `--fs-section` clamp(32px, 4.5vw, 52px).
- Headings: weight 600, tracking −0.03em (−0.045em at hero size), line-height ~1.08.

## Spacing

Scale (px): **2, 4, 6, 8, 10, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64, 80, 96, 120, 140, 160**. Page gutter is `--gutter` (16–40px fluid); max content width `--max` 1200px.

## Radius and depth

`--radius-xs` 8px (focus rings, small chips) · `--radius-sm` 12px (thumbnails) · `--radius` 20px (cards) · `--radius-lg` 28px (large cards, heroes) · `--radius-pill` 999px (buttons, tags, nav links) · `50%` circles. One shadow: `--shadow`.

## Motion

Easing `--ease` cubic-bezier(0.22, 1, 0.36, 1). Route changes go through `Page`; scroll-ins through `Reveal`. Motion respects `prefers-reduced-motion` via `MotionConfig`.

## Known inconsistencies (to fix page by page)

Run `npm run design:check` for the live list. At the time this file was written it reported 36 items, mainly: 11 one-off fluid font sizes that should collapse into a few `--fs-*` tokens, a 19px body size, off-scale spacing (13/22px button padding, 14px nav links, 128px, 88px), and radii of 10/14/36/2px. The hero section's own values are left for the homepage work. Fix these as each page is revised rather than in one sweep, so every change can be checked visually.

## Decisions log

Newest first. Format: date, decision, why.

- **2026-10-01** Design system and consistency check introduced. Raw colors in `styles.css` replaced with tokens (no visual change).
- **2026-10-01** Charcoal Brew #484149 removed from the springy boxes. Too dark against the light hero (Ron).
- **2026-10-01** Hero text left-anchored at 1200px+, boxes on the right and slightly cropped off the edge.
- **2026-10-01** Home hero: Shader Gradient "09 Cotton Candy" plus springy boxes reshuffling every 6s, desktop only.
- **2026-10-01** Japanese box palette: Kyoto Dusk, Matcha Cream, Roasted Terracotta, Vanilla Foam.
- **2026-10-01** Light theme with dark type across the whole site (Ron). Work images keep a dark canvas because some boards are transparent PNGs with white labels.
- **2026-10-01** v2 moved from v1's full-screen screens to scrolling, product-focused case studies with one shared route transition.
- **2026-10-01** Work order: global theme, then homepage, then each case study one at a time, all on the shared theme (Ron).
