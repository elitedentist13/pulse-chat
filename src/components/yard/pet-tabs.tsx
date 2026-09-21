"use client"

import { useLocale } from "@/lib/locale"
import { useMessenger } from "@/lib/messenger-store"
import { cn } from "@/lib/utils"
import type { PetTab } from "@/lib/types"
import type { MessageKey } from "@/lib/i18n"

const TABS: { id: PetTab; label: MessageKey }[] = [
  { id: "profile", label: "tabProfile" },
  { id: "pages", label: "tabPages" },
  { id: "care", label: "tabCare" },
  { id: "talent", label: "tabTalent" },
]

export function PetTabs({ className }: { className?: string }) {
  const { state, setPetTab } = useMessenger()
  const { t } = useLocale()

  return (
    <div
      data-pet-tabs
      className={cn("flex rounded-full bg-[#e7dccb] p-[3px]", className)}
    >
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          data-pet-tab={tab.id}
          onClick={() => setPetTab(tab.id)}
          className={cn(
            "flex-1 rounded-full px-2 py-1.5 text-sm sm:px-3",
            state.petTab === tab.id
              ? "bg-[#fbf7f0] text-[#1c1814]"
              : "text-[#6e6458] hover:text-[#1c1814]"
          )}
        >
          {t(tab.label)}
        </button>
      ))}
    </div>
  )
}
