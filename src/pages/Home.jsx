import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import useHeroHandoff from '../components/home/useHeroHandoff.js';
import Hero from '../components/home/Hero.jsx';
import SelectedWork from '../components/home/SelectedWork.jsx';
import Approach from '../components/home/Approach.jsx';
import AboutTeaser from '../components/home/AboutTeaser.jsx';

// The home page, top to bottom. Each section lives in components/home/ with
// its styles in styles/home/. This file only owns the scroll hand-off
// between the hero and Selected Work, and the #/highlights deep link.
export default function Home() {
    const workRef = useRef(null);
    const highlightsRef = useRef(null);
    const location = useLocation();
    const { goToWork, goTo } = useHeroHandoff(workRef);
    const goToHighlights = () => {
        const el = highlightsRef.current;
        // Land just below the fixed nav.
        if (el) goTo(() => Math.round(el.getBoundingClientRect().top + window.scrollY) - 96);
    };

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
            <Hero onSeeWork={goToWork} />
            <SelectedWork sectionRef={workRef} highlightsRef={highlightsRef} />
            <Approach />
            <AboutTeaser />
        </>
    );
}
