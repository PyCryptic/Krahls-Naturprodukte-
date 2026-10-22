(function () {
    'use strict';

    document.documentElement.classList.add('js');

    /* ---------- Defekte Bilder ausblenden (Hintergrund bleibt sichtbar) ---------- */
    function markBroken(img) {
        img.classList.add('is-broken');
    }
    document.addEventListener(
        'error',
        function (e) {
            if (e.target && e.target.tagName === 'IMG') markBroken(e.target);
        },
        true
    );
    document.querySelectorAll('img').forEach(function (img) {
        if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) markBroken(img);
    });

    /* ---------- Mobiles Menü ---------- */
    var toggle = document.querySelector('.nav-toggle');
    var menu = document.getElementById('mobile-menu');

    function setMenu(open) {
        if (!toggle || !menu) return;
        menu.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    }

    if (toggle && menu) {
        toggle.addEventListener('click', function () {
            setMenu(toggle.getAttribute('aria-expanded') !== 'true');
        });
        menu.addEventListener('click', function (e) {
            if (e.target.closest('a')) setMenu(false);
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && menu.classList.contains('is-open')) {
                setMenu(false);
                toggle.focus();
            }
        });
        window.matchMedia('(min-width: 48rem)').addEventListener('change', function (e) {
            if (e.matches) setMenu(false);
        });
    }

    /* ---------- Dialoge ---------- */
    function openDialog(dialog) {
        if (!dialog || dialog.open) return;
        if (typeof dialog.showModal === 'function') {
            dialog.showModal();
        } else {
            dialog.setAttribute('open', '');
        }
        document.body.classList.add('has-dialog');
    }

    function bindDialog(dialog) {
        dialog.addEventListener('close', function () {
            if (!document.querySelector('dialog[open]')) document.body.classList.remove('has-dialog');
        });
        dialog.addEventListener('click', function (e) {
            // Klick auf den Hintergrund (= das Dialog-Element selbst) oder auf ein [data-close]-Element
            if (e.target === dialog || e.target.closest('[data-close]')) dialog.close();
        });
    }
    document.querySelectorAll('dialog').forEach(bindDialog);

    /* ---------- Logo im Footer vergrößern ---------- */
    var logoBtn = document.querySelector('.footer-logo-btn');
    var logoDialog = document.getElementById('logo-dialog');
    var logoImg = document.getElementById('logo-dialog-img');
    if (logoBtn && logoDialog && logoImg) {
        logoBtn.addEventListener('click', function () {
            var src = logoBtn.querySelector('img');
            if (!src || src.classList.contains('is-broken')) return;
            logoImg.src = src.currentSrc || src.src;
            openDialog(logoDialog);
        });
    }

    /* ---------- Karte erst nach Zustimmung laden ---------- */
    document.querySelectorAll('[data-map-src]').forEach(function (box) {
        var btn = box.querySelector('[data-map-load]');
        if (!btn) return;
        btn.addEventListener('click', function () {
            var frame = document.createElement('iframe');
            frame.src = box.getAttribute('data-map-src');
            frame.title = box.getAttribute('data-map-title') || 'Karte';
            frame.loading = 'lazy';
            frame.referrerPolicy = 'no-referrer-when-downgrade';
            frame.allowFullscreen = true;
            var consent = box.querySelector('.map__consent');
            if (consent) consent.remove();
            box.appendChild(frame);
        });
    });

    /* ---------- Einblenden beim Scrollen ---------- */
    var revealItems = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        io.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12 }
        );
        revealItems.forEach(function (el) {
            io.observe(el);
        });
    } else {
        revealItems.forEach(function (el) {
            el.classList.add('is-visible');
        });
    }

    /* ---------- Für andere Skripte bereitstellen ---------- */
    window.Krahls = { openDialog: openDialog };
})();