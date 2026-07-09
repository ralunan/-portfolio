# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Ronald Alunan's UX design portfolio — a static site (no build step, no framework, no npm) hosted on GitHub Pages at `github.com/ralunan/-portfolio`. The full product spec lives in `context-website.txt` at repo root; re-read it before any structural change since it's the source of truth and may be edited directly.

## Running locally

There is no Node.js or Python installed in this environment (only the Windows Store app-execution-alias stubs, which are not functional runtimes). `js/main.js` uses `fetch()` to load content `.txt` files and images at runtime, which the browser blocks under `file://` — the site **must** be served over `http://`, not opened directly.

To preview locally, start a minimal static file server (PowerShell's `System.Net.HttpListener` works with nothing extra installed) rooted at the repo, then open `http://localhost:<port>/` in a browser. GitHub Pages serves the site correctly with no extra steps once pushed — the local-server requirement is a dev-only workaround.

No lint/build/test commands exist for this project.

## Architecture

**Single-page app, hash-routed, no build step.** `index.html` contains one `<section class="screen">` per top-level view (home, resume, about, projects, project), all stacked and toggled by `js/main.js`. Routes: `#/`, `#/resume`, `#/about`, `#/projects`, `#/projects/<slug>/<page>`. `js/main.js` is the only script and is loaded as an ES module (`import`/`export` between it and `js/projects.js`).

**Full-screen, non-scrolling, transition-driven** (per `context-website.txt`): the site is not a scrolling page. Every navigation runs through `showScreen()` in `js/main.js`, which drives a state machine — exit the current screen (`.screen--exiting`, fly-out keyframe), render the next screen's content, enter it (`.screen--entering`, fly-in keyframe), settle to `.screen--active`. This animation pattern is meant to stay consistent across the whole site; don't add one-off transitions without reason.

**Content is data, not markup — fetched live from `.txt` files, never duplicated into JS.** Resume (`resume.txt`), About Me (`aboutme.txt`), and each project's text file are all plain text authored with a `## Heading` convention and parsed at runtime by the shared `parseSectionedText()` in `js/main.js`. A line starting with `## ` marks a section; everything until the next `## ` (or EOF) is that section's body. Text before the first `## ` is the "preamble" (used for the resume's name/contact block).

Project text files support a second-level `#Sub-heading` (single hash) inside a section's body, parsed by `renderBlockBody()` — used e.g. in "Methods Used" to break one section into labeled sub-blocks without creating new pages.

**Project page-building rule:** within a project's text file, the `Context` and `Problem statement` sections always merge into page 1; every other `##` section becomes its own subsequent page, in file order (`buildProjectPages()` in `js/main.js`).

**Project registry (`js/projects.js`)** — since static hosting can't list directories, each project is manually registered with metadata only (never content):
- `images`: filenames prefixed with the page number they belong to (`1_foo.png`, `2_bar.svg`, per `context-website.txt`'s numbering convention). The renderer matches images to pages by this prefix.
- `enlargeablePages`: page numbers where images get click-to-enlarge (lightbox + cursor + a floating "Click images to enlarge!" hint). This is a per-page editorial call based on image *content* (dense text/screenshots vs. illustrative cover art), not image count — keep it explicit rather than inferring it.
- `filmstripPages`: page numbers where images float into a thumbnail row instead of stacking full-width. Also explicit rather than purely count-based, since a page's chosen layout depends on image aspect ratio/count together (see the inline comments above `PROJECTS` in `js/projects.js` for current reasoning per page).

Adding a new project = one folder under `Projects/`, one `## `-formatted `.txt` file, optional numbered images, and one entry in `PROJECTS`.

**Established visual system** (`css/main.css`), reused across resume/about/project pages — match these rather than introducing new values:
- Two-column layouts use `500px 500px` (or a `fit-content`/computed variant) grid columns with `justify-content: center` and `40px` gaps.
- Image groups use `16px` gaps.
- Buttons and the persistent nav/commit-counter badges share one "glass pill" style: `border-radius: 999px`, `rgba(255,255,255,0.15)` background, `1px solid rgba(255,255,255,0.3)` border, `backdrop-filter: blur(12px)`.
- Filmstrip image width is computed per page in JS (`filmstripItemWidth` in `renderProjectDetail`) from the 500px column width divided across however many images share that page, not hardcoded — a page with 2 images should render noticeably larger thumbnails than a page with 3.

**Lightbox and commit counter are global, outside `#app`:** `#lightbox` and `#commit-counter` in `index.html` persist across route changes (the router only swaps `.screen` contents inside `#app`). The commit counter fetches the real commit count from the GitHub REST API (`api.github.com/repos/ralunan/-portfolio/commits`, using the `Link` header's `rel="last"` page number rather than paginating) — it is not a manually maintained value.
