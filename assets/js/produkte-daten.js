/* ==========================================================================
   LAGERVERWALTUNG – HIER PRODUKTE UND MENGEN EINTRAGEN
   --------------------------------------------------------------------------
   Nur diese Datei muss für Bestandsänderungen bearbeitet werden.

   Pro Produkt:
     category   Kategorie (siehe PRODUCT_CATEGORIES unten)
     title      Name der Karte
     price      Preis als Text
     image      Bildpfad (lokal in assets/img/ oder Web-Adresse)
     tag        "Saisonbedingt" oder "Dauerhaft"
     desc       Kurzbeschreibung
     varieties  Sorten mit Bestand (stock: 0 = ausverkauft, 1–10 = wenige)

   Die Reihenfolge hier ist die Reihenfolge auf der Seite.
   ========================================================================== */

/* Bestandsanzeige:
   false = Die Seite zeigt nur, was angeboten wird (Produkte und Sorten, ohne Mengen/Status).
   true  = Zusätzlich werden "Auf Lager" / "Wenige" / "Ausverkauft" angezeigt (nach "stock" unten). */
window.PRODUCT_SHOW_STOCK = false;

window.PRODUCT_CATEGORIES = [
    { id: 'setzlinge', label: 'Setzlinge' },
    { id: 'salate', label: 'Salate' },
    { id: 'gemuese', label: 'Gemüse & Obst' },
    { id: 'wurst', label: 'Wurstwaren' },
    { id: 'weine', label: 'Wein & Spirituosen' },
    { id: 'kaese', label: 'Käse' },
    { id: 'erde', label: 'Erde' }
];

window.PRODUCT_DATA = [
    {
        id: 'p-salat',
        category: 'setzlinge',
        title: 'Salatsetzlinge',
        price: '0,25 € / Stück',
        image: 'assets/img/Produktbilder/salatsetzlinge.jpg',
        tag: 'Saisonbedingt',
        desc: 'Kopfsalat, Lollo Rossa, Eisbergsalat, Romana und mehr.',
        varieties: [
            { name: 'Kopfsalat rot', stock: 100 },
            { name: 'Kopfsalat weiß', stock: 15 },
            { name: 'Lollo Rossa', stock: 50 },
            { name: 'Lollo Bionda', stock: 8 },
            { name: 'Eisbergsalat', stock: 0 },
            { name: 'Eichenlaub', stock: 20 },
            { name: 'Romana', stock: 30 },
            { name: 'Rucola', stock: 40 }
        ]
    },
    {
        id: 'p-kohl',
        category: 'setzlinge',
        title: 'Kraut- & Kräutersetzlinge',
        price: '0,30 € / Stück',
        image: 'https://images.unsplash.com/photo-1593105544559-ecb03bf76f87?q=80&w=600&auto=format&fit=crop',
        tag: 'Saisonbedingt',
        desc: 'Diverse Kohlsorten und Kräuter.',
        varieties: [
            { name: 'Weißkohl', stock: 50 },
            { name: 'Rotkohl', stock: 50 },
            { name: 'Kohlrabi', stock: 100 },
            { name: 'Blumenkohl', stock: 2 },
            { name: 'Brokkoli', stock: 0 },
            { name: 'Rosenkohl', stock: 20 },
            { name: 'Petersilie', stock: 30 },
            { name: 'Schnittlauch', stock: 30 },
            { name: 'Basilikum', stock: 0 }
        ]
    },
    {
        id: 'p-tomaten',
        category: 'setzlinge',
        title: 'Tomaten-Setzlinge',
        price: '4,20 € / Stück',
        image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?q=80&w=600&auto=format&fit=crop',
        tag: 'Saisonbedingt',
        desc: 'Cocktail, Eier, Flaschen, Ochsenherzen und große Fleischtomaten.',
        varieties: [
            { name: 'Cocktailtomaten', stock: 20 },
            { name: 'Eiertomaten', stock: 15 },
            { name: 'Flaschentomaten', stock: 5 },
            { name: 'Ochsenherzen', stock: 0 },
            { name: 'Fleischtomaten', stock: 25 }
        ]
    },
    {
        id: 'p-paprika',
        category: 'setzlinge',
        title: 'Paprika & Zucchini',
        price: 'ab 4,20 € / Stück',
        image: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?q=80&w=600&auto=format&fit=crop',
        tag: 'Saisonbedingt',
        desc: 'Paprika (bunt), Zucchini, Auberginen, Gurken.',
        varieties: [
            { name: 'Paprika Rot', stock: 20 },
            { name: 'Paprika Gelb', stock: 15 },
            { name: 'Paprika Grün', stock: 20 },
            { name: 'Zucchini Grün', stock: 10 },
            { name: 'Zucchini Gelb', stock: 5 },
            { name: 'Aubergine', stock: 0 },
            { name: 'Schlangengurke', stock: 30 },
            { name: 'Landgurke', stock: 12 }
        ]
    },
    {
        id: 'p-winter',
        category: 'gemuese',
        title: 'Wintergemüse',
        price: '0,25 € / Stück',
        image: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?q=80&w=600&auto=format&fit=crop',
        tag: 'Saisonbedingt',
        desc: 'Rote Rüben, Chinakohl und mehr.',
        varieties: [
            { name: 'Rote Rüben', stock: 100 },
            { name: 'Chinakohl', stock: 50 },
            { name: 'Endivien', stock: 0 },
            { name: 'Zuckerhut', stock: 20 },
            { name: 'Lauch', stock: 100 },
            { name: 'Sellerie', stock: 40 }
        ]
    },
    {
        id: 'p-salate-frisch',
        category: 'salate',
        title: 'Frische Salate',
        price: 'Tagespreis',
        image: 'https://images.unsplash.com/photo-1622205313162-be1d5712a43f?q=80&w=600&auto=format&fit=crop',
        tag: 'Saisonbedingt',
        desc: 'Frisch vom Feld.',
        varieties: [
            { name: 'Ackersalat (Feldsalat)', stock: 500 },
            { name: 'Frischer Kopfsalat', stock: 20 },
            { name: 'Blattsalat Mix', stock: 0 }
        ]
    },
    {
        id: 'p-kartoffel',
        category: 'gemuese',
        title: 'Speisekartoffeln',
        price: 'Tagespreis',
        image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=600&auto=format&fit=crop',
        tag: 'Dauerhaft',
        desc: 'Festkochende und mehlige Sorten.',
        varieties: [
            { name: 'Festkochend 12,5kg', stock: 50 },
            { name: 'Festkochend 25kg', stock: 20 },
            { name: 'Mehligkochend 12,5kg', stock: 10 },
            { name: 'Mehligkochend 25kg', stock: 5 }
        ]
    },
    {
        id: 'p-zwiebel',
        category: 'gemuese',
        title: 'Zwiebeln',
        price: 'Tagespreis',
        image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?q=80&w=600&auto=format&fit=crop',
        tag: 'Dauerhaft',
        desc: 'Im Netz.',
        varieties: [
            { name: 'Haushaltszwiebeln (Netz)', stock: 100 },
            { name: 'Metzgerzwiebeln (Netz)', stock: 30 }
        ]
    },
    {
        id: 'p-apfel',
        category: 'gemuese',
        title: 'Äpfel',
        price: '1,50 € / kg',
        image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?q=80&w=600&auto=format&fit=crop',
        tag: 'Saisonbedingt',
        desc: 'Knackige Sorten aus der Region.',
        varieties: [
            { name: 'Jonagold', stock: 50 },
            { name: 'Delba', stock: 0 },
            { name: 'Elstar', stock: 30 },
            { name: 'Boskoop', stock: 10 },
            { name: 'Gala', stock: 40 }
        ]
    },
    {
        id: 'p-wurst',
        category: 'wurst',
        title: 'Dosenwurst',
        price: '4,20 € / Dose',
        image: 'https://images.unsplash.com/photo-1551462147-37885acc36f1?q=80&w=600&auto=format&fit=crop',
        tag: 'Dauerhaft',
        desc: 'Hausmacher Qualität (300g).',
        varieties: [
            { name: 'Schinkenwurst', stock: 20 },
            { name: 'Bauernwurst', stock: 15 },
            { name: 'Bratwurst', stock: 5 },
            { name: 'Blutwurst', stock: 10 },
            { name: 'Leberwurst', stock: 0 },
            { name: 'Schwartenmagen', stock: 8 },
            { name: 'Lyoner', stock: 25 }
        ]
    },
    {
        id: 'p-kaese',
        category: 'kaese',
        title: 'Bergkäse',
        price: 'ca. 2,00 € / 100g',
        image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?q=80&w=600&auto=format&fit=crop',
        tag: 'Dauerhaft',
        desc: 'Würziger Käse am Stück.',
        varieties: [
            { name: 'Bergkäse (Stück)', stock: 0 }
        ]
    },
    {
        id: 'p-rotwein',
        category: 'weine',
        title: 'Wein',
        price: '6,50 € / 0,75l',
        image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=600&auto=format&fit=crop',
        tag: 'Dauerhaft',
        desc: 'Erlesene Rotweine aus eigenem Anbau und der Region.',
        varieties: [
            { name: 'Curvee', stock: 15 },
            { name: 'Regent', stock: 5 }, // Wenig auf Lager (wird gelb angezeigt)
            { name: 'Johaniter', stock: 12 },
            { name: 'Regent Barrique', stock: 0 } // Ausverkauft (wird rot durchgestrichen)
        ]
    },
    {
        id: 'p-weinbrand',
        category: 'weine',
        title: 'Weinbrand',
        price: '8,00 € / 0,2l',
        image: 'https://images.unsplash.com/photo-1569937756447-e1988bf04dd4?q=80&w=600&auto=format&fit=crop',
        tag: 'Dauerhaft',
        desc: 'Feiner Tropfen.',
        varieties: [
            { name: 'Weinbrand 0,2l', stock: 12 }
        ]
    },
    {
        id: 'p-erde',
        category: 'erde',
        title: 'Pflanzerde',
        price: 'ab 16,00 €',
        image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=600&auto=format&fit=crop',
        tag: 'Dauerhaft',
        desc: 'Qualitätserde.',
        varieties: [
            { name: 'Pflanzerde 70L', stock: 100 }
        ]
    }
];
