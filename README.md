# Relay

A WhatsApp-style messenger that runs in the browser. Open a chat, send a message, and the other person types back. History stays in this browser — no account, no phone, no server.

Relay is the fastest way to feel out a messenger: chat list, unread badges, groups, status, pin/mute/archive, and blue ticks.

## Run locally

```bash
npm install
npm run dev -- --port 43217
```

Then open [http://localhost:43217](http://localhost:43217).

## What you can do

- Browse seeded chats (Maya, Jordan, Saturday Volleyball, and more)
- Search chats and filter All / Unread / Groups
- Send messages — contacts type, then reply
- Double-click a bubble to react
- Open status updates from the row under the header
- Start a new chat from contacts (try Sam Rivera)
- Pin, mute, archive, or delete a chat
- Reset the demo from the sidebar menu

## Stack

Next.js, TypeScript, Tailwind CSS, and shadcn/ui. Conversation state lives in React and `localStorage`.
