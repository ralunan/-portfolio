import { useCallback, useEffect, useRef } from 'react';

const DURATION = 1100;
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Scrolls the window to `target` with our own easing, so the hero hand-off has
// a consistent, unhurried feel across browsers. `target` may be a function,
// re-read every frame, so the landing spot stays right if layout shifts
// mid-scroll (e.g. web fonts finishing loading). Resolves when finished.
function animateScrollTo(target) {
    const getTop = typeof target === 'function' ? target : () => target;
    return new Promise((resolve) => {
        const start = window.scrollY;
        if (prefersReducedMotion() || Math.abs(getTop() - start) < 2) {
            window.scrollTo(0, getTop());
            resolve();
            return;
        }
        const t0 = performance.now();
        const step = (now) => {
            const t = Math.min(1, (now - t0) / DURATION);
            window.scrollTo(0, start + (getTop() - start) * easeInOutCubic(t));
            if (t < 1) requestAnimationFrame(step);
            else resolve();
        };
        requestAnimationFrame(step);
    });
}

// Treats the home hero and the Selected Work page as two full screens: any
// downward scroll intent while on the hero (wheel, swipe, arrow/page keys)
// glides the hero away and lands exactly on the work page, and scrolling up
// from the very top of the work page glides back to the hero. Below the top
// of the work page, the page scrolls normally.
export default function useHeroHandoff(workRef) {
    const busy = useRef(false);
    const touchY = useRef(null);

    const workTop = useCallback(() => {
        const el = workRef.current;
        return el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : 0;
    }, [workRef]);

    const go = useCallback(async (top) => {
        if (busy.current) return;
        busy.current = true;
        await animateScrollTo(top);
        // Swallow the tail of trackpad momentum before accepting new input.
        setTimeout(() => {
            busy.current = false;
        }, 350);
    }, []);

    const goToWork = useCallback(() => go(workTop), [go, workTop]);

    useEffect(() => {
        // -1: wants to go up, 1: wants to go down, 0: let the browser scroll.
        const decide = (direction) => {
            const y = window.scrollY;
            const top = workTop();
            if (direction > 0 && y < top - 1) return top;
            if (direction < 0 && y > 0 && y <= top + 1) return 0;
            return null;
        };

        const handle = (direction, event) => {
            if (busy.current) {
                if (window.scrollY <= workTop() + 1) event.preventDefault();
                return;
            }
            const target = decide(direction);
            if (target === null) return;
            event.preventDefault();
            go(target);
        };

        const onWheel = (e) => {
            if (Math.abs(e.deltaY) < 4) return;
            handle(Math.sign(e.deltaY), e);
        };
        const onTouchStart = (e) => {
            touchY.current = e.touches[0].clientY;
        };
        const onTouchMove = (e) => {
            if (touchY.current === null) return;
            const dy = touchY.current - e.touches[0].clientY;
            if (Math.abs(dy) < 12) return;
            touchY.current = null;
            handle(Math.sign(dy), e);
        };
        const KEYS = { ArrowDown: 1, PageDown: 1, ' ': 1, ArrowUp: -1, PageUp: -1 };
        const onKey = (e) => {
            if (!(e.key in KEYS) || e.target.closest?.('input, textarea, select, [contenteditable]')) return;
            // Space activates a focused button or link, so leave it alone there.
            if (e.key === ' ' && e.target.closest?.('button, a')) return;
            const direction = e.key === ' ' && e.shiftKey ? -1 : KEYS[e.key];
            handle(direction, e);
        };

        window.addEventListener('wheel', onWheel, { passive: false });
        window.addEventListener('touchstart', onTouchStart, { passive: true });
        window.addEventListener('touchmove', onTouchMove, { passive: false });
        window.addEventListener('keydown', onKey);
        return () => {
            window.removeEventListener('wheel', onWheel);
            window.removeEventListener('touchstart', onTouchStart);
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('keydown', onKey);
        };
    }, [go, workTop]);

    return { goToWork, goTo: go };
}
