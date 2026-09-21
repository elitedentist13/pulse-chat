"use client"

import { PetAvatar } from "@/components/yard/pet-avatar"
import { useLocale } from "@/lib/locale"
import { cn } from "@/lib/utils"
import type { Pet } from "@/lib/types"

export function PortraitButton({
  pet,
  size = "lg",
  onPick,
  className,
}: {
  pet: Pet
  size?: "sm" | "md" | "lg" | "xl"
  onPick: (file: File) => void
  className?: string
}) {
  const { t } = useLocale()
  return (
    <label
      className={cn("group relative inline-block cursor-pointer", className)}
      data-change-portrait
    >
      <PetAvatar pet={pet} size={size} />
      <span className="absolute inset-0 grid place-items-center rounded-[inherit] bg-[#1c1814]/45 text-[11px] text-[#fbf7f0] opacity-0 transition-opacity group-hover:opacity-100">
        {t("changePhoto")}
      </span>
      <input
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) onPick(file)
          event.target.value = ""
        }}
      />
    </label>
  )
}
