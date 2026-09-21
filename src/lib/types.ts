export type MessageStatus = "sending" | "sent" | "delivered" | "read"

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

export type MessengerSnapshot = {
  youId: string
  contacts: Contact[]
  chats: Chat[]
  messages: Message[]
  statuses: StatusUpdate[]
}
