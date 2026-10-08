import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AVATAR_FRAMES, AVATAR_PALETTE } from './avatarSprites.js';

// Ron's 8-bit avatar on the home hero. Styles: styles/home/avatar.css.
// Discovery: after a reading delay he walks in from past the right edge with the
// side walk (Step A, Pass A, Step B, Pass B; the pass frames carry the 1px bounce),
// stops and idles (front walk in place), then after a fixed pause switches to the
// talk pose with the invite bubble. Clicking
// him opens the approved RPG chat box (style-lab avatar chat prototype, Ron 2026-10-08).
// Size and timing live in avatar.css (--avatar-px, --avatar-walk-delay, ...).

const STEP_PX = 3; // sprite pixels moved per walk frame, so the feet don't slide
const WALK = ['walk0', 'walk1', 'walk2', 'walk3'];
// Idle when he isn't annotating (Ron, 2026-10-08): the approved front walk in place,
// Step 1, Stand, Step 2, Stand.
const IDLE = ['idle0', 'idle1', 'idle2', 'idle1'];
const FRAMES = [...WALK, 'idle0', 'idle1', 'idle2', 'talk'];
const TYPE_MS = 18; // per letter
const MAX_LINES = 3; // a chat page shows at most 3 lines
const RISE_MS = 420;

// Placeholder copy until the content writer drafts the hero aside.
const INVITE = 'Psst. Want the story behind this one?';
const MESSAGES = [
    "Hi, I'm Ron. This is placeholder text for my hero aside. The content writer will draft what I actually say here.",
    'It will add something the page doesn’t already say, never repeat it.',
];

// One frame as crisp SVG rects, merging runs of the same color per row.
function Sprite({ name, on }) {
    const rows = AVATAR_FRAMES[name];
    const w = rows[0].length;
    const rects = [];
    rows.forEach((row, y) => {
        let x = 0;
        while (x < w) {
            const c = row[x];
            if (c === '.') { x++; continue; }
            let x2 = x;
            while (x2 < w && row[x2] === c) x2++;
            rects.push(<rect key={`${y}-${x}`} x={x} y={y} width={x2 - x} height={1} style={{ fill: AVATAR_PALETTE[c] }} />);
            x = x2;
        }
    });
    return (
        <svg className={`avatar-frame${on ? ' is-on' : ''}`} style={{ '--cols': w, '--rows': rows.length }} viewBox={`0 0 ${w} ${rows.length}`}
            shapeRendering="crispEdges" aria-hidden="true">
            {rects}
        </svg>
    );
}

// Splits the messages into pages of at most MAX_LINES lines at the box's current width.
function paginate(textEl) {
    const probe = textEl.cloneNode(false);
    probe.removeAttribute('id');
    probe.classList.add('rpg-measure');
    probe.style.width = textEl.clientWidth + 'px';
    probe.style.height = 'auto';
    textEl.parentNode.appendChild(probe);
    const lh = parseFloat(getComputedStyle(textEl).lineHeight);
    const max = Math.min(textEl.clientHeight, Math.ceil(lh * MAX_LINES) + 1);
    const out = [];
    for (const msg of MESSAGES) {
        let cur = '';
        for (const w of msg.split(' ')) {
            const trial = cur ? cur + ' ' + w : w;
            probe.textContent = trial;
            if (probe.scrollHeight > max && cur) { out.push(cur); cur = w; } else cur = trial;
        }
        if (cur) out.push(cur);
    }
    probe.remove();
    return out;
}

export default function Avatar() {
    const avatarRef = useRef(null);
    const textRef = useRef(null);
    const nextRef = useRef(null);
    const [stage, setStage] = useState('offstage'); // offstage | walking | ready
    const [frame, setFrame] = useState('walk0');
    const [invite, setInvite] = useState(false);
    const [open, setOpen] = useState(false);
    const [pages, setPages] = useState([]);
    const [page, setPage] = useState(0);
    const [shown, setShown] = useState(0);
    const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Walk-in
    useEffect(() => {
        const el = avatarRef.current;
        let raf = 0;
        let inviteTimer = 0;
        const css = getComputedStyle(el);
        const ms = (name) => {
            const v = css.getPropertyValue(name).trim();
            return v.endsWith('ms') ? parseFloat(v) : parseFloat(v) * 1000;
        };
        const walkDelay = ms('--avatar-walk-delay');
        const frameMs = ms('--avatar-walk-frame');
        const inviteDelay = ms('--avatar-invite-delay');
        const arrive = () => {
            el.style.transform = '';
            setStage('ready');
            inviteTimer = setTimeout(() => setInvite(true), reduce ? 0 : inviteDelay);
        };
        const timer = setTimeout(() => {
            setStage('walking');
            if (reduce) return arrive();
            const px = parseFloat(getComputedStyle(el).getPropertyValue('--avatar-px'));
            const right = parseFloat(getComputedStyle(el).right);
            const start = el.querySelector('.avatar-sprite').getBoundingClientRect().width + right + 8;
            const speed = (STEP_PX * px) / frameMs;
            const t0 = performance.now();
            const step = (now) => {
                const t = now - t0;
                const x = Math.max(0, start - speed * t);
                el.style.transform = `translateX(${x}px)`;
                setFrame(WALK[Math.floor(t / frameMs) % WALK.length]);
                if (x > 0) raf = requestAnimationFrame(step); else arrive();
            };
            el.style.transform = `translateX(${start}px)`;
            raf = requestAnimationFrame(step);
        }, walkDelay);
        return () => { clearTimeout(timer); clearTimeout(inviteTimer); cancelAnimationFrame(raf); };
    }, [reduce]);

    // Talk pose while the bubble or chat is up; otherwise the idle front walk.
    const annotating = invite || open;
    useEffect(() => {
        if (stage !== 'ready') return undefined;
        if (annotating) { setFrame('talk'); return undefined; }
        if (reduce) { setFrame('idle1'); return undefined; }
        const v = getComputedStyle(avatarRef.current).getPropertyValue('--avatar-idle-frame').trim();
        const idleMs = v.endsWith('ms') ? parseFloat(v) : parseFloat(v) * 1000;
        let i = 0;
        setFrame(IDLE[0]);
        const id = setInterval(() => { i = (i + 1) % IDLE.length; setFrame(IDLE[i]); }, idleMs);
        return () => clearInterval(id);
    }, [stage, annotating, reduce]);

    // Typing: one letter every TYPE_MS until the page is shown in full.
    const full = pages[page] ?? '';
    const typing = open && pages.length > 0 && shown < full.length;
    useEffect(() => {
        if (!typing) return undefined;
        const id = setInterval(() => setShown((n) => n + 1), TYPE_MS);
        return () => clearInterval(id);
    }, [typing, page]);

    const openChat = () => {
        setOpen(true);
        setPages([]);
        setPage(0);
        setShown(0);
        setTimeout(() => {
            setPages(paginate(textRef.current));
            if (reduce) setShown(Infinity);
            nextRef.current?.focus({ preventScroll: true });
        }, reduce ? 0 : RISE_MS * 0.6);
    };

    const closeChat = useCallback(() => {
        setOpen(false);
        setInvite(false); // done annotating: back to idle; clicking him still reopens the chat
        avatarRef.current?.focus({ preventScroll: true });
    }, []);

    const advance = useCallback(() => {
        if (!open || !pages.length) return;
        if (shown < full.length) return setShown(full.length); // first press completes the page, like an RPG
        if (page < pages.length - 1) { setPage(page + 1); setShown(reduce ? Infinity : 0); } else closeChat();
    }, [open, pages, shown, full, page, reduce, closeChat]);

    useEffect(() => {
        if (!open) return undefined;
        const onKey = (e) => {
            if (e.key === 'Escape') closeChat();
            else if ((e.key === 'Enter' || e.key === ' ') && document.activeElement !== nextRef.current) { e.preventDefault(); advance(); }
        };
        const onResize = () => { setPages(paginate(textRef.current)); setPage(0); setShown(Infinity); };
        document.addEventListener('keydown', onKey);
        window.addEventListener('resize', onResize);
        return () => { document.removeEventListener('keydown', onKey); window.removeEventListener('resize', onResize); };
    }, [open, advance, closeChat]);

    const last = page === pages.length - 1;
    const ready = stage === 'ready';
    const done = pages.length > 0 && shown >= full.length;

    return (
        <>
            <button
                ref={avatarRef}
                type="button"
                className={`avatar avatar--${stage}${invite ? ' has-invite' : ''}${open ? ' is-talking' : ''}`}
                tabIndex={ready ? 0 : -1}
                aria-haspopup="dialog"
                aria-expanded={open}
                aria-controls="avatar-chat"
                aria-label="Open Ron's aside"
                onClick={() => { if (ready) (open ? closeChat() : openChat()); }}
            >
                <span className="avatar-invite">{INVITE}</span>
                <span className="avatar-sprite">
                    {FRAMES.map((name) => <Sprite key={name} name={name} on={frame === name} />)}
                </span>
            </button>
            {/* The chat box is fixed to the screen, so it renders outside the
                page's route transition (a transformed parent would move it). */}
            {createPortal(
                <section className={`rpg-dialogue${open ? ' is-open' : ''}`} id="avatar-chat" role="dialog"
                    aria-label="Ron's aside" aria-hidden={!open} onClick={advance}>
                    <div className="rpg-window">
                        <span className="rpg-name">Ron</span>
                        <div className="rpg-speech">
                            <p className="rpg-text" id="avatar-chat-text" ref={textRef} aria-live="polite">
                                {open ? full.slice(0, shown) : ''}
                            </p>
                            <div className="rpg-controls">
                                <span className="rpg-count">{pages.length > 1 ? `${page + 1} / ${pages.length}` : ''}</span>
                                <button ref={nextRef} type="button" className={`rpg-next${done ? ' is-ready' : ''}`}
                                    onClick={(e) => { e.stopPropagation(); advance(); }}>
                                    {last ? 'CLOSE' : 'NEXT'}
                                    <span className="rpg-cursor" aria-hidden="true">{last ? '✕' : '▶'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>,
                document.body,
            )}
        </>
    );
}
