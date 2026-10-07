import { site, companies, testimonials } from './site.mjs';
import { work } from './content/work.mjs';
import { services, engagement, faqs, disciplineLine, freeReview } from './content/services.mjs';
import { bio, principles, experience, funFacts, siteStory } from './content/about.mjs';
import { archive } from './content/archive.mjs';
import { esc, todo, figure, pixel, pixelCorner, floaters, arrow, external } from './lib.mjs';

// ---------------------------------------------------------------------------
// Shared bits
// ---------------------------------------------------------------------------

// Section labels (eyebrows): plain small caps above each section heading.
const eyebrow = (_n, label) => `<p class="eyebrow mono">${esc(label)}</p>`;

const eyebrowSpan = (_n, label) => `<span class="eyebrow mono">${esc(label)}</span>`;

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
  return `<li class="story story--${w.hue}${i === 0 && !w.notFeatured ? ' story--featured' : ''}">
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

// The archive isn't a case study, so it gets a quiet footnote under the cards
// rather than a card of its own.
function archiveNote() {
  const count = archive.reduce((n, g) => n + g.items.length, 0);
  return `<p class="archive-note">
    <a href="/archive/">${pixelClock()}<span class="archive-note__text"><span class="archive-note__q">What did the work look like before all this?</span><span class="archive-note__meta mono">Work Archive<span class="archive-note__sep" aria-hidden="true"></span>${count} projects ${arrow}</span></span></a>
  </p>`;
}

// The home page shows only current case studies (no `older: true`). The Case
// studies page shows current ones, then older ones in their own section.
const storyGrid = (list = work, note = true) => `<ul class="stories">${list.map(storyCard).join('')}</ul>${note ? archiveNote() : ''}`;
const homeWork = work.filter((w) => !w.older);
const olderWork = work.filter((w) => w.older);

// How I work: a staircase of pixels. Each step adds one layer on top of the
// last (orange, lilac, green, gold from the bottom up), so step D carries
// every layer before it. Phones get a horizontal bar that grows instead.
// How I work steps, in order. They feed both the desktop staircase and the phone
// view (icon + trail). Adding or reordering a step? Add or move its pixel icon
// in STEP_ICONS below to match (one 8x8 icon per step, same order).
const STEPS = [
  ['Audit', 'Inventory what exists, who it serves, and where it breaks. Interviews, surveys, and data before opinions.'],
  ['Model', 'Define the structure: taxonomy, flows, voice, and the decisions each piece of content has to support.'],
  ['Systematize', 'Turn decisions into guidelines, templates, components, and agent instructions others can reuse.'],
  ['Ship and measure', 'Publish, train the team, watch the numbers, and iterate like any other product.'],
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

// Phone view of How I work: each step gets a small pixel icon, joined to the
// next by a dotted pixel trail (the desktop staircase is hidden on phones).
// Letters map to theme colors, which switch shade in dark mode; '.' is empty.
const STEP_ICON_COLORS = { O: 'var(--orange)', L: 'var(--lilac)', g: 'var(--green)', G: 'var(--gold)', M: 'var(--maroon)', S: 'var(--sky)', P: 'var(--accent)' };
const STEP_ICONS = [
  ['..OOO...', '.O...O..', '.O.S.O..', '.O...O..', '..OOO...', '.....M..', '......M.', '.......M'], // Audit: magnifying glass
  ['...LL...', '...LL...', '....P...', '.PPPPPP.', '.P....P.', 'LL....LL', 'LL....LL', '........'], // Model: a branching structure
  ['gg.gg.gg', 'gg.gg.gg', '........', 'gg.SS.gg', 'gg.SS.gg', '........', 'gg.gg.gg', 'gg.gg.gg'], // Systematize: a grid of modules
  ['....GGGG', '.....GGG', '....G.GG', '...G...G', '..G.....', '.O......', 'OO......', '........'], // Ship and measure: an arrow heading out
];
function stepRail(i, last) {
  const rows = STEP_ICONS[i % STEP_ICONS.length];
  const rects = rows.flatMap((r, y) => [...r].map((c, x) => (STEP_ICON_COLORS[c] ? `<rect x="${x}" y="${y}" width="1" height="1" fill="${STEP_ICON_COLORS[c]}"/>` : ''))).join('');
  // the trail zigzags one dot left and right; extra dots are clipped to fit the step's height
  const dots = last ? '' : `<span class="stairs__trail">${Array.from({ length: 16 }, (_, k) => `<i style="--x:${[0, 1, 2, 1][k % 4]}"></i>`).join('')}</span>`;
  return `<div class="stairs__rail" aria-hidden="true"><svg class="stairs__icon" viewBox="0 0 8 8" shape-rendering="crispEdges">${rects}</svg>${dots}</div>`;
}

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
        return `<li style="--rows:${rows}">
        ${stepRail(i, i === STEPS.length - 1)}
        <div class="stairs__text">
          <span class="stairs__n mono">${'ABCD'[i]}</span>
          <h3>${name}</h3>
          <p>${body}</p>
        </div>
        ${up}
      </li>`;
      }).join('')}
    </ol>`;
}

// Services on the home page: big type on thin rules. Each row is a link to
// that service's band on the Services page.
// Adding a service? Add it to src/content/services.mjs (see the how-to at the
// top of that file); this list picks it up automatically.
function svcList() {
  return `<ul class="svc-type">
      ${services
        .map(
          (s) => `<li>
        <a class="svc-type__row" href="/services/#${s.id}">
          <span class="svc-type__dot" aria-hidden="true"></span>
          <span class="svc-type__name">${esc(s.name)}</span>
          <span class="svc-type__for">${esc(s.for)}</span>
          <span class="svc-type__icon" aria-hidden="true">${arrow}</span>
        </a>
      </li>`
        )
        .join('')}
    </ul>`;
}

// Kind words: every quote at once on a "wall" of tinted cards with uneven
// tops and a few pixels tucked into each corner.
// Corner pixel clusters for the Kind words cards, reused in order (card 4 gets
// the 1st cluster, and so on). Each entry is [color, x, y] in pixel steps from
// the card's top-right corner; x counts leftward and y downward. To give a
// 4th card its own cluster, add a 4th entry here.
const KIND_PIXELS = [
  [['var(--gold)', 1, 0], ['var(--lilac)', 0, 0], ['var(--orange)', 0, 1]],
  [['var(--gold)', 2, 0], ['var(--green)', 0, 0]],
  [['var(--orange)', 0, 0], ['var(--sky)', 2, 0]],
];
function quotes() {
  return `<section class="section quotes" aria-labelledby="quotes-h">
    <div class="wrap">
      ${eyebrow('04', 'Kind words')}
      <h2 id="quotes-h" class="sr-only">What collaborators say</h2>
      <ul class="kind">
        ${testimonials
          .map((t, i) => {
            const team = t.org.replace(t.company, '').replace(/^[,\s]+/, '');
            const px = (KIND_PIXELS[i % KIND_PIXELS.length])
              .map(([c, x, y]) => `<i style="background:${c};--x:${x};--y:${y}"></i>`)
              .join('');
            return `<li class="kind__card">
          <span class="kind__px" aria-hidden="true">${px}</span>
          <figure>
            <blockquote><p>${esc(t.quote)}</p></blockquote>
            <figcaption>
              ${
                t.logo
                  ? `<span class="kind__logo"><img src="${esc(t.logo)}" alt="${esc(t.company)}" class="kind__logo-light">${t.logoDark ? `<img src="${esc(t.logoDark)}" alt="" class="kind__logo-dark">` : ''}</span>`
                  : `<span class="kind__co">${esc(t.company)}</span>`
              }
              <span class="kind__meta mono">${team ? `${esc(team)} <span class="muted">·</span> ` : ''}<span class="muted">${esc(t.context)}</span></span>
            </figcaption>
          </figure>
        </li>`;
          })
          .join('')}
      </ul>
    </div>
  </section>`;
}

// Each page gets its own band color so the closing call to action never reads
// as a repeat of the home page's. Case studies use the strong version of their
// card color.
const CTA_TONES = { purple: '#4f33cc', green: '#0b704f', maroon: '#6b2337', orange: '#ff7b4d', lilac: '#cfa2ed', sky: '#b6d8fe', mint: '#9fdcc4' };
const CARD_TONE = { lilac: 'lilac', peach: 'orange', gold: 'green', sky: 'sky', mint: 'mint' };
function ctaBand(heading = 'Let’s build something people understand.', sub = 'Content strategy, design, and systems for products and teams.', tone = 'purple') {
  return `<section class="cta-band cta-band--${tone}" aria-labelledby="cta-h">
    ${pixelCorner(CTA_TONES[tone])}
    <div class="wrap cta-band__inner">
      <div>
        <h2 id="cta-h">${heading}</h2>
        <p>${sub}</p>
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
      <p class="lede">I’m Janey, a content strategist, content designer, and product manager. I’ve led content at FIS, Shopify, GitHub, and Carnegie Mellon, building the guidelines, docs, and processes that let teams (and their AI tools) get content right at scale.</p>
      <div class="actions">
        <a class="btn" href="/work/">Read case studies ${arrow}</a>
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
    <div class="section__head section__head--split">
      ${eyebrow('01', 'Selected work')}
      <div>
        <h2 id="work-h">Every project starts with a question. Here’s how I answered a few.</h2>
      </div>
      <a class="link-arrow" href="/work/">All case studies ${arrow}</a>
    </div>
    ${storyGrid(homeWork, false)}
  </div>
</section>

<section class="section section--surface section--stairs" aria-labelledby="how-h">
  <div class="wrap">
    <div class="section__head">
      ${eyebrow('02', 'How I work')}
      <h2 id="how-h"><span class="h-line">Clarity for people.</span> <span class="h-line">Structure for machines.</span></h2>
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
      <a class="link-arrow" href="/services/">All services and FAQ ${arrow}</a>
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
//
// ─── HOW TO CHANGE OR ADD A RESULT ─────────────────────────────────────────
// Each object is one column, left to right:
//
//   { stat: '12', label: 'docs sites migrated', who: 'Company', colors: ['#0b704f', '#b6d8fe'], rows: 3 },
//
//   stat    the big number or word. Keep it short (about 6 characters, like
//           '500K+' or 'GitHub') so it fits the column on one line.
//   label   what the number means, in lowercase, about 5 words.
//   who     the client or project, shown small underneath.
//   colors  two palette colors for this column's pixels: the first is the
//           main color, the second is sprinkled in. Palette:
//             orange #ff7b4d · lilac #cfa2ed · sky #b6d8fe · gold #c99f43
//             green #0b704f · maroon #6b2337 · purple #4f33cc
//           Give neighboring columns different main colors.
//   rows    how tall the pixel stack is (2 to 5). Vary it between neighbors so
//           the skyline stays uneven; the text sits on top of each stack.
//
// Changing a number: edit `stat` (and `label` if the wording changes).
// Swapping a result: replace the whole object.
//
// Adding or removing a column: the layout is built for 5. If you change the
// count, update `.results__list` in public/styles.css:
//   - desktop: set `repeat(5, ...)` to the new count (6 is about the most that
//     fits; past that, swap out an older result instead)
//   - laptop/tablet (the max-width: 1000px block): results sit two per row,
//     and the last one stretches full width. That suits an odd count; with an
//     even count, delete the `.results__item:last-child` line there.
// Then run `npm run build` and check /work/ at desktop, laptop, and phone sizes.
//
// The "(last 7 years)" note next to "By the numbers" is in workIndex() below;
// update it if the range changes.
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
  const W = 32, base = rows + 2, H = base + 2;
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
    title: 'Case studies',
    ogImage: '/og/og-case-study.png',
    description: 'Case studies in content strategy, content design, documentation, localization, and product management.',
    body: `
<section class="page-head">
  <div class="wrap">
    ${eyebrow('—', 'Case studies')}
    <h1 class="work-h1"><span>Every project starts with a question.</span> <span>Here’s how I answered a few.</span></h1>
  </div>
</section>

<section class="section section--tight" aria-labelledby="current-h">
  <div class="wrap">
    <h2 id="current-h" class="work-group">Current</h2>
    ${storyGrid(homeWork, false)}
  </div>
</section>
${
  olderWork.length
    ? `<section class="section section--tight work-older" aria-labelledby="older-h">
  <div class="wrap">
    <h2 id="older-h" class="work-group">Older</h2>
    ${storyGrid(olderWork.map((w) => ({ ...w, notFeatured: true })))}
  </div>
</section>`
    : ''
}
<section class="results" aria-labelledby="results-h">
  <div class="wrap">
    <p class="eyebrow mono">By the numbers <span class="results__span">(last 7 years)</span></p>
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




${ctaBand(undefined, undefined, 'green')}`,
  };
}

// One screenshot, or several side by side (`images`), under a highlight.
const shots = (h, slug) =>
  h.images?.length
    ? `<div class="shots" style="--n:${Math.min(h.images.length, 2)}">${h.images.map((im) => figure(im, slug)).join('')}</div>`
    : figure(h.image, slug);

export function caseStudy(w, i) {
  const prev = work[(i - 1 + work.length) % work.length];
  const next = work[(i + 1) % work.length];
  const artIdx = i;
  let n = 3; // section numbers after Context and The work
  const num = () => String(++n).padStart(2, '0');
  const outcomes = w.outcomes
    .map((o) =>
      o.todo
        ? `<li class="outcome outcome--todo">${todo(o.todo)}</li>`
        : `<li class="outcome"><span class="outcome__stat">${esc(o.stat)}</span><span class="outcome__label">${esc(o.label)}</span></li>`
    )
    .join('');
  const results = w.results?.length
    ? `<ul class="results-shots">${w.results.map((r) => `<li><figure class="shot"><img src="${esc(r.src)}" alt="${esc(r.alt)}" loading="lazy" decoding="async"><figcaption>${esc(r.caption)}</figcaption></figure></li>`).join('')}</ul>`
    : '';

  return {
    path: `/work/${w.slug}/`,
    title: w.title,
    ogImage: '/og/og-case-study.png',
    description: w.summary,
    body: `
<article class="case">
  <header class="case__head">
    ${gapFloat(6 + artIdx, [
      [56, 15, 6, 45, 2],
    ])}
    <div class="wrap case__head-inner">
      <div>
        <p class="eyebrow mono"><a href="/work/">Case studies</a> <span aria-hidden="true">/</span> ${esc(w.client)}</p>
        <h1>${esc(w.title)}</h1>
        <p class="lede">${esc(w.summary)}</p>
      </div>
      <div class="case__art">${artFloat(8 + artIdx)}${pixel(w.art, { organic: true })}</div>
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
  ${spill(7 + artIdx)}

  <div class="wrap case__body">
    ${w.todos.map((t) => todo(t)).join('')}
    ${w.cover ? `<figure class="case__cover${w.cover.tall ? ' case__cover--tall' : ''}"><img src="${esc(w.cover.src)}" alt="${esc(w.cover.alt)}" loading="lazy" decoding="async">${w.cover.caption ? `<figcaption>${esc(w.cover.caption)}</figcaption>` : ''}</figure>` : ''}

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
          ${shots(h, w.slug)}
        </li>`
          )
          .join('')}
      </ul>
    </section>

    <section class="case__section" aria-labelledby="out-${w.slug}">
      <h2 id="out-${w.slug}" class="case__h">${eyebrowSpan('03', 'Outcomes')}</h2>
      <div><ul class="outcomes">${outcomes}</ul>${results}</div>
    </section>

    ${
      w.learnings
        ? `<section class="case__section" aria-labelledby="learn-${w.slug}">
      <h2 id="learn-${w.slug}" class="case__h">${eyebrowSpan(num(), 'Looking back')}</h2>
      <div class="learnings"><p>${esc(w.learnings.intro)}</p><ul>${w.learnings.questions.map((q) => `<li>${esc(q)}</li>`).join('')}</ul></div>
    </section>`
        : ''
    }

    ${
      w.links.length
        ? `<section class="case__section" aria-labelledby="links-${w.slug}">
      <h2 id="links-${w.slug}" class="case__h">${eyebrowSpan(num(), 'See it live')}</h2>
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
${ctaBand('Want results like these on your team?', 'Let’s talk about what you’re building.', CARD_TONE[w.hue] || 'lilac')}`,
  };
}

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

// Services page: an organic pixel border along the top of each service band,
// at the same cell size as the header art. Mostly the band's own color, with a
// few pixels from the rest of the palette and a few dropping down a row.
// One entry per band tint. If you add a new tint to a service, add a palette
// for it here too: the first color is the main one, the rest are accents.
const BAND_PX = {
  peach: ['var(--orange)', 'var(--orange)', 'var(--orange)', 'var(--gold)', 'var(--maroon)'],
  lilac: ['var(--lilac)', 'var(--lilac)', 'var(--accent)', 'var(--lilac)', 'var(--orange)'],
  mint: ['var(--green)', 'var(--green)', 'var(--green)', 'var(--sky)', 'var(--gold)'],
  gold: ['var(--gold)', 'var(--gold)', 'var(--gold)', 'var(--orange)', 'var(--maroon)'],
  sky: ['var(--sky)', 'var(--sky)', 'var(--accent)', 'var(--sky)', 'var(--lilac)'],
};
// Tuning: the border only runs along the right-hand side. BAND_REACH is how far
// in from the right edge it goes (in pixels); it is fullest at the edge and
// thins out toward the left. BAND_DROPS is the chance a pixel drops a row.
const BAND_REACH = 16, BAND_DROPS = 0.4;
function bandPixels(tint, seed) {
  const W = BAND_REACH, pal = BAND_PX[tint] || BAND_PX.lilac;
  const top = [];
  for (let x = 0; x < W; x++) {
    const keep = 0.9 * (1 - (W - 1 - x) / W); // denser toward the right edge
    if (mix(x + seed * 101, seed * 7 + 3) <= keep) top.push(x);
  }
  // no stragglers: the run starts with a pair, never a lone pixel off to the left
  while (top.length > 1 && top[1] - top[0] > 1) top.shift();
  let rects = '';
  for (const x of top) {
    const c = pal[Math.floor(mix(x * 3 + 11, seed + 41) * pal.length)];
    rects += `<rect x="${x}" y="0" width="1" height="1" fill="${c}"/>`;
    if (W - 1 - x < W * 0.7 && mix(x * 5 + 7, seed * 13 + 2) < BAND_DROPS) rects += `<rect x="${x}" y="1" width="1" height="1" fill="${pal[0]}"/>`;
  }
  return `<svg class="svc-band__px" viewBox="0 0 ${W} 2" preserveAspectRatio="xMaxYMin slice" style="--w:${W}" shape-rendering="crispEdges" aria-hidden="true">${rects}</svg>`;
}

// Services page: "Related work" under each band. Lists up to RELATED_MAX case
// studies whose `services` includes that band's id, newest `year` first, each
// with its client and a one-line description (`cardTitle`). Nothing renders
// for a band with no matching work.
const RELATED_MAX = 3;
function bandWork(id) {
  const items = work
    .filter((w) => w.services?.includes(id))
    .sort((a, b) => (b.year || 0) - (a.year || 0))
    .slice(0, RELATED_MAX);
  if (!items.length) return '';
  return `<div class="svc-work"><h3 class="svc-work__label">Related work</h3><ul>${items
    .map((w) => `<li><a href="/work/${w.slug}/"><span class="svc-work__who mono">${esc(w.short || w.client)}</span><span class="svc-work__what">${esc(w.cardTitle)}</span></a></li>`)
    .join('')}</ul></div>`;
}

// Services page. The jump bar, the color bands, and their pixel runs are all
// built from the `services` list. Each jump-bar square takes the strong color
// of its band's tint (peach -> orange, mint -> green); a new tint needs an
// entry in that small map inside the jump bar markup below.
export function servicesPage() {
  return {
    path: '/services/',
    title: 'Services',
    ogImage: '/og/og-services.png',
    // Lists every service by name for search engines. Update it when a service
    // is added, renamed, or removed (see src/content/services.mjs).
    description: 'Content strategy and editorial; content design, UX writing, and storytelling; content for teams; documentation and training; and product management and marketing.',
    body: `
<section class="page-head">
  <div class="wrap">
    ${eyebrow('—', 'Services')}
    <h1>Work with me</h1>
    <p class="lede">I help teams build content that scales: clear for the people reading it, and structured for the teams and tools maintaining it.</p>
    <p class="svc-disciplines mono">${disciplineLine.map(esc).join('<span aria-hidden="true"> · </span>')}</p>
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
      (s, i) => `<section class="svc-band svc-band--${s.tint}" id="${s.id}" aria-labelledby="${s.id}-h">
    ${bandPixels(s.tint, s.pxSeed ?? i + 1)}
    <div class="wrap">
      <div class="svc-band__top">
        <h2 id="${s.id}-h">${esc(s.name)}</h2>
        <p class="svc-band__body">${esc(s.body)}</p>
      </div>
      <ul class="svc-band__gets" style="--cols: ${s.deliverables.length % 4 === 0 ? 4 : 3}">${s.deliverables.map((d) => `<li>${esc(d)}</li>`).join('')}</ul>
      ${bandWork(s.id)}
      <a class="link-arrow" href="/contact/?topic=${encodeURIComponent(s.name)}">${esc(s.ask || `Ask about ${s.short.toLowerCase()} work`)} ${arrow}</a>
    </div>
  </section>`
    )
    .join('')}
</div>
</div>

<section class="section section--free" aria-labelledby="free-h">
  <div class="wrap free">
    <div class="free__art">${pixelResume()}</div>
    <div>
      ${eyebrow('★', 'Free, for early- to mid-career folks')}
      <h2 id="free-h">Resume, portfolio, and case-study reviews</h2>
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
${ctaBand('Not sure which service fits?', 'Let’s talk about what you’re building.', 'maroon')}`,
  };
}

// ---------------------------------------------------------------------------
// About
// ---------------------------------------------------------------------------

// About this website: one card per version, with its screenshot in a simple
// browser-window frame. Without a screenshot, the frame shows a pixel placeholder
// in the card's color (a few blocks suggesting a page layout).
const VERSION_TONE = { peach: 'var(--orange)', lilac: 'var(--lilac)', mint: 'var(--green)', sky: 'var(--sky)', gold: 'var(--gold)' };
function versionCard(v, i) {
  const tone = VERSION_TONE[v.tint] || 'var(--lilac)';
  const shot = v.image
    ? `<img src="${esc(v.image)}" alt="${esc(v.alt || v.name)}" loading="lazy">`
    : `<div class="version__placeholder" role="img" aria-label="${esc(`Screenshot of the ${v.name} version, coming soon`)}">
          <span style="--x:1;--y:1;--w:5;--h:1"></span><span style="--x:9;--y:1;--w:2;--h:1;opacity:.5"></span>
          <span style="--x:1;--y:3;--w:7;--h:2;opacity:.85"></span><span style="--x:9;--y:3;--w:2;--h:4;opacity:.35"></span>
          <span style="--x:1;--y:6;--w:3;--h:1;opacity:.45"></span><span style="--x:5;--y:6;--w:3;--h:1;opacity:.45"></span>
        </div>`;
  return `<li class="version version--${esc(v.tint || 'lilac')}" style="--tone:${tone}">
      <div class="version__frame">
        <div class="version__bar" aria-hidden="true"><i></i><i></i><i></i><span class="mono">janeys.work</span></div>
        <div class="version__shot">${shot}</div>
      </div>
      <p class="version__label mono">${esc(v.label)}</p>
      <h3>${esc(v.name)}</h3>
      <p>${esc(v.body)}</p>
    </li>`;
}

// About page: a small "On this page" list that lives in the intro's pixel art
// (top-left of the art on desktop, under it on phones).
// Each entry links to a section id on the page; keep it in step with the
// sections below if you add, remove, or reorder them.
const ABOUT_TOC = [
  // [section id, label, tile color, text color]: fixed brand colors so every
  // tile keeps its contrast in both light and dark mode
  ['about-janey', 'About Janey', '#4f33cc', '#fffdf8'],
  ['principles', 'Operating principles', '#ff7b4d', '#4a1522'],
  ['experience', 'Experience', '#cfa2ed', '#4a1522'],
  ['this-site', 'About this website', '#0b704f', '#fffdf8'],
  ['fun-facts', 'Fun facts', '#c99f43', '#4a1522'],
];
// Each link is a colored pixel tile, stacked with uneven offsets so the list
// reads as part of the pixel art it sits in.
function aboutToc() {
  return `<nav class="toc" aria-label="On this page"><p class="toc__title mono">On this page</p><ol>${ABOUT_TOC.map(([id, label, bg, fg], i) => `<li style="--o:${[0, 1, 0.5, 1.5, 0.75][i % 5]}"><a href="#${id}" style="--bg:${bg};--fg:${fg}">${esc(label)}</a></li>`).join('')}</ol></nav>`;
}

export function aboutPage() {
  return {
    path: '/about/',
    title: 'About',
    description: 'Janey Annis: content strategist, content designer, and product manager. Experience at FIS, Shopify, GitHub, Plex, and Carnegie Mellon.',
    body: `
<section class="page-head page-head--art" id="about-janey">
  ${gapFloat(21, [
    [58, 10, 4, 60, 2],   // a couple between the bio and the art
  ])}
  <div class="wrap about-head">
    <div>
      ${eyebrow('—', 'About')}
      <h1>Hi, I’m Janey.</h1>
      ${bio.map((p, i) => `<p class="${i === 0 ? 'lede' : ''}">${esc(p)}</p>`).join('')}
      <p>My work spans information systems, devtools, academia, ecommerce, finance, and entertainment.</p>
      <div class="actions"><a class="btn" href="/contact/">Get in touch ${arrow}</a><a class="btn btn--ghost" href="${site.linkedin}">LinkedIn ${external}</a></div>
    </div>
    <div class="portrait">
      ${artFloat(23)}
      ${pixel('pixel-composition-12', { organic: true })}
      ${aboutToc()}
    </div>
  </div>
</section>
${spill(22)}

<section class="section section--surface" id="principles" aria-labelledby="pr-h">
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

<section class="section section--site" id="this-site" aria-labelledby="site-h">
  <div class="wrap">
    <div class="site-story">
      <div class="section__head">${eyebrow('04', 'About this website')}<h2 id="site-h">${esc(siteStory.heading)}</h2></div>
      <div class="site-story__intro">${siteStory.intro.map((p) => `<div><p class="site-story__k mono">${esc(p.label)}</p><p>${esc(p.text)}</p></div>`).join('')}</div>
    </div>
    <ol class="versions" aria-label="Versions of this website">
      ${siteStory.versions.map((v, i) => versionCard(v, i)).join('')}
    </ol>
  </div>
</section>
<section class="section section--tight section--facts" id="fun-facts" aria-labelledby="ff-h">
  <div class="wrap">
    <div class="section__head">${eyebrow('03', 'Fun facts')}<h2 id="ff-h">Off the clock</h2></div>
    <ul class="facts">${funFacts.map((f, i) => `<li>${factArt(i)}<p>${f}</p></li>`).join('')}</ul>
  </div>
</section>
${ctaBand(undefined, undefined, 'orange')}`,
  };
}

// ---------------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------------

// Services page, free review: a pixel résumé being looked over, in the same
// style as the About page's fun-facts art and the contact envelopes: clean
// shapes, no loose sparkles, and the motion lives in the picture itself. The
// magnifying glass reads down the page in whole-pixel steps. Still for reduced
// motion. Outlines use fixed brand colors so they stay dark in both themes.
function pixelResume() {
  const W = 24, H = 24;
  const C = { L: 'var(--lilac)', F: '#a77fd6', P: '#4f33cc', G: 'var(--gold)', O: 'var(--orange)', M: '#6b2337', S: 'var(--sky)' };
  const page = new Map(), lens = new Map(), glass = new Map();
  const put = (m, x, y, c) => m.set(`${x},${y}`, [x, y, c]);
  const x0 = 3, y0 = 2, w = 14, h = 19;
  // the sheet, with its top-right corner folded over
  for (let y = y0; y < y0 + h; y++)
    for (let x = x0; x < x0 + w; x++) {
      const fx = x - (x0 + w - 4), fy = y - y0;
      if (fx >= 0 && fy < 4 && fx > fy) continue; // cut corner
      put(page, x, y, fx >= 0 && fy < 4 ? 'F' : 'L'); // the fold
    }
  // photo block and name lines
  for (let y = y0 + 2; y < y0 + 5; y++) for (let x = x0 + 2; x < x0 + 5; x++) put(page, x, y, 'G');
  for (const [y, len] of [[y0 + 2, 4], [y0 + 4, 3]]) for (let x = x0 + 6; x < x0 + 6 + len; x++) put(page, x, y, 'P');
  // text lines
  for (const [y, len] of [[y0 + 7, 7], [y0 + 9, 9], [y0 + 11, 8], [y0 + 13, 9], [y0 + 15, 7], [y0 + 17, 9]])
    for (let x = x0 + 2; x < x0 + 2 + len; x++) put(page, x, y, 'P');
  // magnifying glass: orange ring, see-through lens, maroon handle
  const cx = 11, cy = 15, R = 4;
  for (let y = cy - R - 1; y <= cy + R + 1; y++)
    for (let x = cx - R - 1; x <= cx + R + 1; x++) {
      const d = Math.hypot(x - cx, y - cy);
      if (d > R - 0.6 && d <= R + 0.5) put(glass, x, y, 'O');
      else if (d <= R - 0.6) put(lens, x, y, 'S');
    }
  for (const [x, y] of [[15, 19], [16, 19], [16, 20], [17, 20], [17, 21], [18, 21], [18, 22], [19, 22]]) put(glass, x, y, 'M');
  const glint = [[cx - 2, cy - 2], [cx - 1, cy - 2], [cx - 2, cy - 1]];
  glint.forEach(([x, y]) => lens.delete(`${x},${y}`));

  const rect = ([x, y, c]) => `<rect x="${x}" y="${y}" width="1" height="1" fill="${C[c]}"/>`;
  const glintRects = glint.map(([x, y]) => `<rect x="${x}" y="${y}" width="1" height="1" fill="#fffdf8"/>`).join('');
  // The drawing spans columns 3 to 19 of the grid, so the viewBox is cropped
  // to those columns; the art then sits flush with its column and leaves more
  // room for the text beside it.
  const X0 = 3, VW = W - 7;
  return `<div class="rev" aria-hidden="true"><svg viewBox="${X0} 0 ${VW} ${H}" style="--w:${VW};--h:${H}" shape-rendering="crispEdges"><g>${[...page.values()].map(rect).join('')}</g><g class="rev__mag"><g class="rev__glass">${[...lens.values()].map(rect).join('')}</g>${glintRects}${[...glass.values()].map(rect).join('')}</g></svg></div>`;
}

// Fun facts: a small hand-placed pixel picture for each card, drawn on the
// same palette as the header art. Letters map to colors ('.' is empty); some
// letters also carry a class so that part can move (sun, scale pans, blinking
// eyes). The pictures rise out of the top of the card, like the rest of the
// site's art breaks out of its boxes.
const FACT_COLORS = {
  O: ['var(--orange)'], G: ['var(--gold)'], g: ['var(--green)'], M: ['var(--maroon)'], S: ['var(--sky)'], L: ['var(--lilac)'], P: ['var(--accent)'],
  U: ['var(--orange)', 'fa-sun'],
  h: ['var(--gold)', 'fa-pan-l'], a: ['var(--gold)', 'fa-pan-l'], A: ['var(--orange)', 'fa-pan-l'],
  k: ['var(--gold)', 'fa-pan-r'], b: ['var(--gold)', 'fa-pan-r'], B: ['var(--lilac)', 'fa-pan-r'],
  e: ['var(--maroon)', 'fa-blink fa-blink--o'], y: ['var(--gold)', 'fa-blink fa-blink--m'],
};
const FACT_ART = [
  {
    // a tropical island: palm, sun, and water (the retreat)
    rows: [
      '...........UU...',
      '.gg..gg...UUUU..',
      'ggggggggg..UU...',
      'gg.ggMgg.g......',
      'g....M..g.......',
      '.....M..........',
      '......M.........',
      '......M.........',
      '......M.........',
      '.....GGG....S...',
      'S..SGGGGGS.SSS.S',
      'SSSSSSSSSSSSSSSS',
    ],
  },
  {
    // the scales of justice (for Judge John Hodgman); the pans gently weigh
    rows: [
      '.......P.......',
      '......PPP......',
      '.hhhhhhGkkkkkk.',
      '.a.....M.....b.',
      'a.a....M....b.b',
      'a.a....M....b.b',
      'AAAAA..M..BBBBB',
      '.AAA...M...BBB.',
      '.......M.......',
      '.......M.......',
      '.......M.......',
      '.....MMMMM.....',
      '....GGGGGGG....',
    ],
  },
  {
    // two cats, blissfully offline (they blink)
    rows: [
      'O...O......M...M...',
      'OO.OO......MM.MM...',
      'OOOOO......MMMMM...',
      'OeOeO......MyMyM...',
      'OOOOO......MMMMM...',
      '.OOO........MMM....',
      'OOOOO......MMMMM...',
      'OOOOO.O...MMMMMMM..',
      'OOOOOO.O..MMMMMMM.M',
      'OOOOOO.O..MMMMMMM.M',
      '.OOOO.OO...MMMMM.MM',
    ],
  },
];
function factArt(i) {
  const { rows, loose = [] } = FACT_ART[i % FACT_ART.length];
  const W = Math.max(...rows.map((r) => r.length)), H = rows.length;
  const rect = (x, y, ch) => {
    const [fill, cls] = FACT_COLORS[ch] || [];
    return fill ? `<rect x="${x}" y="${y}" width="1" height="1" fill="${fill}"${cls ? ` class="${cls}"` : ''}/>` : '';
  };
  let rects = '';
  rows.forEach((r, y) => [...r].forEach((c, x) => (rects += rect(x, y, c))));
  loose.forEach(([x, y, c]) => (rects += rect(x, y, c)));
  return `<svg class="facts__art" viewBox="0 0 ${W} ${H}" style="--w:${W};--h:${H}" shape-rendering="crispEdges" aria-hidden="true">${rects}</svg>`;
}

// Contact: three hand-drawn pixel envelopes in the same style as the About
// page's fun-facts art: clean shapes, no loose sparkles, and the motion lives in
// the picture itself. A letter rises out of the gold envelope, and the small
// lilac one hops, both in whole-pixel steps. Still for reduced motion.
function pixelEnvelopes() {
  const W = 34, H = 22;
  // outlines use the fixed brand purple, maroon and green so they stay dark on the
  // light envelopes in both themes
  const COL = { S: 'var(--sky)', L: 'var(--lilac)', P: '#4f33cc', O: 'var(--orange)', G: 'var(--gold)', M: '#6b2337', g: '#0b704f' };
  const layer = () => new Map();
  const back = layer(), front = layer();
  const put = (m, x, y, c, cls = '') => m.set(`${x},${y}`, [x, y, c, cls]);

  // A closed envelope: body, a V-shaped flap, and a solid outline along both
  // sides of the V (the top edge stays flap-colored).
  const envelope = (m, x0, y0, w, h, { body, flap, edge }, cls = '') => {
    for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) put(m, x, y, body, cls);
    const tip = Math.ceil(w / 2);
    for (let r = 0; r < tip && r < h; r++) {
      const l = x0 + r, rr = x0 + w - 1 - r;
      if (l > rr) break;
      for (let x = l; x <= rr; x++) put(m, x, y0 + r, r > 0 && (x === l || x === rr) ? edge : flap, cls);
    }
  };

  // the big envelope
  envelope(front, 1, 9, 16, 11, { body: 'S', flap: 'L', edge: 'P' });

  // a letter tucked into the gold envelope (drawn behind it, so it can rise)
  for (let y = 1; y <= 8; y++) for (let x = 22; x <= 28; x++) put(back, x, y, 'L', 'env__letter');
  for (const [x1, x2, y] of [[23, 27, 2], [23, 26, 4]]) for (let x = x1; x <= x2; x++) put(back, x, y, 'P', 'env__letter');
  envelope(front, 20, 5, 11, 8, { body: 'G', flap: 'O', edge: 'M' });

  // the small envelope hops
  envelope(front, 23, 15, 8, 6, { body: 'L', flap: 'S', edge: 'g' }, 'env__hop');

  const rects = (m) => [...m.values()].map(([x, y, c, cls]) => `<rect x="${x}" y="${y}" width="1" height="1" fill="${COL[c]}"${cls ? ` class="${cls}"` : ''}/>`).join('');
  return `<div class="env" aria-hidden="true"><svg viewBox="0 0 ${W} ${H}" style="--w:${W};--h:${H}" shape-rendering="crispEdges">${rects(back)}${rects(front)}</svg></div>`;
}

export function contactPage() {
  const topics = [...services.map((s) => s.name), 'Free review', 'Full-time role', 'Something else'];
  const action = site.formspreeId ? `https://formspree.io/f/${site.formspreeId}` : '';
  return {
    path: '/contact/',
    title: 'Contact',
    description: 'Contact Janey about content strategy, content design, documentation, product management, or a free resume review.',
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
        <div class="field"><label for="f-msg">Message</label><textarea id="f-msg" name="message" rows="6" required placeholder="A little about your team, the problem, and your timeline."></textarea></div>
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
    ogImage: '/og/og-case-study.png',
    description: 'Earlier work: editorial, marketing, technical writing, and web at GitHub, Plex, Carnegie Mellon, and more.',
    body: `
<section class="page-head">
  <div class="wrap">
    ${eyebrow('—', 'Earlier work')}
    <h1>The archive</h1>
    <p class="lede">Marketing, editorial, technical writing, and web work from GitHub, Plex, Ripl, and Carnegie Mellon.</p>
    ${todo('Archive links still point to files on your Squarespace site. Download those PDFs into <code>/public/archive/</code> and update the links in <code>src/content/archive.mjs</code> before you cancel Squarespace.')}
  </div>
</section>
${archive
  .map(
    (g, gi) => `<section class="section section--tight${gi === archive.length - 1 ? ' section--archive-last' : ''}" aria-labelledby="ar-${gi}">
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
${ctaBand(undefined, undefined, 'sky')}`,
  };
}

// 404 art: a stop sign that reads 404, a traffic cone, and a road barrier with
// a blinking light, drawn on one pixel grid. Colors are fixed (not theme
// variables) so the signs read the same in light and dark mode.
function pixelRoadblock() {
  const W = 40, H = 30;
  const COL = { R: '#cc3333', C: '#fffdf8', P: '#8b8f97', O: '#ff7b4d', M: '#6b2337', G: '#c99f43', L: '#4f33cc' };
  const groups = { sign: new Map(), cone: new Map(), bar: new Map(), light: new Map() };
  const put = (g, x, y, c) => groups[g].set(`${x},${y}`, [x, y, c]);

  // stop sign: a cream octagon with a red octagon inside it, on a pole
  const octagon = (g, x0, y0, s, cut, c) => {
    for (let y = 0; y < s; y++) {
      const inset = Math.max(0, cut - y, y - (s - 1 - cut));
      for (let x = inset; x < s - inset; x++) put(g, x0 + x, y0 + y, c);
    }
  };
  for (let y = 15; y < 29; y++) for (const x of [9, 10]) put('sign', x, y, 'P');
  octagon('sign', 2, 1, 16, 5, 'C');
  octagon('sign', 3, 2, 14, 4, 'R');
  // "404" in a 3 x 5 pixel font
  const DIGITS = { 4: ['C.C', 'C.C', 'CCC', '..C', '..C'], 0: ['CCC', 'C.C', 'C.C', 'C.C', 'CCC'] };
  [...'404'].forEach((d, i) => DIGITS[d].forEach((row, y) => [...row].forEach((ch, x) => ch === 'C' && put('sign', 4 + i * 4 + x, 7 + y, 'C'))));

  // traffic cone: an orange cone with two cream stripes on a maroon base
  for (let y = 16; y <= 26; y++) {
    const half = Math.floor((y - 16) / 3) + 1;
    for (let x = 24 - half; x < 24 + half; x++) put('cone', x, y, (y >= 19 && y <= 20) || (y >= 23 && y <= 24) ? 'C' : 'O');
  }
  for (let x = 18; x <= 29; x++) for (const y of [27, 28]) put('cone', x, y, 'M');

  // road barrier: striped board on two legs, with a light on top
  for (let y = 19; y <= 21; y++) for (let x = 30; x <= 39; x++) put('bar', x, y, (x + y) % 4 < 2 ? 'G' : 'C');
  for (let y = 22; y <= 28; y++) for (const x of [31, 38]) put('bar', x, y, 'P');
  for (let y = 17; y <= 18; y++) for (const x of [34, 35]) put('light', x, y, 'O');

  const rects = (g) => [...groups[g].values()].map(([x, y, c]) => `<rect x="${x}" y="${y}" width="1" height="1" fill="${COL[c]}" stroke="${COL[c]}" stroke-width="0.05"/>`).join('');
  return `<svg class="pixel nf-art" data-noflip data-cell="px-art" viewBox="0 0 ${W} ${H}" shape-rendering="crispEdges" role="img" aria-label="Pixel art of a stop sign that reads 404, a traffic cone, and a road barrier">
    <g class="nf-sign">${rects('sign')}</g><g class="nf-cone">${rects('cone')}</g>${rects('bar')}<g class="nf-light">${rects('light')}</g></svg>`;
}

// 404 page: the same layout as the home page header, with road-closed art.
export function notFound() {
  return {
    path: '/404.html',
    title: 'Page not found',
    body: `
<section class="hero hero--404">
  ${gapFloat(3, [
    [50, 18, 6, 50, 2],
  ])}
  <div class="wrap hero__inner">
    <div class="hero__copy has-flank">
      <div class="flank" data-seed="2" aria-hidden="true"></div>
      <p class="eyebrow mono">Error 404: page not found</p>
      <h1 class="hero__title"><span class="hero__line">This page took</span> <span class="hero__line">a <span class="hl">wrong turn</span>.</span></h1>
      <p class="lede">The link may be out of date, or the page moved when the site was rebuilt. These roads still go somewhere:</p>
      <div class="actions">
        <a class="btn" href="/">Go home ${arrow}</a>
        <a class="btn btn--ghost" href="/work/">Case studies</a>
        <a class="btn btn--ghost" href="/services/">Services</a>
      </div>
    </div>
    <div class="hero__art">
      ${artFloat(5)}
      ${pixelRoadblock()}
    </div>
  </div>
</section>
${spill(4)}`,
  };
}
