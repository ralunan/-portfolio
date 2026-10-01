import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import Reveal from '../components/Reveal.jsx';
import useHeroHandoff from '../components/useHeroHandoff.js';
import { projects } from '../content.js';
import profile from '../../ron_profile2.jpg';

// three.js is heavy, so the live gradient loads in its own chunk after the
// page renders. Phones and reduced-motion visitors keep the static CSS
// gradient underneath instead.
const HeroGradient = lazy(() => import('../components/HeroGradient.jsx'));

function useLiveGradient() {
    const [enabled, setEnabled] = useState(false);
    useEffect(() => {
        const query = window.matchMedia('(min-width: 641px) and (prefers-reduced-motion: no-preference)');
        const update = () => setEnabled(query.matches);
        update();
        query.addEventListener('change', update);
        return () => query.removeEventListener('change', update);
    }, []);
    return enabled;
}

// The pinned work stage is for laptop and desktop screens. Phones, short
// windows and reduced-motion visitors get the plain stacked list instead.
function useWorkStage() {
    const [enabled, setEnabled] = useState(false);
    useEffect(() => {
        const query = window.matchMedia('(min-width: 961px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)');
        const update = () => setEnabled(query.matches);
        update();
        query.addEventListener('change', update);
        return () => query.removeEventListener('change', update);
    }, []);
    return enabled;
}

const STATS = [
    ['5 yrs', 'designing eCommerce at Walmart International'],
    ['3', 'markets served: Canada, Mexico and Chile'],
    ['1st', 'structured customer-insight program for the international org'],
    ['AI', 'assisted prototyping with Claude and Framer'],
];

const APPROACH = [
    ['Listen first', 'I start with what customers are actually saying, mining feedback and partnering with data to find the patterns behind it.'],
    ['Map every state', 'Real products branch. I trace each path and account state so nothing surprises engineering or the customer.'],
    ['Build with the system', 'I audit and reuse existing components, adapting design systems to local needs so teams ship faster at scale.'],
    ['Prototype at speed', 'AI-assisted prototyping lets me explore dozens of directions quickly, then focus the team on the strongest ones.'],
];

const heroWords = ['Product', 'designer', 'turning', 'customer', 'insight', 'into', 'commerce', 'people'];

export default function Home() {
    const heroRef = useRef(null);
    const workRef = useRef(null);
    const highlightsRef = useRef(null);
    const location = useLocation();
    const liveGradient = useLiveGradient();
    const workStage = useWorkStage();
    const { goToWork, goTo } = useHeroHandoff(workRef);
    const goToHighlights = () => {
        const el = highlightsRef.current;
        // Land just below the fixed nav.
        if (el) goTo(() => Math.round(el.getBoundingClientRect().top + window.scrollY) - 96);
    };

    // As the hero scrolls away, its content lifts and fades while the
    // gradient pushes in slightly, so it reads as one screen handing off.
    const { scrollYProgress: heroExit } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const contentY = useTransform(heroExit, [0, 1], ['0%', '-35%']);
    const contentOpacity = useTransform(heroExit, [0, 0.6], [1, 0]);
    const gradientScale = useTransform(heroExit, [0, 1], [1, 1.15]);

    useEffect(() => {
        // Deep links: #/highlights, or the nav's Work link from another page.
        const target = location.pathname === '/highlights' ? goToHighlights : location.state?.scrollTo === 'work' ? goToWork : null;
        if (target) {
            const id = setTimeout(target, 350);
            return () => clearTimeout(id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname, location.state, location.key, goToWork]);

    return (
        <>
            <section className="hero-light" ref={heroRef}>
                <motion.div className="hero-gradient" aria-hidden="true" style={{ scale: gradientScale }}>
                    {liveGradient && (
                        <Suspense fallback={null}>
                            <HeroGradient />
                        </Suspense>
                    )}
                </motion.div>
                <motion.div className="hero container" style={{ y: contentY, opacity: contentOpacity }}>
                    <motion.p
                        className="eyebrow"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                    >
                        <span className="status-dot" /> Product designer · San Francisco
                    </motion.p>
                    <h1 className="hero-title">
                        {heroWords.map((word, i) => (
                            <motion.span
                                key={word}
                                className="hero-word"
                                initial={{ opacity: 0, y: '0.6em' }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + i * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            >
                                {word}{' '}
                            </motion.span>
                        ))}
                        <motion.em
                            className="hero-word"
                            initial={{ opacity: 0, y: '0.6em' }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + heroWords.length * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        >
                            trust.
                        </motion.em>
                    </h1>
                    <motion.p
                        className="hero-sub"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.75 }}
                    >
                        I spent five years designing Walmart’s international eCommerce experience across Canada,
                        Mexico and Chile, then brought AI-assisted prototyping to the US Fashion team.
                    </motion.p>
                    <motion.div
                        className="hero-actions"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                    >
                        <button type="button" className="text-cta text-cta--lg" onClick={goToWork}>
                            See selected <em>work</em> <span aria-hidden="true">↓</span>
                        </button>
                    </motion.div>
                </motion.div>
                <button type="button" className="scroll-cue" onClick={goToWork} aria-label="Scroll to selected work">
                    <span />
                </button>
            </section>

            {workStage ? (
                <WorkStage sectionRef={workRef} highlightsRef={highlightsRef} />
            ) : (
                <section className="work container" ref={workRef} id="work">
                    {/* Highlights come first so the work below reads in context. */}
                    <Highlights ref={highlightsRef} />
                    <Reveal className="section-head">
                        <p className="eyebrow">Selected work</p>
                        <h2 className="section-title">Case studies from Walmart</h2>
                    </Reveal>
                    <div className="work-list">
                        {projects.map((project, i) => (
                            <ProjectCard key={project.slug} project={project} index={i} />
                        ))}
                    </div>
                </section>
            )}

            <section className="approach container">
                <Reveal className="section-head">
                    <p className="eyebrow">How I work</p>
                    <h2 className="section-title">From customer signal to <em>shipped</em> product</h2>
                </Reveal>
                <div className="approach-grid">
                    {APPROACH.map(([title, text], i) => (
                        <Reveal key={title} className="approach-card" delay={i * 0.08}>
                            <span className="approach-num">0{i + 1}</span>
                            <h3>{title}</h3>
                            <p>{text}</p>
                        </Reveal>
                    ))}
                </div>
            </section>

            <section className="about-teaser container">
                <Reveal className="about-teaser-card">
                    <img src={profile} alt="Portrait of Ronald Alunan" className="about-teaser-photo" />
                    <div>
                        <p className="eyebrow">About</p>
                        <h2 className="section-title">Empathy learned at the counter, applied to product.</h2>
                        <p className="muted">
                            While studying, I worked as an optician in San Francisco, where I learned how trust and
                            communication connect customer needs to business goals. I funded my own way through
                            CCA, landed a UX internship at Walmart, and stayed on full time for five years.
                        </p>
                        <Link className="button" to="/about">Read my story →</Link>
                    </div>
                </Reveal>
            </section>
        </>
    );
}

function Highlights({ ref }) {
    return (
        <div className="stats" role="region" aria-label="Highlights" id="highlights" ref={ref}>
            {STATS.map(([value, label], i) => (
                <Reveal key={value} className="stat" delay={i * 0.08}>
                    <span className="stat-value">{value}</span>
                    <span className="stat-label">{label}</span>
                </Reveal>
            ))}
        </div>
    );
}

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
function WorkStage({ sectionRef, highlightsRef }) {
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
                        <h2 className="work-stage-title">Case studies from Walmart</h2>
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

function ProjectCard({ project, index }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
    const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

    return (
        <Reveal as="article" className="project-card" style={{ '--accent': project.accent }}>
            <ProjectCardLink project={project} index={index} linkRef={ref} imageY={y} />
        </Reveal>
    );
}

function ProjectCardLink({ project, index, linkRef, imageY }) {
    return (
        <Link to={`/work/${project.slug}`} className="project-card-link" ref={linkRef} style={{ '--accent': project.accent }}>
            <div className="project-card-media">
                <motion.img src={project.coverSrc} alt="" style={imageY ? { y: imageY } : undefined} loading={index ? 'lazy' : 'eager'} />
            </div>
            <div className="project-card-body">
                <span className="project-card-num">0{index + 1}</span>
                <div className="tags">
                    {project.tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}
                </div>
                <h3 className="project-card-title">{project.title}</h3>
                <p className="project-card-tagline">{project.tagline}</p>
                <span className="project-card-cta text-cta">Read the <em>case study</em> <span aria-hidden="true">→</span></span>
            </div>
        </Link>
    );
}
