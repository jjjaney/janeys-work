import { site, companies, testimonials } from './site.mjs';
import { work } from './content/work.mjs';
import { services, engagement, faqs, disciplineLine, freeReview } from './content/services.mjs';
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
// The card's pixel question mark. Light and dark mode use different colors so
// every square keeps at least 3:1 contrast against the card (WCAG 1.4.11).
function pixelQuestion(dark, light = dark) {
  let rects = '';
  QMARK.forEach((row, y) =>
    [...row].forEach((c, x) => {
      const n = (x + y) % dark.length;
      if (c === '#') rects += `<rect x="${x}" y="${y}" width="1" height="1" style="--l:${light[n]};--d:${dark[n]}"/>`;
    })
  );
  return `<svg class="story__mark story__mark--q" viewBox="0 0 5 7" shape-rendering="crispEdges" aria-hidden="true">${rects}</svg>`;
}

function storyCard(w, i) {
  return `<li class="story story--${w.hue}${i === 0 ? ' story--featured' : ''}">
    <a class="story__link" href="/work/${w.slug}/">
      <div class="story__top">
        <p class="story__client mono">${esc(w.client)}</p>
        ${pixelQuestion(w.badge, w.badgeLight)}
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
const CLOCK_COLORS = { a: 'var(--clock-arrow)', w: 'var(--tint)', M: 'var(--clock)' }; // --clock is set in styles.css
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
        <div class="pull__logos" aria-hidden="true">
          ${testimonials
            .map(
              (t, i) => `<div class="pull__logo${i === 0 ? ' is-active' : ''}${t.logo ? '' : ' pull__logo--name'}">${
                t.logo
                  ? `<img src="${esc(t.logo)}" alt="" class="pull__logo-light">${t.logoDark ? `<img src="${esc(t.logoDark)}" alt="" class="pull__logo-dark">` : ''}`
                  : `<span>${esc(t.company)}</span>`
              }</div>`
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
      ${testimonials.some((t) => !t.logo) ? todo('Add each company’s logo next to its quote: save the files in <code>/public/images/logos/</code> and set <code>logo</code> for each quote in <code>src/site.mjs</code>. Until then the company name shows in its place.') : ''}
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
${spill(4)}

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
      ${eyebrow('03', 'Services')}
      <div>
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

// Work page: the results, as big numbers standing on a skyline of organic
// pixel columns (like the header art), after the case-study cards.
const RESULTS = [
  { stat: '500K+', label: 'members reached by weekly updates', who: 'The Browser Company', colors: ['#ff7b4d', '#cfa2ed'], rows: 4 },
  { stat: '4', label: 'public media partners', who: 'New_ Public', colors: ['#b6d8fe', '#cfa2ed'], rows: 3 },
  { stat: 'GitHub', label: 'adopted the Ally.Guide program internally', who: 'Ally.Guide', colors: ['#0b704f', '#b6d8fe'], rows: 5 },
  { stat: '2', label: 'new countries launched', who: 'GitHub Sponsors', colors: ['#c99f43', '#ff7b4d'], rows: 2 },
  { stat: '3', label: 'platforms on one release-notes process', who: 'The Browser Company', colors: ['#cfa2ed', '#c99f43'], rows: 3 },
];

// a better-mixed random number for the results skyline (rand() gives
// near-identical values for neighbouring columns with these inputs)
const mix = (a, b) => rand(Math.floor(rand(a * 7919 + 13, b) * 1e6), b * 31 + a);

function resultColumn({ colors, rows }, i) {
  // Pixels are a fixed size (the same as the closing band's corner art), so the
  // art is drawn wider than any column and trimmed to fit: W columns, H rows.
  const W = 16, base = rows + 2, H = base + 2;
  let rects = '';
  const at = (x, y, c, cls = '', style = '') => (rects += `<rect${cls ? ` class="${cls}"` : ''} x="${x}" y="${y}" width="1" height="1" fill="${c}" stroke="${c}" stroke-width="0.06"${style ? ` style="${style}"` : ''}/>`);
  const pick = (x, y) => colors[mix(x + i * 20, y * 13 + 5) < 0.8 ? 0 : 1];
  for (let x = 0; x < W; x++) {
    // ragged top: columns rise one row higher or lower than their neighbours
    const top = 2 + Math.floor(mix(x + i * 20, 3) * 2.4);
    // ragged bottom: most columns sit on the baseline, some stop short, some jut down
    const r = mix(x + i * 20, 41);
    const bottom = r < 0.12 ? base - 1 : r < 0.82 ? base : base + 1;
    for (let y = top; y <= bottom; y++) {
      if (y === top && y < base && mix(x * 3 + i, y + 50) < 0.25) continue; // fray the top
      if (y > top && y < base && mix(x + i * 20, y * 7 + 3) < 0.06) continue; // the odd hole
      at(x, y, pick(x, y));
    }
  }
  // a loose pixel dropping off the bottom now and then
  [[1 + (i % 3), H - 1], [4 + (i % 2), H - 1]].forEach(([x, y], k) => mix(i * 3 + k, 97) < 0.4 && at(x, y, colors[(k + 1) % 2]));
  // loose pixels above drift up and down, each on its own timing (kept near the
  // left, where every screen width still shows them)
  [[1 + (i % 2), 0], [3 + (i % 2), 1]].forEach(([x, y], k) => {
    if (mix(i, k + 70) >= 0.7) return;
    at(x, y, colors[k % 2], 'results__drift', `--t:${(3.2 + mix(k, i + 9) * 2.4).toFixed(2)}s;--w:${(mix(i * 5, k + 2) * -3).toFixed(2)}s`);
  });
  return `<svg class="pixel results__px" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMinYMax slice" style="--h:${H}" shape-rendering="crispEdges" aria-hidden="true">${rects}</svg>`;
}

export function workIndex() {
  return {
    path: '/work/',
    title: 'Work',
    description: 'Case studies in content strategy, content design, documentation, localization and product management.',
    body: `
<section class="page-head">
  <div class="wrap">
    ${eyebrow('—', 'Selected work')}
    <h1 class="work-h1"><span>Every project starts with a question.</span> <span>Here’s how I answered a few.</span></h1>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    ${storyGrid()}
  </div>
</section>
<section class="results" aria-labelledby="results-h">
  <div class="wrap">
    <p class="eyebrow mono">By the numbers</p>
    <h2 id="results-h">Some cool results</h2>
  </div>
  <ul class="results__list">
    ${RESULTS.map(
      (r, i) => `<li class="results__item">
      <div class="results__text">
        <p class="results__stat">${esc(r.stat)}</p>
        <p class="results__label">${esc(r.label)}<span class="mono">${esc(r.who)}</span></p>
      </div>
      ${resultColumn(r, i)}
    </li>`
    ).join('')}
  </ul>
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
    <div class="wrap case__head-inner">
      <div>
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
  ${spill(7 + i)}

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
    description: 'Content strategy and editorial, content design and storytelling, content systems, documentation and training, and product management and marketing.',
    body: `
<section class="page-head">
  <div class="wrap">
    ${eyebrow('—', 'Services')}
    <h1>Work with me</h1>
    <p class="lede">I help teams build content that scales: clear for the people reading it, and structured for the teams and tools maintaining it.</p>
    <p class="svc-disciplines mono">${disciplineLine.map(esc).join('<span aria-hidden="true"> · </span>')}</p>
    ${todo('Services now include everything from your Work with me page, merged into five groups. Review the names and lists, and add pricing or packages if you want them public.')}
  </div>
</section>

<div class="svc-jumpwrap">
<nav class="svc-jump" aria-label="Services on this page">
  <div class="wrap">
    <ul>${services.map((s) => `<li><a href="#${s.id}" style="--c: var(--${({ peach: 'orange', lilac: 'lilac', mint: 'green', gold: 'gold', sky: 'sky' })[s.tint]})">${esc(s.short)}</a></li>`).join('')}</ul>
  </div>
</nav>

<div class="svc-bands">
  ${services
    .map(
      (s) => `<section class="svc-band svc-band--${s.tint}" id="${s.id}" aria-labelledby="${s.id}-h">
    <div class="wrap">
      <div class="svc-band__top">
        <h2 id="${s.id}-h">${esc(s.name)}</h2>
        <p class="svc-band__body">${esc(s.body)}</p>
      </div>
      <ul class="svc-band__gets" style="--cols: ${s.deliverables.length % 4 === 0 ? 4 : 3}">${s.deliverables.map((d) => `<li>${esc(d)}</li>`).join('')}</ul>
      <a class="link-arrow" href="/contact/?topic=${encodeURIComponent(s.name)}">Ask about ${esc(s.short.toLowerCase())} work ${arrow}</a>
    </div>
  </section>`
    )
    .join('')}
</div>
</div>

<section class="section" aria-labelledby="free-h">
  <div class="wrap free">
    <div class="free__art">${pixelResume()}</div>
    <div>
      ${eyebrow('★', 'Free, for early- to mid-career folks')}
      <h2 id="free-h">Resume, portfolio &amp; case-study reviews</h2>
      <p>I’ve been on many hiring committees and worked with many hiring managers, and with a long and varied career behind me, I’d like to help others build theirs. Whether you’re searching for a role or ready for a resume or portfolio refresh, I’ll review it for general content feedback or from a hiring manager’s perspective, for free. No catch.</p>
      <ul class="checks">${freeReview.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
      <div class="actions">
        <a class="btn" href="/contact/?topic=Free%20review">Request a review ${arrow}</a>
        ${site.kofiUrl ? `<a class="btn btn--ghost" href="${esc(site.kofiUrl)}">Buy me a Ko-fi</a>` : ''}
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

<section class="section section--tight section--faq" aria-labelledby="faq-h">
  <div class="wrap faq">
    ${eyebrow('?', 'Common questions')}
    <div class="section__head"><h2 id="faq-h">FAQ</h2></div>
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
  <div class="wrap about-head">
    <div>
      ${eyebrow('—', 'About')}
      <h1>Hi, I’m Janey.</h1>
      ${bio.map((p, i) => `<p class="${i === 0 ? 'lede' : ''}">${esc(p)}</p>`).join('')}
      <p>My work spans information systems, devtools, academia, ecommerce, finance and entertainment.</p>
      <div class="actions"><a class="btn" href="/contact/">Get in touch ${arrow}</a><a class="btn btn--ghost" href="${site.linkedin}">LinkedIn ${external}</a></div>
    </div>
    <div class="portrait">
      ${artFloat(23)}
      ${pixel('pixel-composition-12', { organic: true })}
    </div>
  </div>
</section>
${spill(22)}

<section class="section section--surface" aria-labelledby="pr-h">
  <div class="wrap">
    <div class="section__head">${eyebrow('01', 'Operating principles')}<h2 id="pr-h">How I think about content</h2></div>
    <ul class="principles">
      ${principles.map((p, i) => `<li><h3>${esc(p.title)}</h3><p>${esc(p.body)}</p></li>`).join('')}
    </ul>
  </div>
</section>

<section class="section" id="experience" aria-labelledby="xp-h">
  <div class="wrap xp">
    ${eyebrow('02', 'Experience')}
    <div class="section__head"><h2 id="xp-h">Where I’ve worked</h2></div>
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

// Services page, free review: an organic pixel résumé being looked over, with
// checkmarks beside a few lines and a magnifying glass. Same style as the contact
// envelopes: frayed edges, loose pixels and a gently bobbing magnifier. Grid units are pixels.
function pixelResume() {
  const W = 24, H = 24;
  const C = { L: '#cfa2ed', P: '#4f33cc', G: '#c99f43', g: '#0b704f', O: '#ff7b4d', M: '#6b2337', S: '#b6d8fe', F: '#a77fd6' };
  const page = new Map();
  const glass = new Map();
  const put = (m, x, y, c) => m.set(`${x},${y}`, [x, y, c]);
  const x0 = 2, y0 = 2, w = 14, h = 19;
  // the sheet, with its top-right corner folded over
  for (let y = y0; y < y0 + h; y++)
    for (let x = x0; x < x0 + w; x++) {
      const fx = x - (x0 + w - 4), fy = y - y0; // fold triangle
      if (fx >= 0 && fy < 4 && fx > fy) continue;
      put(page, x, y, fx >= 0 && fy < 4 && fx === fy ? 'F' : 'L');
    }
  for (let i = 0; i < 4; i++) for (let j = 0; j <= i; j++) put(page, x0 + w - 4 + j, y0 + i, j === i ? 'F' : 'F');
  // photo block and name lines
  for (let y = y0 + 2; y < y0 + 5; y++) for (let x = x0 + 2; x < x0 + 5; x++) put(page, x, y, 'G');
  [[y0 + 2, 6, 'P'], [y0 + 4, 4, 'P']].forEach(([y, len, c]) => { for (let x = x0 + 6; x < x0 + 6 + len; x++) put(page, x, y, c); });
  // text lines, some with a checkmark beside them
  [[y0 + 7, 6, true], [y0 + 9, 8, false], [y0 + 11, 9, false], [y0 + 13, 8, false], [y0 + 15, 9, false], [y0 + 17, 6, false]].forEach(([y, len, check]) => {
    for (let x = x0 + 2; x < x0 + 2 + len; x++) put(page, x, y, 'P');
    // a small tick: down one, then up two
    if (check) [[0, 0], [1, 1], [2, 0], [3, -1]].forEach(([dx, dy]) => put(page, x0 + w - 5 + dx, y + dy, 'g'));
  });
  // fray the sheet: drop some edge pixels, more along the bottom
  for (const [k, [x, y]] of [...page]) {
    const r = rand(x * 11 + 5, y * 7 + 3);
    const left = x === x0, right = x === x0 + w - 1, bottom = y === y0 + h - 1;
    if ((bottom && r < 0.4) || ((left || right) && r < 0.18)) page.delete(k);
  }
  // magnifying glass: an orange ring over the lower right, with a maroon handle
  const cx = 10, cy = 17, R = 4; // over the lower lines, as if reading them
  const lens = new Map();
  for (let y = cy - R - 1; y <= cy + R + 1; y++)
    for (let x = cx - R - 1; x <= cx + R + 1; x++) {
      const d = Math.hypot(x - cx, y - cy);
      if (d > R - 0.6 && d <= R + 0.5) put(glass, x, y, 'O');
      else if (d <= R - 0.6) put(lens, x, y, 'S');
    }
  // a glint on the glass
  [[cx - 2, cy - 2], [cx - 1, cy - 2], [cx - 2, cy - 1]].forEach(([x, y]) => lens.delete(`${x},${y}`) || true);
  [[14, 21], [15, 21], [15, 22], [16, 22], [16, 23], [17, 23]].forEach(([x, y]) => put(glass, x, y, 'M'));
  // loose pixels
  [[0, 6, 'S'], [18, 3, 'G'], [21, 8, 'L'], [1, 22, 'g'], [9, 23, 'L'], [23, 12, 'O']].forEach(([x, y, c]) => put(page, x, y, c));

  const rect = ([x, y, c]) => `<rect x="${x}" y="${y}" width="1" height="1" fill="${C[c]}" stroke="${C[c]}" stroke-width="0.08"/>`;
  return `<div class="rev" aria-hidden="true"><svg viewBox="0 0 ${W} ${H}" shape-rendering="crispEdges"><g>${[...page.values()].map(rect).join('')}</g><g class="env__bob"><g class="rev__glass">${[...lens.values()].filter(([x, y]) => page.has(`${x},${y}`)).map(rect).join('')}</g>${[...lens.values()].filter(([x, y]) => !page.has(`${x},${y}`)).map(rect).join('')}${[cx - 2, cx - 1].map((x) => `<rect x="${x}" y="${cy - 2}" width="1" height="1" fill="#fffdf8"/>`).join('')}<rect x="${cx - 2}" y="${cy - 1}" width="1" height="1" fill="#fffdf8"/>${[...glass.values()].map(rect).join('')}</g></svg></div>`;
}

// Contact page: three organic pixel envelopes in the header-art style. Edges
// are eroded and a few loose pixels drift between them; a star, a checkmark and
// a sparkle take turns floating up out of them, and the two smaller envelopes bob. No entrance animation: it's all in place on load. Grid units are pixels.
function pixelEnvelopes() {
  const W = 34, H = 22;
  const C = { S: '#b6d8fe', L: '#cfa2ed', P: '#4f33cc', O: '#ff7b4d', G: '#c99f43', M: '#6b2337', g: '#0b704f' };
  const cells = new Map();
  const put = (x, y, c, bob = '') => cells.set(`${x},${y}`, [x, y, c, bob]);
  const drop = (x, y) => cells.delete(`${x},${y}`);

  // One envelope: body, a V-shaped flap with colored edges, then erosion so
  // it frays at the edges like the header art.
  const envelope = (x0, y0, w, h, { body, flap, edge, accent }, seed, bob) => {
    for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) put(x, y, body, bob);
    const tip = Math.round(h * 0.68);
    const outline = new Set(); // flap outline: both sides of the V and its point, kept whole
    for (let r = 0; r < tip; r++) {
      const l = x0 + Math.round((r * (w - 1)) / 2 / tip), rr = x0 + w - 1 - Math.round((r * (w - 1)) / 2 / tip);
      for (let x = l; x <= rr; x++) {
        const isEdge = r > 0 && (x === l || x === rr);
        put(x, y0 + r, isEdge ? edge : flap, bob);
        if (isEdge) outline.add(`${x},${y0 + r}`);
      }
    }
    // close the point of the V (only if its last row left a gap)
    const lastL = x0 + Math.round(((tip - 1) * (w - 1)) / 2 / tip), lastR = x0 + w - 1 - Math.round(((tip - 1) * (w - 1)) / 2 / tip);
    if (lastR - lastL > 1) {
      const l = x0 + Math.round((tip * (w - 1)) / 2 / tip), rr = x0 + w - 1 - Math.round((tip * (w - 1)) / 2 / tip);
      for (let x = Math.min(l, rr); x <= Math.max(l, rr); x++) (put(x, y0 + tip, edge, bob), outline.add(`${x},${y0 + tip}`));
    }
    // paper texture
    for (let y = y0 + 1; y < y0 + h; y++)
      for (let x = x0; x < x0 + w; x++) if (cells.get(`${x},${y}`)?.[2] === body && rand(x * 7 + seed, y * 3) < 0.07) put(x, y, accent, bob);
    // fray: drop some edge pixels (more along the bottom), and the odd one inside
    for (let y = y0; y < y0 + h; y++)
      for (let x = x0; x < x0 + w; x++) {
        const edgeX = x === x0 || x === x0 + w - 1, bottom = y === y0 + h - 1, nearBottom = y === y0 + h - 2;
        const r = rand(x + seed * 31, y + seed * 17);
        if (outline.has(`${x},${y}`)) continue;
        if ((bottom && r < 0.4) || (edgeX && r < 0.22) || (nearBottom && edgeX && r < 0.5) || (!edgeX && !bottom && y > y0 + tip && r < 0.025)) drop(x, y);
      }
  };

  envelope(1, 9, 16, 11, { body: 'S', flap: 'L', edge: 'P', accent: 'L' }, 3, '');
  envelope(20, 2, 11, 8, { body: 'G', flap: 'O', edge: 'M', accent: 'O' }, 8, 'a');
  envelope(23, 13, 8, 6, { body: 'L', flap: 'S', edge: 'g', accent: 'S' }, 13, 'b');
  // a stamp on the big one
  for (let y = 10; y <= 12; y++) for (let x = 12; x <= 14; x++) put(x, y, x === 13 && y === 11 ? 'G' : 'O');
  // loose pixels drifting off and between them
  [[0, 17, 'g'], [3, 6, 'L'], [17, 8, 'O'], [18, 14, 'G'], [19, 11, 'S'], [32, 5, 'L'], [33, 11, 'O'], [21, 20, 'M'], [26, 11, 'S'], [12, 21, 'L'], [32, 17, 'G']]
    .forEach(([x, y, c]) => put(x, y, c));

  const rect = ([x, y, c]) => `<rect class="env__px" x="${x}" y="${y}" width="1" height="1" fill="${C[c]}" stroke="${C[c]}" stroke-width="0.08"/>`;
  const all = [...cells.values()];
  // each small envelope is its own group so it bobs as one piece
  const px = ['', 'a', 'b'].map((k) => `<g${k ? ` class="env__bob env__bob--${k}"` : ''}>${all.filter((c) => c[3] === k).map(rect).join('')}</g>`).join('');
  // small pixel shapes that float up out of the envelopes in turn
  const SHAPES = {
    star: { color: '#c99f43', rows: ['..X..', '.XXX.', 'XXXXX', '.XXX.', '.X.X.'] },
    check: { color: '#0b704f', rows: ['....X', '...X.', 'X.X..', '.X...'] },
    sparkle: { color: '#ff7b4d', rows: ['.X.', 'XXX', '.X.'] },
  };
  const floater = (name, x0, y0, n) => {
    const { color, rows } = SHAPES[name];
    const rects = rows.flatMap((row, y) => [...row].map((c, x) => (c === 'X' ? `<rect x="${x0 + x}" y="${y0 + y}" width="1" height="1"/>` : ''))).join('');
    return `<g class="env__float env__float--${n}" fill="${color}" stroke="${color}" stroke-width="0.08">${rects}</g>`;
  };
  return `<div class="env" aria-hidden="true"><svg viewBox="0 0 ${W} ${H}" shape-rendering="crispEdges">${floater('star', 6.5, 3, 1)}${floater('check', 22.5, -3.5, 2)}${floater('sparkle', 25.5, 9, 3)}${px}</svg></div>`;
}

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
      ${pixelEnvelopes()}
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
        <input type="hidden" name="_subject" value="New message from janeys.work">
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
