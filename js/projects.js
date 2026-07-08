// Registry of projects. Static hosting can't list directories, so each
// project is registered here with just its metadata — the actual written
// content is fetched live from `file` at render time, never duplicated here.
//
// To add a future project: drop a new folder under Projects/ containing a
// "## Heading" formatted text file, then add one entry below.
export const PROJECTS = [
    {
        slug: 'ux-research',
        title: 'UX Research',
        folder: 'Projects/UX Research/',
        file: 'Context-research.txt',
    },
];

export function getProjectBySlug(slug) {
    return PROJECTS.find((project) => project.slug === slug);
}
