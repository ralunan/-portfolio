import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
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
    const location = useLocation();
    const liveGradient = useLiveGradient();
    const goToWork = useHeroHandoff(workRef);

    // As the hero scrolls away, its content lifts and fades while the
    // gradient pushes in slightly, so it reads as one screen handing off.
    const { scrollYProgress: heroExit } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const contentY = useTransform(heroExit, [0, 1], ['0%', '-35%']);
    const contentOpacity = useTransform(heroExit, [0, 0.6], [1, 0]);
    const gradientScale = useTransform(heroExit, [0, 1], [1, 1.15]);

    useEffect(() => {
        if (location.state?.scrollTo === 'work') {
            const id = setTimeout(goToWork, 350);
            return () => clearTimeout(id);
        }
    }, [location.state, location.key, goToWork]);

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
                        <button
                            type="button"
                            className="button button--primary"
                            onClick={goToWork}
                        >
                            See selected work ↓
                        </button>
                        <Link className="button" to="/about">About me</Link>
                    </motion.div>
                </motion.div>
                <button type="button" className="scroll-cue" onClick={goToWork} aria-label="Scroll to selected work">
                    <span />
                </button>
            </section>

            <section className="work container" ref={workRef} id="work">
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

            <section className="stats container" aria-label="Highlights">
                {STATS.map(([value, label], i) => (
                    <Reveal key={value} className="stat" delay={i * 0.08}>
                        <span className="stat-value">{value}</span>
                        <span className="stat-label">{label}</span>
                    </Reveal>
                ))}
            </section>

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

function ProjectCard({ project, index }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
    const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

    return (
        <Reveal as="article" className="project-card" style={{ '--accent': project.accent }}>
            <Link to={`/work/${project.slug}`} className="project-card-link" ref={ref}>
                <div className="project-card-media">
                    <motion.img src={project.coverSrc} alt="" style={{ y }} loading={index ? 'lazy' : 'eager'} />
                </div>
                <div className="project-card-body">
                    <span className="project-card-num">0{index + 1}</span>
                    <div className="tags">
                        {project.tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}
                    </div>
                    <h3 className="project-card-title">{project.title}</h3>
                    <p className="project-card-tagline">{project.tagline}</p>
                    <span className="project-card-cta">Read case study <span aria-hidden="true">→</span></span>
                </div>
            </Link>
        </Reveal>
    );
}
