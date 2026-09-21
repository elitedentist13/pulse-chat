"use client"

import { MessageTicks } from "@/components/messenger/message-ticks"
import { UserAvatar } from "@/components/messenger/user-avatar"
import { formatClock, formatDateSeparator, sameDay } from "@/lib/format"
import { useMessenger } from "@/lib/messenger-store"
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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" })
  }, [messages.length, typingContact?.id, chatId])

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <p className="rounded-full bg-black/30 px-4 py-1.5 text-sm text-[#e9edef]">
          No messages here yet. Say hello.
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-0 w-full flex-1 overflow-y-auto px-3 py-3 md:px-8">
      {messages.map((message, index) => {
        const previous = messages[index - 1]
        const showDate =
          !previous || !sameDay(previous.sentAt, message.sentAt)
        const fromMe = message.senderId === you.id
        const sender = contactById(message.senderId)
        const showSender =
          !fromMe &&
          (!previous ||
            previous.senderId !== message.senderId ||
            showDate)
        const isGroup = chat?.kind === "group"

        return (
          <div key={message.id} className="w-full">
            {showDate ? (
              <div className="my-3 flex justify-center">
                <span className="rounded-md bg-[#182229] px-3 py-1 text-xs font-medium text-[#8696a0] shadow-sm">
                  {formatDateSeparator(message.sentAt)}
                </span>
              </div>
            ) : null}
            <div
              className={cn(
                "mb-0.5 flex w-full",
                fromMe ? "justify-end" : "justify-start"
              )}
            >
              <button
                type="button"
                onDoubleClick={() => reactToMessage(message.id)}
                className={cn(
                  "relative max-w-[85%] rounded-lg px-2.5 pt-1.5 pb-1 text-left text-[14.5px] leading-5 text-[#e9edef] shadow-sm md:max-w-[65%]",
                  fromMe
                    ? "rounded-tr-none bg-[#005c4b]"
                    : "rounded-tl-none bg-[#202c33]",
                  message.reaction && "mb-3"
                )}
              >
                {isGroup && showSender && sender ? (
                  <span
                    className="mb-0.5 block text-xs font-semibold"
                    style={{ color: sender.color }}
                  >
                    {sender.name}
                  </span>
                ) : null}
                <span className="whitespace-pre-wrap break-words">
                  {message.text}
                </span>
                <span className="mt-1 flex items-center justify-end gap-1 text-[11px] text-[#ffffff99]">
                  {formatClock(message.sentAt)}
                  {fromMe ? <MessageTicks status={message.status} /> : null}
                </span>
                {message.reaction ? (
                  <span className="absolute -bottom-3 left-2 rounded-full bg-[#202c33] px-1.5 text-xs shadow ring-1 ring-black/40">
                    {message.reaction}
                  </span>
                ) : null}
              </button>
            </div>
          </div>
        )
      })}
      {typingContact ? (
        <div className="mt-2 flex items-center gap-2 text-sm text-[#8696a0]">
          <UserAvatar contact={typingContact} size="sm" />
          <span className="rounded-lg rounded-tl-none bg-[#202c33] px-3 py-2">
            <span className="inline-flex gap-1">
              <span className="size-1.5 animate-bounce rounded-full bg-[#8696a0] [animation-delay:-0.2s]" />
              <span className="size-1.5 animate-bounce rounded-full bg-[#8696a0] [animation-delay:-0.1s]" />
              <span className="size-1.5 animate-bounce rounded-full bg-[#8696a0]" />
            </span>
          </span>
        </div>
      ) : null}
      <div ref={bottomRef} />
    </div>
  )
}
