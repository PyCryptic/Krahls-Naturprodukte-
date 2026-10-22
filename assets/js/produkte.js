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
    if (!grid || !filterBar) return;

    var dlgImage = document.getElementById('product-dialog-img');
    var dlgMedia = document.getElementById('product-dialog-media');
    var dlgTitle = document.getElementById('product-dialog-title');
    var dlgPrice = document.getElementById('product-dialog-price');
    var dlgList = document.getElementById('product-dialog-list');

    
    /* ---------- Ersatzbilder: jedes Produkt hat immer ein Bild ----------
       Fehlt das Foto (Datei nicht vorhanden / keine Verbindung), wird automatisch
       eine gezeichnete Abbildung angezeigt. Echte Fotos ersetzen sie sofort,
       sobald der Bildpfad in produkte-daten.js stimmt. */
    var G = function (c, extra) { return '<ellipse fill="' + c + '" ' + extra + '/>'; };
    var MOTIFS = {
        'p-salat': function () {
            return G('#3f8f2a', 'cx="300" cy="215" rx="130" ry="95"') + G('#5aa83c', 'cx="300" cy="200" rx="105" ry="78"') +
                G('#7bc257', 'cx="300" cy="190" rx="78" ry="58"') + G('#a3d97a', 'cx="300" cy="182" rx="48" ry="36"') +
                '<path d="M300 280V160M300 250 245 205M300 250 355 205" stroke="#2f6e1f" stroke-width="5" fill="none" stroke-linecap="round"/>';
        },
        'p-kohl': function () {
            return '<circle cx="270" cy="210" r="105" fill="#7fb85a"/><circle cx="270" cy="210" r="78" fill="#a6d47f"/>' +
                '<path d="M270 315V120M270 250 200 190M270 250 340 190M270 280 215 255M270 280 325 255" stroke="#4f8a33" stroke-width="5" fill="none" stroke-linecap="round"/>' +
                '<path d="M430 300c-5-60 10-100 40-120 15 50 5 95-40 120z" fill="#3f8f2a"/><path d="M470 310c10-50 40-80 80-85-5 45-30 75-80 85z" fill="#5aa83c"/>';
        },
        'p-tomaten': function () {
            return '<circle cx="300" cy="215" r="115" fill="#d93a2b"/><ellipse cx="262" cy="170" rx="30" ry="18" fill="#ef6f5e" transform="rotate(-30 262 170)"/>' +
                '<path d="M300 112l22 28 38-12-18 34 34 20-40 4-6 38-30-26-30 26-6-38-40-4 34-20-18-34 38 12z" fill="#3f8f2a"/>';
        },
        'p-paprika': function () {
            return '<path d="M205 150c-60 10-75 90-45 150 25 45 85 40 105-10 15-40 5-120-60-140z" fill="#d93a2b"/><path d="M205 150c-5-25 5-45 22-55" stroke="#3f8f2a" stroke-width="12" fill="none" stroke-linecap="round"/>' +
                '<rect x="330" y="215" width="230" height="80" rx="40" fill="#3f8f2a" transform="rotate(-18 445 255)"/><rect x="345" y="225" width="200" height="22" rx="11" fill="#6dbb4c" transform="rotate(-18 445 255)"/>';
        },
        'p-winter': function () {
            return '<path d="M300 130c-85 0-120 80-90 140 20 40 65 55 90 55s70-15 90-55c30-60-5-140-90-140z" fill="#8e2a55"/><path d="M300 325v50" stroke="#8e2a55" stroke-width="8" stroke-linecap="round"/>' +
                '<path d="M270 135c-30-50-20-85 10-100 15 40 15 70-10 100zM330 135c30-50 20-85-10-100-15 40-15 70 10 100z" fill="#4f9a35"/>';
        },
        'p-salate-frisch': function () {
            return G('#4e9d33', 'cx="300" cy="225" rx="170" ry="80"') + G('#6ebb4a', 'cx="300" cy="195" rx="140" ry="70"') +
                G('#8ed066', 'cx="300" cy="170" rx="105" ry="55"') + G('#b6e38f', 'cx="300" cy="150" rx="65" ry="38"');
        },
        'p-kartoffel': function () {
            return G('#b98a52', 'cx="230" cy="230" rx="105" ry="75" transform="rotate(-15 230 230)"') + G('#c89b62', 'cx="370" cy="190" rx="100" ry="70" transform="rotate(12 370 190)"') +
                '<g fill="#8d6636"><circle cx="205" cy="220" r="7"/><circle cx="255" cy="250" r="6"/><circle cx="350" cy="180" r="7"/><circle cx="400" cy="205" r="6"/><circle cx="235" cy="195" r="5"/></g>';
        },
        'p-zwiebel': function () {
            return '<path d="M300 130c20 40 125 55 125 140 0 55-55 95-125 95s-125-40-125-95c0-85 105-100 125-140z" fill="#d49a3a"/>' +
                '<path d="M300 140c-30 60-70 100-60 220M300 140c0 70 0 150 0 225M300 140c30 60 70 100 60 220" stroke="#b27a22" stroke-width="5" fill="none"/>' +
                '<path d="M300 130c-5-30 5-55 20-70" stroke="#7a9a3a" stroke-width="10" fill="none" stroke-linecap="round"/>';
        },
        'p-apfel': function () {
            return '<path d="M300 140c-45-35-130-15-130 80 0 80 60 125 95 125 18 0 25-8 35-8s17 8 35 8c35 0 95-45 95-125 0-95-85-115-130-80z" fill="#c8302b"/>' +
                '<ellipse cx="250" cy="215" rx="22" ry="40" fill="#e36a5f" opacity=".6" transform="rotate(15 250 215)"/>' +
                '<path d="M300 145c0-30 8-50 22-65" stroke="#6b4a2a" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M325 100c35-25 70-15 85 5-30 25-65 25-85-5z" fill="#4f9a35"/>';
        },
        'p-wurst': function () {
            return '<rect x="120" y="160" width="360" height="80" rx="40" fill="#a8452f" transform="rotate(-12 300 200)"/><rect x="150" y="172" width="290" height="20" rx="10" fill="#c96a50" transform="rotate(-12 300 200)"/>' +
                '<rect x="130" y="250" width="340" height="70" rx="35" fill="#8f3a28" transform="rotate(8 300 285)"/><rect x="160" y="262" width="270" height="18" rx="9" fill="#b1573f" transform="rotate(8 300 285)"/>' +
                '<path d="M120 190c-30-5-45 10-50 30M480 175c28-10 48 0 55 25" stroke="#6b4a2a" stroke-width="5" fill="none"/>';
        },
        'p-kaese': function () {
            return '<path d="M110 260 470 140c40 20 40 70 20 120z" fill="#f2c94c"/><path d="M110 260 490 260v50H110z" fill="#e0a82e"/>' +
                '<g fill="#e0a82e"><circle cx="270" cy="215" r="20"/><circle cx="370" cy="195" r="14"/><circle cx="420" cy="230" r="18"/></g>' +
                '<g fill="#c98f1f"><circle cx="190" cy="285" r="10"/><circle cx="330" cy="290" r="12"/></g>';
        },
        'p-rotwein': function () {
            return '<rect x="170" y="190" width="115" height="190" rx="14" fill="#3b0f1d"/><rect x="205" y="85" width="45" height="115" rx="10" fill="#3b0f1d"/><rect x="200" y="75" width="55" height="26" rx="6" fill="#8a1f33"/>' +
                '<rect x="180" y="250" width="95" height="70" rx="4" fill="#f4ead8"/><path d="M195 275h65M195 295h45" stroke="#722f37" stroke-width="5"/>' +
                '<path d="M370 150h120c0 70-20 110-60 120-40-10-60-50-60-120z" fill="#c9d7de" opacity=".55"/><path d="M372 190h116c-3 55-22 80-58 85-36-5-55-30-58-85z" fill="#8a1f33"/><path d="M430 270v75M395 350h70" stroke="#c9d7de" stroke-width="8" stroke-linecap="round"/>';
        },
        'p-weinbrand': function () {
            return '<rect x="190" y="200" width="105" height="170" rx="14" fill="#b86b1c"/><rect x="224" y="105" width="38" height="100" rx="8" fill="#b86b1c"/><rect x="219" y="92" width="48" height="24" rx="6" fill="#4a2a10"/>' +
                '<rect x="200" y="255" width="85" height="60" rx="4" fill="#f4ead8"/><path d="M212 278h60M212 296h40" stroke="#4a2a10" stroke-width="5"/>' +
                '<path d="M360 170c-30 0-45 20-45 55 0 45 35 70 70 70s70-25 70-70c0-35-15-55-45-55z" fill="#c9d7de" opacity=".55"/><path d="M322 235c8 38 35 52 63 52s55-14 63-52z" fill="#d8821e"/><path d="M385 295v55M350 355h70" stroke="#c9d7de" stroke-width="8" stroke-linecap="round"/>';
        },
        'p-erde': function () {
            return '<path d="M160 190h280l22 175H138z" fill="#5a3a22"/><path d="M160 190h280l-10 40H170z" fill="#6b4a2e"/><rect x="215" y="255" width="170" height="70" rx="6" fill="#f4ead8"/><path d="M235 282h130M235 304h90" stroke="#4d7a17" stroke-width="6"/>' +
                '<path d="M300 190v-70" stroke="#4f9a35" stroke-width="8" stroke-linecap="round"/><path d="M300 150c-45-5-65-35-60-65 40 0 62 25 60 65zM300 130c40 0 65-30 60-60-40-5-62 20-60 60z" fill="#6ebb4a"/>';
        }
    };
    var BG = {
        setzlinge: ['#e3f2d3', '#cfe8b4'], salate: ['#e3f2d3', '#cfe8b4'], gemuese: ['#f6ecd2', '#ecdcae'],
        wurst: ['#f3dfd7', '#e8c7ba'], weine: ['#efdbe0', '#e0bcc6'], kaese: ['#fbf1cf', '#f4e2a0'], erde: ['#ecdfd1', '#dcc7b0']
    };

    /* Passende Zeichnung je Sorte (nach Name); sonst Zeichnung des Produkts */
    function paprikaArt(c) {
        return '<path d="M300 130c-85 10-105 100-70 170 28 52 112 52 140 0 35-70 15-160-70-170z" fill="' + c + '"/><ellipse cx="255" cy="215" rx="16" ry="48" fill="#fff" opacity=".25" transform="rotate(12 255 215)"/><path d="M300 130c-4-25 4-45 20-58" stroke="#3f8f2a" stroke-width="12" fill="none" stroke-linecap="round"/>';
    }
    function longArt(c, hi, tip) {
        return '<rect x="105" y="170" width="390" height="95" rx="47" fill="' + c + '" transform="rotate(-12 300 218)"/><rect x="130" y="185" width="330" height="24" rx="12" fill="' + hi + '" transform="rotate(-12 300 218)"/>' + (tip || '');
    }
    function cabbageArt(c1, c2, vein) {
        return '<circle cx="300" cy="212" r="115" fill="' + c1 + '"/><circle cx="300" cy="212" r="84" fill="' + c2 + '"/><path d="M300 325V110M300 255 225 195M300 255 375 195M300 290 245 265M300 290 355 265" stroke="' + vein + '" stroke-width="5" fill="none" stroke-linecap="round"/>';
    }
    var VARIETY_MOTIFS = [
        [/aubergine/i, function () { return '<path d="M210 150c-50 40-55 130-5 180 40 38 110 20 140-40 25-50 5-130-45-160-25-14-65-8-90 20z" fill="#4b2a63" transform="rotate(20 300 230)"/><ellipse cx="250" cy="215" rx="14" ry="45" fill="#fff" opacity=".2" transform="rotate(20 250 215)"/><path d="M370 130l40 25-35 20-45-10z" fill="#3f8f2a"/>'; }],
        [/gurke/i, function () { return longArt('#3f8f2a', '#6dbb4c', '<g fill="#2f6e1f"><circle cx="190" cy="235" r="4"/><circle cx="260" cy="215" r="4"/><circle cx="340" cy="195" r="4"/><circle cx="410" cy="178" r="4"/></g>'); }],
        [/zucchini.*gelb/i, function () { return longArt('#e0b93a', '#f4dc78'); }],
        [/zucchini/i, function () { return longArt('#3f8f2a', '#6dbb4c'); }],
        [/paprika.*gelb/i, function () { return paprikaArt('#f0c332'); }],
        [/paprika.*gr(ü|ue)n/i, function () { return paprikaArt('#4f9a35'); }],
        [/paprika/i, function () { return paprikaArt('#d93a2b'); }],
        [/brokkoli|broccoli/i, function () { return '<path d="M285 220h30v120h-30z" fill="#7fb85a"/><g fill="#2f7d2a"><circle cx="230" cy="200" r="55"/><circle cx="300" cy="165" r="62"/><circle cx="370" cy="200" r="55"/><circle cx="300" cy="225" r="55"/></g><g fill="#4f9a35"><circle cx="270" cy="160" r="22"/><circle cx="340" cy="195" r="20"/></g>'; }],
        [/blumenkohl/i, function () { return '<g fill="#7fb85a"><path d="M150 230c-20 50 20 100 80 90l-20-90z"/><path d="M450 230c20 50-20 100-80 90l20-90z"/></g><g fill="#f4efe2"><circle cx="230" cy="200" r="55"/><circle cx="300" cy="165" r="62"/><circle cx="370" cy="200" r="55"/><circle cx="300" cy="235" r="62"/></g><g fill="#e3dac4"><circle cx="270" cy="160" r="18"/><circle cx="345" cy="200" r="16"/></g>'; }],
        [/kohlrabi/i, function () { return '<circle cx="300" cy="245" r="95" fill="#9bcf6f"/><path d="M300 150c-60-60-95-50-105-20 30 15 70 20 105 20zM300 150c60-60 95-50 105-20-30 15-70 20-105 20zM300 145V60" stroke="#4f9a35" stroke-width="10" fill="#6ebb4a" stroke-linecap="round"/>'; }],
        [/rotkohl/i, function () { return cabbageArt('#8e2a6b', '#b0508c', '#5d1a45'); }],
        [/wei(ß|ss)kohl|chinakohl|zuckerhut|endivi/i, function () { return cabbageArt('#cfe6a8', '#e8f3cf', '#8fb860'); }],
        [/rosenkohl/i, function () { return '<g fill="#6ebb4a"><circle cx="220" cy="230" r="55"/><circle cx="330" cy="210" r="60"/><circle cx="410" cy="260" r="48"/></g><g stroke="#3f8f2a" stroke-width="5" fill="none"><path d="M200 215c15-10 35-10 45 5M310 190c18-10 38-8 50 8M395 250c12-8 28-7 36 4"/></g>'; }],
        [/petersilie|schnittlauch|basilikum|rucola/i, function () { return '<path d="M300 340V190" stroke="#3f8f2a" stroke-width="8" stroke-linecap="round"/><g fill="#5aa83c"><path d="M300 210c-70-10-100-60-85-100 55 5 90 45 85 100z"/><path d="M300 210c70-10 100-60 85-100-55 5-90 45-85 100z"/><path d="M300 270c-60-5-85-45-75-80 50 5 80 35 75 80z"/><path d="M300 270c60-5 85-45 75-80-50 5-80 35-75 80z"/></g>'; }],
        [/lauch|sellerie/i, function () { return '<g fill="#e8f0d2"><rect x="255" y="200" width="30" height="150" rx="10"/><rect x="285" y="190" width="30" height="165" rx="10"/><rect x="315" y="200" width="30" height="150" rx="10"/></g><g fill="#5aa83c"><path d="M270 205c-50-40-60-80-45-110 35 25 55 65 45 110z"/><path d="M300 195c0-50 0-85 0-110 25 25 30 65 0 110z"/><path d="M330 205c50-40 60-80 45-110-35 25-55 65-45 110z"/></g>'; }],
        [/kopfsalat|eisberg|lollo|eichenlaub|romana|blattsalat|ackersalat|feldsalat/i, null],
        [/jonagold|gala|elstar|delba/i, function () { return null; }]
    ];
    function varietyMotif(product, v) {
        for (var i = 0; i < VARIETY_MOTIFS.length; i++) {
            if (VARIETY_MOTIFS[i][0].test(v.name) && VARIETY_MOTIFS[i][1]) {
                var m = VARIETY_MOTIFS[i][1]();
                if (m) return m;
            }
        }
        return null;
    }
    function fallbackImage(product, variant, v) {
        var motif = (v && varietyMotif(product, v)) || (MOTIFS[product.id] ? MOTIFS[product.id]() : '<path d="M300 320V180M300 240c-60-5-95-45-90-90 55 0 90 35 90 90zM300 210c50 0 85-35 80-80-50-5-85 30-80 80z" fill="#6ebb4a" stroke="#4d7a17" stroke-width="6"/>');
        var c = BG[product.category] || BG.setzlinge;
        variant = variant || 0;
        if (variant % 3 === 1) c = [c[1], c[0]];
        var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + c[0] + '"/><stop offset="1" stop-color="' + c[1] + '"/></linearGradient></defs><rect width="600" height="400" fill="url(#g)"/><ellipse cx="300" cy="372" rx="190" ry="14" fill="#000" opacity=".08"/>' + motif + '</svg>';
        return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    }
    // Setzt das Ersatzbild, falls das eigentliche Bild nicht lädt
    function withFallback(img, product) {
        img.addEventListener('error', function () {
            if (img.getAttribute('data-fallback')) return;
            img.setAttribute('data-fallback', '1');
            img.classList.remove('is-broken');
            img.src = fallbackImage(product);
        });
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

    /* ---------- Alles direkt sichtbar: pro Produkt alle Sorten mit Bild ---------- */
    function varietyImage(img, product, v, index) {
        img.addEventListener('error', function () {
            if (img.getAttribute('data-fallback')) return;
            img.setAttribute('data-fallback', '1');
            img.classList.remove('is-broken');
            img.src = fallbackImage(product, index, v);
        });
        // Eigenes Foto pro Sorte (v.image in produkte-daten.js) hat Vorrang, sonst gezeichnete Abbildung
        if (v.image) img.src = v.image;
        else img.src = fallbackImage(product, index, v);
    }

    function buildGroup(product) {
        var group = el('section', 'product-group');
        group.setAttribute('data-category', product.category);
        group.setAttribute('data-id', product.id);
        group.setAttribute('aria-labelledby', product.id + '-title');

        var head = el('div', 'product-group__head');
        var thumb = el('div', 'product-group__thumb');
        var timg = el('img');
        timg.alt = '';
        timg.loading = 'lazy';
        timg.decoding = 'async';
        withFallback(timg, product);
        timg.src = product.image;
        thumb.appendChild(timg);
        head.appendChild(thumb);
        var titleWrap = el('div', 'product-group__text');
        var h = el('h2', '', product.title);
        h.id = product.id + '-title';
        titleWrap.appendChild(h);
        titleWrap.appendChild(el('p', 'product-group__desc', product.desc));
        head.appendChild(titleWrap);
        var meta = el('div', 'product-group__meta');
        meta.appendChild(el('span', 'price', product.price));
        meta.appendChild(el('span', 'pill pill--tag', product.tag));
        head.appendChild(meta);
        group.appendChild(head);

        var list = el('ul', 'variety-grid');
        product.varieties.forEach(function (v, i) {
            var li = el('li', 'variety-card');
            var media = el('div', 'variety-card__media');
            var img = el('img');
            img.alt = '';
            img.loading = 'lazy';
            img.decoding = 'async';
            varietyImage(img, product, v, i);
            media.appendChild(img);
            li.appendChild(media);
            li.appendChild(el('span', 'variety-card__name', v.name));
            list.appendChild(li);
        });
        group.appendChild(list);
        return group;
    }

    function renderCards() {
        var fragment = document.createDocumentFragment();
        products.forEach(function (p) {
            fragment.appendChild(buildGroup(p));
        });
        grid.appendChild(fragment);
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
        grid.querySelectorAll('.product-group').forEach(function (card) {
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
