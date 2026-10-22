/* ==========================================================================
   Tourkalender "Wann kommt der Salatmann?"
   Touren und Saison werden unten im Bereich KONFIGURATION gepflegt.
   ========================================================================== */
(function () {
    'use strict';

    /* ---------------------------- KONFIGURATION ---------------------------- */

    // Touren nach Wochentag (0 = So, 1 = Mo, 2 = Di, 3 = Mi, 4 = Do, 5 = Fr, 6 = Sa)
    var ROUTES = {
        2: {
            name: 'Dienstags-Tour',
            color: 'dot-yellow',
            stops: [{ time: '18:00 - 18:30', location: 'Baumerlenbach' }]
        },
        5: {
            name: 'Freitags-Tour',
            color: 'dot-green',
            stops: [
                { time: '15:00 - 16:00', location: 'Westernhausen' },
                { time: '16:30 - 17:30', location: 'Oberkessach' },
                { time: '18:00 - 19:00', location: 'Berlichingen' },
                { time: '19:30 - 20:00', location: 'Muthof' }
            ]
        },
        6: {
            name: 'Samstags-Tour',
            color: 'dot-orange',
            stops: [
                { time: '08:30 - 08:45', location: 'Kochersteinsfeld' },
                { time: '09:00 - 09:30', location: 'Ohrnberg / Oberohrn' },
                { time: '10:00 - 10:15', location: 'Sindringen' },
                { time: '11:00 - 12:30', location: 'Zweiflingen' },
                { time: '13:00 - 14:30', location: 'Eichach' },
                { time: '15:00 - 16:00', location: 'Westernbach' },
                { time: '16:30 - 17:30', location: 'Großhirschbach' }
            ]
        }
    };

    // Saison: Monate sind 0-basiert (2 = März, 3 = April, 4 = Mai, 5 = Juni)
    var SEASON_MONTHS = [2, 3, 4, 5];

    /* ------------------------------------------------------------------------ */

    var MONTHS = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
    var ICON_SNOW = "<svg class=\"icon\" aria-hidden=\"true\" focusable=\"false\" stroke=\"currentColor\" fill=\"none\" stroke-width=\"2\" viewBox=\"0 0 24 24\" stroke-linecap=\"round\" stroke-linejoin=\"round\" xmlns=\"http://www.w3.org/2000/svg\"><line x1=\"2\" x2=\"22\" y1=\"12\" y2=\"12\"></line><line x1=\"12\" x2=\"12\" y1=\"2\" y2=\"22\"></line><path d=\"m20 16-4-4 4-4\"></path><path d=\"m4 8 4 4-4 4\"></path><path d=\"m16 4-4 4-4-4\"></path><path d=\"m8 20 4-4 4 4\"></path></svg>";

    var titleEl = document.getElementById('currentMonthYear');
    var gridEl = document.getElementById('calendarGrid');
    var detailsEl = document.getElementById('eventDetails');
    var pauseEl = document.getElementById('calendarPause');
    var pauseTextEl = document.getElementById('calendarPauseText');
    var pauseJumpEl = document.getElementById('calendarPauseJump');
    var prevBtn = document.getElementById('calPrev');
    var nextBtn = document.getElementById('calNext');
    if (!titleEl || !gridEl || !detailsEl) return;

    var today = new Date();
    // Immer auf den 1. des Monats setzen, damit das Blättern nie Monate überspringt (z. B. 31. + 1 Monat)
    var view = new Date(today.getFullYear(), today.getMonth(), 1);
    var selectedKey = null;

    var seasonStart = Math.min.apply(null, SEASON_MONTHS);
    var seasonEnd = Math.max.apply(null, SEASON_MONTHS);
    var seasonLabel = MONTHS[seasonStart] + ' bis ' + MONTHS[seasonEnd];

    function esc(text) {
        return String(text).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    function isSeason(monthIndex) {
        return SEASON_MONTHS.indexOf(monthIndex) !== -1;
    }

    function longDate(date) {
        return date.toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    function keyOf(date) {
        return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
    }

    function changeMonth(delta) {
        view = new Date(view.getFullYear(), view.getMonth() + delta, 1);
        render();
    }

    function render() {
        var year = view.getFullYear();
        var month = view.getMonth();
        var inSeason = isSeason(month);

        titleEl.textContent = MONTHS[month] + ' ' + year;

        // Hinweis bei Saisonpause + Sprung zum nächsten Saisonstart
        if (pauseEl) {
            pauseEl.hidden = inSeason;
            if (!inSeason) {
                pauseTextEl.textContent = 'Saisonpause – mobiler Verkauf nur ' + seasonLabel + '.';
                var startYear = month < seasonStart ? year : year + 1;
                pauseJumpEl.textContent = 'Zum Saisonstart (' + MONTHS[seasonStart] + ' ' + startYear + ')';
                pauseJumpEl.onclick = function () {
                    view = new Date(startYear, seasonStart, 1);
                    render();
                };
            }
        }

        gridEl.textContent = '';
        var firstDay = new Date(year, month, 1).getDay();
        var offset = firstDay === 0 ? 6 : firstDay - 1; // Woche beginnt am Montag
        var daysInMonth = new Date(year, month + 1, 0).getDate();

        for (var i = 0; i < offset; i++) {
            gridEl.appendChild(document.createElement('div'));
        }

        for (var day = 1; day <= daysInMonth; day++) {
            gridEl.appendChild(buildDay(new Date(year, month, day), inSeason));
        }
    }

    function buildDay(date, inSeason) {
        var route = inSeason ? ROUTES[date.getDay()] : null;
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'cal-day';
        var key = keyOf(date);

        var label = longDate(date);
        if (route) {
            btn.classList.add('has-route');
            label += ' – ' + route.name;
        }
        btn.setAttribute('aria-label', label);
        btn.setAttribute('aria-pressed', String(key === selectedKey));

        if (date.toDateString() === today.toDateString()) btn.classList.add('is-today');

        var num = document.createElement('span');
        num.textContent = date.getDate();
        btn.appendChild(num);
        if (route) {
            var dot = document.createElement('span');
            dot.className = 'cal-dot ' + route.color;
            dot.setAttribute('aria-hidden', 'true');
            btn.appendChild(dot);
        }

        btn.addEventListener('click', function () {
            selectedKey = key;
            gridEl.querySelectorAll('.cal-day').forEach(function (b) {
                b.setAttribute('aria-pressed', 'false');
            });
            btn.setAttribute('aria-pressed', 'true');
            showDetails(date, route, inSeason);
        });
        return btn;
    }

    function showDetails(date, route, inSeason) {
        var dateText = esc(longDate(date));

        // Fall 1: Saisonpause
        if (!inSeason) {
            detailsEl.innerHTML =
                '<div class="detail detail--center">' +
                '<span class="round-icon">' + ICON_SNOW + '</span>' +
                '<h3>' + dateText + '</h3>' +
                '<div class="pause-box"><strong>Saisonpause</strong><small>Mobiler Verkauf nur ' + esc(seasonLabel) + '</small></div>' +
                '<p class="detail__note">Unser Hauptgeschäft in Kirchardt ist natürlich geöffnet!<br>' +
                'Bitte beachten Sie: Momentan führen wir keine Saisonware. Unser reguläres Sortiment (wie auf der Produktseite) steht Ihnen jedoch uneingeschränkt zur Verfügung.</p>' +
                '</div>';
            return;
        }

        // Fall 2: Saison, aber kein Tourtag
        if (!route) {
            detailsEl.innerHTML =
                '<div class="detail detail--center">' +
                '<h3>' + dateText + '</h3>' +
                '<div class="pause-box"><strong>Kein mobiler Verkauf an diesem Tag</strong></div>' +
                '<p class="detail__note">Besuchen Sie uns gerne im Hauptgeschäft in Kirchardt!</p>' +
                '</div>';
            return;
        }

        // Fall 3: Tourtag
        var stops = route.stops
            .map(function (s) {
                return '<li><time>' + esc(s.time) + '</time><span>' + esc(s.location) + '</span></li>';
            })
            .join('');
        detailsEl.innerHTML =
            '<div class="detail">' +
            '<span class="tag">Tour aktiv</span>' +
            '<h3>' + dateText + '</h3>' +
            '<ul class="stops">' + stops + '</ul>' +
            '</div>';
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { changeMonth(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { changeMonth(1); });

    render();
})();
