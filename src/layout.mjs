import { site, nav, disciplines } from './site.mjs';
import { esc } from './lib.mjs';

// The logo pixel: a single orange square. It's only in the footer now; the
// header shows the name on its own so the page content stays the focus.
function logo() {
  return `<span class="logo-pixel" aria-hidden="true"></span>`;
}

// Pixel-art light/dark switch: a pixel sun or moon slides along a track of
// pixel clouds (light) or stars (dark). Grid is 16 × 8 pixels.
// Gradient switch (default): three pixels, each the size of the logo pixel.
// Light mode steps from lightest to darkest; dark mode from darkest to lightest.
// On toggle they flip over left to right and land on the new gradient.
// Colors are set in styles.css (.grad-toggle).
function gradientToggle() {
  return `<button class="theme-toggle grad-toggle" type="button" role="switch" aria-checked="false" aria-label="Dark mode" title="Toggle dark mode">
    <span class="grad-toggle__row" aria-hidden="true"><i style="--i:0"></i><i style="--i:1"></i><i style="--i:2"></i></span>
  </button>`;
}

// Tile-flip switch (preview with ?toggle=tile): a 3 × 3 pixel tile showing a sun (light) or a
// crescent moon (dark). On toggle the squares flip over in a diagonal wave and
// land on their new colors, like the tiles in the header art.
// Square colors per theme are set in styles.css (.tile-toggle).
function tileToggle() {
  let squares = '';
  for (let i = 0; i < 9; i++) squares += `<i style="--i:${Math.floor(i / 3) + (i % 3)}"></i>`;
  return `<button class="theme-toggle tile-toggle" type="button" role="switch" aria-checked="false" aria-label="Dark mode" title="Toggle dark mode">
    <span class="tile-toggle__grid" aria-hidden="true">${squares}</span>
  </button>`;
}

// Sun/moon slider (earlier version): preview it with ?toggle=sun
function themeToggle() {
  return `<button class="theme-toggle sun-toggle" type="button" role="switch" aria-checked="false" aria-label="Dark mode" title="Toggle dark mode">
    <svg viewBox="0 0 16 8" shape-rendering="crispEdges" aria-hidden="true">
      <g class="tt-track"><rect x="1" y="0" width="14" height="8"/><rect x="0" y="1" width="16" height="6"/></g>
      <g class="tt-clouds"><rect x="10" y="2" width="3" height="1"/><rect x="9" y="3" width="5" height="1"/><rect x="11" y="5" width="2" height="1"/><rect x="10" y="6" width="4" height="1"/></g>
      <g class="tt-stars"><rect x="2" y="2" width="1" height="1"/><rect x="5" y="1" width="1" height="1"/><rect x="4" y="5" width="1" height="1"/><rect x="6" y="3" width="1" height="1"/><rect x="2" y="6" width="1" height="1"/></g>
      <g class="tt-knob">
        <g class="tt-sun"><rect x="1" y="0" width="4" height="6"/><rect x="0" y="1" width="6" height="4"/><rect class="tt-sun-core" x="2" y="2" width="2" height="2"/></g>
        <g class="tt-moon"><rect x="1" y="0" width="4" height="6"/><rect x="0" y="1" width="6" height="4"/><rect class="tt-crater" x="1" y="2" width="1" height="1"/><rect class="tt-crater" x="3" y="4" width="1" height="1"/><rect class="tt-crater" x="4" y="1" width="1" height="1"/></g>
      </g>
    </svg>
  </button>`;
}

// Not used right now (removed from the home page). To bring the marquee back,
// import ticker in src/pages.mjs and put ${ticker()} where it should appear.
export function ticker() {
  const items = disciplines.map((d) => `<span>${esc(d)}</span>`).join('<i aria-hidden="true">■</i>');
  return `<div class="ticker" aria-label="Disciplines: ${esc(disciplines.join(', '))}">
    <div class="ticker__track" aria-hidden="true">${items}<i>■</i>${items}<i>■</i></div>
  </div>`;
}

// `ogImage` is the link-preview image (Open Graph) for the page, a path in
// /public. Default: the home image (name card). Services uses its own; case
// studies, the Case studies page, and the Archive use the case-study image.
// The images live in /public/og/; their sources are in /scripts/og/.
export function layout({ path, title, description = site.description, body, pageClass = '', ogImage = '/og/og-home.png' }) {
  const fullTitle = path === '/' ? `${site.name} · ${site.role}` : `${title} · ${site.name}`;
  const url = site.url + path;
  const navLinks = nav
    .map((n) => {
      const current = path.startsWith(n.href) ? ' aria-current="page"' : '';
      return `<li><a href="${n.href}"${current}>${esc(n.label)}</a></li>`;
    })
    .join('');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${site.url}${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#F6F3EC">
<script>
  // Set the theme before first paint: saved choice, else the system setting.
  (function () {
    var t, d = document.documentElement;
    try { t = localStorage.getItem('theme'); } catch (e) {}
    if (t !== 'light' && t !== 'dark') t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    d.dataset.theme = t;
    d.classList.add('js');
    // Header art: pick pixel-art-1, -2 or -3, never the one shown last time.
    // ?art=1|2|3 in the address forces one version (handy while editing).
    var forced = (location.search.match(/[?&]art=([123])/) || [])[1];
    var last; try { last = localStorage.getItem('pixelArt'); } catch (e) {}
    var pool = ['1', '2', '3'].filter(function (n) { return n !== last; });
    var art = forced || pool[Math.floor(Math.random() * pool.length)];
    d.dataset.art = art;
    // ?toggle=tile or ?toggle=sun previews an earlier switch
    d.dataset.toggle = (location.search.match(/[?&]toggle=(tile|sun)/) || [])[1] || 'gradient';
    if (!forced) { try { localStorage.setItem('pixelArt', art); } catch (e) {} }
    // ?font=schibsted, ?font=onest or ?font=bricolage previews another heading font
    var fonts = { schibsted: 'Schibsted+Grotesk:wght@400..900', onest: 'Onest:wght@400..900', bricolage: 'Bricolage+Grotesque:opsz,wght@12..96,400..800' };
    var f = (location.search.match(/[?&]font=(schibsted|onest|bricolage)/) || [])[1];
    if (f) {
      d.dataset.font = f;
      var l = document.createElement('link');
      l.rel = 'stylesheet'; l.href = 'https://fonts.googleapis.com/css2?family=' + fonts[f] + '&display=swap';
      document.head.appendChild(l);
    }
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.content = t === 'dark' ? '#1C1834' : '#F6F3EC';
  })();
</script>
<!-- Icons: new file names (v4) whenever the icon changes, so browsers can't keep an old copy -->
<link rel="icon" href="/icons/paperclip-v4.svg" type="image/svg+xml">
<link rel="icon" href="/icons/paperclip-v4-32.png" type="image/png" sizes="32x32">
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="apple-touch-icon" href="/icons/apple-touch-icon-v4.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400..800&family=Instrument+Sans:ital,wght@0,400..700;1,400..700&family=JetBrains+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="/styles.css">
<script src="/main.js" defer></script>
</head>
<body class="${pageClass}">
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap site-header__inner">
    <a class="brand" href="/" aria-label="${esc(site.brand)}, home"><span>${esc(site.brand)}</span></a>
    <nav id="site-nav" class="site-nav" aria-label="Main">
      <ul>${navLinks}</ul>
      <div class="nav-theme">
        <span class="nav-theme__label" aria-hidden="true"><span class="nav-theme__to-dark">Dark mode</span><span class="nav-theme__to-light">Light mode</span></span>
        ${gradientToggle()}
        ${tileToggle()}
        ${themeToggle()}
      </div>
    </nav>
    ${gradientToggle()}
    ${tileToggle()}
    ${themeToggle()}
    <button class="nav-toggle" aria-expanded="false" aria-controls="site-nav" aria-label="Menu"><span class="nav-toggle__box" aria-hidden="true"><i></i><i></i></span><span class="nav-toggle__label">Menu</span></button>
  </div>
</header>
<main id="main">
${body}
</main>
<footer class="site-footer">
  <div class="wrap site-footer__inner">
    <div>
      <p class="site-footer__name">${logo()} ${esc(site.name)}</p>
      <p class="muted">${esc(site.role)}.</p>
    </div>
    <div class="site-footer__nav">
      <ul class="site-footer__links" role="list">
        ${nav.map((n) => `<li><a href="${n.href}">${esc(n.label)}</a></li>`).join('')}
      </ul>
      <ul class="site-footer__links site-footer__links--social" role="list">
        ${site.github ? `<li><a href="${site.github}">GitHub</a></li>` : ''}
        <li><a href="${site.linkedin}">LinkedIn</a></li>
      </ul>
    </div>
    <p class="site-footer__meta mono">© ${new Date().getFullYear()} ${esc(site.name)}</p>
  </div>
</footer>
</body>
</html>`;
}
