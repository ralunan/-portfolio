import Reveal from '../Reveal.jsx';

const APPROACH = [
    ['Listen first', 'I start with what customers are actually saying, mining feedback and partnering with data to find the patterns behind it.'],
    ['Map every state', 'Real products branch. I trace each path and account state so nothing surprises engineering or the customer.'],
    ['Build with the system', 'I audit and reuse existing components, adapting design systems to local needs so teams ship faster at scale.'],
    ['Prototype at speed', 'AI-assisted prototyping lets me explore dozens of directions quickly, then focus the team on the strongest ones.'],
];

// "How I work": four numbered cards. Styles: .approach* in styles/home/approach.css.
export default function Approach() {
    return (
        <section className="approach container">
            <Reveal className="section-head">
                <p className="eyebrow">How I work</p>
                <h2 className="section-title">From customer signal to <em>shipped</em> product</h2>
            </Reveal>
            <div className="approach-grid">
                {APPROACH.map(([title, text], i) => (
                    <Reveal key={title} className="approach-card" delay={i * 0.08}>
                        <span className="approach-num">0{i + 1}</span>
                        <h3>{title}</h3>
                        <p>{text}</p>
                    </Reveal>
                ))}
            </div>
        </section>
    );
}
