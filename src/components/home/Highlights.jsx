import Reveal from '../Reveal.jsx';

const STATS = [
    ['5 yrs', 'designing eCommerce at Walmart International'],
    ['3', 'markets served: Canada, Mexico and Chile'],
    ['1st', 'structured customer-insight program for the international org'],
    ['AI', 'assisted prototyping with Claude and Framer'],
];

// The four stat tiles at the top of Selected Work (#/highlights lands here).
// Styles: .stats in styles/home/work.css.
export default function Highlights({ ref }) {
    return (
        <div className="stats" role="region" aria-label="Highlights" id="highlights" ref={ref}>
            {STATS.map(([value, label], i) => (
                <Reveal key={value} className="stat" delay={i * 0.08}>
                    <span className="stat-value">{value}</span>
                    <span className="stat-label">{label}</span>
                </Reveal>
            ))}
        </div>
    );
}
