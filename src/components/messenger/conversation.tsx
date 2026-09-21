"use client"

import { Composer } from "@/components/messenger/composer"
import { ContactInfo } from "@/components/messenger/contact-info"
import { MessageThread } from "@/components/messenger/message-thread"
import { GroupAvatar, UserAvatar } from "@/components/messenger/user-avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatLastSeen } from "@/lib/format"
import { useMessenger } from "@/lib/messenger-store"
import { cn } from "@/lib/utils"
import { ArrowLeft, MoreVertical, Search } from "lucide-react"
import { useMemo, useState } from "react"

export function Conversation({ className }: { className?: string }) {
  const {
    activeChat,
    contactById,
    you,
    selectChat,
    sendMessage,
    togglePin,
    toggleMute,
    toggleArchive,
    deleteChat,
  } = useMessenger()
  const [infoOpen, setInfoOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)

  const direct = activeChat?.contactId
    ? contactById(activeChat.contactId)
    : undefined
  const typing = activeChat?.typingContactId
    ? contactById(activeChat.typingContactId)
    : undefined

  const subtitle = useMemo(() => {
    if (!activeChat) return ""
    if (typing) {
      return activeChat.kind === "group"
        ? `${typing.name.split(" ")[0]} is typing…`
        : "typing…"
    }
    if (direct) return formatLastSeen(direct)
    const names = activeChat.participantIds
      .map((id) => (id === you.id ? "You" : contactById(id)?.name.split(" ")[0]))
      .filter(Boolean)
    return names.join(", ")
  }, [activeChat, contactById, direct, typing, you.id])

  if (!activeChat) {
    return (
      <section
        className={cn(
          "hidden h-full flex-1 flex-col items-center justify-center bg-[#222e35] md:flex",
          className
        )}
      >
        <div className="max-w-md px-8 text-center">
          <div className="mx-auto mb-6 grid size-24 place-items-center rounded-full bg-[#00a884]/10 text-[#00a884]">
            <svg viewBox="0 0 80 80" className="size-12" aria-hidden>
              <path
                fill="currentColor"
                d="M40 8c17.7 0 32 12.5 32 28S57.7 64 40 64c-3.3 0-6.5-.4-9.5-1.2L16 70l4.4-13.3C15.6 51.4 8 44.3 8 36 8 20.5 22.3 8 40 8Zm-7 24a3 3 0 1 0 0 6h3v9a3 3 0 0 0 6 0V35a3 3 0 0 0-3-3h-6Zm16 0a3 3 0 1 0 0 6h3v9a3 3 0 0 0 6 0V35a3 3 0 0 0-3-3h-6Z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-light text-[#e9edef]">Relay for Web</h1>
          <p className="mt-3 text-[15px] leading-6 text-[#8696a0]">
            Send and receive messages without keeping your phone nearby. Pick a
            chat, or start a new one — contacts reply in this demo so the thread
            stays alive.
          </p>
          <p className="mt-8 text-xs text-[#667781]">
            Double-click a bubble to react. Your history stays in this browser.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className={cn("flex h-full min-h-0 flex-1 flex-col bg-[#0b141a]", className)}>
      <header className="flex items-center gap-2 bg-[#202c33] px-2 py-2 md:px-4">
        <Button
          variant="ghost"
          size="icon"
          className="text-[#e9edef] hover:bg-white/5 md:hidden"
          onClick={() => selectChat(null)}
          aria-label="Back to chats"
        >
          <ArrowLeft className="size-5" />
        </Button>
        <button
          type="button"
          className="flex min-w-0 flex-1 items-center gap-3 rounded-md px-1 py-1 text-left hover:bg-white/5"
          data-contact-header
          onClick={() => setInfoOpen(true)}
        >
          {direct ? (
            <UserAvatar contact={direct} size="sm" />
          ) : (
            <GroupAvatar title={activeChat.title} size="sm" />
          )}
          <span className="min-w-0">
            <span className="block truncate text-[16px] text-[#e9edef]">
              {activeChat.title}
            </span>
            <span
              className={cn(
                "block truncate text-xs",
                typing ? "text-[#00a884]" : "text-[#8696a0]"
              )}
            >
              {subtitle}
            </span>
          </span>
        </button>
        <Button
          variant="ghost"
          size="icon"
          className="text-[#aebac1] hover:bg-white/5"
          aria-label="Search in conversation"
          onClick={() => setSearchOpen((open) => !open)}
        >
          <Search className="size-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger
            nativeButton={false}
            render={
              <Button
                variant="ghost"
                size="icon"
                className="text-[#aebac1] hover:bg-white/5"
                aria-label="Conversation menu"
              />
            }
          >
            <MoreVertical className="size-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="border-[#2a3942] bg-[#233138] text-[#e9edef]">
            <DropdownMenuItem onClick={() => setInfoOpen(true)}>
              Contact info
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => togglePin(activeChat.id)}>
              {activeChat.pinned ? "Unpin" : "Pin chat"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toggleMute(activeChat.id)}>
              {activeChat.muted ? "Unmute" : "Mute"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toggleArchive(activeChat.id)}>
              {activeChat.archived ? "Unarchive" : "Archive chat"}
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#2a3942]" />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => deleteChat(activeChat.id)}
            >
              Delete chat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      {searchOpen ? (
        <div className="border-b border-[#222e35] bg-[#111b21] px-4 py-2">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search this chat"
            className="h-9 w-full rounded-lg bg-[#202c33] px-3 text-sm text-[#e9edef] outline-none placeholder:text-[#8696a0]"
          />
        </div>
      ) : null}
      <div className="chat-wallpaper min-h-0 flex-1">
        <SearchableThread chatId={activeChat.id} query={searchOpen ? query : ""} />
      </div>
      <Composer onSend={(text) => sendMessage(activeChat.id, text)} />
      <ContactInfo
        chatId={activeChat.id}
        open={infoOpen}
        onOpenChange={setInfoOpen}
      />
    </section>
  )
}

function SearchableThread({ chatId, query }: { chatId: string; query: string }) {
  if (!query.trim()) {
    return <MessageThread chatId={chatId} />
  }
  return <FilteredThread chatId={chatId} query={query} />
}

function FilteredThread({ chatId, query }: { chatId: string; query: string }) {
  const { messagesFor, contactById } = useMessenger()
  const needle = query.trim().toLowerCase()
  const hits = messagesFor(chatId).filter((message) =>
    message.text.toLowerCase().includes(needle)
  )

  if (hits.length === 0) {
    return (
      <div className="flex h-full items-center justify-center px-8 text-center text-sm text-[#8696a0]">
        No messages in this chat match “{query.trim()}”.
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col gap-2 overflow-y-auto px-4 py-4">
      {hits.map((message) => {
        const sender = contactById(message.senderId)
        return (
          <article
            key={message.id}
            className="rounded-lg bg-[#202c33] px-3 py-2 text-sm text-[#e9edef]"
          >
            <p className="text-xs text-[#00a884]">{sender?.name}</p>
            <p className="mt-1 whitespace-pre-wrap">{message.text}</p>
          </article>
        )
      })}
    </div>
  )
}
