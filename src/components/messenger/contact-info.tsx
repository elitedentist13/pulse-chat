"use client"

import { GroupAvatar, UserAvatar } from "@/components/messenger/user-avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { formatLastSeen } from "@/lib/format"
import { useMessenger } from "@/lib/messenger-store"
import { BellOff, Pin, Trash2 } from "lucide-react"

export function ContactInfo({
  chatId,
  open,
  onOpenChange,
}: {
  chatId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const {
    state,
    contactById,
    you,
    toggleMute,
    togglePin,
    deleteChat,
  } = useMessenger()
  const chat = state.chats.find((item) => item.id === chatId)
  if (!chat) return null

  const direct = chat.contactId ? contactById(chat.contactId) : undefined
  const members = chat.participantIds
    .map((id) => contactById(id))
    .filter(Boolean)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full border-[#222e35] bg-[#111b21] p-0 text-[#e9edef] sm:max-w-sm">
        <div className="flex flex-col items-center bg-[#202c33] px-6 pt-14 pb-6 text-center">
          {direct ? (
            <UserAvatar contact={direct} size="xl" />
          ) : (
            <GroupAvatar title={chat.title} size="xl" />
          )}
          <SheetHeader className="items-center p-0 pt-4">
            <SheetTitle className="text-xl text-[#e9edef]">{chat.title}</SheetTitle>
            <SheetDescription className="text-[#8696a0]">
              {direct
                ? direct.phone
                : `Group · ${chat.participantIds.length} members`}
            </SheetDescription>
          </SheetHeader>
        </div>
        <div className="space-y-1 px-5 py-4">
          <p className="text-sm text-[#8696a0]">
            {direct ? formatLastSeen(direct) : "Add group description"}
          </p>
          <p className="text-[15px] text-[#e9edef]">
            {direct?.about ?? "Weekend games, rotating snacks, no excuses."}
          </p>
        </div>
        <Separator className="bg-[#222e35]" />
        {chat.kind === "group" ? (
          <div className="px-5 py-4">
            <p className="mb-3 text-xs font-medium tracking-wide text-[#00a884] uppercase">
              {members.length} members
            </p>
            <ul className="space-y-3">
              {members.map((member) =>
                member ? (
                  <li key={member.id} className="flex items-center gap-3">
                    <UserAvatar contact={member} size="sm" />
                    <div className="min-w-0">
                      <p className="truncate text-sm">
                        {member.id === you.id ? "You" : member.name}
                      </p>
                      <p className="truncate text-xs text-[#8696a0]">
                        {member.about}
                      </p>
                    </div>
                  </li>
                ) : null
              )}
            </ul>
          </div>
        ) : null}
        <div className="mt-auto flex flex-col gap-1 p-4">
          <Button
            variant="ghost"
            className="justify-start text-[#e9edef] hover:bg-white/5"
            onClick={() => togglePin(chat.id)}
          >
            <Pin className="size-4" />
            {chat.pinned ? "Unpin chat" : "Pin chat"}
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-[#e9edef] hover:bg-white/5"
            onClick={() => toggleMute(chat.id)}
          >
            <BellOff className="size-4" />
            {chat.muted ? "Unmute notifications" : "Mute notifications"}
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-red-400 hover:bg-red-500/10 hover:text-red-300"
            onClick={() => {
              deleteChat(chat.id)
              onOpenChange(false)
            }}
          >
            <Trash2 className="size-4" />
            Delete chat
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
