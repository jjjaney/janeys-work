import { site, companies, testimonials } from './site.mjs';
import { work } from './content/work.mjs';
import { services, engagement, faqs } from './content/services.mjs';
import { bio, principles, experience, funFacts } from './content/about.mjs';
import { archive } from './content/archive.mjs';
import { esc, todo, figure, pixel, pixelCorner, floaters, arrow, external } from './lib.mjs';

// ---------------------------------------------------------------------------
// Shared bits
// ---------------------------------------------------------------------------

const hues = ['', 'orange', 'green', 'lilac', 'gold', 'sky'];
const hue = (label) => hues[[...label].reduce((a, c) => a + c.charCodeAt(0), 0) % hues.length];
// Section labels get a colored pixel, not a number: the sections aren't a sequence.
const eyebrow = (_n, label) => `<p class="eyebrow mono${hue(label) ? ' eyebrow--' + hue(label) : ''}">${esc(label)}</p>`;

const eyebrowSpan = (_n, label) => `<span class="eyebrow mono${hue(label) ? ' eyebrow--' + hue(label) : ''}">${esc(label)}</span>`;

// Floating pixels for page headers, in three layers:
//  - around the art (all screen sizes): above, below and beside it
//  - in the open space between the heading and the art (desktop only)
//  - a strip spilling just below the header (all screen sizes)
const artFloat = (seed) => floaters([
  [0, -20, 100, 16, 4, true],   // drifting down onto the pile
  [55, -38, 45, 30, 3, true],   // a few more on the high side (fills the space beside the buttons on phones)
  [-12, 5, 10, 40, 1],          // one off the upper left
], { seed });
const gapFloat = (seed, regions) => floaters(regions, { seed });
// The strip of pixels below a page header, placed by hand like the header art:
// a few small clusters stuck together and a few loose pixels, nine in all
// (odd numbers group better). Each entry: [left %, row, cells, show on phones].
// Rows are 0–2, one grid cell apart; cells are [right, down] offsets in grid cells.
// Phones show five (the first cluster and two loose pixels).
const SPILL = [
  [22, 1, [[0, 0]], false],
  [33, 0, [[0, 0], [1, 0], [1, 1]], true],
  [50, 2, [[0, 0]], false],
  [63, 0, [[0, 0]], true],
  [78, 1, [[0, 0], [1, 0]], false],
  [90, 2, [[0, 0]], true],
];
const SPILL_COLORS = ['#ff7b4d', '#cfa2ed', '#0b704f', '#c99f43', '#b6d8fe', '#6b2337'];
const spill = (seed) => {
  let n = 0;
  const px = SPILL.flatMap(([x, row, cells, phone]) =>
    cells.map(([dx, dy]) => {
      const c = SPILL_COLORS[(seed * 7 + n++ * 5) % SPILL_COLORS.length];
      return `<i${phone ? ' class="m"' : ''} data-dx="${dx}" data-dy="${dy}" style="left:${x}%;top:${((row / 3.4) * 100).toFixed(1)}%;background:${c}"></i>`;
    })
  );
  return `<div class="spill"><div class="floaters" aria-hidden="true">${px.join('')}</div></div>`;
};

const tags = (list) => `<ul class="tags">${list.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`;

// A 5 × 7 pixel question mark: every case study starts with a question.
const QMARK = ['.###.', '#...#', '....#', '...#.', '..#..', '.....', '..#..'];
function pixelQuestion(colors) {
  let rects = '';
  QMARK.forEach((row, y) =>
    [...row].forEach((c, x) => {
      if (c === '#') rects += `<rect x="${x}" y="${y}" width="1" height="1" fill="${colors[(x + y) % colors.length]}"/>`;
    })
  );
  return `<svg class="story__mark" viewBox="0 0 5 7" shape-rendering="crispEdges" aria-hidden="true">${rects}</svg>`;
}

function storyCard(w, i) {
  return `<li class="story story--${w.hue}${i === 0 ? ' story--featured' : ''}">
    <a class="story__link" href="/work/${w.slug}/">
      <div class="story__top">
        <p class="story__client mono">${esc(w.client)}</p>
        ${pixelQuestion(w.badge)}
      </div>
      <h3 class="story__q">${esc(w.hook)}</h3>
      <p class="story__a">${esc(w.cardTitle)}</p>
      <div class="story__foot">
        <span class="story__teaser mono">${esc(w.teaser)}</span>
        <span class="story__cta"><span class="story__go" aria-hidden="true">${arrow}</span></span>
      </div>
    </a>
  </li>`;
}

// A 7 × 5 pixel "rewind" double chevron (earlier work): for the archive card.
// The archive card's mark: a solid pixel clock face with an orange arrow
// curving back around it (counterclockwise), like turning back the clock.
const CLOCK = [
  '.....aaaa.....',
  '....a.........',
  '...a...MMMM...',
  'aaaaa.MMMwMM..',
  '.aaa.MMMMwMMM.',
  '..a..MMMMwMMM.',
  '.....MMMMwwwM.',
  '.....MMMMMMMM.',
  '......MMMMMM..',
  '.......MMMM...',
];
const CLOCK_COLORS = { a: 'var(--orange)', w: 'var(--tint)', M: 'var(--clock)' }; // --clock is set in styles.css
function pixelClock() {
  let rects = '';
  CLOCK.forEach((row, y) =>
    [...row].forEach((c, x) => {
      if (CLOCK_COLORS[c]) rects += `<rect x="${x}" y="${y}" width="1" height="1" fill="${CLOCK_COLORS[c]}"/>`;
    })
  );
  return `<svg class="story__mark story__mark--clock" viewBox="0 0 14 10" shape-rendering="crispEdges" aria-hidden="true">${rects}</svg>`;
}

function archiveStory() {
  return `<li class="story story--archive">
    <a class="story__link" href="/archive/">
      <div class="story__top">
        <p class="story__client mono">The archive · 2020 &amp; earlier</p>
        ${pixelClock()}
      </div>
      <div class="story__body">
        <h3 class="story__q">What did the work look like before all this?</h3>
        <p class="story__a">Editorial, technical writing and web work at GitHub, Plex, Ripl and Carnegie Mellon.</p>
      </div>
      <div class="story__foot">
        <span class="story__teaser mono">14 projects · 2014–2020</span>
        <span class="story__cta"><span class="story__go" aria-hidden="true">${arrow}</span></span>
      </div>
    </a>
  </li>`;
}

const storyGrid = () => `<ul class="stories">${work.map(storyCard).join('')}${archiveStory()}</ul>`;

// How I work: a staircase of pixels. Each step adds one layer on top of the
// last (orange, lilac, green, gold from the bottom up), so step D carries
// every layer before it. Phones get a horizontal bar that grows instead.
const STEPS = [
  ['Audit', 'Inventory what exists, who it serves and where it breaks. Interviews, surveys and data before opinions.'],
  ['Model', 'Define the structure: taxonomy, flows, voice and the decisions each piece of content has to support.'],
  ['Systematize', 'Turn decisions into guidelines, templates, components and agent instructions others can reuse.'],
  ['Ship &amp; measure', 'Publish, train the team, watch the numbers, and iterate like any other product.'],
];
const LAYERS = ['#ff7b4d', '#cfa2ed', '#0b704f', '#c99f43'];
const SPRINKLE = ['#6b2337', '#ff7b4d', '#cfa2ed', '#c99f43'];

function stairSvg(cols, rows, colorAt, cls) {
  let rects = '';
  for (let y = 0; y < rows; y++)
    for (let x = 0; x < cols; x++) {
      const c = colorAt(x, y);
      rects += `<rect x="${x}" y="${y}" width="1" height="1" fill="${c}" stroke="${c}" stroke-width="0.06"/>`;
    }
  return `<svg class="pixel ${cls}" shape-rendering="crispEdges" viewBox="0 0 ${cols} ${rows}" aria-hidden="true" focusable="false">${rects}</svg>`;
}

const rand = (a, b) => {
  let h = Math.imul(a * 374761393 + b * 668265263, 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
};

function stairs() {
  const COLS = 8;
  return `<ol class="stairs">
      ${STEPS.map(([name, body], i) => {
        const rows = i + 1;
        // Layer = distance from the bottom, so every step shares the same bands.
        const layer = (x, y) => {
          const l = rows - 1 - y;
          const r = rand(i * 31 + x, y * 17 + l);
          const pick = SPRINKLE[Math.floor(r * 100) % SPRINKLE.length];
          return r < 0.07 && pick !== LAYERS[l] ? pick : LAYERS[l];
        };
        const up = stairSvg(COLS, rows, layer, 'stairs__up');
        const bar = stairSvg(rows * 2, 2, (x) => LAYERS[Math.floor(x / 2)], 'stairs__bar');
        return `<li style="--rows:${rows}">
        <div class="stairs__text">
          <span class="stairs__n mono">${'ABCD'[i]}</span>
          <h3>${name}</h3>
          <p>${body}</p>
        </div>
        ${up}${bar}
      </li>`;
      }).join('')}
    </ol>`;
}

// Services on the home page: big type on thin rules. Each row opens to show
// what you get (a native <details>, so it works with a keyboard and without JS).
function svcList() {
  return `<ul class="svc-type">
      ${services
        .map(
          (s) => `<li>
        <details>
          <summary>
            <span class="svc-type__dot" aria-hidden="true"></span>
            <span class="svc-type__name">${esc(s.name)}</span>
            <span class="svc-type__for">${esc(s.for)}</span>
            <span class="svc-type__icon" aria-hidden="true"></span>
          </summary>
          <div class="svc-type__more">
            <ul class="svc-type__gets">${s.deliverables.map((d) => `<li>${esc(d)}</li>`).join('')}</ul>
            <a class="link-arrow" href="/services/#${s.id}">More about this <span class="sr-only">(${esc(s.name)})</span>${arrow}</a>
          </div>
        </details>
      </li>`
        )
        .join('')}
    </ul>`;
}

// Kind words: one quote at a time in big type, with a pixel for each quote.
// Without JavaScript all three show, one after another.
function quotes() {
  return `<section class="section quotes" aria-labelledby="quotes-h">
    <div class="wrap">
      ${eyebrow('04', 'Kind words')}
      <h2 id="quotes-h" class="sr-only">What collaborators say</h2>
      <div class="pull" data-pull>
        <div class="pull__stage">
          ${testimonials
            .map(
              (t, i) => `<figure class="pull__item${i === 0 ? ' is-active' : ''}" id="quote-${i + 1}">
            <blockquote><p>${esc(t.quote)}</p></blockquote>
            <figcaption class="mono">${esc(t.org)} <span class="muted">· ${esc(t.context)}</span></figcaption>
          </figure>`
            )
            .join('')}
        </div>
        <div class="pull__dots" role="group" aria-label="Choose a quote">
          ${testimonials
            .map(
              (t, i) => `<button type="button" aria-controls="quote-${i + 1}" aria-pressed="${i === 0}" aria-label="Quote ${i + 1} of ${testimonials.length}"></button>`
            )
            .join('')}
        </div>
      </div>
    </div>
  </section>`;
}

function ctaBand(heading = 'Have a content problem that’s really a systems problem?') {
  return `<section class="cta-band" aria-labelledby="cta-h">
    ${pixelCorner()}
    <div class="wrap cta-band__inner">
      <div>
        <h2 id="cta-h">${heading}</h2>
        <p>Let’s talk about what you’re building.</p>
        <div class="actions"><a class="btn btn--light" href="/contact/">Start a conversation ${arrow}</a></div>
      </div>
    </div>
  </section>`;
}

// ---------------------------------------------------------------------------
// Home
// ---------------------------------------------------------------------------

export function home() {
  return {
    path: '/',
    title: 'Home',
    pageClass: 'page-home',
    body: `
<section class="hero">
  ${gapFloat(3, [
    [50, 18, 6, 50, 2],  // a couple between the copy and the art
  ])}
  ${spill(4)}
  <div class="wrap hero__inner">
    <div class="hero__copy has-flank">
      <div class="flank" data-seed="1" aria-hidden="true"></div>
      <p class="eyebrow mono">${esc(site.role)}</p>
      <h1 class="hero__title"><span class="hero__line">I design the <span class="hl">systems</span></span> <span class="hero__line">behind the words.</span></h1>
      <p class="lede">I’m Janey, a content strategist, content designer and product manager. I’ve led content at FIS, Shopify, GitHub and Carnegie Mellon, building the guidelines, docs and processes that let teams (and their AI tools) get content right at scale.</p>
      <div class="actions">
        <a class="btn" href="/work/">See selected work ${arrow}</a>
        <a class="btn btn--ghost" href="/services/">Work with me</a>
      </div>
    </div>
    <div class="hero__art">
      ${artFloat(5)}
      ${pixel('pixel-composition-16', { organic: true, label: 'Pixel-art composition of colored square tiles' })}
    </div>
  </div>
  <div class="wrap">
    <div class="logos">
      <p class="mono muted">Contributed content at</p>
      <ul data-fit-lines="2">${companies.map((c) => `<li><a href="${esc(c.url)}">${esc(c.name)}</a></li>`).join('')}<li class="logos__more"><a href="/about/#experience">and more ${arrow}</a></li></ul>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="work-h">
  <div class="wrap">
    <div class="section__head">
      ${eyebrow('01', 'Selected work')}
      <h2 id="work-h">Every project starts with a question. Here’s how I answered a few.</h2>
    </div>
    ${storyGrid()}
  </div>
</section>

<section class="section section--surface section--stairs" aria-labelledby="how-h">
  <div class="wrap">
    <div class="section__head">
      ${eyebrow('02', 'How I work')}
      <h2 id="how-h">Content is a product surface. I treat it like one.</h2>
    </div>
    ${stairs()}
  </div>
</section>

<section class="section" aria-labelledby="svc-h">
  <div class="wrap">
    <div class="section__head section__head--split">
      <div>
        ${eyebrow('03', 'Services')}
        <h2 id="svc-h">Ways we can work together</h2>
      </div>
      <a class="link-arrow" href="/services/">All services &amp; FAQ ${arrow}</a>
    </div>
    ${svcList()}
  </div>
</section>

${quotes()}
${ctaBand()}
`,
  };
}

// ---------------------------------------------------------------------------
// Work index + case studies
// ---------------------------------------------------------------------------

export function workIndex() {
  return {
    path: '/work/',
    title: 'Work',
    description: 'Case studies in content strategy, content design, documentation, localization and product management.',
    body: `
<section class="page-head">
  <div class="wrap">
    ${eyebrow('—', 'Case studies')}
    <h1>Selected work</h1>
    <p class="lede">Projects where the words were only half the job. The other half was the system that made them work.</p>
  </div>
</section>
<section class="section section--tight">
  <div class="wrap">
    ${storyGrid()}
  </div>
</section>
${ctaBand()}`,
  };
}

export function caseStudy(w, i) {
  const prev = work[(i - 1 + work.length) % work.length];
  const next = work[(i + 1) % work.length];
  const outcomes = w.outcomes
    .map((o) =>
      o.todo
        ? `<li class="outcome outcome--todo">${todo(o.todo)}</li>`
        : `<li class="outcome"><span class="outcome__stat">${esc(o.stat)}</span><span class="outcome__label">${esc(o.label)}</span></li>`
    )
    .join('');

  return {
    path: `/work/${w.slug}/`,
    title: w.title,
    description: w.summary,
    body: `
<article class="case">
  <header class="case__head">
    ${gapFloat(6 + i, [
      [56, 15, 6, 45, 2],
    ])}
    ${spill(7 + i)}
    <div class="wrap case__head-inner">
      <div class="has-flank">
        <div class="flank" data-seed="${2 + i}" aria-hidden="true"></div>
        <p class="eyebrow mono"><a href="/work/">Work</a> <span aria-hidden="true">/</span> ${esc(w.client)}</p>
        <h1>${esc(w.title)}</h1>
        <p class="lede">${esc(w.summary)}</p>
      </div>
      <div class="case__art">${artFloat(8 + i)}${pixel(w.art, { organic: true })}</div>
    </div>
    <div class="wrap">
      <dl class="meta">
        <div><dt class="mono">Client</dt><dd>${esc(w.client)}</dd></div>
        <div><dt class="mono">Role</dt><dd>${esc(w.role)}</dd></div>
        <div><dt class="mono">Timeframe</dt><dd>${esc(w.timeframe)}</dd></div>
        <div><dt class="mono">Disciplines</dt><dd>${esc(w.disciplines.join(', '))}</dd></div>
      </dl>
    </div>
  </header>

  <div class="wrap case__body">
    ${w.todos.map((t) => todo(t)).join('')}
    ${w.cover ? `<figure class="case__cover"><img src="${esc(w.cover.src)}" alt="${esc(w.cover.alt)}" loading="lazy" decoding="async">${w.cover.caption ? `<figcaption>${esc(w.cover.caption)}</figcaption>` : ''}</figure>` : ''}

    <section class="case__section" aria-labelledby="ctx-${w.slug}">
      <h2 id="ctx-${w.slug}" class="case__h">${eyebrowSpan('01', 'Context')}</h2>
      <div class="prose">${w.context}</div>
    </section>

    <section class="case__section" aria-labelledby="work-${w.slug}">
      <h2 id="work-${w.slug}" class="case__h">${eyebrowSpan('02', 'The work')}</h2>
      <ul class="highlights">
        ${w.highlights
          .map(
            (h) => `<li class="highlight">
          <div class="highlight__text"><h3>${esc(h.title)}</h3><p>${h.body}</p></div>
          ${figure(h.image, w.slug)}
        </li>`
          )
          .join('')}
      </ul>
    </section>

    <section class="case__section" aria-labelledby="out-${w.slug}">
      <h2 id="out-${w.slug}" class="case__h">${eyebrowSpan('03', 'Outcomes')}</h2>
      <ul class="outcomes">${outcomes}</ul>
    </section>

    ${
      w.links.length
        ? `<section class="case__section" aria-labelledby="links-${w.slug}">
      <h2 id="links-${w.slug}" class="case__h">${eyebrowSpan('04', 'See it live')}</h2>
      <ul class="links">${w.links.map((l) => `<li><a href="${esc(l.href)}">${esc(l.label)} ${external}</a></li>`).join('')}</ul>
    </section>`
        : ''
    }
  </div>

  <nav class="case__nav wrap" aria-label="More case studies">
    <a href="/work/${prev.slug}/"><span class="mono muted">Previous</span><span>${esc(prev.client)}</span></a>
    <a href="/work/${next.slug}/"><span class="mono muted">Next</span><span>${esc(next.client)} ${arrow}</span></a>
  </nav>
</article>
${ctaBand('Want results like these on your team?')}`,
  };
}

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

export function servicesPage() {
  return {
    path: '/services/',
    title: 'Services',
    description: 'Content strategy, content design, content systems, documentation and content-led product management.',
    body: `
<section class="page-head">
  <div class="wrap">
    ${eyebrow('—', 'Services')}
    <h1>Work with me</h1>
    <p class="lede">I help teams build content that scales: clear for the people reading it, and structured for the teams and tools maintaining it.</p>
    ${todo('Your current Services page is password-protected, so these offerings were drafted from your skills and FAQ. Review names, descriptions and deliverables. Add pricing or packages if you want them public.')}
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <ul class="svc-list">
      ${services
        .map(
          (s, i) => `<li class="svc-row" id="${s.id}">
        <div class="svc-row__head">
          <span class="svc__n" aria-hidden="true"></span>
          <h2>${esc(s.name)}</h2>
          <p class="svc-row__for">${esc(s.for)}</p>
        </div>
        <div class="svc-row__body">
          <p>${esc(s.body)}</p>
          <ul class="checks">${s.deliverables.map((d) => `<li>${esc(d)}</li>`).join('')}</ul>
          <a class="link-arrow" href="/contact/?topic=${encodeURIComponent(s.name)}">Ask about this ${arrow}</a>
        </div>
      </li>`
        )
        .join('')}
    </ul>
  </div>
</section>

<section class="section section--surface" aria-labelledby="free-h">
  <div class="wrap free">
    <div class="free__art">${pixel('pixel-composition-15', { crop: true })}</div>
    <div>
      ${eyebrow('★', 'Free, for early- to mid-career folks')}
      <h2 id="free-h">Resume, portfolio &amp; case-study reviews</h2>
      <p>I’ll review your resume, CV, portfolio or case studies for general content feedback or from a hiring manager’s perspective, for free. No catch. Clarity helps you land the next opportunity, and that’s the satisfaction for me.</p>
      <div class="actions">
        <a class="btn" href="/contact/?topic=Free%20review">Request a review ${arrow}</a>
        ${site.kofiUrl ? `<a class="btn btn--ghost" href="${esc(site.kofiUrl)}">Buy me a Ko-fi</a>` : todo('Add your Ko-fi link in <code>src/site.mjs</code> to show a "Buy me a Ko-fi" button here.', { inline: true })}
      </div>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="eng-h">
  <div class="wrap">
    <div class="section__head">${eyebrow('—', 'Engagement models')}<h2 id="eng-h">How we can work together</h2></div>
    <ul class="engage">
      ${engagement.map((e) => `<li><p class="mono engage__note">${esc(e.note)}</p><h3>${esc(e.name)}</h3><p>${esc(e.body)}</p></li>`).join('')}
    </ul>
  </div>
</section>

<section class="section section--tight" aria-labelledby="faq-h">
  <div class="wrap faq">
    <div class="section__head">${eyebrow('?', 'Common questions')}<h2 id="faq-h">FAQ</h2></div>
    <div class="faq__list">
      ${faqs
        .map(
          (f) => `<details class="faq__item">
        <summary>${esc(f.q)}<span class="faq__icon" aria-hidden="true"></span></summary>
        <div class="faq__a"><p>${esc(f.a)}</p>${f.todo ? todo(f.todo) : ''}</div>
      </details>`
        )
        .join('')}
    </div>
  </div>
</section>
${ctaBand('Not sure which service fits?')}`,
  };
}

// ---------------------------------------------------------------------------
// About
// ---------------------------------------------------------------------------

export function aboutPage() {
  return {
    path: '/about/',
    title: 'About',
    description: 'Janey Annis: content strategist, content designer and product manager. Experience at FIS, Shopify, GitHub, Plex and Carnegie Mellon.',
    body: `
<section class="page-head page-head--art">
  ${gapFloat(21, [
    [58, 10, 4, 60, 2],   // a couple between the bio and the art
  ])}
  ${spill(22)}
  <div class="wrap about-head">
    <div class="has-flank">
      <div class="flank" data-seed="9" aria-hidden="true"></div>
      ${eyebrow('—', 'About')}
      <h1>Hi, I’m Janey.</h1>
      ${bio.map((p, i) => `<p class="${i === 0 ? 'lede' : ''}">${esc(p)}</p>`).join('')}
      <p>My work spans information systems, devtools, academia, ecommerce, finance and entertainment.</p>
      <div class="actions"><a class="btn" href="/contact/">Get in touch ${arrow}</a><a class="btn btn--ghost" href="${site.linkedin}">LinkedIn ${external}</a></div>
      ${todo('Add a link to your resume (PDF in <code>/public/</code>) if you want a download button here.')}
    </div>
    <div class="portrait">
      ${artFloat(23)}
      ${pixel('pixel-composition-12', { organic: true })}
      ${todo('Optional: add a photo of you. The current site uses a childhood photo, which is charming. Save it as <code>/public/images/janey.jpg</code> and replace this art in <code>aboutPage()</code> in <code>src/pages.mjs</code>.')}
    </div>
  </div>
</section>

<section class="section section--surface" aria-labelledby="pr-h">
  <div class="wrap">
    <div class="section__head">${eyebrow('01', 'Operating principles')}<h2 id="pr-h">How I think about content</h2></div>
    <ul class="principles">
      ${principles.map((p, i) => `<li><h3>${esc(p.title)}</h3><p>${esc(p.body)}</p></li>`).join('')}
    </ul>
    ${todo('These principles were drafted to frame you as a product and systems thinker. Rewrite them in your own voice.')}
  </div>
</section>

<section class="section" id="experience" aria-labelledby="xp-h">
  <div class="wrap xp">
    <div class="section__head">${eyebrow('02', 'Experience')}<h2 id="xp-h">Where I’ve worked</h2></div>
    <ol class="timeline">
      ${experience
        .map(
          (e) => `<li>
        <p class="timeline__year mono">${esc(e.year)}</p>
        <div><h3>${esc(e.org)}</h3><ul>${e.roles.map((r) => `<li>${esc(r)}</li>`).join('')}</ul></div>
      </li>`
        )
        .join('')}
    </ol>
  </div>
</section>

<section class="section section--tight" aria-labelledby="ff-h">
  <div class="wrap">
    <div class="section__head">${eyebrow('03', 'Fun facts')}<h2 id="ff-h">Off the clock</h2></div>
    <ul class="facts">${funFacts.map((f) => `<li>${f}</li>`).join('')}</ul>
  </div>
</section>
${ctaBand()}`,
  };
}

// ---------------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------------

export function contactPage() {
  const topics = [...services.map((s) => s.name), 'Free review', 'Full-time role', 'Something else'];
  const action = site.formspreeId ? `https://formspree.io/f/${site.formspreeId}` : '';
  return {
    path: '/contact/',
    title: 'Contact',
    description: 'Contact Janey about content strategy, content design, documentation, product management or a free resume review.',
    body: `
<section class="page-head">
  <div class="wrap contact">
    <div>
      ${eyebrow('—', 'Contact')}
      <h1>Let’s work together</h1>
      <p class="lede">Send a short note about what you’re working on. Share as much or as little as you like, and we’ll sort out details on a call.</p>
      <ul class="contact__alt">
        <li><a href="${site.linkedin}">Message me on LinkedIn ${external}</a></li>
        ${site.email ? `<li><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></li>` : ''}
        ${site.bookingUrl ? `<li><a href="${esc(site.bookingUrl)}">Book a call ${external}</a></li>` : ''}
      </ul>
      ${!site.bookingUrl ? todo('Optional: add a booking link (Calendly or similar) as <code>bookingUrl</code> in <code>src/site.mjs</code>.') : ''}
      <div class="contact__art">${pixel('pixel-composition-13')}</div>
    </div>
    <div>
      ${!action ? todo('The form isn’t connected yet. Create a free form at <a href="https://formspree.io">formspree.io</a> and paste its ID as <code>formspreeId</code> in <code>src/site.mjs</code>. Until then, submitting shows a note pointing to LinkedIn.') : ''}
      <form class="form" ${action ? `action="${action}" method="POST"` : 'data-unconnected'} data-contact>
        <div class="field"><label for="f-name">Name</label><input id="f-name" name="name" autocomplete="name" required></div>
        <div class="field"><label for="f-email">Email</label><input id="f-email" name="email" type="email" autocomplete="email" required></div>
        <div class="field"><label for="f-topic">What’s this about?</label>
          <select id="f-topic" name="topic">${topics.map((t) => `<option>${esc(t)}</option>`).join('')}</select></div>
        <div class="field"><label for="f-msg">Message</label><textarea id="f-msg" name="message" rows="6" required placeholder="A little about your team, the problem and your timeline."></textarea></div>
        <input type="text" name="_gotcha" class="sr-only" tabindex="-1" autocomplete="off" aria-hidden="true">
        <button class="btn" type="submit">Send message ${arrow}</button>
        <p class="form__status" role="status" aria-live="polite"></p>
      </form>
    </div>
  </div>
</section>`,
  };
}

// ---------------------------------------------------------------------------
// Archive + 404
// ---------------------------------------------------------------------------

export function archivePage() {
  return {
    path: '/archive/',
    title: 'Archive',
    description: 'Work from 2020 and earlier: editorial, marketing, technical writing and web at GitHub, Plex, Carnegie Mellon and more.',
    body: `
<section class="page-head">
  <div class="wrap">
    ${eyebrow('—', '2020 & earlier')}
    <h1>The archive</h1>
    <p class="lede">Marketing, editorial, technical writing and web work from GitHub, Plex, Ripl and Carnegie Mellon.</p>
    ${todo('Archive links still point to files on your Squarespace site. Download those PDFs into <code>/public/archive/</code> and update the links in <code>src/content/archive.mjs</code> before you cancel Squarespace.')}
  </div>
</section>
${archive
  .map(
    (g, gi) => `<section class="section section--tight" aria-labelledby="ar-${gi}">
  <div class="wrap">
    <div class="section__head">${eyebrow(String(gi + 1).padStart(2, '0'), g.group)}<h2 id="ar-${gi}" class="sr-only">${esc(g.group)}</h2></div>
    <ul class="archive">
      ${g.items
        .map(
          (it) => `<li>
        <p class="mono muted">${esc(it.org)}</p>
        <h3>${esc(it.title)}</h3>
        <p>${esc(it.body)}</p>
        ${it.links.length ? `<p class="archive__links">${it.links.map((l) => `<a href="${esc(l.href)}">${esc(l.label)} ${external}</a>`).join('')}</p>` : ''}
      </li>`
        )
        .join('')}
    </ul>
  </div>
</section>`
  )
  .join('')}
${ctaBand()}`,
  };
}

export function notFound() {
  return {
    path: '/404.html',
    title: 'Page not found',
    body: `
<section class="page-head notfound">
  <div class="wrap">
    <div class="notfound__art">${pixel('pixel-composition-14')}</div>
    ${eyebrow('404', 'Missing tile')}
    <h1>This page wandered off the grid.</h1>
    <p class="lede">It may have moved when the site was rebuilt.</p>
    <div class="actions"><a class="btn" href="/">Go home ${arrow}</a><a class="btn btn--ghost" href="/work/">See work</a></div>
  </div>
</section>`,
  };
}
