# SQLTrain

**Source version / Version im Code:** `v0.1.0`

## English

SQLTrain is an interactive, browser-based environment for learning, practicing, and testing SQL with a real SQLite database.

It combines a SQL workbench, database management tools, 100 guided SQL lessons, and a 20-level SQL Murder Mystery campaign with 100 investigation tasks.

## Quick start

```bash
git clone https://github.com/Eige90/SQLtrain.git
cd SQLtrain
npm install
npm run dev
```

Open http://localhost:3000.

## GitHub Pages (external availability not verified)

- Project URL: https://eige90.github.io/SQLtrain/

## Features

### SQL Workbench

- Monaco-based SQL editor
- Execute `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `CREATE`, `ALTER`, and `DROP`
- Query result viewer
- Northwind-style training database
- Restore the original database at any time

### Database Manager

- Inspect tables and records
- Add, edit, and delete rows
- Create and delete tables
- Browse large tables with pagination
- Manage table relationships and foreign keys
- Responsive dialogs and controls for mobile, tablet, laptop, and desktop

### Excel and CSV Import

SQLTrain can import local files directly in the browser:

- XLSX
- legacy XLS
- CSV
- UTF-8 CSV
- UTF-8 CSV with BOM
- semicolon-separated CSV exports
- Windows-1252 CSV files
- quoted CSV values, commas, Unicode characters, and empty values
- workbooks with multiple worksheets
- create, append, and replace import modes

Imported files stay on the device and are not uploaded to a server.

### 100 SQL Lessons

- 100 guided SQL lessons
- automatic query validation
- lesson progress stored locally in the browser
- XP, streaks, and badges
- SQL Pro completion state
- Murder Mystery unlock after Lesson 10

### SQL Murder Mystery

**The Night Train to Bern**

- 20 connected mystery levels
- 5 SQL tasks per level
- 100 investigation tasks in total
- isolated Mystery database
- hints and solutions
- evidence collection
- suspect board and investigation funnel
- persistent progress in browser storage
- final Case Closed / Master Detective sequence

The normal SQLTrain database remains separate from the Mystery database.

## Privacy

SQLTrain is designed to run locally in the browser.

- SQL execution happens in browser-based SQLite WebAssembly
- imported Excel and CSV files remain on the user's device
- no application backend is required for the training database
- persistent SQLite storage uses browser storage when supported
- a temporary in-memory fallback is used when persistent browser storage is unavailable

## How to start SQLTrain locally

### 1. Clone the repository

```bash
git clone https://github.com/Eige90/SQLtrain.git
cd SQLtrain
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Production build

Create the static production build with:

```bash
npm run build
```

The exported site is generated in:

```text
out/
```

## Tests and quality checks

Run ESLint:

```bash
npm run lint
```

Run the production build:

```bash
npm run build
```

Run responsive Playwright tests:

```bash
npm run test:responsive
```

Run the functional Chromium tests:

```bash
npm run test:functional
```

Run the full project test command:

```bash
npm run test:all
```

The E2E suite includes responsive database workflows, real CSV/XLS/XLSX imports, CRUD operations, relationship creation, long table and column names, lesson layouts, and complete Murder Mystery workflows up to Task 100 and Case Closed.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- SQLite WebAssembly
- Monaco Editor
- SheetJS
- Playwright
- Wrangler
- GitHub Pages

## Architecture

SQLTrain uses a static Next.js export and does not require a traditional application server.

The training database runs in the browser through SQLite WebAssembly. Persistent storage is used when the browser supports the required APIs, with a memory fallback for unsupported environments.

## Project status

SQLTrain currently includes:

- 100 normal SQL lessons
- 20 Murder Mystery levels
- 100 Murder Mystery SQL tasks
- responsive database management
- local Excel/CSV import
- persistent lesson and Mystery progress
- automated functional and responsive E2E coverage

## Author

Built by [Eige90](https://github.com/Eige90).

---


## Roadmap / Open verification items

- [ ] Run and record lint, production build and browser end-to-end tests for the current commit.
- [ ] Confirm the published GitHub Pages build matches source.
- [ ] Choose a release version after acceptance tests; package.json currently reports v0.1.0.

# SQLTrain – Deutsch

SQLTrain ist eine interaktive, browserbasierte Umgebung zum Lernen, Üben und Testen von SQL mit einer echten SQLite-Datenbank.

Das Projekt kombiniert eine SQL-Arbeitsumgebung, Datenbankverwaltung, 100 geführte SQL-Lektionen und eine SQL-Murder-Mystery-Kampagne mit 20 Levels und insgesamt 100 Ermittlungsaufgaben.

## Schnellstart

```bash
git clone https://github.com/Eige90/SQLtrain.git
cd SQLtrain
npm install
npm run dev
```

Anschließend http://localhost:3000 öffnen.

## GitHub Pages (Erreichbarkeit extern nicht bestätigt)

- Projektadresse: https://eige90.github.io/SQLtrain/

## Funktionen

### SQL Workbench

- SQL-Editor auf Basis von Monaco
- Ausführen von `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `CREATE`, `ALTER` und `DROP`
- Anzeige von Abfrageergebnissen
- Northwind-ähnliche Trainingsdatenbank
- Wiederherstellung der ursprünglichen Datenbank jederzeit möglich

### Datenbank-Manager

- Tabellen und Datensätze anzeigen
- Datensätze hinzufügen, bearbeiten und löschen
- Tabellen erstellen und löschen
- große Tabellen mit Seitennavigation durchsuchen
- Tabellenbeziehungen und Fremdschlüssel verwalten
- responsive Dialoge und Bedienelemente für Smartphone, Tablet, Laptop und Desktop

### Excel- und CSV-Import

SQLTrain kann lokale Dateien direkt im Browser importieren:

- XLSX
- ältere XLS-Dateien
- CSV
- UTF-8-CSV
- UTF-8-CSV mit BOM
- mit Semikolon getrennte CSV-Exporte
- Windows-1252-CSV-Dateien
- CSV-Werte mit Anführungszeichen, Kommas, Unicode-Zeichen und leeren Feldern
- Arbeitsmappen mit mehreren Tabellenblättern
- Importmodi Erstellen, Anhängen und Ersetzen

Importierte Dateien bleiben auf dem Gerät und werden nicht auf einen Server hochgeladen.

### 100 SQL-Lektionen

- 100 geführte SQL-Lektionen
- automatische Validierung der Abfragen
- lokaler Lernfortschritt im Browser
- XP, Serien und Badges
- SQL-Pro-Abschlussstatus
- Freischaltung des Murder Mystery nach Lektion 10

### SQL Murder Mystery

**The Night Train to Bern**

- 20 zusammenhängende Mystery-Levels
- 5 SQL-Aufgaben pro Level
- insgesamt 100 Ermittlungsaufgaben
- isolierte Mystery-Datenbank
- Hinweise und Lösungen
- Beweissammlung
- Verdächtigenübersicht und Ermittlungsverlauf
- dauerhafter Fortschritt im Browser-Speicher
- finales Case Closed / Master Detective

Die normale SQLTrain-Datenbank bleibt von der Mystery-Datenbank getrennt.

## Datenschutz

SQLTrain ist so konzipiert, dass es lokal im Browser ausgeführt wird.

- SQL wird über SQLite WebAssembly direkt im Browser ausgeführt
- importierte Excel- und CSV-Dateien bleiben auf dem Gerät
- für die Trainingsdatenbank ist kein Anwendungs-Backend erforderlich
- persistente SQLite-Speicherung nutzt den Browser-Speicher, sofern unterstützt
- wenn persistente Speicherung nicht verfügbar ist, wird auf eine temporäre In-Memory-Datenbank zurückgegriffen

## SQLTrain lokal starten

### 1. Repository klonen

```bash
git clone https://github.com/Eige90/SQLtrain.git
cd SQLtrain
```

### 2. Abhängigkeiten installieren

```bash
npm install
```

### 3. Entwicklungsserver starten

```bash
npm run dev
```

Danach im Browser öffnen:

```text
http://localhost:3000
```

## Produktions-Build

Den statischen Produktions-Build erstellen mit:

```bash
npm run build
```

Die exportierte Website wird erzeugt unter:

```text
out/
```

## Tests und Qualitätsprüfungen

ESLint ausführen:

```bash
npm run lint
```

Produktions-Build prüfen:

```bash
npm run build
```

Responsive Playwright-Tests ausführen:

```bash
npm run test:responsive
```

Funktionale Chromium-Tests ausführen:

```bash
npm run test:functional
```

Den vollständigen Projekt-Testbefehl ausführen:

```bash
npm run test:all
```

Die E2E-Tests umfassen responsive Datenbank-Workflows, echte CSV/XLS/XLSX-Importe, CRUD-Funktionen, das Erstellen von Beziehungen, lange Tabellen- und Spaltennamen, Lektionen sowie vollständige Murder-Mystery-Workflows bis Aufgabe 100 und Case Closed.

## Tech-Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- SQLite WebAssembly
- Monaco Editor
- SheetJS
- Playwright
- Wrangler
- GitHub Pages

## Architektur

SQLTrain verwendet einen statischen Next.js-Export und benötigt keinen klassischen Anwendungsserver.

Die Trainingsdatenbank läuft über SQLite WebAssembly direkt im Browser. Persistenter Speicher wird genutzt, wenn der Browser die erforderlichen APIs unterstützt. Andernfalls wird eine In-Memory-Variante verwendet.

## Projektstatus

SQLTrain enthält aktuell:

- 100 normale SQL-Lektionen
- 20 Murder-Mystery-Levels
- 100 Murder-Mystery-SQL-Aufgaben
- responsive Datenbankverwaltung
- lokalen Excel-/CSV-Import
- persistenten Lern- und Mystery-Fortschritt
- automatisierte funktionale und responsive E2E-Abdeckung

## Autor

Erstellt von [Eige90](https://github.com/Eige90).

## Roadmap / Offene Prüfpunkte

- [ ] Lint, Produktions-Build und Browser-End-to-End-Tests für den aktuellen Commit ausführen und dokumentieren.
- [ ] Abgleich der GitHub-Pages-Version mit dem Quellcode.
- [ ] Nach Abnahmetests Release-Version festlegen; package.json nennt derzeit v0.1.0.


## GitHub Pages / Website status

**Project URL (availability not independently confirmed):** https://eige90.github.io/SQLtrain/

**English:** Static Next.js export documented; live URL in README. HTTP reachability could not be confirmed in this review.

**Deutsch:** Statischer Next.js-Export dokumentiert; Live-Link bereits in der README. HTTP-Erreichbarkeit konnte bei dieser Prüfung nicht bestätigt werden.
