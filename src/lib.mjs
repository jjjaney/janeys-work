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
    if (organic) body = erode(body, viewBox);
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
 * "Organic" pixel art: remove squares so the composition has a ragged,
 * irregular silhouette and a few holes, letting the page show through.
 * Squares thin out with distance from the center, with noise along the edge
 * so the outline wobbles instead of forming a circle. Deterministic, so the
 * same art always erodes the same way.
 */
function erode(body, viewBox) {
  const [, , W, H] = viewBox.split(/\s+/).map(Number);
  return body.replace(/<rect\s([^>]*?)\/>/g, (m, attrs) => {
    const num = (k) => Number((attrs.match(new RegExp(`\\s?${k}="([\\d.]+)"`)) || [0, 0])[1]);
    const w = num('width'), h = num('height');
    const cx = (num('x') + w / 2) / W - 0.5;
    const cy = (num('y') + h / 2) / H - 0.5;
    // 0 at the center, ~1 at the middle of an edge, ~1.4 at a corner
    const d = Math.hypot(cx, cy) * 2;
    // the edge wobbles: low-frequency noise by angle, plus per-square jitter
    const angle = Math.atan2(cy, cx);
    const wobble = 0.16 * Math.sin(angle * 3 + 1.3) + 0.1 * Math.sin(angle * 5 + 0.4);
    const jitter = (hash(num('x'), num('y'), 1) - 0.5) * 0.3;
    const edge = 0.78 + wobble + jitter;
    if (d > edge + 0.18) return '';                                  // well outside: gone
    if (d > edge) return hash(num('x'), num('y'), 2) < 0.45 ? m : ''; // fringe: scattered strays
    if (hash(num('x'), num('y'), 3) < 0.05) return '';                // a few holes inside
    return m;
  });
}

/** A small decorative strip of squares in the site palette. */
export function pixelRule(count = 12, seed = 1) {
  const colors = ['var(--orange)', 'var(--lilac)', 'var(--green)', 'var(--sky)', 'var(--gold)', 'var(--maroon)', 'var(--paper)', 'var(--paper)'];
  let out = '';
  let r = seed * 9301 + 49297; // tiny deterministic PRNG so builds are stable
  for (let i = 0; i < count; i++) {
    r = (r * 9301 + 49297) % 233280;
    const c = colors[Math.floor((r / 233280) * colors.length)];
    out += `<span style="background:${c}"></span>`;
  }
  return `<div class="pixel-rule" aria-hidden="true">${out}</div>`;
}

export const arrow = `<svg class="arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square"/></svg>`;
export const external = `<svg class="arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3h8v8M13 3 3 13" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square"/></svg>`;

/**
 * A pixel border: one full row of colored squares with a sparser row under
 * it, so the edge steps down like pixel art. It carries the `pixel` class, so
 * it gets the same occasional tile flip as the other art.
 */
export function pixelBorder({ columns = 160, size = 14, seed = 7 } = {}) {
  const colors = ['#ff7b4d', '#cfa2ed', '#0b704f', '#c99f43', '#b6d8fe', '#6b2337'];
  let r = seed * 9301 + 49297;
  const rand = () => ((r = (r * 9301 + 49297) % 233280) / 233280);
  let rects = '';
  let last = -1;
  for (let x = 0; x < columns; x++) {
    let c = Math.floor(rand() * colors.length);
    if (c === last) c = (c + 1) % colors.length; // no two neighbors the same
    last = c;
    rects += `<rect x="${x * size}" y="0" width="${size}" height="${size}" fill="${colors[c]}" stroke="${colors[c]}" stroke-width="0.6"/>`;
    if (rand() < 0.3) {
      const c2 = colors[Math.floor(rand() * colors.length)];
      rects += `<rect x="${x * size}" y="${size}" width="${size}" height="${size}" fill="${c2}" stroke="${c2}" stroke-width="0.6"/>`;
    }
  }
  return `<div class="pixel-border" aria-hidden="true"><svg class="pixel" width="${columns * size}" height="${size * 2}" viewBox="0 0 ${columns * size} ${size * 2}" shape-rendering="crispEdges">${rects}</svg></div>`;
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
  const sizes = [10, 14, 14, 18, 22, 28];
  let out = '';
  let n = 0;
  for (const [x, y, w, h, count, mobile = false] of spots) {
    for (let i = 0; i < count; i++, n++) {
      const left = (x + hash(n, seed, 7) * w).toFixed(1);
      const top = (y + hash(n, seed, 8) * h).toFixed(1);
      const size = sizes[Math.floor(hash(n, seed, 9) * sizes.length)];
      const color = colors[Math.floor(hash(n, seed, 10) * colors.length)];
      out += `<i${mobile ? ' class="m"' : ''} style="left:${left}%;top:${top}%;--s:${size}px;background:${color}"></i>`;
    }
  }
  return `<div class="floaters" aria-hidden="true">${out}</div>`;
}
