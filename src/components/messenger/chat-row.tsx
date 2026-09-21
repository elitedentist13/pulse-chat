"use client"

import { GroupAvatar, UserAvatar } from "@/components/messenger/user-avatar"
import { MessageTicks } from "@/components/messenger/message-ticks"
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
import { BellOff, MoreVertical, Pin } from "lucide-react"

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
        "group relative flex w-full items-stretch border-b border-[#222e35]",
        active ? "bg-[#2a3942]" : "hover:bg-[#202c33]"
      )}
    >
      <button
        type="button"
        className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 px-3 py-3 text-left"
        data-chat-id={chat.id}
        onClick={() => selectChat(chat.id)}
      >
        {direct ? (
          <UserAvatar contact={direct} size="md" />
        ) : (
          <GroupAvatar title={chat.title} />
        )}
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="truncate text-[16px] text-[#e9edef]">
              {chat.title}
            </span>
            {chat.pinned ? (
              <Pin className="size-3.5 shrink-0 fill-[#8696a0] text-[#8696a0]" />
            ) : null}
            {chat.muted ? (
              <BellOff className="size-3.5 shrink-0 text-[#8696a0]" />
            ) : null}
            <span className="ml-auto shrink-0 text-xs text-[#8696a0]">
              {message ? formatChatTime(message.sentAt) : ""}
            </span>
          </span>
          <span className="mt-0.5 flex items-center gap-1 text-sm">
            {typing ? (
              <span className="truncate text-[#00a884]">
                {chat.kind === "group"
                  ? `${typing.name.split(" ")[0]} is typing…`
                  : "typing…"}
              </span>
            ) : (
              <>
                {fromMe && message ? (
                  <MessageTicks status={message.status} className="text-[#8696a0]" />
                ) : null}
                <span
                  className={cn(
                    "truncate",
                    chat.unread > 0 ? "font-medium text-[#e9edef]" : "text-[#8696a0]"
                  )}
                >
                  {sender ? `${sender.name.split(" ")[0]}: ` : null}
                  {message?.text ?? "Start a conversation"}
                </span>
              </>
            )}
            {chat.unread > 0 ? (
              <span className="ml-auto grid min-w-5 place-items-center rounded-full bg-[#00a884] px-1.5 text-[11px] font-semibold text-[#111b21]">
                {chat.unread}
              </span>
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
              className="absolute top-3 right-2 text-[#8696a0] opacity-0 hover:bg-white/5 hover:text-[#e9edef] group-hover:opacity-100 data-popup-open:opacity-100"
              aria-label={`Chat options for ${chat.title}`}
            />
          }
        >
          <MoreVertical className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="border-[#2a3942] bg-[#233138] text-[#e9edef]">
          <DropdownMenuItem onClick={() => togglePin(chat.id)}>
            {chat.pinned ? "Unpin" : "Pin chat"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => toggleMute(chat.id)}>
            {chat.muted ? "Unmute" : "Mute notifications"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => markUnread(chat.id)}>
            Mark as unread
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => toggleArchive(chat.id)}>
            {chat.archived ? "Unarchive" : "Archive chat"}
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-[#2a3942]" />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => deleteChat(chat.id)}
          >
            Delete chat
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
