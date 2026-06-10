# EB Immobilien – Website-CMS (Inhalte selbst bearbeiten)

Mit dem CMS können Sie **Immobilien, Texte, Bilder und Kontaktdaten**
bearbeiten – ganz ohne Programmieren. Gespeicherte Änderungen landen
automatisch auf GitHub und die Website aktualisiert sich von selbst.

**Bearbeiten unter:** https://julianito03.github.io/eb-immobilien/admin/

Diese Variante braucht **keinen Server und keine zusätzliche Software** – nur
einen kostenlosen GitHub-Zugang.

---

## Einmal einrichten (ca. 5 Min)

### 1. Kostenloses GitHub-Konto (falls noch nicht vorhanden)
https://github.com/signup – E-Mail + Passwort, 2 Minuten.
> Den GitHub-Benutzernamen an den Administrator geben, damit er als Bearbeiter
> (Collaborator) freigeschaltet wird.

### 2. Zugangs-Token erstellen (einmalig)
1. Eingeloggt auf GitHub diese Seite öffnen:
   **https://github.com/settings/tokens?type=beta**
   (Settings → Developer settings → **Fine-grained tokens** → **Generate new token**)
2. Ausfüllen:
   - **Token name:** `EB Immobilien CMS`
   - **Expiration:** z. B. 1 Jahr (danach einfach neu erstellen)
   - **Repository access:** „Only select repositories" → **`julianito03/eb-immobilien`**
   - **Permissions → Repository permissions → Contents:** auf **Read and write** stellen
3. **Generate token** → den Token **kopieren** (beginnt mit `github_pat_…`, wird nur
   einmal angezeigt).

### 3. Im CMS anmelden
1. https://julianito03.github.io/eb-immobilien/admin/ öffnen
2. **„Sign In Using Access Token"** klicken
3. Den kopierten Token einfügen → fertig. Der Browser merkt sich die Anmeldung.

---

## So wird bearbeitet
1. `/admin/` öffnen und anmelden.
2. Links einen Bereich wählen, Werte ändern, dann oben **Save** klicken.
3. Nach ca. 1 Minute ist die Änderung live.

### Was kann bearbeitet werden?
| Bereich im CMS | Inhalt | erscheint auf |
|---|---|---|
| **Immobilien** | Objekte mit Foto, Preis, Status (verfügbar/reserviert/verkauft), Text DE/EN | Startseite & Seite „Immobilien" |
| **Über mich** | Foto, Rolle, Vorstellungstext (DE/EN) | Startseite & „Über mich" |
| **Kontakt & Standort** | Telefon, E-Mail, Adresse, Titelbild, CTA-Bild | Seitenfuß, „Kontakt", überall |

> **Zweisprachig:** Bitte – wo möglich – die deutschen *und* englischen Felder
> ausfüllen. Fehlt das englische Feld, wird automatisch der deutsche Text gezeigt.

---

## Wichtig vor dem „Live"-Gang
Diese Angaben sind aktuell **Platzhalter** und sollten ersetzt werden:
- **E-Mail-Adresse** der Agentur (`content/site.json` → `email`, derzeit
  `info@eb-immobilien.de`). An diese Adresse gehen alle Formular-Anfragen.
- **Impressum** (`impressum.html`): Umsatzsteuer-ID, § 34c GewO / Aufsichtsbehörde.
- **Datenschutz** (`datenschutz.html`): Datum und ggf. anwaltliche Prüfung.
- **Über-mich-Text** und Objekt-Beispiele durch echte Inhalte ersetzen.

---

## Hinweise
- Die Website funktioniert auch **ohne** CMS normal weiter; lädt eine Inhaltsdatei
  einmal nicht, bleibt der zuletzt gespeicherte Stand sichtbar.
- Bearbeitbare Inhalte liegen in `content/` (`listings.json`, `about.json`,
  `site.json`). Bilder werden nach `assets/img/` hochgeladen.
