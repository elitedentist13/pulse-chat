# Kith

A pet daybook first. Notes second.

Each companion has a **profile** — name, nickname, date of birth, origin, traits, features, favourite food, fears, special notes, remarks, and medical remarks — plus a year of pages: text, photos, and short videos, any day, 365 around. A **story** has a first day and an end date. You write until that last day, close it, and export a memorial booklet as a PDF.

Clips stay short: **15 seconds** and **8 MB**. They sit in the same three slots as photos. The booklet uses a still from the clip.

**Care** keeps vet visits, blood tests, receipts, prescriptions (with photos or short clips), grooming dates, food changes, favourite snacks and canned food, and tick / heartworm reminders (usually every three months). **Talent** is the list of what they can do: stand, give a hand, make a sound.

The chrome is in **English**, **Traditional Chinese**, and **Simplified Chinese**. Switch with EN / 繁 / 简. Pages you write stay in the language you wrote them.

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
- Click a portrait to change the picture
- Fill the profile: traits, features, origin, fears, food, medical remarks
- Keep medical records, receipts, prescriptions, and 3-month preventative reminders
- Write talents — stand, a paw, a sound
- Pin up to three photos or short clips on a page (clips: 15s, 8 MB)
- Keep the page in the drawer or put it on the porch
- Open a new story with an end date
- Close the story and export a memorial booklet (PDF)
- Switch the interface between English, 繁體中文, and 简体中文
- Shuffle the porch and write to someone from a public page
- Use Notes when a page needs a conversation

## Stack

Next.js, TypeScript, Tailwind CSS, shadcn/ui, jsPDF. State lives in React and `localStorage`. Short videos live in IndexedDB. Language preference is stored separately as `kith-locale`.
