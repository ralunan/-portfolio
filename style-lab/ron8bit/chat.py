"""Builds the avatar-chat prototype: talk pose on a sample page; clicking it raises an RPG dialogue panel.
Usage: python3 chat.py <fontsdir with fonts.css from Google Fonts> <out.html>
Fonts (latin subsets) are inlined so previews and the page always render in the real faces."""
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

talk = render.svg(ff.TALK, 6).replace('<svg ', '<svg class="avatar-sprite" aria-hidden="true" ', 1)
tpl = open('chat_template.html').read()
tpl = re.sub(r'<link [^>]*fonts\.g[^>]*>\n', '', tpl)
out = tpl.replace('<style>\n', '<style>\n' + font_css + '\n', 1).replace('{{TALK}}', talk)
open(out_path, 'w').write(out)
print(len(blocks), 'font faces inlined')
