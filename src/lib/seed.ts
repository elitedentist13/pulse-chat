import type { Chat, Contact, Message, MessengerSnapshot, StatusUpdate } from "@/lib/types"

const YOU_ID = "you"

const colors = {
  teal: "#0a7c66",
  moss: "#1f6f54",
  ocean: "#1b6b93",
  plum: "#6b4c9a",
  rust: "#b85c38",
  clay: "#9a4d4d",
  pine: "#2f6b4f",
  dusk: "#3d5a80",
  gold: "#b0892e",
  slate: "#4d6a7a",
}

function contact(
  partial: Omit<Contact, "initials"> & { initials?: string }
): Contact {
  const initials =
    partial.initials ??
    partial.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  return { ...partial, initials }
}

export function createSeedSnapshot(now = Date.parse("2026-09-21T16:00:00.000Z")): MessengerSnapshot {
  const minutes = (n: number) => now - n * 60_000
  const hours = (n: number) => now - n * 3_600_000
  const days = (n: number) => now - n * 86_400_000

  const you = contact({
    id: YOU_ID,
    name: "Michael Ng",
    phone: "+1 (415) 555-0148",
    about: "Available",
    color: colors.teal,
    online: true,
    lastSeen: now,
    replyBank: [],
    initials: "MN",
    interests: ["craft", "work"],
  })

  const maya = contact({
    id: "maya",
    name: "Maya Chen",
    phone: "+1 (628) 555-0192",
    about: "Designing in public. Coffee > meetings.",
    color: colors.plum,
    online: true,
    lastSeen: now,
    replyBank: [
      "On it — I’ll drop a tighter mock after lunch.",
      "Love that. Let’s ship the quieter version.",
      "Can you glance at the spacing on the composer?",
      "Yes. I’ll ping you when the palette is locked.",
    ],
    interests: ["craft", "design", "palette", "mock", "composer"],
  })

  const jordan = contact({
    id: "jordan",
    name: "Jordan Hale",
    phone: "+1 (510) 555-0114",
    about: "Always down for a trail.",
    color: colors.ocean,
    online: false,
    lastSeen: minutes(38),
    replyBank: [
      "Bet. I’ll grab snacks on the way.",
      "Sunrise start still good?",
      "Leave the extra layer in the car just in case.",
      "Haha ok ok I’ll actually set an alarm.",
    ],
    interests: ["body", "trail", "wind", "stove", "alarm"],
  })

  const priya = contact({
    id: "priya",
    name: "Priya Shah",
    phone: "+1 (408) 555-0177",
    about: "Call me if you’re running late.",
    color: colors.rust,
    online: false,
    lastSeen: hours(3),
    replyBank: [
      "Auntie already asked if you’re bringing that salad.",
      "Come whenever — door’s open.",
      "I’ll save you a plate if traffic is awful.",
      "Yes, dad is grilling. Don’t skip this one.",
    ],
    interests: ["kin", "lunch", "salad", "limes", "family"],
  })

  const luca = contact({
    id: "luca",
    name: "Luca Rossi",
    phone: "+39 02 555 4410",
    about: "Studio hours 10–6 CET",
    color: colors.gold,
    online: false,
    lastSeen: hours(1.4),
    replyBank: [
      "Invoice is ready whenever you are.",
      "Perfect. I’ll send the revised cut tonight.",
      "Can we keep the brand mark a little quieter?",
      "Noted — I’ll adjust the timeline.",
    ],
    interests: ["work", "craft", "cut", "invoice", "title"],
  })

  const aisha = contact({
    id: "aisha",
    name: "Aisha Okonkwo",
    phone: "+1 (347) 555-0160",
    about: "Shipping > talking about shipping.",
    color: colors.pine,
    online: true,
    lastSeen: now,
    replyBank: [
      "PR looks clean. I’ll merge after tests.",
      "Want me to pair on the unread badge?",
      "That edge case is real — I’ll add a fixture.",
      "Done. Check the latest commit.",
    ],
    interests: ["craft", "code", "tests", "badge", "fixture"],
  })

  const noah = contact({
    id: "noah",
    name: "Noah Patel",
    phone: "+1 (917) 555-0133",
    about: "Don’t finish the oat milk.",
    color: colors.dusk,
    online: false,
    lastSeen: minutes(12),
    replyBank: [
      "I’ll grab limes too.",
      "We’re out of dish tabs, fyi.",
      "Leaving the spare key under the plant.",
      "Movie night still on if you’re home by 8.",
    ],
    interests: ["kin", "body", "court", "pump", "water"],
  })

  const elena = contact({
    id: "elena",
    name: "Elena Voss",
    phone: "+49 30 555 8821",
    about: "In a meeting · Berlin",
    color: colors.clay,
    online: false,
    lastSeen: hours(5),
    replyBank: [
      "Sorry — just got out of the call.",
      "Can we move this to Thursday morning?",
      "I’ll send the deck after I land.",
      "That works. Thank you for waiting.",
    ],
    interests: ["work", "briefing", "board", "deck"],
  })

  const sam = contact({
    id: "sam",
    name: "Sam Rivera",
    phone: "+1 (323) 555-0188",
    about: "Saving a chair at the table.",
    color: colors.slate,
    online: false,
    lastSeen: days(2),
    replyBank: [
      "Hey! Good to hear from you.",
      "Let’s catch up this week.",
      "Send me the address and I’ll be there.",
      "Sounds great.",
    ],
    interests: ["body", "court", "trail", "parking"],
  })

  const drPatel = contact({
    id: "dr-patel",
    name: "Dr. Anika Patel",
    phone: "+1 (650) 555-0108",
    about: "Office: weekdays 9–5",
    color: colors.moss,
    online: false,
    lastSeen: days(1),
    replyBank: [
      "You’re all set. See you then.",
      "Please arrive 10 minutes early.",
      "We can hold the Friday slot if that helps.",
      "Confirmed.",
    ],
    interests: ["work"],
  })

  const contacts: Contact[] = [
    you,
    maya,
    jordan,
    priya,
    luca,
    aisha,
    noah,
    elena,
    sam,
    drPatel,
  ]

  const chats: Chat[] = [
    {
      id: "chat-maya",
      kind: "direct",
      title: maya.name,
      contactId: maya.id,
      participantIds: [YOU_ID, maya.id],
      pinned: true,
      muted: false,
      archived: false,
      unread: 0,
      typingContactId: null,
    },
    {
      id: "chat-jordan",
      kind: "direct",
      title: jordan.name,
      contactId: jordan.id,
      participantIds: [YOU_ID, jordan.id],
      pinned: true,
      muted: false,
      archived: false,
      unread: 1,
      typingContactId: null,
    },
    {
      id: "chat-volleyball",
      kind: "group",
      title: "Saturday court",
      participantIds: [YOU_ID, aisha.id, jordan.id, noah.id, sam.id],
      pinned: false,
      muted: false,
      archived: false,
      unread: 3,
      typingContactId: null,
      topic: "body",
      blurb: "Weekend games, rotating snacks, no excuses.",
    },
    {
      id: "chat-palette",
      kind: "group",
      title: "Palette desk",
      participantIds: [YOU_ID, maya.id, aisha.id],
      pinned: false,
      muted: false,
      archived: false,
      unread: 1,
      typingContactId: null,
      topic: "craft",
      blurb: "The kit lives here — mocks, badges, and the quieter green.",
    },
    {
      id: "chat-trail",
      kind: "group",
      title: "Trail notes",
      participantIds: [YOU_ID, jordan.id, sam.id],
      pinned: false,
      muted: false,
      archived: false,
      unread: 0,
      typingContactId: null,
      topic: "body",
      blurb: "Dawn starts, rude wind, extra layers in the car.",
    },
    {
      id: "chat-sunday",
      kind: "group",
      title: "Family Sunday",
      participantIds: [YOU_ID, priya.id, noah.id],
      pinned: false,
      muted: false,
      archived: false,
      unread: 0,
      typingContactId: null,
      topic: "kin",
      blurb: "Dad already bought too much. Come early and bring citrus.",
    },
    {
      id: "chat-studio",
      kind: "group",
      title: "Studio cut",
      participantIds: [YOU_ID, luca.id, elena.id],
      pinned: false,
      muted: false,
      archived: false,
      unread: 2,
      typingContactId: null,
      topic: "work",
      blurb: "Title cards, invoices, and the briefing that keeps moving.",
    },
    {
      id: "chat-priya",
      kind: "direct",
      title: priya.name,
      contactId: priya.id,
      participantIds: [YOU_ID, priya.id],
      pinned: false,
      muted: false,
      archived: false,
      unread: 0,
      typingContactId: null,
    },
    {
      id: "chat-aisha",
      kind: "direct",
      title: aisha.name,
      contactId: aisha.id,
      participantIds: [YOU_ID, aisha.id],
      pinned: false,
      muted: false,
      archived: false,
      unread: 0,
      typingContactId: null,
    },
    {
      id: "chat-luca",
      kind: "direct",
      title: luca.name,
      contactId: luca.id,
      participantIds: [YOU_ID, luca.id],
      pinned: false,
      muted: false,
      archived: false,
      unread: 0,
      typingContactId: null,
    },
    {
      id: "chat-noah",
      kind: "direct",
      title: noah.name,
      contactId: noah.id,
      participantIds: [YOU_ID, noah.id],
      pinned: false,
      muted: true,
      archived: false,
      unread: 0,
      typingContactId: null,
    },
    {
      id: "chat-elena",
      kind: "direct",
      title: elena.name,
      contactId: elena.id,
      participantIds: [YOU_ID, elena.id],
      pinned: false,
      muted: false,
      archived: false,
      unread: 2,
      typingContactId: null,
    },
  ]

  const messages: Message[] = [
    m("m1", "chat-maya", maya.id, "Can you look at the composer before we lock the kit?", hours(6), "read"),
    m("m2", "chat-maya", YOU_ID, "Yes — the send button still feels a pixel high.", hours(5.8), "read"),
    m("m3", "chat-maya", maya.id, "I’ll nudge it down and mute the icon a bit.", hours(5.7), "read"),
    m("m4", "chat-maya", YOU_ID, "If the unread badge can sit on the avatar, even better.", hours(5.5), "read"),
    m("m5", "chat-maya", maya.id, "Done. Dropped a preview in the file — tell me if the green is too loud.", minutes(18), "read"),
    m("m6", "chat-maya", YOU_ID, "That green is perfect. Ship it.", minutes(11), "read"),

    m("m7", "chat-jordan", jordan.id, "Trailhead at 6. I’m bringing the little stove.", days(1) - 2 * 3_600_000, "read"),
    m("m8", "chat-jordan", YOU_ID, "I’ll take fruit and the first-aid kit.", days(1) - 1.7 * 3_600_000, "read"),
    m("m9", "chat-jordan", jordan.id, "Leave an extra layer in the car. Wind is rude up there.", hours(9), "read"),
    m("m10", "chat-jordan", YOU_ID, "Set two alarms. I mean it.", hours(8.6), "read"),
    m("m11", "chat-jordan", jordan.id, "Coffee is on me if you actually show up on time.", minutes(4), "delivered"),

    m("m12", "chat-volleyball", aisha.id, "Court is booked 9–11. Don’t be that person.", hours(7), "delivered"),
    m("m13", "chat-volleyball", noah.id, "I can get there at 8:40 with balls and the pump.", hours(6.5), "delivered"),
    m("m14", "chat-volleyball", YOU_ID, "I’ll take water and the speaker.", hours(6.2), "read"),
    m("m15", "chat-volleyball", jordan.id, "If nobody claims snacks I’m grabbing oranges.", hours(2), "delivered"),
    m("m16", "chat-volleyball", sam.id, "Wait we moved it to the lakeside courts, right?", minutes(22), "delivered"),
    m("m17", "chat-volleyball", aisha.id, "Yes. Same time, new nets. Wear something you can slide in.", minutes(16), "delivered"),

    m("m36", "chat-palette", maya.id, "Can we keep the mock in this room instead of DMs?", hours(8), "read"),
    m("m37", "chat-palette", YOU_ID, "Yes. Palette lives here.", hours(7.6), "read"),
    m("m38", "chat-palette", aisha.id, "I’ll drop the badge fixture once Maya ships spacing.", minutes(28), "delivered"),

    m("m39", "chat-trail", jordan.id, "Wind advisory for Saturday. Extra layer in the car.", hours(11), "read"),
    m("m40", "chat-trail", YOU_ID, "Stove still coming?", hours(10.5), "read"),
    m("m41", "chat-trail", sam.id, "I can meet at the lower lot if parking is full.", hours(3), "read"),

    m("m42", "chat-sunday", priya.id, "Dad bought too much again. Come early.", days(1), "read"),
    m("m43", "chat-sunday", YOU_ID, "Citrus salad and limes.", hours(22), "read"),
    m("m44", "chat-sunday", noah.id, "I’ll bring sparkling water. Priya already claimed me.", hours(16), "read"),

    m("m45", "chat-studio", luca.id, "Title card still eight frames short.", hours(12), "delivered"),
    m("m46", "chat-studio", YOU_ID, "I’ll put the export in this room this afternoon.", hours(11.4), "read"),
    m("m47", "chat-studio", elena.id, "Board overran. Can the briefing live here instead of a separate thread?", minutes(70), "delivered"),

    m("m18", "chat-priya", priya.id, "Sunday lunch is at 1. Dad already bought too much.", days(2), "read"),
    m("m19", "chat-priya", YOU_ID, "I’ll bring the citrus salad. Need anything from the store?", days(2) + 3_600_000, "read"),
    m("m20", "chat-priya", priya.id, "Limes and whatever sparkling water is on sale.", hours(26), "read"),
    m("m21", "chat-priya", YOU_ID, "Got it. I’ll come early and help set up.", hours(20), "read"),

    m("m22", "chat-aisha", aisha.id, "Unread counts were off by one if you archived then unarchived.", hours(10), "read"),
    m("m23", "chat-aisha", YOU_ID, "Reproduced. I’ll patch the reducer tonight.", hours(9.6), "read"),
    m("m24", "chat-aisha", aisha.id, "Nice. Leave a note in the PR about the typing timeout too.", hours(4), "read"),
    m("m25", "chat-aisha", YOU_ID, "Will do. Tests are in.", minutes(90), "read"),

    m("m26", "chat-luca", luca.id, "Cut looks strong. Can the title card sit 8 frames longer?", days(3), "read"),
    m("m27", "chat-luca", YOU_ID, "Easy. I’ll send a new export this afternoon.", days(3) + 40 * 60_000, "read"),
    m("m28", "chat-luca", luca.id, "Invoice is attached in email. No rush — whenever finance is ready.", hours(30), "read"),
    m("m29", "chat-luca", YOU_ID, "Forwarded. They usually turn it around in two days.", hours(28), "read"),

    m("m30", "chat-noah", noah.id, "Did you finish the oat milk or is the carton just theatrical?", hours(14), "read"),
    m("m31", "chat-noah", YOU_ID, "There was like a sip. I’ll replace it.", hours(13.5), "read"),
    m("m32", "chat-noah", noah.id, "Grab limes if you pass the market. Priya asked too, apparently.", minutes(200), "read"),

    m("m33", "chat-elena", YOU_ID, "Are we still good for the Thursday briefing?", days(1), "read"),
    m("m34", "chat-elena", elena.id, "I may need to push it. Board call overran.", hours(8), "delivered"),
    m("m35", "chat-elena", elena.id, "Can we do Friday 9:30 Berlin time instead?", minutes(55), "delivered"),
  ]

  const statuses: StatusUpdate[] = [
    {
      id: "st-you",
      contactId: YOU_ID,
      text: "Keeping one conversation in the room at a time.",
      createdAt: hours(5),
      viewed: true,
      accent: colors.teal,
    },
    {
      id: "st-maya",
      contactId: maya.id,
      text: "Locking the palette tonight. Green stays.",
      createdAt: minutes(40),
      viewed: false,
      accent: colors.plum,
    },
    {
      id: "st-jordan",
      contactId: jordan.id,
      text: "Trailhead at 6. No, I will not snooze.",
      createdAt: hours(2),
      viewed: false,
      accent: colors.ocean,
    },
    {
      id: "st-aisha",
      contactId: aisha.id,
      text: "Tests are green. I’m going outside.",
      createdAt: minutes(95),
      viewed: false,
      accent: colors.pine,
    },
  ]

  return { youId: YOU_ID, contacts, chats, messages, statuses }
}

function m(
  id: string,
  chatId: string,
  senderId: string,
  text: string,
  sentAt: number,
  status: Message["status"]
): Message {
  return { id, chatId, senderId, text, sentAt, status }
}
