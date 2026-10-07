export const bio = [
  "Millions of people have read my work.",
  "I've written technical and creative content for, and alongside, students, founders, teachers, researchers, developers, lawyers, engineers, designers, policymakers, venture capitalists, marketers, support staff, experts, rookies, humans, AI, and everyone in between.",
  "I started as a field civil engineer, became a corporate trainer and technical writer, and have since led content at FIS, Shopify, GitHub, Carnegie Mellon, and more. That path is why I think in systems: I care less about any single page and more about the structures, processes, and products that make good content repeatable.",
];

// Drafted to frame you as a product & systems thinker. Edit freely.
export const principles = [
  { title: 'Structure before sentences', body: 'Good copy can\'t fix a broken model. I start with the taxonomy, the flow, and the decision the reader needs to make.' },
  { title: 'Write it once, use it everywhere', body: 'Guidelines, templates, and components let a team (and its AI tools) get it right without me in the room.' },
  { title: 'Content is a product surface', body: 'It has users, requirements, a roadmap, and metrics. I manage it that way.' },
  { title: 'Clarity is kindness', body: 'Especially in finance, civic tech, and developer tools, where confusion costs people something real.' },
];

export const experience = [
  { year: '2025–now', org: 'FIS (Fidelity Information Services)', roles: ['Content Strategy and UX Writing Lead, Design Systems'] },
  {
    year: '2023–2025',
    org: 'Freelance and contracts',
    roles: [
      'UX Writer and Translations Manager · New_ Public',
      'Content Strategist and Content Designer · The Browser Company',
      'Ghostwriting and Copywriting · HackerRank',
      'Content Designer and Product Manager · ProgramEquity',
    ],
  },
  { year: '2023', org: 'Doppler', roles: ['Founding Content Strategist and Technical Writer'] },
  { year: '2022', org: 'Shopify', roles: ['Content Design Lead, Developer Markets'] },
  { year: '2018–2021', org: 'GitHub', roles: ['Content Strategist and Editorial Manager → Product Manager, GitHub Sponsors'] },
  { year: '2017–2018', org: 'Plex', roles: ['Content and Translations Manager'] },
  { year: '2013–2017', org: 'Carnegie Mellon University, Computing Services', roles: ['Content, Communications, and Technical Documentation Manager'] },
  { year: '2007–2013', org: 'ARINC (Rockwell Collins)', roles: ['Associate Civil Engineer (Field) → Corporate Trainer and Technical Writer'] },
];

// Fun facts on the About page. Each one is a card with its own small pixel
// picture, matched by position: FACT_ART in src/pages.mjs holds one picture
// per fact, in the same order. To add a fact, add its sentence here (HTML links
// are fine) and draw a picture for it in FACT_ART (the comment there explains
// the letter-per-pixel format); without one, the cards reuse pictures from the
// start of the list. Three facts fill one row on desktop.
export const funFacts = [
  'I was one of the 100 employees at the <a href="https://www.inc.com/leila-sheridan/plex-tech-company-retreat-nightmare/91327481">disastrous $500k tropical company retreat</a> covered by Inc. and syndicated across Yahoo, BuzzFeed, MSN, and more.',
  'I argued about apartment security with an ex on Judge John Hodgman\'s podcast, in the <a href="https://maximumfun.org/episodes/judge-john-hodgman/judge-john-hodgman-episode-172-daily-security-beefing/">"Daily Security Beefing" episode (#172)</a>.',
  'I have two cats who know nothing of the internet.',
];

// "About this website" at the end of the About page: three short labeled intro
// columns, then one card per version of the site, oldest first, side by side.
// Each version has:
//   label  short tag shown small (add a date if you like, e.g. 'v2 · 2023')
//   name   the platform it was built on
//   body   a sentence or two on what changed
//   image  a screenshot of that version. Save it in /public/images/site/ and set
//          the path, e.g. image: '/images/site/v1-squarespace.png'. Wide
//          screenshots of the home page work best (about 1600 x 1000 px); the
//          frame shows the top-left of the image and trims the rest. Leave '' to show a placeholder.
//   alt    what the screenshot shows, for people using screen readers
//   tint   card color: peach | lilac | mint | sky | gold
export const siteStory = {
  heading: 'Built like the work it shows',
  // shown as three short labeled columns under the heading
  intro: [
    { label: 'What it is', text: 'My portfolio, and a working example of how I approach content: as a product, with real users, a clear structure, and a system behind it.' },
    { label: 'Who it’s for', text: 'Hiring managers, product and design leaders, and teams deciding whether I’m the right fit, plus anyone early in their career looking for a free resume or portfolio review.' },
    { label: 'What’s inside', text: 'Case studies that start with the question each project answered, the services I offer, how I work, and an archive of earlier projects.' },
  ],
  // Each version shows a short screen recording in its browser frame: set
  // `video` to the path without the extension; the site needs <video>.mp4,
  // <video>.webm, and <video>.jpg (the still shown before it plays) in
  // /public/videos/about/.
  // With no video, `image` is used; with neither, a placeholder shows.
  versions: [
    { label: 'v1', name: 'Squarespace', tint: 'peach', image: '', video: '/videos/about/v1-squarespace', alt: 'The Squarespace version of janeys.work', body: 'Where janeys.work began: a template-based site that held my case studies, services, and archive.' },
    { label: 'v2', name: 'Webflow', tint: 'lilac', image: '', video: '/videos/about/v2-webflow', alt: 'The Webflow version of janeys.work', body: 'A rebuild with more control over layout, structure, and the way the work was presented.' },
    { label: 'v3', name: 'Claude', tint: 'mint', image: '', video: '/videos/about/v3-claude', alt: 'This version of janeys.work, built with Claude', body: 'This version. I directed the content, design, and decisions in conversation with Claude, which wrote the code: a hand-built site on GitHub, published with Vercel, with original pixel art, light and dark modes, and accessibility checks along the way.' },
  ],
};
