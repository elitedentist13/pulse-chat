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
import { compressPhoto } from "@/lib/photos"
import { useMessenger } from "@/lib/messenger-store"
import type { Pet, PetKind } from "@/lib/types"
import { useState } from "react"

const KINDS: PetKind[] = ["dog", "cat", "other"]

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
  const { you, savePet } = useMessenger()
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
      breed: breed.trim() || "Companion",
      birthday,
      about: about.trim(),
      color,
      initials,
      portrait,
    })
    onDone()
  }

  const preview: Pet = {
    id: "preview",
    ownerId: you.id,
    name: name || "Name",
    kind,
    breed,
    birthday,
    about,
    color,
    initials: (name || "P").slice(0, 2).toUpperCase(),
    portrait,
  }

  return (
    <>
      <div className="flex flex-col items-center bg-[#efe8dc] px-6 pt-14 pb-6">
        <PetAvatar pet={preview} size="xl" />
        <SheetHeader className="items-center p-0 pt-4">
          <SheetTitle className="font-heading text-2xl">
            {pet ? "Companion" : "A new companion"}
          </SheetTitle>
          <SheetDescription>
            The profile stays on the daybook. The stories are the years.
          </SheetDescription>
        </SheetHeader>
      </div>
      <div className="space-y-3 px-5 py-4">
        <Input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Name"
        />
        <div className="flex gap-2">
          {KINDS.map((item) => (
            <Button
              key={item}
              type="button"
              variant={kind === item ? "default" : "outline"}
              onClick={() => setKind(item)}
            >
              {item}
            </Button>
          ))}
        </div>
        <Input
          value={breed}
          onChange={(event) => setBreed(event.target.value)}
          placeholder="Breed or kind"
        />
        <Input
          type="date"
          value={birthday}
          onChange={(event) => setBirthday(event.target.value)}
        />
        <Textarea
          value={about}
          onChange={(event) => setAbout(event.target.value)}
          placeholder="What they keep doing."
        />
        <label className="flex items-center gap-3 text-sm text-[#6e6458]">
          Portrait
          <input
            type="file"
            accept="image/*"
            className="text-xs"
            onChange={(event) => onFile(event.target.files?.[0])}
          />
        </label>
        <Button type="button" className="w-full" onClick={submit}>
          Keep this profile
        </Button>
      </div>
    </>
  )
}
