"use client"

import { useMessenger } from "@/lib/messenger-store"
import { cn } from "@/lib/utils"

const ITEMS = [
  { id: "daybook" as const, label: "Daybook" },
  { id: "porch" as const, label: "Porch" },
  { id: "notes" as const, label: "Notes" },
]

export function AppNav({ className }: { className?: string }) {
  const { state, setSurface, unreadNotes } = useMessenger()

  return (
    <nav
      data-app-nav
      className={cn("flex rounded-full bg-[#e7dccb] p-[3px]", className)}
    >
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
          {item.label}
          {item.id === "notes" && unreadNotes > 0 ? (
            <span className="ml-1 inline-block size-1.5 rounded-full bg-[#b4452a] align-middle" />
          ) : null}
        </button>
      ))}
    </nav>
  )
}
