# DevOps Q&A Explorer

A small Next.js site that loads a CSV of interview questions and lets you
filter it by **Module → Technology → Concept** (each filter narrows the
others), then download the filtered rows as a CSV.

Currently `public/data.csv` has 20 sample rows matching your schema so you
can see it working end to end. Swap in your real 5k-row file (same file
name and columns) and everything else works unchanged.

## Columns expected in data.csv

```
Uniq_ID, Upload_Id, Status, Company, Technology, Concept, Question,
Difficulty Level, Suggested Answer, Module
```

## Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Swap in your real data

1. Replace `public/data.csv` with your actual 5,000+ row export (keep the
   same file name and the same header row).
2. That's it — no code changes needed, since the site parses whatever is
   in that file at load time.

A couple of things worth knowing about your real file:
- Any blank cells in Module/Technology/Concept are just excluded from the
  filter dropdowns (a row with a blank Module simply won't show up under
  any Module filter, but will still show up when no Module filter is set).
- Commas/quotes/newlines inside `Question` or `Suggested Answer` are fine —
  as long as the CSV is standard-quoted (e.g. exported from Excel/Sheets/
  Google Sheets), the parser (PapaParse) handles it.
- If the file gets large (tens of MB), initial page load will be slower
  since the whole CSV is fetched client-side. For 5k rows with normal
  question/answer text this is very unlikely to be noticeable — if it ever
  becomes a problem, the fix is moving to a small database (e.g. Supabase)
  instead of a static CSV, which is a separate follow-up if you ever need it.

## Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: DevOps Q&A Explorer"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

## Deploy to Vercel

1. Go to https://vercel.com/new and import the GitHub repo you just pushed.
2. Framework preset: **Next.js** (auto-detected, no config needed).
3. Click **Deploy**.

Every push to `main` will auto-redeploy. To update the question bank later,
just replace `public/data.csv` in the repo and push — Vercel rebuilds
automatically.

## Project structure

```
app/
  layout.js       — root layout, fonts, metadata
  page.js          — main page: loads CSV, holds filter state, renders results
  globals.css      — Tailwind + base styles
components/
  MultiSelect.js   — reusable searchable multi-select dropdown
  QuestionCard.js  — numbered question card with "Click for answer" reveal
public/
  data.csv         — the question bank (replace with your real file)
```

## Notes on the filtering behaviour

- All three filters (Module, Technology, Concept) support **multiple
  selected values**.
- They cascade in both directions: picking a Module narrows the
  Technology/Concept options, but picking a Technology also narrows which
  Modules remain relevant, and so on — each dropdown's option list is
  computed from the *other two* filters' current selections.
- The free-text search box (question/company) is an extra on top of the
  three required filters, not a replacement for them.
