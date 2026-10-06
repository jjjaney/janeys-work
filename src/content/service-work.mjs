// Case studies that live only on the Services page.
//
// These use the same fields as src/content/work.mjs (see the notes at the top
// of that file) plus one more:
//   services   the `id`s of the services they belong to (see
//              src/content/services.mjs). Each one is linked under the matching
//              band on the Services page, so a project can sit under several.
//
// They each get their own page at /work/<slug>/, but they are NOT on the home
// page, the Case studies page, or the main Previous/Next links. Their pages
// link back to the Services page instead.
//
// ─── HOW TO ADD A SERVICES-ONLY CASE STUDY ─────────────────────────────────
// 1. Copy a whole object below and give it a new `slug`.
// 2. Set `services` to one or more ids: 'strategy', 'design', 'systems',
//    'docs', or 'product'.
// 3. Pick a `hue` (lilac | peach | gold | sky | mint) for the closing band and
//    an `art` composition from src/art/ (pixel-composition-12 to -16).
// 4. Put screenshots in /public/images/work/<slug>/ and point `src` at them.
// 5. Run `npm run build` and check /services/ and the new page.
//
// To move a case study onto the home page and Case studies page, cut it from
// here, paste it into src/content/work.mjs, and add `teaser`, `badge`, and
// `badgeLight` (copy them from a case study with the same hue).
//
// PLACEHOLDER SCREENSHOTS: the images below were cropped from rough
// screenshots of the old site (October 2026). Replace them as better ones
// come in; saving over a file with the same name is enough.

export const serviceWork = [
  {
    slug: 'github-editorial',
    services: ['strategy'],
    cover: {
      src: '/images/work/github-editorial/results-collage.webp',
      alt: 'A collage of GitHub Blog work: an editorial calendar, a Universe event graphic, a blog brief, a DMCA trends chart, feature announcements, analytics, an SAP case study, and a maintainer spotlight.',
      caption: 'A more mature, process-enabled content model for the GitHub Blog.',
    },
    hook: 'How do you keep a beloved voice while the company behind it doubles?',
    hue: 'sky',
    art: 'pixel-composition-14',
    client: 'GitHub',
    cardTitle: 'Editorial and content management for the GitHub Blog',
    title: 'Creating a global content presence for developers',
    role: 'Editorial Manager and Content Manager, GitHub Blog',
    timeframe: '2018–2019',
    disciplines: ['Editorial management', 'Content strategy', 'Content operations', 'Ghostwriting'],
    summary:
      'Managing the GitHub Blog through the Microsoft acquisition: the guidelines, templates, and processes that let content scale with the company while keeping the voice developers love.',
    context: `
      <p>I was a copywriter turned Editorial Manager and Content Manager for the GitHub Blog. As Content Manager, I managed the blog pipeline as content was drafted, edited, and published through GitHub or WordPress. I ghostwrote or edited almost every post in 2018 and 2019, and wrote content and supported launches through the Microsoft acquisition, GitHub India, the Octoverse reports, the GitHub Sponsors expansion to Malta and Cyprus, and more.</p>
      <p>When I joined, GitHub was already the well-known and beloved platform for developers of all sizes. Within a few months it grew exponentially and completed its acquisition by Microsoft. We had to consider the volume of supporting content for GitHub and Microsoft, and elevate our communications and processes to match the next stage of the company: auditing processes for efficiency and resiliency, evolving communications for even more diverse audiences, and lowering the barrier to collaboration between companies.</p>
      <p>The goals: help developers contribute content without it going stale in a backlog, with a way to review drafts, share feedback on time, and prioritize and schedule requests; make processes that scale to a larger volume of requests and editors; and keep the approachable, educational, and supportive voice the community knows and loves.</p>
    `,
    highlights: [
      {
        title: 'Remembering our roots while we grow',
        body: 'Because of GitHub’s beloved brand personality, I wanted to keep the familiar, fun tone but elevate it to complement Microsoft’s style and content. That meant auditing and reviewing everything from content contribution processes to brief templates, data analysis, transition plans, ghostwriting, and much more.',
        image: null,
      },
      {
        title: 'Audit and goals',
        body: 'Most of our audience fit into five levels, from “never heard of GitHub” to “super fan or employee,” so we could tailor campaigns to each level of GitHub experience. I clarified content through editing and ghostwriting, often as suggested changes in pull requests, to support developers regardless of their experience.',
        images: [
          { src: '/images/work/github-editorial/audience-levels.webp', alt: 'Five audience levels: never heard of GitHub, heard of GitHub, uses or has used GitHub, needs GitHub, and super fan or employee' },
          { src: '/images/work/github-editorial/editing-suggestions.webp', alt: 'Suggested changes on a Security Lab blog post pull request' },
        ],
      },
      {
        title: 'Research and a brief template',
        body: 'Regular audience research kept us proactive with communications, which mattered even more with the new audience we’d inherit from the Microsoft acquisition. Process should help creativity and collaboration, not hinder it: not every piece can be templated, but a blog brief template gave anyone the important details at a glance.',
        images: [
          { src: '/images/work/github-editorial/personas-doc.webp', alt: 'A research plan for defining personas and auditing existing content' },
          { src: '/images/work/github-editorial/blog-brief-template.webp', alt: 'A blog post brief issue with title options, excerpt, publish dates, categories, and tracked edits (author redacted)' },
        ],
      },
      {
        title: 'Feedback and data',
        body: 'Feedback is a gift. Clear guidelines and “lanes” for constructive feedback, from the kickoff call to the retrospective, were essential to resolving problems. With Looker, Datadog, and more, we could make bets on the kinds of content that would help our audience, depending on the GitHub service they used.',
        images: [
          { src: '/images/work/github-editorial/premortem-template.webp', alt: 'A premortem issue template with sections for the problem and next steps' },
          { src: '/images/work/github-editorial/analytics.webp', alt: 'Page analytics for a GitHub Blog post' },
        ],
      },
      {
        title: 'Expanding processes',
        body: 'As we scaled, our processes had to evolve too. I regularly collaborated with other teams on processes that fit their resources and priorities, like tiers of event campaign options for social media.',
        image: { src: '/images/work/github-editorial/event-campaign-tiers.webp', alt: 'An "Event Campaign Options" page describing Tier 1 social coverage for large events' },
      },
      {
        title: 'Jekyll to WordPress, and beyond',
        body: 'We tried different tools to learn what made sense next. We were publishing blog posts with Jekyll on GitHub, and I supported and completed the transition to WordPress. The migration left us with a CMS instance just for the blog, and the chance to evolve it into the beautiful, accessible, content-focused blog it is today.',
        images: [
          { src: '/images/work/github-editorial/spanish-docs-post.webp', alt: 'The "¡Hola! Our help documentation is now available in Spanish" blog post' },
          { src: '/images/work/github-editorial/wordpress-site-health.webp', alt: 'WordPress Site Health status for the blog' },
        ],
      },
      {
        title: 'Editorial calendars and analytics',
        body: 'When I started, the editorial calendar was a few tasks in a GitHub repository. I used Asana and then Airtable to build a “living” calendar so everyone could see the pipeline at a glance. At the height of GDPR, we had to forgo analytics and go with our instincts and data points from other departments, which meant connecting with our audience to understand their needs.',
        images: [
          { src: '/images/work/github-editorial/editorial-calendar.webp', alt: 'The Airtable editorial content calendar, with post titles, draft status, and publish dates (names blurred)' },
          { src: '/images/work/github-editorial/traffic-notes.webp', alt: 'Notes on which posts Hacker News, Reddit, and Stack Overflow sent the most traffic to' },
        ],
      },
      {
        title: 'Transition plans',
        body: 'When I moved from Editorial Manager to Product Manager for GitHub Sponsors, I wanted to set the next person up for success. There were many moving pieces and little documentation about “all things content,” so I wrote a comprehensive guide to managing, supporting, and contributing to the GitHub Blog.',
        image: { src: '/images/work/github-editorial/transition-guide.webp', alt: 'A section of the blog guide explaining how to review repository permissions' },
      },
    ],
    outcomes: [
      { stat: 'Nearly all', label: 'GitHub Blog posts in 2018 and 2019 ghostwritten or edited by me' },
      { stat: 'WordPress', label: 'a migration from Jekyll that I supported and completed' },
      { stat: '1 guide', label: 'to managing, supporting, and contributing to the blog' },
    ],
    links: [
      { label: 'The GitHub Blog', href: 'https://github.blog/' },
      { label: '2018 archive', href: 'https://github.blog/2018/' },
      { label: '2019 archive', href: 'https://github.blog/2019/' },
      { label: 'My debut as an author', href: 'https://github.blog/2020-07-28-welcome-malta-and-cyprus-to-github-sponsors-plus-updates/' },
    ],
    todos: [],
  },
  {
    slug: 'arinc',
    services: ['docs'],
    cover: {
      src: '/images/work/arinc/security-brochure.webp',
      alt: 'The cover of the ARINC "Security Systems Education Services" brochure, showing a security operations center.',
      caption: 'Service brochure for ARINC’s security systems education services.',
      tall: true, // portrait image: shown at a capped height
    },
    hook: 'How do you teach a team to run a security system you just installed?',
    hue: 'gold',
    art: 'pixel-composition-15',
    client: 'ARINC (Rockwell Collins)',
    cardTitle: 'Technical writing, documentation, and training for national security',
    title: 'Content for national security: documentation and training',
    role: 'Associate Civil Engineer, then Technical Writer and Corporate Trainer',
    timeframe: '2013',
    disciplines: ['Technical writing', 'Documentation', 'Training', 'ISO 9001'],
    summary:
      'Writing the documentation behind custom perimeter security systems for government facilities, then teaching people to use them, from factory acceptance tests to computer-based training modules.',
    context: `
      <p>ARINC (later Rockwell Collins, now Collins Aerospace) provides transport communications and systems engineering across eight industries, including aviation, defense, and healthcare, with over 3,200 employees and $919M in revenue across 120+ global locations.</p>
      <p>I started as an associate civil engineer, collaborating with subject matter experts to deploy custom analytical perimeter security surveillance systems for government facilities, including airports and nuclear power plants. I then became a technical writer and instructor, writing the documentation for each site’s implementation before traveling to the site to train the people who would run it.</p>
      <p><em>Because of the secure nature of the work, the ARINC samples shared here have been anonymized and contain mocked-up details.</em></p>
    `,
    highlights: [
      {
        title: 'Everything a deployment needs, in writing',
        body: 'I wrote everything from factory acceptance tests, requests for proposals, and manuals to computer-based training modules and service brochures, all compliant with ISO 9001.',
        image: null,
      },
      {
        title: 'Training guides and course outlines',
        body: 'Training guides like the AIM ESP admin guide walked operators through the system step by step: basic operations, system operations, system editor operations, and graphic editor operations, each mapped to pages in a course outline.',
        image: { src: '/images/work/arinc/training-guide.webp', alt: 'The cover of the "AIM ESP Training Guide: Admin" (April 2011, revision 2) above its course outline' },
      },
    ],
    outcomes: [
      { stat: 'ISO 9001', label: 'compliant documentation and training' },
      { stat: 'On site', label: 'training delivered in person at each facility' },
    ],
    links: [],
    todos: [],
  },
  {
    slug: 'cmu-computing-services',
    services: ['strategy', 'systems', 'docs'],
    cover: {
      src: '/images/work/cmu-computing-services/after-set.webp',
      alt: 'The refreshed Computing Services materials: the website, the InfoCenter, CMS documentation, a services brochure, the 2016 Factbook, and an "At a Glance" infographic.',
      caption: 'After: the refreshed website, internal InfoCenter, CMS documentation, and print materials.',
    },
    hook: 'What goes into a website refresh, and what else does it touch?',
    hue: 'mint',
    art: 'pixel-composition-13',
    client: 'Carnegie Mellon University',
    cardTitle: 'Website and marketing materials refresh for Computing Services',
    title: 'Refreshing a global university’s web experience',
    role: 'Content, Communications, and Technical Documentation Manager',
    timeframe: '2016',
    disciplines: ['Content strategy', 'Content management', 'Documentation', 'Marketing'],
    summary:
      'Leading the Computing Services “At a Glance” project: a refreshed website, self-help resources, and print materials that introduced a new Vice President of Operations to the division’s work.',
    context: `
      <p>As part of Carnegie Mellon University (CMU), Computing Services supports the entire campus community with IT and web services. I led the division’s website refresh for faculty, staff, students, and the broader campus community. Its marketing materials also needed to reflect newer branding and updated service offerings.</p>
      <p>The “At a Glance” project (the website refresh) showcases division details from year to year for prospective customers and the campus community through web and printed materials. The goals: give the new Vice President of Operations an easily digestible overview of the work Computing Services brought to Carnegie Mellon; update and modernize the staff, faculty, and student landing pages; and provide accessible self-help resources and training that reduce help center tickets.</p>
      <p>Creating a unified experience was a self-imposed challenge; the main problem was time. The deadline was expedited to share with the new Vice President. I collaborated with C-suite executives on confidential data to include and provided options for layout and copy, all before printing a large volume of materials that were cut and bound by hand. With many service owners, program owners, and project managers involved, approvals and information took time.</p>
    `,
    highlights: [
      {
        title: 'Identify goals',
        body: '<em>What goes into a website refresh, and what else does it affect?</em> We asked ourselves this to define and measure success. Service owners, program managers, site administrators, and others came together to set goals, make a plan, and collaborate on tasks. I worked across content management systems, design tools (mostly Adobe Creative Suite), and a printing company to create online and print materials for information and marketing.',
        image: { src: '/images/work/cmu-computing-services/responsive-site.webp', alt: 'The Carnegie Mellon website on a laptop, tablet, and phone' },
      },
      {
        title: 'Research and plan',
        body: 'Mockups, card sorting for the taxonomy, campus community interviews, page performance metrics, and quality assurance testing.',
        image: { src: '/images/work/cmu-computing-services/whiteboard-plan.webp', alt: 'A whiteboard sketch of the site navigation: get started, services, how-to, downloads, secure computing, and system status' },
      },
      {
        title: 'Audit, then update what exists',
        body: 'Often there’s a lot of existing material that can be updated and reused instead of overhauled. I updated the homepage, content management, the self-help resource site, and an internal SharePoint repository, with content and page templates that matched web trends of the time but stayed easy for the campus community to scan.',
        images: [
          { src: '/images/work/cmu-computing-services/audit-service-sheets.webp', alt: 'Existing "Services for Staff," "Services for Students," and "Services for Faculty" sheets' },
          { src: '/images/work/cmu-computing-services/campus-cloud-brochure.webp', alt: 'The Campus Cloud brochure, folded open to its fee schedule' },
        ],
      },
      {
        title: 'Create and test',
        body: 'We needed assets for the students’ Getting Started experience and the internal SharePoint repository. I worked with a student intern on Getting Started videos and images for a student portal, and wrote ServiceNow help articles and service pages for the Lease IT service. Beyond QA-testing pages and reviewing content, I checked in with the Help Center on how their support article process was going with the changes.',
        images: [
          { src: '/images/work/cmu-computing-services/getting-started-illustration.webp', alt: 'A line drawing of a smiling person at a laptop, made for the Getting Started assets' },
          { src: '/images/work/cmu-computing-services/servicenow-articles.webp', alt: 'A list of ServiceNow knowledge articles with their status' },
        ],
      },
      {
        title: 'Solicit feedback, train, and iterate',
        body: 'My team and I ran interviews to understand how effective the content changes were, then decided what to prioritize and incorporate. I trained the right people to use and maintain the new templates, styles, advertising materials, and other university-branded assets. Feedback and analytics shaped the plan for the next round of priorities and updates.',
        images: [
          { src: '/images/work/cmu-computing-services/staff-survey.webp', alt: 'Survey results for "What kinds of topics would you like to hear about at our upcoming All Staff Meeting?"' },
          { src: '/images/work/cmu-computing-services/cms-documentation.webp', alt: 'CMS documentation explaining site-wide and page elements next to a sample page' },
        ],
      },
    ],
    outcomes: [
      { stat: 'All goals met', label: 'the new VP of Operations was impressed by the breadth and quality of services' },
      { stat: '1 template', label: 'and a standard for future service marketing materials' },
    ],
    results: [
      { src: '/images/work/cmu-computing-services/before-set.webp', alt: 'The earlier service sheets, SharePoint services list, and Computing Services website', caption: 'Before: service sheets, a SharePoint list of services, and the earlier website. (After is at the top of this page.)' },
    ],
    learnings: {
      intro: 'Most of what I learned was about using the Adobe Creative Suite more efficiently. Questions I want to consider the next time I manage a project like this:',
      questions: [
        'What could we achieve with a standardized CMS across the university?',
        'With more time, what might the marketing materials look like instead?',
        'If we partnered with a design team or an external agency, what might have happened differently?',
        'How else could we have provided self-service support?',
      ],
    },
    links: [],
    todos: [],
  },
];
