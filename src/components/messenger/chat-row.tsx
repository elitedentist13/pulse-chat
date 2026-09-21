"use client"

import { ReceiptMark } from "@/components/messenger/message-ticks"
import { GroupAvatar, UserAvatar } from "@/components/messenger/user-avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatChatTime } from "@/lib/format"
import { useMessenger } from "@/lib/messenger-store"
import { cn } from "@/lib/utils"
import type { Chat } from "@/lib/types"
import { BellOff, MoreHorizontal, Pin } from "lucide-react"

export function ChatRow({ chat }: { chat: Chat }) {
  const {
    you,
    contactById,
    lastMessage,
    selectChat,
    state,
    togglePin,
    toggleMute,
    toggleArchive,
    deleteChat,
    markUnread,
  } = useMessenger()
  const message = lastMessage(chat.id)
  const direct = chat.contactId ? contactById(chat.contactId) : undefined
  const typing = chat.typingContactId
    ? contactById(chat.typingContactId)
    : undefined
  const fromMe = message?.senderId === you.id
  const sender =
    chat.kind === "group" && message && !fromMe
      ? contactById(message.senderId)
      : undefined
  const active = state.activeChatId === chat.id

  return (
    <div
      className={cn(
        "group relative flex w-full items-stretch",
        active ? "bg-[#fbf7f0]" : "hover:bg-[#f6f1e8]/80"
      )}
    >
      {active ? (
        <span className="absolute inset-y-3 left-0 w-[3px] rounded-r-full bg-[#b4452a]" />
      ) : null}
      <button
        type="button"
        className="flex min-w-0 flex-1 cursor-pointer items-start gap-3 px-5 py-4 text-left"
        data-chat-id={chat.id}
        onClick={() => selectChat(chat.id)}
      >
        {direct ? (
          <UserAvatar contact={direct} size="md" />
        ) : (
          <GroupAvatar title={chat.title} />
        )}
        <span className="min-w-0 flex-1">
          <span className="flex items-baseline gap-2">
            <span className="truncate font-heading text-[1.15rem] leading-tight text-[#1c1814]">
              {chat.title}
            </span>
            {chat.pinned ? (
              <Pin className="size-3 shrink-0 text-[#b4452a]" />
            ) : null}
            {chat.muted ? (
              <BellOff className="size-3 shrink-0 text-[#6e6458]" />
            ) : null}
            <span className="ml-auto shrink-0 text-[11px] text-[#6e6458]">
              {message ? formatChatTime(message.sentAt) : ""}
            </span>
          </span>
          <span className="mt-1 flex items-start gap-2 text-[13px] leading-5">
            {typing ? (
              <span className="truncate italic text-[#b4452a]">
                {chat.kind === "group"
                  ? `${typing.name.split(" ")[0]} is still writing…`
                  : "still writing…"}
              </span>
            ) : (
              <span
                className={cn(
                  "min-w-0 flex-1 truncate italic",
                  chat.unread > 0 ? "text-[#1c1814]" : "text-[#6e6458]"
                )}
              >
                {fromMe ? "You · " : sender ? `${sender.name.split(" ")[0]} · ` : null}
                {message?.text ?? "Nothing on the table yet."}
              </span>
            )}
            {fromMe && message && !typing ? (
              <ReceiptMark status={message.status} />
            ) : null}
            {chat.unread > 0 ? (
              <span className="mt-1 ml-auto size-2 shrink-0 rounded-full bg-[#b4452a]" />
            ) : null}
          </span>
        </span>
      </button>
      <DropdownMenu>
        <DropdownMenuTrigger
          nativeButton={false}
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="absolute top-3 right-2 text-[#6e6458] opacity-0 hover:bg-[#e7dccb] hover:text-[#1c1814] group-hover:opacity-100 data-popup-open:opacity-100"
              aria-label={`Options for ${chat.title}`}
            />
          }
        >
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => togglePin(chat.id)}>
            {chat.pinned ? "Leave the table" : "Keep on the table"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => toggleMute(chat.id)}>
            {chat.muted ? "Let it speak" : "Keep it quiet"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => markUnread(chat.id)}>
            Mark as waiting
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => toggleArchive(chat.id)}>
            {chat.archived ? "Bring back" : "File away"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => deleteChat(chat.id)}
          >
            Tear up
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
