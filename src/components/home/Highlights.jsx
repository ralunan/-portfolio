import Reveal from '../Reveal.jsx';

// One card per building block (Ron, 2026-10-09), so they don't repeat the
// hero: Making sense, Building, Communication, Creating. Making sense comes
// first because it lines up with the first project shown below.
// Sources: CONTENT-NOTES.md (Home highlights).
const STATS = [
    ['Insights', 'from research that improved marketplace products'],
    ['12–32%', 'more successful deliveries in Canada, and +3% marketplace sales'],
    ['3', 'design-led projects I led end to end, from discovery to launch'],
    ['AI', 'prototyping, from hands-on builds at CCA to Claude and Framer'],
];

// The four stat tiles at the top of Selected Work (#/highlights lands here).
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
