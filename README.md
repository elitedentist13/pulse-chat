# Kith

A membership first. Then a pet daybook. Notes second.

The first screen is **Sign in** or **Create membership**. A new slip asks for real name, display name, phone, and date of birth. Each line can be **shown** or **hidden** from other chairs at the table. Creating a membership also opens a Notes account with the desk, so the slip is filed inside the app.

Each companion has a **profile** — name, nickname, date of birth, origin, traits, features, favourite food, fears, special notes, remarks, and medical remarks — plus a year of pages: text, photos, and short videos, any day, 365 around. A **story** has a first day and an end date. You write until that last day, close it, and export a memorial booklet as a PDF.

Clips stay short: **15 seconds** and **8 MB**. They sit in the same three slots as photos. The booklet uses a still from the clip.

**Care** is split into subtabs. Visits, blood, receipts, prescriptions, grooming, and food each keep a strip of photos and short clips — date and caption on every slip, add or delete freely. Preventatives and the bowl sit on their own tabs. **Talent** is the list of what they can do: stand, give a hand, make a sound.

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

## Live tests

With the app serving on port 43217, Chrome, and `puppeteer-core` available:

```bash
npm run test:live
```

That run covers HTTP/API status checks, CDP `Runtime.evaluate` against the live page, smoke of the shell, spot checks of Profile / Care / Talent / i18n, and client flows (lightbox save, 15s video cap, porch, notes, hall).

## What you can do

- Sign in or create a membership (real name, display name, phone, date of birth)
- Hide or show each of those fields from others, then change it later from the Notes account
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
