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
import { topicKeys } from "@/lib/i18n"
import { useLocale } from "@/lib/locale"
import { useMessenger } from "@/lib/messenger-store"
import { topicMeta } from "@/lib/topics"
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
  const { state, contactById, you, toggleMute, togglePin, deleteChat } =
    useMessenger()
  const { t, locale } = useLocale()
  const chat = state.chats.find((item) => item.id === chatId)
  if (!chat) return null

  const direct = chat.contactId ? contactById(chat.contactId) : undefined
  const members = chat.participantIds
    .map((id) => contactById(id))
    .filter(Boolean)
  const room = chat.kind === "group" ? topicMeta(chat.topic) : null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full border-[#e0d6c8] bg-[#fbf7f0] p-0 sm:max-w-sm">
        <div className="flex flex-col items-center bg-[#efe8dc] px-6 pt-14 pb-6 text-center">
          {direct ? (
            <UserAvatar contact={direct} size="xl" />
          ) : (
            <GroupAvatar title={chat.title} size="xl" topic={chat.topic} />
          )}
          <SheetHeader className="items-center p-0 pt-4">
            <SheetTitle className="font-heading text-2xl">{chat.title}</SheetTitle>
            <SheetDescription>
              {direct
                ? direct.phone
                : t("peopleCount", {
                    label: room
                      ? t(topicKeys(chat.topic ?? "craft").label)
                      : t("room"),
                    count: chat.participantIds.length,
                  })}
            </SheetDescription>
          </SheetHeader>
        </div>
        <div className="space-y-1 px-5 py-4">
          <p className="text-sm text-[#6e6458]">
            {direct
              ? formatLastSeen(direct, undefined, locale)
              : room
                ? t(topicKeys(chat.topic ?? "craft").line)
                : t("aStandingRoom")}
          </p>
          <p className="text-[15px] leading-6">
            {direct?.about ?? chat.blurb ?? "A standing Saturday."}
          </p>
        </div>
        <Separator />
        {chat.kind === "group" ? (
          <div className="px-5 py-4">
            <p className="mb-3 text-xs tracking-[0.18em] text-[#b4452a] uppercase">
              {t("roomCount", { count: members.length })}
            </p>
            <ul className="space-y-3">
              {members.map((member) =>
                member ? (
                  <li key={member.id} className="flex items-center gap-3">
                    <UserAvatar contact={member} size="sm" />
                    <div className="min-w-0">
                      <p className="truncate font-heading">
                        {member.id === you.id ? t("you") : member.name}
                      </p>
                      <p className="truncate text-xs text-[#6e6458]">
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
            className="justify-start"
            onClick={() => togglePin(chat.id)}
          >
            <Pin className="size-4" />
            {chat.pinned ? t("leaveTable") : t("keepOnTable")}
          </Button>
          <Button
            variant="ghost"
            className="justify-start"
            onClick={() => toggleMute(chat.id)}
          >
            <BellOff className="size-4" />
            {chat.muted ? t("letItSpeak") : t("keepQuiet")}
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-[#9f2d2d] hover:bg-[#9f2d2d]/10 hover:text-[#9f2d2d]"
            onClick={() => {
              deleteChat(chat.id)
              onOpenChange(false)
            }}
          >
            <Trash2 className="size-4" />
            {t("tearUp")}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
