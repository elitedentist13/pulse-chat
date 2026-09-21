import type { RoomTopic } from "@/lib/types"

export const ROOM_TOPICS: {
  id: RoomTopic
  label: string
  line: string
  ink: string
}[] = [
  {
    id: "craft",
    label: "Craft",
    line: "Making things with other people.",
    ink: "#6b4c9a",
  },
  {
    id: "body",
    label: "Body",
    line: "Moving, cooking, showing up.",
    ink: "#1b6b93",
  },
  {
    id: "kin",
    label: "Kin",
    line: "Family and the people who keep a plate.",
    ink: "#b85c38",
  },
  {
    id: "work",
    label: "Work",
    line: "Clients, briefs, and the quiet timeline.",
    ink: "#b0892e",
  },
]

export function topicMeta(topic?: RoomTopic) {
  return ROOM_TOPICS.find((item) => item.id === topic) ?? ROOM_TOPICS[0]
}
