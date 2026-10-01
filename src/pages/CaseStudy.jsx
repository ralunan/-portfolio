import { Link, useParams } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import Reveal from '../components/Reveal.jsx';
import { useLightbox } from '../components/Lightbox.jsx';
import { getProject, projects } from '../content.js';
import NotFound from './NotFound.jsx';

export default function CaseStudy() {
    const { slug } = useParams();
    const project = getProject(slug);
    const { scrollYProgress } = useScroll();
    const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

    if (!project) return <NotFound />;

    const index = projects.indexOf(project);
    const next = projects[(index + 1) % projects.length];

    return (
        <article className="case" style={{ '--accent': project.accent }}>
            <motion.div className="read-progress" style={{ scaleX: progress }} />

            <header className="case-hero container">
                <Link to="/" state={{ scrollTo: 'work' }} className="back-link">← All work</Link>
                <div className="tags">
                    {project.tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}
                </div>
                <h1 className="case-title">{project.title}</h1>
                <p className="case-tagline">{project.tagline}</p>
                <dl className="case-meta">
                    {project.meta.map(([label, value]) => (
                        <div key={label}>
                            <dt>{label}</dt>
                            <dd>{value}</dd>
                        </div>
                    ))}
                </dl>
            </header>

            <Reveal className="case-cover container">
                <div className="frame frame--hero">
                    <img src={project.coverSrc} alt={`${project.title} overview`} />
                </div>
            </Reveal>

            <section className="outcomes container" aria-label="Outcomes">
                <Reveal><p className="eyebrow">Outcomes</p></Reveal>
                <div className="outcomes-grid">
                    {project.outcomes.map((outcome, i) => (
                        <Reveal key={outcome} className="outcome" delay={i * 0.08}>
                            <span className="outcome-num">0{i + 1}</span>
                            <p>{outcome}</p>
                        </Reveal>
                    ))}
                </div>
            </section>

            {project.chapters.map((chapter, i) => (
                <Chapter key={chapter.title} chapter={chapter} number={i + 1} project={project} />
            ))}

            <section className="next container">
                <Reveal>
                    <Link to={`/work/${next.slug}`} className="next-card" style={{ '--accent': next.accent }}>
                        <div>
                            <p className="eyebrow">Next case study</p>
                            <h2 className="next-title">{next.title}</h2>
                            <span className="project-card-cta text-cta">View <em>project</em> <span aria-hidden="true">→</span></span>
                        </div>
                        <img src={next.coverSrc} alt="" loading="lazy" />
                    </Link>
                </Reveal>
            </section>
        </article>
    );
}

function Chapter({ chapter, number, project }) {
    // The intro chapter's own cover image already appears in the hero.
    const images = chapter.images.filter((img) => img.file !== project.cover);
    const hasText = chapter.blocks.length > 0 || chapter.problemBlocks.length > 0;

    return (
        <section className="chapter container">
            <div className={`chapter-grid ${hasText ? '' : 'chapter-grid--label-only'}`}>
                <Reveal className="chapter-label">
                    <span className="chapter-num">{String(number).padStart(2, '0')}</span>
                    <h2>{chapter.title}</h2>
                </Reveal>
                {hasText && (
                    <div className="chapter-body">
                        <Blocks blocks={chapter.blocks} />
                        {chapter.problemBlocks.length > 0 && (
                            <Reveal className="problem">
                                <p className="eyebrow">Problem statement</p>
                                {chapter.problemBlocks.map((block, i) => (
                                    <p key={i} className={i === 0 && block.text.length < 240 ? 'problem-lead' : ''}>{block.text}</p>
                                ))}
                            </Reveal>
                        )}
                    </div>
                )}
            </div>
            {images.length > 0 && <Gallery images={images} layout={chapter.layout} title={chapter.title} />}
        </section>
    );
}

function Blocks({ blocks }) {
    return blocks.map((block, i) =>
        block.type === 'sub' ? (
            <Reveal key={i} className="sub-block">
                <h3>{block.title}</h3>
                {block.paragraphs.map((p, j) => <p key={j}>{p}</p>)}
            </Reveal>
        ) : (
            <Reveal key={i} as="p">{block.text}</Reveal>
        )
    );
}

function Gallery({ images, layout, title }) {
    const open = useLightbox();
    return (
        <div className={`gallery gallery--${layout}`} data-count={images.length}>
            {images.map((img, i) => {
                const alt = img.caption ?? `${title}, image ${i + 1}`;
                return (
                    <Reveal key={img.file} as="figure" delay={i * 0.06} className="gallery-item">
                        {img.caption && <figcaption>{img.caption}</figcaption>}
                        <button
                            type="button"
                            className="frame frame--zoom"
                            onClick={() => open({ src: img.src, alt })}
                            aria-label={`Enlarge: ${alt}`}
                        >
                            <img src={img.src} alt={alt} loading="lazy" />
                            <span className="zoom-hint" aria-hidden="true">Click to enlarge</span>
                        </button>
                    </Reveal>
                );
            })}
        </div>
    );
}
