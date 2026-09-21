"use client"

import { AppNav } from "@/components/yard/app-nav"
import { PetAvatar } from "@/components/yard/pet-avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatDiaryDate } from "@/lib/dates"
import { useLocale } from "@/lib/locale"
import { useMessenger } from "@/lib/messenger-store"
import { cn } from "@/lib/utils"
import { Shuffle } from "lucide-react"

export function Porch({ className }: { className?: string }) {
  const {
    porchEntries,
    petById,
    contactById,
    you,
    reshufflePorch,
    writeFromPorch,
    shareEntryToChat,
    setPet,
    setDate,
    setSurface,
    state,
  } = useMessenger()
  const { t, tag } = useLocale()

  return (
    <section
      data-porch
      className={cn("flex h-full min-h-0 flex-1 flex-col bg-[#faf7f1]", className)}
    >
      <header className="border-b border-[#e0d6c8] bg-[#fbf7f0] px-5 py-5 md:px-10">
        <div className="mx-auto flex max-w-2xl items-end justify-between gap-3">
          <div>
            <p className="text-xs tracking-[0.22em] text-[#b4452a] uppercase">
              {t("community")}
            </p>
            <h1 className="font-heading text-3xl">{t("thePorch")}</h1>
            <p className="mt-1 max-w-md text-sm text-[#6e6458]">{t("porchBlurb")}</p>
          </div>
          <Button variant="outline" onClick={reshufflePorch} data-reshuffle>
            <Shuffle className="size-4" />
            {t("shuffle")}
          </Button>
        </div>
        <div className="mx-auto mt-4 max-w-2xl">
          <AppNav />
        </div>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 md:px-10">
        <ul className="mx-auto flex max-w-2xl flex-col gap-4">
          {porchEntries.length === 0 ? (
            <li className="rounded-[1.4rem] border border-dashed border-[#e0d6c8] px-5 py-10 text-center text-sm text-[#6e6458]">
              {t("porchEmpty")}
            </li>
          ) : (
            porchEntries.map((entry) => {
              const pet = petById(entry.petId)
              const owner = pet ? contactById(pet.ownerId) : undefined
              if (!pet || !owner) return null
              const mine = pet.ownerId === you.id
              return (
                <li key={entry.id}>
                  <article
                    data-porch-entry={entry.id}
                    className="rounded-[1.5rem] border border-[#e0d6c8] bg-[#fbf7f0] p-4"
                  >
                    <div className="flex items-center gap-3">
                      <PetAvatar pet={pet} size="md" />
                      <div className="min-w-0">
                        <p className="font-heading text-lg">{pet.name}</p>
                        <p className="text-xs text-[#6e6458]">
                          {owner.id === you.id ? t("yourPage") : owner.name} ·{" "}
                          {formatDiaryDate(entry.date, tag)}
                        </p>
                      </div>
                    </div>
                    {entry.photos[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={entry.photos[0].src}
                        alt={entry.photos[0].alt}
                        className="mt-3 aspect-[4/3] w-full rounded-[1.2rem] object-cover"
                      />
                    ) : null}
                    <p className="mt-3 text-[15px] leading-7">{entry.text}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {mine ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setPet(pet.id)
                            setDate(entry.date)
                            setSurface("daybook")
                          }}
                        >
                          {t("openInDaybook")}
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => writeFromPorch(entry.id)}
                        >
                          {t("writeToName", { name: owner.name.split(" ")[0] })}
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          nativeButton={false}
                          render={
                            <Button variant="outline" size="sm">
                              {t("shareIntoNotes")}
                            </Button>
                          }
                        />
                        <DropdownMenuContent>
                          {state.chats
                            .filter((chat) => !chat.archived)
                            .map((chat) => (
                              <DropdownMenuItem
                                key={chat.id}
                                onClick={() => shareEntryToChat(entry.id, chat.id)}
                              >
                                {chat.title}
                              </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </article>
                </li>
              )
            })
          )}
        </ul>
      </div>
    </section>
  )
}
