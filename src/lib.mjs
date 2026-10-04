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
 * - a per-square --d delay so tiles can assemble on load.
 */
export function pixel(name, { palette = 'original', label = '', className = '', crop = false } = {}) {
  const key = `${name}|${palette}`;
  let svg = artCache.get(key);
  if (!svg) {
    let raw = readFileSync(new URL(`./art/${name}.svg`, import.meta.url), 'utf8');
    const classes = {};
    for (const [, cls, color] of raw.matchAll(/\.(cls-\d+)\s*\{\s*fill:\s*(#[0-9a-fA-F]{6})/g)) {
      const c = color.toLowerCase();
      classes[cls] = palette === 'brand' ? BRAND_MAP[c] ?? c : c;
    }
    const viewBox = raw.match(/viewBox="([^"]+)"/)[1];
    const [, , , h] = viewBox.split(/\s+/).map(Number);
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
    // Stagger: pixels pop in a scattered order, with a gentle top-to-bottom drift.
    let i = 0;
    body = body.replace(/<(rect|path)\s([^>]*?)\/>/g, (m, tag, attrs) => {
      const y = Number((attrs.match(/\sy="([\d.]+)"/) || [0, 0])[1]);
      const scatter = ((i++ * 7919) % 101) / 101; // deterministic pseudo-random 0–1
      const d = (scatter * 0.9 + (y / h) * 0.25).toFixed(2);
      return `<${tag} ${attrs.trim()} style="--d:${d}s"/>`;
    });
    svg = { body, viewBox };
    artCache.set(key, svg);
  }
  const aria = label ? `role="img" aria-label="${esc(label)}"` : 'aria-hidden="true" focusable="false"';
  const par = crop ? ' preserveAspectRatio="xMidYMid slice"' : '';
  return `<svg class="pixel ${className}" viewBox="${svg.viewBox}"${par} xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" ${aria}>${svg.body}</svg>`;
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
