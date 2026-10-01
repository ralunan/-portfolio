import { NavLink, Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { resume } from '../content.js';

export default function Nav() {
    const [scrolled, setScrolled] = useState(false);
    const [pastHero, setPastHero] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 24);
            setPastHero(window.scrollY > window.innerHeight - 140);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const workActive = location.pathname === '/' || location.pathname.startsWith('/work');
    // The home hero is light, so the nav switches to dark text over it.
    const onLight = location.pathname === '/' && !pastHero;

    return (
        <header className={`nav ${scrolled ? 'nav--scrolled' : ''} ${onLight ? 'nav--on-light' : ''}`}>
            <Link to="/" className="nav-brand" aria-label="Ronald Alunan, home">
                <span className="nav-mark">RA</span>
                <span className="nav-name">Ronald Alunan</span>
            </Link>
            <nav className="nav-links">
                <Link to="/" state={{ scrollTo: 'work' }} className={workActive ? 'active' : ''}>Work</Link>
                <NavLink to="/about">About</NavLink>
                <NavLink to="/resume">Resume</NavLink>
                <a className="nav-cta" href={`mailto:${resume.email}`}>Contact</a>
            </nav>
        </header>
    );
}
