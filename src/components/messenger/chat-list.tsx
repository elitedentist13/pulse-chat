"use client"

import { ChatRow } from "@/components/messenger/chat-row"
import { Hall } from "@/components/messenger/hall"
import { NewChatDialog } from "@/components/messenger/new-chat-dialog"
import { StatusViewer } from "@/components/messenger/status-viewer"
import { AppNav } from "@/components/yard/app-nav"
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
  MoreHorizontal,
  PenLine,
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
      ? `Nothing matches “${state.search.trim()}”.`
      : state.chatFilter === "unread"
        ? "Nobody is waiting on you."
        : state.chatFilter === "groups"
          ? "The hall is empty."
          : state.listMode === "archived"
            ? "The drawer is empty."
            : "Invite someone to the table."

  return (
    <section
      className={cn(
        "desk-grain flex h-full min-h-0 w-full flex-col border-r border-[#e0d6c8]",
        className
      )}
    >
      <header className="flex items-end justify-between gap-3 px-5 pt-6 pb-4">
        {state.listMode === "archived" ? (
          <button
            type="button"
            className="flex items-center gap-2 text-sm text-[#6e6458] hover:text-[#1c1814]"
            onClick={() => setListMode("chats")}
            aria-label="Back to chats"
          >
            <ArrowLeft className="size-4" />
            Back to the table
          </button>
        ) : (
          <div>
            <p className="font-heading text-3xl leading-none tracking-tight">
              Notes
            </p>
            <p className="mt-1 text-sm text-[#6e6458]">
              {state.chatFilter === "groups"
                ? "The hall — adjunct rooms"
                : "Sit down when a porch page needs a reply"}
            </p>
          </div>
        )}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="text-[#6e6458] hover:bg-[#e7dccb] hover:text-[#1c1814]"
            onClick={() => setNewChatOpen(true)}
            aria-label="New chat"
          >
            <PenLine className="size-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger
              nativeButton={false}
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[#6e6458] hover:bg-[#e7dccb] hover:text-[#1c1814]"
                  aria-label="Menu"
                />
              }
            >
              <MoreHorizontal className="size-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setNewChatOpen(true)}>
                Write someone new
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setListMode("archived")}>
                Filed away
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={resetDemo}>
                <RotateCcw className="size-4" />
                Reset the table
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      {state.listMode === "chats" ? (
        <div className="px-5 pb-3">
          <AppNav />
        </div>
      ) : null}

      {state.listMode === "chats" ? (
        <div className="flex gap-2 overflow-x-auto px-5 pb-3">
          {statusItems.map(({ status, contact }) =>
            contact ? (
              <button
                key={status.id}
                type="button"
                className={cn(
                  "max-w-[11rem] shrink-0 rounded-2xl border px-3 py-2 text-left transition-colors",
                  status.viewed
                    ? "border-[#e0d6c8] bg-[#f6f1e8]"
                    : "border-[#b4452a]/30 bg-[#fbf7f0]"
                )}
                onClick={() => {
                  viewStatus(status.id)
                  setStatusId(status.id)
                }}
              >
                <span className="block font-heading text-sm">
                  {contact.id === you.id ? "Your mood" : contact.name.split(" ")[0]}
                </span>
                <span className="mt-0.5 line-clamp-2 text-[11px] leading-4 text-[#6e6458]">
                  {status.text}
                </span>
              </button>
            ) : null
          )}
        </div>
      ) : (
        <p className="px-5 pb-3 text-sm text-[#6e6458]">
          {archivedCount} filed conversation{archivedCount === 1 ? "" : "s"}
        </p>
      )}

      <div className="px-5 pb-3">
        <div className="flex items-center gap-2 rounded-full border border-[#e0d6c8] bg-[#fbf7f0] px-3">
          <Search className="size-4 text-[#6e6458]" />
          <Input
            value={state.search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Look through the table"
            className="h-9 border-0 bg-transparent px-0 text-sm shadow-none placeholder:text-[#6e6458] focus-visible:ring-0 dark:bg-transparent"
          />
        </div>
      </div>

      {state.listMode === "chats" ? (
        <Tabs
          value={state.chatFilter}
          onValueChange={(value) =>
            setFilter(value as typeof state.chatFilter)
          }
          className="px-5 pb-2"
        >
          <TabsList className="h-9 w-full bg-[#e7dccb]">
            <TabsTrigger value="all">Open</TabsTrigger>
            <TabsTrigger value="unread">Waiting</TabsTrigger>
            <TabsTrigger value="groups">Hall</TabsTrigger>
          </TabsList>
        </Tabs>
      ) : null}

      {state.listMode === "chats" && archivedCount > 0 ? (
        <button
          type="button"
          onClick={() => setListMode("archived")}
          className="mx-5 mb-2 flex items-center gap-2 rounded-2xl border border-dashed border-[#e0d6c8] px-3 py-2 text-left text-sm text-[#6e6458] hover:bg-[#f6f1e8]"
        >
          <Archive className="size-4" />
          Filed away
          <span className="ml-auto font-heading text-[#1c1814]">{archivedCount}</span>
        </button>
      ) : null}

      <div className="min-h-0 flex-1 overflow-y-auto">
        {state.listMode === "chats" && state.chatFilter === "groups" ? (
          <Hall />
        ) : visibleChats.length === 0 ? (
          <div className="px-8 py-16 text-center">
            <p className="font-heading text-xl">Quiet for now.</p>
            <p className="mt-2 text-sm text-[#6e6458]">{emptyCopy}</p>
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
