import { paperPhoto, paperSlip } from "@/lib/paper-photo"
import type { CareRecord, DiaryEntry, Pet, PreventativeReminder, Story, Talent } from "@/lib/types"

export function createYardSeed(now: number): {
  pets: Pet[]
  entries: DiaryEntry[]
  stories: Story[]
  careRecords: CareRecord[]
  reminders: PreventativeReminder[]
  talents: Talent[]
} {
  const pets: Pet[] = [
    {
      id: "pet-juniper",
      ownerId: "you",
      name: "Juniper",
      kind: "dog",
      breed: "Rust mutt",
      birthday: "2021-03-14",
      about: "Mud on the stairs. Sleeps like a comma. Knows the word orchard.",
      color: "#b85c38",
      initials: "JU",
      nickname: "June",
      origin: "Orchard road, a crate by the gate, March 2021.",
      traits: "Patient. Theatrical about mud. Counts at the orchard tree.",
      features: "Rust coat, white chest comma, one notched ear.",
      favoriteFood: "Lamb kibble, Sunday fish tin, cheese ends.",
      fears: "The broom. Fireworks. The vacuum’s second register.",
      specialNotes: "Knows the word orchard. Sleeps like a comma on the stairs.",
      remarks: "Do not skip the extra layer on windy mornings.",
      medicalRemarks: "Limp is theater. Heartworm antigen negative April 2026.",
      favoriteSnacks: "Cheese ends, orchard apple cores, one stolen lime.",
      cannedFood: "The quiet fish tin. Not the loud chicken.",
      currentFood: "Farmers’ kibble, evening tin on Sundays.",
      portrait: paperPhoto({
        ink: "#b85c38",
        paper: "#efd3b8",
        kind: "dog",
        title: "Juniper",
      }),
    },
    {
      id: "pet-ink",
      ownerId: "maya",
      name: "Ink",
      kind: "cat",
      breed: "Black shorthair",
      birthday: "2022-08-09",
      about: "Sits on the palette. Approves only quiet greens.",
      color: "#6b4c9a",
      initials: "IN",
      nickname: "",
      origin: "",
      traits: "",
      features: "",
      favoriteFood: "",
      fears: "",
      specialNotes: "",
      remarks: "",
      medicalRemarks: "",
      favoriteSnacks: "Butter from a knife.",
      cannedFood: "Whatever Maya is eating.",
      currentFood: "A small bowl, twice, on the desk.",
      portrait: paperPhoto({
        ink: "#3b2a4a",
        paper: "#d9cce8",
        kind: "cat",
        title: "Ink",
      }),
    },
    {
      id: "pet-pike",
      ownerId: "jordan",
      name: "Pike",
      kind: "dog",
      breed: "Cattle dog",
      birthday: "2020-11-02",
      about: "Trail dog. Steals the extra layer. Never snoozes.",
      color: "#1b6b93",
      initials: "PK",
      nickname: "",
      origin: "",
      traits: "",
      features: "",
      favoriteFood: "",
      fears: "",
      specialNotes: "",
      remarks: "",
      medicalRemarks: "",
      favoriteSnacks: "",
      cannedFood: "",
      currentFood: "",
      portrait: paperPhoto({
        ink: "#1b6b93",
        paper: "#c5d8e4",
        kind: "dog",
        title: "Pike",
      }),
    },
    {
      id: "pet-mango",
      ownerId: "priya",
      name: "Mango",
      kind: "dog",
      breed: "Golden",
      birthday: "2019-05-18",
      about: "Keeps a plate. Will negotiate for citrus.",
      color: "#b0892e",
      initials: "MG",
      nickname: "",
      origin: "",
      traits: "",
      features: "",
      favoriteFood: "",
      fears: "",
      specialNotes: "",
      remarks: "",
      medicalRemarks: "",
      favoriteSnacks: "Citrus is a rumor. Cheese is a fact.",
      cannedFood: "",
      currentFood: "",
      portrait: paperPhoto({
        ink: "#b0892e",
        paper: "#efe0b8",
        kind: "dog",
        title: "Mango",
      }),
    },
    {
      id: "pet-byte",
      ownerId: "aisha",
      name: "Byte",
      kind: "dog",
      breed: "Border mix",
      birthday: "2023-01-30",
      about: "Ships walks before standups. Badge collector.",
      color: "#2f6b4f",
      initials: "BY",
      nickname: "",
      origin: "",
      traits: "",
      features: "",
      favoriteFood: "",
      fears: "",
      specialNotes: "",
      remarks: "",
      medicalRemarks: "",
      favoriteSnacks: "",
      cannedFood: "",
      currentFood: "",
      portrait: paperPhoto({
        ink: "#2f6b4f",
        paper: "#c9ddd0",
        kind: "dog",
        title: "Byte",
      }),
    },
    {
      id: "pet-oat",
      ownerId: "noah",
      name: "Oat",
      kind: "cat",
      breed: "Cream tabby",
      birthday: "2021-07-07",
      about: "Theatrical about milk. Leaves notes on the plant.",
      color: "#3d5a80",
      initials: "OA",
      nickname: "",
      origin: "",
      traits: "",
      features: "",
      favoriteFood: "",
      fears: "",
      specialNotes: "",
      remarks: "",
      medicalRemarks: "",
      favoriteSnacks: "",
      cannedFood: "",
      currentFood: "",
      portrait: paperPhoto({
        ink: "#8a6a3a",
        paper: "#efe6d2",
        kind: "cat",
        title: "Oat",
      }),
    },
    {
      id: "pet-nero",
      ownerId: "luca",
      name: "Nero",
      kind: "cat",
      breed: "Tuxedo",
      birthday: "2018-02-22",
      about: "Studio hours only. Sits on the title card.",
      color: "#4d6a7a",
      initials: "NR",
      nickname: "",
      origin: "",
      traits: "",
      features: "",
      favoriteFood: "",
      fears: "",
      specialNotes: "",
      remarks: "",
      medicalRemarks: "",
      favoriteSnacks: "",
      cannedFood: "",
      currentFood: "",
      portrait: paperPhoto({
        ink: "#1c1814",
        paper: "#d8d4cc",
        kind: "cat",
        title: "Nero",
      }),
    },
  ]

  const entries: DiaryEntry[] = [
    page("e-jun-newyear", "pet-juniper", "2026-01-01", now, "private", "story-orchard", "First walk of the year. She sat at the orchard gate like she was counting.", "Gate"),
    page("e-jun-rain", "pet-juniper", "2026-02-11", now, "public", "story-orchard", "Rain all morning. She chose the couch and the worst towel.", "Towel"),
    page("e-jun-bday", "pet-juniper", "2026-03-14", now, "public", "story-orchard", "Five. Cheese, a slow walk, and she fell asleep on the stairs.", "Five"),
    page("e-jun-april", "pet-juniper", "2026-04-03", now, "private", "story-orchard", "Vet said the limp is theater. I believed her anyway.", "Vet"),
    page("e-jun-solstice", "pet-juniper", "2026-06-21", now, "public", "story-orchard", "Longest light. We stayed out until the bats. She smelled like fennel.", "Fennel"),
    page("e-jun-aug", "pet-juniper", "2026-08-08", now, "public", "story-orchard", "River day. Photo before she shook. I failed.", "River"),
    page("e-jun-yest", "pet-juniper", "2026-09-20", now, "public", "story-orchard", "Mud on the stairs again. I left the note on the porch so Jordan can laugh.", "Mud"),
    page("e-jun-today", "pet-juniper", "2026-09-21", now, "private", "story-orchard", "Morning orchard loop. She waited at the same tree. I haven’t written the rest.", "Tree"),
    page("e-ink-1", "pet-ink", "2026-09-18", now, "public", "story-window", "Ink sat on the mock and refused the loud green. Correct.", "Palette"),
    page("e-ink-2", "pet-ink", "2026-07-02", now, "public", "story-window", "Window all afternoon. One bird. A whole novel.", "Sill"),
    page("e-pike-1", "pet-pike", "2026-09-19", now, "public", "story-layer", "Trailhead at 6. Pike carried the extra layer in his mouth like a flag.", "Flag"),
    page("e-pike-2", "pet-pike", "2026-05-16", now, "public", "story-layer", "Creek up to the belly. He shook on Jordan. Fair.", "Creek"),
    page("e-mango-1", "pet-mango", "2026-09-14", now, "public", "story-mango", "Sunday. Mango negotiated for the citrus salad and won.", "Citrus"),
    page("e-byte-1", "pet-byte", "2026-09-16", now, "public", undefined, "Walk shipped before tests. Byte collected three sticks. Unread: zero.", "Sticks"),
    page("e-oat-1", "pet-oat", "2026-09-12", now, "public", undefined, "Oat finished the oat milk. The carton was not theatrical this time.", "Carton"),
    page("e-nero-1", "pet-nero", "2026-09-10", now, "public", undefined, "Nero sat on the title card for eight extra frames. Luca kept them.", "Frames"),
  ]

  const stories: Story[] = [
    {
      id: "story-orchard",
      petId: "pet-juniper",
      title: "The orchard years",
      dedication: "For the dog who knew the word orchard and kept a chair on the stairs.",
      startDate: "2021-03-14",
      endDate: "2026-12-31",
      visibility: "private",
      closed: false,
      createdAt: now,
    },
    {
      id: "story-window",
      petId: "pet-ink",
      title: "Window novels",
      dedication: "One bird. A whole afternoon.",
      startDate: "2026-07-01",
      endDate: "2026-09-18",
      visibility: "public",
      closed: true,
      createdAt: now,
    },
    {
      id: "story-layer",
      petId: "pet-pike",
      title: "The extra layer",
      dedication: "He never snoozed. The wind was rude. He stayed.",
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      visibility: "public",
      closed: false,
      createdAt: now,
    },
    {
      id: "story-mango",
      petId: "pet-mango",
      title: "A plate for Mango",
      dedication: "Sunday lunch, and the dog who voted for citrus.",
      startDate: "2026-09-01",
      endDate: "2026-09-30",
      visibility: "public",
      closed: true,
      createdAt: now,
    },
  ]

  const careRecords: CareRecord[] = [
    slip("c-visit-1", "pet-juniper", "visit", "2026-04-03", "Annual + limp check", "Bay Clinic", "Dr. Patel said the limp is theater. Vaccines current. Weight 19.4 kg."),
    slip("c-blood-1", "pet-juniper", "blood", "2026-04-03", "Senior panel", "Bay Lab", "CBC and chemistry quiet. Heartworm antigen negative."),
    slip("c-rx-1", "pet-juniper", "prescription", "2026-06-21", "NexGard combo", "One chew · 3 months", "Ticks and heartworm together. Give with dinner."),
    slip("c-rx-2", "pet-juniper", "receipt", "2026-06-21", "Pharmacy slip", "$64.20", "Paid at the counter. Photo of the bag kept."),
    slip("c-groom-1", "pet-juniper", "groom", "2026-08-02", "Summer clip", "Orchard groomer", "Nails, ears, the rust coat left a little long."),
    slip("c-groom-2", "pet-juniper", "groom", "2026-05-10", "Mud cut", "Home tub", "After the river. She shook on the towel first."),
    slip("c-food-1", "pet-juniper", "food", "2026-07-01", "Switched kibble", "Farmers’ to Farmers’ lamb", "Chicken made her scratch. Lamb held."),
    slip("c-food-2", "pet-juniper", "food", "2026-02-14", "Left the grain-free tin", "Previous: open-country", "She voted with the bowl."),
  ]

  const reminders: PreventativeReminder[] = [
    {
      id: "r-jun-combo",
      petId: "pet-juniper",
      label: "Ticks & heartworm",
      lastGiven: "2026-06-21",
      intervalMonths: 3,
      note: "Usually the 21st. Cheese helps it go down.",
    },
  ]

  const talents: Talent[] = [
    {
      id: "t-stand",
      petId: "pet-juniper",
      name: "Stand",
      cue: "Up",
      description: "Holds a stand on the orchard path until you count to four.",
    },
    {
      id: "t-hand",
      petId: "pet-juniper",
      name: "Give a hand",
      cue: "Hand",
      description: "Offers the left paw first. The right one is for bargaining.",
    },
    {
      id: "t-sound",
      petId: "pet-juniper",
      name: "Orchard note",
      cue: "Speak",
      description: "A low single sound at the gate. Not a bark. A count.",
    },
    {
      id: "t-comma",
      petId: "pet-juniper",
      name: "Sleep like a comma",
      cue: "—",
      description: "Folds on the stairs and will not be moved for guests.",
    },
  ]

  return { pets, entries, stories, careRecords, reminders, talents }
}

function slip(
  id: string,
  petId: string,
  kind: CareRecord["kind"],
  date: string,
  title: string,
  meta: string,
  detail: string
): CareRecord {
  return {
    id,
    petId,
    kind,
    date,
    title,
    meta,
    detail,
    attachments: [
      {
        id: `${id}-a`,
        src: paperSlip({ title, ink: "#b85c38" }),
        alt: title,
      },
    ],
  }
}

function page(
  id: string,
  petId: string,
  date: string,
  now: number,
  visibility: DiaryEntry["visibility"],
  storyId: string | undefined,
  text: string,
  photoTitle: string
): DiaryEntry {
  const petKind =
    petId.includes("ink") || petId.includes("oat") || petId.includes("nero")
      ? "cat"
      : "dog"
  const ink =
    petId === "pet-juniper"
      ? "#b85c38"
      : petId === "pet-ink"
        ? "#6b4c9a"
        : petId === "pet-pike"
          ? "#1b6b93"
          : petId === "pet-mango"
            ? "#b0892e"
            : petId === "pet-byte"
              ? "#2f6b4f"
              : petId === "pet-oat"
                ? "#8a6a3a"
                : "#1c1814"
  return {
    id,
    petId,
    date,
    text,
    visibility,
    storyId,
    updatedAt: now,
    photos: [
      {
        id: `${id}-p`,
        src: paperPhoto({ ink, kind: petKind, title: photoTitle }),
        alt: photoTitle,
      },
    ],
  }
}
