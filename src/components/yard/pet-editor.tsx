"use client"

import { PetAvatar } from "@/components/yard/pet-avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useLocale } from "@/lib/locale"
import { compressPhoto } from "@/lib/photos"
import { useMessenger } from "@/lib/messenger-store"
import type { Pet, PetKind } from "@/lib/types"
import { useState } from "react"

const KINDS: { id: PetKind; label: "kindDog" | "kindCat" | "kindOther" }[] = [
  { id: "dog", label: "kindDog" },
  { id: "cat", label: "kindCat" },
  { id: "other", label: "kindOther" },
]

export function PetEditor({
  open,
  onOpenChange,
  pet,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  pet?: Pet | null
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full border-[#e0d6c8] bg-[#fbf7f0] p-0 sm:max-w-sm">
        {open ? (
          <PetForm
            key={pet?.id ?? "new-pet"}
            pet={pet}
            onDone={() => onOpenChange(false)}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  )
}

function PetForm({
  pet,
  onDone,
}: {
  pet?: Pet | null
  onDone: () => void
}) {
  const { you, savePet, setPetTab } = useMessenger()
  const { t } = useLocale()
  const [name, setName] = useState(pet?.name ?? "")
  const [kind, setKind] = useState<PetKind>(pet?.kind ?? "dog")
  const [breed, setBreed] = useState(pet?.breed ?? "")
  const [birthday, setBirthday] = useState(pet?.birthday ?? "2021-01-01")
  const [about, setAbout] = useState(pet?.about ?? "")
  const [color] = useState(pet?.color ?? "#b85c38")
  const [portrait, setPortrait] = useState<string | undefined>(pet?.portrait)

  async function onFile(file?: File) {
    if (!file) return
    setPortrait(await compressPhoto(file, 480))
  }

  function submit() {
    const trimmed = name.trim()
    if (!trimmed) return
    const initials = trimmed
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase()
    savePet({
      id: pet?.id ?? `pet-${Date.now()}`,
      ownerId: you.id,
      name: trimmed,
      kind,
      breed: breed.trim() || t("companion"),
      birthday,
      about: about.trim(),
      color,
      initials,
      portrait,
      nickname: pet?.nickname ?? "",
      origin: pet?.origin ?? "",
      traits: pet?.traits ?? "",
      features: pet?.features ?? "",
      favoriteFood: pet?.favoriteFood ?? "",
      fears: pet?.fears ?? "",
      specialNotes: pet?.specialNotes ?? "",
      remarks: pet?.remarks ?? "",
      medicalRemarks: pet?.medicalRemarks ?? "",
      favoriteSnacks: pet?.favoriteSnacks ?? "",
      cannedFood: pet?.cannedFood ?? "",
      currentFood: pet?.currentFood ?? "",
    })
    setPetTab("profile")
    onDone()
  }

  const preview: Pet = {
    id: "preview",
    ownerId: you.id,
    name: name || t("fieldName"),
    kind,
    breed,
    birthday,
    about,
    color,
    initials: (name || "P").slice(0, 2).toUpperCase(),
    portrait,
    nickname: pet?.nickname ?? "",
    origin: pet?.origin ?? "",
    traits: pet?.traits ?? "",
    features: pet?.features ?? "",
    favoriteFood: pet?.favoriteFood ?? "",
    fears: pet?.fears ?? "",
    specialNotes: pet?.specialNotes ?? "",
    remarks: pet?.remarks ?? "",
    medicalRemarks: pet?.medicalRemarks ?? "",
    favoriteSnacks: pet?.favoriteSnacks ?? "",
    cannedFood: pet?.cannedFood ?? "",
    currentFood: pet?.currentFood ?? "",
  }

  return (
    <>
      <div className="flex flex-col items-center bg-[#efe8dc] px-6 pt-14 pb-6">
        <label className="relative cursor-pointer" data-change-portrait>
          <PetAvatar pet={preview} size="xl" />
          <span className="mt-2 block text-center text-xs text-[#6e6458]">
            {t("clickPictureShort")}
          </span>
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) => onFile(event.target.files?.[0])}
          />
        </label>
        <SheetHeader className="items-center p-0 pt-4">
          <SheetTitle className="font-heading text-2xl">
            {pet ? t("companion") : t("newCompanion")}
          </SheetTitle>
          <SheetDescription>{t("profileStays")}</SheetDescription>
        </SheetHeader>
      </div>
      <div className="space-y-3 px-5 py-4">
        <Input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder={t("fieldName")}
        />
        <div className="flex gap-2">
          {KINDS.map((item) => (
            <Button
              key={item.id}
              type="button"
              variant={kind === item.id ? "default" : "outline"}
              onClick={() => setKind(item.id)}
            >
              {t(item.label)}
            </Button>
          ))}
        </div>
        <Input
          value={breed}
          onChange={(event) => setBreed(event.target.value)}
          placeholder={t("breedOrKind")}
        />
        <Input
          type="date"
          value={birthday}
          onChange={(event) => setBirthday(event.target.value)}
        />
        <Textarea
          value={about}
          onChange={(event) => setAbout(event.target.value)}
          placeholder={t("whatTheyKeepDoing")}
        />
        <label className="flex items-center gap-3 text-sm text-[#6e6458]">
          {t("portrait")}
          <input
            type="file"
            accept="image/*"
            className="text-xs"
            onChange={(event) => onFile(event.target.files?.[0])}
          />
        </label>
        <Button type="button" className="w-full" onClick={submit}>
          {t("keepProfile")}
        </Button>
      </div>
    </>
  )
}
