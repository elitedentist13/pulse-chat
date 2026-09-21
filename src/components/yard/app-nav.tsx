"use client"

import { LocaleSwitch } from "@/components/yard/locale-switch"
import { useLocale } from "@/lib/locale"
import { useMessenger } from "@/lib/messenger-store"
import { cn } from "@/lib/utils"

const ITEMS = [
  { id: "daybook" as const, label: "navDaybook" as const },
  { id: "porch" as const, label: "navPorch" as const },
  { id: "notes" as const, label: "navNotes" as const },
]

export function AppNav({ className }: { className?: string }) {
  const { state, setSurface, unreadNotes } = useMessenger()
  const { t } = useLocale()

  return (
    <div className={cn("grid gap-2", className)}>
      <nav data-app-nav className="flex rounded-full bg-[#e7dccb] p-[3px]">
        {ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            data-surface-tab={item.id}
            onClick={() => setSurface(item.id)}
            className={cn(
              "relative flex-1 rounded-full px-3 py-1.5 text-sm transition-colors",
              state.surface === item.id
                ? "bg-[#fbf7f0] text-[#1c1814]"
                : "text-[#6e6458] hover:text-[#1c1814]"
            )}
          >
            {t(item.label)}
            {item.id === "notes" && unreadNotes > 0 ? (
              <span className="ml-1 inline-block size-1.5 rounded-full bg-[#b4452a] align-middle" />
            ) : null}
          </button>
        ))}
      </nav>
      <LocaleSwitch />
    </div>
  )
}
