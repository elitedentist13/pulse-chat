# Kith

A messenger that treats a conversation like sitting down, not checking a phone. One person (or one room) on the table. Everyone else waits in the index.

Kith reuses a working chat engine — seeded people, live demo replies, moods, rooms, keep/quiet/file — and throws out the WhatsApp chrome: no green bubbles, no double ticks, no story rings.

The **Hall** is not a public hobby internet. It is the same table, partitioned into standing rooms:

- **Craft** — making things with other people
- **Body** — moving, cooking, showing up
- **Kin** — family and the people who keep a plate
- **Work** — clients, briefs, and the quiet timeline

Open stays people. Waiting is anyone unread. Hall is the shelves.

## Run locally

```bash
npm install
npm run dev -- --port 43217
```

Then open [http://localhost:43217](http://localhost:43217).

For a production build:

```bash
npm run build
npm start -- --port 43217
```

## What you can do

- Sit with Maya, Jordan, or anyone waiting on the table
- Open the Hall and pick Palette desk, Saturday court, Trail notes, Family Sunday, or Studio cut
- Send a note — the person who cares about that topic writes back
- Double-click a note to leave a heart
- Read moods along the top of the table
- Pull up a chair for Sam Rivera
- Keep, quiet, file away, or tear up a conversation
- Reset the table from the menu

## Stack

Next.js, TypeScript, Tailwind CSS, and shadcn/ui. Conversation state lives in React and `localStorage`.
