# Sizing dial

A reusable slider tool for tuning sizes per breakpoint on the real site. It loads
a built copy of the site, shows which breakpoint the window is in, and adds one
slider per control. Ron moves the sliders, then presses "Lock this breakpoint";
locked values are saved to the artifact's shared store so Claude can read them
back and apply them to `src/` (after a design-steward check).

It's a prototype tool only. Nothing here ships with the site, and its panel
styling is outside the design system on purpose.

## Make a new dial

1. Copy a config in `configs/` and change it. Each control is one CSS property
   on one selector:
   - `id`, `label`, optional `group` (panel heading) and `short` (table column)
   - `sel`: the CSS selector to override; `prop`: e.g. `font-size`, `gap`,
     `padding-top`, `max-width`; `unit`: defaults to `px`
   - `min`, `max`, optional `step`
   - `breakpoints`: `{ id, label, range, min, max }` in px
   - `jumpTo`: optional selector the page scrolls to on load
   - `tableColumns`: two control ids shown in the breakpoints table
   - `measure`: optional `{ label, sel }` boxes whose size the panel reports
2. `npm run build`, then
   `node tools/sizing-dial/build.mjs tools/sizing-dial/configs/<name>.json <scratchpad>/<name>`
3. Publish `<scratchpad>/<name>/index.html` with the Artifact tool, passing the
   contents of `files.json` as `files` and `capabilities: { db: {} }`.

The build inlines the site CSS (artifact pages can't load local stylesheets),
renames asset files with characters the publisher rejects, and escapes U+FFFD in
the JS bundle.

## Read the locked values

Locks are saved to db doc `dial/<config id>` as
`{ breakpoints: { <bp id>: { values: { <control id>: number }, width, at } } }`.
Read them with ArtifactData `get` (collection `dial`, doc id = config id).

## Dials so far

- `card-type`: type sizes in the highlight and project cards. The first version
  of this dial was published before the template existed and saves to
  `typelab/locked` with `sizes` in place of `values`.
