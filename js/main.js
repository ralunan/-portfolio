import { PROJECTS, getProjectBySlug } from './projects.js';

const INTRO_HEADINGS = ['context', 'problem statement'];
const projectCache = new Map();

let currentScreenEl = null;
let transitioning = false;
let queued = false;

function imageAltFromFilename(filename) {
    const withoutExt = filename.replace(/\.[a-z0-9]+$/i, '');
    const withoutPrefix = withoutExt.replace(/^\d+_/, '');
    return withoutPrefix.replace(/[-_]+/g, ' ').trim();
}

// A body can optionally use "#Sub-heading" lines (single hash) to break its
// text into labeled sub-sections, distinct from the "## Heading" page markers.
const SUBHEADING_LINE_PATTERN = /^#(?!#)\s*(.+)$/;

function renderBlockBody(body) {
    const lines = body.split('\n');
    if (!lines.some((line) => SUBHEADING_LINE_PATTERN.test(line))) {
        return `<p>${escapeHtml(body)}</p>`;
    }

    const subsections = [];
    let current = null;
    lines.forEach((line) => {
        const match = line.match(SUBHEADING_LINE_PATTERN);
        if (match) {
            current = { heading: match[1].trim(), bodyLines: [] };
            subsections.push(current);
        } else if (current) {
            current.bodyLines.push(line);
        }
    });

    return subsections.map((section) => `
        <div class="project-page-subblock">
            <h3>${escapeHtml(section.heading)}</h3>
            <p>${escapeHtml(section.bodyLines.join('\n').trim())}</p>
        </div>
    `).join('');
}

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
    const cardsHtml = PROJECTS.map((project) => `
        <a class="project-card" href="#/projects/${project.slug}/1">
            <div class="project-card-title">${escapeHtml(project.title)}</div>
        </a>
    `).join('');
    const placeholderHtml = `
        <button type="button" class="project-card project-card--placeholder" data-action="open-add-project-modal" aria-label="More projects coming soon">
            <span class="project-card-plus">+</span>
        </button>
    `;
    list.innerHTML = cardsHtml + placeholderHtml;
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

    // A block with no body (e.g. a heading written for image-only pages) renders
    // no text at all — just the eyebrow and images, per context-website.txt's
    // "description headers above the images" pattern for content-free pages.
    const blocksHtml = page.blocks
        .filter((block) => block.body.trim().length > 0)
        .map((block) => `
            <div class="project-page-block">
                <h2>${escapeHtml(block.heading)}</h2>
                ${renderBlockBody(block.body)}
            </div>
        `).join('');

    // Each images[] entry is either a plain filename or { file, caption, column }
    // when it needs a title above it and/or belongs in the left text column
    // instead of the default right image column (e.g. splitting 2 images one
    // per column so both render at the same, even scale).
    const normalizedImages = (project.images || []).map((entry) =>
        typeof entry === 'string' ? { file: entry, caption: null, column: null } : entry);
    const pageImages = normalizedImages.filter((img) => img.file.startsWith(`${imagePrefix}_`));
    const rightImages = pageImages.filter((img) => img.column !== 'left');
    const leftImages = pageImages.filter((img) => img.column === 'left');
    // Filmstrip (floated thumbnail row) vs. stacked full-width is normally
    // decided by right-column image count, but a project can force it per page
    // via filmstripPages (e.g. 2 dense-text images that still want the small,
    // floated treatment rather than stacking full-width).
    const isFilmstrip = project.filmstripPages
        ? project.filmstripPages.includes(imagePrefix)
        : rightImages.length >= 3;
    // Whether images enlarge on click is an explicit per-page opt-in, since it
    // depends on content (dense text vs. illustration), not image count.
    const isEnlargeable = (project.enlargeablePages || []).includes(imagePrefix);
    // An image entry can set hint:true to explicitly claim the "click to
    // enlarge" hint. Otherwise it defaults to the middle image for a filmstrip
    // row, or the first uncaptioned image for a stacked page (so it doesn't
    // collide with a caption's title) — falling back to the first image.
    const hintTarget = pageImages.find((img) => img.hint) || (isFilmstrip
        ? rightImages[Math.floor(rightImages.length / 2)]
        : (pageImages.find((img) => !img.caption) || pageImages[0]));
    // Filmstrip items share the fixed 500px column they sit in, so their width
    // is computed from how many images share that column rather than a flat
    // cap — 2 images in a column get to be much bigger than 3 would. Left and
    // right columns are sized independently since their counts can differ.
    const FILMSTRIP_COLUMN_WIDTH = 500;
    const FILMSTRIP_GAP = 16;
    const filmstripWidth = (count) =>
        Math.floor((FILMSTRIP_COLUMN_WIDTH - FILMSTRIP_GAP * (count - 1)) / count);

    const imageItemHtml = (img) => `
        <div class="project-image-item"${img.width ? ` style="max-width: ${img.width}px"` : ''}>
            ${img === hintTarget && isEnlargeable ? `<div class="image-hint"><span>Click images to enlarge!</span></div>` : ''}
            ${img.caption ? `<div class="project-image-caption">${escapeHtml(img.caption)}</div>` : ''}
            <img class="project-page-image${isEnlargeable ? ' project-page-image--enlargeable' : ''}" src="${encodeURI(project.folder + img.file)}" alt="${escapeHtml(img.caption || imageAltFromFilename(img.file))}">
        </div>
    `;
    // Multiple images sharing a column float inline (top-aligned, right to
    // left) rather than stacking, same treatment either column uses.
    const imageColumnHtml = (images) => {
        if (!images.length) return '';
        const floats = isFilmstrip && images.length > 1;
        const style = floats ? ` style="--filmstrip-item-width: ${filmstripWidth(images.length)}px"` : '';
        return `<div class="project-page-images${floats ? ' project-page-images--filmstrip' : ''}"${style}>${images.map(imageItemHtml).join('')}</div>`;
    };
    const leftImagesHtml = imageColumnHtml(leftImages);
    const rightImagesHtml = rightImages.length
        ? imageColumnHtml(rightImages)
        : (leftImages.length ? '' : `<div class="project-image-placeholder">Supporting images (${imagePrefix}_x) go here</div>`);

    const backHref = pageIndex === 0 ? '#/projects' : `#/projects/${slug}/${pageIndex}`;

    container.innerHTML = `
        <div class="project-page-eyebrow">${escapeHtml(project.title)} &middot; Page ${pageIndex + 1} of ${totalPages}</div>
        <div class="project-page-grid">
            <div class="project-page-text">
                ${blocksHtml}
                ${leftImagesHtml}
            </div>
            ${rightImagesHtml}
        </div>
        <div class="project-page-actions-grid">
            <div class="project-page-back">
                <button type="button" data-action="back-page">Back</button>
            </div>
            <div class="project-page-actions">
                ${isLast
                    ? `<button type="button" data-action="back-to-projects">Back to Projects</button>`
                    : `<button type="button" data-action="next-page">Next</button>`}
            </div>
        </div>
    `;

    container.querySelectorAll('[data-action]').forEach((button) => {
        button.addEventListener('click', () => {
            if (button.dataset.action === 'back-page') {
                location.hash = backHref;
            } else {
                location.hash = isLast ? '#/projects' : `#/projects/${slug}/${pageIndex + 2}`;
            }
        });
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
        <div class="about-grid">
            <img class="about-photo" src="ron_profile2.jpg" alt="Portrait of Ronald Alunan">
            <div class="about-text-columns">
                ${paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('')}
            </div>
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

function setupLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-img');

    function open(src, alt) {
        lightboxImg.src = src;
        lightboxImg.alt = alt;
        lightbox.classList.add('lightbox--active');
    }

    function close() {
        lightbox.classList.remove('lightbox--active');
        lightboxImg.src = '';
    }

    document.getElementById('app').addEventListener('click', (event) => {
        const image = event.target.closest('.project-page-image--enlargeable');
        if (image) open(image.src, image.alt);
    });

    lightbox.addEventListener('click', (event) => {
        if (event.target === lightboxImg) return;
        close();
    });

    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') close();
    });
}

function setupAddProjectModal() {
    const modal = document.getElementById('add-project-modal');
    if (!modal) return;

    function open() {
        modal.classList.add('modal--active');
    }

    function close() {
        modal.classList.remove('modal--active');
    }

    document.getElementById('app').addEventListener('click', (event) => {
        if (event.target.closest('[data-action="open-add-project-modal"]')) open();
    });

    modal.addEventListener('click', (event) => {
        if (event.target === modal || event.target.closest('.modal-close') || event.target.closest('a')) close();
    });

    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') close();
    });
}

const THEME_STORAGE_KEY = 'theme';

function setupThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    function syncLabel() {
        toggle.textContent = document.body.dataset.theme === 'light' ? 'Dark Mode' : 'Light Mode';
    }

    syncLabel();

    toggle.addEventListener('click', () => {
        const isLight = document.body.dataset.theme === 'light';
        if (isLight) {
            delete document.body.dataset.theme;
            localStorage.removeItem(THEME_STORAGE_KEY);
        } else {
            document.body.dataset.theme = 'light';
            localStorage.setItem(THEME_STORAGE_KEY, 'light');
        }
        syncLabel();
    });
}

const GITHUB_REPO = 'ralunan/-portfolio';

async function updateCommitCounter() {
    const el = document.getElementById('commit-counter');
    if (!el) return;

    try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/commits?per_page=1`);
        if (!response.ok) throw new Error(`GitHub API error (${response.status})`);

        const link = response.headers.get('Link');
        let count;
        if (link) {
            const match = link.match(/[?&]page=(\d+)>;\s*rel="last"/);
            count = match ? parseInt(match[1], 10) : null;
        } else {
            count = (await response.json()).length;
        }

        el.textContent = count ? `Total Commits ${count}` : 'Total Commits —';
    } catch (err) {
        el.textContent = 'Total Commits —';
    }
}

setupLightbox();
setupAddProjectModal();
setupThemeToggle();
updateCommitCounter();
window.addEventListener('hashchange', handleRouteChange);
window.addEventListener('DOMContentLoaded', handleRouteChange);
