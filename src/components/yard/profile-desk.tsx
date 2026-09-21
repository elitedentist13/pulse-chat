"use client"

import { AppNav } from "@/components/yard/app-nav"
import { PetTabs } from "@/components/yard/pet-tabs"
import { PortraitButton } from "@/components/yard/portrait-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ageYears } from "@/lib/dates"
import { useLocale } from "@/lib/locale"
import { useMessenger } from "@/lib/messenger-store"
import type { Pet, PetKind } from "@/lib/types"
import { cn } from "@/lib/utils"
import { ArrowLeft } from "lucide-react"

const KINDS: { id: PetKind; label: "kindDog" | "kindCat" | "kindOther" }[] = [
  { id: "dog", label: "kindDog" },
  { id: "cat", label: "kindCat" },
  { id: "other", label: "kindOther" },
]

export function ProfileDesk({ className }: { className?: string }) {
  const { activePet, savePet, changePortrait, setYardFocus } = useMessenger()
  const { t } = useLocale()

  if (!activePet) {
    return (
      <section className={cn("stage-paper flex flex-1 items-center justify-center", className)}>
        <p className="text-sm text-[#6e6458]">{t("chooseCompanion")}</p>
      </section>
    )
  }

  function patch(partial: Partial<Pet>) {
    if (!activePet) return
    const name = partial.name ?? activePet.name
    savePet({
      ...activePet,
      ...partial,
      name,
      initials: name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase(),
    })
  }

  const years = activePet.birthday ? ageYears(activePet.birthday) : 0

  return (
    <section
      data-profile-desk
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
            size="xl"
            onPick={(file) => void changePortrait(file)}
          />
          <div className="min-w-0 flex-1">
            <p className="font-heading text-2xl leading-tight">{activePet.name}</p>
            <p className="text-sm text-[#6e6458]">
              {activePet.nickname
                ? t("calledAs", { name: activePet.nickname })
                : null}
              {activePet.breed}
              {activePet.birthday ? ` · ${t("yearsOld", { count: years })}` : null}
            </p>
            <p className="mt-1 text-xs text-[#6e6458]">{t("clickPicture")}</p>
          </div>
        </div>
        <PetTabs className="mt-4" />
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 md:px-8">
        <div className="mx-auto grid max-w-2xl gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={t("fieldName")}>
              <Input
                value={activePet.name}
                onChange={(event) => patch({ name: event.target.value })}
              />
            </Field>
            <Field label={t("fieldNickname")}>
              <Input
                value={activePet.nickname}
                onChange={(event) => patch({ nickname: event.target.value })}
              />
            </Field>
            <Field label={t("fieldDob")}>
              <Input
                type="date"
                value={activePet.birthday}
                onChange={(event) => patch({ birthday: event.target.value })}
              />
            </Field>
            <Field label={t("fieldBreed")}>
              <Input
                value={activePet.breed}
                onChange={(event) => patch({ breed: event.target.value })}
              />
            </Field>
          </div>

          <div className="flex gap-2">
            {KINDS.map((kind) => (
              <Button
                key={kind.id}
                type="button"
                variant={activePet.kind === kind.id ? "default" : "outline"}
                onClick={() => patch({ kind: kind.id })}
              >
                {t(kind.label)}
              </Button>
            ))}
          </div>

          <Field label={t("fieldOrigin")}>
            <Input
              value={activePet.origin}
              onChange={(event) => patch({ origin: event.target.value })}
              placeholder={t("originPlaceholder")}
            />
          </Field>
          <Field label={t("fieldTraits")}>
            <Textarea
              value={activePet.traits}
              onChange={(event) => patch({ traits: event.target.value })}
              placeholder={t("traitsPlaceholder")}
            />
          </Field>
          <Field label={t("fieldFeatures")}>
            <Textarea
              value={activePet.features}
              onChange={(event) => patch({ features: event.target.value })}
              placeholder={t("featuresPlaceholder")}
            />
          </Field>
          <Field label={t("fieldFavoriteFood")}>
            <Input
              value={activePet.favoriteFood}
              onChange={(event) => patch({ favoriteFood: event.target.value })}
            />
          </Field>
          <Field label={t("fieldFears")}>
            <Textarea
              value={activePet.fears}
              onChange={(event) => patch({ fears: event.target.value })}
              placeholder={t("fearsPlaceholder")}
            />
          </Field>
          <Field label={t("fieldSpecialNotes")}>
            <Textarea
              value={activePet.specialNotes}
              onChange={(event) => patch({ specialNotes: event.target.value })}
            />
          </Field>
          <Field label={t("fieldRemarks")}>
            <Textarea
              value={activePet.remarks}
              onChange={(event) => patch({ remarks: event.target.value })}
            />
          </Field>
          <Field label={t("fieldMedicalRemarks")}>
            <Textarea
              value={activePet.medicalRemarks}
              onChange={(event) => patch({ medicalRemarks: event.target.value })}
              placeholder={t("medicalPlaceholder")}
            />
          </Field>
          <Field label={t("fieldAbout")}>
            <Textarea
              value={activePet.about}
              onChange={(event) => patch({ about: event.target.value })}
            />
          </Field>
        </div>
      </div>
      <div className="border-t border-[#e0d6c8] px-4 py-3 md:hidden">
        <AppNav />
      </div>
    </section>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="grid gap-1 text-sm text-[#6e6458]">
      {label}
      {children}
    </label>
  )
}
