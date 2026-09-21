"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toDateKey } from "@/lib/dates"
import { useLocale } from "@/lib/locale"
import { useMessenger } from "@/lib/messenger-store"
import type { EntryVisibility, Story } from "@/lib/types"
import { useState } from "react"

export function StoryDialog({
  open,
  onOpenChange,
  story,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  story?: Story | null
}) {
  const { activePet } = useMessenger()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {open && activePet ? (
          <StoryForm
            key={`${story?.id ?? "new"}-${activePet.id}`}
            story={story}
            onDone={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

function StoryForm({
  story,
  onDone,
}: {
  story?: Story | null
  onDone: () => void
}) {
  const { activePet, saveStory } = useMessenger()
  const { t } = useLocale()
  const [title, setTitle] = useState(
    story?.title ?? t("defaultStoryTitle", { name: activePet?.name ?? t("companion") })
  )
  const [dedication, setDedication] = useState(story?.dedication ?? "")
  const [startDate, setStartDate] = useState(story?.startDate ?? activePet?.birthday ?? "")
  const [endDate, setEndDate] = useState(story?.endDate ?? toDateKey(new Date()))
  const [visibility, setVisibility] = useState<EntryVisibility>(story?.visibility ?? "private")

  function submit() {
    if (!activePet || !title.trim() || !startDate || !endDate) return
    const [start, end] =
      startDate <= endDate ? [startDate, endDate] : [endDate, startDate]
    saveStory({
      id: story?.id,
      petId: activePet.id,
      title: title.trim(),
      dedication: dedication.trim(),
      startDate: start,
      endDate: end,
      visibility,
      closed: story?.closed ?? false,
    })
    onDone()
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-heading text-xl">
          {story ? t("editStory") : t("openNewStory")}
        </DialogTitle>
        <DialogDescription>{t("storyHelp")}</DialogDescription>
      </DialogHeader>
      <label className="grid gap-1 text-sm">
        {t("title")}
        <Input value={title} onChange={(event) => setTitle(event.target.value)} />
      </label>
      <label className="grid gap-1 text-sm">
        {t("dedication")}
        <Textarea
          value={dedication}
          onChange={(event) => setDedication(event.target.value)}
          placeholder={t("dedicationPlaceholder")}
        />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="grid gap-1 text-sm">
          {t("firstDay")}
          <Input
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
          />
        </label>
        <label className="grid gap-1 text-sm">
          {t("endDate")}
          <Input
            type="date"
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
          />
        </label>
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          variant={visibility === "private" ? "default" : "outline"}
          onClick={() => setVisibility("private")}
        >
          {t("keepInDrawer")}
        </Button>
        <Button
          type="button"
          variant={visibility === "public" ? "default" : "outline"}
          onClick={() => setVisibility("public")}
        >
          {t("shareOnPorch")}
        </Button>
      </div>
      <Button type="button" onClick={submit}>
        {story ? t("saveStory") : t("openStory")}
      </Button>
    </>
  )
}
