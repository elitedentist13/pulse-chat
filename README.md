# Kith

A pet daybook first. Notes second.

Each companion has a profile and a year of pages — text and photos, any day, 365 around. A **story** has a first day and an end date. You write until that last day, close it, and export a memorial booklet as a PDF.

Public pages can sit on the **porch**, shuffled so they arrive as neighbors, not a feed. Private pages stay in the drawer. From a porch page you can write to the keeper, or carry the page into **notes** — the old Kith table, now an adjunct.

## Run locally

```bash
npm install
npm run dev -- --port 43217
```

Then open [http://localhost:43217](http://localhost:43217).

```bash
npm run build
npm start -- --port 43217
```

## What you can do

- Open Juniper’s daybook and write any day of the year
- Pin up to three photos on a page
- Keep the page in the drawer or put it on the porch
- Open a new story with an end date
- Close the story and export a memorial booklet (PDF)
- Shuffle the porch and write to someone from a public page
- Use Notes when a page needs a conversation

## Stack

Next.js, TypeScript, Tailwind CSS, shadcn/ui, jsPDF. State lives in React and `localStorage`.
