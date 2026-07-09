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

**Project page-building rule:** within a project's text file, the `Context` and `Problem statement` sections always merge into page 1; every other `##` section becomes its own subsequent page, in file order (`buildProjectPages()` in `js/main.js`). A `##` section with an empty body (nothing before the next `##`) renders **no text at all** for that page — just the eyebrow and its images — for pages meant to be image-only with description headers above the images (see `Item Tiles`/`Accounts` in `Projects/Fashion/fashion-context.txt` for the pattern).

**Project registry (`js/projects.js`)** — since static hosting can't list directories, each project is manually registered with metadata only (never content). `images` is a list where each entry is either a plain filename or an object with:
- `caption`: a title rendered above that image.
- `column: 'left'`: renders the image in the left text column instead of the default right image column (e.g. to pair one image per column at an even scale, or to fill a column that has no body text).
- `width`: caps that image at N px instead of the default 500 — used to shrink several stacked/floated images so a page fits without scrolling.
- `hint: true`: explicitly makes this image the one carrying the floating "Click images to enlarge!" hint, overriding the automatic default (middle image for a filmstrip row, first uncaptioned image otherwise — captioned images are skipped by default so the hint doesn't collide with the caption).

Each filename is prefixed with the page number it belongs to (`1_foo.png`, `2_bar.svg`, per `context-website.txt`'s numbering convention); the renderer matches images to pages by this prefix, independently for images bound for the left vs. right column.

Two more project-level fields, both explicit rather than inferred, since the right call depends on image *content* (dense screenshot vs. illustration vs. wide diagram), not just count or page number:
- `enlargeablePages`: page numbers where images get click-to-enlarge (lightbox + cursor + the hint).
- `filmstripPages`: page numbers where images float inline (top-aligned, right to left) instead of stacking full-width — applies independently to the left and right column of that page, each sized to fit however many images share that specific column (`filmstripWidth()` in `renderProjectDetail`). If omitted for a project, this falls back to "3+ images in the right column" per page.

Adding a new project = one folder under `Projects/`, one `## `-formatted `.txt` file, optional numbered images, and one entry in `PROJECTS`.

**Established visual system** (`css/main.css`), reused across resume/about/project pages — match these rather than introducing new values:
- Two-column layouts use `500px 500px` (or a `fit-content`/computed variant) grid columns with `justify-content: center` and `40px` gaps.
- Image groups use `16px` gaps.
- Buttons and the persistent nav/commit-counter/add-project-modal-CTA all share one "glass pill" style: `border-radius: 999px`, `rgba(255,255,255,0.15)` background, `1px solid rgba(255,255,255,0.3)` border, `backdrop-filter: blur(12px)`.
- The project page's eyebrow (project title + "Page X of Y") sits *above* `.project-page-grid`, not inside either column — it needs to be outside both so the two columns' actual content (text/images) starts at the same top position regardless of caption/heading differences between them.
- `#screen-project` uses `align-items: flex-start` (top-anchored) instead of the `center` every other screen uses, so the eyebrow stays at a fixed vertical position across pages of wildly different content height — don't remove this without expecting the eyebrow to jump around page to page.

**Global widgets, outside `#app`, persisting across route changes** (the router only swaps `.screen` contents inside `#app`):
- `#lightbox` (`setupLightbox()`) — click-to-enlarge overlay for any `.project-page-image--enlargeable`, native resolution with scroll (not shrunk to fit) via `safe center` alignment.
- `#add-project-modal` (`setupAddProjectModal()`) — opened by the dashed "+" placeholder tile on the Projects index.
- `#commit-counter` (`updateCommitCounter()`) — fetches the real commit count from the GitHub REST API (`api.github.com/repos/ralunan/-portfolio/commits`, using the `Link` header's `rel="last"` page number rather than paginating). Not a manually maintained value.
