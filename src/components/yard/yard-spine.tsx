"use client"

import { AppNav } from "@/components/yard/app-nav"
import { PetAvatar } from "@/components/yard/pet-avatar"
import { PetEditor } from "@/components/yard/pet-editor"
import { PetTabs } from "@/components/yard/pet-tabs"
import { PortraitButton } from "@/components/yard/portrait-button"
import { StoryDialog } from "@/components/yard/story-dialog"
import { YearCalendar } from "@/components/yard/year-calendar"
import { Button } from "@/components/ui/button"
import { formatRange, toDateKey } from "@/lib/dates"
import { useLocale } from "@/lib/locale"
import { useMessenger } from "@/lib/messenger-store"
import { cn } from "@/lib/utils"
import { useState } from "react"

export function YardSpine({ className }: { className?: string }) {
  const {
    you,
    yourPets,
    activePet,
    activeStory,
    storiesFor,
    storyPages,
    setPet,
    setStory,
    setDate,
    setPetTab,
    changePortrait,
    resetDemo,
  } = useMessenger()
  const { t, tag } = useLocale()
  const [newPet, setNewPet] = useState(false)
  const [storyOpen, setStoryOpen] = useState(false)
  const stories = activePet ? storiesFor(activePet.id) : []

  return (
    <aside
      data-yard-spine
      className={cn(
        "desk-grain flex h-full min-h-0 w-full flex-col border-r border-[#e0d6c8]",
        className
      )}
    >
      <header className="px-5 pt-6 pb-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="font-heading text-3xl leading-none tracking-tight">Kith</p>
            <p className="mt-1 text-sm text-[#6e6458]">
              {activePet
                ? t("daybookOf", { name: activePet.name })
                : t("yardOf", { name: you.name })}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={resetDemo}>
            {t("reset")}
          </Button>
        </div>
        <AppNav className="mt-4" />
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-8">
        <div className="flex gap-2 overflow-x-auto pb-3">
          {yourPets.map((pet) => (
            <button
              key={pet.id}
              type="button"
              data-pet-id={pet.id}
              onClick={() => setPet(pet.id)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-2xl border px-2 py-1.5",
                activePet?.id === pet.id
                  ? "border-[#b4452a]/40 bg-[#fbf7f0]"
                  : "border-[#e0d6c8] bg-[#f6f1e8]"
              )}
            >
              <PetAvatar pet={pet} size="sm" />
              <span className="pr-1 font-heading text-sm">{pet.name}</span>
            </button>
          ))}
          <Button variant="outline" size="sm" onClick={() => setNewPet(true)}>
            {t("add")}
          </Button>
        </div>

        {activePet ? (
          <div
            className="mb-3 rounded-[1.4rem] border border-[#e0d6c8] bg-[#fbf7f0] p-4"
            data-pet-profile
          >
            <div className="flex items-center gap-3">
              <PortraitButton
                pet={activePet}
                size="lg"
                onPick={(file) => void changePortrait(file)}
              />
              <button
                type="button"
                className="min-w-0 flex-1 text-left"
                onClick={() => setPetTab("profile")}
              >
                <p className="font-heading text-xl">{activePet.name}</p>
                <p className="text-xs text-[#6e6458]">
                  {activePet.nickname
                    ? t("nicknameDot", { name: activePet.nickname })
                    : null}
                  {activePet.breed} · {t("born", { date: activePet.birthday })}
                </p>
              </button>
            </div>
            <p className="mt-3 text-sm leading-6 text-[#6e6458]">{activePet.about}</p>
            <p className="mt-2 text-[11px] text-[#6e6458]">{t("clickPhoto")}</p>
          </div>
        ) : null}

        <PetTabs className="mb-4" />

        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs tracking-[0.18em] text-[#b4452a] uppercase">
            {t("stories")}
          </p>
          <Button size="sm" onClick={() => setStoryOpen(true)} data-new-story>
            {t("newStory")}
          </Button>
        </div>
        <ul className="mb-6 space-y-2">
          {stories.length === 0 ? (
            <li className="rounded-2xl border border-dashed border-[#e0d6c8] px-3 py-3 text-sm text-[#6e6458]">
              {t("storyEmpty")}
            </li>
          ) : (
            stories.map((story) => {
              const pages = storyPages(story.id).length
              const active = activeStory?.id === story.id
              return (
                <li key={story.id}>
                  <button
                    type="button"
                    data-story-id={story.id}
                    onClick={() => {
                      const today = toDateKey(new Date())
                      setStory(story.id)
                      setDate(
                        today < story.startDate
                          ? story.startDate
                          : today > story.endDate
                            ? story.endDate
                            : today
                      )
                    }}
                    className={cn(
                      "w-full rounded-2xl border px-3 py-2.5 text-left",
                      active
                        ? "border-[#b4452a]/35 bg-[#fbf7f0]"
                        : "border-[#e0d6c8] bg-[#f6f1e8]/70"
                    )}
                  >
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="font-heading">{story.title}</span>
                      <span className="text-[10px] tracking-[0.14em] uppercase text-[#6e6458]">
                        {story.closed ? t("closed") : t("open")}
                      </span>
                    </span>
                    <span className="mt-1 block text-xs text-[#6e6458]">
                      {formatRange(story.startDate, story.endDate, tag)} ·{" "}
                      {t(pages === 1 ? "pageCount" : "pageCountPlural", {
                        count: pages,
                      })}
                    </span>
                  </button>
                </li>
              )
            })
          )}
        </ul>

        <YearCalendar />
      </div>

      <PetEditor open={newPet} onOpenChange={setNewPet} />
      <StoryDialog open={storyOpen} onOpenChange={setStoryOpen} />
    </aside>
  )
}
