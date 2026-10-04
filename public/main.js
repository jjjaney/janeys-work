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
  const themeBtn = document.querySelector('.theme-toggle');
  const meta = document.querySelector('meta[name="theme-color"]');
  const applyTheme = (t, save) => {
    root.dataset.theme = t;
    if (themeBtn) themeBtn.setAttribute('aria-checked', String(t === 'dark'));
    if (meta) meta.content = t === 'dark' ? '#1C1834' : '#F6F3EC';
    if (save) {
      try { localStorage.setItem('theme', t); } catch {}
    }
  };
  applyTheme(root.dataset.theme === 'dark' ? 'dark' : 'light');
  themeBtn?.addEventListener('click', () => applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true));
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
  if (floaterBoxes.length) {
    // Each header's floating squares are sized to one square of its art and
    // snapped onto the art's grid, so they read as loose pixels of the same image.
    const heads = [...document.querySelectorAll('.hero, .case__head, .page-head--art')];
    const gridFor = (head) => {
      const svg = head.querySelector('.hero__art .pixel, .case__art .pixel, .portrait .pixel');
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
          if (!n.textContent.trim() || n.parentElement.closest('.floaters')) continue;
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
          if (taken.has(k) || onText(snapped)) i.hidden = true;
          else taken.add(k);
        });
      });
    };
    const cull = layout;
    cull();
    document.fonts?.ready.then(cull);
    let t;
    window.addEventListener('resize', () => (clearTimeout(t), (t = setTimeout(cull, 150))));
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
    }, 2200);
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
