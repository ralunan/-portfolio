// Packages the built site (dist/) plus the sizing dial into a folder the
// Artifact tool can publish. Usage:
//   npm run build
//   node tools/sizing-dial/build.mjs tools/sizing-dial/configs/card-type.json <out-dir>
// Then publish <out-dir>/index.html with files = <out-dir>/files.json and
// capabilities {db: {}}. See tools/sizing-dial/README.md.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const [configPath, outArg] = process.argv.slice(2);
if (!configPath || !outArg) {
  console.error('Usage: node tools/sizing-dial/build.mjs <config.json> <out-dir>');
  process.exit(1);
}
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const dist = path.resolve(here, '../../dist');
const out = path.resolve(outArg);
if (!fs.existsSync(path.join(dist, 'index.html'))) {
  console.error('dist/index.html is missing. Run `npm run build` first.');
  process.exit(1);
}
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(path.join(out, 'assets'), { recursive: true });

// Artifact uploads reject some filenames (e.g. U+202F from macOS screenshot
// names), so rename anything outside a safe set and patch references.
const renames = {};
const safe = (name) => /^[\w.\- ()]+$/.test(name);
const assetNames = fs.readdirSync(path.join(dist, 'assets'));
for (const name of assetNames) {
  if (safe(name)) continue;
  const hash = name.match(/-([\w-]{8})\.(\w+)$/);
  renames[name] = hash ? `asset-${hash[1]}.${hash[2]}` : `asset-${Object.keys(renames).length}${path.extname(name)}`;
}
const patch = (text) => {
  for (const [from, to] of Object.entries(renames)) text = text.split(from).join(to);
  // The publisher rejects a literal U+FFFD; inside JS strings the escape is equivalent.
  return text.replace(/�/g, '\\ufffd');
};

const files = {};
let css = '';
for (const name of assetNames) {
  const src = path.join(dist, 'assets', name);
  if (name.endsWith('.css')) { css += fs.readFileSync(src, 'utf8'); continue; }
  const target = renames[name] || name;
  const dest = path.join(out, 'assets', target);
  if (name.endsWith('.js')) fs.writeFileSync(dest, patch(fs.readFileSync(src, 'utf8')));
  else fs.copyFileSync(src, dest);
  files[`assets/${target}`] = dest;
}

fs.copyFileSync(path.join(here, 'dial.js'), path.join(out, 'dial.js'));
fs.writeFileSync(path.join(out, 'config.js'), `window.DIAL_CONFIG = ${JSON.stringify(config, null, 2)};\n`);
files['config.js'] = path.join(out, 'config.js');
files['dial.js'] = path.join(out, 'dial.js');

// Pages can't load external stylesheets other than Google Fonts, so the
// site CSS is inlined and the fonts link is kept.
const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const fontLinks = (html.match(/<link[^>]+fonts\.googleapis\.com[^>]*>/g) || []).join('\n');
const entry = html.match(/<script type="module"[^>]*src="\.?\/?(assets\/[^"]+)"/);
if (!entry) { console.error('Could not find the entry script in dist/index.html.'); process.exit(1); }
const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${config.title}</title>
${fontLinks}
<style>${patch(css)}</style>
</head>
<body>
<div id="root"></div>
<script src="config.js"></script>
<script src="dial.js"></script>
<script type="module" src="${patch(entry[1])}"></script>
</body>
</html>
`;
fs.writeFileSync(path.join(out, 'index.html'), page);
fs.writeFileSync(path.join(out, 'files.json'), JSON.stringify(files, null, 2));
console.log(`Built ${config.title} in ${out}: ${Object.keys(files).length} files${Object.keys(renames).length ? `, renamed ${Object.keys(renames).length}` : ''}.`);
