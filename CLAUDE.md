# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Ronald Alunan's UX/product design portfolio, v2: a React + Vite single-page site hosted on GitHub Pages at `ralunan.github.io/-portfolio/`. v1 (plain HTML/CSS/JS, full-screen non-scrolling screens) is preserved on the `v1-backup` branch. `context-website.txt` holds the original v1 product spec; v2 deliberately moved to scrolling, product-focused case studies, but keeps v1's content conventions below.

## Commands

- `npm install` once, then `npm run dev` for a local preview with hot reload.
- `npm run build` outputs the static site to `dist/`. `npm run preview` serves that build.
- No lint or test setup exists.

## Deploy

`.github/workflows/deploy.yml` builds and deploys to GitHub Pages on every push to `main`. The repo's Pages source must be set to "GitHub Actions" (Settings → Pages). `vite.config.js` uses `base: './'` and the app uses `HashRouter` (`#/work/cashi`), so nothing hard-codes the repo path and no server rewrites are needed.

## Architecture

- `src/main.jsx` mounts the app inside `HashRouter` and `MotionConfig reducedMotion="user"`.
- `src/App.jsx` declares routes (`/`, `/work/:slug`, `/about`, `/resume`) inside `AnimatePresence`; every route is wrapped in `components/Page.jsx`, the one shared fly-in/fly-out transition for the whole site. Don't add one-off route transitions.
- `components/Reveal.jsx` is the shared scroll-into-view animation. Reuse it rather than adding new motion patterns.
- `components/Lightbox.jsx` provides click-to-enlarge (`useLightbox()`), showing images at native width with scroll because many boards are dense Figma flows.
- Styling is one stylesheet, `src/styles.css`, with tokens on `:root`. Each project sets `--accent` from its registry entry, which tints its card, case-study hero, chapter numbers and outcome cards.

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
