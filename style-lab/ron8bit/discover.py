"""Builds the avatar-discovery prototype: after a reading delay Ron walks in from the right edge
(side walk: Step A, Pass A, Step B, Pass B), stops in his talk pose and shows the invite bubble;
clicking him opens the approved RPG chat box (same panel as chat_template.html).
Usage: python3 discover.py <fontsdir with fonts.css from Google Fonts> <out.html>"""
import sys, re, base64, urllib.request
sys.path.insert(0, '.')
import ff, render
render.sprite = ff

fonts_dir, out_path = sys.argv[1], sys.argv[2]
css = open(f'{fonts_dir}/fonts.css').read()
blocks = re.findall(r'/\* latin \*/\s*(@font-face\s*{[^}]*})', css)
def inline(block):
    url = re.search(r'url\((https://[^)]+)\)', block).group(1)
    data = urllib.request.urlopen(url).read()
    return block.replace(url, 'data:font/woff2;base64,' + base64.b64encode(data).decode())
font_css = '\n'.join(inline(b) for b in blocks)

# Frames are drawn at 1 unit per sprite pixel; CSS sizes them with --px so phones and laptops share one set.
FRAMES = [('walk-0', ff.SIDE_A), ('walk-1', ff.PASS_A), ('walk-2', ff.SIDE_B), ('walk-3', ff.PASS_B), ('talk', ff.TALK)]
def frame(name, rows):
    s = render.svg(rows, 1)
    s = re.sub(r' width="\d+" height="\d+"', '', s, count=1)
    return s.replace('<svg ', f'<svg class="frame" data-frame="{name}" style="--cols:{len(rows[0])}" aria-hidden="true" ', 1)
frames = '\n'.join(frame(n, r) for n, r in FRAMES)

tpl = open('discover_template.html').read()
tpl = re.sub(r'<link [^>]*fonts\.g[^>]*>\n', '', tpl)
out = tpl.replace('<style>\n', '<style>\n' + font_css + '\n', 1).replace('{{FRAMES}}', frames)
open(out_path, 'w').write(out)
print(len(blocks), 'font faces inlined')
