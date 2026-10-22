# SQLTrain

SQLTrain is an interactive, browser-based environment for learning, practicing, and testing SQL with a real SQLite database.

It combines a SQL workbench, database management tools, 100 guided SQL lessons, and a 20-level SQL Murder Mystery campaign with 100 investigation tasks.

## Live versions

- GitHub Pages: https://eige90.github.io/SQLtrain/
- Cloudflare: https://sqltrain.sqltrain-app.workers.dev/

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

To preview the Next.js development version locally, use `npm run dev`.

## Deploy to Cloudflare

The repository contains a `wrangler.jsonc` configuration for static assets.

Build and deploy with:

```bash
npm run build
npx wrangler deploy
```

Cloudflare authentication must already be configured for the account performing the deployment.

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

The E2E suite includes responsive database workflows, real CSV/XLS/XLSX imports, CRUD operations, relationship creation, long table/column names, lesson layouts, and complete Murder Mystery workflows up to Task 100 and Case Closed.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- SQLite WebAssembly
- Monaco Editor
- SheetJS
- Playwright
- Wrangler / Cloudflare Workers static assets
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
