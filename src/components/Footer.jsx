import { useEffect, useState } from 'react';
import { resume } from '../content.js';
import Reveal from './Reveal.jsx';

// Live commit count from the GitHub API (carried over from v1), read from the
// `Link` header's last page rather than paginating through every commit.
function useCommitCount() {
    const [count, setCount] = useState(null);
    useEffect(() => {
        fetch('https://api.github.com/repos/ralunan/-portfolio/commits?per_page=1')
            .then((res) => {
                const last = res.headers.get('Link')?.match(/[?&]page=(\d+)>; rel="last"/);
                if (last) setCount(Number(last[1]));
                else return res.json().then((list) => Array.isArray(list) && setCount(list.length));
            })
            .catch(() => {});
    }, []);
    return count;
}

export default function Footer() {
    const commits = useCommitCount();
    return (
        <footer className="footer">
            <Reveal className="footer-inner">
                <p className="eyebrow">Open to new roles</p>
                <h2 className="footer-title">
                    Let’s build something <em>people trust.</em>
                </h2>
                <a className="button button--primary" href={`mailto:${resume.email}`}>{resume.email}</a>
            </Reveal>
            <div className="footer-meta">
                <span>© {new Date().getFullYear()} Ronald Alunan · San Francisco</span>
                <span>Designed and built with React{commits ? ` · ${commits} commits` : ''}</span>
            </div>
        </footer>
    );
}
