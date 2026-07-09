// Registry of projects. Static hosting can't list directories, so each
// project is registered here with just its metadata — the actual written
// content is fetched live from `file` at render time, never duplicated here.
//
// `images` lists supporting images for this project. Each entry is either a
// plain filename, or an object with any of: `caption` (title rendered above
// the image), `column: 'left'` (renders in the text column instead of the
// default right image column), `width` (caps the image at N px instead of
// the default 500, e.g. to fit several stacked images without scrolling),
// `hint: true` (explicitly claims the "click to enlarge" hint). Filenames
// are prefixed with the page number they belong to (per context-website.txt's
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
        title: 'Building UX Research at Walmart International',
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
    {
        slug: 'cashi',
        title: 'Connecting Cashi to Walmart Checkout',
        folder: 'Projects/Cashi/',
        file: 'context-cashi.txt',
        images: [
            '1_cashi.png',
            { file: '2_cashi.png', caption: 'Phase 1 Components' },
            { file: '2_cashi2.png', caption: 'Phase 2 Components' },
            '3_cashi.png',
            '4_Cashi.png',
        ],
        // All Cashi images are wide, dense Figma flow/redline boards (no
        // portrait screenshots), so every page stacks full-width by default
        // (no filmstripPages needed) but every page benefits from zoom.
        enlargeablePages: [1, 2, 3, 4],
    },
    {
        slug: 'fashion',
        title: 'Fashion Visual Explorations',
        folder: 'Projects/Fashion/',
        file: 'fashion-context.txt',
        images: [
            '1_fashion-entrypoint.png',
            '1_fashion-entrypoint1.png',
            { file: '2_fashion-tiles.png', caption: 'Item Tile Layout Exploration', column: 'left' },
            { file: '2_fashion-tiles2.png', caption: 'Item Tile CTA Placement Testing', hint: true },
            { file: '3_accounts.png', caption: 'Fashion Profile — Loading States', column: 'left', width: 260 },
            { file: '3_accounts1.png', caption: 'Fashion Profile — Existing Flow Audit', column: 'left', width: 260 },
            { file: '3_accounts2.png', caption: 'Fashion Profile — Push Notification Concept', width: 260 },
            { file: '3_accounts3.png', caption: 'Fashion Profile — Style Quiz Concept', width: 260 },
            '4_fashion.png',
            '4_fashion1.png',
            '4_fashion2.png',
            '5_fashion2.png',
            '5_fashion1.png',
        ],
        // Pages 1 and 3 use portrait/mobile-screen boards that float side by
        // side in each column instead of stacking. Every other page is a wide,
        // dense Figma board (flow diagrams, redlines, concept decks) that reads
        // better stacked full-width, even where a page has 3+ images.
        filmstripPages: [1, 3],
        enlargeablePages: [1, 2, 3, 4, 5],
    },
];

export function getProjectBySlug(slug) {
    return PROJECTS.find((project) => project.slug === slug);
}
