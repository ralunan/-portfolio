// Content stays in the plain-text files Ron edits directly (resume.txt,
// aboutme.txt, and one .txt per project). They're bundled at build time with
// Vite's `?raw` import and parsed here, so copy is never duplicated into JS.
import resumeText from '../resume.txt?raw';
import aboutText from '../aboutme.txt?raw';
import { PROJECTS } from './projects.js';

const projectTexts = import.meta.glob('/Projects/**/*.txt', { query: '?raw', import: 'default', eager: true });
const projectImages = import.meta.glob('/Projects/**/*.{png,jpg,jpeg,svg,webp,gif}', { query: '?url', import: 'default', eager: true });

// A line starting with "## " opens a section; everything until the next "## "
// is its body. Text before the first heading is the preamble.
export function parseSectionedText(text) {
    const lines = text.replace(/\r\n?/g, '\n').split('\n');
    const preamble = [];
    const sections = [];
    let current = null;
    for (const line of lines) {
        const match = line.match(/^##\s+(.*)$/);
        if (match) {
            current = { heading: match[1].trim(), body: [] };
            sections.push(current);
        } else if (current) {
            current.body.push(line);
        } else {
            preamble.push(line);
        }
    }
    return {
        preamble: preamble.join('\n').trim(),
        sections: sections.map((s) => ({ heading: s.heading, body: s.body.join('\n').trim() })),
    };
}

// Splits a section body into blocks: paragraphs, plus "#Sub-heading" groups
// (a single hash) that label a run of paragraphs.
export function parseBlocks(body) {
    const blocks = [];
    let sub = null;
    for (const chunk of body.split(/\n\s*\n/)) {
        const lines = chunk.split('\n').map((l) => l.trim()).filter(Boolean);
        if (!lines.length) continue;
        if (/^#[^#]/.test(lines[0])) {
            sub = { type: 'sub', title: lines[0].slice(1).trim(), paragraphs: [] };
            blocks.push(sub);
            if (lines.length > 1) sub.paragraphs.push(lines.slice(1).join(' '));
        } else if (sub) {
            sub.paragraphs.push(lines.join(' '));
        } else {
            blocks.push({ type: 'p', text: lines.join(' ') });
        }
    }
    return blocks;
}

function imageUrl(folder, file) {
    return projectImages[`/Projects/${folder}/${file}`];
}

// Page 1 is always Context + Problem statement; every other "##" section is
// its own chapter in file order. Images are matched to chapters by their
// "<page>_" filename prefix, same convention as v1.
function buildChapters(project) {
    const text = projectTexts[`/Projects/${project.folder}/${project.file}`] ?? '';
    const { sections } = parseSectionedText(text);
    const isIntro = (h) => /^(context|problem statement)$/i.test(h);
    const context = sections.find((s) => /^context$/i.test(s.heading));
    const problem = sections.find((s) => /^problem statement$/i.test(s.heading));
    const chapters = [
        { title: 'Context', body: context?.body ?? '', problem: problem?.body ?? '' },
        ...sections.filter((s) => !isIntro(s.heading)).map((s) => ({ title: s.heading, body: s.body })),
    ];
    return chapters.map((chapter, i) => {
        const page = i + 1;
        const images = project.images
            .map((entry) => (typeof entry === 'string' ? { file: entry } : entry))
            .filter((img) => img.file.startsWith(`${page}_`))
            .map((img) => ({ ...img, src: imageUrl(project.folder, img.file) }))
            .filter((img) => img.src);
        return {
            ...chapter,
            page,
            blocks: parseBlocks(chapter.body),
            problemBlocks: chapter.problem ? parseBlocks(chapter.problem) : [],
            images,
            layout: project.gridPages?.includes(page) ? 'grid' : 'stack',
        };
    });
}

export const projects = PROJECTS.map((project) => ({
    ...project,
    coverSrc: imageUrl(project.folder, project.cover),
    chapters: buildChapters(project),
}));

export function getProject(slug) {
    return projects.find((p) => p.slug === slug);
}

export const about = parseBlocks(aboutText);

// Resume: merges "Experience" and "Experience (cont.)" into one list and turns
// each blank-line-separated chunk into either a role header (short lines) or
// a description paragraph (one long line). A header's first line is the
// organization, its second the title and dates, and any further lines are
// description.
function buildResume() {
    const { preamble, sections } = parseSectionedText(resumeText);
    const [name, title, email] = preamble.split('\n').map((l) => l.trim()).filter(Boolean);
    const experience = [];
    const lists = [];
    for (const section of sections) {
        if (/^experience/i.test(section.heading)) {
            let role = null;
            for (const chunk of section.body.split(/\n\s*\n/)) {
                const lines = chunk.split('\n').map((l) => l.trim()).filter(Boolean);
                if (!lines.length) continue;
                const isDescription = lines.length === 1 && lines[0].length > 90;
                if (isDescription && role) {
                    role.points.push(lines[0]);
                } else {
                    role = { org: lines[0], role: lines[1] ?? '', points: lines.slice(2) };
                    experience.push(role);
                }
            }
        } else {
            lists.push({
                heading: section.heading,
                items: section.body.split('\n').map((l) => l.trim()).filter(Boolean),
            });
        }
    }
    return { name, title, email, experience, lists };
}

export const resume = buildResume();
