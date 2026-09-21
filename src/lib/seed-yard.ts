import { paperPhoto } from "@/lib/paper-photo"
import type { DiaryEntry, Pet, Story } from "@/lib/types"

export function createYardSeed(now: number): {
  pets: Pet[]
  entries: DiaryEntry[]
  stories: Story[]
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

  return { pets, entries, stories }
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
