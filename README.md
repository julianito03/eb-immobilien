# EB Immobilien – Website

Bilinguale (Deutsch/Englisch) Website für **EB Immobilien – Elida Besic**,
Immobilienmaklerin in Heidelberg. Statische Website (HTML/CSS/JS) mit einem
eingebauten CMS, gehostet kostenlos über **GitHub Pages**.

**Live:** https://julianito03.github.io/eb-immobilien/
**CMS:** https://julianito03.github.io/eb-immobilien/admin/ — siehe [CMS-SETUP.md](CMS-SETUP.md)

## Aufbau
- `index.html` und die Unterseiten (`immobilien`, `verkaufen`, `kaufen`,
  `bewertung`, `ueber-mich`, `kontakt`, `impressum`, `datenschutz`)
- `assets/` – Stylesheet, Skripte und Bilder
  - `i18n.js` – Sprachumschaltung DE/EN (Texte stehen per `data-en` im HTML)
  - `site.js` – gemeinsamer Header/Footer, Formulare, Animationen
  - `content.js` – rendert CMS-Inhalte aus `content/*.json`
- `content/` – vom CMS verwaltete Inhalte (`listings.json`, `about.json`, `site.json`)
- `admin/` – Sveltia CMS (Konfiguration in `config.yml`)

## Lokal ansehen
```bash
cd eb-immobilien
python3 -m http.server 8000
# dann http://localhost:8000 öffnen
```
(Ein lokaler Server ist nötig, weil die Seite Inhalte per `fetch` aus `content/` lädt.)

## Bearbeiten
Inhalte über das CMS unter `/admin/` pflegen – keine Programmierkenntnisse nötig.
Details in [CMS-SETUP.md](CMS-SETUP.md).
