"use client"

import { AppNav } from "@/components/yard/app-nav"
import { MediaTile } from "@/components/yard/media-tile"
import { PetAvatar } from "@/components/yard/pet-avatar"
import { PetTabs } from "@/components/yard/pet-tabs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { exportStoryBooklet } from "@/lib/booklet"
import { addDays, formatDiaryDate, inDateRange } from "@/lib/dates"
import { MediaLimitError, PAGE_MEDIA_LIMIT, VIDEO_MAX_BYTES, VIDEO_MAX_SECONDS } from "@/lib/media"
import { useLocale } from "@/lib/locale"
import { useMessenger } from "@/lib/messenger-store"
import { cn } from "@/lib/utils"
import { ArrowLeft, ChevronLeft, ChevronRight, ImagePlus, X } from "lucide-react"
import { useState } from "react"

export function DayPage({ className }: { className?: string }) {
  const {
    activePet,
    activeStory,
    selectedEntry,
    state,
    you,
    setDate,
    setYardFocus,
    saveEntry,
    addMedia,
    removePhoto,
    shareEntryToChat,
    closeStory,
    storyPages,
  } = useMessenger()
  const { t, tag } = useLocale()
  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState("")
  const [mediaError, setMediaError] = useState("")
  const [adding, setAdding] = useState(false)

  if (!activePet) {
    return (
      <section className={cn("stage-paper flex flex-1 items-center justify-center", className)}>
        <p className="text-sm text-[#6e6458]">{t("chooseCompanion")}</p>
      </section>
    )
  }

  const date = state.selectedDate
  const inStory =
    activeStory && inDateRange(date, activeStory.startDate, activeStory.endDate)
  const afterEnd = activeStory && date > activeStory.endDate
  const closed = Boolean(activeStory?.closed)
  const canWrite = !closed || !inStory
  const visibility = selectedEntry?.visibility ?? "private"

  async function exportBooklet() {
    if (!activeStory || !activePet) return
    setExporting(true)
    setExportError("")
    try {
      await exportStoryBooklet({
        pet: activePet,
        story: activeStory,
        entries: storyPages(activeStory.id),
        keeper: you.name,
      })
    } catch (error) {
      setExportError(error instanceof Error ? error.message : t("bookletFail"))
    } finally {
      setExporting(false)
    }
  }

  const rooms = state.chats.filter((chat) => !chat.archived)

  return (
    <section
      data-day-page
      className={cn("flex h-full min-h-0 flex-1 flex-col bg-[#faf7f1]", className)}
    >
      <header className="border-b border-[#e0d6c8] bg-[#fbf7f0]/90 px-3 py-3 md:px-8">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setYardFocus("index")}
            aria-label={t("backToDaybook")}
          >
            <ArrowLeft className="size-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <p className="font-heading text-xl leading-tight">
              {formatDiaryDate(date, tag)}
            </p>
            <p className="truncate text-xs text-[#6e6458]">
              {inStory
                ? closed
                  ? t("storyClosed", { title: activeStory.title })
                  : t("storyOpenUntil", {
                      title: activeStory.title,
                      date: activeStory.endDate,
                    })
                : afterEnd
                  ? t("afterEnd")
                  : t("daybookPageHint")}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDate(addDays(date, -1))}
            aria-label={t("prevDay")}
          >
            <ChevronLeft className="size-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDate(addDays(date, 1))}
            aria-label={t("nextDay")}
          >
            <ChevronRight className="size-5" />
          </Button>
        </div>
        <PetTabs className="mt-3 md:hidden" />
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 md:px-10">
        <div className="mx-auto max-w-2xl space-y-5">
          <div className="flex items-center gap-3">
            <PetAvatar pet={activePet} size="md" />
            <div>
              <p className="font-heading text-lg">{activePet.name}</p>
              <p className="text-xs text-[#6e6458]">{activePet.breed}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant={visibility === "private" ? "default" : "outline"}
              disabled={!canWrite}
              onClick={() =>
                saveEntry({
                  petId: activePet.id,
                  date,
                  visibility: "private",
                  text: selectedEntry?.text ?? "",
                })
              }
            >
              {t("drawer")}
            </Button>
            <Button
              type="button"
              variant={visibility === "public" ? "default" : "outline"}
              disabled={!canWrite}
              onClick={() =>
                saveEntry({
                  petId: activePet.id,
                  date,
                  visibility: "public",
                  text: selectedEntry?.text ?? "",
                })
              }
            >
              {t("porchShare")}
            </Button>
            {selectedEntry ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  nativeButton={false}
                  render={<Button variant="outline">{t("sendToNotes")}</Button>}
                />
                <DropdownMenuContent>
                  {rooms.map((chat) => (
                    <DropdownMenuItem
                      key={chat.id}
                      onClick={() => shareEntryToChat(selectedEntry.id, chat.id)}
                    >
                      {chat.title}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>

          <Textarea
            data-day-text
            disabled={!canWrite}
            value={selectedEntry?.text ?? ""}
            onChange={(event) =>
              saveEntry({
                petId: activePet.id,
                date,
                text: event.target.value,
                visibility,
              })
            }
            placeholder={
              closed && inStory ? t("closedPlaceholder") : t("writePlaceholder")
            }
            className="min-h-40 rounded-[1.4rem] border-[#e0d6c8] bg-white px-4 py-3 text-[16px] leading-7"
          />

          <div className="grid grid-cols-3 gap-3">
            {(selectedEntry?.photos ?? []).map((photo) => (
              <figure
                key={photo.id}
                className="relative overflow-hidden rounded-[1.2rem] bg-[#efe8dc] ring-1 ring-[#e0d6c8]"
              >
                <MediaTile item={photo} />
                {canWrite ? (
                  <button
                    type="button"
                    className="absolute top-2 right-2 z-10 rounded-full bg-[#fbf7f0]/90 p-1"
                    onClick={() => removePhoto(photo.id)}
                    aria-label={t("removePhoto")}
                  >
                    <X className="size-3" />
                  </button>
                ) : null}
              </figure>
            ))}
            {canWrite && (selectedEntry?.photos.length ?? 0) < PAGE_MEDIA_LIMIT ? (
              <label
                data-add-media
                className="grid aspect-square cursor-pointer place-items-center rounded-[1.2rem] border border-dashed border-[#e0d6c8] text-[#6e6458] hover:bg-[#fbf7f0]"
              >
                <span className="grid place-items-center gap-1 px-2 text-center text-xs">
                  <ImagePlus className="size-5" />
                  {adding ? t("addingMedia") : t("addPhoto")}
                </span>
                <input
                  type="file"
                  accept="image/*,video/mp4,video/webm,video/quicktime,video/x-m4v"
                  multiple
                  className="sr-only"
                  onChange={(event) => {
                    const files = [...(event.target.files ?? [])]
                    event.target.value = ""
                    if (!files.length) return
                    setAdding(true)
                    setMediaError("")
                    void addMedia(files)
                      .catch((error) => {
                        if (error instanceof MediaLimitError) {
                          const key =
                            error.code === "too-long"
                              ? "videoTooLong"
                              : error.code === "too-heavy"
                                ? "videoTooHeavy"
                                : "videoUnreadable"
                          setMediaError(t(key, { seconds: error.seconds, mb: error.mb }))
                          return
                        }
                        setMediaError(t("videoUnreadable"))
                      })
                      .finally(() => setAdding(false))
                  }}
                />
              </label>
            ) : null}
          </div>
          <p className="text-xs text-[#6e6458]">
            {t("videoHint", {
              seconds: VIDEO_MAX_SECONDS,
              mb: VIDEO_MAX_BYTES / (1024 * 1024),
            })}
          </p>
          {mediaError ? (
            <p data-media-error className="text-sm text-[#9f2d2d]">
              {mediaError}
            </p>
          ) : null}

          {activeStory ? (
            <div className="rounded-[1.4rem] border border-[#e0d6c8] bg-[#fbf7f0] px-4 py-3">
              <p className="font-heading">{activeStory.title}</p>
              <p className="mt-1 text-sm text-[#6e6458]">{activeStory.dedication}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {!activeStory.closed ? (
                  <Button type="button" variant="outline" onClick={() => closeStory(activeStory.id)}>
                    {t("closeStory")}
                  </Button>
                ) : null}
                <Button
                  type="button"
                  data-export-booklet
                  onClick={() => void exportBooklet()}
                  disabled={exporting}
                >
                  {exporting ? t("printing") : t("exportBooklet")}
                </Button>
              </div>
              {exportError ? (
                <p className="mt-2 text-sm text-[#9f2d2d]">{exportError}</p>
              ) : (
                <p className="mt-2 text-xs text-[#6e6458]">{t("bookletHint")}</p>
              )}
            </div>
          ) : null}
        </div>
      </div>
      <div className="border-t border-[#e0d6c8] px-4 py-3 md:hidden">
        <AppNav />
      </div>
    </section>
  )
}
