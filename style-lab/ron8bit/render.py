import sys
sprite = None  # set to the module holding PAL before calling svg()
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
