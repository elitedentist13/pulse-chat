"use client"

import { GroupAvatar, UserAvatar } from "@/components/messenger/user-avatar"
import { formatChatTime } from "@/lib/format"
import { topicKeys } from "@/lib/i18n"
import { useLocale } from "@/lib/locale"
import { useMessenger } from "@/lib/messenger-store"
import { ROOM_TOPICS, topicMeta } from "@/lib/topics"
import type { Chat, Contact, Message } from "@/lib/types"
import { cn } from "@/lib/utils"

export function Hall({ className }: { className?: string }) {
  const { state, contactById, lastMessage, selectChat, you } = useMessenger()
  const { t } = useLocale()
  const query = state.search.trim().toLowerCase()

  const rooms = state.chats.filter((chat) => {
    if (chat.kind !== "group") return false
    if (state.listMode === "archived" ? !chat.archived : chat.archived) return false
    if (!query) return true
    const preview = lastMessage(chat.id)?.text ?? ""
    const names = chat.participantIds
      .map((id) => contactById(id)?.name ?? "")
      .join(" ")
    return `${chat.title} ${chat.blurb ?? ""} ${chat.topic ?? ""} ${preview} ${names}`
      .toLowerCase()
      .includes(query)
  })

  return (
    <div className={cn("px-5 pb-6", className)} data-hall>
      <p className="pt-1 text-sm leading-6 text-[#6e6458]">{t("hallIntro")}</p>
      {ROOM_TOPICS.map((shelf) => {
        const shelfRooms = rooms.filter((room) => room.topic === shelf.id)
        const keys = topicKeys(shelf.id)
        return (
          <section key={shelf.id} className="mt-5" data-shelf={shelf.id}>
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <h2
                className="font-heading text-lg"
                style={{ color: shelf.ink }}
              >
                {t(keys.label)}
              </h2>
              <p className="truncate text-xs text-[#6e6458]">{t(keys.line)}</p>
            </div>
            {shelfRooms.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-[#e0d6c8] px-4 py-3 text-sm text-[#6e6458]">
                {t("noRoomsOnShelf", { shelf: t(keys.label) })}
              </p>
            ) : (
              <ul className="space-y-2">
                {shelfRooms.map((room) => (
                  <li key={room.id}>
                    <RoomCard
                      room={room}
                      youId={you.id}
                      active={state.activeChatId === room.id}
                      preview={lastMessage(room.id)}
                      names={room.participantIds
                        .map((id) => contactById(id))
                        .filter((person): person is Contact => Boolean(person))}
                      onOpen={() => selectChat(room.id)}
                    />
                  </li>
                ))}
              </ul>
            )}
          </section>
        )
      })}
    </div>
  )
}

function RoomCard({
  room,
  youId,
  active,
  preview,
  names,
  onOpen,
}: {
  room: Chat
  youId: string
  active: boolean
  preview: Message | undefined
  names: Contact[]
  onOpen: () => void
}) {
  const { t, locale } = useLocale()
  const meta = topicMeta(room.topic)
  const others = names.filter((person) => person.id !== youId)

  return (
    <button
      type="button"
      data-chat-id={room.id}
      onClick={onOpen}
      className={cn(
        "w-full rounded-[1.4rem] border px-4 py-3 text-left transition-colors",
        active
          ? "border-[#b4452a]/35 bg-[#fbf7f0]"
          : "border-[#e0d6c8] bg-[#f6f1e8]/70 hover:bg-[#fbf7f0]"
      )}
    >
      <div className="flex items-start gap-3">
        <GroupAvatar title={room.title} topic={room.topic} />
        <span className="min-w-0 flex-1">
          <span className="flex items-baseline gap-2">
            <span className="truncate font-heading text-[1.05rem] leading-tight">
              {room.title}
            </span>
            <span
              className="shrink-0 text-[10px] tracking-[0.16em] uppercase"
              style={{ color: meta.ink }}
            >
              {t(topicKeys(room.topic ?? "craft").label)}
            </span>
            {preview ? (
              <span className="ml-auto shrink-0 text-[11px] text-[#6e6458]">
                {formatChatTime(preview.sentAt, undefined, locale)}
              </span>
            ) : null}
          </span>
          <span className="mt-1 line-clamp-2 text-[13px] leading-5 text-[#6e6458]">
            {room.blurb}
          </span>
          <span className="mt-2 flex items-center gap-2">
            <span className="flex -space-x-1.5">
              {others.slice(0, 4).map((person) => (
                <UserAvatar
                  key={person.id}
                  contact={person}
                  size="sm"
                  className="ring-2 ring-[#efe8dc]"
                />
              ))}
            </span>
            <span className="min-w-0 truncate text-[11px] text-[#6e6458]">
              {preview
                ? preview.text
                : t("inTheChairs", { count: room.participantIds.length })}
            </span>
            {room.unread > 0 ? (
              <span className="ml-auto size-2 shrink-0 rounded-full bg-[#b4452a]" />
            ) : null}
          </span>
        </span>
      </div>
    </button>
  )
}
