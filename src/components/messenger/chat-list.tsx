"use client"

import { ChatRow } from "@/components/messenger/chat-row"
import { NewChatDialog } from "@/components/messenger/new-chat-dialog"
import { StatusViewer } from "@/components/messenger/status-viewer"
import { GroupAvatar, UserAvatar } from "@/components/messenger/user-avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMessenger } from "@/lib/messenger-store"
import { cn } from "@/lib/utils"
import {
  Archive,
  ArrowLeft,
  MessageSquarePlus,
  MoreVertical,
  RotateCcw,
  Search,
} from "lucide-react"
import { useCallback, useMemo, useState } from "react"

export function ChatList({ className }: { className?: string }) {
  const {
    you,
    visibleChats,
    archivedCount,
    state,
    setSearch,
    setFilter,
    setListMode,
    statuses,
    contactById,
    resetDemo,
    viewStatus,
  } = useMessenger()
  const [newChatOpen, setNewChatOpen] = useState(false)
  const [statusId, setStatusId] = useState<string | null>(null)
  const closeStatus = useCallback(() => setStatusId(null), [])

  const statusItems = useMemo(
    () =>
      statuses
        .map((status) => ({
          status,
          contact: contactById(status.contactId),
        }))
        .filter((item) => item.contact),
    [contactById, statuses]
  )

  const emptyCopy =
    state.search.trim()
      ? `No chats match “${state.search.trim()}”.`
      : state.chatFilter === "unread"
        ? "No unread chats."
        : state.chatFilter === "groups"
          ? "No group chats yet."
          : state.listMode === "archived"
            ? "No archived chats."
            : "Start a conversation from the new chat button."

  return (
    <section
      className={cn(
        "flex h-full min-h-0 w-full flex-col border-r border-[#222e35] bg-[#111b21]",
        className
      )}
    >
      <header className="flex items-center gap-3 bg-[#202c33] px-3 py-2.5">
        {state.listMode === "archived" ? (
          <Button
            variant="ghost"
            size="icon"
            className="text-[#e9edef] hover:bg-white/5"
            onClick={() => setListMode("chats")}
            aria-label="Back to chats"
          >
            <ArrowLeft className="size-5" />
          </Button>
        ) : (
          <UserAvatar contact={you} size="md" />
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-[16px] font-medium text-[#e9edef]">
            {state.listMode === "archived" ? "Archived" : you.name}
          </p>
          <p className="truncate text-xs text-[#8696a0]">
            {state.listMode === "archived"
              ? `${archivedCount} chat${archivedCount === 1 ? "" : "s"}`
              : "Relay for Web"}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-[#aebac1] hover:bg-white/5 hover:text-[#e9edef]"
          onClick={() => setNewChatOpen(true)}
          aria-label="New chat"
        >
          <MessageSquarePlus className="size-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger
            nativeButton={false}
            render={
              <Button
                variant="ghost"
                size="icon"
                className="text-[#aebac1] hover:bg-white/5 hover:text-[#e9edef]"
                aria-label="Menu"
              />
            }
          >
            <MoreVertical className="size-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="border-[#2a3942] bg-[#233138] text-[#e9edef]">
            <DropdownMenuItem onClick={() => setNewChatOpen(true)}>
              New chat
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setListMode("archived")}>
              Archived chats
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#2a3942]" />
            <DropdownMenuItem onClick={resetDemo}>
              <RotateCcw className="size-4" />
              Reset demo data
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {state.listMode === "chats" ? (
        <div className="flex gap-2 overflow-x-auto px-3 pt-3 pb-1">
          {statusItems.map(({ status, contact }) =>
            contact ? (
              <button
                key={status.id}
                type="button"
                className="flex w-16 shrink-0 flex-col items-center gap-1"
                onClick={() => {
                  viewStatus(status.id)
                  setStatusId(status.id)
                }}
              >
                <UserAvatar
                  contact={contact}
                  size="md"
                  ring={status.viewed ? "seen" : "unseen"}
                />
                <span className="w-full truncate text-center text-[11px] text-[#8696a0]">
                  {contact.id === you.id ? "My status" : contact.name.split(" ")[0]}
                </span>
              </button>
            ) : null
          )}
        </div>
      ) : null}

      <div className="px-3 py-2">
        <div className="flex items-center gap-2 rounded-lg bg-[#202c33] px-3">
          <Search className="size-4 text-[#8696a0]" />
          <Input
            value={state.search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search or start a new chat"
            className="h-9 border-0 bg-transparent px-0 text-sm text-[#e9edef] shadow-none placeholder:text-[#8696a0] focus-visible:ring-0 dark:bg-transparent"
          />
        </div>
      </div>

      {state.listMode === "chats" ? (
        <Tabs
          value={state.chatFilter}
          onValueChange={(value) =>
            setFilter(value as typeof state.chatFilter)
          }
          className="px-3 pb-1"
        >
          <TabsList className="h-8 w-full bg-[#202c33]">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
          </TabsList>
        </Tabs>
      ) : null}

      {state.listMode === "chats" && archivedCount > 0 ? (
        <button
          type="button"
          onClick={() => setListMode("archived")}
          className="flex items-center gap-3 px-4 py-3 text-left text-sm text-[#e9edef] hover:bg-[#202c33]"
        >
          <span className="grid size-10 place-items-center rounded-full bg-[#00a884]/15 text-[#00a884]">
            <Archive className="size-5" />
          </span>
          Archived
          <span className="ml-auto text-xs text-[#8696a0]">{archivedCount}</span>
        </button>
      ) : null}

      <div className="min-h-0 flex-1 overflow-y-auto">
        {visibleChats.length === 0 ? (
          <div className="px-8 py-16 text-center">
            <GroupAvatar title="Empty" className="mx-auto mb-3 opacity-70" />
            <p className="text-sm text-[#8696a0]">{emptyCopy}</p>
          </div>
        ) : (
          visibleChats.map((chat) => <ChatRow key={chat.id} chat={chat} />)
        )}
      </div>

      <NewChatDialog open={newChatOpen} onOpenChange={setNewChatOpen} />
      <StatusViewer statusId={statusId} onClose={closeStatus} />
    </section>
  )
}
