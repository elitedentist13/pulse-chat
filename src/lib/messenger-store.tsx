"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react"
import { createSeedSnapshot } from "@/lib/seed"
import type { Chat, Contact, Message, MessengerSnapshot, StatusUpdate } from "@/lib/types"

const STORAGE_KEY = "relay-messenger-v1"

type ChatFilter = "all" | "unread" | "groups"

type MessengerState = MessengerSnapshot & {
  activeChatId: string | null
  listMode: "chats" | "archived"
  chatFilter: ChatFilter
  search: string
}

type Action =
  | { type: "replace"; snapshot: MessengerSnapshot }
  | { type: "select-chat"; chatId: string | null }
  | { type: "set-search"; search: string }
  | { type: "set-filter"; filter: ChatFilter }
  | { type: "set-list-mode"; mode: "chats" | "archived" }
  | { type: "upsert-message"; message: Message }
  | { type: "patch-message"; id: string; patch: Partial<Message> }
  | { type: "set-typing"; chatId: string; contactId: string | null }
  | { type: "mark-read"; chatId: string }
  | { type: "toggle-pin"; chatId: string }
  | { type: "toggle-mute"; chatId: string }
  | { type: "toggle-archive"; chatId: string }
  | { type: "delete-chat"; chatId: string }
  | { type: "mark-unread"; chatId: string }
  | { type: "react"; messageId: string; reaction?: string }
  | { type: "view-status"; statusId: string }
  | { type: "ensure-chat"; contactId: string; chatId: string }

function cloneSnapshot(snapshot: MessengerSnapshot): MessengerSnapshot {
  return {
    youId: snapshot.youId,
    contacts: snapshot.contacts.map((item) => ({ ...item })),
    chats: snapshot.chats.map((item) => ({ ...item, typingContactId: null })),
    messages: snapshot.messages.map((item) => ({ ...item })),
    statuses: snapshot.statuses.map((item) => ({ ...item })),
  }
}

function emptyUi(): Pick<
  MessengerState,
  "activeChatId" | "listMode" | "chatFilter" | "search"
> {
  return {
    activeChatId: null,
    listMode: "chats",
    chatFilter: "all",
    search: "",
  }
}

function createInitialState(): MessengerState {
  return { ...cloneSnapshot(createSeedSnapshot()), ...emptyUi() }
}

function lastMessageTime(state: MessengerState, chatId: string) {
  let latest = 0
  for (const message of state.messages) {
    if (message.chatId === chatId && message.sentAt > latest) {
      latest = message.sentAt
    }
  }
  return latest
}

function reducer(state: MessengerState, action: Action): MessengerState {
  switch (action.type) {
    case "replace":
      return { ...state, ...cloneSnapshot(action.snapshot) }
    case "select-chat":
      return { ...state, activeChatId: action.chatId }
    case "set-search":
      return { ...state, search: action.search }
    case "set-filter":
      return { ...state, chatFilter: action.filter }
    case "set-list-mode":
      return {
        ...state,
        listMode: action.mode,
        activeChatId: null,
      }
    case "upsert-message": {
      const existing = state.messages.some((item) => item.id === action.message.id)
      const messages = existing
        ? state.messages.map((item) =>
            item.id === action.message.id ? action.message : item
          )
        : [...state.messages, action.message]
      const incoming =
        action.message.senderId !== state.youId &&
        action.message.chatId !== state.activeChatId
      return {
        ...state,
        messages,
        chats: state.chats.map((chat) =>
          chat.id === action.message.chatId
            ? {
                ...chat,
                unread: incoming ? chat.unread + 1 : chat.unread,
                archived: incoming ? chat.archived : chat.archived,
              }
            : chat
        ),
      }
    }
    case "patch-message":
      return {
        ...state,
        messages: state.messages.map((item) =>
          item.id === action.id ? { ...item, ...action.patch } : item
        ),
      }
    case "set-typing":
      return {
        ...state,
        chats: state.chats.map((chat) =>
          chat.id === action.chatId
            ? { ...chat, typingContactId: action.contactId }
            : chat
        ),
      }
    case "mark-read":
      return {
        ...state,
        chats: state.chats.map((chat) =>
          chat.id === action.chatId ? { ...chat, unread: 0 } : chat
        ),
        messages: state.messages.map((message) =>
          message.chatId === action.chatId &&
          message.senderId !== state.youId &&
          message.status !== "read"
            ? { ...message, status: "read" }
            : message
        ),
      }
    case "toggle-pin":
      return {
        ...state,
        chats: state.chats.map((chat) =>
          chat.id === action.chatId ? { ...chat, pinned: !chat.pinned } : chat
        ),
      }
    case "toggle-mute":
      return {
        ...state,
        chats: state.chats.map((chat) =>
          chat.id === action.chatId ? { ...chat, muted: !chat.muted } : chat
        ),
      }
    case "toggle-archive": {
      const target = state.chats.find((chat) => chat.id === action.chatId)
      return {
        ...state,
        activeChatId:
          state.activeChatId === action.chatId ? null : state.activeChatId,
        chats: state.chats.map((chat) =>
          chat.id === action.chatId
            ? { ...chat, archived: !chat.archived, pinned: false }
            : chat
        ),
        listMode:
          target && !target.archived ? state.listMode : state.listMode,
      }
    }
    case "delete-chat":
      return {
        ...state,
        activeChatId:
          state.activeChatId === action.chatId ? null : state.activeChatId,
        chats: state.chats.filter((chat) => chat.id !== action.chatId),
        messages: state.messages.filter((message) => message.chatId !== action.chatId),
      }
    case "mark-unread":
      return {
        ...state,
        chats: state.chats.map((chat) =>
          chat.id === action.chatId
            ? { ...chat, unread: Math.max(1, chat.unread) }
            : chat
        ),
        activeChatId:
          state.activeChatId === action.chatId ? null : state.activeChatId,
      }
    case "react":
      return {
        ...state,
        messages: state.messages.map((message) =>
          message.id === action.messageId
            ? {
                ...message,
                reaction:
                  message.reaction === action.reaction
                    ? undefined
                    : action.reaction,
              }
            : message
        ),
      }
    case "view-status": {
      const current = state.statuses.find((status) => status.id === action.statusId)
      if (!current || current.viewed) return state
      return {
        ...state,
        statuses: state.statuses.map((status) =>
          status.id === action.statusId ? { ...status, viewed: true } : status
        ),
      }
    }
    case "ensure-chat": {
      if (state.chats.some((chat) => chat.id === action.chatId)) {
        return {
          ...state,
          activeChatId: action.chatId,
          listMode: "chats",
          chats: state.chats.map((chat) =>
            chat.id === action.chatId ? { ...chat, archived: false } : chat
          ),
        }
      }
      const contact = state.contacts.find((item) => item.id === action.contactId)
      if (!contact) return state
      const chat: Chat = {
        id: action.chatId,
        kind: "direct",
        title: contact.name,
        contactId: contact.id,
        participantIds: [state.youId, contact.id],
        pinned: false,
        muted: false,
        archived: false,
        unread: 0,
        typingContactId: null,
      }
      return {
        ...state,
        chats: [chat, ...state.chats],
        activeChatId: chat.id,
        listMode: "chats",
      }
    }
    default:
      return state
  }
}

function pickReply(contact: Contact, incoming: string) {
  const text = incoming.toLowerCase()
  if (text.includes("thank")) return "Anytime."
  if (text.includes("sorry")) return "No stress — we’re good."
  if (text.includes("?")) {
    return (
      contact.replyBank.find((line) => line.includes("?")) ??
      contact.replyBank[0] ??
      "Yes — I’ll follow up in a bit."
    )
  }
  if (contact.replyBank.length === 0) return "Got it."
  return contact.replyBank[Math.floor(Math.random() * contact.replyBank.length)]
}

function persistable(state: MessengerState): MessengerSnapshot {
  return {
    youId: state.youId,
    contacts: state.contacts,
    chats: state.chats.map((chat) => ({ ...chat, typingContactId: null })),
    messages: state.messages,
    statuses: state.statuses,
  }
}

type MessengerContextValue = {
  state: MessengerState
  you: Contact
  activeChat: Chat | null
  visibleChats: Chat[]
  archivedCount: number
  contactById: (id: string) => Contact | undefined
  messagesFor: (chatId: string) => Message[]
  lastMessage: (chatId: string) => Message | undefined
  selectChat: (chatId: string | null) => void
  sendMessage: (chatId: string, text: string) => void
  setSearch: (search: string) => void
  setFilter: (filter: ChatFilter) => void
  setListMode: (mode: "chats" | "archived") => void
  togglePin: (chatId: string) => void
  toggleMute: (chatId: string) => void
  toggleArchive: (chatId: string) => void
  deleteChat: (chatId: string) => void
  markUnread: (chatId: string) => void
  reactToMessage: (messageId: string, reaction?: string) => void
  viewStatus: (statusId: string) => void
  startChatWith: (contactId: string) => void
  resetDemo: () => void
  statuses: StatusUpdate[]
}

const MessengerContext = createContext<MessengerContextValue | null>(null)

export function MessengerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState)
  const stateRef = useRef(state)
  const timers = useRef<number[]>([])
  const didLoad = useRef(false)

  const clearTimers = useCallback(() => {
    for (const timer of timers.current) window.clearTimeout(timer)
    timers.current = []
  }, [])

  const later = useCallback((fn: () => void, delay: number) => {
    const timer = window.setTimeout(fn, delay)
    timers.current.push(timer)
    return timer
  }, [])

  useEffect(() => {
    stateRef.current = state
  }, [state])

  useEffect(() => {
    return () => clearTimers()
  }, [clearTimers])

  useEffect(() => {
    if (!didLoad.current) {
      didLoad.current = true
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY)
        if (raw) {
          const parsed = JSON.parse(raw) as MessengerSnapshot
          if (parsed?.contacts && parsed?.chats && parsed?.messages) {
            dispatch({ type: "replace", snapshot: parsed })
          }
        }
      } catch {
        // Keep the seeded demo if storage is missing or corrupt.
      }
      return
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable(state)))
  }, [state])

  const you = useMemo(
    () => state.contacts.find((contact) => contact.id === state.youId)!,
    [state.contacts, state.youId]
  )

  const contactById = useCallback(
    (id: string) => state.contacts.find((contact) => contact.id === id),
    [state.contacts]
  )

  const messagesFor = useCallback(
    (chatId: string) =>
      state.messages
        .filter((message) => message.chatId === chatId)
        .sort((a, b) => a.sentAt - b.sentAt),
    [state.messages]
  )

  const lastMessage = useCallback(
    (chatId: string) => {
      const list = messagesFor(chatId)
      return list[list.length - 1]
    },
    [messagesFor]
  )

  const archivedCount = useMemo(
    () => state.chats.filter((chat) => chat.archived).length,
    [state.chats]
  )

  const visibleChats = useMemo(() => {
    const query = state.search.trim().toLowerCase()
    return state.chats
      .filter((chat) =>
        state.listMode === "archived" ? chat.archived : !chat.archived
      )
      .filter((chat) => {
        if (state.chatFilter === "unread") return chat.unread > 0
        if (state.chatFilter === "groups") return chat.kind === "group"
        return true
      })
      .filter((chat) => {
        if (!query) return true
        const preview = lastMessage(chat.id)?.text ?? ""
        const participants = chat.participantIds
          .map((id) => contactById(id)?.name ?? "")
          .join(" ")
        return `${chat.title} ${preview} ${participants}`
          .toLowerCase()
          .includes(query)
      })
      .sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
        return lastMessageTime(state, b.id) - lastMessageTime(state, a.id)
      })
  }, [contactById, lastMessage, state])

  const activeChat =
    state.chats.find((chat) => chat.id === state.activeChatId) ?? null

  const selectChat = useCallback((chatId: string | null) => {
    dispatch({ type: "select-chat", chatId })
    if (chatId) dispatch({ type: "mark-read", chatId })
  }, [])

  const sendMessage = useCallback(
    (chatId: string, text: string) => {
      const trimmed = text.trim()
      if (!trimmed) return
      const current = stateRef.current
      const id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `msg-${Date.now()}`
      const message: Message = {
        id,
        chatId,
        senderId: current.youId,
        text: trimmed,
        sentAt: Date.now(),
        status: "sending",
      }
      dispatch({ type: "upsert-message", message })
      dispatch({ type: "select-chat", chatId })
      dispatch({ type: "mark-read", chatId })

      later(() => {
        dispatch({ type: "patch-message", id, patch: { status: "sent" } })
      }, 280)
      later(() => {
        dispatch({ type: "patch-message", id, patch: { status: "delivered" } })
      }, 720)

      const chat = current.chats.find((item) => item.id === chatId)
      if (!chat) return
      const otherIds = chat.participantIds.filter((item) => item !== current.youId)
      const responderId =
        otherIds[Math.floor(Math.random() * Math.max(otherIds.length, 1))]
      const responder = current.contacts.find((item) => item.id === responderId)
      if (!responder) return

      const typingAt = 900 + Math.random() * 1100
      const replyAt = typingAt + 700 + Math.random() * 1600
      later(() => {
        dispatch({ type: "set-typing", chatId, contactId: responder.id })
      }, typingAt)
      later(() => {
        dispatch({ type: "set-typing", chatId, contactId: null })
        const reply: Message = {
          id:
            typeof crypto !== "undefined" && crypto.randomUUID
              ? crypto.randomUUID()
              : `msg-${Date.now()}-r`,
          chatId,
          senderId: responder.id,
          text: pickReply(responder, trimmed),
          sentAt: Date.now(),
          status: "delivered",
        }
        dispatch({ type: "upsert-message", message: reply })
        if (stateRef.current.activeChatId === chatId) {
          dispatch({ type: "mark-read", chatId })
        }
        dispatch({
          type: "patch-message",
          id,
          patch: { status: "read" },
        })
      }, replyAt)
    },
    [later]
  )

  const startChatWith = useCallback((contactId: string) => {
    const existing = stateRef.current.chats.find(
      (chat) => chat.kind === "direct" && chat.contactId === contactId
    )
    const chatId = existing?.id ?? `chat-${contactId}`
    dispatch({ type: "ensure-chat", contactId, chatId })
    dispatch({ type: "mark-read", chatId })
  }, [])

  const resetDemo = useCallback(() => {
    clearTimers()
    window.localStorage.removeItem(STORAGE_KEY)
    dispatch({ type: "replace", snapshot: createSeedSnapshot() })
    dispatch({ type: "select-chat", chatId: null })
    dispatch({ type: "set-list-mode", mode: "chats" })
    dispatch({ type: "set-search", search: "" })
    dispatch({ type: "set-filter", filter: "all" })
  }, [clearTimers])

  const value: MessengerContextValue = {
    state,
    you,
    activeChat,
    visibleChats,
    archivedCount,
    contactById,
    messagesFor,
    lastMessage,
    selectChat,
    sendMessage,
    setSearch: (search) => dispatch({ type: "set-search", search }),
    setFilter: (filter) => dispatch({ type: "set-filter", filter }),
    setListMode: (mode) => dispatch({ type: "set-list-mode", mode }),
    togglePin: (chatId) => dispatch({ type: "toggle-pin", chatId }),
    toggleMute: (chatId) => dispatch({ type: "toggle-mute", chatId }),
    toggleArchive: (chatId) => dispatch({ type: "toggle-archive", chatId }),
    deleteChat: (chatId) => dispatch({ type: "delete-chat", chatId }),
    markUnread: (chatId) => dispatch({ type: "mark-unread", chatId }),
    reactToMessage: (messageId, reaction = "❤️") =>
      dispatch({ type: "react", messageId, reaction }),
    viewStatus: (statusId) => dispatch({ type: "view-status", statusId }),
    startChatWith,
    resetDemo,
    statuses: state.statuses,
  }

  return (
    <MessengerContext.Provider value={value}>{children}</MessengerContext.Provider>
  )
}

export function useMessenger() {
  const value = useContext(MessengerContext)
  if (!value) {
    throw new Error("useMessenger must be used inside MessengerProvider")
  }
  return value
}
