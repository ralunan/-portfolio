import { useLayoutEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { projects } from '../../content.js';
import Highlights from './Highlights.jsx';
import { ProjectCardLink } from './ProjectCard.jsx';

// Scroll distance (in viewport heights) that each project holds the stage.
const STAGE_STEP = 80;

// Every project card is always rendered in one of four positions, set by its
// place relative to the active card:
// - active: centered under the heading;
// - next: peeking from the bottom edge of the window (top 5% visible),
//   shifted 75px off center and tilted 5 degrees: right for the second
//   project, left for the third;
// - later: hidden at the same spot until it becomes next;
// - passed: lifted up behind the highlights and faded out.
// Scrolling moves cards between positions, so the next card travels
// diagonally up into the center and straightens with a small bounce, and
// scrolling back up plays it in reverse. Motion runs at half the original
// speed so each change reads clearly. Fades use the site easing (--ease).
const PEEK_SHIFT = 75;
const PEEK_TILT = 5;
const PEEK_VISIBLE = 0.05;
const sideOf = (index) => (index % 2 === 1 ? 1 : -1);
const STAGE_SPRING = { type: 'spring', stiffness: 42, damping: 7, mass: 1 };
const STAGE_EASE = [0.22, 1, 0.36, 1];
const stageTransition = { x: STAGE_SPRING, y: STAGE_SPRING, rotate: STAGE_SPRING, opacity: { duration: 0.7, ease: STAGE_EASE } };

function stagePose(i, active, peekY) {
    const side = sideOf(i);
    if (i === active) return { x: 0, y: 0, rotate: 0, opacity: 1 };
    if (i < active) return { x: 0, y: -180, rotate: -5, opacity: 0 };
    return { x: side * PEEK_SHIFT, y: peekY, rotate: side * PEEK_TILT, opacity: i === active + 1 ? 1 : 0 };
}

// Laptop/desktop Selected Work: the highlights stay pinned at the top while
// scrolling swaps one project card at a time underneath them.
// Styles: .work-stage* in styles/home/work.css.
export default function WorkStage({ sectionRef, highlightsRef }) {
    const [active, setActive] = useState(0);
    const [peekY, setPeekY] = useState(0);
    const slotRef = useRef(null);
    const count = projects.length;
    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });

    useMotionValueEvent(scrollYProgress, 'change', (p) => {
        setActive(Math.min(count - 1, Math.max(0, Math.round(p * (count - 1)))));
    });

    // The peek position depends on where the card sits in the window, so
    // measure the slot: the distance from the card's resting top to the
    // window's bottom edge, minus the 5% of the card that should show. The
    // tilt drops the trailing top corner, so the card is raised by that much
    // more: the whole top edge shows, with the leading corner higher and
    // tucked behind the active card.
    useLayoutEffect(() => {
        const slot = slotRef.current;
        if (!slot) return undefined;
        const measure = () => {
            const wrapper = slot.querySelector('.work-stage-card');
            const card = wrapper?.querySelector('.project-card-link');
            const cardTop = wrapper ? wrapper.offsetTop : 0;
            const toBottom = slot.offsetParent.clientHeight - slot.offsetTop;
            const cardH = card ? card.offsetHeight : 0;
            const cardW = card ? card.offsetWidth : 0;
            const tilt = (PEEK_TILT * Math.PI) / 180;
            const cornerDrop = (cardW / 2) * Math.sin(tilt) + (cardH / 2) * (1 - Math.cos(tilt));
            slot.style.setProperty('--to-bottom', `${toBottom}px`);
            setPeekY(Math.round(toBottom - cardTop - cardH * PEEK_VISIBLE - cornerDrop));
        };
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(slot);
        window.addEventListener('resize', measure);
        return () => {
            observer.disconnect();
            window.removeEventListener('resize', measure);
        };
    }, []);

    return (
        <section
            className="work work--stage"
            ref={sectionRef}
            id="work"
            style={{ height: `calc(100vh + ${(count - 1) * STAGE_STEP}vh)` }}
        >
            <div className="work-stage">
                <div className="container work-stage-head">
                    <Highlights ref={highlightsRef} />
                    <div className="work-stage-label">
                        <p className="eyebrow">Selected work</p>
                        <div className="work-stage-row">
                            <h2 className="work-stage-title">Case studies from Walmart</h2>
                            <p className="work-stage-count" aria-live="polite" aria-atomic="true">
                                <span className="work-stage-count-num">{active + 1}</span> of {count}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="work-stage-slot" ref={slotRef}>
                    <div className="work-stage-layer">
                        {projects.map((project, i) => (
                            <motion.div
                                key={project.slug}
                                className="container work-stage-card"
                                initial={false}
                                animate={stagePose(i, active, peekY)}
                                transition={stageTransition}
                                style={{ zIndex: i === active ? 2 : 1 }}
                                inert={i !== active}
                            >
                                <ProjectCardLink project={project} index={i} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
