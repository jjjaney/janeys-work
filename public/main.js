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
    const targets = document.querySelectorAll('.card, .quote, .steps li, .svc, .svc-row, .principles li, .outcome, .highlight, .archive li, .engage li, .facts li');
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
