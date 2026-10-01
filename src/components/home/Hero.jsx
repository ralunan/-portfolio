import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// three.js is heavy, so the live gradient loads in its own chunk after the
// page renders. Phones and reduced-motion visitors keep the static CSS
// gradient underneath instead.
const HeroGradient = lazy(() => import('./HeroGradient.jsx'));

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

const heroWords = ['Product', 'designer', 'turning', 'customer', 'insight', 'into', 'commerce', 'people'];

// Home screen 1: gradient + springy boxes behind the headline. Styles: styles/home/hero.css.
export default function Hero({ onSeeWork }) {
    const heroRef = useRef(null);
    const liveGradient = useLiveGradient();

    // As the hero scrolls away, its content lifts and fades while the
    // gradient pushes in slightly, so it reads as one screen handing off.
    const { scrollYProgress: heroExit } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const contentY = useTransform(heroExit, [0, 1], ['0%', '-35%']);
    const contentOpacity = useTransform(heroExit, [0, 0.6], [1, 0]);
    const gradientScale = useTransform(heroExit, [0, 1], [1, 1.15]);

    return (
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
                    {/* Hard return: "trust." always sits alone on the last line. */}
                    <br />
                    {/* The white box behind "trust." is a ::before on this span, so it
                        sits under the em's gradient text (see .hero-highlight). */}
                    <motion.span
                        className="hero-word hero-highlight"
                        initial={{ opacity: 0, y: '0.6em' }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + heroWords.length * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <em>trust.</em>
                    </motion.span>
                </h1>
                <motion.p
                    className="hero-sub"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.75 }}
                >
                    For five years I designed Walmart eCommerce for the US, Canada, Mexico and Chile. I led
                    projects end to end and championed research, turning what shoppers told us into checkouts
                    they could rely on.
                </motion.p>
                <motion.div
                    className="hero-actions"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                >
                    <button type="button" className="text-cta text-cta--lg" onClick={onSeeWork}>
                        See selected <em>work</em> <span aria-hidden="true">↓</span>
                    </button>
                </motion.div>
            </motion.div>
            <button type="button" className="scroll-cue" onClick={onSeeWork} aria-label="Scroll to selected work">
                <span />
            </button>
        </section>
    );
}
