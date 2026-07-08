// Registry of projects. Static hosting can't list directories, so each
// project is registered here with just its metadata — the actual written
// content is fetched live from `file` at render time, never duplicated here.
//
// `images` lists supporting image filenames for this project. Each filename
// is prefixed with the page number it belongs to (per context-website.txt's
// "1_x, 2_x" convention) so the renderer can group them by page automatically.
//
// To add a future project: drop a new folder under Projects/ containing a
// "## Heading" formatted text file plus any "<page>_name.ext" images, then
// add one entry below.
export const PROJECTS = [
    {
        slug: 'ux-research',
        title: 'UX Research',
        folder: 'Projects/UX Research/',
        file: 'Context-research.txt',
        images: ['1_user-research-overview.svg', '1_walmart-reference.png'],
    },
];

export function getProjectBySlug(slug) {
    return PROJECTS.find((project) => project.slug === slug);
}
