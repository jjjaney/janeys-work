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

  // Pixel art assembles when it scrolls into view ---------------------------
  const pixels = document.querySelectorAll('.pixel');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add('is-in'), io.unobserve(e.target))),
      { threshold: 0.15 }
    );
    pixels.forEach((p) => io.observe(p));
  } else {
    pixels.forEach((p) => p.classList.add('is-in'));
  }

  // Interactive art: tiles pop on hover; the hero can shuffle ---------------
  document.querySelectorAll('[data-pixel-play]').forEach((box) => {
    const svg = box.querySelector('.pixel');
    if (!svg) return;
    const rects = [...svg.querySelectorAll('rect')];

    if (!reduce) {
      svg.addEventListener('pointerover', (e) => {
        const r = e.target.closest('rect');
        if (!r || r.classList.contains('pop')) return;
        r.classList.add('pop');
        r.addEventListener('animationend', () => r.classList.remove('pop'), { once: true });
      });
    }

    if (!document.body.classList.contains('page-home')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'shuffle';
    btn.innerHTML =
      '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 4h3l6 8h3M2 12h3l6-8h3M12 2l2 2-2 2M12 10l2 2-2 2" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>Shuffle the tiles';
    btn.addEventListener('click', () => {
      const fills = rects.map((r) => r.getAttribute('fill'));
      for (let i = fills.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [fills[i], fills[j]] = [fills[j], fills[i]];
      }
      rects.forEach((r, i) => {
        setTimeout(() => (r.setAttribute('fill', fills[i]), r.setAttribute('stroke', fills[i])), reduce ? 0 : i * 6);
      });
    });
    box.appendChild(btn);
  });

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
