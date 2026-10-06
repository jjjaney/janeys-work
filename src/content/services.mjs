// Service offerings, merged from the "Work with me" page on the Squarespace
// site (October 2026) with the newer content-systems and AI work. Edit freely.
// `id` is used for links (/services/#strategy), so keep it stable.
//
// ─── HOW TO ADD A SERVICE ──────────────────────────────────────────────────
// Each object below is one service. Its order here is its order everywhere:
// the home page "Ways we can work together" list, the Services page jump bar,
// the Services page color bands, and the Contact form's topic dropdown all
// read from this one list, so a new service shows up in all four at once.
//
// 1. Copy this template into the list below, where you want it to appear:
//
//   {
//     id: 'research',               // lowercase, no spaces; becomes /services/#research
//     short: 'Research',            // one word for the Services page jump bar
//     ask: 'Ask about research',    // optional: link text under the band
//                                   //   (leave out to get "Ask about <short> work")
//     pxSeed: 7,                    // optional: picks the pattern of the pixel run on
//                                   //   top of the band; try other numbers for a new look
//     tint: 'lilac',                // band color: peach | lilac | mint | gold | sky
//     name: 'Content Research and Testing',   // Title Case, serial comma, "and" not "&"
//     for: 'One line for the home page list, next to the name.',
//     body: 'A sentence or two for the Services page, under the name.',
//     deliverables: [               // the bullet list on the Services page
//       'First deliverable',
//       'Second deliverable',
//     ],
//   },
//
// 2. Pick a `tint` that differs from the services directly above and below
//    it, so neighboring bands don't run together. Only these five exist:
//    peach, lilac, mint, gold, sky. (A new tint needs a matching
//    `.svc-band--<tint>` rule in public/styles.css and an entry in BAND_PX
//    in src/pages.mjs.)
// 3. Deliverables: a list of 4 or 8 shows in 4 columns on desktop; any other
//    length shows in 3. Keep each item short (under about 45 characters) so
//    it fits on one line.
// 4. Update the two sentences that list every service by name:
//      - the first FAQ answer below ("There are five: ...")
//      - the Services page `description` in src/pages.mjs (servicesPage()),
//        which search engines show under the page title
// 5. The home page list colors its small squares by position (1st orange,
//    2nd lilac, 3rd green, 4th gold, 5th sky). A 6th service gets orange
//    unless you add a color for it; see ".svc-type > li:nth-child" in
//    public/styles.css.
// 6. Run `npm run build`, then check the home page, /services/, and the
//    Contact dropdown.
//
// To retire a service, delete its object and repeat steps 4 and 6. Links to
// its old /services/#id will still open the Services page, just at the top.

export const services = [
  {
    id: 'strategy',
    short: 'Strategy', // label in the Services page jump bar
    tint: 'peach', // band color on the Services page
    name: 'Content Strategy and Editorial',
    for: 'Teams whose content grew faster than its structure, or never had one.',
    body: 'I help establish how you want your audience to see your company: an audit of what exists, company-wide content guidelines, and an editorial plan your team can actually run.',
    deliverables: [
      'Content audit and inventory',
      'Grammar, terminology, and style audit',
      'Personas and audience actions',
      'User testing, analytics, and SEO (with AEO)',
      'Editorial calendar and guidelines',
      'Editing and editorial review',
      'Taxonomy and information architecture',
      'Governance and roadmap',
    ],
  },
  {
    id: 'design',
    short: 'Design', // label in the Services page jump bar
    pxSeed: 18, // picks the pattern of the pixel run atop this band; change the number for another look
    tint: 'lilac', // band color on the Services page
    name: 'Content Design, UX Writing, and Storytelling',
    for: 'Product and marketing teams shipping flows, pages, and launches that need to land.',
    body: 'From onboarding flows to landing pages and feature launches, I look at the whole experience and the outcome you want, then build the communication plan around it, with wireframes, milestones, and service level agreements.',
    deliverables: [
      'Audience audits and user journeys',
      'Flow and microcopy design',
      'Landing page layout and content ideation',
      'Narrative and editorial creation or review',
      'Scripts and storyboards (video, podcasts, learning)',
      'Ghostwriting and copywriting',
      'Content and page testing',
      'Localization-ready strings',
    ],
  },
  {
    id: 'systems',
    short: 'Teams', // label in the Services page jump bar
    ask: 'Ask about content for teams', // link text under the band (defaults to "Ask about <short> work")
    tint: 'mint', // band color on the Services page
    name: 'Content for Teams',
    for: 'Design systems and orgs that want consistency at scale, for people and AI.',
    body: 'Voice and tone, conventions, and component guidance, written so designers can use it and agents can learn from it.',
    deliverables: [
      'Voice and tone guide',
      'Content guidelines and conventions',
      'Component content docs',
      'Templates (email, blog, GitHub issues)',
      'AI-ready guidance, agents, and skills',
    ],
  },
  {
    id: 'docs',
    short: 'Docs', // label in the Services page jump bar
    tint: 'gold', // band color on the Services page
    name: 'Documentation and Training',
    for: 'Products whose users (or employees) keep asking the same questions.',
    body: 'Help centers, release notes, developer docs, manuals, and training materials, with templates and processes that keep them current.',
    deliverables: [
      'Help center and KB architecture',
      'Release-note systems',
      'Technical and developer docs',
      'Manuals and factory and site acceptance tests',
      'Training course materials',
      'Templates and publishing workflow',
    ],
  },
  {
    id: 'product',
    short: 'Product', // label in the Services page jump bar
    tint: 'sky', // band color on the Services page
    name: 'Product Management and Marketing',
    for: 'Content-heavy products and launches that need someone who speaks both languages.',
    body: 'I scope, prioritize, and ship where content is the product, then take it to market: product and communication plans, campaigns, events, and the docs behind them.',
    deliverables: [
      'Discovery, requirements, and roadmaps',
      'Product and communication plans',
      'Go-to-market and launch campaigns',
      'Email and social campaigns (LinkedIn, Reddit, X, Instagram, Facebook)',
      'Partner articles and thought leadership',
      'Newsletters',
      'Hackathon and event coverage',
      'Datasheets, e-books, and brochures',
    ],
  },
];

// Shown under the page heading on the Services page
export const disciplineLine = ['Content strategy', 'Content design', 'UX writing', 'Copywriting', 'Technical writing', 'Content management', 'Product management'];

// The free review offer for early- to mid-career people
export const freeReview = [
  'Resume and cover letter feedback (Google Docs or Figma)',
  'Portfolio and case-study review (Figma)',
  'Interview support and guidance',
];

export const engagement = [
  {
    name: 'Embedded',
    note: 'Preferred',
    body: 'Full-time or long-term, on a content-forward team. I learn the product\'s history and grow with its narrative and language, which produces the best content.',
  },
  {
    name: 'Contract',
    note: 'Scoped',
    body: 'A defined project with clear deliverables and timeline, such as an audit, a guideline set, or a docs overhaul.',
  },
  {
    name: 'Freelance',
    note: 'Flexible',
    body: 'Hourly or fixed-price work for articles, case studies, white papers, and technical deep-dives.',
  },
];

// The first answer lists every service by name. Update it when services
// change (names in lowercase, separated by semicolons since some contain commas).
export const faqs = [
  {
    q: 'What are your content services, and how do I learn more?',
    a: 'There are five: content strategy and editorial; content design, UX writing, and storytelling; content for teams; documentation and training; and product management and marketing. Each is listed above with what you get. To learn more, use the "Ask about" link under any service or send a message, and we\'ll set up a call.',
  },
  {
    q: 'How much do content services cost?',
    a: 'I work with hourly rates or fixed project pricing, depending on scope. Lifestyle-oriented pieces like tips or FAQs sit at the lower end of my range. Case studies, white papers, and technical deep-dives sit at the upper end. Timing depends on subject matter and where the piece will be published, such as LinkedIn, a company newsletter, an internal knowledge base, or a guest blog.',
  },
  {
    q: 'Do you prefer contracts, freelance, or full-time work?',
    a: 'I prefer full-time, embedded work on a content-forward team. That said, contract and freelance work keep my craft growing, and I have no preference between the two.',
  },
  {
    q: 'Do you offer anything for early- to mid-career people?',
    a: "Yes! I'll review your resume, CV, portfolio, or case studies for general content feedback or from a hiring manager's perspective, for free. There's no catch. My availability after work hours varies, so please be patient.",
  },
  {
    q: 'How do we get started?',
    a: "Send a message through the contact page with a little about the work. We'll set up a call to sort out the details.",
  },
];
