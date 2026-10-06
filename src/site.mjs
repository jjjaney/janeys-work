// Global site settings. Edit these first.
export const site = {
  name: 'Janey Annis',
  // Used for canonical URLs, Open Graph tags and the sitemap.
  url: 'https://www.janeys.work',
  role: 'Human-first content for products and systems',
  description:
    'Janey Annis creates human-first content for products and systems: content strategy, content design, content management, documentation, and product management.',
  linkedin: 'https://www.linkedin.com/in/janeyannis/',
  github: 'https://github.com/jjjaney',

  // TODO(Janey): add a public email if you want one shown. Leave '' to hide it.
  email: '',

  // Formspree form that receives the contact form (https://formspree.io/f/<id>).
  // Leave '' to show a placeholder that points visitors to LinkedIn instead.
  formspreeId: 'maeqwgek',

  // TODO(Janey): optional booking link (Calendly, Cal.com, SavvyCal…).
  bookingUrl: '',

  // TODO(Janey): optional Ko-fi link for the free review offer.
  kofiUrl: '',

  // Placeholder notes ("TODO" boxes) are visible on the site so you can find
  // what still needs content. Set HIDE_TODOS=1 in Vercel's environment
  // variables to hide them on the live site.
  showTodos: process.env.HIDE_TODOS !== '1',
};

export const nav = [
  { href: '/work/', label: 'Work' },
  { href: '/services/', label: 'Services' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' },
];

export const disciplines = [
  'Content strategy',
  'Content design',
  'Content management',
  'Documentation',
  'Product management',
  'UX writing',
  'Technical writing',
  'Localization',
  'Content for AI and agents',
];

export const companies = [
  { name: 'FIS', url: 'https://www.fisglobal.com' },
  { name: 'Shopify', url: 'https://www.shopify.com' },
  { name: 'GitHub', url: 'https://github.com' },
  { name: 'The Browser Company', url: 'https://thebrowser.company' },
  { name: 'Carnegie Mellon', url: 'https://www.cmu.edu' },
  { name: 'Doppler', url: 'https://www.doppler.com' },
  { name: 'Plex', url: 'https://www.plex.tv' },
  { name: 'New_ Public', url: 'https://newpublic.org' },
  { name: 'HackerRank', url: 'https://www.hackerrank.com' },
  // Rockwell Collins is now Collins Aerospace, part of RTX
  { name: 'Rockwell Collins', url: 'https://www.rtx.com/collinsaerospace' },
];

// Kind words: the quotes on the home page. Each quote is a note card on the
// "wall"; the company name (or logo) sits under it.
// TODO(Janey): save each official logo (SVG or PNG from the company's press or
// brand page) in /public/images/logos/ and set `logo` to its path, for example
// logo: '/images/logos/fis.svg'. If the logo is dark and disappears in dark
// mode, add a light version as `logoDark`. Until then the company name shows.
//
// ─── HOW TO ADD A QUOTE ────────────────────────────────────────────────────
// Copy this template into the list below. Order here = order on the page.
//
//   {
//     quote: 'The words exactly as they were said, without quote marks.',
//     context: 'What we worked on together',      // shown small, after the team
//     org: 'Company, Team',          // company first; anything after it shows
//                                    // as the team (leave just 'Company' if none)
//     company: 'Company',            // shown in purple until a logo is added
//     logo: '',                      // e.g. '/images/logos/company.svg'
//     logoDark: '',                  // optional light version for dark mode
//   },
//
// Layout: the wall shows three notes per row on desktop (one column on
// phones), and the look repeats every three: 1st lilac and largest type,
// 2nd green and set lower, 3rd gold. So 3 or 6 quotes fill whole rows;
// 4 or 5 leave a partly filled second row, which still looks fine.
// Short quotes (one or two sentences) read best; very long ones make their
// card much taller than its neighbors.
//
// Each card also gets a small cluster of corner pixels; those repeat every
// three cards too (KIND_PIXELS in src/pages.mjs). Run `npm run build` and check
// the home page in light and dark mode after adding a quote.
export const testimonials = [
  {
    quote: 'You elevate any content that you touch.',
    context: 'Content strategy and UX writing',
    org: 'FIS, Design Systems',
    company: 'FIS',
    logo: '',
    logoDark: '',
  },
  {
    quote: 'You are a master at your craft.',
    context: 'Storytelling and member content',
    org: 'The Browser Company',
    company: 'The Browser Company',
    logo: '',
    logoDark: '',
  },
  {
    quote:
      "You're totally rocking it, and I'm so glad to have your copy/linguistic expertise on the project!!",
    context: 'UX writing, translations, and localization',
    org: 'New_ Public, Public Spaces Incubator',
    company: 'New_ Public',
    logo: '',
    logoDark: '',
  },
];
