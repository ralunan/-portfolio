"""Builds the Ron 8-bit character sheet (HTML) from the sprite maps in ff.py."""
import sys, base64, hashlib, re
sys.path.insert(0, '.')
import ff, render
render.sprite = ff

FONTS = sys.argv[1]  # folder with fonts.css and downloaded woff2 files
css = open(f'{FONTS}/fonts.css').read()
def _inline(m):
    url = m.group(1)
    name = hashlib.md5((url + '\n').encode()).hexdigest()[:12]
    data = base64.b64encode(open(f'{FONTS}/{name}.woff2', 'rb').read()).decode()
    return f'url(data:font/woff2;base64,{data})'
font_css = re.sub(r'url\((https://fonts\.gstatic\.com[^)]*)\)', _inline, css)

def sprite(rows, scale=8, flip=False):
    if flip: rows = [r[::-1] for r in rows]
    return render.svg(rows, scale)

def cell(rows, label, scale=8, flip=False):
    return f'<figure class="cell">{sprite(rows, scale, flip)}<figcaption>{label}</figcaption></figure>'

SWATCHES = [
    ('O', 'Outline, eyes', 'Charcoal deep'), ('H', 'Hair, mustache', 'Charcoal Brew'), ('b', 'Trimmed beard', 'Charcoal Brew 45% on Vanilla'),
    ('B', 'Hair sheen', 'Kyoto Dusk'), ('S', 'Skin', 'Vanilla Foam'),
    ('s', 'Skin shade', 'Terracotta 35% on Vanilla'), ('n', 'Mouth', 'Terracotta ink'),
    ('P', 'Flannel', 'Kyoto Dusk'), ('L', 'Flannel light', 'Kyoto Dusk 70% on white'),
    ('p', 'Flannel shade', 'Kyoto Dusk 60% on charcoal'), ('r', 'Flannel check', 'Roasted Terracotta'),
    ('W', 'Tee', 'White'), ('j', 'Far trouser leg', 'Charcoal Brew 70% on charcoal'), ('G', 'Sneakers', 'Matcha Cream'),
]
swatches = ''.join(
    f'<li><span class="chip" style="background:{ff.PAL[k]}"></span><b>{use}</b><small>{src} · {ff.PAL[k]}</small></li>'
    for k, use, src in SWATCHES)

bubble = '''<div class="talk">
  <div class="bubble">Hi, I'm Ron. Here's the thinking behind this project.</div>
  ''' + sprite(ff.TALK, 8) + '''
</div>'''

html = f'''<!doctype html><html><head><meta charset="utf-8"><title>Ron 8-bit character sheet</title>
<style>
{font_css}
:root {{ --bg:#fbf7f0; --surface:#ffffff; --text:#484149; --muted:#6f6770; --label:#a65646; --line:rgba(72,65,73,.1); }}
* {{ box-sizing:border-box; }}
body {{ margin:0; background:var(--bg); color:var(--text); font-family:Geist, sans-serif; }}
.sheet {{ width:1280px; padding:56px; }}
header {{ display:flex; align-items:flex-end; justify-content:space-between; margin-bottom:40px; }}
.eyebrow {{ font-size:12px; letter-spacing:.12em; text-transform:uppercase; color:var(--label); font-weight:500; margin:0 0 8px; }}
h1 {{ font-size:48px; font-weight:600; letter-spacing:-.03em; line-height:1.08; margin:0; }}
em {{ font-family:'Instrument Serif', serif; font-style:italic; font-weight:400;
      background:linear-gradient(120deg,#5b5f8d,#da6b51); -webkit-background-clip:text; background-clip:text; color:transparent; padding-right:4px; }}
.meta {{ font-size:14px; color:var(--muted); text-align:right; line-height:1.6; }}
.grid {{ display:grid; grid-template-columns:1fr 1fr; gap:24px; }}
.panel {{ background:var(--surface); border:1px solid var(--line); border-radius:20px; padding:24px 28px; }}
.panel.wide {{ grid-column:1 / -1; }}
h2 {{ font-size:21px; font-weight:600; letter-spacing:-.02em; margin:0 0 4px; color:#5b5f8d; }}
.panel p {{ font-size:14px; color:var(--muted); margin:0 0 20px; }}
.row {{ display:flex; gap:48px; align-items:flex-end; flex-wrap:wrap; }}
.cell {{ margin:0; display:flex; flex-direction:column; align-items:center; gap:10px; }}
figcaption {{ font-size:13px; color:var(--muted); }}
.talk {{ display:flex; align-items:flex-end; gap:12px; }}
.bubble {{ position:relative; max-width:260px; background:#fff; border:4px solid #2b262c; border-radius:8px;
           padding:12px 16px; font-size:15px; line-height:1.4; margin-bottom:120px; box-shadow:4px 4px 0 #f1dcba; }}
.bubble::after {{ content:''; position:absolute; right:-10px; bottom:18px; width:14px; height:14px; background:#fff;
                  border:4px solid #2b262c; border-left:0; border-bottom:0; transform:rotate(45deg); }}
.hero {{ display:flex; gap:48px; align-items:center; }}
ul.palette {{ list-style:none; padding:0; margin:0; display:grid; grid-template-columns:repeat(5,1fr); gap:14px 20px; }}
ul.palette li {{ display:grid; grid-template-columns:32px 1fr; column-gap:10px; align-items:center; }}
.chip {{ grid-row:span 2; width:32px; height:32px; border-radius:8px; border:1px solid var(--line); }}
ul.palette b {{ font-size:14px; font-weight:500; }}
ul.palette small {{ font-size:12px; color:var(--muted); }}
.notes {{ font-size:14px; color:var(--muted); line-height:1.65; margin:0; padding-left:18px; }}
</style></head><body><div class="sheet">
<header>
  <div><p class="eyebrow">Character sheet · draft 17</p><h1>Ron, the <em>pixel</em> persona</h1></div>
  <div class="meta">16 × 24 px sprite, Final Fantasy III / VI scale<br>Japanese palette only · shown at 8× and 12×</div>
</header>
<div class="grid">
  <section class="panel wide"><h2>Hero sprite</h2><p>The base pose, drawn from your profile photo: wild, curly black hair, trimmed beard, flannel over a white tee.</p>
    <div class="hero">{cell(ff.FRONT, 'Front · 12×', 12)}{cell(ff.FRONT, '1× actual size', 1)}{cell(ff.FRONT, '3×', 3)}{cell(ff.FRONT, '6×', 6)}</div></section>
  <section class="panel wide"><h2>Turnaround</h2><p>Front, side and back, the four directions a walking sprite needs.</p>
    <div class="row">{cell(ff.FRONT,'Front')}{cell(ff.SIDE,'Left')}{cell(ff.BACK,'Back')}{cell(ff.SIDE,'Right',flip=True)}</div></section>
  <section class="panel wide"><h2>Walk cycle</h2><p>Step frames for walking toward the viewer, and a four-frame side stride: step, pass, step, pass. The legs cross under the body on each pass, where the body rises 1 px.</p>
    <div class="row">{cell(ff.WALK_L,'Step 1')}{cell(ff.FRONT,'Stand')}{cell(ff.WALK_R,'Step 2')}</div><div class="row" style="margin-top:28px">{cell(ff.SIDE_A,'Step A')}{cell(ff.PASS_A,'Pass A')}{cell(ff.SIDE_B,'Step B')}{cell(ff.PASS_B,'Pass B')}{cell(ff.SIDE,'Side rest')}</div></section>
  <section class="panel"><h2>Expressions</h2><p>Face swaps on the same body, for idle blinks and reactions.</p>
    <div class="row">{cell(ff.FRONT,'Neutral')}{cell(ff.BLINK,'Blink')}{cell(ff.HAPPY,'Happy')}</div></section>
  <section class="panel"><h2>Talk pose</h2><p>Hand raised, ready for a project note in a chat bubble.</p>{bubble}</section>
  <section class="panel wide"><h2>Palette</h2><p>Every pixel uses your design-system colors. Shades are a palette color laid over another, flattened so the pixels stay crisp.</p>
    <ul class="palette">{swatches}</ul></section>
</div></div></body></html>'''
open(sys.argv[2], 'w').write(html)
