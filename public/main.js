(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mobile navigation ------------------------------------------------------
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  if (toggle && nav) {
    const set = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    };
    toggle.addEventListener('click', () => set(toggle.getAttribute('aria-expanded') !== 'true'));
    document.addEventListener('keydown', (e) => e.key === 'Escape' && set(false));
    window.matchMedia('(min-width: 761px)').addEventListener('change', () => set(false));
  }

  // Theme toggle -----------------------------------------------------------
  const root = document.documentElement;
  const themeBtns = document.querySelectorAll('.theme-toggle');
  const meta = document.querySelector('meta[name="theme-color"]');
  const applyTheme = (t, save) => {
    root.dataset.theme = t;
    themeBtns.forEach((b) => b.setAttribute('aria-checked', String(t === 'dark')));
    if (meta) meta.content = t === 'dark' ? '#1C1834' : '#F6F3EC';
    if (save) {
      try { localStorage.setItem('theme', t); } catch {}
    }
  };
  applyTheme(root.dataset.theme === 'dark' ? 'dark' : 'light');
  themeBtns.forEach((b) =>
    b.addEventListener('click', () => {
      // replay the tile flip wave each time
      b.classList.remove('is-flipping');
      void b.offsetWidth;
      b.classList.add('is-flipping');
      applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true);
    })
  );
  // In the phone menu, the "Dark mode / Light mode" words are part of the
  // switch: tapping anywhere on that row flips the theme.
  document.querySelectorAll('.nav-theme').forEach((row) =>
    row.addEventListener('click', (e) => {
      if (e.target.closest('.theme-toggle')) return;
      const btn = [...row.querySelectorAll('.theme-toggle')].find((b) => b.checkVisibility());
      if (btn) btn.click();
    })
  );
  // Follow the system setting until the visitor picks a theme themselves.
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    let saved = null;
    try { saved = localStorage.getItem('theme'); } catch {}
    if (!saved) applyTheme(e.matches ? 'dark' : 'light');
  });

  // Company names under the home header: never more than two lines (one on
  // wide screens). If they'd wrap further or run past the edge, drop names
  // from the end; the "and more" link always stays last.
  const fitLists = () =>
    document.querySelectorAll('[data-fit-lines]').forEach((ul) => {
      const max = Number(ul.dataset.fitLines);
      const items = [...ul.children].filter((li) => !li.classList.contains('logos__more'));
      items.forEach((li) => (li.hidden = false));
      const box = ul.parentElement;
      const tooBig = () => {
        const shown = [...ul.children].filter((li) => !li.hidden);
        const rows = new Set(shown.map((li) => Math.round(li.getBoundingClientRect().top))).size;
        return rows > max || shown.at(-1).getBoundingClientRect().right > box.getBoundingClientRect().right + 1;
      };
      for (let n = items.length - 1; n > 0 && tooBig(); n--) items[n].hidden = true;
    });
  fitLists();
  document.fonts?.ready.then(fitLists);
  let fitT;
  window.addEventListener('resize', () => (clearTimeout(fitT), (fitT = setTimeout(fitLists, 120))));

  // Floating pixels: hide any that would sit on top of text -----------------
  // Positions are fixed percentages, so on some titles or screen widths a
  // square can land on a word. Check against the real lines of text and hide
  // just those squares; recheck when the layout changes.
  const floaterBoxes = [...document.querySelectorAll('.floaters')];
  if (floaterBoxes.length || document.querySelector('.cta-band')) {
    // Each header's floating squares are sized to one square of its art and
    // snapped onto the art's grid, so they read as loose pixels of the same image.
    const heads = [...document.querySelectorAll('.hero, .case__head, .page-head--art')];
    const gridFor = (head) => {
      const svg = [...head.querySelectorAll('.hero__art .pixel, .case__art .pixel, .portrait .pixel')].find((el) => el.getClientRects().length);
      const rect = svg?.querySelector('rect');
      if (!rect) return null;
      const [, , vw, vh] = svg.getAttribute('viewBox').split(/\s+/).map(Number);
      const box = svg.getBoundingClientRect();
      const scale = Math.min(box.width / vw, box.height / vh); // the art is scaled to fit its box
      // Art drawn on a finer grid (the 404 scene) sets data-cell="px-art" so its
      // floating squares use the site's standard pixel size, not its own tiny cells.
      let cell = Number(rect.getAttribute('width')) * scale;
      if (svg.dataset.cell === 'px-art') {
        const probe = document.createElement('i');
        probe.style.cssText = 'position:absolute;visibility:hidden;width:var(--px-art)';
        document.body.append(probe);
        cell = probe.getBoundingClientRect().width || cell;
        probe.remove();
      }
      return {
        svg,
        cell,
        // where the art's top-left corner lands on the page
        x0: box.left + (box.width - vw * scale) / 2,
        y0: box.top + (box.height - vh * scale) / 2,
      };
    };

    const layout = () => {
      // lines of text the squares must stay clear of
      const lines = [];
      document.querySelectorAll('.hero, .case__head, .page-head--art, .spill + *, .case__body, .about-head').forEach((root) => {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) {
          const n = walker.currentNode;
          if (!n.textContent.trim() || n.parentElement.closest('.floaters') || (n.parentElement.checkVisibility && !n.parentElement.checkVisibility())) continue;
          const range = document.createRange();
          range.selectNodeContents(n);
          for (const r of range.getClientRects()) if (r.width && r.height) lines.push(r);
        }
        root.querySelectorAll('.btn, .todo, .meta > div').forEach((e) => lines.push(e.getBoundingClientRect()));
      });
      const pad = 10;
      const onText = (a) => lines.some((r) => a.left < r.right + pad && a.right > r.left - pad && a.top < r.bottom + pad && a.bottom > r.top - pad);

      heads.forEach((head) => {
        const g = gridFor(head);
        if (!g) return;
        head.style.setProperty('--cell', `${g.cell.toFixed(2)}px`);
        // the strip of pixels just below the header lives right after it (outside the
        // header, so nothing the header clips can cut it off)
        const strip = head.nextElementSibling?.classList.contains('spill') ? head.nextElementSibling : null;
        strip?.style.setProperty('--cell', `${g.cell.toFixed(2)}px`);
        if (head === heads[0]) root.style.setProperty('--art-cell', `${g.cell.toFixed(2)}px`); // the band's corner art uses it too
        const key = (x, y) => `${Math.round((x - g.x0) / g.cell)},${Math.round((y - g.y0) / g.cell)}`;
        // grid cells already filled by the art itself
        const taken = new Set([...g.svg.querySelectorAll('rect')].map((r) => {
          const b = r.getBoundingClientRect();
          return key(b.left, b.top);
        }));
        [...head.querySelectorAll('.floaters i'), ...(strip ? strip.querySelectorAll('.floaters i') : [])].forEach((i) => {
          // go back to the authored % position, then snap to the nearest grid cell
          if (!i.dataset.left) (i.dataset.left = i.style.left), (i.dataset.top = i.style.top);
          i.hidden = false;
          if (getComputedStyle(i).display === 'none') return; // desktop-only square on a phone
          // work from the authored % position inside the floaters box (not the square's
          // current spot), so recalculating never compounds
          const box = i.parentElement.getBoundingClientRect();
          const ax = box.left + (parseFloat(i.dataset.left) / 100) * box.width;
          const ay = box.top + (parseFloat(i.dataset.top) / 100) * box.height;
          // squares in a cluster share their anchor's cell plus a whole-cell offset
          const gx = g.x0 + (Math.round((ax - g.x0) / g.cell) + Number(i.dataset.dx || 0)) * g.cell;
          const gy = g.y0 + (Math.round((ay - g.y0) / g.cell) + Number(i.dataset.dy || 0)) * g.cell;
          i.style.left = `${(gx - box.left).toFixed(2)}px`;
          i.style.top = `${(gy - box.top).toFixed(2)}px`;
          const k = key(gx, gy);
          const snapped = { left: gx, top: gy, right: gx + g.cell, bottom: gy + g.cell };
          // skip squares that would cover text, the art, or another square
          // skip squares that would drift above the section (behind the header bar)
          const tooHigh = gy < head.getBoundingClientRect().top;
          if (tooHigh || taken.has(k) || onText(snapped)) i.hidden = true;
          else taken.add(k);
        });
      });
    };
    // loose pixels above the closing band: hide any that would sit on text
    const cullCorner = () => {
      document.querySelectorAll('.cta-band').forEach((band) => {
        const prev = band.previousElementSibling;
        const lines = [];
        if (prev) {
          const walker = document.createTreeWalker(prev, NodeFilter.SHOW_TEXT);
          while (walker.nextNode()) {
            const n = walker.currentNode;
            if (!n.textContent.trim() || (n.parentElement.checkVisibility && !n.parentElement.checkVisibility())) continue;
            const range = document.createRange();
            range.selectNodeContents(n);
            for (const r of range.getClientRects()) if (r.width && r.height) lines.push(r);
          }
          prev.querySelectorAll('.btn, .todo, a, img').forEach((e) => lines.push(e.getBoundingClientRect()));
        }
        band.querySelectorAll('.corner-floaters i').forEach((i) => {
          i.hidden = false;
          const a = i.getBoundingClientRect();
          if (!a.width) return;
          i.hidden = lines.some((r) => a.left < r.right + 8 && a.right > r.left - 8 && a.top < r.bottom + 8 && a.bottom > r.top - 8);
        });
      });
    };
    // Flank: fill the strip left of the header text with pixels on the same
    // grid as the header art. Densest at the screen edge, thinning toward the
    // text, with ragged top and bottom ends. Same pattern on every visit.
    const hash = (x, y, salt) => {
      let h = (x * 374761393 + y * 668265263 + salt * 2147483647) | 0;
      h = Math.imul(h ^ (h >>> 13), 1274126177);
      return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
    };
    const flankColors = ['#ff7b4d', '#cfa2ed', '#0b704f', '#c99f43', '#b6d8fe', '#6b2337'];
    const fillFlanks = () => {
      heads.forEach((head) => {
        const flank = head.querySelector('.flank');
        if (!flank || getComputedStyle(flank).display === 'none') return;
        const g = gridFor(head);
        if (!g) return;
        const fb = flank.getBoundingClientRect();
        const text = flank.parentElement.getBoundingClientRect();
        // columns that fit between the screen edge and the text, rows to cover it
        const textLeft = text.left + parseFloat(getComputedStyle(flank.parentElement).paddingLeft);
        const cols = Math.min(3, Math.max(2, Math.floor((textLeft - 12) / g.cell)));
        // snap rows to the art's grid
        const firstRow = Math.floor((fb.top - g.y0) / g.cell);
        const rows = Math.ceil(fb.height / g.cell) + 1;
        const seed = Number(flank.dataset.seed) || 1;
        let out = '';
        for (let r = 0; r < rows; r++) {
          // ends thin out so the flank fades in and out
          const end = Math.min(r, rows - 1 - r);
          const endFade = end === 0 ? 0.35 : end === 1 ? 0.7 : 1;
          for (let c = 0; c < cols; c++) {
            // three columns: dense at the screen edge, medium, then light toward the text
            const density = (c === 0 ? 0.85 : c === 1 ? 0.5 : c === 2 ? 0.24 : 0) * endFade;
            if (hash(c, r, seed) >= density) continue;
            const color = flankColors[Math.floor(hash(c, r, seed + 50) * flankColors.length)];
            const top = g.y0 + (firstRow + r) * g.cell - fb.top;
            out += `<i style="left:${(c * g.cell).toFixed(2)}px;top:${top.toFixed(2)}px;background:${color}"></i>`;
          }
        }
        flank.innerHTML = out;
      });
    };
    // Home headline: two lines on wider screens. The CSS sizes it roughly to the
    // column; this measures the real lines and sets the exact size, so it's
    // right even if the browser got the first layout or the font timing wrong.
    const fitTitle = () => {
      const title = document.querySelector('.hero__title');
      if (!title) return;
      title.style.fontSize = '';
      const lines = title.querySelectorAll('.hero__line');
      if (!lines.length || getComputedStyle(lines[0]).display !== 'block') return;
      const copy = title.parentElement;
      const cs = getComputedStyle(copy);
      const avail = copy.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const widest = Math.max(...[...lines].map((l) => l.scrollWidth));
      // size it to fill the column exactly (grow or shrink), never past 5.5rem
      const max = 5.5 * parseFloat(getComputedStyle(document.documentElement).fontSize);
      if (widest > 0 && avail > 0) title.style.fontSize = `${Math.min(max, (parseFloat(getComputedStyle(title).fontSize) * avail) / widest * 0.99).toFixed(2)}px`;
    };
    // layout() sets the art's cell size, which sets the headline column's left
    // padding, so lay out first, fit the headline to that column, then lay out
    // again so the floating squares avoid the headline at its final size.
    // About page: the "On this page" tiles sit inside the intro art; clear any
    // art pixels (and floating squares) from the space they take, plus a little
    // margin, so the list always sits in a clean pocket of the art.
    const clearToc = () => {
      const toc = document.querySelector('.portrait .toc');
      if (!toc) return;
      const portrait = toc.closest('.portrait');
      portrait.querySelectorAll('[data-toc-hidden]').forEach((el) => { el.style.visibility = ''; el.removeAttribute('data-toc-hidden'); });
      if (getComputedStyle(toc).position !== 'absolute') return; // phones: the list sits below the art
      const pad = 10;
      const boxes = [toc.querySelector('.toc__title'), ...toc.querySelectorAll('a')].map((e) => e.getBoundingClientRect());
      const near = (r) => boxes.some((b) => r.left < b.right + pad && r.right > b.left - pad && r.top < b.bottom + pad && r.bottom > b.top - pad);
      portrait.querySelectorAll('svg rect, .floaters i').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width && near(r)) { el.style.visibility = 'hidden'; el.setAttribute('data-toc-hidden', ''); }
      });
    };
    const cull = () => (layout(), fitTitle(), layout(), fillFlanks(), cullCorner(), clearToc());
    cull();
    // Refit once the real fonts arrive. Safari can resolve fonts.ready before
    // web fonts have even started loading, so also wait for the heading font
    // itself, listen for any later font loads, and refit after the full page load.
    document.fonts?.ready.then(cull);
    document.fonts?.load('750 1em "Plus Jakarta Sans"').then(cull, () => {});
    document.fonts?.addEventListener?.('loadingdone', cull);
    window.addEventListener('load', cull);
    let t;
    const later = () => (clearTimeout(t), (t = setTimeout(cull, 150)));
    window.addEventListener('resize', later);
    // and whenever the headline's column changes size for any other reason
    const heroCopy = document.querySelector('.hero__copy');
    if (heroCopy && 'ResizeObserver' in window) {
      let lastW = 0;
      new ResizeObserver(([e]) => { const w = Math.round(e.contentRect.width); if (w !== lastW) { lastW = w; later(); } }).observe(heroCopy);
    }
  }

  // About page: each version recording shows its still image and plays only
  // while the pointer is over its window, then pauses. On touch screens,
  // tapping plays or pauses it.
  document.querySelectorAll('video[data-autoplay]').forEach((v) => {
    const frame = v.closest('.version__frame') || v;
    const play = () => { v.preload = 'auto'; v.play().catch(() => {}); };
    frame.addEventListener('mouseenter', play);
    frame.addEventListener('mouseleave', () => v.pause());
    frame.addEventListener('click', (e) => { if (e.pointerType !== 'mouse') v.paused ? play() : v.pause(); });
  });

  // Pixel art: now and then a single tile flips over to another color --------
  // One flip at a time across the whole page, only for art that's on screen.
  // The tile flips back after a while so each composition stays recognizable.
  if (!reduce && 'IntersectionObserver' in window) {
    const arts = [...document.querySelectorAll('.pixel:not([data-noflip])')].map((svg) => {
      const rects = [...svg.querySelectorAll('rect')];
      return { svg, rects, palette: [...new Set(rects.map((r) => r.getAttribute('fill')))], visible: false };
    }).filter((a) => a.rects.length && a.palette.length > 1);

    const io = new IntersectionObserver((entries) =>
      entries.forEach((e) => {
        const a = arts.find((x) => x.svg === e.target);
        if (a) a.visible = e.isIntersecting;
      })
    );
    arts.forEach((a) => io.observe(a.svg));

    const setColor = (r, c) => (r.setAttribute('fill', c), r.setAttribute('stroke', c));
    const flip = (r, color) => {
      r.classList.add('flip');
      setTimeout(() => setColor(r, color), 350); // swap at the halfway point, when the tile is edge-on
      setTimeout(() => r.classList.remove('flip'), 720);
    };

    setInterval(() => {
      if (document.hidden) return;
      const onScreen = arts.filter((a) => a.visible);
      if (!onScreen.length) return;
      const a = onScreen[Math.floor(Math.random() * onScreen.length)];
      const r = a.rects[Math.floor(Math.random() * a.rects.length)];
      if (r.dataset.flipped) return;
      const was = r.getAttribute('fill');
      const options = a.palette.filter((c) => c !== was);
      r.dataset.flipped = '1';
      flip(r, options[Math.floor(Math.random() * options.length)]);
      setTimeout(() => {
        flip(r, was);
        setTimeout(() => delete r.dataset.flipped, 750);
      }, 6000);
    }, 4200);
  }

  // Services page: mark the service that's on screen in the jump bar. (The
  // bar's sticky position comes from --header-h in styles.css, not from a
  // measurement here: Safari could measure the header too tall, which left
  // the bar stuck partway down the page.)
  const jump = document.querySelector('.svc-jump');
  if (jump && 'IntersectionObserver' in window) {
    const links = [...jump.querySelectorAll('a')];
    const bands = [...document.querySelectorAll('.svc-band')];
    const inView = new Set();
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          e.isIntersecting ? inView.add(e.target) : inView.delete(e.target);
          // past the last band (or above the first): nothing is current
          if (!inView.size) return links.forEach((a) => a.removeAttribute('aria-current'));
          if (!e.isIntersecting) return;
          links.forEach((a) => {
            if (a.getAttribute('href') !== `#${e.target.id}`) return a.removeAttribute('aria-current');
            a.setAttribute('aria-current', 'true');
            // on narrow screens, slide the bar so the current service stays visible
            const ul = a.closest('ul');
            const l = a.offsetLeft - ul.offsetLeft;
            if (l < ul.scrollLeft || l + a.offsetWidth > ul.scrollLeft + ul.clientWidth) ul.scrollTo({ left: l - 16, behavior: reduce ? 'auto' : 'smooth' });
          });
        }),
      { rootMargin: '-45% 0px -50% 0px' }
    );
    bands.forEach((b) => io.observe(b));
  }

  // Gentle reveal for sections ---------------------------------------------
  if ('IntersectionObserver' in window && !reduce) {
    const targets = document.querySelectorAll('.story, .kind__card, .stairs > li, .svc-type > li, .principles li, .outcome, .highlight, .archive li, .engage li, .facts li');
    targets.forEach((t) => t.classList.add('reveal'));
    const bands = [...document.querySelectorAll('.svc-band')];
    const inView = new Set();
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          e.isIntersecting ? inView.add(e.target) : inView.delete(e.target);
          // past the last band (or above the first): nothing is current
          if (!inView.size) return links.forEach((a) => a.removeAttribute('aria-current'));
          if (!e.isIntersecting) return;
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    targets.forEach((t) => io.observe(t));
  }

  // Contact form -----------------------------------------------------------
  const form = document.querySelector('[data-contact]');
  if (form) {
    const status = form.querySelector('.form__status');
    const topic = new URLSearchParams(location.search).get('topic');
    const select = form.querySelector('select[name="topic"]');
    if (topic && select) {
      const match = [...select.options].find((o) => o.value === topic);
      if (match) select.value = topic;
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.className = 'form__status';
      if (form.hasAttribute('data-unconnected')) {
        status.classList.add('is-error');
        status.textContent = 'This form isn’t connected yet. Please reach out on LinkedIn for now.';
        return;
      }
      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      status.textContent = 'Sending…';
      try {
        const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error();
        form.reset();
        status.classList.add('is-ok');
        status.textContent = 'Thanks! Your message is on its way. I’ll get back to you soon.';
      } catch {
        status.classList.add('is-error');
        status.textContent = 'Something went wrong sending that. Please try again or message me on LinkedIn.';
      } finally {
        btn.disabled = false;
      }
    });
  }
})();
