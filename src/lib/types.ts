export type MessageStatus = "sending" | "sent" | "delivered" | "read"

export type RoomTopic = "craft" | "body" | "kin" | "work"

export type Contact = {
  id: string
  name: string
  phone: string
  about: string
  initials: string
  color: string
  online: boolean
  lastSeen: number
  replyBank: string[]
  interests: string[]
}

export type ChatKind = "direct" | "group"

export type Chat = {
  id: string
  kind: ChatKind
  title: string
  contactId?: string
  participantIds: string[]
  pinned: boolean
  muted: boolean
  archived: boolean
  unread: number
  typingContactId: string | null
  topic?: RoomTopic
  blurb?: string
}

export type Message = {
  id: string
  chatId: string
  senderId: string
  text: string
  sentAt: number
  status: MessageStatus
  reaction?: string
}

export type StatusUpdate = {
  id: string
  contactId: string
  text: string
  createdAt: number
  viewed: boolean
  accent: string
}

export type PetKind = "dog" | "cat" | "other"

export type Pet = {
  id: string
  ownerId: string
  name: string
  kind: PetKind
  breed: string
  birthday: string
  about: string
  color: string
  initials: string
  portrait?: string
  nickname: string
  origin: string
  traits: string
  features: string
  favoriteFood: string
  fears: string
  specialNotes: string
  remarks: string
  medicalRemarks: string
  favoriteSnacks: string
  cannedFood: string
  currentFood: string
}

export type PetTab = "profile" | "pages" | "care" | "talent"

export type CareKind =
  | "visit"
  | "blood"
  | "receipt"
  | "prescription"
  | "groom"
  | "food"

export type CareRecord = {
  id: string
  petId: string
  kind: CareKind
  date: string
  title: string
  detail: string
  meta: string
  attachments: DiaryPhoto[]
}

export type PreventativeReminder = {
  id: string
  petId: string
  label: string
  lastGiven: string
  intervalMonths: number
  note: string
}

export type Talent = {
  id: string
  petId: string
  name: string
  cue: string
  description: string
}

export type EntryVisibility = "private" | "public"

export type DiaryPhoto = {
  id: string
  src: string
  alt: string
}

export type DiaryEntry = {
  id: string
  petId: string
  date: string
  text: string
  photos: DiaryPhoto[]
  visibility: EntryVisibility
  storyId?: string
  updatedAt: number
}

export type Story = {
  id: string
  petId: string
  title: string
  dedication: string
  startDate: string
  endDate: string
  visibility: EntryVisibility
  closed: boolean
  createdAt: number
}

export type AppSurface = "daybook" | "porch" | "notes"

export type MessengerSnapshot = {
  youId: string
  contacts: Contact[]
  chats: Chat[]
  messages: Message[]
  statuses: StatusUpdate[]
  pets: Pet[]
  entries: DiaryEntry[]
  stories: Story[]
  careRecords: CareRecord[]
  reminders: PreventativeReminder[]
  talents: Talent[]
}
