(function () {
  'use strict';

  var THEME_KEY = 'animehub_theme';
  var THEME_COOKIE = 'animehub_theme_pref';
  var COOKIE_DAYS = 180;

  function getStoredTheme() {
    try {
      return localStorage.getItem(THEME_KEY) || 'dark';
    } catch {
      return 'dark';
    }
  }

  function syncThemeLabel(btn, t) {
    var label = btn.querySelector('.theme-toggle-label');
    if (label) label.textContent = t === 'dark' ? 'LIGHT' : 'DARK';
  }

  function applyTheme(theme) {
    var t = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', t);
    try {
      localStorage.setItem(THEME_KEY, t);
    } catch (_) {}
    if (typeof setCookie === 'function') {
      setCookie(THEME_COOKIE, t, COOKIE_DAYS);
    }
    var btn = document.getElementById('themeToggle');
    if (btn) {
      btn.setAttribute('aria-pressed', t === 'dark' ? 'true' : 'false');
      btn.setAttribute(
        'aria-label',
        t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      );
      syncThemeLabel(btn, t);
    }
  }

  function toggleTheme() {
    var cur = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(cur === 'dark' ? 'light' : 'dark');
  }

  function initNavActive() {
    var path = window.location.pathname.replace(/\\/g, '/');
    path = path.split('/').filter(Boolean).pop() || '';
    if (!path || path === '') path = 'index.html';
    document.querySelectorAll('[data-nav]').forEach(function (link) {
      var href = (link.getAttribute('href') || '').split('/').pop();
      if (href === path) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var initial = getStoredTheme();
    if (typeof getCookie === 'function') {
      var c = getCookie(THEME_COOKIE);
      if (c === 'dark' || c === 'light') initial = c;
    }
    applyTheme(initial);

    var themeBtn = document.getElementById('themeToggle');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

    initNavActive();
  });
})();
