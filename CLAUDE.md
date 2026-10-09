# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Ronald Alunan's UX/product design portfolio, v2: a React + Vite single-page site hosted on GitHub Pages at `ralunan.github.io/-portfolio/`. v1 (plain HTML/CSS/JS, full-screen non-scrolling screens) is preserved on the `v1-backup` branch. `context-website.txt` holds the original v1 product spec; v2 deliberately moved to scrolling, product-focused case studies, but keeps v1's content conventions below.

## Commands

- `npm install` once, then `npm run dev` for a local preview with hot reload.
- `npm run build` outputs the static site to `dist/`. `npm run preview` serves that build.
- `npm run design:check` lists styling values that bypass the design tokens (`-- --strict` exits non-zero). No lint or test setup exists.

## Deploy

`.github/workflows/deploy.yml` builds and deploys to GitHub Pages on every push to `main`. The repo's Pages source must be set to "GitHub Actions" (Settings → Pages). `vite.config.js` uses `base: './'` and the app uses `HashRouter` (`#/work/cashi`), so nothing hard-codes the repo path and no server rewrites are needed.

## Architecture

- `src/main.jsx` mounts the app inside `HashRouter` and `MotionConfig reducedMotion="user"`.
- `src/App.jsx` declares routes (`/`, `/work/:slug`, `/about`, `/resume`) inside `AnimatePresence`; every route is wrapped in `components/Page.jsx`, the one shared fly-in/fly-out transition for the whole site. Don't add one-off route transitions.
- `components/Reveal.jsx` is the shared scroll-into-view animation. Reuse it rather than adding new motion patterns.
- `components/Lightbox.jsx` provides click-to-enlarge (`useLightbox()`), showing images at native width with scroll because many boards are dense Figma flows.
- Styles live in `src/styles/`, one file per area, loaded in a fixed order by `src/styles/index.css` (see the file map below). Tokens are on `:root` in `tokens.css` (documented in `DESIGN.md`). Each project sets `--accent` from its registry entry, which tints its card, case-study hero, chapter numbers and outcome cards.

## File map: where to change what

Each component's phone overrides (`@media (max-width: 960px)` / `640px`) sit at the bottom of that component's CSS file, not in a shared responsive block.

| To change | Component | Styles |
| --- | --- | --- |
| Colors, fonts, radii, fluid sizes | | `src/styles/tokens.css` |
| Body type, headings, `<em>` emphasis, `.eyebrow`, `.section-title`, `.container`, background orbs | | `src/styles/base.css` |
| Top nav | `components/Nav.jsx` | `styles/components/nav.css` |
| Buttons, tags | | `styles/components/buttons.css` |
| Text CTAs and the shared Matcha link hover | | `styles/components/text-cta.css` |
| Footer | `components/Footer.jsx` | `styles/components/footer.css` |
| Lightbox | `components/Lightbox.jsx` | `styles/components/lightbox.css` |
| Home page order, hero-to-work scroll hand-off, `#/highlights` deep link | `pages/Home.jsx` | |
| Home hero (headline, gradient, springy boxes, scroll cue) | `components/home/Hero.jsx`, `HeroGradient.jsx`, `SpringyBoxes.jsx`, `useHeroHandoff.js` | `styles/home/hero.css` |
| Highlights (stat tiles) | `components/home/Highlights.jsx` | `.stats` in `styles/home/work.css` |
| Selected Work: stage vs. stacked list switch | `components/home/SelectedWork.jsx` | `styles/home/work.css` |
| Pinned work stage (card swap, peek, tilt, counter) | `components/home/WorkStage.jsx` | `.work-stage*` in `styles/home/work.css` |
| Project card | `components/home/ProjectCard.jsx` | `styles/home/project-card.css` (stage sizing in `work.css`) |
| How I work | `components/home/Approach.jsx` | `styles/home/approach.css` |
| About teaser | `components/home/AboutTeaser.jsx` | `styles/home/about-teaser.css` |
| Case studies | `pages/CaseStudy.jsx` | `styles/pages/case-study.css` |
| About, Resume, 404 | `pages/About.jsx`, `Resume.jsx`, `NotFound.jsx` | `styles/pages/about.css`, `resume.css`, `not-found.css` |
| Resume "Save as PDF" | | `styles/print.css` (keep it last in `index.css`) |

A new stylesheet gets an `@import` in `src/styles/index.css` next to its area; `npm run design:check` scans every file in `src/styles/`.

## Content is data, never duplicated into JS

`resume.txt`, `aboutme.txt` and each project's text file are imported raw at build time and parsed in `src/content.js`:
- A line starting with `## ` opens a section; text before the first one is the preamble (the resume's name / title / email).
- Inside a section, a line starting with a single `#` is a sub-heading grouping the following paragraphs (used in "Methods Used").
- Resume: "Experience" and "Experience (cont.)" merge into one list. In each blank-line-separated chunk, line 1 is the organization, line 2 the title and dates, further lines are description; a chunk that is a single long line is a bullet of the previous role.

## Projects

`src/projects.js` registers each project with metadata only (title, tagline, tags, meta rows, outcomes, accent, cover, images). The case study text comes from `Projects/<folder>/<file>`.
- Chapter 1 is always `## Context` + `## Problem statement` (the problem statement renders as a highlighted card). Every other `##` section becomes the next chapter, in file order. A section with an empty body renders as heading + images only.
- Image filenames start with their chapter number (`1_x.png`, `2_x.png`); `src/content.js` matches them by that prefix. Entries can be `{ file, caption }`.
- `gridPages` lists chapters whose images are tall/portrait and sit side by side; other chapters stack images full width (two images sit in two columns).
- The `cover` image appears on the home card and the case-study hero, and is skipped in its own chapter's gallery.

Adding a project = a folder under `Projects/`, a `## `-formatted `.txt` file, numbered images, and one entry in `PROJECTS`.

## Design system (read before any visual change)

`DESIGN.md` holds the tokens, scales, component rules and a dated decisions log. Every session that changes how the site looks must:
- use existing tokens and scales (no raw colors outside `:root`, font sizes and spacing on the scale, radii via `--radius-*`), and reuse existing components before adding new ones;
- run `npm run design:check` and not add new findings; fix pre-existing ones on the page being revised, not in bulk;
- add a dated line to the DESIGN.md decisions log for any design decision Ron makes or approves (a new color, a size change, a dropped element), with the reason;
- before opening a PR that touches styles, components or pages, run the `design-steward` agent (`.claude/agents/design-steward.md`) and address what it reports.

## Style and visual flair

`STYLE.md` holds the rules and the artifact log for visual flair (illustrations, textures, images, video, animation). When Ron asks for flair, use the `style-agent` (`.claude/agents/style-agent.md`): it proposes artifacts in `style-lab/` using only palette colors and logs them, and never edits `src/`. Placing an approved artifact on a page is a normal one-component change: follow the design system rules above, run `design-steward`, and update the artifact's status in `STYLE.md` to applied.
