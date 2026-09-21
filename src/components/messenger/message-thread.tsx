"use client"

import { ReceiptMark } from "@/components/messenger/message-ticks"
import { UserAvatar } from "@/components/messenger/user-avatar"
import { formatClock, formatDateSeparator, sameDay } from "@/lib/format"
import { useMessenger } from "@/lib/messenger-store"
import { topicMeta } from "@/lib/topics"
import type { Chat, Contact } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useEffect, useRef } from "react"

export function MessageThread({ chatId }: { chatId: string }) {
  const { messagesFor, contactById, you, state, reactToMessage } = useMessenger()
  const messages = messagesFor(chatId)
  const bottomRef = useRef<HTMLDivElement>(null)
  const chat = state.chats.find((item) => item.id === chatId)
  const typingContact = chat?.typingContactId
    ? contactById(chat.typingContactId)
    : undefined
  const members =
    chat?.kind === "group"
      ? chat.participantIds
          .map((id) => contactById(id))
          .filter((person): person is Contact => Boolean(person))
      : []

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" })
  }, [messages.length, typingContact?.id, chatId])

  if (messages.length === 0) {
    return (
      <div className="flex h-full flex-1 flex-col items-center justify-center px-8 text-center">
        {chat?.kind === "group" ? (
          <div className="mb-8 w-full max-w-md">
            <RoomIntro chat={chat} members={members} youId={you.id} />
          </div>
        ) : null}
        <p className="font-heading text-2xl">The table is empty.</p>
        <p className="mt-2 max-w-sm text-sm text-[#6e6458]">
          Write the first line. They’ll answer from the other chair.
        </p>
      </div>
    )
  }

  return (
    <div className="h-full min-h-0 w-full flex-1 overflow-y-auto px-4 py-6 md:px-10">
      <div className="mx-auto max-w-2xl">
        {chat?.kind === "group" ? (
          <RoomIntro chat={chat} members={members} youId={you.id} />
        ) : null}
        {messages.map((message, index) => {
          const previous = messages[index - 1]
          const showDate = !previous || !sameDay(previous.sentAt, message.sentAt)
          const fromMe = message.senderId === you.id
          const sender = contactById(message.senderId)
          const showSender =
            !previous || previous.senderId !== message.senderId || showDate
          const isLastFromMe =
            fromMe &&
            !messages.slice(index + 1).some((item) => item.senderId === you.id)

          return (
            <div key={message.id} className="w-full">
              {showDate ? (
                <p className="my-6 text-center font-heading text-xs tracking-[0.2em] text-[#6e6458] uppercase">
                  {formatDateSeparator(message.sentAt)}
                </p>
              ) : null}
              <article
                className={cn(
                  "mb-4 w-full max-w-[34rem]",
                  fromMe ? "ml-auto" : "mr-auto"
                )}
              >
                {showSender ? (
                  <div className="mb-1.5 flex items-baseline justify-between gap-3 px-1">
                    <p className="font-heading text-sm text-[#1c1814]">
                      {fromMe ? "You" : sender?.name}
                    </p>
                    <p className="text-[11px] text-[#6e6458]">
                      {formatClock(message.sentAt)}
                    </p>
                  </div>
                ) : null}
                <button
                  type="button"
                  onDoubleClick={() => reactToMessage(message.id)}
                  className={cn(
                    "relative w-full rounded-[1.4rem] px-4 py-3 text-left text-[15px] leading-6",
                    fromMe
                      ? "bg-[#f0d9c4] text-[#1c1814]"
                      : "bg-white text-[#1c1814] shadow-[0_10px_30px_-24px_rgba(28,24,20,0.7)] ring-1 ring-[#e0d6c8]",
                    message.reaction && "mb-3"
                  )}
                >
                  <span className="whitespace-pre-wrap break-words">
                    {message.text}
                  </span>
                  {message.reaction ? (
                    <span className="absolute -bottom-3 left-4 rounded-full bg-white px-1.5 text-xs shadow-sm ring-1 ring-[#e0d6c8]">
                      {message.reaction}
                    </span>
                  ) : null}
                </button>
                {isLastFromMe ? (
                  <p className="mt-1 px-1 text-right">
                    <ReceiptMark status={message.status} />
                  </p>
                ) : null}
              </article>
            </div>
          )
        })}
        {typingContact ? (
          <div className="mb-6 flex items-center gap-3 text-sm text-[#6e6458]">
            <UserAvatar contact={typingContact} size="sm" />
            <span className="italic">
              {typingContact.name.split(" ")[0]} is still writing
              <span className="ml-1 inline-flex gap-0.5">
                <span className="size-1 animate-bounce rounded-full bg-[#b4452a] [animation-delay:-0.2s]" />
                <span className="size-1 animate-bounce rounded-full bg-[#b4452a] [animation-delay:-0.1s]" />
                <span className="size-1 animate-bounce rounded-full bg-[#b4452a]" />
              </span>
            </span>
          </div>
        ) : null}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}

function RoomIntro({
  chat,
  members,
  youId,
}: {
  chat: Chat
  members: Contact[]
  youId: string
}) {
  const room = topicMeta(chat.topic)
  const others = members.filter((person) => person.id !== youId)

  return (
    <aside
      data-room-intro={chat.id}
      className="mb-8 rounded-[1.6rem] border border-[#e0d6c8] bg-[#fbf7f0] px-5 py-4"
    >
      <p
        className="text-[10px] tracking-[0.2em] uppercase"
        style={{ color: room.ink }}
      >
        {room.label}
      </p>
      <p className="mt-1 font-heading text-xl leading-tight">{chat.title}</p>
      <p className="mt-2 text-[15px] leading-6 text-[#6e6458]">
        {chat.blurb ?? room.line}
      </p>
      <div className="mt-3 flex items-center gap-2">
        <span className="flex -space-x-1.5">
          {others.slice(0, 5).map((person) => (
            <UserAvatar
              key={person.id}
              contact={person}
              size="sm"
              className="ring-2 ring-[#fbf7f0]"
            />
          ))}
        </span>
        <p className="min-w-0 truncate text-xs text-[#6e6458]">
          {others.map((person) => person.name.split(" ")[0]).join(" · ")}
          {others.length ? " · You" : "You"}
        </p>
      </div>
    </aside>
  )
}
