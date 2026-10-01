# Ron, FF6-style field sprite (16x24). Palette only (STYLE.md rule 1).
# Shades are opacity mixes of palette colors, flattened so the sprite stays pixel-crisp.
PAL = {
 'O': '#2b262c',  # outline, eyes: --charcoal-deep
 'H': '#484149',  # hair, mustache: Charcoal Brew
 'b': '#837771',  # trimmed beard: Charcoal Brew 65% over Vanilla Foam
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
"..OOO.OOOO.OOO..",
".OBBHOBBHHOBBHO.",
"OBHHHOHHHHOHHHHO",
"OHHOBBHOOBBHOOHO",
"OHOBHHHOBHHHOBHO",
"OHOHHHHSSSSHOHHO",
".OsHSOSSSSOSHsO.",
".OsHSOSSSSOSHsO.",
"..OHSSSssSSsHO..",
"..OHSbHHHHbSHO..",
"..OHSSSnnSSSHO..",
"...OHbbbbbbHO...",
"....OOOOOOOO....",
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
"..OOO.OOOO.OOO..",
".OBBHOBBHHOBBHO.",
"OBHHHOHHHHOHHHHO",
"OHHOBBHOOBBHOOHO",
"OHOBHHHOBHHHOBHO",
"OHOHHHHOHHHHOHHO",
".OsHHHHHHHHHHsO.",
".OsHHBHHHHBHHsO.",
"..OHHHHHHHHHHO..",
"..OHHHHHHHHHHO..",
"...OHHHHHHHHO...",
"...OOSSSSSSOO...",
"....OOSSSSOO....",
] + BODY_BACK + FRONT[18:]

SIDE = [
".....OOO.OOOO...",
"....OBBHOBBHHO..",
"...OBHHHOHHHHOO.",
"..OHHOBBHOOBBHHO",
"..OHOBHHHOBHHHHO",
"...OSSSHOHHHOHO.",
"..OSOSSSHHsHHO..",
"..OSOSSSSHsHHO..",
".OSSSSSSSHHHHO..",
"..OsHHSSSSHHO...",
"..OHnSSSSHHO....",
"...OHbbbbHO.....",
"....OOOOOHOO....",
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

# Draft 3 (Ron): legs two pixels shorter, that room goes to taller, styled, wavy hair.
_HAIR3 = [                # swept up and to the right, curl tips breaking the outline
"........OO.OO...",
".....OOOBBOHHO..",
"...OOBBHHHHOHHO.",
"..OBHHHOOBBHHHHO",
".OBHHOOBBHHHOOHO",
"OBHHOBBHHHOOBHHO",
"OHOOBHHHOOBBHOHO",
]
FRONT = _HAIR3 + ["OHOHHHHSSSSHHOHO"] + FRONT[6:19] + FRONT[21:]
BACK = _HAIR3 + ["OHOHHHOOBBHHHOHO"] + BACK[6:13] + BODY_BACK + FRONT[20:]
SIDE = [
".........OO.OO..",
".......OOBBOHHO.",
".....OOBHHHHOHHO",
"....OBHHOOBBHHHO",
"...OBHOOBBHHHOHO",
"..OBHOBBHHHOOBHO",
"..OHOBHHHOOBHHHO",
"...OSSSHOOBHHHO.",
] + SIDE[6:19] + SIDE[21:]
SIDE_STEP = SIDE[:20] + [
"....OJJJJJO.....",
"...OJJO.OJJO....",
".OGGGO..OGGO....",
".OOOOO..OOOO....",
]
WALK_L = FRONT[:21] + ["...OGGOOOGGO....", "...OOOO..OOO....", "................"]
WALK_R = FRONT[:21] + ["....OGGOOOGGO...", "....OOO..OOOO...", "................"]
def _face(eyes):
    f = list(FRONT); f[8], f[9] = eyes; return f
BLINK = _face([".OsHSSSSSSSSHsO.", ".OsHOOSSSSOOHsO."])
HAPPY = _face([".OsHSOSSSSOSHsO.", ".OsHOSOSSOSOHsO."])
def _talk():
    rows = [list(r + '....') for r in FRONT]
    def put(y, x, c): rows[y + 2][x] = c                 # same hand as draft 2, two rows lower
    for x in (15, 16): put(8, x, 'O')
    for y in (9, 10):
        put(y, 14, 'O'); put(y, 15, 'S'); put(y, 16, 'S'); put(y, 17, 'O')
    put(11, 14, 'O'); put(11, 15, 'O'); put(11, 16, 'O')
    for y in (12, 13, 14): put(y, 14, 'O'); put(y, 15, 'p'); put(y, 16, 'O')
    put(15, 13, 'p'); put(15, 14, 'p'); put(15, 15, 'O'); put(16, 13, 'O'); put(16, 14, 'O')
    put(17, 12, 'p'); put(17, 13, 'O')
    return [''.join(r) for r in rows]
TALK = _talk()

# Draft 4 (Ron): fringe falls further over the forehead and the top of the left eye;
# trousers rise one pixel into the torso (the hands row), so the flannel is shorter.
def _set(rows, y, row):
    rows[y] = row
_set(FRONT, 7, "OHOHHHHHSSSHHOHO")
_set(FRONT, 8, ".OsHHHSSSSOSHsO.")
_set(FRONT, 19, "..OSOJJJJJJOSO..")
_set(BACK, 19, "..OSOJJJJJJOSO..")
_set(SIDE, 19, "....OJSOJJJO....")
SIDE_STEP[19] = SIDE[19]
for _w in (WALK_L, WALK_R):
    for _y in (7, 8, 19): _w[_y] = FRONT[_y]
BLINK = _face([".OsHHHSSSSSSHsO.", ".OsHOOSSSSOOHsO."])
HAPPY = _face([".OsHHHSSSSOSHsO.", ".OsHOSOSSOSOHsO."])
TALK = _talk()
TALK[19] = TALK[19][:12] + "O." + TALK[19][14:]  # raised arm: no hand at the hip

# Draft 5 (Ron): right side of the hair tapers in 1 px from the crest down to the ear.
for _rows in (FRONT, BACK, WALK_L, WALK_R, BLINK, HAPPY):
    _rows[5] = "OBHHOBBHHHOOBHO."
    _rows[6] = "OHOOBHHHOOBBHHO."
FRONT[7] = WALK_L[7] = WALK_R[7] = BLINK[7] = HAPPY[7] = "OHOHHHHHSSSHHHO."
BACK[7] = "OHOHHHOOBBHHHHO."
for _y in (5, 6, 7): TALK[_y] = FRONT[_y] + "...."

# Draft 6 (Ron): dark tuft on the top right trimmed into a pointed tip with Kyoto Dusk highlights.
_TOP6 = [
"........OO...O..",
".....OOOBBO.OBO.",
"...OOBBHHHHOBHO.",
"..OBHHHOOBBHHBO.",
".OBHHOOBBHHHOBO.",
]
for _rows in (FRONT, BACK, WALK_L, WALK_R, BLINK, HAPPY):
    _rows[:5] = _TOP6
TALK[:5] = [r + "...." for r in _TOP6]

# Draft 7 (Ron): right side curves out 1 px instead of a straight edge; its point sits
# lower than the center crest.
_TOP7 = [
"........OO......",
".....OOOBBOOO...",
"...OOBBHHHHHBBOO",
"..OBHHHOOBBHHHBO",
".OBHHOOBBHHHOBHO",
]
for _rows in (FRONT, BACK, WALK_L, WALK_R, BLINK, HAPPY):
    _rows[:5] = _TOP7
TALK[:5] = [r + "...." for r in _TOP7]

# Draft 8 (Ron): front locked. Side view gets lower, rounder hair pulled back into a small
# ponytail with a Terracotta hair tie (side view only).
_SIDE8 = [
"................",
".......OOO......",
".....OOBBHOO....",
"....OBHHOOBHO...",
"...OBHOBBHHHHO..",
"..OBHOBHHHOHHHO.",
"..OHOBHHHOHHHOO.",
"...OSSSHOBHHHrBO",
"..OSOSSSHHsHHOHO",
"..OSOSSSSHsHHOO.",
]
SIDE[:10] = _SIDE8
SIDE_STEP[:10] = _SIDE8
# ponytail one pixel longer so it reads at small sizes
for _rows in (SIDE, SIDE_STEP):
    _rows[9] = "..OSOSSSSHsHHOHO"
    _rows[10] = ".OSSSSSSSHHHHOO."

# Draft 9 (Ron): side walk cycle = stand, step A, stand, step B. Step A: near arm and leg
# forward, far arm and leg back; step B the opposite. Far limbs use a darker trouser shade.
PAL['j'] = '#3f3940'  # far trouser leg: Charcoal Brew 70% over --charcoal-deep
SIDE_A = SIDE[:17] + [
"...OPrprprpO....",
"..OPOPLPPPpOO...",
"..OSOJJJJJJOSO..",
"....OJJJJJO.....",
"...OJJOOjjO.....",
"..OGGGO.OGGO....",
"..OOOOO.OOOO....",
]
SIDE_B = SIDE[:17] + [
"....OrprprpOPO..",
"..OpOPLPPPpOPO..",
"..OSOJJJJJJOSO..",
"....OJJJJJO.....",
"...OjjOOJJO.....",
"..OGGGO.OGGO....",
"..OOOOO.OOOO....",
]

# Draft 10 (Ron): walking bounce. Step frames lift the body 1 px (feet stay on the ground,
# the trousers gain a row); stand frames sit back down.
def _lift(rows):
    assert rows[0].strip('.') == ''
    return rows[1:21] + [rows[20]] + rows[21:]
SIDE_A = _lift(SIDE_A)
SIDE_B = _lift(SIDE_B)

# Draft 11 (Ron): real stride instead of jumping jacks. Side walk = contact A, passing A,
# contact B, passing B: on passing frames the legs cross under the body and the body rises
# 1 px (the bounce). Hands are bigger (2 px) everywhere.
_T0, _T1 = ".....OWPPPO.....", "....OPLPPPpO...."
_T2 = "....OrprprpO...."
_HANG = ["....OSSPPPpO....", "....OSSOJJJO...."]          # near hand at the side, 2x2
_HIPS_C = "..OOOJJJJJOOOO.."
SIDE = SIDE[:18] + _HANG + SIDE[20:]                          # standing pose, bigger hand
SIDE_A = SIDE[:15] + [_T0, _T1,                               # contact A: near arm + leg forward
    "...OPrprprpOO...",
    "..OSSOLPPPpOpO..",
    "..OSSOJJJJJOSSO.",
    _HIPS_C,
    "...OJJOOjjO.....",
    "..OGGGOOOGGO....",
    "..OOOOO.OOOO....",
]
SIDE_B = SIDE[:15] + [_T0, _T1,                               # contact B: far arm + leg forward
    "....OrprprpOPO..",
    "..OpOPLPPPpOSSO.",
    "..OSSOJJJJJOSSO.",
    _HIPS_C,
    "...OjjOOJJO.....",
    "..OGGGOOOGGO....",
    "..OOOOO.OOOO....",
]
_PASS_TOP = SIDE[1:15] + [_T0, _T1, _T2] + _HANG + ["....OOOJJJJO....", ".....OJJJO......"]
PASS_A = _PASS_TOP + [".....OJJjO......", ".....OJJOGGO....", "....OGGGOOO....."]   # far leg swings through
PASS_B = _PASS_TOP + ["....OJJjjO......", "...OGGOjjO......", ".....OGGGO......"]   # near leg swings through

# bigger hands on the front-facing family: each hand is 2 px tall
for _rows in (FRONT, BLINK, HAPPY, BACK, WALK_L, WALK_R):
    _rows[20] = "..OSOJJJJJJOSO.."
for _rows in (FRONT, BLINK, HAPPY, BACK):
    _rows[21] = "...OOJJOOJJOO..."
TALK[20] = "..OSOJJJJJJOO......."
