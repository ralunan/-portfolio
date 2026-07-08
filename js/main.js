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

function parseProjectText(text) {
    const lines = text.split(/\r?\n/);
    const sections = [];
    let current = null;

    for (const line of lines) {
        const match = line.match(/^##\s+(.+?)\s*$/);
        if (match) {
            current = { heading: match[1].trim(), bodyLines: [] };
            sections.push(current);
        } else if (current) {
            current.bodyLines.push(line);
        }
    }

    const cleaned = sections.map((section) => ({
        heading: section.heading,
        body: section.bodyLines.join('\n').trim(),
    }));

    const introBlocks = cleaned.filter((s) => INTRO_HEADINGS.includes(s.heading.toLowerCase()));
    const restBlocks = cleaned.filter((s) => !INTRO_HEADINGS.includes(s.heading.toLowerCase()));

    const pages = [];
    if (introBlocks.length) pages.push({ blocks: introBlocks });
    restBlocks.forEach((block) => pages.push({ blocks: [block] }));

    return { pages };
}

async function loadProject(project) {
    if (projectCache.has(project.slug)) return projectCache.get(project.slug);
    const response = await fetch(project.folder + project.file);
    if (!response.ok) {
        throw new Error(`Failed to load ${project.file} (${response.status})`);
    }
    const text = await response.text();
    const parsed = parseProjectText(text);
    projectCache.set(project.slug, parsed);
    return parsed;
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
            await showScreen('screen-resume', 'resume');
            break;
        case 'about':
            await showScreen('screen-about', 'about');
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
