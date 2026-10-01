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

// Home screen 2: highlights + Selected Work. Picks the pinned stage
// (WorkStage.jsx) or the stacked list below. Styles: styles/home/work.css.
export default function SelectedWork({ sectionRef, highlightsRef }) {
    const workStage = useWorkStage();

    if (workStage) return <WorkStage sectionRef={sectionRef} highlightsRef={highlightsRef} />;

    return (
        <section className="work container" ref={sectionRef} id="work">
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
    );
}
