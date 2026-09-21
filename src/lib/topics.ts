import type { RoomTopic } from "@/lib/types"

export const ROOM_TOPICS: {
  id: RoomTopic
  ink: string
}[] = [
  { id: "craft", ink: "#6b4c9a" },
  { id: "body", ink: "#1b6b93" },
  { id: "kin", ink: "#b85c38" },
  { id: "work", ink: "#b0892e" },
]

export function topicMeta(topic?: RoomTopic) {
  return ROOM_TOPICS.find((item) => item.id === topic) ?? ROOM_TOPICS[0]
}
