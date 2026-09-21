"use client"

import { daysInMonth, toDateKey } from "@/lib/dates"
import { useLocale } from "@/lib/locale"
import { useMessenger } from "@/lib/messenger-store"
import { cn } from "@/lib/utils"
import type { MessageKey } from "@/lib/i18n"
import { ChevronLeft, ChevronRight } from "lucide-react"

const MONTHS: MessageKey[] = [
  "month1",
  "month2",
  "month3",
  "month4",
  "month5",
  "month6",
  "month7",
  "month8",
  "month9",
  "month10",
  "month11",
  "month12",
]

export function YearCalendar() {
  const { state, entriesFor, setDate, setYear, activeStory } = useMessenger()
  const { t } = useLocale()
  const today = toDateKey(new Date())
  const marked = new Map(
    (state.activePetId ? entriesFor(state.activePetId) : []).map((entry) => [
      entry.date,
      entry,
    ])
  )

  return (
    <div data-year-calendar>
      <div className="mb-3 flex items-center justify-between px-1">
        <button
          type="button"
          className="rounded-full p-1 text-[#6e6458] hover:bg-[#efe8dc]"
          onClick={() => setYear(state.year - 1)}
          aria-label={t("prevYear")}
        >
          <ChevronLeft className="size-4" />
        </button>
        <p className="font-heading text-lg">{state.year}</p>
        <button
          type="button"
          className="rounded-full p-1 text-[#6e6458] hover:bg-[#efe8dc]"
          onClick={() => setYear(state.year + 1)}
          aria-label={t("nextYear")}
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
      <div className="grid gap-4">
        {MONTHS.map((key, month) => {
          const start = new Date(state.year, month, 1).getDay()
          const count = daysInMonth(state.year, month)
          const label = t(key)
          return (
            <section key={key}>
              <p className="mb-1.5 font-heading text-sm">{label}</p>
              <div className="grid grid-cols-7 gap-0.5">
                {Array.from({ length: start }, (_, index) => (
                  <span key={`e-${index}`} />
                ))}
                {Array.from({ length: count }, (_, index) => {
                  const day = index + 1
                  const dateKey = `${state.year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                  const entry = marked.get(dateKey)
                  const selected = state.selectedDate === dateKey
                  const inStory =
                    activeStory &&
                    dateKey >= activeStory.startDate &&
                    dateKey <= activeStory.endDate
                  return (
                    <button
                      key={dateKey}
                      type="button"
                      data-date={dateKey}
                      onClick={() => setDate(dateKey)}
                      className={cn(
                        "grid aspect-square place-items-center rounded-md text-[11px]",
                        selected
                          ? "bg-[#b4452a] text-[#fbf7f0]"
                          : dateKey === today
                            ? "ring-1 ring-[#b4452a]/50"
                            : inStory
                              ? "bg-[#f0d9c4]/70"
                              : "hover:bg-[#efe8dc]",
                        entry && !selected && "font-medium"
                      )}
                    >
                      {day}
                      {entry ? (
                        <span
                          className={cn(
                            "mt-0.5 size-1 rounded-full",
                            selected
                              ? "bg-[#fbf7f0]"
                              : entry.visibility === "public"
                                ? "bg-[#b4452a]"
                                : "bg-[#6e6458]"
                          )}
                        />
                      ) : null}
                    </button>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
