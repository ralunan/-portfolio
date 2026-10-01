import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal.jsx';
import { about } from '../content.js';
import profile from '../../ron_profile2.jpg';

// Dates come from resume.txt.
const JOURNEY = [
    ['2015–2018', 'City College of San Francisco', 'AA in Graphic Design, plus Visual & Interactive Design and Digital Illustration certificates'],
    ['2016–2017', 'Emerge Studio, CCSF', 'Graphic designer on collaborative projects with non-profits'],
    ['2018', 'Topology Eyewear', 'Product design intern at a San Francisco startup'],
    ['2018–2021', 'California College of the Arts', 'BFA in Interaction Design'],
    ['2021–2026', 'Walmart International', 'UX Design III across Canada, Mexico and Chile eCommerce'],
    ['Most recent', 'Walmart US Global Fashion', 'Embedding AI-driven workflows into ideation and prototyping'],
];

export default function About() {
    const [lead, ...rest] = about.filter((b) => b.type === 'p');
    return (
        <div className="about container">
            <section className="about-hero">
                <Reveal className="about-photo-wrap">
                    <img src={profile} alt="Portrait of Ronald Alunan" className="about-photo" />
                </Reveal>
                <div>
                    <Reveal as="p" className="eyebrow">About me</Reveal>
                    <Reveal as="h1" className="page-title">
                        Driven by empathy, curiosity and <em>meaningful</em> experiences.
                    </Reveal>
                    {lead && <Reveal as="p" className="about-lead">{lead.text}</Reveal>}
                </div>
            </section>

            <section className="about-story">
                {rest.map((block, i) => (
                    <Reveal as="p" key={i}>{block.text}</Reveal>
                ))}
            </section>

            <section className="journey">
                <Reveal className="section-head">
                    <p className="eyebrow">Journey</p>
                    <h2 className="section-title">How I got here</h2>
                </Reveal>
                <ol className="timeline">
                    {JOURNEY.map(([when, where, what], i) => (
                        <Reveal as="li" key={where} delay={i * 0.05}>
                            <span className="timeline-when">{when}</span>
                            <div>
                                <h3>{where}</h3>
                                <p>{what}</p>
                            </div>
                        </Reveal>
                    ))}
                </ol>
                <Reveal className="about-actions">
                    <Link className="text-cta text-cta--lg" to="/" state={{ scrollTo: 'work' }}>See my <em>work</em> <span aria-hidden="true">→</span></Link>
                    <Link className="button" to="/resume">View resume</Link>
                </Reveal>
            </section>
        </div>
    );
}
