# Draws the chipnuke logo set into public/brand/. Run: python3 scripts/brand.py
# PNGs: rsvg-convert (see the PR for the sizes).
import math, os
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "brand"); os.makedirs(OUT, exist_ok=True)
ORANGE="#F5A142"; BODY="#141615"; PIN="#2b2f2d"; TILE="#2e3130"; INK="#e9e6dc"; BG="#0b120d"

def trefoil(cx, cy, R):
    r0=R*0.2; r1=R*0.3
    d=f"M{cx+r0:.2f},{cy:.2f}A{r0:.2f},{r0:.2f} 0 1 0 {cx-r0:.2f},{cy:.2f}A{r0:.2f},{r0:.2f} 0 1 0 {cx+r0:.2f},{cy:.2f}Z"
    for c in (90, 210, 330):  # svg degrees, 90 = down
        a0, a1 = math.radians(c-30), math.radians(c+30)
        p = lambda r,a: (cx+r*math.cos(a), cy+r*math.sin(a))
        x0,y0=p(R,a0); x1,y1=p(R,a1); x2,y2=p(r1,a1); x3,y3=p(r1,a0)
        d+=f"M{x0:.2f},{y0:.2f}A{R:.2f},{R:.2f} 0 0 1 {x1:.2f},{y1:.2f}L{x2:.2f},{y2:.2f}A{r1:.2f},{r1:.2f} 0 0 0 {x3:.2f},{y3:.2f}Z"
    return f'<path fill="{ORANGE}" d="{d}"/>'

def mark(x=0, y=0, s=1.0):
    g=[]
    # pins: 4 per side, chip body 56..200
    for i in range(4):
        o=74+i*36
        g.append(f'<rect x="{o-6}" y="28" width="12" height="40" rx="3"/>')
        g.append(f'<rect x="{o-6}" y="188" width="12" height="40" rx="3"/>')
        g.append(f'<rect x="28" y="{o-6}" width="40" height="12" rx="3"/>')
        g.append(f'<rect x="188" y="{o-6}" width="40" height="12" rx="3"/>')
    pins=f'<g fill="{PIN}">{"".join(g)}</g>'
    body=f'<rect x="56" y="56" width="144" height="144" rx="14" fill="{BODY}" stroke="{PIN}" stroke-width="4"/>'
    tile=f'<rect x="80" y="80" width="96" height="96" rx="12" fill="{TILE}"/>'
    return f'<g transform="translate({x} {y}) scale({s})">{pins}{body}{tile}{trefoil(128,128,40)}</g>'

FONT={  # 9-row grid: 0-1 ascender, 2-6 x-height, 7-8 descender
 'c':(2,[".###","#...","#...","#...",".###"]),
 'h':(0,["#...","#...","###.","#..#","#..#","#..#","#..#"]),
 'i':(0,["#",".","#","#","#","#","#"]),
 'p':(2,["###.","#..#","#..#","#..#","###.","#...","#..."]),
 'n':(2,["###.","#..#","#..#","#..#","#..#"]),
 'u':(2,["#..#","#..#","#..#","#..#",".###"]),
 'k':(0,["#...","#...","#..#","#.#.","##..","#.#.","#..#"]),
 'e':(2,[".##.","#..#","####","#...",".###"]),
}
def pixtext(text, x, y, px, colors):
    out=[]; cx=0
    for i,ch in enumerate(text):
        top,rows=FONT[ch]; col=colors[i]
        for r,row in enumerate(rows):
            for c,v in enumerate(row):
                if v=="#": out.append(f'<rect x="{x+(cx+c)*px}" y="{y+(top+r)*px}" width="{px}" height="{px}" fill="{col}"/>')
        cx+=len(rows[0])+1
    return "".join(out), (cx-1)*px
cols=[INK]*4+[ORANGE]*4
svg=lambda w,h,body,extra="": f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" shape-rendering="{extra or "geometricPrecision"}">{body}</svg>\n'

open(f"{OUT}/mark.svg","w").write(svg(256,256,mark()))
open(f"{OUT}/avatar.svg","w").write(svg(256,256,f'<circle cx="128" cy="128" r="128" fill="{BG}"/>'+mark(16,16,0.875)))
t,w=pixtext("chipnuke",0,0,8,cols)
W=256+24+w+24
open(f"{OUT}/lockup.svg","w").write(svg(W,256,mark()+f'<g transform="translate(280 92)" shape-rendering="crispEdges">{t}</g>'))
open(f"{OUT}/lockup-dark.svg","w").write(svg(W,256,f'<rect width="{W}" height="256" rx="20" fill="{BG}"/>'+mark()+f'<g transform="translate(280 92)" shape-rendering="crispEdges">{t}</g>'))
# 88x31 button
t1,w1=pixtext("chipnuke",0,0,1,cols)
btn=(f'<rect width="88" height="31" fill="#c0c0c0"/><rect x="1" y="1" width="86" height="29" fill="{BG}"/>'
     f'<rect x="1" y="1" width="86" height="1" fill="#fff"/><rect x="1" y="1" width="1" height="29" fill="#fff"/>'
     + mark(0,0,31/256) + f'<g transform="translate(34 6)" shape-rendering="crispEdges">{pixtext("chipnuke",0,0,1,cols)[0]}</g>'
     + f'<g transform="translate(34 18)" shape-rendering="crispEdges">{pixtext("chipnuke",0,0,1,[ORANGE]*8)[0] if False else ""}</g>'
     + f'<text x="34" y="26" font-family="monospace" font-size="7" fill="{ORANGE}">&gt; online_</text>')
open(f"{OUT}/button-88x31.svg","w").write(svg(88,31,btn))

