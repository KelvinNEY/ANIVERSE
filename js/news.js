(function () {
  'use strict';

  var JIKAN_URL = 'https://api.jikan.moe/v4/seasons/now?sfw=true&limit=24';
  var state = { items: [], usedFallback: false };

  function fallbackJsonUrl() {
    return new URL('assets/data/news-fallback.json', window.location.href).href;
  }

  function inferTag(genres) {
    var names = (genres || []).map(function (g) {
      return String(g).toLowerCase();
    });
    if (names.some(function (n) {
      return /music|sports|award|racing|game show/i.test(n);
    }))
      return { key: 'event', label: 'EVENT', className: 'news-tag--event' };
    if (names.some(function (n) {
      return /slice of life|comedy|school/i.test(n);
    }))
      return { key: 'cosplay', label: 'COSPLAY', className: 'news-tag--cosplay' };
    return { key: 'anime', label: 'ANIME', className: 'news-tag--anime' };
  }

  function normalizeEntry(entry) {
    var title =
      entry.title_english ||
      entry.title ||
      (entry.entry && entry.entry.title) ||
      'Untitled';
    var img =
      (entry.images &&
        entry.images.jpg &&
        (entry.images.jpg.large_image_url || entry.images.jpg.image_url)) ||
      '';
    var genres = (entry.genres || []).map(function (g) {
      return g.name;
    });
    var malId = entry.mal_id || entry.malId || 0;
    var url = entry.url || (malId ? 'https://myanimelist.net/anime/' + malId : '#');
    var synopsis = (entry.synopsis || '').replace(/\r?\n/g, ' ').trim();
    if (synopsis.length > 180) synopsis = synopsis.slice(0, 177) + '…';
    var tag = inferTag(genres);
    return {
      mal_id: malId,
      title: title,
      synopsis: synopsis,
      image: img,
      genres: genres,
      url: url,
      tagKey: tag.key,
      tagLabel: tag.label,
      tagClass: tag.className
    };
  }

  async function loadFallback() {
    var res = await fetch(fallbackJsonUrl(), { credentials: 'same-origin' });
    if (!res.ok) throw new Error('Fallback HTTP ' + res.status);
    var json = await res.json();
    state.items = (json.data || []).map(normalizeEntry);
    state.usedFallback = true;
  }

  async function loadJikan() {
    var res = await fetch(JIKAN_URL, { credentials: 'omit' });
    if (!res.ok) throw new Error('Jikan HTTP ' + res.status);
    var json = await res.json();
    var list = json.data || [];
    state.items = list.map(function (wrap) {
      return normalizeEntry(wrap || {});
    });
    state.usedFallback = false;
  }

  function showStatus(msg, kind) {
    var el = document.getElementById('newsStatus');
    if (!el) return;
    el.textContent = msg;
    el.classList.remove('d-none', 'alert-info', 'alert-warning', 'alert-danger');
    el.classList.add(kind === 'warn' ? 'alert-warning' : kind === 'err' ? 'alert-danger' : 'alert-info');
  }

  function hideStatus() {
    var el = document.getElementById('newsStatus');
    if (el) el.classList.add('d-none');
  }

  function matchesFilter(item, filter) {
    if (!filter || filter === 'all') return true;
    return item.tagKey === filter;
  }

  function cardDate() {
    return new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  function renderTrending() {
    var list = document.getElementById('trendingList');
    if (!list) return;
    list.innerHTML = '';
    if (!state.items.length) {
      var empty = document.createElement('li');
      empty.className = 'news-trending-placeholder text-muted text-mono small';
      empty.textContent = 'No catalog loaded yet.';
      list.appendChild(empty);
      return;
    }
    var slice = state.items.slice(0, 5);
    slice.forEach(function (item, idx) {
      var li = document.createElement('li');
      li.className = 'news-trending-item';
      var num = document.createElement('span');
      num.className = 'news-trending-num';
      num.setAttribute('aria-hidden', 'true');
      num.textContent = String(idx + 1);
      var body = document.createElement('div');
      body.className = 'news-trending-body';
      var a = document.createElement('a');
      a.className = 'news-trending-link';
      a.href = item.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = item.title;
      var meta = document.createElement('p');
      meta.className = 'news-trending-meta mb-0';
      meta.textContent = item.tagLabel;
      body.appendChild(a);
      body.appendChild(meta);
      li.appendChild(num);
      li.appendChild(body);
      list.appendChild(li);
    });
  }

  function setFilterFromValue(value) {
    var input = document.querySelector('input[name="newsFilter"][value="' + value + '"]');
    if (!input) return;
    input.checked = true;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function wireTagChips() {
    var cloud = document.getElementById('tagsCloud');
    if (!cloud) return;
    cloud.addEventListener('click', function (e) {
      var btn = e.target.closest('.news-tag-chip');
      if (!btn || !cloud.contains(btn)) return;
      var f = btn.getAttribute('data-filter');
      if (f) setFilterFromValue(f);
    });
  }

  function wireNewsletter() {
    var form = document.getElementById('newsletterForm');
    var msg = document.getElementById('newsletterMsg');
    var emailEl = document.getElementById('newsletterEmail');
    if (!form || !emailEl) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      emailEl.classList.remove('is-invalid');
      if (!msg) return;
      msg.classList.add('d-none');
      msg.classList.remove('text-danger', 'text-success');
      var raw = (emailEl.value || '').trim();
      if (!raw || !emailEl.checkValidity()) {
        emailEl.classList.add('is-invalid');
        msg.textContent = 'Please enter a valid email address.';
        msg.classList.remove('d-none');
        msg.classList.add('text-danger');
        return;
      }
      msg.textContent = 'Thanks — in a real site we would confirm by email. (Demo only.)';
      msg.classList.remove('d-none');
      msg.classList.add('text-success');
      form.reset();
    });
  }

  function render() {
    var grid = document.getElementById('newsGrid');
    if (!grid) return;
    var filterEl = document.querySelector('input[name="newsFilter"]:checked');
    var filter = filterEl ? filterEl.value : 'all';
    var subset = state.items.filter(function (i) {
      return matchesFilter(i, filter);
    });
    var countEl = document.getElementById('newsArticleCount');
    if (countEl) {
      countEl.classList.remove('d-none');
      countEl.textContent =
        subset.length + (subset.length === 1 ? ' title' : ' titles') + ' in this view';
    }
    grid.innerHTML = '';
    subset.forEach(function (item) {
      var col = document.createElement('div');
      col.className = 'col-md-6 col-xl-4 col-xxl-3';
      col.innerHTML =
        '<article class="news-card-cyber h-100 d-flex flex-column">' +
        '<div class="news-card-media">' +
        '<img src="" alt="" loading="lazy" width="400" height="180" />' +
        '</div>' +
        '<div class="card-body d-flex flex-column flex-grow-1">' +
        '<span class="news-tag ' +
        item.tagClass +
        '">' +
        escapeHtml(item.tagLabel) +
        '</span>' +
        '<h2 class="news-card-title">' +
        escapeHtml(item.title) +
        '</h2>' +
        '<p class="small text-muted flex-grow-1 mono">' +
        escapeHtml(item.synopsis || 'No synopsis.') +
        '</p>' +
        '<div class="d-flex justify-content-between align-items-center mt-2 pt-2 border-top" style="border-color: var(--border) !important">' +
        '<span class="news-card-date">' +
        escapeHtml(cardDate()) +
        '</span>' +
        '<a class="btn btn-sm btn-accent" href="' +
        escapeAttr(item.url) +
        '" target="_blank" rel="noopener noreferrer">MAL</a>' +
        '</div></div></article>';
      var img = col.querySelector('img');
      if (item.image) {
        img.src = item.image;
        img.alt = 'Poster for ' + item.title;
      } else {
        img.removeAttribute('src');
        img.alt = 'No image';
        img.style.display = 'none';
      }
      grid.appendChild(col);
    });
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function escapeAttr(s) {
    return escapeHtml(s).replace(/'/g, '&#39;');
  }

  async function init() {
    var loading = document.getElementById('newsLoading');
    var grid = document.getElementById('newsGrid');
    try {
      await loadJikan();
      hideStatus();
    } catch (e) {
      try {
        await loadFallback();
        showStatus('Showing saved highlights — live catalog unavailable (network, CORS, or API limit).', 'warn');
      } catch (e2) {
        state.items = [];
        showStatus('Could not load anime data or fallback file.', 'err');
      }
    }
    if (loading) loading.classList.add('d-none');
    if (grid) grid.classList.remove('d-none');
    renderTrending();
    render();
    wireTagChips();
    wireNewsletter();
    document.querySelectorAll('input[name="newsFilter"]').forEach(function (r) {
      r.addEventListener('change', render);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
