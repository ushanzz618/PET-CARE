/* ═══════════════════════════════════════════════════════════════
   SMART PETCARE — UNIVERSAL NAVBAR JS (FIXED)
   ═══════════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  const MOBILE_BREAKPOINT = 768;

  // ============ NAVBAR SCROLL EFFECT ============
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  // ============ RESET MOBILE STATE (helper) ============
  function resetMobileState() {
    const nav = document.getElementById('navLinks');
    const btn = document.querySelector('.menu-toggle');
    const icon = btn ? btn.querySelector('i') : null;

    if (nav) nav.classList.remove('mobile-open');
    document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
    document.querySelectorAll('.dropdown-toggle').forEach(t => t.setAttribute('aria-expanded', 'false'));

    if (btn) btn.setAttribute('aria-expanded', 'false');
    if (icon) icon.className = 'fa-solid fa-bars';
  }

  // ============ MOBILE MENU TOGGLE ============
  window.toggleMenu = function() {
    const nav = document.getElementById('navLinks');
    const btn = document.querySelector('.menu-toggle');
    const icon = btn ? btn.querySelector('i') : null;
    if (!nav) return;

    nav.classList.toggle('mobile-open');
    const isOpen = nav.classList.contains('mobile-open');

    if (icon) icon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    if (btn) btn.setAttribute('aria-expanded', String(isOpen));
  };

  // ============ DROPDOWN TOGGLE ============
  document.querySelectorAll('.dropdown-toggle').forEach(function(t) {
    t.addEventListener('click', function(e) {
      e.preventDefault(); // ✅ no # jump
      const li = t.parentElement;

      // Mobile එකේ විතරයි open/close
      if (window.innerWidth <= MOBILE_BREAKPOINT) {
        li.classList.toggle('open');
        t.setAttribute('aria-expanded', String(li.classList.contains('open')));
      }
    });
  });

  // ============ CLOSE MOBILE MENU ON LINK CLICK ============
  document.querySelectorAll('#navLinks a:not(.dropdown-toggle)').forEach(function(link) {
    link.addEventListener('click', function() {
      if (window.innerWidth <= MOBILE_BREAKPOINT) {
        resetMobileState();
      }
    });
  });

  // ============ THEME TOGGLE ============
  window.toggleTheme = function() {
    const html = document.documentElement;
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    const icon = document.getElementById('themeIcon');
    if (icon) icon.className = next === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    localStorage.setItem('petcare-theme', next);
  };

  // ============ LOAD SAVED THEME ============
  const savedTheme = localStorage.getItem('petcare-theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    const icon = document.getElementById('themeIcon');
    if (icon && savedTheme === 'dark') icon.className = 'fa-solid fa-sun';
  }

  // ============ CART COUNT (localStorage sync) ============
  function updateCartCount() {
    const el = document.getElementById('cartCount');
    if (!el) return;
    let count = 0;
    try {
      const cart = JSON.parse(localStorage.getItem('petcare-cart') || '[]');
      count = Array.isArray(cart) ? cart.reduce((sum, i) => sum + (i.qty || 1), 0) : 0;
    } catch { count = 0; }
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  }
  updateCartCount();
  window.addEventListener('storage', updateCartCount);
  window.updateCartCount = updateCartCount;

  // ============ TOAST (with error support) ============
  window.showToast = function(msg, error = false) {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      toast.innerHTML = '<i class="fa-solid fa-circle-check"></i><span id="toastMsg"></span>';
      document.body.appendChild(toast);
    }

    let msgEl = document.getElementById('toastMsg');
    if (!msgEl) {
      msgEl = document.createElement('span');
      msgEl.id = 'toastMsg';
      toast.appendChild(msgEl);
    }
    msgEl.textContent = msg;

    const icon = toast.querySelector('i');
    if (icon) {
      icon.className = error ? 'fa-solid fa-circle-exclamation' : 'fa-solid fa-circle-check';
    }

    toast.classList.toggle('error', error);
    toast.classList.add('show');

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => toast.classList.remove('show'), 3000);
  };

  // ============ SMOOTH SCROLL (safe) ============
  document.querySelectorAll('a[href^="#"]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      let target;
      try { target = document.querySelector(href); } catch { return; }
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ============ ✅ RESIZE HANDLER (screenshot fix) ============
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      if (window.innerWidth > MOBILE_BREAKPOINT) {
        // Desktop එකට ආවම mobile state reset කරන්න
        resetMobileState();
      }
    }, 150);
  });

  // ============ INITIAL STATE CHECK ============
  // Page load වෙනකොට desktop නම් mobile state clear කරන්න
  if (window.innerWidth > MOBILE_BREAKPOINT) {
    resetMobileState();
  }

})();