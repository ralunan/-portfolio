import Reveal from '../components/Reveal.jsx';
import { resume } from '../content.js';

export default function Resume() {
    return (
        <div className="resume container">
            <header className="resume-head">
                <div>
                    <Reveal as="p" className="eyebrow">Resume</Reveal>
                    <Reveal as="h1" className="page-title">{resume.name}</Reveal>
                    <Reveal as="p" className="muted">{resume.title} · <a href={`mailto:${resume.email}`}>{resume.email}</a></Reveal>
                </div>
                <Reveal>
                    <button type="button" className="button" onClick={() => window.print()}>Save as PDF</button>
                </Reveal>
            </header>

            <div className="resume-grid">
                <section className="resume-experience">
                    <Reveal as="h2" className="resume-heading">Experience</Reveal>
                    {resume.experience.map((job) => (
                        <Reveal key={job.org} className="job">
                            <h3>{job.org}</h3>
                            {job.role && <p className="job-role">{job.role}</p>}
                            {job.points.length > 0 && (
                                <ul>
                                    {job.points.map((point) => <li key={point}>{point}</li>)}
                                </ul>
                            )}
                        </Reveal>
                    ))}
                </section>
                <aside className="resume-side">
                    {resume.lists.map((list) => (
                        <Reveal key={list.heading} className="resume-list">
                            <h2 className="resume-heading">{list.heading}</h2>
                            <ul>
                                {list.items.map((item) => <li key={item}>{item}</li>)}
                            </ul>
                        </Reveal>
                    ))}
                </aside>
            </div>
        </div>
    );
}
