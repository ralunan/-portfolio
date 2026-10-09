import Reveal from '../Reveal.jsx';

// One card per building block (Ron, 2026-10-09): each names a skill and
// previews the work behind it, rather than listing an achievement. Making
// sense comes first because it lines up with the first project shown below.
// Sources: CONTENT-NOTES.md (Home highlights).
const STATS = [
    ['Making sense', 'Research that turned customer insight into roadmap decisions'],
    ['Building', 'Linking Cashi wallets to Walmart checkout in Mexico'],
    ['Communication', 'Partnering with product teams to take new ideas from pitch to launch'],
    ['Creating', 'Prototyping from physical builds at CCA to digital experiences with AI'],
];

// The four skill cards at the top of Selected Work (#/highlights lands here).
// Styles: .stats in styles/home/work.css; the card surface is .card in
// styles/components/card.css.
export default function Highlights({ ref }) {
    return (
        <div className="stats" role="region" aria-label="Highlights" id="highlights" ref={ref}>
            {STATS.map(([value, label], i) => (
                <Reveal key={value} className="stat card card--stacked" delay={i * 0.08}>
                    <span className="stat-value">{value}</span>
                    <span className="stat-label">{label}</span>
                </Reveal>
            ))}
        </div>
    );
}
