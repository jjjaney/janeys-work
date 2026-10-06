import { readFileSync } from 'node:fs';
import { site } from './site.mjs';

export const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// Every placeholder rendered during a build is collected here so the build
// can print a checklist.
export const todoLog = [];
let currentPage = '';
export const setPage = (p) => (currentPage = p);

/** Visible placeholder that tells Janey what content is missing. */
export function todo(text, { inline = false } = {}) {
  todoLog.push({ page: currentPage, text });
  if (!site.showTodos) return '';
  const tag = inline ? 'span' : 'aside';
  return `<${tag} class="todo${inline ? ' todo--inline' : ''}" role="note"><span class="todo__label">TODO</span> ${text}</${tag}>`;
}

/** Image slot: a real <img> when src is set, otherwise a placeholder frame. */
export function figure(image, slug) {
  if (!image) return '';
  if (image.src) {
    return `<figure class="shot"><img src="${esc(image.src)}" alt="${esc(image.alt)}" loading="lazy" decoding="async"></figure>`;
  }
  todoLog.push({ page: currentPage, text: `Add image: ${image.alt}` });
  if (!site.showTodos) return '';
  return `<figure class="shot shot--empty" role="note">
    <div class="shot__grid" aria-hidden="true"></div>
    <figcaption><span class="todo__label">TODO</span> Add a screenshot: <em>${esc(image.alt)}</em>.<br><code>/public/images/work/${esc(slug)}/</code>, then set <code>src</code> in <code>src/content/work.mjs</code>.</figcaption>
  </figure>`;
}

// ---------------------------------------------------------------------------
// Pixel art
// ---------------------------------------------------------------------------

// Optional: map the pixel-art palette onto the site's core colors with
// pixel(name, { palette: 'brand' }). Not used by default; the art keeps its
// original colors, which are part of the site palette.
const BRAND_MAP = {
  '#ff7b4d': '#4f33cc', // orange → accent purple
  '#cfa2ed': '#a99bea', // lilac → purple tint
  '#0b704f': '#cc3333', // green → highlight red
  '#6b2337': '#4f4f4f', // maroon → charcoal
  '#b6d8fe': '#dbe0e6', // sky → gray-blue
  '#c99f43': '#e7dfcd', // gold → deep cream
};

const artCache = new Map();

/**
 * Inline a pixel composition as an SVG with:
 * - class-based fills converted to attributes (so several SVGs on one page
 *   don't fight over `.cls-1`),
 * - ids removed (no duplicate ids),
 */
export function pixel(name, { palette = 'original', label = '', className = '', crop = false, organic = false } = {}) {
  if (organic === true) {
    // all three organic versions; the page shows one (see ART_SHAPES)
    return `<div class="pixel-variants">${ART_NAMES.map((n) =>
      pixel(name, { palette, label, className: `${className} pixel--organic`.trim(), organic: n }).replace('<svg ', `<svg data-variant="${n}" `)
    ).join('')}</div>`;
  }
  const key = `${name}|${palette}|${organic}`;
  let svg = artCache.get(key);
  if (!svg) {
    let raw = readFileSync(new URL(`./art/${name}.svg`, import.meta.url), 'utf8');
    const classes = {};
    for (const [, cls, color] of raw.matchAll(/\.(cls-\d+)\s*\{\s*fill:\s*(#[0-9a-fA-F]{6})/g)) {
      const c = color.toLowerCase();
      classes[cls] = palette === 'brand' ? BRAND_MAP[c] ?? c : c;
    }
    const viewBox = raw.match(/viewBox="([^"]+)"/)[1];
        let body = raw
      .replace(/<\?xml[^>]*>/, '')
      .replace(/<defs>[\s\S]*?<\/defs>/, '')
      .replace(/^[\s\S]*?<svg[^>]*>/, '')
      .replace(/<\/svg>\s*$/, '')
      .replace(/\s(id|data-name)="[^"]*"/g, '')
      // stroke in the same color hides anti-aliasing seams between tiles
      .replace(/class="(cls-\d+)"/g, (_, c) => `fill="${classes[c]}" stroke="${classes[c]}" stroke-width="1.1"`)
      .replace(/<g>\s*/g, '')
      .replace(/<\/g>\s*/g, '')
      .replace(/\s+/g, ' ');
    if (organic) body = erode(body, viewBox, organic);
    svg = { body, viewBox };
    artCache.set(key, svg);
  }
  const aria = label ? `role="img" aria-label="${esc(label)}"` : 'aria-hidden="true" focusable="false"';
  // Organic art always shows its whole silhouette; ragged edges would be lost to cropping.
  const par = crop && !organic ? ' preserveAspectRatio="xMidYMid slice"' : '';
  return `<svg class="pixel ${className}" viewBox="${svg.viewBox}"${par} xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" ${aria}>${svg.body}</svg>`;
}

// Stable pseudo-random number in 0–1 for a grid position.
function hash(x, y, salt = 0) {
  let h = (Math.round(x) * 374761393 + Math.round(y) * 668265263 + salt * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

/**
 * Header art shapes: "organic" versions of the pixel art that build up from
 * the bottom. Each page load shows one of these, never the same one twice in
 * a row. Add ?art=1, ?art=2 or ?art=3 to a page's address to see one version.
 *
 * Each recipe returns the height of the pile (0 = bottom, 1 = top) for a
 * column, given u (0 = left edge, 1 = right edge) and a per-column random
 * number `r` (0–1) that makes the top edge lumpy. Edit the numbers to reshape.
 */
export const ART_SHAPES = {
  // pixel-art-1 (default): rises from left to right, like a growing chart
  'pixel-art-1': (u, r) => 0.3 + 0.72 * u + 0.09 * Math.sin(u * 9 + 0.6) + (r - 0.5) * 0.14,
  // pixel-art-2: a mound that builds up in the middle, lower at both sides
  'pixel-art-2': (u, r) => 0.3 + 0.68 * Math.sin(Math.PI * u) + 0.07 * Math.sin(u * 11 + 1.7) + (r - 0.5) * 0.12,
  // pixel-art-3: blocky stairs that climb from right to left
  'pixel-art-3': (u, r) => 0.32 + 0.68 * (Math.floor((1 - u) * 4 + 0.5) / 4) + (r - 0.5) * 0.1,
};
export const ART_NAMES = Object.keys(ART_SHAPES);

/**
 * Remove squares to make the organic shape: everything below the pile's
 * surface stays, the surface itself is ragged, and a few loose squares hover
 * just above it as if still landing. Deterministic per shape.
 */
function erode(body, viewBox, shapeName) {
  const shape = ART_SHAPES[shapeName];
  const salt = ART_NAMES.indexOf(shapeName) * 10;
  const [, , W, H] = viewBox.split(/\s+/).map(Number);
  return body.replace(/<rect\s([^>]*?)\/>/g, (m, attrs) => {
    const num = (k) => Number((attrs.match(new RegExp(`\\s?${k}="([\\d.]+)"`)) || [0, 0])[1]);
    const x = num('x'), y = num('y'), w = num('width'), h = num('height');
    const u = (x + w / 2) / W;           // 0 left → 1 right
    const v = 1 - (y + h / 2) / H;       // 0 bottom → 1 top
    const col = Math.round(x / w);
    const surface = Math.min(1.05, shape(u, hash(col, 0, 4 + salt)));
    const gap = v - surface;             // < 0: inside the pile, > 0: above it
    const step = h / H;                  // one square, as a fraction of the height
    if (gap > step * 3.2) return '';                                          // open sky
    if (gap > step * 0.4) return hash(x, y, 5 + salt) < 0.12 / (1 + gap / step) ? m : ''; // loose squares landing
    if (gap > -step * 1.2) return hash(x, y, 6 + salt) < 0.65 ? m : '';       // ragged top surface
    // ragged bottom edge: the lowest rows thin out, more so away from the right edge
    if (v < step) return hash(x, y, 7 + salt) < 0.25 + 0.35 * (1 - u) ? '' : m;
    if (v < step * 2) return hash(x, y, 8 + salt) < 0.08 + 0.17 * (1 - u) ? '' : m;
    if (hash(x, y, 3 + salt) < 0.03) return '';                               // a rare hole inside
    return m;
  });
}

/** A small decorative strip of squares in the site palette. */

export const arrow = `<svg class="arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square"/></svg>`;
export const external = `<svg class="arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3h8v8M13 3 3 13" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square"/></svg>`;

/**
 * A small stepped cluster of pixels that hugs the top-right corner of a
 * section, plus a few loose pixels floating just above it that lead into it.
 * Squares are one grid cell each; the cell size comes from the page's header
 * art (--art-cell, set by main.js), so they match the other pixel art.
 * The cluster carries the `pixel` class, so it gets the occasional tile flip.
 *
 * Grid: x counts columns from the right edge, y counts rows from the top of
 * the section (negative y = above the section).
 */
// bg: the band's own color; any corner pixel that would match it turns purple
// instead, so the cluster always reads against the band.
export function pixelCorner(bg = '#4f33cc') {
  const sw = (c) => (c.toLowerCase() === bg.toLowerCase() ? '#4f33cc' : c);
  const o = sw('#ff7b4d'), l = sw('#cfa2ed'), g = sw('#0b704f'), y = sw('#c99f43'), s = sw('#b6d8fe'), m = sw('#6b2337');
  // [x, y, color] for the cluster: a staircase stepping down into the corner
  const cluster = [
    [0, 0, g], [1, 0, o], [2, 0, l], [3, 0, s], [4, 0, y],
    [0, 1, o], [1, 1, m], [2, 1, y],
    [0, 2, l], [1, 2, s],
    [0, 3, y],
    [3, 2, o], // a loose one just off the steps
  ];
  const W = 5, H = 4;
  const rects = cluster
    .map(([x, y, c]) => `<rect x="${W - 1 - x}" y="${y}" width="1" height="1" fill="${c}" stroke="${c}" stroke-width="0.03"/>`)
    .join('');
  // loose pixels above the section, drifting down into the corner: [x, y, color, show on phones?]
  const above = [
    [5, -1, l, true],
    [7, -2, o, false],
    [2, -2, g, false],
  ];
  return `<svg class="pixel pixel-corner" viewBox="0 0 ${W} ${H}" shape-rendering="crispEdges" aria-hidden="true" focusable="false">${rects}</svg>
    <div class="corner-floaters" aria-hidden="true">${above
      .map(([x, y, c, m]) => `<i${m ? ' class="m"' : ''} style="--x:${x};--y:${y};background:${c}"></i>`)
      .join('')}</div>`;
}

/**
 * Floating pixels: loose squares scattered around a page header, in the open
 * space around the heading and the art, with a few spilling just below the
 * header. Positions are percentages of the header box; `spots` lists the
 * regions to scatter into as [left%, top%, width%, height%, count].
 * Squares in `mobile` regions also show on phones; the rest are desktop-only
 * so they never sit on top of text in the stacked phone layout.
 */
export function floaters(spots, { seed = 11 } = {}) {
  const colors = ['#ff7b4d', '#cfa2ed', '#0b704f', '#c99f43', '#b6d8fe', '#6b2337'];
  let out = '';
  let n = 0;
  for (const [x, y, w, h, count, mobile = false] of spots) {
    for (let i = 0; i < count; i++, n++) {
      const left = (x + hash(n, seed, 7) * w).toFixed(1);
      const top = (y + hash(n, seed, 8) * h).toFixed(1);
      const color = colors[Math.floor(hash(n, seed, 10) * colors.length)];
      out += `<i${mobile ? ' class="m"' : ''} style="left:${left}%;top:${top}%;background:${color}"></i>`;
    }
  }
  return `<div class="floaters" aria-hidden="true">${out}</div>`;
}
