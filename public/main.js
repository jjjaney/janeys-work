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
  // Follow the system setting until the visitor picks a theme themselves.
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    let saved = null;
    try { saved = localStorage.getItem('theme'); } catch {}
    if (!saved) applyTheme(e.matches ? 'dark' : 'light');
  });

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
      return {
        svg,
        cell: Number(rect.getAttribute('width')) * scale,
        // where the art's top-left corner lands on the page
        x0: box.left + (box.width - vw * scale) / 2,
        y0: box.top + (box.height - vh * scale) / 2,
      };
    };

    const layout = () => {
      // lines of text the squares must stay clear of
      const lines = [];
      document.querySelectorAll('.hero, .case__head, .page-head--art, .hero + *, .page-head--art + *, .case__body, .about-head').forEach((root) => {
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
        if (head === heads[0]) root.style.setProperty('--art-cell', `${g.cell.toFixed(2)}px`); // the band's corner art uses it too
        const key = (x, y) => `${Math.round((x - g.x0) / g.cell)},${Math.round((y - g.y0) / g.cell)}`;
        // grid cells already filled by the art itself
        const taken = new Set([...g.svg.querySelectorAll('rect')].map((r) => {
          const b = r.getBoundingClientRect();
          return key(b.left, b.top);
        }));
        head.querySelectorAll('.floaters i').forEach((i) => {
          // go back to the authored % position, then snap to the nearest grid cell
          if (!i.dataset.left) (i.dataset.left = i.style.left), (i.dataset.top = i.style.top);
          i.style.left = i.dataset.left;
          i.style.top = i.dataset.top;
          i.hidden = false;
          if (getComputedStyle(i).display === 'none') return; // desktop-only square on a phone
          const a = i.getBoundingClientRect();
          const gx = g.x0 + Math.round((a.left - g.x0) / g.cell) * g.cell;
          const gy = g.y0 + Math.round((a.top - g.y0) / g.cell) * g.cell;
          i.style.left = `${parseFloat(getComputedStyle(i).left) + (gx - a.left)}px`;
          i.style.top = `${parseFloat(getComputedStyle(i).top) + (gy - a.top)}px`;
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
        const cols = Math.max(2, Math.floor((textLeft - 12) / g.cell));
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
            // a slim edge accent: mostly the outer column, a few strays inward
            const density = (c === 0 ? 0.62 : c === 1 ? 0.2 : c === 2 ? 0.05 : 0) * endFade;
            if (hash(c, r, seed) >= density) continue;
            const color = flankColors[Math.floor(hash(c, r, seed + 50) * flankColors.length)];
            const top = g.y0 + (firstRow + r) * g.cell - fb.top;
            out += `<i style="left:${(c * g.cell).toFixed(2)}px;top:${top.toFixed(2)}px;background:${color}"></i>`;
          }
        }
        flank.innerHTML = out;
      });
    };
    const cull = () => (layout(), fillFlanks(), cullCorner());
    cull();
    document.fonts?.ready.then(cull);
    let t;
    window.addEventListener('resize', () => (clearTimeout(t), (t = setTimeout(cull, 150))));
  }

  // Logo pixel: starts orange, then every few seconds flips over edge-on and
  // lands on the next art color. Stays orange for reduced-motion visitors.
  const logos = document.querySelectorAll('.logo-pixel');
  if (logos.length && !reduce) {
    const cycle = ['--orange', '--lilac', '--green', '--gold', '--sky', '--maroon'];
    let n = 0;
    setInterval(() => {
      if (document.hidden) return;
      n = (n + 1) % cycle.length;
      logos.forEach((el) => {
        el.classList.remove('is-flipping');
        void el.offsetWidth;
        el.classList.add('is-flipping');
        setTimeout(() => el.style.setProperty('--logo', `var(${cycle[n]})`), 180); // swap when edge-on
      });
    }, 3200);
  }

  // Pixel art: now and then a single tile flips over to another color --------
  // One flip at a time across the whole page, only for art that's on screen.
  // The tile flips back after a while so each composition stays recognizable.
  if (!reduce && 'IntersectionObserver' in window) {
    const arts = [...document.querySelectorAll('.pixel')].map((svg) => {
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

  // Gentle reveal for sections ---------------------------------------------
  if ('IntersectionObserver' in window && !reduce) {
    const targets = document.querySelectorAll('.story, .card, .quote, .steps li, .svc, .svc-row, .principles li, .outcome, .highlight, .archive li, .engage li, .facts li');
    targets.forEach((t) => t.classList.add('reveal'));
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
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
