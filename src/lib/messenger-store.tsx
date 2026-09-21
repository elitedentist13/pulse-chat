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
import { inDateRange, toDateKey } from "@/lib/dates"
import { createSeedSnapshot } from "@/lib/seed"
import type {
  AppSurface,
  CareRecord,
  Chat,
  Contact,
  DiaryEntry,
  DiaryPhoto,
  Message,
  MessengerSnapshot,
  Pet,
  PetTab,
  PreventativeReminder,
  StatusUpdate,
  Story,
  Talent,
} from "@/lib/types"

const STORAGE_KEY = "kith-daybook-v3"

type ChatFilter = "all" | "unread" | "groups"

type MessengerState = MessengerSnapshot & {
  activeChatId: string | null
  listMode: "chats" | "archived"
  chatFilter: ChatFilter
  search: string
  surface: AppSurface
  activePetId: string | null
  activeStoryId: string | null
  selectedDate: string
  year: number
  yardFocus: "index" | "page"
  porchSeed: number
  petTab: PetTab
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
  | { type: "set-surface"; surface: AppSurface }
  | { type: "set-pet"; petId: string | null }
  | { type: "set-story"; storyId: string | null }
  | { type: "set-date"; date: string }
  | { type: "set-year"; year: number }
  | { type: "set-yard-focus"; focus: "index" | "page" }
  | { type: "reshuffle-porch" }
  | { type: "upsert-pet"; pet: Pet }
  | { type: "upsert-story"; story: Story }
  | { type: "close-story"; storyId: string }
  | { type: "save-entry"; entry: DiaryEntry }
  | { type: "delete-entry"; entryId: string }
  | { type: "set-pet-tab"; tab: PetTab }
  | { type: "upsert-care"; record: CareRecord }
  | { type: "delete-care"; recordId: string }
  | { type: "upsert-reminder"; reminder: PreventativeReminder }
  | { type: "delete-reminder"; reminderId: string }
  | { type: "upsert-talent"; talent: Talent }
  | { type: "delete-talent"; talentId: string }

function hydrate(snapshot: MessengerSnapshot): MessengerSnapshot {
  const seed = createSeedSnapshot()
  return {
    youId: snapshot.youId,
    contacts: snapshot.contacts.map((item) => ({ ...item })),
    chats: snapshot.chats.map((item) => ({ ...item, typingContactId: null })),
    messages: snapshot.messages.map((item) => ({ ...item })),
    statuses: snapshot.statuses.map((item) => ({ ...item })),
    pets: (snapshot.pets ?? seed.pets).map((item) => ({
      ...{
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
      },
      ...item,
    })),
    entries: (snapshot.entries ?? seed.entries).map((item) => ({
      ...item,
      photos: item.photos.map((photo) => ({
        kind: "photo" as const,
        ...photo,
      })),
    })),
    stories: (snapshot.stories ?? seed.stories).map((item) => ({ ...item })),
    careRecords: (snapshot.careRecords ?? seed.careRecords).map((item) => ({
      ...item,
      attachments: item.attachments.map((photo) => ({
        kind: "photo" as const,
        ...photo,
      })),
    })),
    reminders: (snapshot.reminders ?? seed.reminders).map((item) => ({ ...item })),
    talents: (snapshot.talents ?? seed.talents).map((item) => ({ ...item })),
  }
}

function emptyUi(snapshot: MessengerSnapshot, now = Date.now()): Omit<
  MessengerState,
  keyof MessengerSnapshot
> {
  const today = toDateKey(new Date(now))
  const yours = snapshot.pets.find((pet) => pet.ownerId === snapshot.youId)
  const openStory = snapshot.stories.find(
    (story) => story.petId === yours?.id && !story.closed
  )
  return {
    activeChatId: null,
    listMode: "chats",
    chatFilter: "all",
    search: "",
    surface: "daybook",
    activePetId: yours?.id ?? snapshot.pets[0]?.id ?? null,
    activeStoryId: openStory?.id ?? null,
    selectedDate: today,
    year: new Date(now).getFullYear(),
    yardFocus: "index",
    porchSeed: now,
    petTab: "pages",
  }
}

function createInitialState(): MessengerState {
  const snapshot = hydrate(createSeedSnapshot())
  return { ...snapshot, ...emptyUi(snapshot) }
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

function nid(prefix: string) {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${prefix}-${Date.now()}`
}

function reducer(state: MessengerState, action: Action): MessengerState {
  switch (action.type) {
    case "replace":
      return { ...state, ...hydrate(action.snapshot) }
    case "select-chat":
      return { ...state, activeChatId: action.chatId }
    case "set-search":
      return { ...state, search: action.search }
    case "set-filter":
      return { ...state, chatFilter: action.filter }
    case "set-list-mode":
      return { ...state, listMode: action.mode, activeChatId: null }
    case "set-surface":
      return {
        ...state,
        surface: action.surface,
        yardFocus: action.surface === "daybook" ? state.yardFocus : "page",
      }
    case "set-pet":
      return { ...state, activePetId: action.petId }
    case "set-story":
      return {
        ...state,
        activeStoryId: action.storyId,
        yardFocus: "page",
        petTab: "pages",
      }
    case "set-date":
      return {
        ...state,
        selectedDate: action.date,
        year: Number(action.date.slice(0, 4)),
        yardFocus: "page",
        surface: "daybook",
        petTab: "pages",
      }
    case "set-year":
      return { ...state, year: action.year }
    case "set-yard-focus":
      return { ...state, yardFocus: action.focus }
    case "reshuffle-porch":
      return { ...state, porchSeed: Date.now() }
    case "upsert-pet": {
      const exists = state.pets.some((pet) => pet.id === action.pet.id)
      return {
        ...state,
        activePetId: action.pet.id,
        pets: exists
          ? state.pets.map((pet) => (pet.id === action.pet.id ? action.pet : pet))
          : [...state.pets, action.pet],
      }
    }
    case "upsert-story": {
      const exists = state.stories.some((story) => story.id === action.story.id)
      return {
        ...state,
        activeStoryId: action.story.id,
        activePetId: action.story.petId,
        surface: "daybook",
        selectedDate:
          action.story.startDate > state.selectedDate
            ? action.story.startDate
            : state.selectedDate > action.story.endDate
              ? action.story.endDate
              : state.selectedDate,
        stories: exists
          ? state.stories.map((story) =>
              story.id === action.story.id ? action.story : story
            )
          : [...state.stories, action.story],
      }
    }
    case "close-story":
      return {
        ...state,
        stories: state.stories.map((story) =>
          story.id === action.storyId ? { ...story, closed: true } : story
        ),
      }
    case "save-entry": {
      const exists = state.entries.some((entry) => entry.id === action.entry.id)
      return {
        ...state,
        entries: exists
          ? state.entries.map((entry) =>
              entry.id === action.entry.id ? action.entry : entry
            )
          : [...state.entries, action.entry],
      }
    }
    case "delete-entry":
      return {
        ...state,
        entries: state.entries.filter((entry) => entry.id !== action.entryId),
      }
    case "set-pet-tab":
      return {
        ...state,
        petTab: action.tab,
        surface: "daybook",
        yardFocus: action.tab === "pages" ? state.yardFocus : "page",
      }
    case "upsert-care": {
      const exists = state.careRecords.some((item) => item.id === action.record.id)
      return {
        ...state,
        careRecords: exists
          ? state.careRecords.map((item) =>
              item.id === action.record.id ? action.record : item
            )
          : [action.record, ...state.careRecords],
      }
    }
    case "delete-care":
      return {
        ...state,
        careRecords: state.careRecords.filter((item) => item.id !== action.recordId),
      }
    case "upsert-reminder": {
      const exists = state.reminders.some((item) => item.id === action.reminder.id)
      return {
        ...state,
        reminders: exists
          ? state.reminders.map((item) =>
              item.id === action.reminder.id ? action.reminder : item
            )
          : [...state.reminders, action.reminder],
      }
    }
    case "delete-reminder":
      return {
        ...state,
        reminders: state.reminders.filter((item) => item.id !== action.reminderId),
      }
    case "upsert-talent": {
      const exists = state.talents.some((item) => item.id === action.talent.id)
      return {
        ...state,
        talents: exists
          ? state.talents.map((item) =>
              item.id === action.talent.id ? action.talent : item
            )
          : [...state.talents, action.talent],
      }
    }
    case "delete-talent":
      return {
        ...state,
        talents: state.talents.filter((item) => item.id !== action.talentId),
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
            ? { ...chat, unread: incoming ? chat.unread + 1 : chat.unread }
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
    case "toggle-archive":
      return {
        ...state,
        activeChatId:
          state.activeChatId === action.chatId ? null : state.activeChatId,
        chats: state.chats.map((chat) =>
          chat.id === action.chatId
            ? { ...chat, archived: !chat.archived, pinned: false }
            : chat
        ),
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
          surface: "notes",
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
        surface: "notes",
        chats: [chat, ...state.chats],
        activeChatId: chat.id,
        listMode: "chats",
      }
    }
    default:
      return state
  }
}

function pickResponder(
  chat: Chat,
  incoming: string,
  contacts: Contact[],
  youId: string
) {
  const others = chat.participantIds
    .filter((id) => id !== youId)
    .map((id) => contacts.find((contact) => contact.id === id))
    .filter((contact): contact is Contact => Boolean(contact))
  if (others.length === 0) return undefined
  if (chat.kind !== "group" || others.length === 1) {
    return others[Math.floor(Math.random() * others.length)]
  }
  const text = incoming.toLowerCase()
  const ranked = others
    .map((contact) => {
      let score = Math.random()
      if (chat.topic && contact.interests.includes(chat.topic)) score += 2
      for (const interest of contact.interests) {
        if (text.includes(interest)) score += 4
      }
      return { contact, score }
    })
    .sort((a, b) => b.score - a.score)
  return ranked[0]?.contact ?? others[0]
}

function pickReply(contact: Contact, incoming: string) {
  const text = incoming.toLowerCase()
  if (text.includes("thank")) return "Anytime."
  if (text.includes("sorry")) return "No stress — we’re good."
  if (
    /porch|juniper|pike|ink|mango|oat|nero|byte|walk|treat|booklet|story/.test(
      text
    )
  ) {
    return (
      contact.replyBank.find((line) =>
        /walk|treat|porch|pike|ink|mango|oat|nero|byte|dog|cat/.test(line)
      ) ??
      contact.replyBank[0] ??
      "I saw that page."
    )
  }
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
    pets: state.pets,
    entries: state.entries,
    stories: state.stories,
    careRecords: state.careRecords,
    reminders: state.reminders,
    talents: state.talents,
  }
}

function shuffle<T>(items: T[], seed: number) {
  const copy = [...items]
  let value = seed || 1
  for (let index = copy.length - 1; index > 0; index -= 1) {
    value = (value * 16807) % 2147483647
    const other = value % (index + 1)
    const current = copy[index]!
    copy[index] = copy[other]!
    copy[other] = current
  }
  return copy
}

type MessengerContextValue = {
  state: MessengerState
  you: Contact
  activeChat: Chat | null
  visibleChats: Chat[]
  archivedCount: number
  unreadNotes: number
  contactById: (id: string) => Contact | undefined
  petById: (id: string) => Pet | undefined
  activePet: Pet | null
  activeStory: Story | null
  yourPets: Pet[]
  selectedEntry: DiaryEntry | undefined
  porchEntries: DiaryEntry[]
  storiesFor: (petId: string) => Story[]
  entriesFor: (petId: string) => DiaryEntry[]
  storyPages: (storyId: string) => DiaryEntry[]
  messagesFor: (chatId: string) => Message[]
  lastMessage: (chatId: string) => Message | undefined
  selectChat: (chatId: string | null) => void
  sendMessage: (chatId: string, text: string) => void
  setSearch: (search: string) => void
  setFilter: (filter: ChatFilter) => void
  setListMode: (mode: "chats" | "archived") => void
  setSurface: (surface: AppSurface) => void
  setPet: (petId: string) => void
  setStory: (storyId: string | null) => void
  setDate: (date: string) => void
  setYear: (year: number) => void
  setYardFocus: (focus: "index" | "page") => void
  setPetTab: (tab: PetTab) => void
  reshufflePorch: () => void
  savePet: (pet: Pet) => void
  changePortrait: (file: File) => Promise<void>
  careFor: (petId: string) => CareRecord[]
  remindersFor: (petId: string) => PreventativeReminder[]
  talentsFor: (petId: string) => Talent[]
  saveCare: (record: Omit<CareRecord, "id"> & { id?: string }) => void
  deleteCare: (recordId: string) => void
  removeCareMedia: (recordId: string, mediaId: string) => void
  saveReminder: (
    reminder: Omit<PreventativeReminder, "id"> & { id?: string }
  ) => void
  deleteReminder: (reminderId: string) => void
  saveTalent: (talent: Omit<Talent, "id"> & { id?: string }) => void
  deleteTalent: (talentId: string) => void
  saveStory: (story: Omit<Story, "id" | "createdAt"> & { id?: string }) => void
  closeStory: (storyId: string) => void
  saveEntry: (patch: Partial<DiaryEntry> & { date: string; petId: string }) => void
  addMedia: (files: File[]) => Promise<void>
  removePhoto: (photoId: string) => void
  deleteEntry: (entryId: string) => void
  writeFromPorch: (entryId: string) => void
  shareEntryToChat: (entryId: string, chatId: string) => void
  togglePin: (chatId: string) => void
  toggleMute: (chatId: string) => void
  toggleArchive: (chatId: string) => void
  deleteChat: (chatId: string) => void
  markUnread: (chatId: string) => void
  reactToMessage: (messageId: string, reaction?: string) => void
  viewStatus: (statusId: string) => void
  startChatWith: (contactId: string) => string
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
            return
          }
        }
      } catch {
        // Keep going and seed from the current clock.
      }
      dispatch({ type: "replace", snapshot: createSeedSnapshot(Date.now()) })
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

  const petById = useCallback(
    (id: string) => state.pets.find((pet) => pet.id === id),
    [state.pets]
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

  const unreadNotes = useMemo(
    () =>
      state.chats.reduce((sum, chat) => sum + (chat.archived ? 0 : chat.unread), 0),
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
        return chat.kind === "direct"
      })
      .filter((chat) => {
        if (!query) return true
        const preview = lastMessage(chat.id)?.text ?? ""
        const participants = chat.participantIds
          .map((id) => contactById(id)?.name ?? "")
          .join(" ")
        return `${chat.title} ${chat.blurb ?? ""} ${chat.topic ?? ""} ${preview} ${participants}`
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

  const activePet = state.activePetId ? petById(state.activePetId) ?? null : null
  const activeStory = state.activeStoryId
    ? state.stories.find((story) => story.id === state.activeStoryId) ?? null
    : null

  const yourPets = useMemo(
    () => state.pets.filter((pet) => pet.ownerId === you.id),
    [state.pets, you.id]
  )

  const selectedEntry = useMemo(
    () =>
      state.entries.find(
        (entry) =>
          entry.petId === state.activePetId && entry.date === state.selectedDate
      ),
    [state.activePetId, state.entries, state.selectedDate]
  )

  const storiesFor = useCallback(
    (petId: string) =>
      state.stories
        .filter((story) => story.petId === petId)
        .sort((a, b) => b.startDate.localeCompare(a.startDate)),
    [state.stories]
  )

  const entriesFor = useCallback(
    (petId: string) =>
      state.entries
        .filter((entry) => entry.petId === petId)
        .sort((a, b) => a.date.localeCompare(b.date)),
    [state.entries]
  )

  const storyPages = useCallback(
    (storyId: string) => {
      const story = state.stories.find((item) => item.id === storyId)
      if (!story) return []
      return state.entries
        .filter(
          (entry) =>
            entry.petId === story.petId &&
            (entry.storyId === story.id ||
              inDateRange(entry.date, story.startDate, story.endDate))
        )
        .sort((a, b) => a.date.localeCompare(b.date))
    },
    [state.entries, state.stories]
  )

  const porchEntries = useMemo(() => {
    const publicPages = state.entries.filter((entry) => entry.visibility === "public")
    return shuffle(publicPages, state.porchSeed)
  }, [state.entries, state.porchSeed])

  const selectChat = useCallback((chatId: string | null) => {
    dispatch({ type: "select-chat", chatId })
    if (chatId) dispatch({ type: "mark-read", chatId })
  }, [])

  const sendMessage = useCallback(
    (chatId: string, text: string) => {
      const trimmed = text.trim()
      if (!trimmed) return
      const current = stateRef.current
      const id = nid("msg")
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
      const responder = pickResponder(
        chat,
        trimmed,
        current.contacts,
        current.youId
      )
      if (!responder) return
      const typingAt = 900 + Math.random() * 1100
      const replyAt = typingAt + 700 + Math.random() * 1600
      later(() => {
        dispatch({ type: "set-typing", chatId, contactId: responder.id })
      }, typingAt)
      later(() => {
        dispatch({ type: "set-typing", chatId, contactId: null })
        const reply: Message = {
          id: nid("msg"),
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
        dispatch({ type: "patch-message", id, patch: { status: "read" } })
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
    return chatId
  }, [])

  const saveEntry = useCallback(
    (patch: Partial<DiaryEntry> & { date: string; petId: string }) => {
      const current = stateRef.current
      const existing = current.entries.find(
        (entry) => entry.petId === patch.petId && entry.date === patch.date
      )
      const story =
        current.stories.find((item) => item.id === current.activeStoryId) ??
        current.stories.find(
          (item) =>
            item.petId === patch.petId &&
            !item.closed &&
            inDateRange(patch.date, item.startDate, item.endDate)
        )
      const inStory =
        story && inDateRange(patch.date, story.startDate, story.endDate)
          ? story.id
          : existing?.storyId
      const entry: DiaryEntry = {
        id: existing?.id ?? nid("entry"),
        petId: patch.petId,
        date: patch.date,
        text: patch.text ?? existing?.text ?? "",
        photos: patch.photos ?? existing?.photos ?? [],
        visibility: patch.visibility ?? existing?.visibility ?? "private",
        storyId: patch.storyId ?? inStory,
        updatedAt: Date.now(),
      }
      dispatch({ type: "save-entry", entry })
    },
    []
  )

  const addMedia = useCallback(async (files: File[]) => {
    const { ingestMedia, PAGE_MEDIA_LIMIT } = await import("@/lib/media")
    const current = stateRef.current
    const existing = current.entries.find(
      (entry) =>
        entry.petId === current.activePetId && entry.date === current.selectedDate
    )
    if (!current.activePetId) return
    const room = PAGE_MEDIA_LIMIT - (existing?.photos.length ?? 0)
    const photos: DiaryPhoto[] = []
    for (const file of files.slice(0, Math.max(0, room))) {
      photos.push(await ingestMedia(file))
    }
    if (photos.length === 0) return
    saveEntry({
      petId: current.activePetId,
      date: current.selectedDate,
      photos: [...(existing?.photos ?? []), ...photos],
    })
  }, [saveEntry])

  const removePhoto = useCallback(
    (photoId: string) => {
      const current = stateRef.current
      const existing = current.entries.find(
        (entry) =>
          entry.petId === current.activePetId && entry.date === current.selectedDate
      )
      if (!existing || !current.activePetId) return
      const next = existing.photos.filter((photo) => photo.id !== photoId)
      const dropped = existing.photos.find((photo) => photo.id === photoId)
      if (dropped) {
        void import("@/lib/media-db").then(({ purgeMediaBlobs }) =>
          purgeMediaBlobs([dropped])
        )
      }
      saveEntry({
        petId: current.activePetId,
        date: current.selectedDate,
        photos: next,
      })
    },
    [saveEntry]
  )

  const saveStory = useCallback(
    (draft: Omit<Story, "id" | "createdAt"> & { id?: string }) => {
      const story: Story = {
        ...draft,
        id: draft.id ?? nid("story"),
        createdAt: Date.now(),
      }
      dispatch({ type: "upsert-story", story })
    },
    []
  )

  const writeFromPorch = useCallback(
    (entryId: string) => {
      const current = stateRef.current
      const entry = current.entries.find((item) => item.id === entryId)
      const pet = entry ? current.pets.find((item) => item.id === entry.petId) : undefined
      if (!entry || !pet || pet.ownerId === current.youId) return
      const chatId = startChatWith(pet.ownerId)
      later(() => {
        sendMessage(
          chatId,
          `From the porch — ${pet.name}, ${entry.date}. ${entry.text.slice(0, 160)}`
        )
      }, 50)
    },
    [later, sendMessage, startChatWith]
  )

  const shareEntryToChat = useCallback(
    (entryId: string, chatId: string) => {
      const current = stateRef.current
      const entry = current.entries.find((item) => item.id === entryId)
      const pet = entry ? current.pets.find((item) => item.id === entry.petId) : undefined
      if (!entry || !pet) return
      dispatch({ type: "set-surface", surface: "notes" })
      dispatch({ type: "select-chat", chatId })
      later(() => {
        sendMessage(
          chatId,
          `${pet.name} · ${entry.date}${
            entry.photos.some((item) => item.kind === "video")
              ? " · with a clip"
              : entry.photos.length
                ? " · with a photo"
                : ""
          }. ${entry.text.slice(0, 180)}`
        )
      }, 50)
    },
    [later, sendMessage]
  )

  const careFor = useCallback(
    (petId: string) =>
      state.careRecords
        .filter((item) => item.petId === petId)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [state.careRecords]
  )

  const remindersFor = useCallback(
    (petId: string) => state.reminders.filter((item) => item.petId === petId),
    [state.reminders]
  )

  const talentsFor = useCallback(
    (petId: string) => state.talents.filter((item) => item.petId === petId),
    [state.talents]
  )

  const changePortrait = useCallback(async (file: File) => {
    const current = stateRef.current
    const pet = current.pets.find((item) => item.id === current.activePetId)
    if (!pet) return
    const { compressPhoto } = await import("@/lib/photos")
    dispatch({
      type: "upsert-pet",
      pet: { ...pet, portrait: await compressPhoto(file, 640) },
    })
  }, [])

  const saveCare = useCallback(
    (draft: Omit<CareRecord, "id"> & { id?: string }) => {
      dispatch({
        type: "upsert-care",
        record: { ...draft, id: draft.id ?? nid("care") },
      })
    },
    []
  )

  const saveReminder = useCallback(
    (draft: Omit<PreventativeReminder, "id"> & { id?: string }) => {
      dispatch({
        type: "upsert-reminder",
        reminder: { ...draft, id: draft.id ?? nid("remind") },
      })
    },
    []
  )

  const saveTalent = useCallback(
    (draft: Omit<Talent, "id"> & { id?: string }) => {
      dispatch({
        type: "upsert-talent",
        talent: { ...draft, id: draft.id ?? nid("talent") },
      })
    },
    []
  )

  const resetDemo = useCallback(() => {
    clearTimers()
    window.localStorage.removeItem(STORAGE_KEY)
    void import("@/lib/media-db").then(({ clearMediaBlobs }) => clearMediaBlobs())
    const snapshot = createSeedSnapshot(Date.now())
    dispatch({ type: "replace", snapshot })
    dispatch({ type: "select-chat", chatId: null })
    dispatch({ type: "set-list-mode", mode: "chats" })
    dispatch({ type: "set-search", search: "" })
    dispatch({ type: "set-filter", filter: "all" })
    dispatch({ type: "set-surface", surface: "daybook" })
    dispatch({ type: "set-pet-tab", tab: "pages" })
  }, [clearTimers])

  const value: MessengerContextValue = {
    state,
    you,
    activeChat,
    visibleChats,
    archivedCount,
    unreadNotes,
    contactById,
    petById,
    activePet,
    activeStory,
    yourPets,
    selectedEntry,
    porchEntries,
    storiesFor,
    entriesFor,
    storyPages,
    messagesFor,
    lastMessage,
    selectChat,
    sendMessage,
    setSearch: (search) => dispatch({ type: "set-search", search }),
    setFilter: (filter) => dispatch({ type: "set-filter", filter }),
    setListMode: (mode) => dispatch({ type: "set-list-mode", mode }),
    setSurface: (surface) => dispatch({ type: "set-surface", surface }),
    setPet: (petId) => dispatch({ type: "set-pet", petId }),
    setStory: (storyId) => dispatch({ type: "set-story", storyId }),
    setDate: (date) => dispatch({ type: "set-date", date }),
    setYear: (year) => dispatch({ type: "set-year", year }),
    setYardFocus: (focus) => dispatch({ type: "set-yard-focus", focus }),
    setPetTab: (tab) => dispatch({ type: "set-pet-tab", tab }),
    reshufflePorch: () => dispatch({ type: "reshuffle-porch" }),
    savePet: (pet) => dispatch({ type: "upsert-pet", pet }),
    changePortrait,
    careFor,
    remindersFor,
    talentsFor,
    saveCare,
    deleteCare: (recordId) => {
      const record = stateRef.current.careRecords.find((item) => item.id === recordId)
      if (record) {
        void import("@/lib/media-db").then(({ purgeMediaBlobs }) =>
          purgeMediaBlobs(record.attachments)
        )
      }
      dispatch({ type: "delete-care", recordId })
    },
    removeCareMedia: (recordId, mediaId) => {
      const record = stateRef.current.careRecords.find((item) => item.id === recordId)
      if (!record) return
      const dropped = record.attachments.find((item) => item.id === mediaId)
      const next = record.attachments.filter((item) => item.id !== mediaId)
      if (dropped) {
        void import("@/lib/media-db").then(({ purgeMediaBlobs }) =>
          purgeMediaBlobs([dropped])
        )
      }
      if (next.length === 0) {
        dispatch({ type: "delete-care", recordId })
        return
      }
      dispatch({
        type: "upsert-care",
        record: { ...record, attachments: next },
      })
    },
    saveReminder,
    deleteReminder: (reminderId) =>
      dispatch({ type: "delete-reminder", reminderId }),
    saveTalent,
    deleteTalent: (talentId) => dispatch({ type: "delete-talent", talentId }),
    saveStory,
    closeStory: (storyId) => dispatch({ type: "close-story", storyId }),
    saveEntry,
    addMedia,
    removePhoto,
    deleteEntry: (entryId) => {
      const entry = stateRef.current.entries.find((item) => item.id === entryId)
      if (entry) {
        void import("@/lib/media-db").then(({ purgeMediaBlobs }) =>
          purgeMediaBlobs(entry.photos)
        )
      }
      dispatch({ type: "delete-entry", entryId })
    },
    writeFromPorch,
    shareEntryToChat,
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
