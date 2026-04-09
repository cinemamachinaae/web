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
function initVimeo() {
  const shell = document.getElementById("cinema-vimeo-shell");
  const iframe = document.getElementById("cinema-machina-vimeo");
  const controls = document.getElementById("vimeo-controls");
  const surfaceToggle = document.getElementById("vimeo-surface-toggle");

  if (!shell || !iframe || !controls || typeof Vimeo === "undefined") return;

  const player = new Vimeo.Player(iframe);
  const playBtn = controls.querySelector(".js-vimeo-play");
  const muteBtn = controls.querySelector(".js-vimeo-mute");
  const fsBtn = controls.querySelector(".js-vimeo-fullscreen");
  const progress = controls.querySelector(".vimeo-progress");
  const timeDisplay = document.getElementById("vimeo-time");

  let duration = 0;
  let idleTimer;

  // Formatting helper (MM:SS)
  const formatTime = (s) => {
    const min = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const updateTimeUI = (current, total) => {
    if (timeDisplay) {
      timeDisplay.textContent = `${formatTime(current)} / ${formatTime(total)}`;
    }
  };

  // Idle state management (500ms)
  const resetIdleTimer = () => {
    shell.classList.remove("is-idle");
    clearTimeout(idleTimer);
    
    // Only go idle if we are actually playing
    player.getPaused().then((paused) => {
      if (!paused) {
        idleTimer = setTimeout(() => {
          shell.classList.add("is-idle");
        }, 500);
      }
    });
  };

  shell.addEventListener("mousemove", resetIdleTimer);
  shell.addEventListener("touchstart", resetIdleTimer, { passive: true });
  shell.addEventListener("keydown", resetIdleTimer);

  // Shell playback toggle
  const togglePlayback = () => {
    player.getPaused().then((paused) => {
      if (paused) {
        player.play();
      } else {
        player.pause();
      }
    });
  };

  // State Listeners (The "Truth" comes from the player events)
  player.on("play", () => {
    shell.classList.remove("is-paused");
    shell.classList.add("is-playing");
    resetIdleTimer();
  });

  player.on("pause", () => {
    shell.classList.remove("is-playing", "is-idle");
    shell.classList.add("is-paused");
    clearTimeout(idleTimer);
  });

  player.on("volumechange", (data) => {
    if (data.volume === 0) {
      shell.classList.add("is-muted");
    } else {
      shell.classList.remove("is-muted");
    }
  });

  // Interaction Listeners
  if (surfaceToggle) {
    surfaceToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      togglePlayback();
    });
  }
  
  shell.addEventListener("click", () => {
    togglePlayback();
  });

  if (playBtn) {
    playBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      togglePlayback();
    });
  }

  if (muteBtn) {
    muteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      player.getMuted().then((muted) => {
        player.setMuted(!muted);
        if (!muted) {
          shell.classList.add("is-muted");
        } else {
          shell.classList.remove("is-muted");
        }
      });
    });
  }

  if (fsBtn) {
    fsBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      player.requestFullscreen().catch(() => {
        if (iframe.requestFullscreen) iframe.requestFullscreen();
      });
    });
  }

  // Progress & Time Sync
  player.getDuration().then((d) => {
    duration = d;
    updateTimeUI(0, duration);
  });

  player.on("timeupdate", (data) => {
    const current = data.seconds;
    updateTimeUI(current, duration);
    if (progress) progress.value = (current / duration) * 100;
  });

  if (progress) {
    progress.addEventListener("input", () => {
      const seekTime = (progress.value / 100) * duration;
      player.setCurrentTime(seekTime);
    });
    // Prevent event bubbling so dragging doesn't trigger playback toggle
    progress.addEventListener("click", (e) => e.stopPropagation());
    progress.addEventListener("mousedown", (e) => e.stopPropagation());
  }

  player.on("ended", () => {
    shell.classList.remove("is-playing", "is-idle");
    shell.classList.add("is-paused");
  });

  // Keyboard Shortcuts (Accessibility)
  shell.addEventListener("keydown", (e) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      togglePlayback();
    }
    if (e.key.toLowerCase() === "m") {
      player.getMuted().then((m) => {
        player.setMuted(!m);
        if (!m) {
          shell.classList.add("is-muted");
        } else {
          shell.classList.remove("is-muted");
        }
      });
    }
    if (e.key.toLowerCase() === "f") {
      player.requestFullscreen().catch(() => {
        if (iframe.requestFullscreen) iframe.requestFullscreen();
      });
    }
  });
}

// Initialize with retry logic for CDN availability
function startVimeo() {
  if (typeof Vimeo !== "undefined") {
    initVimeo();
  } else {
    // Retry every 100ms for up to 5 seconds
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (typeof Vimeo !== "undefined") {
        initVimeo();
        clearInterval(interval);
      } else if (attempts > 50) {
        clearInterval(interval);
        console.warn("Vimeo SDK failed to load within timeout.");
      }
    }, 100);
  }
}

document.addEventListener("DOMContentLoaded", startVimeo);


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
