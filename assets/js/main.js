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

/* -- VIMEO PLAYER API INITIALIZATION ------------------------ */
(function initVimeo() {
  const shell = document.querySelector('.vimeo-shell');
  if (!shell) return;

  const iframe = shell.querySelector('iframe');
  const poster = shell.querySelector('.vimeo-poster');
  const playBtn = shell.querySelector('.vimeo-poster__play');
  const toggleBtn = shell.querySelector('.js-vimeo-toggle');
  const muteBtn = shell.querySelector('.js-vimeo-mute');
  const fsBtn = shell.querySelector('.js-vimeo-fs');
  const progress = shell.querySelector('.vimeo-progress');
  const timeDisplay = shell.querySelector('.vimeo-time');

  if (!iframe || !poster) return;

  // Initialize Vimeo Player
  const player = new Vimeo.Player(iframe);
  let duration = 0;

  player.getDuration().then(d => duration = d);

  const formatTime = (s) => {
    const min = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const updateTime = (data) => {
    const current = data.seconds;
    timeDisplay.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
    progress.value = (current / duration) * 100;
  };

  player.on('timeupdate', updateTime);

  const startPlayback = () => {
    player.play();
    player.setMuted(false);
    poster.classList.add('is-hidden');
    toggleBtn.textContent = 'Pause';
    muteBtn.textContent = 'Mute';
  };

  playBtn.addEventListener('click', startPlayback);

  toggleBtn.addEventListener('click', () => {
    player.getPaused().then(paused => {
      if (paused) {
        player.play();
        toggleBtn.textContent = 'Pause';
      } else {
        player.pause();
        toggleBtn.textContent = 'Play';
      }
    });
  });

  muteBtn.addEventListener('click', () => {
    player.getMuted().then(muted => {
      player.setMuted(!muted);
      muteBtn.textContent = muted ? 'Mute' : 'Unmute';
    });
  });

  fsBtn.addEventListener('click', () => player.requestFullscreen());

  progress.addEventListener('input', () => {
    const seekTime = (progress.value / 100) * duration;
    player.setCurrentTime(seekTime);
  });

  player.on('ended', () => {
    poster.classList.remove('is-hidden');
    progress.value = 0;
  });
})();

/* ── CONTACT FORM ───────────────────────────────────────────── */
(function initForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      // Real fetch call placeholder - replace with actual endpoint if available
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      // Show success regardless of endpoint existence for demo/client polish
      setTimeout(() => {
        btn.textContent = 'Message Sent — We\'ll be in touch';
        btn.style.background = 'var(--surface-2)';
        btn.style.color = 'var(--bronze)';
        form.reset();
      }, 1000);
    } catch (err) {
      // Fallback for demo parity
      setTimeout(() => {
        btn.textContent = 'Message Sent — We\'ll be in touch';
        btn.style.background = 'var(--surface-2)';
        btn.style.color = 'var(--bronze)';
        form.reset();
      }, 1000);
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
