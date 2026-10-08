"""Builds the expression options board (HTML) for surprised and worried looks, from ff.py."""
import sys, base64, hashlib, re
sys.path.insert(0, '.')
import ff, render
render.sprite = ff

FONTS = sys.argv[1]  # folder with fonts.css and downloaded woff2 files
css = open(f'{FONTS}/fonts.css').read()
def _inline(m):
    name = hashlib.md5((m.group(1) + '\n').encode()).hexdigest()[:12]
    return 'url(data:font/woff2;base64,' + base64.b64encode(open(f'{FONTS}/{name}.woff2', 'rb').read()).decode() + ')'
font_css = re.sub(r'url\((https://fonts\.gstatic\.com[^)]*)\)', _inline, css)

def cell(key, rows, label, note):
    return (f'<figure class="cell"><div class="art">{render.svg(rows, 10)}</div>'
            f'<figcaption><b>{key} · {label}</b><span>{note}</span></figcaption></figure>')

surprised = ''.join([
    cell('S1', ff.SURPRISE_A, 'Gasp', 'Open mouth, same eyes. The quietest option.'),
    cell('S2', ff.SURPRISE_B, 'Shock', 'Eye whites show above the pupils, open mouth, "!" pops over his head.'),
    cell('S3', ff.SURPRISE_C, 'Whoa', 'Shock face with both hands up (the approved yay arms) and the "!".'),
])
worried = ''.join([
    cell('W1', ff.WORRY_A, 'Nervous', 'Eyes slide to the side, wavy mouth.'),
    cell('W2', ff.WORRY_B, 'Eek', 'Wide flat grimace with a sweat drop.'),
    cell('W3', ff.WORRY_C, 'Uh-oh', 'Brows up in the middle, small frown, hand at his cheek, sweat drop.'),
])
neutral = render.svg(ff.FRONT, 10)

draft25 = ''.join([
    cell('W1', ff.WORRY_A, 'Nervous', 'Draft 24, for comparison.'),
    cell('W4', ff.WORRY_D, 'Nervous + drop', 'Flat sweat drop, 2 px bigger, high above his head like the "!".'),
    cell('W5', ff.WORRY_E, 'Nervous + big drop', 'Same, with the drop at 2x.'),
])

html = f'''<!doctype html><html><head><meta charset="utf-8"><title>Ron 8-bit expressions</title>
<style>
{font_css}
* {{ box-sizing:border-box; }}
body {{ margin:0; background:#fbf7f0; color:#484149; font-family:Geist, sans-serif; }}
.sheet {{ width:1280px; padding:48px 56px; }}
.eyebrow {{ font-size:12px; letter-spacing:.12em; text-transform:uppercase; color:#a65646; font-weight:500; margin:0 0 8px; }}
h1 {{ font-size:40px; font-weight:600; letter-spacing:-.03em; margin:0 0 32px; }}
.panel {{ background:#fff; border:1px solid rgba(72,65,73,.1); border-radius:20px; padding:24px 28px; margin-bottom:24px; }}
h2 {{ font-size:21px; font-weight:600; margin:0 0 20px; color:#5b5f8d; }}
.row {{ display:grid; grid-template-columns:160px repeat(3, 1fr); gap:24px; align-items:end; }}
.cell {{ margin:0; display:flex; flex-direction:column; gap:12px; }}
.art {{ height:330px; display:flex; align-items:flex-end; }}
figcaption {{ display:flex; flex-direction:column; gap:4px; font-size:14px; line-height:1.5; color:#6f6770; }}
figcaption b {{ color:#484149; font-weight:600; font-size:16px; }}
</style></head><body><div class="sheet">
<p class="eyebrow">Character sheet · draft 25 · expression ideas</p>
<h1>Surprised and worried</h1>
<section class="panel"><h2>Worried, draft 25</h2><div class="row">{cell('', ff.FRONT, 'Neutral', 'For comparison.').replace('<b> · ', '<b>')}{draft25}</div></section>
<section class="panel"><h2>Surprised</h2><div class="row">{cell('', ff.FRONT, 'Neutral', 'For comparison.').replace('<b> · ', '<b>')}{surprised}</div></section>
<section class="panel"><h2>Worried</h2><div class="row">{cell('', ff.FRONT, 'Neutral', 'For comparison.').replace('<b> · ', '<b>')}{worried}</div></section>
</div></body></html>'''
open(sys.argv[2], 'w').write(html)
