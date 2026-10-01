import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';
import { LightboxProvider } from './components/Lightbox.jsx';
import Page from './components/Page.jsx';
import Home from './pages/Home.jsx';
import CaseStudy from './pages/CaseStudy.jsx';
import About from './pages/About.jsx';
import Resume from './pages/Resume.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
    const location = useLocation();

    // Wait for the exit animation before jumping to the top of the next page.
    useEffect(() => {
        const id = setTimeout(() => window.scrollTo({ top: 0, behavior: 'instant' }), 280);
        return () => clearTimeout(id);
    }, [location.pathname]);

    return (
        <LightboxProvider>
            <div className="backdrop" aria-hidden="true">
                <span className="orb orb--a" />
                <span className="orb orb--b" />
            </div>
            <Nav />
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<Page><Home /></Page>} />
                    <Route path="/work/:slug" element={<Page><CaseStudy /></Page>} />
                    <Route path="/about" element={<Page><About /></Page>} />
                    <Route path="/resume" element={<Page><Resume /></Page>} />
                    <Route path="*" element={<Page><NotFound /></Page>} />
                </Routes>
            </AnimatePresence>
            <Footer />
        </LightboxProvider>
    );
}
