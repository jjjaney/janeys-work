import { site, nav, disciplines } from './site.mjs';
import { esc } from './lib.mjs';

function logo() {
  // 2×2 pixel mark in the site palette.
  return `<svg class="logo-mark" viewBox="0 0 2 2" aria-hidden="true" shape-rendering="crispEdges">
    <rect width="1" height="1" fill="var(--orange)"/><rect x="1" width="1" height="1" fill="var(--accent)"/>
    <rect y="1" width="1" height="1" fill="var(--lilac)"/><rect x="1" y="1" width="1" height="1" fill="var(--green)"/></svg>`;
}

export function ticker() {
  const items = disciplines.map((d) => `<span>${esc(d)}</span>`).join('<i aria-hidden="true">■</i>');
  return `<div class="ticker" aria-label="Disciplines: ${esc(disciplines.join(', '))}">
    <div class="ticker__track" aria-hidden="true">${items}<i>■</i>${items}<i>■</i></div>
  </div>`;
}

export function layout({ path, title, description = site.description, body, pageClass = '' }) {
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
<meta property="og:image" content="${site.url}/og.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#F6F3EC">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Instrument+Sans:ital,wght@0,400..700;1,400..700&family=JetBrains+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="/styles.css">
<script>document.documentElement.classList.add('js')</script>
<script src="/main.js" defer></script>
</head>
<body class="${pageClass}">
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap site-header__inner">
    <a class="brand" href="/" aria-label="${esc(site.name)}, home">${logo()}<span>${esc(site.name)}</span></a>
    <button class="nav-toggle" aria-expanded="false" aria-controls="site-nav"><span class="nav-toggle__box" aria-hidden="true"><i></i><i></i></span><span class="nav-toggle__label">Menu</span></button>
    <nav id="site-nav" class="site-nav" aria-label="Main">
      <ul>${navLinks}</ul>
    </nav>
  </div>
</header>
<main id="main">
${body}
</main>
<footer class="site-footer">
  ${ticker()}
  <div class="wrap site-footer__inner">
    <div>
      <p class="site-footer__name">${logo()} ${esc(site.name)}</p>
      <p class="muted">${esc(site.role)}.</p>
    </div>
    <ul class="site-footer__links">
      ${nav.map((n) => `<li><a href="${n.href}">${esc(n.label)}</a></li>`).join('')}
      <li><a href="/archive/">Archive</a></li>
      <li><a href="${site.linkedin}">LinkedIn</a></li>
    </ul>
    <p class="site-footer__meta mono">© ${new Date().getFullYear()} ${esc(site.name)}</p>
  </div>
</footer>
</body>
</html>`;
}
