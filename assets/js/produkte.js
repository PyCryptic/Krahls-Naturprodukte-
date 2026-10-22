/* ==========================================================================
   Produktseite: Karten, Filter und Bestands-Dialog
   Daten kommen aus produkte-daten.js (dort Bestände pflegen).
   ========================================================================== */
(function () {
    'use strict';

    var products = window.PRODUCT_DATA || [];
    var categories = window.PRODUCT_CATEGORIES || [];

    var grid = document.getElementById('product-grid');
    var filterBar = document.getElementById('product-filters');
    var counter = document.getElementById('product-count');
    var dialog = document.getElementById('product-dialog');
    if (!grid || !filterBar || !dialog) return;

    var dlgImage = document.getElementById('product-dialog-img');
    var dlgMedia = document.getElementById('product-dialog-media');
    var dlgTitle = document.getElementById('product-dialog-title');
    var dlgPrice = document.getElementById('product-dialog-price');
    var dlgList = document.getElementById('product-dialog-list');

    var ICON_SEARCH = "<svg class=\"icon\" aria-hidden=\"true\" focusable=\"false\" stroke=\"currentColor\" fill=\"none\" stroke-width=\"2\" viewBox=\"0 0 24 24\" stroke-linecap=\"round\" stroke-linejoin=\"round\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"11\" cy=\"11\" r=\"8\"></circle><path d=\"m21 21-4.3-4.3\"></path></svg>";

    // Bestandsanzeige nur, wenn in produkte-daten.js PRODUCT_SHOW_STOCK = true gesetzt ist
    var showStock = window.PRODUCT_SHOW_STOCK === true;

    if (showStock) {
        var hintText = document.getElementById('product-hint-text');
        var dlgHeading = document.getElementById('product-dialog-heading');
        if (hintText) hintText.textContent = 'Tipp: Klicken Sie auf ein Produkt, um den genauen Bestand der Sorten zu sehen.';
        if (dlgHeading) dlgHeading.textContent = 'Verfügbarkeit der Sorten';
    }

    /* ---------- Hilfsfunktionen ---------- */
    function el(tag, className, text) {
        var node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    }

    function totalStock(product) {
        return product.varieties.reduce(function (sum, v) {
            return sum + v.stock;
        }, 0);
    }

    // Gesamtstatus eines Produkts: 0 = ausverkauft, bis 10 = wenige, sonst auf Lager
    function productStatus(total) {
        if (total === 0) return { css: 'pill--out', label: 'Ausverkauft', soldOut: true };
        if (total <= 10) return { css: 'pill--low', label: 'Wenige', soldOut: false };
        return { css: 'pill--ok', label: 'Auf Lager', soldOut: false };
    }

    // Status einer einzelnen Sorte
    function varietyStatus(stock) {
        if (stock === 0) return { dot: 'dot--out', note: '(Ausverkauft)', out: true };
        if (stock <= 10) return { dot: 'dot--low', note: '(Nur noch wenige)', out: false };
        return { dot: 'dot--ok', note: '', out: false };
    }

    /* ---------- Karten aufbauen ---------- */
    function buildCard(product) {
        var status = showStock ? productStatus(totalStock(product)) : { css: '', label: '', soldOut: false };

        var card = el('button', 'card product-card');
        card.type = 'button';
        card.setAttribute('data-category', product.category);
        card.setAttribute('data-id', product.id);
        card.setAttribute('aria-haspopup', 'dialog');

        var media = el('div', 'media' + (status.soldOut ? ' media--soldout' : ''));
        var img = el('img');
        img.src = product.image;
        img.alt = product.title;
        img.loading = 'lazy';
        img.decoding = 'async';
        media.appendChild(img);
        media.appendChild(el('span', 'pill pill--tag', product.tag));
        if (showStock) media.appendChild(el('span', 'pill pill--status ' + status.css, status.label));
        var zoom = el('span', 'media__zoom');
        zoom.setAttribute('aria-hidden', 'true');
        zoom.innerHTML = ICON_SEARCH;
        media.appendChild(zoom);

        var body = el('div', 'product-card__body');
        body.appendChild(el('h3', '', product.title));
        body.appendChild(el('p', 'product-card__desc', product.desc));
        var foot = el('div', 'product-card__foot');
        foot.appendChild(el('span', 'price', product.price));
        foot.appendChild(el('span', 'product-card__more', showStock ? 'Bestand ansehen' : 'Sorten ansehen'));
        body.appendChild(foot);

        card.appendChild(media);
        card.appendChild(body);
        card.addEventListener('click', function () {
            openProduct(product);
        });
        return card;
    }

    function renderCards() {
        var fragment = document.createDocumentFragment();
        products.forEach(function (p) {
            fragment.appendChild(buildCard(p));
        });
        grid.appendChild(fragment);
    }

    /* ---------- Dialog ---------- */
    function openProduct(product) {
        dlgTitle.textContent = product.title;
        dlgPrice.textContent = product.price;

        dlgImage.classList.remove('is-broken');
        dlgImage.src = product.image;
        dlgImage.alt = '';

        dlgList.textContent = '';
        product.varieties.forEach(function (v) {
            var li = el('li');
            if (!showStock) {
                // Nur das Angebot zeigen: alle Sorten ohne Bestandsangabe
                li.appendChild(el('span', 'stock-list__name', v.name));
                dlgList.appendChild(li);
                return;
            }
            var s = varietyStatus(v.stock);
            var name = el('span', 'stock-list__name');
            name.appendChild(el('span', 'dot ' + s.dot));
            name.lastChild.setAttribute('aria-hidden', 'true');
            name.appendChild(el('span', s.out ? 'is-out' : '', v.name));
            li.appendChild(name);
            li.appendChild(el('span', 'stock-list__note', s.note));
            dlgList.appendChild(li);
        });

        window.Krahls.openDialog(dialog);
    }

    /* ---------- Filter ---------- */
    function renderFilters() {
        var all = [{ id: 'all', label: 'Alle' }].concat(categories);
        all.forEach(function (cat) {
            var btn = el('button', 'chip', cat.label);
            btn.type = 'button';
            btn.setAttribute('data-filter', cat.id);
            btn.setAttribute('aria-pressed', cat.id === 'all' ? 'true' : 'false');
            filterBar.appendChild(btn);
        });
        filterBar.addEventListener('click', function (e) {
            var btn = e.target.closest('[data-filter]');
            if (btn) applyFilter(btn.getAttribute('data-filter'));
        });
    }

    function applyFilter(category) {
        filterBar.querySelectorAll('[data-filter]').forEach(function (btn) {
            btn.setAttribute('aria-pressed', String(btn.getAttribute('data-filter') === category));
        });
        var visible = 0;
        grid.querySelectorAll('.product-card').forEach(function (card) {
            var show = category === 'all' || card.getAttribute('data-category') === category;
            card.hidden = !show;
            if (show) visible += 1;
        });
        if (counter) {
            counter.textContent = visible === 1 ? '1 Produkt angezeigt' : visible + ' Produkte angezeigt';
        }
    }

    /* ---------- Start ---------- */
    renderFilters();
    renderCards();
    applyFilter('all');

    // Direktlink, z. B. produkte.html#weine
    var hash = window.location.hash.replace('#', '');
    if (hash && categories.some(function (c) { return c.id === hash; })) applyFilter(hash);
})();
