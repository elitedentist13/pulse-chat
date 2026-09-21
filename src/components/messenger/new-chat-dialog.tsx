"use client"

import { UserAvatar } from "@/components/messenger/user-avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useMessenger } from "@/lib/messenger-store"
import { useMemo, useState } from "react"

export function NewChatDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { state, you, startChatWith } = useMessenger()
  const [query, setQuery] = useState("")

  const contacts = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return state.contacts
      .filter((contact) => contact.id !== you.id)
      .filter((contact) =>
        `${contact.name} ${contact.phone}`.toLowerCase().includes(needle)
      )
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [query, state.contacts, you.id])

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) setQuery("")
      }}
    >
      <DialogContent className="border-[#2a3942] bg-[#111b21] text-[#e9edef] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New chat</DialogTitle>
          <DialogDescription className="text-[#8696a0]">
            Search your contacts and start a conversation.
          </DialogDescription>
        </DialogHeader>
        <Input
          value={query}
          placeholder="Search name or number"
          onChange={(event) => setQuery(event.target.value)}
          className="border-0 bg-[#202c33] text-[#e9edef] placeholder:text-[#8696a0]"
        />
        <div className="max-h-80 overflow-y-auto">
          {contacts.length === 0 ? (
            <p className="px-1 py-8 text-center text-sm text-[#8696a0]">
              No contacts match “{query}”.
            </p>
          ) : (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <Button
                    variant="ghost"
                    className="h-auto w-full justify-start gap-3 rounded-none px-2 py-2.5 text-left hover:bg-white/5"
                    onClick={() => {
                      startChatWith(contact.id)
                      onOpenChange(false)
                    }}
                  >
                    <UserAvatar contact={contact} size="md" />
                    <span className="min-w-0">
                      <span className="block truncate text-[#e9edef]">
                        {contact.name}
                      </span>
                      <span className="block truncate text-xs font-normal text-[#8696a0]">
                        {contact.about}
                      </span>
                    </span>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
