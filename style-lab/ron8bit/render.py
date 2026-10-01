import sys, importlib
sys.path.insert(0,'.')
import sprite
def svg(rows, scale=12, bg=None):
    h=len(rows); w=len(rows[0])
    out=[f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w*scale}" height="{h*scale}" shape-rendering="crispEdges">']
    if bg: out.append(f'<rect width="{w}" height="{h}" fill="{bg}"/>')
    for y,row in enumerate(rows):
        assert len(row)==w,(y,len(row))
        x=0
        while x<w:
            c=row[x]
            if c=='.': x+=1; continue
            x2=x
            while x2<w and row[x2]==c: x2+=1
            out.append(f'<rect x="{x}" y="{y}" width="{x2-x}" height="1" fill="{sprite.PAL[c]}"/>')
            x=x2
    out.append('</svg>'); return '\n'.join(out)
if __name__=='__main__':
    name=sys.argv[1]
    open(f'/tmp/claude-0/-home-claude--portfolio/d0cc78a5-b510-53f8-b41c-bb49d816c162/scratchpad/{name}.svg','w').write(svg(getattr(sprite,name),12,'#fbf7f0'))
