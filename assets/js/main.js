/* ============================================================
   CINEMA MACHINA — GLOBAL JAVASCRIPT
   ============================================================ */

'use strict';

/* ── SCROLL-BASED NAV ───────────────────────────────────────── */
(function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Highlight active page
  const links = nav.querySelectorAll('.nav__links a');
  const current = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

/* ── MOBILE MENU ────────────────────────────────────────────── */
(function initMobileMenu() {
  const toggle = document.querySelector('.nav__toggle');
  const mobileMenu = document.querySelector('.nav__mobile');
  if (!toggle || !mobileMenu) return;

  const open = () => {
    toggle.classList.add('open');
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    toggle.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  };

  toggle.addEventListener('click', () => {
    toggle.classList.contains('open') ? close() : open();
  });

  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', close);
  });
})();

/* ── SCROLL REVEAL ──────────────────────────────────────────── */
(function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  // Tell CSS that JS is running — enables the hide-then-reveal animation.
  // Without this flag, all .reveal elements remain fully visible (safe default).
  document.documentElement.classList.add('js-ready');

  // Safety fallback: if IntersectionObserver doesn't fire within 3s
  // (e.g. headless browsers, screenshot tools, SSR crawlers), reveal everything.
  const fallbackTimer = setTimeout(() => {
    items.forEach(el => el.classList.add('visible'));
  }, 3000);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => {
    // Immediately reveal elements already visible in viewport on load
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('visible');
    } else {
      observer.observe(el);
    }
  });

  // Clear fallback timer if all items revealed normally
  document.addEventListener('scroll', () => {
    const anyHidden = [...items].some(el => !el.classList.contains('visible'));
    if (!anyHidden) clearTimeout(fallbackTimer);
  }, { once: true, passive: true });
})();

/* ── BAR CHART ANIMATION ───────────────────────────────────── */
(function initBars() {
  const bars = document.querySelectorAll('.bar-fill[data-width], .bar-fill-enhanced[data-width]');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.getAttribute('data-width');
        setTimeout(() => {
          bar.style.width = width + '%';
        }, 200);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
})();

/* ── PARALLAX HERO ──────────────────────────────────────────── */
(function initParallax() {
  const heroImg = document.querySelector('.hero__bg img');
  if (!heroImg) return;

  const onScroll = () => {
    const scrollY = window.scrollY;
    const velocity = scrollY * 0.3;
    heroImg.style.transform = `translateY(${velocity}px)`;
  };

  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* -- VIMEO INTERACTIVE PLAYER ------------------------------ */
(function initVimeo() {
  const shell = document.getElementById('cinema-vimeo-shell');
  const overlay = document.getElementById('vimeo-overlay');
  const iframe = document.getElementById('cinema-machina-vimeo');
  const muteBtn = document.getElementById('vimeo-mute');
  const fsBtn = document.getElementById('vimeo-fullscreen');

  if (!iframe || !window.Vimeo) return;

  const player = new Vimeo.Player(iframe);

  // Play Overlay Logic
  if (overlay) {
    overlay.addEventListener('click', () => {
      player.play().then(() => {
        player.setMuted(false);
        overlay.classList.add('hidden');
        setTimeout(() => overlay.remove(), 600);
      }).catch(err => console.error('Play error:', err));
    });
  }

  // Mute Toggle
  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      player.getMuted().then(muted => {
        player.setMuted(!muted);
        muteBtn.querySelector('svg').style.color = !muted ? 'var(--text-muted)' : 'var(--bronze)';
      });
    });
  }

  // Fullscreen
  if (fsBtn) {
    fsBtn.addEventListener('click', () => {
      iframe.requestFullscreen?.() || iframe.webkitRequestFullscreen?.() || iframe.msRequestFullscreen?.();
    });
  }

  // Premium Fallback: Autoplay detection
  player.on('play', () => {
    if (overlay && !overlay.classList.contains('hidden')) {
      overlay.classList.add('hidden');
    }
  });
})();

/* ── CONTACT FORM ───────────────────────────────────────────── */
(function initForm() {
  const form = document.querySelector('.contact-form');
  const status = document.getElementById('form-status');
  if (!form || !status) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    
    // Clear status
    status.textContent = '';
    status.className = 'form-status';
    
    // Loading State
    btn.textContent = 'Sending Enquiry...';
    btn.disabled = true;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        status.textContent = 'Enquiry sent successfully. We will be in touch shortly.';
        status.classList.add('success');
        form.reset();
        btn.textContent = 'Sent';
      } else {
        throw new Error(result.error || 'Failed to send enquiry.');
      }
    } catch (err) {
      console.error('Form error:', err);
      status.textContent = err.message || 'Something went wrong. Please try again.';
      status.classList.add('error');
      btn.textContent = originalText;
      btn.disabled = false;
    }
  });
})();

/* ── SMOOTH ANCHOR SCROLL ───────────────────────────────────── */
(function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
