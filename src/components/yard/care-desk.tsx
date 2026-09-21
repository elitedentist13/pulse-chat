"use client"

import { AppNav } from "@/components/yard/app-nav"
import { MediaTile } from "@/components/yard/media-tile"
import { PetTabs } from "@/components/yard/pet-tabs"
import { PortraitButton } from "@/components/yard/portrait-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { formatDiaryDate, reminderDue, toDateKey } from "@/lib/dates"
import type { MessageKey } from "@/lib/i18n"
import { useLocale } from "@/lib/locale"
import {
  ingestMedia,
  MediaLimitError,
  VIDEO_MAX_BYTES,
  VIDEO_MAX_SECONDS,
} from "@/lib/media"
import { useMessenger } from "@/lib/messenger-store"
import type { CareKind, CareRecord, DiaryPhoto } from "@/lib/types"
import { cn } from "@/lib/utils"
import { ArrowLeft, ChevronLeft, ChevronRight, ImagePlus, X } from "lucide-react"
import { useRef, useState } from "react"

type CareSubtab = "prevent" | "bowl" | CareKind

const SUBTABS: { id: CareSubtab; label: MessageKey }[] = [
  { id: "prevent", label: "subPrevent" },
  { id: "bowl", label: "subBowl" },
  { id: "visit", label: "subVisit" },
  { id: "blood", label: "subBlood" },
  { id: "receipt", label: "subReceipt" },
  { id: "prescription", label: "subRx" },
  { id: "groom", label: "subGroom" },
  { id: "food", label: "subFood" },
]

const MEDIA_KINDS: CareKind[] = [
  "visit",
  "blood",
  "receipt",
  "prescription",
  "groom",
  "food",
]

export function CareDesk({ className }: { className?: string }) {
  const {
    activePet,
    changePortrait,
    careFor,
    remindersFor,
    saveCare,
    removeCareMedia,
    saveReminder,
    deleteReminder,
    setYardFocus,
  } = useMessenger()
  const { t } = useLocale()
  const [subtab, setSubtab] = useState<CareSubtab>("visit")

  if (!activePet) {
    return (
      <section className={cn("stage-paper flex flex-1 items-center justify-center", className)}>
        <p className="text-sm text-[#6e6458]">{t("chooseCompanion")}</p>
      </section>
    )
  }

  const records = careFor(activePet.id)
  const reminders = remindersFor(activePet.id)
  const today = toDateKey(new Date())

  return (
    <section
      data-care-desk
      data-care-subtab={subtab}
      className={cn("flex h-full min-h-0 flex-1 flex-col bg-[#faf7f1]", className)}
    >
      <header className="border-b border-[#e0d6c8] bg-[#fbf7f0] px-4 py-4 md:px-8">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setYardFocus("index")}
            aria-label={t("back")}
          >
            <ArrowLeft className="size-5" />
          </Button>
          <PortraitButton
            pet={activePet}
            size="md"
            onPick={(file) => void changePortrait(file)}
          />
          <div className="min-w-0 flex-1">
            <p className="font-heading text-xl">
              {t("caresTitle", { name: activePet.name })}
            </p>
            <p className="text-xs text-[#6e6458]">{t("caresBlurb")}</p>
          </div>
        </div>
        <PetTabs className="mt-3" />
        <div
          data-care-subtabs
          className="mt-3 flex gap-1 overflow-x-auto rounded-full bg-[#e7dccb] p-[3px]"
        >
          {SUBTABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              data-care-subtab-btn={tab.id}
              onClick={() => setSubtab(tab.id)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-sm",
                subtab === tab.id
                  ? "bg-[#fbf7f0] text-[#1c1814]"
                  : "text-[#6e6458] hover:text-[#1c1814]"
              )}
            >
              {t(tab.label)}
            </button>
          ))}
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 md:px-8">
        <div className="mx-auto max-w-3xl">
          {subtab === "prevent" ? (
            <PreventativesPane
              reminders={reminders}
              today={today}
              petId={activePet.id}
              onSave={saveReminder}
              onDelete={deleteReminder}
            />
          ) : null}
          {subtab === "bowl" ? <PantryFields /> : null}
          {MEDIA_KINDS.includes(subtab as CareKind) ? (
            <CareStrip
              petId={activePet.id}
              kind={subtab as CareKind}
              records={records.filter((item) => item.kind === subtab)}
              onSave={saveCare}
              onRemove={removeCareMedia}
            />
          ) : null}
        </div>
      </div>
      <div className="border-t border-[#e0d6c8] px-4 py-3 md:hidden">
        <AppNav />
      </div>
    </section>
  )
}

type Slide = {
  record: CareRecord
  media: DiaryPhoto
}

function slidesFrom(records: CareRecord[]): Slide[] {
  return records
    .flatMap((record) =>
      record.attachments.map((media) => ({ record, media }))
    )
    .sort((a, b) => b.record.date.localeCompare(a.record.date))
}

function CareStrip({
  petId,
  kind,
  records,
  onSave,
  onRemove,
}: {
  petId: string
  kind: CareKind
  records: CareRecord[]
  onSave: (record: Omit<CareRecord, "id"> & { id?: string }) => void
  onRemove: (recordId: string, mediaId: string) => void
}) {
  const { t, tag } = useLocale()
  const scroller = useRef<HTMLDivElement>(null)
  const slides = slidesFrom(records)

  function scrollByCard(direction: -1 | 1) {
    const node = scroller.current
    if (!node) return
    node.scrollBy({ left: direction * (node.clientWidth * 0.72), behavior: "smooth" })
  }

  return (
    <section data-care-strip={kind}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="font-heading text-lg">
          {t(
            kind === "visit"
              ? "careVisit"
              : kind === "blood"
                ? "careBlood"
                : kind === "receipt"
                  ? "careReceipt"
                  : kind === "prescription"
                    ? "carePrescription"
                    : kind === "groom"
                      ? "careGroom"
                      : "careFood"
          )}
        </h2>
        {slides.length > 1 ? (
          <div className="flex gap-1">
            <Button
              type="button"
              size="icon"
              variant="outline"
              aria-label={t("prevDay")}
              onClick={() => scrollByCard(-1)}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="outline"
              aria-label={t("nextDay")}
              onClick={() => scrollByCard(1)}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        ) : null}
      </div>

      {slides.length === 0 ? (
        <p
          data-care-strip-empty
          className="rounded-[1.4rem] border border-dashed border-[#e0d6c8] px-4 py-10 text-center text-sm text-[#6e6458]"
        >
          {t("noSlides")}
        </p>
      ) : (
        <div
          ref={scroller}
          data-care-slider
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2"
        >
          {slides.map((slide) => (
            <article
              key={`${slide.record.id}-${slide.media.id}`}
              data-care-slide={slide.media.id}
              className="w-[min(20rem,82vw)] shrink-0 snap-start overflow-hidden rounded-[1.4rem] border border-[#e0d6c8] bg-white"
            >
              <div className="relative">
                <MediaTile item={slide.media} fit="wide" />
                <button
                  type="button"
                  className="absolute top-2 right-2 z-10 rounded-full bg-[#fbf7f0]/90 p-1"
                  aria-label={t("removePhoto")}
                  onClick={() => onRemove(slide.record.id, slide.media.id)}
                >
                  <X className="size-3" />
                </button>
              </div>
              <div className="px-3 py-3">
                <p className="text-xs text-[#6e6458]">
                  {formatDiaryDate(slide.record.date, tag)}
                </p>
                <p className="font-heading text-lg leading-tight">
                  {slide.record.title || slide.media.alt}
                </p>
                {slide.record.meta ? (
                  <p className="mt-0.5 text-xs text-[#6e6458]">{slide.record.meta}</p>
                ) : null}
                {slide.record.detail ? (
                  <p className="mt-1 text-sm leading-6">{slide.record.detail}</p>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}

      <SlideForm petId={petId} kind={kind} onSave={onSave} />
    </section>
  )
}

function SlideForm({
  petId,
  kind,
  onSave,
}: {
  petId: string
  kind: CareKind
  onSave: (record: Omit<CareRecord, "id"> & { id?: string }) => void
}) {
  const { t } = useLocale()
  const [caption, setCaption] = useState("")
  const [date, setDate] = useState(toDateKey(new Date()))
  const [note, setNote] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [mediaError, setMediaError] = useState("")
  const [adding, setAdding] = useState(false)

  async function submit() {
    if (files.length === 0) return
    setAdding(true)
    setMediaError("")
    try {
      for (const file of files) {
        const media = await ingestMedia(file)
        onSave({
          petId,
          kind,
          date,
          title: caption.trim() || media.alt,
          meta: "",
          detail: note.trim(),
          attachments: [media],
        })
      }
      setCaption("")
      setNote("")
      setFiles([])
    } catch (error) {
      if (error instanceof MediaLimitError) {
        const key =
          error.code === "too-long"
            ? "videoTooLong"
            : error.code === "too-heavy"
              ? "videoTooHeavy"
              : "videoUnreadable"
        setMediaError(t(key, { seconds: error.seconds, mb: error.mb }))
      } else {
        setMediaError(t("videoUnreadable"))
      }
    } finally {
      setAdding(false)
    }
  }

  return (
    <div
      data-care-add-slide
      className="mt-4 rounded-[1.4rem] border border-dashed border-[#e0d6c8] bg-[#fbf7f0] px-4 py-3"
    >
      <p className="mb-2 text-sm text-[#6e6458]">{t("addToStrip")}</p>
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="grid gap-1 text-sm">
          {t("slideCaption")}
          <Input
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            placeholder={t("captionPlaceholder")}
          />
        </label>
        <label className="grid gap-1 text-sm">
          {t("slideDate")}
          <Input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </label>
      </div>
      <Textarea
        className="mt-2"
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder={t("captionPlaceholder")}
      />
      <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-[#6e6458]">
        <ImagePlus className="size-4" />
        {t("photoOfSlip")}
        <input
          type="file"
          accept="image/*,video/mp4,video/webm,video/quicktime,video/x-m4v"
          multiple
          className="text-xs"
          onChange={(event) => {
            setFiles([...(event.target.files ?? [])])
            setMediaError("")
          }}
        />
      </label>
      <p className="mt-1 text-xs text-[#6e6458]">
        {t("videoHint", {
          seconds: VIDEO_MAX_SECONDS,
          mb: VIDEO_MAX_BYTES / (1024 * 1024),
        })}
        {files.length ? ` · ${files.length}` : null}
      </p>
      {mediaError ? (
        <p className="mt-2 text-sm text-[#9f2d2d]">{mediaError}</p>
      ) : null}
      <Button
        size="sm"
        className="mt-2"
        type="button"
        disabled={adding || files.length === 0}
        onClick={() => void submit()}
      >
        {adding ? t("addingMedia") : t("keepSlide")}
      </Button>
    </div>
  )
}

function PreventativesPane({
  reminders,
  today,
  petId,
  onSave,
  onDelete,
}: {
  reminders: {
    id: string
    petId: string
    label: string
    lastGiven: string
    intervalMonths: number
    note: string
  }[]
  today: string
  petId: string
  onSave: (item: {
    id?: string
    petId: string
    label: string
    lastGiven: string
    intervalMonths: number
    note: string
  }) => void
  onDelete: (id: string) => void
}) {
  const { t } = useLocale()
  return (
    <section data-reminders>
      <h2 className="font-heading text-lg">{t("preventatives")}</h2>
      <p className="mb-3 text-sm text-[#6e6458]">{t("preventativesBlurb")}</p>
      <ul className="space-y-2">
        {reminders.map((item) => {
          const due = reminderDue(item.lastGiven, item.intervalMonths)
          const late = due <= today
          return (
            <li
              key={item.id}
              className="rounded-[1.3rem] border border-[#e0d6c8] bg-[#fbf7f0] px-4 py-3"
            >
              <div className="flex items-baseline justify-between gap-2">
                <p className="font-heading">{item.label}</p>
                <p className={cn("text-xs", late ? "text-[#b4452a]" : "text-[#6e6458]")}>
                  {t(late ? "due" : "next", { date: due })}
                </p>
              </div>
              <p className="mt-1 text-sm text-[#6e6458]">
                {t("lastGivenLine", {
                  date: item.lastGiven,
                  count: item.intervalMonths,
                  note: item.note,
                })}
              </p>
              <div className="mt-2 flex gap-2">
                <Button
                  size="sm"
                  onClick={() => onSave({ ...item, lastGiven: today })}
                >
                  {t("givenToday")}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => onDelete(item.id)}>
                  {t("remove")}
                </Button>
              </div>
            </li>
          )
        })}
      </ul>
      <ReminderForm petId={petId} onSave={onSave} />
    </section>
  )
}

function PantryFields() {
  const { activePet, savePet } = useMessenger()
  const { t } = useLocale()
  if (!activePet) return null
  return (
    <div className="grid gap-2">
      <h2 className="font-heading text-lg">{t("bowl")}</h2>
      <label className="grid gap-1 text-sm">
        {t("currentFood")}
        <Input
          value={activePet.currentFood}
          onChange={(event) =>
            savePet({ ...activePet, currentFood: event.target.value })
          }
        />
      </label>
      <label className="grid gap-1 text-sm">
        {t("favoriteSnacks")}
        <Input
          value={activePet.favoriteSnacks}
          onChange={(event) =>
            savePet({ ...activePet, favoriteSnacks: event.target.value })
          }
        />
      </label>
      <label className="grid gap-1 text-sm">
        {t("cannedFood")}
        <Input
          value={activePet.cannedFood}
          onChange={(event) =>
            savePet({ ...activePet, cannedFood: event.target.value })
          }
        />
      </label>
    </div>
  )
}

function ReminderForm({
  petId,
  onSave,
}: {
  petId: string
  onSave: (item: {
    petId: string
    label: string
    lastGiven: string
    intervalMonths: number
    note: string
  }) => void
}) {
  const { t } = useLocale()
  const [label, setLabel] = useState(t("reminderDefault"))
  const [lastGiven, setLastGiven] = useState(toDateKey(new Date()))
  const [months, setMonths] = useState("3")
  const [note, setNote] = useState("")

  return (
    <div className="mt-3 rounded-[1.3rem] border border-dashed border-[#e0d6c8] px-3 py-3">
      <div className="grid gap-2 sm:grid-cols-2">
        <Input value={label} onChange={(event) => setLabel(event.target.value)} />
        <Input
          type="date"
          value={lastGiven}
          onChange={(event) => setLastGiven(event.target.value)}
        />
        <Input
          inputMode="numeric"
          value={months}
          onChange={(event) => setMonths(event.target.value)}
          placeholder={t("reminderMonths")}
        />
        <Input
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder={t("reminderNote")}
        />
      </div>
      <Button
        size="sm"
        className="mt-2"
        type="button"
        onClick={() => {
          if (!label.trim()) return
          onSave({
            petId,
            label: label.trim(),
            lastGiven,
            intervalMonths: Math.max(1, Number(months) || 3),
            note: note.trim(),
          })
          setNote("")
        }}
      >
        {t("addReminder")}
      </Button>
    </div>
  )
}
