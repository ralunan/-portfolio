import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import App from './App.jsx';
import './styles/index.css';

// Hash routing (#/work/cashi) works on GitHub Pages with no server rewrites.
createRoot(document.getElementById('root')).render(
    <StrictMode>
        <HashRouter>
            <MotionConfig reducedMotion="user">
                <App />
            </MotionConfig>
        </HashRouter>
    </StrictMode>
);
