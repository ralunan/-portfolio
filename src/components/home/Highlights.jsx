import Reveal from '../Reveal.jsx';

// One card per building block (Ron, 2026-10-09): each names a skill and
// previews the work behind it, rather than listing an achievement. Cards are
// numbered and ordered to match the projects below (01 research, 02 Cashi,
// 03 Fashion); Communication is 04, for the onboarding project to come.
// Sources: CONTENT-NOTES.md (Home highlights).
const STATS = [
    ['Making sense', 'Research that turned customer insight into roadmap decisions'],
    ['Building', 'Linking Cashi wallets to Walmart checkout in Mexico'],
    ['Creating', 'Prototyping from physical builds at CCA to digital experiences with AI'],
    ['Communication', 'Partnering with product teams to take new ideas from pitch to launch'],
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
