(function () {
  'use strict';

  var STORAGE_KEY = 'animehub_gallery_favorites';

  var items = [
    { id: 'g1', title: 'Cosplay 1', img: 'assets/images/gallery-1.png' },
    { id: 'g2', title: 'Cosplay 2', img: 'assets/images/gallery-2.png' },
    { id: 'g3', title: 'Cosplay 3', img: 'assets/images/gallery-3.png' },
    { id: 'g4', title: 'Cosplay 4', img: 'assets/images/gallery-4.png' },
    { id: 'g5', title: 'Cosplay 5', img: 'assets/images/gallery-5.png' },
    { id: 'g6', title: 'Cosplay 6', img: 'assets/images/gallery-6.png' },
    { id: 'g7', title: 'Cosplay 7', img: 'assets/images/gallery-7.png' },
    { id: 'g8', title: 'Cosplay 8', img: 'assets/images/gallery-8.png' }
  ];

  function getFavorites() {
    return loadJSON(localStorage, STORAGE_KEY, []);
  }

  function setFavorites(arr) {
    saveJSON(localStorage, STORAGE_KEY, arr);
  }

  function toggleFavorite(id) {
    var fav = getFavorites();
    var i = fav.indexOf(id);
    if (i >= 0) fav.splice(i, 1);
    else fav.push(id);
    setFavorites(fav);
    return fav.indexOf(id) >= 0;
  }

  function isFavorite(id) {
    return getFavorites().indexOf(id) >= 0;
  }

  function render() {
    var grid = document.getElementById('galleryGrid');
    var onlyFav = document.getElementById('favoritesOnly');
    if (!grid) return;
    var favOnly = onlyFav && onlyFav.checked;
    grid.innerHTML = '';
    items.forEach(function (item) {
      if (favOnly && !isFavorite(item.id)) return;
      var col = document.createElement('div');
      col.className = 'col-6 col-md-4 col-xxl-3';
      var fav = isFavorite(item.id);
      col.innerHTML =
        '<article class="card gallery-card h-100 shadow-sm position-relative">' +
        '<button type="button" class="btn btn-sm btn-light position-absolute top-0 end-0 m-2 btn-fav ' +
        (fav ? 'is-favorite' : '') +
        '" data-fav="' +
        item.id +
        '" aria-label="' +
        (fav ? 'Remove from favorites' : 'Add to favorites') +
        '" aria-pressed="' +
        (fav ? 'true' : 'false') +
        '"><i class="bi bi-heart' +
        (fav ? '-fill' : '') +
        '" aria-hidden="true"></i></button>' +
        '<div class="position-relative overflow-hidden rounded-top">' +
        '<img src="' +
        item.img +
        '" class="card-img-top" alt="" width="600" height="800" loading="lazy" />' +
        '<div class="position-absolute bottom-0 start-0 end-0 overlay p-2">' +
        '<p class="text-white small mb-0 fw-semibold text-mono">' +
        escapeHtml(item.title) +
        '</p></div></div></article>';
      var img = col.querySelector('img');
      img.alt = 'Cosplay gallery photo: ' + item.title;
      grid.appendChild(col);
    });

    grid.querySelectorAll('.btn-fav').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-fav');
        var now = toggleFavorite(id);
        btn.classList.toggle('is-favorite', now);
        btn.setAttribute('aria-pressed', now ? 'true' : 'false');
        btn.setAttribute('aria-label', now ? 'Remove from favorites' : 'Add to favorites');
        var icon = btn.querySelector('i');
        icon.className = 'bi bi-heart' + (now ? '-fill' : '');
        if (favOnly) render();
      });
    });
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var onlyFav = document.getElementById('favoritesOnly');
    if (onlyFav) onlyFav.addEventListener('change', render);
    render();
  });
})();
