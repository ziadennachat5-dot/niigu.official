/* ===========================
   NIIGU PRODUCTIONS — SCRIPT
   =========================== */

(function () {
  'use strict';

  /* ── 1. CUSTOM LOADER ── */
  const loader = document.getElementById('loader');
  const progress = document.querySelector('.loader-progress');
  
  if (loader) {
    window.addEventListener('load', () => {
      progress.style.width = '100%';
      setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.pointerEvents = 'none';
        setTimeout(() => loader.remove(), 600);
        // Start hero animations
        document.querySelectorAll('#hero .reveal-up').forEach((el, i) => {
          setTimeout(() => el.classList.add('visible'), 200 + i * 130);
        });
      }, 1500);
    });
  }

  /* ── 2. CUSTOM CURSOR ── */
  const cursor     = document.getElementById('cursor');
  const cursorPlay = document.getElementById('cursor-play');
  let mx = 0, my = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left     = mx + 'px';
    cursor.style.top      = my + 'px';
    if (cursorPlay) {
      cursorPlay.style.left = mx + 'px';
      cursorPlay.style.top  = my + 'px';
    }
  });

  /* Hover state on generic interactive els */
  document.querySelectorAll('a, button, .stat-item, .project-item').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
  });

  /* ── 3. PROJECT FLOATING IMAGE ── */
  const projectImgContainer = document.getElementById('project-floating-img');
  const projectImg = projectImgContainer ? projectImgContainer.querySelector('img') : null;
  const projectItems = document.querySelectorAll('.project-item');

  projectItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      const imgPath = item.dataset.img;
      if (projectImg && imgPath) {
        projectImg.src = imgPath;
        projectImgContainer.classList.add('active');
      }
    });
    item.addEventListener('mouseleave', () => {
      if (projectImgContainer) projectImgContainer.classList.remove('active');
    });
    item.addEventListener('mousemove', e => {
      if (projectImgContainer) {
        projectImgContainer.style.left = e.clientX + 'px';
        projectImgContainer.style.top = e.clientY + 'px';
      }
    });
  });

  /* ── 4. NAVBAR SCROLL ── */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });


  /* ── 5. REVEAL ON SCROLL ── */
  const revealEls = document.querySelectorAll('.reveal-up');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ── 6. STAT COUNTER ANIMATION ── */
  const statNums = document.querySelectorAll('.stat-num');
  let statsStarted = false;

  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !statsStarted) {
      statsStarted = true;
      statNums.forEach(el => {
        const target = +el.dataset.target;
        const duration = 1600;
        const step = 16;
        const totalSteps = duration / step;
        let current = 0;
        const increment = target / totalSteps;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) { current = target; clearInterval(timer); }
          el.textContent = Math.floor(current);
        }, step);
      });
    }
  }, { threshold: 0.5 });

  const statsSection = document.getElementById('stats');
  if (statsSection) statsObserver.observe(statsSection);


  /* ── 7. SMOOTH SECTION TRANSITIONS ── */
  const flashOverlay = document.createElement('div');
  flashOverlay.style.cssText = `
    position:fixed;inset:0;background:#fff;opacity:0;
    pointer-events:none;z-index:9000;transition:opacity 0.08s ease;
  `;
  document.body.appendChild(flashOverlay);

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      flashOverlay.style.opacity = '0.18';
      setTimeout(() => {
        flashOverlay.style.opacity = '0';
        target.scrollIntoView({ behavior: 'smooth' });
      }, 80);
    });
  });


  /* ── 8. HERO PARALLAX ── */
  const heroBg = document.querySelector('.hero-img');
  window.addEventListener('scroll', () => {
    if (heroBg) {
      const y = window.scrollY;
      heroBg.style.transform = `scale(1) translateY(${y * 0.25}px)`;
    }
  }, { passive: true });


  /* ── 9. FOOTER TIME & YEAR ── */
  function updateTime() {
    const timeEl = document.getElementById('current-time');
    if (timeEl) {
      const now = new Date();
      // Morocco is UTC+1 (usually, checking current local time in metadata: 04:42:07+02:00)
      // The metadata says current local time is 04:42:07+02:00.
      // So I'll just use the user's local time for simplicity as it seems to be Morocco time or similar.
      timeEl.textContent = now.toLocaleTimeString('en-GB', { hour12: false });
    }
  }
  setInterval(updateTime, 1000);
  updateTime();

  const copyEl = document.querySelector('.footer-copy');
  if (copyEl) {
    copyEl.textContent = `© ${new Date().getFullYear()} Niigu Productions. All rights reserved.`;
  }

  /* ── 10. MAGNETIC BUTTONS ── */
  const magneticEls = document.querySelectorAll('.btn-primary, .btn-ghost, .nav-cta');
  magneticEls.forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.4;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.4;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });

  /* ── 11. SCROLL SKEW EFFECT (Marquees) ── */
  const marquees = document.querySelectorAll('.marquee-track');
  let lastScrollY = window.scrollY;
  
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const scrollSpeed = currentScrollY - lastScrollY;
    lastScrollY = currentScrollY;
    
    const skew = Math.min(Math.max(scrollSpeed * 0.05, -5), 5);
    marquees.forEach(track => {
      track.style.transform = `skewX(${-skew}deg)`;
    });
    
    clearTimeout(window.scrollTimeout);
    window.scrollTimeout = setTimeout(() => {
      marquees.forEach(track => {
         track.style.transform = 'skewX(0deg)';
      });
    }, 150);
  }, { passive: true });

  /* ── 12. DYNAMIC FOOTER REVEAL ── */
  const footer = document.getElementById('footer');
  function updateFooterReveal() {
    if (footer) {
      document.body.style.marginBottom = footer.offsetHeight + 'px';
    }
  }
  window.addEventListener('resize', updateFooterReveal);
  setTimeout(updateFooterReveal, 500);

  /* ── 13. VISION GRID TILT ── */
  document.querySelectorAll('.vision-img-wrap').forEach(wrap => {
    wrap.addEventListener('mousemove', e => {
      const rect = wrap.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 15;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 15;
      wrap.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${-y}deg) scale(1.02)`;
    });
    wrap.addEventListener('mouseleave', () => {
      wrap.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)';
    });
  });

})();
