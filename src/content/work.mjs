// Case studies. Order here = order on the site.
//
// Each case study has:
//   slug        URL: /work/<slug>/
//   hook        the question the project answered (leads the home-page card)
//   teaser      a short outcome or fact shown on the card
//   hue         card color: lilac | peach | gold | sky | mint
//   badge       three colors for the small pixel mark on the card in dark mode
//               (the bright palette colors, which all keep 3:1 on the dark cards)
//   badgeLight  the same mark in light mode: darker theme colors that keep at
//               least 3:1 contrast on the card (purple, green, maroon, red)
//   art         pixel composition shown on cards and the case-study header
//   meta        client / role / timeframe / disciplines
//   summary     one or two sentences for cards and the page intro
//   context     the problem, as HTML paragraphs
//   highlights  the work itself; each can have an `image` (put files in
//               /public/images/work/<slug>/ and set `src`)
//   outcomes    results; `todo` entries render as placeholder prompts
//   links       public links to the shipped work
//   cover       the lead screenshot shown at the top of the case study
//               (currently loaded from your Squarespace site; see README)
//
// Text marked TODO renders as a visible placeholder note on the site.
//
// ─── HOW TO ADD A CASE STUDY ───────────────────────────────────────────────
// 1. Copy a whole existing object below (from `{` to its matching `},`) and
//    paste it where it should appear. The first one is the large featured
//    card on the home page; the rest fill the grid after it in order.
// 2. Give it a new `slug` (lowercase-with-dashes); its page becomes
//    /work/<slug>/ and is built automatically, with Previous/Next links.
// 3. Pick a `hue` that differs from its neighbors in the grid. The hue also
//    sets the color of the closing call-to-action band on its page (see
//    CARD_TONE in src/pages.mjs: lilac -> lilac, peach -> orange,
//    gold -> green, sky -> sky, mint -> mint).
// 4. Pick an `art` composition from src/art/ (pixel-composition-12 to -16).
//    Reusing one is fine; avoid giving neighbors the same one.
// 5. Copy `badge` and `badgeLight` from another case study with the same hue,
//    so the card's question-mark pixels keep their contrast.
// 6. Put screenshots in /public/images/work/<slug>/ and point `src` at them.
// 7. If the project produced a headline number, consider adding it to the
//    "Some cool results" strip (RESULTS in src/pages.mjs).
// 8. Run `npm run build` and check the home page grid, /work/, and the new
//    case-study page.

export const work = [
  {
    slug: 'fis-design-systems-ai',
    cover: {
      src: 'https://images.squarespace-cdn.com/content/v1/6a3af2e47a006d51d924c9da/15f721b0-fc0e-413b-8b43-da142c3200b7/unify-design-content-docs.png?format=2500w',
      alt: "Pages from the Unify Design System's 'Conventions and formats' guidance, covering date and time formats, intervals, and best practices.",
      caption: "Content for design systems and agentic workflows: \"Conventions and formats\" pages in the Unify Design System docsite.",
    },
    hook: "How do you write guidance that both designers and AI agents can follow?",
    teaser: "Docs + a review agent",
    hue: 'lilac',
    badge: ['#cfa2ed', '#7fd6b3', '#ff7b4d'],
    badgeLight: ['#4f33cc', '#0b704f', '#cc3333'],
    art: 'pixel-composition-12',
    client: 'FIS × Anthropic',
    cardTitle: 'Content foundations for a design system and the AI agents that use it',
    title: 'Content foundations for a design system, built for humans and agents',
    role: 'Content Strategy and UX Writing Lead, Design Systems',
    timeframe: 'Current',
    disciplines: ['Content strategy', 'Content design', 'Documentation', 'Content for AI'],
    summary:
      'Creating the content foundations and processes behind the Unify Design System at a global FinTech, so product designers ship human-first experiences while AI and agentic workflows use the same guidance.',
    context: `
      <p>Content for design systems and agentic workflows. FIS's design department supports product designers across a global financial-technology organization. Through a partnership with Anthropic, the team also builds white-label and bespoke services for other financial institutions, so the design system's guidance has two audiences: the people designing products and the AI tools helping them.</p>
      <p>Content guidance was scattered or missing, which meant every team solved the same writing problems differently, and an AI assistant had nothing reliable to draw on.</p>
    `,
    highlights: [
      {
        title: 'Content pages for the Unify Design System',
        body: 'Based on departmental and cross-functional interviews, surveys, and content audits, I authored and published documentation that meets the organization where it is: conventions and formats for dates, times, phone numbers, and more.',
        image: { src: '', alt: 'Pages from the "Conventions and formats" guidance in the Unify Design System docsite' },
      },
      {
        title: 'Focused, component-level guidance',
        body: 'Docsite pages go deep on the moments that matter most in financial products, such as form UX: helper text, placeholders, and error messaging.',
        image: { src: '', alt: 'Form messaging guidance page with sidebar navigation' },
      },
      {
        title: 'A Copilot agent for UX writing review',
        body: 'I built a chat agent that reviews UX copy and suggests improvements. It uses specific output instructions and treats the Unify docsite as its knowledge base, so the guidance and the tool stay in sync.',
        image: { src: '', alt: 'UX writing review agent giving feedback on navigation labels' },
      },
      {
        title: 'Creating and testing skills',
        body: 'I use Claude, Copilot, Figma MCP, and Storybook to prototype AI-powered experiences, including first-draft content reviews that designers can run before a human review.',
        image: null,
      },
    ],
    outcomes: [
      { todo: 'Add 2–3 outcomes, e.g. number of docsite pages published, designers or teams supported, review time saved by the agent, adoption of the guidance.' },
    ],
    links: [],
    todos: [
      'The lead screenshot loads from your Squarespace site. Before you cancel Squarespace, save it into /public/images/work/fis-design-systems-ai/ and update cover.src.',
      'Confirm what you can share publicly about the FIS × Anthropic partnership and the agent.',
      'Add the gallery screenshots from your current Case Studies page (Unify docs pages, form messaging guidance, the Copilot review agent) to /public/images/work/fis-design-systems-ai/.',
    ],
  },
  {
    slug: 'browser-company-member-content',
    cover: {
      src: 'https://images.squarespace-cdn.com/content/v1/6a3af2e47a006d51d924c9da/51cfb97c-ef48-4b3a-92af-d4c3c12e3f08/windows-fixes.png?format=2500w',
      alt: "The Arc for Windows 2023/2024 release notes page, with a search bar, a Download Arc button, and a list of release dates.",
      caption: "Editorial and member content: Arc for Windows release notes, part of the weekly release-notes system.",
    },
    hook: "How do you talk to half a million people every week without a playbook?",
    teaser: "500k+ members, weekly",
    hue: 'peach',
    badge: ['#ff7b4d', '#cfa2ed', '#7fd6b3'],
    badgeLight: ['#cc3333', '#4f33cc', '#0b704f'],
    art: 'pixel-composition-14',
    client: 'The Browser Company',
    cardTitle: 'Newsletters, release notes, and help-center processes for 500k+ Arc members',
    title: 'Turning "word of mouth" into a repeatable member-communications system',
    role: 'Content Strategist and Content Designer',
    timeframe: 'Contract',
    disciplines: ['Content management', 'Content operations', 'Editorial', 'Release notes'],
    summary:
      'Designing the templates, guidelines, and workflow behind weekly member updates and visual release notes for over 500,000 Arc Browser users across macOS, iOS, and Windows.',
    context: `
      <p>The Browser Company of New York (BCNY) is a startup <a href="https://www.theverge.com/2022/10/31/23428862/arc-browser-web-company-darin-fisher">developing browsers that streamline tedious tasks and incorporate AI</a>. Its mobile app, Arc Search, features an AI-driven search that compiles results from several sources instead of ranking pages by SEO, like Google Search does.</p>
      <p>When I joined, the team was focused on shipping its latest browser. Member communications and editorial review relied on whoever had time, and the audience had grown past half a million people.</p>
    `,
    highlights: [
      {
        title: 'Scalable processes in place of word of mouth',
        body: 'I designed and implemented templates and guidelines for member communications, including weekly update emails and visual release notes, so updates could ship on a predictable cadence.',
        image: { src: '', alt: 'Release Notes index for Arc on macOS, iOS, and Windows' },
      },
      {
        title: 'Easel: a visual release-notes template',
        body: 'I created the process and template for visual release notes and drafted, staged, and published them weekly across iOS, macOS, and Windows.',
        image: { src: '', alt: 'Visual release notes built in Arc Easel' },
      },
      {
        title: 'Staging media for every medium',
        body: 'Updates included visuals like GIFs. I staged simple, focused gestures so readers could see a feature without distraction.',
        image: { src: '', alt: 'Staged iPhone mockup used for a feature GIF' },
      },
      {
        title: 'Help center, AI chatbot macros, and ghostwriting',
        body: 'I reviewed and refined templates and macros for the Resource Center AI chatbot (Archie), and collaborated on blog posts and marketing pages, including the Arc Search landing page and the Arc Search Hidden Features post.',
        image: null,
      },
    ],
    outcomes: [
      { stat: '500k+', label: 'members reached by weekly updates' },
      { stat: '3', label: 'platforms covered by one release-notes process' },
      { todo: 'Add another outcome if you have one, e.g. open rates, time to publish, or support tickets deflected by help-center content.' },
    ],
    links: [
      { label: 'Arc release notes', href: 'https://resources.arc.net/hc/en-us/articles/20498285812375-Release-Notes' },
      { label: 'Visual release notes v1.58', href: 'https://arc.net/e/123493AC-A3B7-470F-BC09-DC700B348B59' },
      { label: 'Visual release notes v1.59', href: 'https://arc.net/e/EDB179D6-AD89-4998-8BF6-5E2FD8D94F57' },
      { label: 'Arc Resource Center', href: 'https://resources.arc.net/hc/en-us' },
      { label: 'Arc Search landing page', href: 'https://arc.net/search' },
      { label: 'Arc Search Hidden Features', href: 'https://arc.net/blog/arc-search-hidden-features' },
    ],
    todos: [
      'The lead screenshot loads from your Squarespace site. Before you cancel Squarespace, save it into /public/images/work/browser-company-member-content/ and update cover.src.',
      'Confirm the timeframe (year range) for this contract.',
    ],
  },
  {
    slug: 'github-sponsors',
    cover: {
      src: 'https://images.squarespace-cdn.com/content/v1/6a3af2e47a006d51d924c9da/a200d2dd-fc65-480d-b889-cbb69c050c67/github+sponsors+and+stripe.png?format=2500w',
      alt: "GitHub's Mona the Octocat holding a pink heart next to the Stripe wordmark, surrounded by confetti.",
      caption: "Service overhaul and content design for GitHub Sponsors, which pays out to open source maintainers through Stripe.",
    },
    hook: "How do you grow a program that has outgrown its own front door?",
    teaser: "Launched in 2 new countries",
    hue: 'gold',
    badge: ['#c99f43', '#ffab94', '#b6d8fe'],
    badgeLight: ['#6b2337', '#0b704f', '#4f33cc'],
    art: 'pixel-composition-15',
    client: 'GitHub',
    cardTitle: 'GitHub Sponsors content and sign-up flow refresh',
    title: 'Refreshing GitHub Sponsors: from growing pains to an expanded program',
    role: 'Product Manager and Content Designer',
    timeframe: '2020',
    disciplines: ['Product management', 'Content design', 'UX writing'],
    summary:
      'Leading the refresh of GitHub Sponsors, the program that lets people and companies financially support open source, to serve both developers and enterprise sponsors and reduce churn.',
    context: `
      <p>GitHub Sponsors lets anyone financially support open source work directly on GitHub.com. Think Patreon for open source developers.</p>
      <p>After the program's initial success, it hit growing pains. The service page was outdated and had to speak to both peer contributors and enterprise-level sponsors. At the same time, the sign-up experience needed to be smoother, better informed, and legally compliant to reduce churn.</p>
    `,
    highlights: [
      {
        title: 'Landing page refresh',
        body: 'I reworked the service page so contributors and enterprise sponsors could each find their path, with clearer value propositions and calls to action.',
        image: { src: '', alt: 'Before and after comparison of the GitHub Sponsors landing page' },
      },
      {
        title: 'Overhauling the waitlist',
        body: 'I redesigned the waitlist and onboarding content so applicants understood requirements before they started.',
        image: { src: '', alt: 'GitHub Sponsors waitlist flow' },
      },
      {
        title: 'Expanding the program: Malta and Cyprus',
        body: 'I shipped the program expansion to new regions and announced it on the GitHub Blog, my debut as an author after years of editing the blog.',
        image: null,
      },
      {
        title: 'Actions, collaborators, and hurdles',
        body: 'I worked across legal, payments (Stripe), design, and engineering to balance compliance requirements with a welcoming experience.',
        image: null,
      },
    ],
    outcomes: [
      { todo: 'Add results from your "Successes, questions, and takeaways" slide, e.g. waitlist time, churn, sponsors onboarded, or regions added.' },
    ],
    links: [
      { label: 'Welcome Malta and Cyprus to GitHub Sponsors', href: 'https://github.blog/2020-07-28-welcome-malta-and-cyprus-to-github-sponsors-plus-updates/' },
    ],
    todos: [
      'The lead screenshot loads from your Squarespace site. Before you cancel Squarespace, save it into /public/images/work/github-sponsors/ and update cover.src.',
      'Check the "Overhauling the waitlist" and "Actions, collaborators, and hurdles" descriptions. The current site only has headings for these, so I drafted the text.',
    ],
  },
  {
    slug: 'new-public-public-spaces-incubator',
    cover: {
      src: 'https://images.squarespace-cdn.com/content/v1/6a3af2e47a006d51d924c9da/7acc32b3-7881-480a-86ef-b36c469676cd/new-public-discussion.png?format=2500w',
      alt: "A Public Spaces Incubator discussion about how extreme weather affects outdoor routines, with a poll and a comment marked 'under review'.",
      caption: "UX writing and translations enablement: a prototype discussion space with AI moderation messaging.",
    },
    hook: "What should a platform say when your comment might start a fight?",
    teaser: "4 public media partners",
    hue: 'sky',
    badge: ['#b6d8fe', '#7fd6b3', '#cfa2ed'],
    badgeLight: ['#4f33cc', '#0b704f', '#6b2337'],
    art: 'pixel-composition-16',
    client: 'New_ Public',
    cardTitle: 'UX writing and translations enablement for the Public Spaces Incubator',
    title: 'UX writing and localization for healthier public conversation spaces',
    role: 'UX Writer and Translations Manager',
    timeframe: 'Contract',
    disciplines: ['UX writing', 'Localization', 'Content design'],
    summary:
      'Expanding language support for prototype civic-discussion spaces built with four public-service media organizations, while keeping UX strings high quality for diverse audiences.',
    context: `
      <p>The Public Spaces Incubator is an international partnership between New_ Public and four public-service media organizations. Together they develop prototypes for digital conversation spaces that offer a healthy forum for connection and increase engagement in civic discourse.</p>
      <p>I joined to expand language support while keeping UX strings clear, consistent, and appropriate across audiences and cultures.</p>
    `,
    highlights: [
      {
        title: 'AI moderation language: "Check your response"',
        body: 'I wrote the language that appears when AI moderation flags a comment before it posts, so people are nudged toward constructive discussion without feeling punished.',
        image: { src: '', alt: 'Discussion thread showing a comment under review with moderation messaging' },
      },
      {
        title: 'Translation and localization plan options',
        body: 'I compared translation platforms and processes and laid out options the partners could choose from based on budget, languages, and review capacity.',
        image: { src: '', alt: 'Table of contents from the translations and localization guide' },
      },
      {
        title: 'UX writing options for discussion reactions',
        body: 'I proposed reaction labels, such as "Relatable" and "Helpful", that reward good-faith participation instead of plain agreement.',
        image: { src: '', alt: 'Reaction label options including Thank you, Respect, Relatable, and Helpful' },
      },
    ],
    outcomes: [
      { todo: 'Add outcomes, e.g. number of languages supported, strings localized, or partner organizations using the plan.' },
    ],
    links: [],
    todos: [
      'The lead screenshot loads from your Squarespace site. Before you cancel Squarespace, save it into /public/images/work/new-public-public-spaces-incubator/ and update cover.src.',
      'Confirm the timeframe for this contract.',
      'Check the drafted descriptions for the three highlights. The current site only has headings for these.',
    ],
  },
  {
    slug: 'ally-guide',
    hook: "How do you turn concern into letters on a lawmaker's desk before the next election?",
    teaser: "Adopted by GitHub",
    hue: 'mint',
    badge: ['#7fd6b3', '#ff7b4d', '#c99f43'],
    badgeLight: ['#0b704f', '#cc3333', '#4f33cc'],
    art: 'pixel-composition-13',
    client: 'Ally.Guide / ProgramEquity',
    cardTitle: 'Brand and service refresh to help people mail their local representatives',
    title: 'Ally.Guide: a brand and service refresh for civic action',
    role: 'Content Designer and Product Manager',
    timeframe: 'Volunteer',
    disciplines: ['Content design', 'Product management', 'UX writing', 'Brand'],
    summary:
      'Refreshing a volunteer-built civic-action site so people could quickly understand an issue and mail their local representatives. The work was later adopted by GitHub for internal community programs.',
    context: `
      <p>Ally.Guide started as a volunteer project during the height of the Black Lives Matter protests to share information about racial injustice and the civic actions people could take in their communities.</p>
      <p>With limited resources, the team had to be operational before the next voting cycle. The initiative was later picked up by GitHub (Microsoft) and evolved into a program for internal teams to take part in their local communities.</p>
    `,
    highlights: [
      {
        title: 'Process, collaborators, and challenges',
        body: 'I audited the content, researched comparable spaces, made recommendations, and met with stakeholders, working with front-end and back-end developers, a graphic designer, and a product manager. We had little data, a shifting scope, and a hard deadline.',
        image: { src: '', alt: 'Slide listing actions, collaborators, and hurdles' },
      },
      {
        title: 'Before and after',
        body: 'The redesign simplified navigation and put the lesson-based, illustrated content front and center.',
        image: { src: '', alt: 'Comparison of the old and new Ally.Guide homepage' },
      },
      {
        title: 'Mockups before Figma was everywhere',
        body: 'I annotated layout mockups to give developers clear direction on menus, subtitles, navigation, and footer content.',
        image: { src: '', alt: 'Annotated website mockup' },
      },
      {
        title: 'UX writing and the letter-mailing flow',
        body: 'I redesigned the content for the letter-mailing service (starting with the BREATHE Act), with clear steps, donation options, and progress toward funding goals.',
        image: { src: '', alt: 'New letter-mailing flow with steps and a funding progress bar' },
      },
      {
        title: 'The results: funding and adoption',
        body: 'Ally.Guide was later picked up by GitHub (Microsoft) and evolved into a program for internal teams to take part in civic action in their local communities.',
        image: { src: 'https://images.squarespace-cdn.com/content/v1/6a3af2e47a006d51d924c9da/f8352405-92b0-471c-b98d-61b0e08212cf/Screenshot+2026-07-27+at+6.06.18%E2%80%AFPM.png?format=2500w', alt: "The 'Why we built Amplify' page about civic engagement, with logos of participating companies such as Slack, Stripe, Vercel, Red Hat, GitHub, Google, and MetLife." },
      },
    ],
    outcomes: [
      { stat: 'GitHub', label: 'adopted and evolved the program internally (Amplify)' },
      { todo: 'Add numbers from your "Results" slide, e.g. letters mailed, funds raised, or volunteers.' },
    ],
    links: [],
    todos: [
      'The "Why we built Amplify" screenshot loads from your Squarespace site. Before you cancel Squarespace, save it into /public/images/work/ally-guide/ and update its src.',
      'Confirm the year for this project and whether "ProgramEquity" should be named here.',
    ],
  },
];
