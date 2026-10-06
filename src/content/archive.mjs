// Earlier work (the Archive page). Links to /s/... files still point at the
// Squarespace site. TODO(Janey): before you cancel Squarespace, download those
// PDFs into /public/archive/ and change each href to '/archive/<file>.pdf'.
const old = (p) => `https://www.janeys.work/s/${p}`;

export const archive = [
  {
    group: 'Editorial and marketing',
    items: [
      { title: 'GitHub Blog', org: 'GitHub', body: 'Managed editorial content for the blog as part of the content team. I ghostwrote or edited almost every post from 2018–2019.', links: [{ label: '2018 archive', href: 'https://github.blog/2018/' }, { label: '2019 archive', href: 'https://github.blog/2019/' }] },
      { title: 'Computing Services "At a Glance"', org: 'Carnegie Mellon', body: 'Rebranded the division with a consistent, modern voice: a factbook, services brochure, presentation template, and technical overview, designed to update year to year.', links: [{ label: 'Factbook', href: old('Factbook') }, { label: 'Brochure', href: old('CompSvcs-Brochure') }] },
      { title: 'Campus Cloud brochure', org: 'Carnegie Mellon', body: 'Print brochure to advertise cloud hosting and start sales conversations with potential clients.', links: [{ label: 'Brochure', href: old('CampusCloud-Brochure') }] },
      { title: 'Emails and newsletters', org: 'Ripl, Plex', body: 'Welcome series, product-adoption emails, and subscriber roundups.', links: [{ label: 'Ripl welcome email', href: old('Ripl-Newsletter-enlp.pdf') }, { label: 'Plex newsletter', href: old('plex-newsletter-34js.pdf') }] },
      { title: 'Cursor_ division newsletter', org: 'Carnegie Mellon', body: 'Took over and modernized the newsletter in 2014 and launched an accessible version in 2016.', links: [{ label: 'Samples', href: old('Cursor-Newsletter') }] },
      { title: 'New to CMU: Get Started', org: 'Carnegie Mellon', body: 'Video series, website, mailers, and event presentations that helped students find free software and services.', links: [{ label: 'Video playlist', href: 'https://www.youtube.com/playlist?list=PL4oOwU_OZ6AwvPCnj9sGoLuEUQhIABPNf' }] },
    ],
  },
  {
    group: 'Technical writing',
    items: [
      { title: 'Voicemail quick reference guide', org: 'Carnegie Mellon', body: 'Task-based guide for a campus-wide Cisco unified communications rollout.', links: [{ label: 'Guide', href: old('PhoneVoicemail-Guides') }] },
      { title: 'Classroom and event equipment guides', org: 'Carnegie Mellon', body: 'Posters and podium manuals so anyone could run a room\'s AV on the fly.', links: [{ label: 'Classroom guide', href: old('Classroom-Guide') }] },
      { title: 'Cascade CMS upgrade communication plan', org: 'Carnegie Mellon', body: 'Rollout plan for a campus-wide content management system upgrade.', links: [{ label: 'Plan', href: old('Cascade-CommPlan') }] },
      { title: 'CMS documentation', org: 'Carnegie Mellon', body: 'User instructions for the content management system, written with the web team.', links: [{ label: 'Docs', href: old('CMS-Info-Subsite.pdf') }] },
    ],
  },
  {
    group: 'Web and social',
    items: [
      { title: 'cmu.edu/computing redesign', org: 'Carnegie Mellon', body: 'Built the template and migrated content, tested with peers and senior leadership.', links: [{ label: 'Redesign', href: old('ComputingServicesRedesign.pdf') }] },
      { title: 'Plex.tv refresh', org: 'Plex', body: 'Managed content and layout direction across teams and executives through A/B testing and launch.', links: [] },
      { title: 'Computing Services InfoCenter', org: 'Carnegie Mellon', body: 'Internal SharePoint resource for the division. We streamlined information and filled the gaps.', links: [] },
      { title: 'Social media', org: 'Plex', body: 'Promotional posts, outage notices, and graphics.', links: [] },
    ],
  },
];
