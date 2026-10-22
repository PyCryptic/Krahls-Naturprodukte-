# Krahls Naturprodukte – Website

Statische Website für den Hofladen und den mobilen Verkauf in Kirchardt-Berwangen.
Reines HTML, CSS und JavaScript: **kein Backend, kein Build-Schritt, kein `npm install`**.
Es werden **keine externen Skripte, Schriften oder Icons mehr geladen** (früher: Tailwind-CDN, unpkg/Lucide, Google Fonts).

## Wichtig: ZIP in das bestehende Projekt einspielen

Die ZIP enthält **keine Bilder**, denn Ihre Bilder lagen nicht bei den hochgeladenen Dateien. Die Seiten verweisen aber auf Ihre vorhandenen Dateien. Entpacken Sie die ZIP daher **in Ihren bestehenden Projektordner** und lassen Sie `assets/img/` unangetastet:

```text
assets/img/Logo.ico
assets/img/logo/Logo.jpeg
assets/img/Feste/weinfest.jpeg
assets/img/Produktbilder/salatsetzlinge.jpg
assets/img/Team-Bilder/person-by-christian-buehner-DItYlc26zVI.jpg
assets/img/Team-Bilder/person-by-linkedin-sales-solutions-pAtA8xe_iVM.jpg
assets/img/Team-Bilder/fabian_2.jpeg
```

Fehlt ein Bild, bleibt die Seite benutzbar (Logo → Buchstabe „K“, Team → Initialen, Karten → farbiger Hintergrund).

**Alte Dateien können gelöscht werden:** `script.js`, `scrip.js`, `nav.js`, `logo.js`, `filter.js` (ersetzt durch `main.js`, `produkte.js`, `produkte-daten.js`), `script.txt`.

## Ordnerstruktur

```text
/
├── index.html          Startseite
├── produkte.html       Sortiment mit Filter (zeigt nur das Angebot)
├── team.html           Team
├── anfahrt.html        Kontakt, Karte, Tourkalender „Salatmann“
├── events.html         Events
├── impressum.html
├── datenschutz.html
├── shop.html           „In Kürze verfügbar“ (nicht in der Navigation, noindex)
└── assets/
    ├── css/style.css           komplettes Design (CSS-Variablen oben)
    ├── js/main.js              Menü, Dialoge, Logo-Vergrößerung, Karte nach Klick
    ├── js/produkte-daten.js    ← HIER Produkte und Bestände pflegen
    ├── js/produkte.js          Karten, Filter, Dialog (Logik)
    ├── js/kalenderplaner.js    Tourkalender (Touren und Saison oben in der Datei)
    ├── js/events.js            Event-Filter und Dialog
    ├── fonts/                  leer (optional für eigene Schriften)
    └── img/                    hier liegen Ihre Bilder
```

## Lokal starten

Doppelklick auf `index.html` genügt. Alternativ mit lokalem Server:

```bash
python3 -m http.server 8000     # dann http://localhost:8000 öffnen
```

## Veröffentlichen (z. B. netcup-Webspace)

Den gesamten Ordnerinhalt per FTP/SFTP in das Web-Stammverzeichnis hochladen (`index.html` muss dort direkt liegen). Es ist keine Serverkonfiguration nötig.

## Inhalte pflegen

* **Produkte / Sorten:** `assets/js/produkte-daten.js`. Karten und Filter entstehen automatisch. Die Seite zeigt nur, was Sie anbieten (Produkte, Preise, Sorten), **ohne Bestandsangaben**.
* **Bestandsanzeige (optional):** In derselben Datei `window.PRODUCT_SHOW_STOCK = true;` setzen, dann erscheinen wieder „Auf Lager / Wenige / Ausverkauft“ (aus `stock`: 0 = ausverkauft, 1–10 = wenige). Standard ist `false`.
* **Touren und Saison:** oben in `assets/js/kalenderplaner.js` (`ROUTES`, `SEASON_MONTHS`). Aktuell: Di, Fr, Sa, März bis Juni.
* **Neues Event:** Vorlage als Kommentar in `events.html` kopieren und anpassen. Mit `data-end="JJJJ-MM-TT"` wird ein vergangenes Event automatisch als „Beendet“ markiert.
* **Farben und Schriften:** Variablen am Anfang von `assets/css/style.css`. Für Inter/Playfair Display `.woff2`-Dateien in `assets/fonts/` legen und den auskommentierten `@font-face`-Block aktivieren. Ohne eigene Dateien werden Systemschriften verwendet.

## Was sich gegenüber der alten Version geändert hat

* Fehlerhafte Skripteinbindungen behoben: `script.js` existierte nicht (404 auf Anfahrt, Impressum, Datenschutz, Shop); auf der Events-Seite funktionierte das Mobilmenü gar nicht; auf der Startseite waren drei Menü-Handler gleichzeitig aktiv.
* Kaputtes HTML behoben: in `team.html` verschluckte ein Kommentar das schließende `</div>` des Mobilmenüs; in `datenschutz.html` stand ein verwaistes „Shop“ in der Navigation.
* Einheitlicher Kopfbereich auf allen Seiten (vorher unterschiedlich, teils mit Lücke beim Scrollen).
* Tourkalender: Blättern überspringt keine Monate mehr (z. B. am 31.), Tage sind per Tastatur bedienbar, bei Saisonpause gibt es einen Hinweis mit Sprung zum Saisonstart.
* Google-Karte wird erst nach Klick geladen.
* Barrierefreiheit: Skip-Link, Fokusrahmen, `aria-`-Attribute, native `<dialog>`-Fenster (ESC, Fokus), reduzierte Animationen.
* Alle Icons lokal als Inline-SVG (die Lucide-Markensymbole für Facebook, Instagram und Twitter gibt es in neueren Lucide-Versionen nicht mehr).
* Startseite um Teaser, Öffnungszeiten und Routenlink ergänzt – nur aus bereits vorhandenen Angaben.
* Meta-Beschreibungen für alle Seiten, strukturierte Daten (LocalBusiness) auf der Startseite, `tel:`-Links.

## Offene Punkte (bitte prüfen)

**Rechtliches (nicht von mir geändert, da rechtliche Angaben nicht erfunden werden dürfen):**

1. **Datenschutz erwähnt Google Maps nicht**, obwohl die Karte (nach Klick) eine Verbindung zu Google aufbaut.
2. **Datenschutz Abschnitt 7 behauptet, es würden keine Bilder von externen Servern geladen.** Tatsächlich stammen Hero-Bilder, die meisten Produktbilder und zwei Teamfotos von `images.unsplash.com`. Entweder die Bilder lokal ablegen oder den Text anpassen.
3. **Impressum:** Die Platzhalter „Nummer Für Handelsregister“ / „Register Nr“ habe ich auskommentiert (Hinweis im Quelltext). Echte Angaben ergänzen, falls vorhanden.
4. **Impressum nennt „§ 5 TMG“** – dieses Gesetz wurde durch das Digitale-Dienste-Gesetz (DDG) abgelöst. Bitte rechtlich prüfen lassen.
5. Unterschiedliche E-Mail-Adressen in Impressum (`info@krahls-naturprodukte.de`) und Datenschutz (`krahlfabian2@gmail.com`).

**Inhalt:**

6. Das einzige Event (Herbstfest 17.–18.10.2026) ist vorbei und wird als „Beendet“ angezeigt.
7. „Max Mustermann“ im Team war ein Platzhalter und ist auskommentiert. Die Fotos von Doris und Pascal Krahl sowie die Dateinamen `person-by-…` sehen nach Stockfotos aus.
8. Facebook- und Twitter/X-Links zeigen nur auf die Startseiten der Netzwerke (`facebook.com`, `twitter.com`), nicht auf Ihre Profile.
9. Mögliche Schreibweisen: „Curvee“ (Cuvée?), „Johaniter“ (Johanniter?). Unverändert übernommen.
10. `script.txt` (Team-Eintrag „Rasiel Moser, Webentwickler“) war in keiner Seite eingebunden und wurde nicht übernommen.

## Getestet

Mit Chromium (Playwright), Desktop 1280 px und Smartphone 390 px, alle 8 Seiten: keine JavaScript-Fehler, kein horizontales Scrollen, Mobilmenü, Produktfilter und -dialog (ohne Bestandsanzeige; Schalter auf `true` ebenfalls geprüft), Tourkalender (inkl. Monatsende), Karte nach Klick, Event-Dialog, Logo-Vergrößerung. Nicht getestet: Safari/Firefox, echte Bilder (lagen nicht vor), Internetzugriff auf Unsplash und Google Maps.
