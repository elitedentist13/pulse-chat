"use client"

import { AppNav } from "@/components/yard/app-nav"
import { MediaTile } from "@/components/yard/media-tile"
import { PetTabs } from "@/components/yard/pet-tabs"
import { PortraitButton } from "@/components/yard/portrait-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { reminderDue, toDateKey } from "@/lib/dates"
import type { MessageKey } from "@/lib/i18n"
import { useLocale } from "@/lib/locale"
import {
  ingestMedia,
  MediaLimitError,
  PAGE_MEDIA_LIMIT,
  VIDEO_MAX_BYTES,
  VIDEO_MAX_SECONDS,
} from "@/lib/media"
import { useMessenger } from "@/lib/messenger-store"
import type { CareKind, CareRecord } from "@/lib/types"
import { cn } from "@/lib/utils"
import { ArrowLeft } from "lucide-react"
import { useState } from "react"

const SECTIONS: {
  kind: CareKind
  label: MessageKey
  title: MessageKey
  meta: MessageKey
  detail: MessageKey
}[] = [
  {
    kind: "visit",
    label: "careVisit",
    title: "visitTitle",
    meta: "visitMeta",
    detail: "visitDetail",
  },
  {
    kind: "blood",
    label: "careBlood",
    title: "bloodTitle",
    meta: "bloodMeta",
    detail: "bloodDetail",
  },
  {
    kind: "receipt",
    label: "careReceipt",
    title: "receiptTitle",
    meta: "receiptMeta",
    detail: "receiptDetail",
  },
  {
    kind: "prescription",
    label: "carePrescription",
    title: "rxTitle",
    meta: "rxMeta",
    detail: "rxDetail",
  },
  {
    kind: "groom",
    label: "careGroom",
    title: "groomTitle",
    meta: "groomMeta",
    detail: "groomDetail",
  },
  {
    kind: "food",
    label: "careFood",
    title: "foodTitle",
    meta: "foodMeta",
    detail: "foodDetail",
  },
]

export function CareDesk({ className }: { className?: string }) {
  const {
    activePet,
    changePortrait,
    careFor,
    remindersFor,
    saveCare,
    deleteCare,
    saveReminder,
    deleteReminder,
    setYardFocus,
  } = useMessenger()
  const { t } = useLocale()

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
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 md:px-8">
        <div className="mx-auto max-w-2xl space-y-8">
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
                      <p
                        className={cn(
                          "text-xs",
                          late ? "text-[#b4452a]" : "text-[#6e6458]"
                        )}
                      >
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
                        onClick={() =>
                          saveReminder({
                            ...item,
                            lastGiven: today,
                          })
                        }
                      >
                        {t("givenToday")}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteReminder(item.id)}
                      >
                        {t("remove")}
                      </Button>
                    </div>
                  </li>
                )
              })}
            </ul>
            <ReminderForm petId={activePet.id} onSave={saveReminder} />
          </section>

          <section>
            <h2 className="font-heading text-lg">{t("bowl")}</h2>
            <PantryFields />
          </section>

          {SECTIONS.map((section) => (
            <section key={section.kind} data-care-section={section.kind}>
              <h2 className="font-heading text-lg">{t(section.label)}</h2>
              <ul className="mt-2 space-y-2">
                {records
                  .filter((item) => item.kind === section.kind)
                  .map((item) => (
                    <CareCard
                      key={item.id}
                      record={item}
                      onDelete={() => deleteCare(item.id)}
                    />
                  ))}
              </ul>
              <CareForm
                petId={activePet.id}
                kind={section.kind}
                titleLabel={t(section.title)}
                metaLabel={t(section.meta)}
                detailLabel={t(section.detail)}
                onSave={saveCare}
              />
            </section>
          ))}
        </div>
      </div>
      <div className="border-t border-[#e0d6c8] px-4 py-3 md:hidden">
        <AppNav />
      </div>
    </section>
  )
}

function PantryFields() {
  const { activePet, savePet } = useMessenger()
  const { t } = useLocale()
  if (!activePet) return null
  return (
    <div className="mt-2 grid gap-2">
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

function CareCard({
  record,
  onDelete,
}: {
  record: CareRecord
  onDelete: () => void
}) {
  const { t } = useLocale()
  return (
    <li className="rounded-[1.3rem] border border-[#e0d6c8] bg-white px-4 py-3">
      <div className="flex items-baseline justify-between gap-2">
        <p className="font-heading">{record.title}</p>
        <p className="text-xs text-[#6e6458]">{record.date}</p>
      </div>
      {record.meta ? (
        <p className="text-xs text-[#6e6458]">{record.meta}</p>
      ) : null}
      <p className="mt-1 text-sm leading-6">{record.detail}</p>
      {record.attachments.length > 0 ? (
        <div className="mt-2 flex gap-2 overflow-x-auto">
          {record.attachments.map((photo) => (
            <div
              key={photo.id}
              className="h-20 w-16 shrink-0 overflow-hidden rounded-lg ring-1 ring-[#e0d6c8]"
            >
              <MediaTile item={photo} className="h-20 w-16" />
            </div>
          ))}
        </div>
      ) : null}
      <Button size="sm" variant="ghost" className="mt-1" onClick={onDelete}>
        {t("tearUp")}
      </Button>
    </li>
  )
}

function CareForm({
  petId,
  kind,
  titleLabel,
  metaLabel,
  detailLabel,
  onSave,
}: {
  petId: string
  kind: CareKind
  titleLabel: string
  metaLabel: string
  detailLabel: string
  onSave: (record: Omit<CareRecord, "id"> & { id?: string }) => void
}) {
  const { t } = useLocale()
  const [title, setTitle] = useState("")
  const [meta, setMeta] = useState("")
  const [detail, setDetail] = useState("")
  const [date, setDate] = useState(toDateKey(new Date()))
  const [files, setFiles] = useState<File[]>([])
  const [mediaError, setMediaError] = useState("")
  const [adding, setAdding] = useState(false)

  async function submit() {
    if (!title.trim()) return
    setAdding(true)
    setMediaError("")
    try {
      const attachments = []
      for (const file of files.slice(0, PAGE_MEDIA_LIMIT)) {
        attachments.push(await ingestMedia(file))
      }
      onSave({
        petId,
        kind,
        date,
        title: title.trim(),
        meta: meta.trim(),
        detail: detail.trim(),
        attachments,
      })
      setTitle("")
      setMeta("")
      setDetail("")
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
    <div className="mt-3 rounded-[1.3rem] border border-dashed border-[#e0d6c8] bg-[#fbf7f0] px-3 py-3">
      <div className="grid gap-2 sm:grid-cols-2">
        <Input
          placeholder={titleLabel}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <Input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
        <Input
          placeholder={metaLabel}
          value={meta}
          onChange={(event) => setMeta(event.target.value)}
        />
        <label className="flex flex-col gap-1 text-xs text-[#6e6458]">
          {t("photoOfSlip")}
          <input
            type="file"
            accept="image/*,video/mp4,video/webm,video/quicktime,video/x-m4v"
            multiple
            onChange={(event) => {
              setFiles([...(event.target.files ?? [])])
              setMediaError("")
            }}
          />
          <span>
            {t("videoHint", {
              seconds: VIDEO_MAX_SECONDS,
              mb: VIDEO_MAX_BYTES / (1024 * 1024),
            })}
          </span>
        </label>
      </div>
      <Textarea
        className="mt-2"
        placeholder={detailLabel}
        value={detail}
        onChange={(event) => setDetail(event.target.value)}
      />
      {mediaError ? (
        <p className="mt-2 text-sm text-[#9f2d2d]">{mediaError}</p>
      ) : null}
      <Button
        size="sm"
        className="mt-2"
        type="button"
        disabled={adding}
        onClick={() => void submit()}
      >
        {adding ? t("addingMedia") : t("keepRecord")}
      </Button>
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
