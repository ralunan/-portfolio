// Registry of projects. Static hosting can't list directories, so each
// project is registered here with just its metadata — the actual written
// content is fetched live from `file` at render time, never duplicated here.
//
// `images` lists supporting image filenames for this project. Each filename
// is prefixed with the page number it belongs to (per context-website.txt's
// "1_x, 2_x" convention) so the renderer can group them by page automatically.
//
// `enlargeablePages` explicitly lists which page numbers get the
// click-to-enlarge treatment (cursor, lightbox, "click to enlarge" hint).
// This is separate from the filmstrip layout (which images float right
// into a thumbnail row) because whether an image benefits from zooming
// depends on its content (dense text vs. illustration), not how many images
// share the page — e.g. page 1's two images are cover art and don't need
// it, but page 3's two images are dense text screenshots that do.
//
// `filmstripPages` explicitly lists which page numbers use the floated
// thumbnail-row layout instead of stacking full-width. If omitted, this
// defaults to "3 or more images on the page" (see isFilmstripPage in
// js/main.js) — set it explicitly to opt a page into the filmstrip layout
// even with only 1-2 images, as with page 3 here.
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
        images: [
            '1_user-research-overview.svg',
            '1_walmart-reference.png',
            '2_Project1.png',
            '2_Project2.png',
            '2_Project (2).png',
            '3_Omichannel Experience.png',
            '3_Omichannel Experience (2).png',
            '4_UX analysis.png',
            '4_grouping.png',
        ],
        enlargeablePages: [2, 3, 4],
        filmstripPages: [2, 3],
    },
];

export function getProjectBySlug(slug) {
    return PROJECTS.find((project) => project.slug === slug);
}
