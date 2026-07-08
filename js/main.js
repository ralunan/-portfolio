import { PROJECTS, getProjectBySlug } from './projects.js';

const INTRO_HEADINGS = ['context', 'problem statement'];
const projectCache = new Map();

let currentScreenEl = null;
let transitioning = false;
let queued = false;

function escapeHtml(str) {
    return str.replace(/[&<>"']/g, (ch) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[ch]));
}

function onAnimationEnd(el) {
    return new Promise((resolve) => {
        const handler = (event) => {
            if (event.target === el) {
                el.removeEventListener('animationend', handler);
                resolve();
            }
        };
        el.addEventListener('animationend', handler);
    });
}

// Splits "## Heading" formatted text into a leading preamble (any text
// before the first heading) plus an ordered list of {heading, body} sections.
function parseSectionedText(text) {
    const lines = text.split(/\r?\n/);
    const preambleLines = [];
    const sections = [];
    let current = null;

    for (const line of lines) {
        const match = line.match(/^##\s+(.+?)\s*$/);
        if (match) {
            current = { heading: match[1].trim(), bodyLines: [] };
            sections.push(current);
        } else if (current) {
            current.bodyLines.push(line);
        } else {
            preambleLines.push(line);
        }
    }

    return {
        preamble: preambleLines.join('\n').trim(),
        sections: sections.map((section) => ({
            heading: section.heading,
            body: section.bodyLines.join('\n').trim(),
        })),
    };
}

function buildProjectPages(sections) {
    const introBlocks = sections.filter((s) => INTRO_HEADINGS.includes(s.heading.toLowerCase()));
    const restBlocks = sections.filter((s) => !INTRO_HEADINGS.includes(s.heading.toLowerCase()));

    const pages = [];
    if (introBlocks.length) pages.push({ blocks: introBlocks });
    restBlocks.forEach((block) => pages.push({ blocks: [block] }));

    return pages;
}

async function loadProject(project) {
    if (projectCache.has(project.slug)) return projectCache.get(project.slug);
    const response = await fetch(project.folder + project.file);
    if (!response.ok) {
        throw new Error(`Failed to load ${project.file} (${response.status})`);
    }
    const text = await response.text();
    const { sections } = parseSectionedText(text);
    const parsed = { pages: buildProjectPages(sections) };
    projectCache.set(project.slug, parsed);
    return parsed;
}

const RESUME_PATH = 'resume.txt';
const RESUME_INTRO_HEADINGS = ['education', 'technical skills', 'extra curricular', 'freelance projects'];
let resumeCache = null;

async function loadResume() {
    if (resumeCache) return resumeCache;
    const response = await fetch(RESUME_PATH);
    if (!response.ok) {
        throw new Error(`Failed to load ${RESUME_PATH} (${response.status})`);
    }
    const text = await response.text();
    const { preamble, sections } = parseSectionedText(text);
    resumeCache = {
        preamble,
        introSections: sections.filter((s) => RESUME_INTRO_HEADINGS.includes(s.heading.toLowerCase())),
        experienceSections: sections.filter((s) => !RESUME_INTRO_HEADINGS.includes(s.heading.toLowerCase())),
    };
    return resumeCache;
}

const ABOUT_PATH = 'aboutme.txt';
let aboutCache = null;

async function loadAbout() {
    if (aboutCache) return aboutCache;
    const response = await fetch(ABOUT_PATH);
    if (!response.ok) {
        throw new Error(`Failed to load ${ABOUT_PATH} (${response.status})`);
    }
    const text = await response.text();
    aboutCache = text.trim().split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
    return aboutCache;
}

function parseHash() {
    const raw = location.hash.replace(/^#\/?/, '');
    const parts = raw.split('/').filter(Boolean);

    if (parts.length === 0) return { screen: 'home' };
    if (parts[0] === 'resume') return { screen: 'resume' };
    if (parts[0] === 'about') return { screen: 'about' };
    if (parts[0] === 'projects') {
        if (parts.length === 1) return { screen: 'projects' };
        return { screen: 'project', slug: parts[1], page: parseInt(parts[2], 10) || 1 };
    }
    return { screen: 'home' };
}

function renderProjectsIndex(screenEl) {
    const list = screenEl.querySelector('#projects-list');
    list.innerHTML = PROJECTS.map((project) => `
        <a class="project-card" href="#/projects/${project.slug}/1">
            <div class="project-card-title">${escapeHtml(project.title)}</div>
        </a>
    `).join('');
}

async function renderProjectDetail(screenEl, slug, pageParam) {
    const container = screenEl.querySelector('.screen-content');
    const project = getProjectBySlug(slug);

    if (!project) {
        container.innerHTML = `
            <h1 class="placeholder-heading">Project not found</h1>
            <p class="placeholder-note"><a href="#/projects" style="color:white;">Back to Projects</a></p>
        `;
        return;
    }

    let parsed;
    try {
        parsed = await loadProject(project);
    } catch (err) {
        container.innerHTML = `
            <h1 class="placeholder-heading">Couldn't load this project</h1>
            <p class="placeholder-note">${escapeHtml(err.message)}</p>
        `;
        return;
    }

    const totalPages = parsed.pages.length;
    const pageIndex = Math.min(Math.max(pageParam, 1), Math.max(totalPages, 1)) - 1;
    const page = parsed.pages[pageIndex];
    const isLast = pageIndex === totalPages - 1;
    const imagePrefix = pageIndex + 1;

    const blocksHtml = page.blocks.map((block) => `
        <div class="project-page-block">
            <h2>${escapeHtml(block.heading)}</h2>
            <p>${escapeHtml(block.body)}</p>
        </div>
    `).join('');

    container.innerHTML = `
        <div class="project-page-eyebrow">${escapeHtml(project.title)} &middot; Page ${pageIndex + 1} of ${totalPages}</div>
        ${blocksHtml}
        <div class="project-image-placeholder">Supporting images (${imagePrefix}_x) go here</div>
        <div class="project-page-actions">
            ${isLast
                ? `<button type="button" data-action="back-to-projects">Back to Projects</button>`
                : `<button type="button" data-action="next-page">Next</button>`}
        </div>
    `;

    container.querySelector('[data-action]').addEventListener('click', () => {
        location.hash = isLast ? '#/projects' : `#/projects/${slug}/${pageIndex + 2}`;
    });
}

// Matches job-title lines like "UX Design III - 7/21–5/26" or
// "Teamwork Assistant 9/19–Current" so they can be styled distinctly.
const JOB_TITLE_LINE_PATTERN = /\d{1,2}\/\d{2,4}\s*[-–—]\s*(\d{1,2}\/\d{2,4}|current)/i;

function formatSectionBody(body) {
    const lines = body.split('\n');
    const boldIndices = new Set();

    lines.forEach((line, i) => {
        if (!JOB_TITLE_LINE_PATTERN.test(line)) return;
        boldIndices.add(i);
        for (let j = i - 1; j >= 0; j -= 1) {
            if (lines[j].trim()) {
                boldIndices.add(j);
                break;
            }
        }
    });

    return lines
        .map((line, i) => {
            const escaped = escapeHtml(line);
            return boldIndices.has(i) ? `<strong class="resume-role-line">${escaped}</strong>` : escaped;
        })
        .join('\n');
}

function sectionBlockHtml(section) {
    const isContinuation = /\(cont\.?\)\s*$/i.test(section.heading);
    const blockClass = isContinuation ? 'resume-block resume-block--continued' : 'resume-block';
    const headingHtml = isContinuation ? '' : `<h2>${escapeHtml(section.heading)}</h2>`;
    return `
        <div class="${blockClass}">
            ${headingHtml}
            <p>${formatSectionBody(section.body)}</p>
        </div>
    `;
}

async function renderResume(screenEl) {
    const container = screenEl.querySelector('.screen-content');

    let resume;
    try {
        resume = await loadResume();
    } catch (err) {
        container.innerHTML = `
            <h1 class="placeholder-heading">Couldn't load resume</h1>
            <p class="placeholder-note">${escapeHtml(err.message)}</p>
        `;
        return;
    }

    const preambleLines = resume.preamble.split('\n').filter(Boolean);
    const introHtml = resume.introSections.map(sectionBlockHtml).join('');
    const experienceHtml = resume.experienceSections.map(sectionBlockHtml).join('');

    container.innerHTML = `
        <div class="resume-grid">
            <div class="resume-column resume-column--intro">
                <div class="resume-name-block">
                    ${preambleLines.map((line) => `<p>${escapeHtml(line)}</p>`).join('')}
                </div>
                ${introHtml}
            </div>
            <div class="resume-column resume-column--experience">
                ${experienceHtml}
            </div>
        </div>
    `;
}

async function renderAbout(screenEl) {
    const container = screenEl.querySelector('.screen-content');

    let paragraphs;
    try {
        paragraphs = await loadAbout();
    } catch (err) {
        container.innerHTML = `
            <h1 class="placeholder-heading">Couldn't load this page</h1>
            <p class="placeholder-note">${escapeHtml(err.message)}</p>
        `;
        return;
    }

    container.innerHTML = `
        <h1 class="about-heading">About Me</h1>
        <div class="about-columns">
            ${paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('')}
        </div>
    `;
}

async function showScreen(screenId, routeName, renderFn) {
    const nextEl = document.getElementById(screenId);

    if (currentScreenEl) {
        currentScreenEl.classList.remove('screen--active');
        currentScreenEl.classList.add('screen--exiting');
        await onAnimationEnd(currentScreenEl);
        currentScreenEl.classList.remove('screen--exiting');
    }

    if (renderFn) await renderFn(nextEl);

    document.body.dataset.route = routeName;
    nextEl.classList.add('screen--entering');
    await onAnimationEnd(nextEl);
    nextEl.classList.remove('screen--entering');
    nextEl.classList.add('screen--active');

    currentScreenEl = nextEl;
}

async function renderRoute() {
    const route = parseHash();

    switch (route.screen) {
        case 'home':
            await showScreen('screen-home', 'home');
            break;
        case 'resume':
            await showScreen('screen-resume', 'resume', renderResume);
            break;
        case 'about':
            await showScreen('screen-about', 'about', renderAbout);
            break;
        case 'projects':
            await showScreen('screen-projects', 'projects', renderProjectsIndex);
            break;
        case 'project':
            await showScreen('screen-project', 'project', (el) => renderProjectDetail(el, route.slug, route.page));
            break;
        default:
            await showScreen('screen-home', 'home');
    }
}

async function handleRouteChange() {
    if (transitioning) {
        queued = true;
        return;
    }
    transitioning = true;
    await renderRoute();
    transitioning = false;
    if (queued) {
        queued = false;
        handleRouteChange();
    }
}

window.addEventListener('hashchange', handleRouteChange);
window.addEventListener('DOMContentLoaded', handleRouteChange);
