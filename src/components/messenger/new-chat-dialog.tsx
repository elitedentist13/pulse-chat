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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">
            Pull up a chair
          </DialogTitle>
          <DialogDescription>
            Find someone you already know and start a note.
          </DialogDescription>
        </DialogHeader>
        <Input
          value={query}
          placeholder="Search name or number"
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="max-h-80 overflow-y-auto">
          {contacts.length === 0 ? (
            <p className="px-1 py-8 text-center text-sm text-[#6e6458]">
              No one matches “{query}”.
            </p>
          ) : (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <Button
                    variant="ghost"
                    className="h-auto w-full justify-start gap-3 rounded-xl px-2 py-2.5 text-left"
                    onClick={() => {
                      startChatWith(contact.id)
                      onOpenChange(false)
                    }}
                  >
                    <UserAvatar contact={contact} size="md" />
                    <span className="min-w-0">
                      <span className="block truncate font-heading">
                        {contact.name}
                      </span>
                      <span className="block truncate text-xs font-normal text-[#6e6458]">
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
