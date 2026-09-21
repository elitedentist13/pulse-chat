# Kith

A messenger that treats a conversation like sitting down, not checking a phone. One person (or one room) on the table. Everyone else waits in the index.

Kith reuses a working chat engine — seeded people, live demo replies, moods, rooms, keep/quiet/file — and throws out the WhatsApp chrome: no green bubbles, no double ticks, no story rings.

## Run locally

```bash
npm install
npm run dev -- --port 43217
```

Then open [http://localhost:43217](http://localhost:43217).

For a production build:

```bash
npm run build
npm start
```

## What you can do

- Sit with Maya, Jordan, the Saturday court, or anyone waiting
- Filter Open / Waiting / Rooms
- Send a note — they write back
- Double-click a note to leave a heart
- Read moods along the top of the table
- Pull up a chair for Sam Rivera
- Keep, quiet, file away, or tear up a conversation
- Reset the table from the menu

## Stack

Next.js, TypeScript, Tailwind CSS, and shadcn/ui. Conversation state lives in React and `localStorage`.
