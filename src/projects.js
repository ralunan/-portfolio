// Project registry. Static hosting can't list directories, so each project is
// registered here with metadata only. The written case study is read from
// `Projects/<folder>/<file>` (see src/content.js).
//
// `images`: plain filenames or { file, caption }. Each filename starts with
// the chapter number it belongs to ("1_x", "2_x"), where chapter 1 is
// Context + Problem statement and each following "##" section is the next.
// `gridPages`: chapters whose images are tall/portrait and sit side by side
// instead of stacking full width.
// `cover`: the image used on the home page card and the case study hero.
//
// To add a project: add a folder under Projects/ with a "## Heading" text
// file and numbered images, then add one entry below.
export const PROJECTS = [
    {
        slug: 'ux-research',
        title: 'Building UX Research at Walmart International',
        shortTitle: 'Building UX Research',
        tagline: 'Creating the first structured customer-insight practice for Walmart’s Canada and Mexico markets, and turning it into roadmap decisions.',
        folder: 'UX Research',
        file: 'Context-research.txt',
        cover: '1_user-research-overview.svg',
        accent: '#9bb29e',
        tags: ['Research', 'Strategy', 'Cross-market'],
        meta: [
            ['Role', 'Initiated and led the research'],
            ['Markets', 'Canada, Mexico'],
            ['Timeline', '2–3 months'],
            ['Partners', 'Data science, Product, Design'],
        ],
        outcomes: [
            'Insights shaped the Canada and Mexico product roadmaps',
            'Helped make the marketplace experience a core Y24 goal',
            'Led to a dedicated UX Research department for the international org',
        ],
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
        gridPages: [2, 3],
    },
    {
        slug: 'cashi',
        title: 'Connecting Cashi to Walmart Checkout',
        shortTitle: 'Cashi × Walmart',
        tagline: 'Helping customers in Mexico link their Cashi digital wallet to Walmart, so a line of credit shows up right where they pay.',
        folder: 'Cashi',
        file: 'context-cashi.txt',
        cover: '1_cashi.png',
        accent: '#5b5f8d',
        tags: ['Fintech', 'Checkout', 'Design systems'],
        meta: [
            ['Role', 'Product designer, Phase 2'],
            ['Market', 'Mexico'],
            ['Platforms', 'Mobile web, desktop web, app'],
            ['Partners', 'Cashi teams, Accessibility, Content, Product'],
        ],
        outcomes: [
            'Mapped every connect touchpoint across each account state',
            'Reused the existing Cashi component library to save development time',
            'Gave stakeholders one traceable source of truth in Figma',
        ],
        images: [
            '1_cashi.png',
            { file: '2_cashi.png', caption: 'Phase 1 components' },
            { file: '2_cashi2.png', caption: 'Phase 2 components' },
            '3_cashi.png',
            '4_Cashi.png',
        ],
    },
    {
        slug: 'fashion',
        title: 'Fashion Visual Explorations',
        shortTitle: 'Walmart Fashion',
        tagline: 'Using AI-assisted prototyping to explore dozens of new visual directions for Walmart’s US Fashion team.',
        folder: 'Fashion',
        file: 'fashion-context.txt',
        cover: '1_fashion-entrypoint.png',
        accent: '#da6b51',
        tags: ['AI prototyping', 'Visual design', 'Concepting'],
        meta: [
            ['Role', 'Product designer'],
            ['Team', 'US Fashion'],
            ['Surfaces', 'Item tiles, accounts, AI search, carousels'],
            ['Tools', 'Claude, Framer, Figma'],
        ],
        outcomes: [
            'Explored many directions per surface instead of one at a time',
            'Pushed Walmart’s visual language into new territory for fashion',
            'Shared concepts with the team as potential paths forward',
        ],
        images: [
            '1_fashion-entrypoint.png',
            '1_fashion-entrypoint1.png',
            { file: '2_fashion-tiles.png', caption: 'Item tile layout exploration' },
            { file: '2_fashion-tiles2.png', caption: 'Item tile CTA placement testing' },
            { file: '3_accounts.png', caption: 'Fashion profile: loading states' },
            { file: '3_accounts1.png', caption: 'Fashion profile: existing flow audit' },
            { file: '3_accounts2.png', caption: 'Fashion profile: push notification concept' },
            { file: '3_accounts3.png', caption: 'Fashion profile: style quiz concept' },
            '4_fashion.png',
            '4_fashion1.png',
            '4_fashion2.png',
            '5_fashion2.png',
            '5_fashion1.png',
        ],
        gridPages: [1, 2, 3],
    },
];
