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
import { ArrowLeft, MoreHorizontal, Search } from "lucide-react"
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
        ? `${typing.name.split(" ")[0]} is still writing…`
        : "still writing…"
    }
    if (direct) return formatLastSeen(direct)
    const names = activeChat.participantIds
      .map((id) => (id === you.id ? "You" : contactById(id)?.name.split(" ")[0]))
      .filter(Boolean)
    return `${names.length} in the room · ${names.join(", ")}`
  }, [activeChat, contactById, direct, typing, you.id])

  if (!activeChat) {
    return (
      <section
        className={cn(
          "stage-paper hidden h-full flex-1 flex-col items-center justify-center md:flex",
          className
        )}
      >
        <div className="max-w-md px-8 text-center">
          <p className="text-xs tracking-[0.28em] text-[#b4452a] uppercase">
            A table, not a feed
          </p>
          <h1 className="mt-3 font-heading text-5xl leading-none text-[#1c1814]">
            Sit down.
          </h1>
          <p className="mt-4 text-[16px] leading-7 text-[#6e6458]">
            Kith keeps one conversation in the room. Pick a person from the
            table — they write back in this demo, so the talk stays alive.
          </p>
          <p className="mt-8 text-xs text-[#6e6458]">
            Double-click a note to leave a heart. Nothing leaves this browser.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section
      className={cn(
        "flex h-full min-h-0 flex-1 flex-col bg-[#faf7f1]",
        className
      )}
    >
      <header className="flex items-center gap-2 border-b border-[#e0d6c8] bg-[#fbf7f0]/90 px-3 py-3 backdrop-blur md:px-8">
        <Button
          variant="ghost"
          size="icon"
          className="text-[#1c1814] hover:bg-[#efe8dc] md:hidden"
          onClick={() => selectChat(null)}
          aria-label="Back to chats"
        >
          <ArrowLeft className="size-5" />
        </Button>
        <button
          type="button"
          className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl px-1 py-1 text-left hover:bg-[#efe8dc]/70"
          data-contact-header
          onClick={() => setInfoOpen(true)}
        >
          {direct ? (
            <UserAvatar contact={direct} size="md" />
          ) : (
            <GroupAvatar title={activeChat.title} size="md" />
          )}
          <span className="min-w-0">
            <span className="block truncate font-heading text-xl leading-tight">
              {activeChat.title}
            </span>
            <span
              className={cn(
                "block truncate text-xs",
                typing ? "text-[#b4452a]" : "text-[#6e6458]"
              )}
            >
              {subtitle}
            </span>
          </span>
        </button>
        <Button
          variant="ghost"
          size="icon"
          className="text-[#6e6458] hover:bg-[#efe8dc]"
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
                className="text-[#6e6458] hover:bg-[#efe8dc]"
                aria-label="Conversation menu"
              />
            }
          >
            <MoreHorizontal className="size-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setInfoOpen(true)}>
              Who’s here
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => togglePin(activeChat.id)}>
              {activeChat.pinned ? "Leave the table" : "Keep on the table"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toggleMute(activeChat.id)}>
              {activeChat.muted ? "Let it speak" : "Keep it quiet"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toggleArchive(activeChat.id)}>
              {activeChat.archived ? "Bring back" : "File away"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => deleteChat(activeChat.id)}
            >
              Tear up
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      {searchOpen ? (
        <div className="border-b border-[#e0d6c8] bg-[#fbf7f0] px-4 py-2 md:px-8">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search this conversation"
            className="h-9 w-full rounded-full border border-[#e0d6c8] bg-white px-4 text-sm outline-none placeholder:text-[#6e6458]"
          />
        </div>
      ) : null}
      <div className="stage-paper min-h-0 flex-1">
        <SearchableThread chatId={activeChat.id} query={searchOpen ? query : ""} />
      </div>
      <Composer
        toName={direct ? direct.name.split(" ")[0] : activeChat.title}
        onSend={(text) => sendMessage(activeChat.id, text)}
      />
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
      <div className="flex h-full items-center justify-center px-8 text-center text-sm text-[#6e6458]">
        No notes in this conversation match “{query.trim()}”.
      </div>
    )
  }

  return (
    <div className="mx-auto flex h-full max-w-2xl flex-col gap-3 overflow-y-auto px-4 py-6">
      {hits.map((message) => {
        const sender = contactById(message.senderId)
        return (
          <article
            key={message.id}
            className="rounded-[1.4rem] bg-white px-4 py-3 ring-1 ring-[#e0d6c8]"
          >
            <p className="font-heading text-sm">{sender?.name}</p>
            <p className="mt-1 whitespace-pre-wrap text-[15px] leading-6">
              {message.text}
            </p>
          </article>
        )
      })}
    </div>
  )
}
