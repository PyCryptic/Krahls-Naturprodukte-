/* ==========================================================================
   Eventseite: Filter, "Vorbei"-Hinweis und Detail-Dialog
   Neue Events werden direkt in events.html als <article class="event-card"> ergänzt
   (Vorlage steht dort als Kommentar).
   ========================================================================== */
(function () {
    'use strict';

    var grid = document.getElementById('event-grid');
    var filterBar = document.getElementById('event-filters');
    var emptyEl = document.getElementById('event-empty');
    var dialog = document.getElementById('event-dialog');
    if (!grid) return;

    // Anzeigenamen der Kategorien (data-category im HTML)
    var CATEGORY_LABELS = { fest: 'Weinfeste', verkostung: 'Verkostung' };

    var cards = Array.prototype.slice.call(grid.querySelectorAll('.event-card'));

    /* ---------- Vergangene Events kennzeichnen (data-end="JJJJ-MM-TT") ---------- */
    var now = new Date();
    var todayIso = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
    cards.forEach(function (card) {
        var end = card.getAttribute('data-end');
        var media = card.querySelector('.media');
        if (end && end < todayIso && media) {
            var badge = document.createElement('span');
            badge.className = 'badge-past';
            badge.textContent = 'Beendet';
            media.appendChild(badge);
            card.classList.add('is-past');
        }
    });

    /* ---------- Filter (nur sinnvoll, wenn es mehrere Kategorien gibt) ---------- */
    var categories = [];
    cards.forEach(function (card) {
        var c = card.getAttribute('data-category');
        if (c && categories.indexOf(c) === -1) categories.push(c);
    });

    function applyFilter(category) {
        var visible = 0;
        filterBar.querySelectorAll('[data-filter]').forEach(function (btn) {
            btn.setAttribute('aria-pressed', String(btn.getAttribute('data-filter') === category));
        });
        cards.forEach(function (card) {
            var show = category === 'all' || card.getAttribute('data-category') === category;
            card.hidden = !show;
            if (show) visible += 1;
        });
        if (emptyEl) emptyEl.hidden = visible !== 0;
    }

    if (filterBar && categories.length > 1) {
        var list = [{ id: 'all', label: 'Alle' }].concat(
            categories.map(function (c) {
                return { id: c, label: CATEGORY_LABELS[c] || c };
            })
        );
        list.forEach(function (cat) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'chip';
            btn.textContent = cat.label;
            btn.setAttribute('data-filter', cat.id);
            btn.setAttribute('aria-pressed', cat.id === 'all' ? 'true' : 'false');
            filterBar.appendChild(btn);
        });
        filterBar.addEventListener('click', function (e) {
            var btn = e.target.closest('[data-filter]');
            if (btn) applyFilter(btn.getAttribute('data-filter'));
        });
    } else if (filterBar) {
        filterBar.hidden = true;
    }

    /* ---------- Detail-Dialog ---------- */
    if (dialog) {
        var titleEl = document.getElementById('event-dialog-title');
        var textEl = document.getElementById('event-dialog-text');
        var whenEl = document.getElementById('event-dialog-when');
        var whereEl = document.getElementById('event-dialog-where');
        var mapEl = document.getElementById('event-dialog-map');

        grid.addEventListener('click', function (e) {
            var btn = e.target.closest('[data-event-open]');
            if (!btn) return;
            titleEl.textContent = btn.getAttribute('data-title') || '';
            textEl.textContent = btn.getAttribute('data-text') || '';
            whenEl.textContent = btn.getAttribute('data-when') || '';
            whereEl.textContent = btn.getAttribute('data-where') || '';
            var query = btn.getAttribute('data-map-query');
            mapEl.hidden = !query;
            if (query) mapEl.href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(query);
            window.Krahls.openDialog(dialog);
        });
    }

    applyFilter('all');
})();
