# Ron, FF6-style field sprite (16x24). Palette only (STYLE.md rule 1).
# Shades are opacity mixes of palette colors, flattened so the sprite stays pixel-crisp.
PAL = {
 'O': '#2b262c',  # outline, eyes: --charcoal-deep
 'H': '#484149',  # hair, beard: Charcoal Brew
 'B': '#5b5f8d',  # hair sheen: Kyoto Dusk
 'S': '#f1dcba',  # skin: Vanilla Foam
 's': '#e9b495',  # skin shade: Roasted Terracotta 35% over Vanilla Foam
 'n': '#a65646',  # mouth, nose line: --terracotta-ink
 'W': '#ffffff',  # tee
 'P': '#5b5f8d',  # flannel: Kyoto Dusk
 'L': '#8c8faf',  # flannel light: Kyoto Dusk 70% over white
 'p': '#484866',  # flannel shade: Kyoto Dusk 60% over --charcoal-deep
 'r': '#da6b51',  # flannel check: Roasted Terracotta
 'J': '#484149',  # trousers: Charcoal Brew
 'G': '#9bb29e',  # sneakers: Matcha Cream
 'g': '#557a5c',  # sneaker shade: --matcha-ink
}
FRONT = [
"......OO.OOO....",
"....OOHHOHBHOO..",
"...OHHBBHHHBHHO.",
"..OHHBHHHBBHHHO.",
"..OHBHHHHHHHHHO.",
"..OHHHHHSSSSHO..",
".OsHSOSSSSOSHsO.",
".OsHSOSSSSOSHsO.",
"..OHSSSssSSsHO..",
"..OHSHHHHHHSHO..",
"..OHHHHnnHHHHO..",
"...OHHHHHHHHO...",
"....OOHHHHOO....",
"...OPPOWWOPPO...",
"..OLPpPPPPpPpO..",
"..OprprpprprpO..",
"..OLPpPPPPpPpO..",
"..OSOpPPPPpOSO..",
"...OOJJJJJJOO...",
"....OJJJJJJO....",
"....OJJOOJJO....",
"....OJJOOJJO....",
"...OGGOOOOGGO...",
"...OOOO..OOOO...",
]

BODY_BACK = [
"...OPPPPPPPPO...",
"..OLPpPPPPpPpO..",
"..OprprpprprpO..",
"..OLPpPPPPpPpO..",
"..OSOpPPPPpOSO..",
]
BACK = [
"......OO.OOO....",
"....OOHHOHBHOO..",
"...OHHBBHHHBHHO.",
"..OHHBHHHBBHHHO.",
"..OHBHHHHHHHBHO.",
"..OHHHBHHHBHHO..",
".OsHHHHHHHHHHsO.",
".OsHHBHHHHBHHsO.",
"..OHHHHHHHHHHO..",
"..OHHHHHHHHHHO..",
"...OHHHHHHHHO...",
"...OOSSSSSSOO...",
"....OOSSSSOO....",
] + BODY_BACK + FRONT[18:]

SIDE = [
".......OO.OO....",
".....OOHHOBHOO..",
"....OHHBBHHHBHO.",
"...OHBHHHBBHHHO.",
"...OHHHHHHHBHHO.",
"...OSSSHHHHHHHO.",
"..OSOSSSHHsHHO..",
"..OSOSSSSHsHHO..",
".OSSSSSSSHHHHO..",
"..OsHHHHHHHHO...",
"..OHnHHHHHHHO...",
"...OHHHHHHHO....",
"....OOOHHHOO....",
".....OWPPPO.....",
"....OPLPPPpO....",
"....OrprprpO....",
"....OPLPPPpO....",
"....OPSOPPpO....",
".....OJJJJO.....",
".....OJJJJO.....",
".....OJJJJO.....",
".....OJJJJO.....",
"....OGGGGGO.....",
"....OOOOOOO.....",
]
SIDE_STEP = SIDE[:18] + [
".....OJJJJO.....",
"....OJJJJJO.....",
"...OJJOOJJO.....",
"..OJJO..OJJO....",
".OGGGO..OGGO....",
".OOOOO..OOOO....",
]
WALK_L = FRONT[:20] + [
"....OJJOOJJO....",
"...OGGOOOGGO....",
"...OOOO..OOO....",
"................",
]
WALK_R = FRONT[:20] + [
"....OJJOOJJO....",
"....OGGOOOGGO...",
"....OOO..OOOO...",
"................",
]
def _face(eyes):
    f = list(FRONT); f[6], f[7] = eyes; return f
BLINK = _face([".OsHSSSSSSSSHsO.", ".OsHOOSSSSOOHsO."])
HAPPY = _face([".OsHSOSSSSOSHsO.", ".OsHOSOSSOSOHsO."])
def _talk():
    rows = [list(r + '....') for r in FRONT]          # 20 px wide: room for the raised hand
    def put(y, x, c):
        rows[y][x] = c
    for x in (15, 16): put(8, x, 'O')                    # hand, open palm beside the face
    for y in (9, 10):
        put(y, 14, 'O'); put(y, 15, 'S'); put(y, 16, 'S'); put(y, 17, 'O')
    put(11, 14, 'O'); put(11, 15, 'O'); put(11, 16, 'O')
    for y in (12, 13, 14): put(y, 14, 'O'); put(y, 15, 'p'); put(y, 16, 'O')   # sleeve
    put(15, 13, 'p'); put(15, 14, 'p'); put(15, 15, 'O'); put(16,13,'O'); put(16,14,'O')
    put(17, 12, 'p'); put(17, 13, 'O')                   # no hand at the hip on that side
    return [''.join(r) for r in rows]
TALK = _talk()
