import { Link } from 'react-router-dom';
import Reveal from '../Reveal.jsx';
import profile from '../../../ron_profile2.jpg';

// Last home section: photo + short story, linking to the About page.
// Styles: .about-teaser* in styles/home/about-teaser.css.
export default function AboutTeaser() {
    return (
        <section className="about-teaser container">
            <Reveal className="about-teaser-card">
                <img src={profile} alt="Portrait of Ronald Alunan" className="about-teaser-photo" />
                <div>
                    <p className="eyebrow">About</p>
                    <h2 className="section-title">Empathy learned at the counter, applied to product.</h2>
                    <p className="muted">
                        While studying, I worked as an optician in San Francisco, where I learned how trust and
                        communication connect customer needs to business goals. I funded my own way through
                        CCA, landed a UX internship at Walmart, and stayed on full time for five years.
                    </p>
                    <Link className="button" to="/about">Read my story →</Link>
                </div>
            </Reveal>
        </section>
    );
}
