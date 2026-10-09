import { useEffect, useState } from 'react';
import Reveal from '../Reveal.jsx';
import { projects } from '../../content.js';
import Highlights from './Highlights.jsx';
import ProjectCard from './ProjectCard.jsx';
import WorkStage from './WorkStage.jsx';

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

// The highlights start --header-gap below the header (DESIGN.md rule 8).
// By the time visitors reach this screen the header has shrunk to its
// scrolled height, which also changes with width, so measure it and hand
// it to the CSS as --header-live on the section.
function useHeaderHeight(sectionRef, layout) {
    useEffect(() => {
        const header = document.querySelector('header.nav');
        const section = sectionRef.current;
        if (!header || !section) return undefined;
        const update = () => section.style.setProperty('--header-live', `${header.getBoundingClientRect().height}px`);
        update();
        const observer = new ResizeObserver(update);
        observer.observe(header, { box: 'border-box' });
        return () => observer.disconnect();
    }, [sectionRef, layout]);
}

// Home screen 2: highlights + Selected Work. Picks the pinned stage
// (WorkStage.jsx) or the stacked list below. Styles: styles/home/work.css.
export default function SelectedWork({ sectionRef, highlightsRef }) {
    const workStage = useWorkStage();
    useHeaderHeight(sectionRef, workStage);

    if (workStage) return <WorkStage sectionRef={sectionRef} highlightsRef={highlightsRef} />;

    return (
        <section className="work container" ref={sectionRef} id="work">
            {/* Label first, then the skill cards and the work (Ron, 2026-10-09). */}
            <Reveal className="section-head" ref={highlightsRef}>
                <p className="eyebrow">Skill highlights</p>
                <h2 className="section-title">What each project taught me to do best</h2>
            </Reveal>
            <Highlights />
            <div className="work-list">
                {projects.map((project, i) => (
                    <ProjectCard key={project.slug} project={project} index={i} />
                ))}
            </div>
        </section>
    );
}
