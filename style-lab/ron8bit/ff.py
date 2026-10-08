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

# Draft 12 (Ron): side views keep only the front Terracotta check (toward the walking
# direction); the other two checks become flannel shade so he no longer reads as facing forward.
def _one_check(row):
    i = row.index('r')
    return row[:i + 1] + row[i + 1:].replace('r', 'p')
for _rows in (SIDE, SIDE_A, SIDE_B, PASS_A, PASS_B):
    for _y, _r in enumerate(_rows):
        if 'r' in _r and _r.count('r') > 1:
            _rows[_y] = _one_check(_r)

# Draft 13 (Ron): pass frames open into a small V with both shoes grounded: front leg reaches
# 1 px further left, back leg trails 1 px further right, narrower than the step frames.
PASS_A[20:] = [
".....OJJjO......",
"....OJJOjjO.....",
"...OGGGOOGGO....",
"...OOOOOOOOO....",
]
PASS_B[20:] = [
".....OjJJO......",
"....OjjOJJO.....",
"...OGGGOOGGO....",
"...OOOOOOOOO....",
]

# Draft 14 (Ron): Step A unchanged. Pass A: legs together, near hand swung back, far hand
# starting to show in front. Step B: far hand further forward and 1 px higher, near hand back,
# far leg forward and near leg back with its heel lifted (toe-off) so the legs read as swapped.
_T2c = "....OrpppppO...."
PASS_A = SIDE[1:15] + [_T0, _T1, _T2c,
    "..OsOPLPPPpOSSO.",
    "...OOJJJJJJOSSO.",
    "....OJJJJJJOOO..",
    ".....OJJJO......",
    ".....OJJjO......",
    "....OGGGGO......",
    "....OOOOOO......",
]
PASS_B = SIDE[1:15] + [_T0, _T1, _T2c] + _HANG + [
    "....OOOJJJJO....",
    ".....OJJJO......",
    ".....OjjJO......",
    "....OGGGGO......",
    "....OOOOOO......",
]
SIDE_B = SIDE[:15] + [_T0,
    "...OpPLPPPpO....",
    ".OssOrpppppOPO..",
    ".OssOPLPPPpOSSO.",
    ".OOOOJJJJJJOSSO.",
    "..OOOJJJJJOOOO..",
    "...OjjOOJJO.....",
    "..OGGGO.OJJO....",
    "..OOOOO.OGGO....",
]

# Draft 15 (Ron): Pass A front hand 2x2 and a sliver of the back foot; Pass B hand further
# forward, back foot now in front, other foot shifted 1 px right.
PASS_A[17:24] = [
    ".OssOPLPPPpOSSO.",
    ".OssOJJJJJJOSSO.",
    ".OOOOJJJJJJOOO..",
    ".....OJJJO......",
    ".....OJJjO......",
    "....OGGGOGO.....",
    "....OOOOOOO.....",
]
PASS_B[17:24] = [
    "...OSSPPPPpO....",
    "...OSSOJJJJO....",
    "...OOOOJJJJO....",
    ".....OJJJO......",
    "....OjjOJJO.....",
    "...OGGOOGGO.....",
    "...OOOOOOOO.....",
]

# Draft 16 (Ron): hands only. Pass A: front (far) hand half visible, back (near) hand closer
# to the body. Step B: far hand 1 px higher. Pass B: a sliver of the far hand behind the body.
PASS_A[17:20] = [
    "..OsOPLPPPpSSO..",
    "..OsOJJJJJJSSO..",
    "..OOOJJJJJJOOO..",
]
SIDE_B[15:20] = [
    ".OOOOOWPPPO.....",
    ".OssOPLPPPpO....",
    ".OssOrpppppOPO..",
    "..OOOPLPPPpOSSO.",
    "....OJJJJJJOSSO.",
]
PASS_B[17:20] = [
    "...OSSPPPPpOsO..",
    "...OSSOJJJJOsO..",
    "...OOOOJJJJOOO..",
]

# Draft 17 (Ron): Pass A near hand centered on the body, leaning back (right); Pass B near hand
# centered, leaning forward (left), far hand reduced to one unoutlined pixel behind the body.
PASS_A[17:20] = [
    "..OsOPLPPSSO....",
    "..OsOJJJJSSO....",
    "..OOOJJJJOOO....",
]
PASS_B[17:20] = [
    "....OPSSPPpO....",
    "....OJSSJJJOs...",
    "....OJOOJJJO....",
]

# Draft 18 (Ron): Pass A front hand loses its dark outline, like the Pass B back hand.
PASS_A[17:20] = [
    "...sOPLPPSSO....",
    "...sOJJJJSSO....",
    "....OJJJJOOO....",
]

# Draft 19 (Ron): front walk. Step 1: his right leg forward (screen left) with the bigger foot,
# left leg back with a smaller far-shade foot; his left hand forward and bigger, right hand small.
# Step 2 mirrors the legs and hands. Both steps are 25 rows: legs 1 px longer, so the body
# rides 1 px higher than STAND_PAD (the stand frame with a blank top row).
_STEP1_LEGS = [
    "..OsOJJJJJJOSSO.",
    "...OOJJJJJJOSSO.",
    "....OJJJOjjOOOO.",
    "....OJJJOGGO....",
    "...OGGGGOOO.....",
    "...OOOOOO.......",
]
WALK_L = FRONT[:19] + _STEP1_LEGS
WALK_R = FRONT[:19] + [r[::-1] for r in _STEP1_LEGS]
STAND_PAD = ["." * 16] + FRONT

# Draft 20 (Ron, 2026-10-08): "yay" expression. Happy face, both hands raised: the talk
# pose's raised arm mirrored onto the other side (and its hanging hand removed). 22 wide.
def _yay():
    talk = [list(r) for r in TALK]
    talk[9][:16] = list(HAPPY[9])                        # happy eyes
    happy = [r + '....' for r in HAPPY]
    rows = [['.', '.'] + r for r in talk]                # 2 px left so the mirrored arm fits
    for y in range(10, 24):
        for x in range(20):
            if talk[y][x] != happy[y][x]:
                rows[y][15 - x + 2] = talk[y][x]
    return [''.join(r) for r in rows]
YAY = _yay()

# Draft 20 option B: same, with the arms straight up so the hands sit beside the top of the
# hair (a bigger "yay"). Built from YAY: arms cleared, right arm redrawn, then mirrored.
def _yay_up():
    rows = [list('..' + r) for r in YAY]                 # 2 more px left for the mirrored hand
    for y in range(10, 17):                              # clear option A's arms (body outline stays)
        for x in list(range(0, 6)) + list(range(18, 24)):
            if not (y == 16 and x in (5, 17)):
                rows[y][x] = '.'
    arm = {6: {20: 'O', 21: 'O'}, 7: {19: 'O', 20: 'S', 21: 'S', 22: 'O'}, 8: {19: 'O', 20: 'S', 21: 'S', 22: 'O'},
           9: {19: 'O', 20: 'p', 21: 'O', 22: 'O'}, 10: {19: 'O', 20: 'p', 21: 'O'}, 11: {19: 'O', 20: 'p', 21: 'O'},
           12: {18: 'O', 19: 'p', 20: 'O'}, 13: {18: 'O', 19: 'p', 20: 'O'}, 14: {18: 'O', 19: 'p', 20: 'O'},
           15: {18: 'O', 19: 'p', 20: 'O'}, 16: {18: 'O', 19: 'p', 20: 'O'}}
    for y, px in arm.items():
        for x, c in px.items():
            rows[y][x] = c
            rows[y][23 - x] = c                          # body axis sits between columns 11 and 12
    return [''.join(r) for r in rows]
YAY_UP = _yay_up()

# Draft 21 (Ron, 2026-10-08): Yay B arms at 45 degrees. Option B read as stretchy arms, so the
# arms are normal length and angle up and out from the shoulders, hands beside the cheeks.
def _yay_45():
    rows = [list('..' + r) for r in YAY]
    for y in range(10, 17):                              # clear option A's arms (body outline stays)
        for x in list(range(0, 6)) + list(range(18, 24)):
            if not (y == 16 and x in (5, 17)):
                rows[y][x] = '.'
    arm = {11: {21: 'O', 22: 'O'},
           12: {20: 'O', 21: 'S', 22: 'S', 23: 'O'},
           13: {20: 'O', 21: 'S', 22: 'S', 23: 'O'},
           14: {19: 'O', 20: 'p', 21: 'p', 22: 'O'},
           15: {18: 'O', 19: 'p', 20: 'p', 21: 'O'},
           16: {17: 'O', 18: 'p', 19: 'p', 20: 'O'}}
    for y, px in arm.items():
        for x, c in px.items():
            rows[y][x] = c
            rows[y][23 - x] = c
    return [''.join(r) for r in rows]
YAY_45 = _yay_45()

# Draft 22 (Ron, 2026-10-08): the arms join the body at the shoulders, not the armpits.
# YAY_45's arms move up 1 row, and the old sleeve-to-body pixels become the torso's side.
def _yay_shoulder():
    rows = [list(r) for r in YAY_45]
    def put(y, x, c):
        rows[y][x] = c
        rows[y][23 - x] = c
    for y in range(10, 18):                              # clear both arms
        for x in range(18, 24):
            put(y, x, '.')
    put(16, 17, 'O')
    put(17, 17, 'O')                                     # torso side where the old sleeve joined
    put(18, 18, '.')                                     # keep the side straight below it
    arm = {10: {21: 'O', 22: 'O'},
           11: {20: 'O', 21: 'S', 22: 'S', 23: 'O'},
           12: {20: 'O', 21: 'S', 22: 'S', 23: 'O'},
           13: {19: 'O', 20: 'p', 21: 'p', 22: 'O'},
           14: {18: 'O', 19: 'p', 20: 'p', 21: 'O'},
           15: {17: 'O', 18: 'p', 19: 'p', 20: 'O'},
           16: {18: 'O', 19: 'O'}}
    for y, px in arm.items():
        for x, c in px.items():
            put(y, x, c)
    return [''.join(r) for r in rows]
YAY_SHOULDER = _yay_shoulder()

# Draft 23 (Ron, 2026-10-08): shoulders 1 px closer to the body. The whole arm moves in 1 px;
# the now-empty outer columns are trimmed, so the sprite is 22 wide.
def _yay_in():
    rows = [list(r) for r in YAY_SHOULDER]
    def put(y, x, c):
        rows[y][x] = c
        rows[y][23 - x] = c
    for y in range(10, 17):
        for x in range(18, 24):
            put(y, x, '.')
    arm = {10: {20: 'O', 21: 'O'},
           11: {19: 'O', 20: 'S', 21: 'S', 22: 'O'},
           12: {19: 'O', 20: 'S', 21: 'S', 22: 'O'},
           13: {18: 'O', 19: 'p', 20: 'p', 21: 'O'},
           14: {17: 'O', 18: 'p', 19: 'p', 20: 'O'},
           15: {16: 'O', 17: 'p', 18: 'p', 19: 'O'},
           16: {17: 'O', 18: 'O'}}
    for y, px in arm.items():
        for x, c in px.items():
            put(y, x, c)
    return [''.join(r[1:-1]) for r in rows]
YAY_IN = _yay_in()

# Draft 24 (Ron, 2026-10-08): surprised and worried looks, three ideas each. Face edits are
# (row, col) pixel swaps on the front face; bodies reuse approved poses.
def _swap(base, pts, dx=0):
    rows = [list(r) for r in base]
    for (y, x), c in pts.items():
        rows[y][x + dx] = c
    return [''.join(r) for r in rows]
def _pad(rows, top=0, right=0):
    w = len(rows[0]) + right
    return ['.' * w] * top + [r + '.' * right for r in rows]
def _stamp(rows, art, y0, x0):
    rows = [list(r) for r in rows]
    for y, line in enumerate(art):
        for x, c in enumerate(line):
            if c != '.':
                rows[y0 + y][x0 + x] = c
    return [''.join(r) for r in rows]
_BANG = ["OOO", "OrO", "OrO", "OrO", "OOO", "OrO", "OOO"]          # "!" emote, Terracotta
_DROP = ["..O.", ".OLO", "OLLO", "OLWO", ".OO."]                     # sweat drop, Kyoto Dusk light
_GASP = {(12, 7): 'O', (12, 8): 'O', (13, 7): 'n', (13, 8): 'n'}     # open mouth
_WIDE = {(8, 10): 'W', (9, 10): 'O', (8, 6): 'W', (9, 5): 'O'}       # eye whites above the pupils
_GLANCE = {(8, 10): 'S', (9, 5): 'S', (9, 6): 'O', (9, 10): 'S', (9, 11): 'O'}  # eyes slide sideways
_WAVY = {(12, 6): 'n', (12, 7): 'S', (12, 8): 'n', (12, 9): 'S', (12, 10): 'n'}
_GRIMACE = {(8, 10): 'S', (12, 6): 'n', (12, 7): 'n', (12, 8): 'n', (12, 9): 'n'}
_BROWS = {(8, 10): 'S', (8, 6): 'H', (8, 9): 'H', (13, 6): 'n', (13, 9): 'n'}   # brows up in the middle, frown

SURPRISE_A = _swap(FRONT, _GASP)                                        # gasp: open mouth
SURPRISE_B = _stamp(_pad(_swap(FRONT, {**_GASP, **_WIDE}), top=8, right=2), _BANG, 0, 13)  # wide eyes + "!"
SURPRISE_C = _stamp(_pad(_swap(YAY_IN, {**_GASP, **_WIDE}, dx=3), top=8), _BANG, 0, 17)    # startled, hands up + "!"
WORRY_A = _swap(FRONT, {**_GLANCE, **_WAVY})                            # nervous glance, wavy mouth
WORRY_B = _stamp(_pad(_swap(FRONT, _GRIMACE), right=4), _DROP, 4, 16)   # eek: grimace + sweat drop
WORRY_C = _stamp(_swap(TALK, _BROWS), _DROP, 4, 16)                     # uh-oh: worried brows, hand at cheek

# Draft 25 (Ron, 2026-10-08): W1's sideways glance with a sweat drop, the drop flat like
# S3's "!" (outline + one fill, no highlight) and sitting high above the head where the "!" is.
# A: drop 2 px bigger (6 wide, 7 tall). B: drop at 2x (8 wide, 10 tall).
_DROP_FLAT = ["..OO..", "..OO..", ".OLLO.", "OLLLLO", "OLLLLO", ".OLLO.", "..OO.."]
_DROP_2X = ["...OO...", "...OO...", "..OLLO..", ".OLLLLO.", "OLLLLLLO",
            "OLLLLLLO", "OLLLLLLO", "OLLLLLLO", ".OLLLLO.", "..OOOO.."]
WORRY_D = _stamp(_pad(WORRY_A, top=8, right=4), _DROP_FLAT, 0, 13)
WORRY_E = _stamp(_pad(WORRY_A, top=11, right=6), _DROP_2X, 0, 13)

# Draft 26 (Ron, 2026-10-08): flat dash eyes, like "- -", on the nervous look with the flat drop.
# Eyes become horizontal lines on the eye row; mouth stays wavy. A: 3 px dashes. B: 2 px dashes.
_EYES_3 = {(8, 10): 'S', (9, 4): 'O', (9, 5): 'O', (9, 6): 'O', (9, 9): 'O', (9, 10): 'O', (9, 11): 'O'}
_EYES_2 = {(8, 10): 'S', (9, 5): 'O', (9, 6): 'O', (9, 10): 'O', (9, 11): 'O'}
_FLAT3 = _swap(FRONT, {**_EYES_3, **_WAVY})
_FLAT2 = _swap(FRONT, {**_EYES_2, **_WAVY})
WORRY_F = _stamp(_pad(_FLAT3, top=8, right=4), _DROP_FLAT, 0, 13)    # 3 px dashes, drop +2 px
WORRY_G = _stamp(_pad(_FLAT3, top=11, right=6), _DROP_2X, 0, 13)     # 3 px dashes, 2x drop
WORRY_H = _stamp(_pad(_FLAT2, top=8, right=4), _DROP_FLAT, 0, 13)    # 2 px dashes, drop +2 px
WORRY_I = _stamp(_pad(_FLAT2, top=11, right=6), _DROP_2X, 0, 13)     # 2 px dashes, 2x drop
