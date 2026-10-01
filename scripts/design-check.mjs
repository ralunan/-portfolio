// Design consistency check. Flags styling values that bypass the design
// tokens in src/styles/tokens.css (:root) or the scales in DESIGN.md.
//   npm run design:check            report only
//   npm run design:check -- --strict   exit 1 when anything is flagged
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const STYLES = join(ROOT, 'src/styles');
const TOKENS = join(STYLES, 'tokens.css');

// Scales from DESIGN.md. Keep the two in sync.
const FONT_SIZES = [12, 13, 14, 15, 16, 17, 18, 21, 22, 26];
const SPACING = [0, 1, 2, 4, 6, 8, 10, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64, 80, 96, 120, 140, 160];
const FONT_WEIGHTS = [400, 500, 600];

const rootBlock = readFileSync(TOKENS, 'utf8').match(/:root\s*{([\s\S]*?)\n}/)[1];
const tokenValues = new Set(
    [...rootBlock.matchAll(/--[\w-]+:\s*([^;]+);/g)].map((m) => norm(m[1])),
);

function norm(v) {
    return v.trim().toLowerCase().replace(/\s+/g, ' ');
}

const findings = [];
const flag = (file, line, rule, text) => findings.push({ file: relative(ROOT, file), line, rule, text: text.trim() });

const COLOR = /#[0-9a-f]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)/gi;

function walk(dir, ext) {
    return readdirSync(dir).flatMap((f) => {
        const p = join(dir, f);
        return statSync(p).isDirectory() ? walk(p, ext) : ext.test(f) ? [p] : [];
    });
}

// ---- src/styles/**/*.css: everything except tokens.css, skipping @media print ----
for (const CSS of walk(STYLES, /\.css$/)) {
    if (CSS === TOKENS) continue;
    const css = readFileSync(CSS, 'utf8');
    const lines = css.split('\n');
    let depth = 0;
    let printDepth = -1;
    lines.forEach((raw, i) => {
        const line = raw.replace(/\/\*.*?\*\//g, '');
        if (/@media\s+print/.test(line)) printDepth = depth;
        const inPrint = printDepth >= 0;
        const decl = line.match(/^\s*([\w-]+)\s*:\s*(.+?);?\s*$/);
        if (!inPrint && !/^\s*--/.test(line)) {
            for (const c of line.match(COLOR) || []) flag(CSS, i + 1, 'raw-color', `${c}  (use a color token)`);
        }
        if (decl && !inPrint) {
            const [, prop, value] = decl;
            if (!prop.startsWith('--')) {
                if (prop === 'font-size') {
                    const px = value.match(/^(\d+)px$/);
                    if (px && !FONT_SIZES.includes(+px[1])) flag(CSS, i + 1, 'font-size', `${value}  (not on the type scale)`);
                    if (/clamp|min\(|max\(/.test(value) && !/var\(--fs-/.test(value)) flag(CSS, i + 1, 'font-size', `${value}  (fluid size: use a --fs-* token)`);
                }
                if (prop === 'font-weight' && !FONT_WEIGHTS.includes(+value)) flag(CSS, i + 1, 'font-weight', value);
                if (prop === 'border-radius' && !/^(var\(--radius[\w-]*\)|50%|0|inherit)$/.test(value.trim()))
                    flag(CSS, i + 1, 'radius', `${value}  (use a --radius-* token)`);
                if (/^(padding|margin|gap|row-gap|column-gap)/.test(prop)) {
                    for (const m of value.matchAll(/(?<![\w(.-])(-?\d+)px/g)) {
                        if (!SPACING.includes(Math.abs(+m[1])) && !/clamp|calc|min\(|max\(/.test(value))
                            flag(CSS, i + 1, 'spacing', `${prop}: ${value}  (${m[1]}px is off the spacing scale)`);
                    }
                }
            }
        }
        depth += (line.match(/{/g) || []).length - (line.match(/}/g) || []).length;
        if (printDepth >= 0 && depth <= printDepth) printDepth = -1;
    });
}

// ---- JS/JSX: colors must be tokens (or a project accent in projects.js) ----
for (const file of walk(join(ROOT, 'src'), /\.(jsx?|tsx?)$/)) {
    readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
        if (file.endsWith('projects.js') && /^\s*accent:/.test(line)) return; // per-project accent, by design
        for (const c of line.match(COLOR) || []) {
            if (!tokenValues.has(norm(c))) flag(file, i + 1, 'raw-color', `${c}  (not a token value; add it to :root or pick an existing token)`);
        }
        const style = line.match(/(fontSize|borderRadius|padding|margin)\s*:\s*['"]?([1-9]\d*)(px)?/);
        if (style) flag(file, i + 1, 'inline-style', `${style[1]}: ${style[2]}  (inline sizes skip the scale; use a CSS class)`);
    });
}

if (!findings.length) {
    console.log('Design check: no off-token values found.');
} else {
    const byRule = {};
    for (const f of findings) (byRule[f.rule] ||= []).push(f);
    for (const [rule, list] of Object.entries(byRule)) {
        console.log(`\n${rule} (${list.length})`);
        for (const f of list) console.log(`  ${f.file}:${f.line}  ${f.text}`);
    }
    console.log(`\nDesign check: ${findings.length} value(s) bypass the design system.`);
}
if (findings.length && process.argv.includes('--strict')) process.exit(1);
