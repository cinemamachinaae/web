/* ============================================================
   CINEMA MACHINA — GLOBAL JAVASCRIPT
   ============================================================ */

/* global Vimeo */

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
  links.forEach((link) => {
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

  mobileMenu.querySelectorAll('a').forEach((a) => {
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
    items.forEach((el) => el.classList.add('visible'));
  }, 3000);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
  );

  items.forEach((el) => {
    // Immediately reveal elements already visible in viewport on load
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('visible');
    } else {
      observer.observe(el);
    }
  });

  // Clear fallback timer if all items revealed normally
  document.addEventListener(
    'scroll',
    () => {
      const anyHidden = [...items].some(
        (el) => !el.classList.contains('visible')
      );
      if (!anyHidden) clearTimeout(fallbackTimer);
    },
    { once: true, passive: true }
  );
})();

/* ── BAR CHART ANIMATION ───────────────────────────────────── */
(function initBars() {
  const bars = document.querySelectorAll(
    '.bar-fill[data-width], .bar-fill-enhanced[data-width]'
  );
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const width = bar.getAttribute('data-width');
          setTimeout(() => {
            bar.style.width = width + '%';
          }, 200);
          observer.unobserve(bar);
        }
      });
    },
    { threshold: 0.3 }
  );

  bars.forEach((bar) => observer.observe(bar));
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
function initVimeo() {
  const shell = document.getElementById('cinema-vimeo-shell');
  const iframe = document.getElementById('cinema-machina-vimeo');
  const controls = document.getElementById('vimeo-controls');
  const surfaceToggle = document.getElementById('vimeo-surface-toggle');

  if (!shell || !iframe || !controls || typeof Vimeo === 'undefined') return;

  const player = new Vimeo.Player(iframe);
  const playBtn = controls.querySelector('.js-vimeo-play');
  const fsBtn = controls.querySelector('.js-vimeo-fullscreen');
  const progress = controls.querySelector('.vimeo-progress');
  const timeDisplay = document.getElementById('vimeo-time');

  let duration = 0;
  let idleTimer;
  let isPlaying = false;
  let hasInteracted = false;

  const formatTime = (s) => {
    const min = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const updateUI = (current, total) => {
    if (timeDisplay) {
      timeDisplay.textContent = `${formatTime(current)} / ${formatTime(total)}`;
    }
    if (progress && total > 0) {
      progress.value = (current / total) * 100;
    }
  };

  const showControls = () => {
    shell.classList.remove('is-idle');
    clearTimeout(idleTimer);
  };

  const startIdleTimer = () => {
    if (isPlaying) {
      idleTimer = setTimeout(() => {
        shell.classList.add('is-idle');
      }, 1600); // Luxury 1600ms fade
    }
  };

  const poke = () => {
    showControls();
    startIdleTimer();
  };

  shell.addEventListener('mousemove', poke);
  shell.addEventListener('touchstart', poke, { passive: true });

  const handlePlayPause = async () => {
    const paused = await player.getPaused();
    if (paused) {
      if (!hasInteracted) {
        await player.setVolume(1);
        hasInteracted = true;
      }
      player.play();
    } else {
      player.pause();
    }
  };

  // Listeners
  player.on('play', () => {
    isPlaying = true;
    shell.classList.add('is-playing');
    shell.classList.remove('is-paused');
    poke();
  });

  player.on('pause', () => {
    isPlaying = false;
    shell.classList.remove('is-playing', 'is-idle');
    shell.classList.add('is-paused');
    showControls();
  });

  player.on('ended', () => {
    isPlaying = false;
    shell.classList.remove('is-playing', 'is-idle');
    shell.classList.add('is-paused');
    showControls();
  });

  player.on('timeupdate', (data) => {
    updateUI(data.seconds, duration);
  });

  player.getDuration().then((d) => {
    duration = d;
    updateUI(0, duration);
  });

  // Events
  if (surfaceToggle) {
    surfaceToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      handlePlayPause();
    });
  }

  if (playBtn) {
    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      handlePlayPause();
    });
  }

  const toggleFullscreen = async () => {
    const fullscreenElement =
      document.fullscreenElement || document.webkitFullscreenElement;

    if (fullscreenElement) {
      if (document.exitFullscreen) {
        try {
          await document.exitFullscreen();
          return;
        } catch {}
      }

      if (document.webkitExitFullscreen) {
        try {
          document.webkitExitFullscreen();
          return;
        } catch {}
      }

      try {
        await player.exitFullscreen();
      } catch {}
      return;
    }

    if (shell.requestFullscreen) {
      try {
        await shell.requestFullscreen();
        return;
      } catch {}
    }

    if (shell.webkitRequestFullscreen) {
      try {
        shell.webkitRequestFullscreen();
        return;
      } catch {}
    }

    if (iframe.requestFullscreen) {
      try {
        await iframe.requestFullscreen();
        return;
      } catch {}
    }

    if (iframe.webkitRequestFullscreen) {
      try {
        iframe.webkitRequestFullscreen();
        return;
      } catch {}
    }

    try {
      await player.requestFullscreen();
    } catch {}
  };

  if (fsBtn) {
    fsBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      await toggleFullscreen();
      poke();
    });
  }

  if (progress) {
    progress.addEventListener('input', () => {
      const seek = (progress.value / 100) * duration;
      player.setCurrentTime(seek);
    });
    progress.addEventListener('click', (e) => e.stopPropagation());
    progress.addEventListener('mousedown', (e) => e.stopPropagation());
  }

  shell.addEventListener('click', (e) => {
    if (e.target.closest('.vimeo-controls')) {
      poke();
      return;
    }

    handlePlayPause();
    poke();
  });

  // Double click for fullscreen
  shell.addEventListener('dblclick', async () => {
    await toggleFullscreen();
    poke();
  });
}

// Robust initialization for CDN availability
function startVimeo() {
  const vimeoRoot = document.querySelector(
    '#cinema-vimeo-shell, #cinema-machina-vimeo'
  );
  if (!vimeoRoot) return;

  if (typeof Vimeo !== 'undefined') {
    initVimeo();
    return;
  }

  // Retry with exponential backoff or 100ms baseline
  let attempts = 0;
  const interval = setInterval(() => {
    attempts++;
    if (typeof Vimeo !== 'undefined') {
      initVimeo();
      clearInterval(interval);
    } else if (attempts > 50) {
      clearInterval(interval);
      console.warn('Vimeo SDK failed to load within timeout.');
      // Last-ditch: try to find script and re-inject if needed
    }
  }, 100);
}

document.addEventListener('DOMContentLoaded', startVimeo);

/* ── CONTACT FORM ───────────────────────────────────────────── */
(function initForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  const btn = form.querySelector('button[type="submit"]');
  const note = form.querySelector('.form-note');
  if (!btn) return;

  const originalNoteText = note ? note.textContent : '';

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Reset previous states
    form.classList.remove('form-touched');
    btn.classList.remove('is-success', 'is-unavailable');
    if (note) {
      note.classList.remove('is-unavailable');
      note.textContent = originalNoteText;
    }

    // Safety check for basic validation
    if (!form.checkValidity()) {
      form.classList.add('form-touched');
      return;
    }

    btn.textContent = 'Sending Enquiry…';
    btn.disabled = true;
    btn.classList.add('is-loading');

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      // Real fetch call with check for success
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        btn.classList.replace('is-loading', 'is-success');
        btn.textContent = "Message Sent — We'll be in touch";
        form.reset();
      } else {
        throw new Error('Server returned error status');
      }
    } catch (err) {
      console.warn('Form submission error:', err);

      // Truthful Premium Fallback
      btn.classList.remove('is-loading');
      btn.classList.add('is-unavailable');
      btn.textContent = 'Service Offline';

      if (note) {
        note.classList.add('is-unavailable');
        note.innerHTML =
          'Enquiry service is currently unreachable. Please reach us via <a href="https://wa.me/971507282195" class="u-color-bronze">WhatsApp</a> or email.';
      }

      setTimeout(() => {
        btn.disabled = false;
        btn.classList.remove('is-unavailable');
        btn.textContent = 'Retry Enquiry';
        if (note) {
          note.classList.remove('is-unavailable');
          note.textContent = originalNoteText;
        }
      }, 5000);
    }
  });
})();

/* ── SMOOTH ANCHOR SCROLL ───────────────────────────────────── */
(function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
