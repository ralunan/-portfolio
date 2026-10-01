import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import Reveal from '../Reveal.jsx';

// Project card in the stacked list (phones, short windows, reduced motion):
// reveals on scroll, and the cover image drifts slightly as it scrolls past.
export default function ProjectCard({ project, index }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
    const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

    return (
        <Reveal as="article" className="project-card" style={{ '--accent': project.accent }}>
            <ProjectCardLink project={project} index={index} linkRef={ref} imageY={y} />
        </Reveal>
    );
}

// The card itself (cover, number, tags, title, tagline, CTA). The work stage
// uses it directly; ProjectCard wraps it for the stacked list.
// Styles: .project-card-* in styles/home/project-card.css.
export function ProjectCardLink({ project, index, linkRef, imageY }) {
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
