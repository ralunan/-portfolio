import Reveal from '../Reveal.jsx';

// One card per skill Ron built along the way (Ron, 2026-10-09): each names
// a concrete skill and previews the project behind it. Cards are numbered
// and ordered to match the projects below (01 UX research, 02 Cashi,
// 03 Fashion); Collaboration is 04, for the onboarding project to come.
// Sources: CONTENT-NOTES.md (Home highlights).
const STATS = [
    ['UX research', 'Research that turned customer insight into roadmap decisions'],
    ['Fintech UX', 'Linking Cashi wallets to Walmart checkout in Mexico'],
    ['AI prototyping', 'From physical builds at CCA to digital experiences with AI'],
    ['Collaboration', 'Partnering with product teams to take new ideas from pitch to launch'],
];

// The four skill cards at the top of Selected Work (#/highlights lands here).
// Styles: .stats in styles/home/work.css; the card surface is .card in
// styles/components/card.css.
// `selected` is the index of the project in view on the pinned work stage;
// that card's back card turns Terracotta and it grows while the others
// shrink. The stacked list passes none.
export default function Highlights({ ref, selected }) {
    return (
        <div className={`stats${selected != null ? ' stats--selecting' : ''}`} role="region" aria-label="Highlights" id="highlights" ref={ref}>
            {STATS.map(([value, label], i) => (
                <Reveal
                    key={value}
                    className={`stat card card--stacked${i === selected ? ' is-selected' : ''}`}
                    delay={i * 0.08}
                >
                    <span className="stat-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="stat-value">{value}</span>
                    <span className="stat-label">{label}</span>
                </Reveal>
            ))}
        </div>
    );
}
