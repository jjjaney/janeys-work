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
//   highlights  the work itself; each can have one `image`, or `images` (a
//               list) to show two or more screenshots side by side. Put files
//               in /public/images/work/<slug>/ and set `src`.
//   outcomes    results; `todo` entries render as placeholder prompts
//   results     optional: screenshots shown under Outcomes, each with a
//               short `caption` ({ src, alt, caption })
//   learnings   optional: { intro, questions: [...] } shown as "Looking back"
//   links       public links to the shipped work
//   cover       the lead screenshot shown at the top of the case study
//               (add `tall: true` for a portrait image, to cap its height)
//
// PLACEHOLDER SCREENSHOTS: most images in /public/images/work/ were cropped
// from rough screenshots of the old site (October 2026). They're stand-ins.
// To swap one, save the better file over it with the same name, or save it
// under a new name and update its `src` here.
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
      src: '/images/work/fis-design-systems-ai/conventions-and-formats.webp',
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
        body: 'Based on departmental and cross-functional interviews, surveys, and content audits, I authored and published documentation that meets the organization where it is: conventions and formats for dates, times, intervals, phone numbers, and more, each with best practices. (Shown at the top of this page.)',
        image: null,
      },
      {
        title: 'Focused, component-level guidance',
        body: 'Docsite pages go deep on the moments that matter most in financial products, such as form UX. The form messaging page separates helper text, placeholders, and supporting text, then covers error messages, so designers know which one a field needs and what goes in it.',
        // Placeholder screenshot: replace with a cleaner capture when you have one.
        image: { src: '/images/work/fis-design-systems-ai/form-messaging.webp', alt: 'The Unify "Form messaging" page, with tabs for helper text, error messages, and resources, and guidance on helper text, placeholders, and supporting text' },
      },
      {
        title: 'A Copilot agent for UX writing review',
        body: 'I built UX-Clippy, a chat agent that reviews UX copy and suggests improvements. It follows specific output instructions and treats the Unify docsite as its knowledge base, so the guidance and the tool stay in sync. Here it flags navigation labels that mix abbreviations with spelled-out terms and suggests sentence-case replacements.',
        // Placeholder screenshot: replace with a cleaner capture when you have one.
        image: { src: '/images/work/fis-design-systems-ai/ux-writing-agent.webp', alt: 'The UX-Clippy agent giving an overall feedback summary on navigation labels, with a table of current and suggested labels' },
      },
      {
        title: 'Creating and testing skills',
        body: 'I use Claude, Copilot, Figma MCP, and Storybook to prototype AI-powered experiences, including first-draft content reviews that designers can run before a human review. A plain writing skill, for example, captures how writing should read (plain, boring, and easy to understand in one pass) as four groups of rules, each with a before and after.',
        // Placeholder screenshot: replace with a cleaner capture when you have one.
        image: { src: '/images/work/fis-design-systems-ai/plain-writing-skill.webp', alt: 'The source of a plain writing skill, with rules for word choice and tone, each followed by a before-and-after example' },
      },
    ],
    outcomes: [
      { todo: 'Add 2–3 outcomes, e.g. number of docsite pages published, designers or teams supported, review time saved by the agent, adoption of the guidance.' },
    ],
    links: [],
    todos: [],
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
    timeframe: 'Contract, 2024',
    disciplines: ['Content management', 'Content operations', 'Editorial', 'Release notes'],
    summary:
      'Designing the templates, guidelines, and workflow behind weekly member updates and visual release notes for over 500,000 Arc Browser users across macOS, iOS, and Windows.',
    context: `
      <p>The Browser Company of New York (BCNY) is a startup <a href="https://www.theverge.com/2022/10/31/23428862/arc-browser-web-company-darin-fisher">developing browsers that streamline tedious tasks and incorporate AI</a>. Its mobile app, Arc Search, features an AI-driven search that compiles results from several sources instead of ranking pages by SEO, like Google Search does.</p>
      <p>When I joined, the team was focused on shipping its latest browser. Member communications and editorial review relied on whoever had time, and the audience had grown past half a million people.</p>
    `,
    highlights: [
      // Screenshots below are placeholders cropped from the old site; replace as needed.
      {
        title: 'A member update workflow',
        body: 'I designed and implemented templates and guidelines for member communications, so updates could ship on a predictable cadence instead of relying on whoever had time. That included weekly update emails and targeted invitations, like asking members who had requested Windows 10 support to test it early as Arc Early Birds.',
        image: { src: '/images/work/browser-company-member-content/member-update-email.webp', alt: 'A test send of the "You’re invited to Arc Early Birds for Windows 10" member email from The Browser Company' },
      },
      {
        title: 'One release-notes process for three platforms',
        body: 'I created the process and template for release notes, then drafted, staged, and published them weekly for over 500,000 members across iOS, macOS, and Windows. Full text notes for every release live in one Resource Center hub.',
        image: { src: '/images/work/browser-company-member-content/release-notes-hub.webp', alt: 'The Arc Release Notes hub, listing release notes by year for Arc for macOS, Arc Search for iOS, and Arc for Windows' },
      },
      {
        title: 'Easel: a visual release-notes template',
        body: 'Visual release notes were built in Arc’s Easel. I put together Easel Standards, an 8-bit starter pack of assets (general computer, icon, Windows, macOS and iOS, Arc Browser, podcast, and just-for-fun sets) with export settings, so each week’s notes could be assembled quickly and still look like Arc.',
        image: { src: '/images/work/browser-company-member-content/easel-template.webp', alt: 'The Easel Standards board: an 8-bit starter pack of assets grouped into general computer, icon, Windows, macOS and iOS, Arc Browser, podcast, and just-for-fun sets' },
      },
      {
        title: 'Staging media for every medium',
        body: 'Member updates included visuals like GIFs. Most of the ones I staged show a single, simple gesture, so viewers could focus on the feature without distraction.',
        image: { src: '/images/work/browser-company-member-content/staging-media.webp', alt: 'An iPhone 15 Pro mockup being staged and animated in Rotato for a hidden-tips GIF' },
      },
      {
        title: 'Ghostwriting, AI chatbot macros, and resource articles',
        body: 'I reviewed and refined templates and macros for the Resource Center AI chatbot (Archie), and collaborated on blog posts and marketing pages. Most notably: the Arc Search landing page and the “Our favorite hidden features in Arc Search” blog post.',
        image: { src: '/images/work/browser-company-member-content/hidden-features-post.webp', alt: 'The "Our favorite hidden features in Arc Search" blog post, with a Top 5 hidden features video and App Store screenshots' },
      },
    ],
    outcomes: [
      { stat: '500k+', label: 'members reached by weekly updates' },
      { stat: '3', label: 'platforms covered by one release-notes process' },
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
      <p>The goals were to update the service pages and web presence, including new features and general tax “guidance”; to onboard users with a frictionless experience that showed them where they were in the process; and, as a bonus, to reduce churn and fraud by being clear about what tax guidance we could legally offer and where to add checkpoints that kept bad actors out.</p>
      <p>Without much experience in fintech, I partnered with Microsoft’s Fraud and Security team to understand the potential for bad actors and plan processes that kept the program healthy. The program information was outdated and scattered, it had to welcome individual open source contributors and large enterprises alike, and churn is hard to pin down: fixing one part of the problem only goes so far if other issues are left alone.</p>
    `,
    // Screenshots below are placeholders cropped from the old site; replace as needed.
    highlights: [
      {
        title: 'Baselines, feedback, and a roadmap',
        body: 'I started by establishing baselines for what was working and what wasn’t, with a running discussion for meeting notes so the data could inform our hypotheses and bets. With Stripe, our payments partner, I built a roadmap with check-ins covering user personas and flow mapping, scope and priorities (content updates and reducing churn in onboarding), mockup options, deadlines, and success metrics.',
        image: { src: '/images/work/github-sponsors/review-data.webp', alt: 'A GitHub discussion used as a central place for ongoing meeting notes, with a template for each meeting' },
      },
      {
        title: 'Supporting individuals and organizations',
        body: 'Individuals need different information than organizations about legal documents and tax information. Mapping how sponsors and sponsored developers or organizations connect, and what matters to each, decided how each experience should be shaped. I worked through these questions with product managers, engineers, developers, data analysts, legal, and other collaborators.',
        images: [
          { src: '/images/work/github-sponsors/pay-ins-outs.webp', alt: 'A diagram of pay-ins from individual and corporate sponsors and pay-outs to sponsored developers and organizations' },
          { src: '/images/work/github-sponsors/proration-summary.webp', alt: 'A sponsorship summary showing an early adopter discount and a prorated amount due' },
        ],
      },
      {
        title: 'Landing page refresh',
        body: 'The original Sponsors page was useful for sharing beta information, but it felt generic, without a focused audience or customer evidence. To elevate the design and get people excited about joining, I wrote FOMO-inducing copy and reworked the page so contributors and enterprise sponsors could each find their path.',
        images: [
          { src: '/images/work/github-sponsors/landing-before-after.webp', alt: 'Before and after comparison of the GitHub Sponsors landing page and FAQ' },
          { src: '/images/work/github-sponsors/old-look.webp', alt: 'The old Sponsors experience, next to launch messaging such as "Available in 38 regions"' },
        ],
      },
      {
        title: 'Overhauling the waitlist and onboarding',
        body: 'One of the biggest issues I inherited was why we were seeing so much churn and feedback around onboarding. The sign-up and waitlist left much to be desired, leaving audiences confused about when they could participate and what to do. Addressing those concerns removed the bottleneck and reduced churn.',
        images: [
          { src: '/images/work/github-sponsors/waitlist-old-new.webp', alt: 'The old "Join the waitlist" form next to the new bank account and country of residence fields' },
          { src: '/images/work/github-sponsors/onboarding.webp', alt: 'The new onboarding checklist, ending with "Submit application to GitHub Staff for approval"' },
        ],
      },
      {
        title: 'Proration for enterprise',
        body: 'Setting expectations for fees, payment schedules, and proration was part of the solution for individuals and organizations alike, so people understood what was owed, to whom, and when.',
        image: { src: '/images/work/github-sponsors/proration-enterprise.webp', alt: 'An organization’s sponsorship checkout with a prorated amount, billing information, and visibility options' },
      },
      {
        title: 'Customer evidence, and show and tell',
        body: 'Clarifying who our customers were showed that we needed to serve enterprises and individuals equally. Sharing the work in progress and asking customers for feedback on GitHub Sponsors for companies helped shape the overall program.',
        images: [
          { src: '/images/work/github-sponsors/customer-evidence.webp', alt: 'A Sponsors project slide, with a teammate’s message thanking the team for the landing page meeting (name blurred)' },
          { src: '/images/work/github-sponsors/show-and-tell.webp', alt: 'A "[Feedback Wanted] GitHub Sponsors for companies" issue' },
        ],
      },
      {
        title: 'A part of the whole',
        body: 'After so much change, it was important to share our findings internally and consider how GitHub Sponsors fit with the larger GitHub ecosystem and, further, the Microsoft ecosystem. Collaborating with product managers and others across both companies fed into further Sponsors updates.',
        image: { src: '/images/work/github-sponsors/miro-board.webp', alt: 'A board of sticky notes grouped into themes such as maintainer tools, issues and contributing, and profile recognition' },
      },
      {
        title: 'Expanding the program: Malta and Cyprus',
        body: 'I shipped the program expansion to new regions and announced it on the GitHub Blog, my debut as an author after years of editing the blog. A new welcome email set out the steps to get a Sponsors profile live.',
        image: { src: '/images/work/github-sponsors/malta-cyprus.webp', alt: 'The "Welcome Malta and Cyprus to GitHub Sponsors" blog post next to the "Welcome to GitHub Sponsors" email' },
      },
      {
        title: 'Collaborators and hurdles',
        body: 'I worked with front-end, back-end, and full-stack developers, graphic designers, a service manager, legal, tax and accounting advisors, the Fraud and Security team, and marketing and public relations. The hurdles: many stakeholders with differing priorities, lots of legal and financial implications, scope creep and fast deadlines, and the gap between enterprise and individual open source developers.',
        image: null,
      },
    ],
    outcomes: [
      { stat: '$100k/yr', label: 'earned through the program by one maintainer, Caleb Porzio' },
      { stat: 'No waitlist', label: 'removing it reduced churn' },
      { stat: 'Fewer tickets', label: 'about tax guidance, after clear tax information' },
    ],
    results: [
      { src: '/images/work/github-sponsors/inclusive-landing.webp', alt: 'The Sponsors landing page hero, "Invest in the software that powers your world," with a brown octocat holding a heart balloon', caption: 'A more inclusive experience. Representation matters for people to see themselves succeeding in a program; now you’re greeted by a brown octocat.' },
      { src: '/images/work/github-sponsors/getting-started.webp', alt: 'A "Getting started with GitHub Sponsors" graphic', caption: 'Relaunching the program. After its growing pains, people could experience a more mature program, with information, processes, and a greater opportunity for financial success.' },
      { src: '/images/work/github-sponsors/waitlist-email.webp', alt: 'The "You’re on the GitHub Sponsored Developers waitlist!" email', caption: 'Holistic communications. Our audience knew what to do and when; setting expectations is part of the program’s success.' },
      { src: '/images/work/github-sponsors/companies-beta.webp', alt: 'The December 8, 2020 changelog post "GitHub Sponsors for companies now available in beta"', caption: 'Expanded support. GitHub Sponsors for companies launched in beta on December 8, 2020.' },
      { src: '/images/work/github-sponsors/community-earner.webp', alt: 'Caleb Porzio’s post "I Just Hit $100k/yr On GitHub Sponsors! (How I Did It)," with a chart of his sponsorship income', caption: 'Community earners. Many members earned more after the relaunch.' },
      { src: '/images/work/github-sponsors/tax-docs.webp', alt: 'The "Managing billing for GitHub Sponsors" documentation page', caption: 'Tax information. Partnering with legal and tax experts, we gave clear, concise tax information without dispensing financial advice.' },
      { src: '/images/work/github-sponsors/new-landing.webp', alt: 'The full refreshed GitHub Sponsors landing page in a browser window', caption: 'Customer evidence. Success stories showed corporations, individuals, and teams how to use the program for their own repositories.' },
    ],
    learnings: {
      intro: 'I learned a significant amount about fraud, financial security for programs, and banking trends on a global scale. Many of my open questions are about how the global majority approaches banking: would “bankless” options have changed the platform we built, and what new concerns would they bring? Questions I want to consider the next time I manage a project like this:',
      questions: [
        'Are we seeing results from people who are predisposed to success because of their existing levels of privilege?',
        'What would the program look like if we could incorporate bankless options?',
        'Ease of use for an enterprise is different from ease of use for an individual, and may need a completely different approach.',
      ],
    },
    links: [
      { label: 'Welcome Malta and Cyprus to GitHub Sponsors', href: 'https://github.blog/2020-07-28-welcome-malta-and-cyprus-to-github-sponsors-plus-updates/' },
    ],
    todos: [
      'The lead screenshot loads from your Squarespace site. Before you cancel Squarespace, save it into /public/images/work/github-sponsors/ and update cover.src.',
    ],
  },
  {
    slug: 'new-public-public-spaces-incubator',
    cover: {
      src: '/images/work/new-public-public-spaces-incubator/check-your-response.webp',
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
        body: 'I wrote the language that appears when AI moderation flags a comment before it posts, so people are nudged toward constructive discussion without feeling punished. The message explains that the response may not fit the community guidelines, suggests rewording it to explain disagreements constructively and express ideas with civility, and confirms it was sent to a moderator. (Shown at the top of this page.)',
        image: null,
      },
      {
        title: 'Translation and localization plan options',
        body: 'I compared translation platforms and processes and laid out two options the partners could choose from based on budget, languages, and review capacity: adopt a translations platform for internal and external review (with machine translation, crowdsourcing, and visual review), or create a manual working demo process for partners and translators.',
        // Placeholder screenshot: replace with a cleaner capture when you have one.
        image: { src: '/images/work/new-public-public-spaces-incubator/localization-plan.webp', alt: 'The "Translations and Localization" guide, outlining two options: adopting a translations platform or creating a working demo instance' },
      },
      {
        title: 'UX writing options for discussion reactions',
        body: 'I proposed new reaction labels with custom emoji, such as “Relatable,” “Helpful,” “Controversial,” and “Interesting,” to replace “Thank you,” “New to me,” “Respect,” and “Disagree,” so reactions reward good-faith participation instead of plain agreement.',
        // Placeholder screenshot: replace with a cleaner capture when you have one.
        image: { src: '/images/work/new-public-public-spaces-incubator/reaction-labels.webp', alt: 'Current reaction labels (Thank you, New to me, Respect, Disagree) above the proposed ones (Relatable, Helpful, Controversial, Interesting)' },
      },
    ],
    outcomes: [
      { todo: 'Add outcomes, e.g. number of languages supported, strings localized, or partner organizations using the plan.' },
    ],
    links: [],
    todos: [
      'Confirm the timeframe for this contract.',
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
      <p>With limited resources, the team had to be operational before the next voting cycle. I had two tasks: redesign Ally.Guide’s user experience into a presentable first iteration for the public, with accessible, trustworthy content design and user flow; and manage the creation and redesign of the first iteration of a civic action service to locate and mail your state representative.</p>
      <p>The initiative was later picked up by GitHub (Microsoft) and evolved into ProgramEquity and its Amplify program.</p>
    `,
    // Screenshots below are placeholders cropped from the old site's slides; replace as needed.
    highlights: [
      {
        title: 'Process, collaborators, and challenges',
        body: 'I audited the existing content, researched competitive spaces (civic action websites), and made recommendations, marked as priority or as needed, through documentation, pull requests, or wireframes. I met with stakeholders on user personas and flow mapping, design and mockup options, low-code versus no-code versus in-house development, deadlines and owners, and overall scope and success metrics, then created a roadmap with check-ins. I was the Content Designer and Project Manager, working with front-end and back-end (sometimes full-stack) developers, a graphic designer, and a product and service manager. The hurdles: little volunteer time and few resources, no concrete data (everything was an assumption), and a scope that was too large.',
        image: null,
      },
      {
        title: 'Before and after',
        body: 'The first iteration of Ally.Guide was built before I joined. I updated the taxonomy and site map, then redesigned it: a cleaner design with vector assets for approachability, and navigation and a flow of information that focus on a particular civic action (learn, amplify, or give). I also added a footer for quick links and easier navigation. Footers are easy to take for granted, but they can make or break a simple experience.',
        image: { src: '/images/work/ally-guide/before-after.webp', alt: 'The old Ally.Guide homepage, with Elevate, Contribute, Collaborate, Educate, and Subscribe navigation, next to the redesigned, illustrated homepage and its new footer' },
      },
      {
        title: 'Mockups before Figma was everywhere',
        body: 'I wireframed the page structure and annotated layout mockups to give developers clear direction on the name and menu placement, padding, subtitles, navigation, and footer content. Part of managing the site design was collaborating with methods and tools that volunteers could easily understand.',
        image: { src: '/images/work/ally-guide/annotated-mockups.webp', alt: 'A page wireframe next to an annotated mockup noting padding, menu placement, and the active link underline' },
      },
      {
        title: 'UX writing and the letter-mailing flow',
        body: 'As part of Ally.Guide, “Pass the Policy” let people choose a cause, then locate and mail a state representative a letter to support or share concerns, starting with the BREATHE Act. I worked with a developer to make the experience smooth and secure, since it involved monetary donations. The new design, wireframed in Figma, “looks and feels” trustworthy, which matters for this audience, and numbered steps (review the letter, sign your name, send the letter) show visitors where they are in the process.',
        image: { src: '/images/work/ally-guide/pass-the-policy.webp', alt: 'The old BREATHE Act letter page with donation buttons next to the new three-step flow: review the letter, sign your name, and send the letter' },
      },
      {
        title: 'From Ally.Guide to ProgramEquity and Amplify',
        body: 'GitHub (Microsoft) picked up and funded the program, and it evolved into ProgramEquity: hackathon enablement with community-informed design, connecting tech schools to accelerate campaigns for social justice. Its Amplify program brought in participating companies such as Slack, Stripe, Vercel, Red Hat, GitHub, Google, and MetLife.',
        images: [
          { src: '/images/work/ally-guide/program-equity.webp', alt: 'The ProgramEquity homepage: "Hackathon Enablement with Community Informed Design"' },
          { src: '/images/work/ally-guide/amplify.webp', alt: 'The "Why we built Amplify" page about civic engagement, with logos of participating companies such as Slack, Stripe, Vercel, Red Hat, GitHub, Google, and MetLife' },
        ],
      },
    ],
    outcomes: [
      { stat: 'Funded', label: 'picked up and funded by GitHub (Microsoft)' },
      { stat: 'More use', label: 'more people used the service, which showed the program’s credibility' },
      { stat: 'MVP', label: 'a roadmap for future iterations, scoped to priority items' },
    ],
    learnings: {
      intro: 'Questions and takeaways I’d bring to the next project like this:',
      questions: [
        'People want to take civic action, but they strongly prefer to stay anonymous or reduce the chance of being identified.',
        'What would the program look like if it had the resources to go to market as it is?',
        'How do you track and review the causes you’ve engaged with?',
      ],
    },
    links: [],
    todos: [
      'Confirm the year for this project.',
    ],
  },
];
