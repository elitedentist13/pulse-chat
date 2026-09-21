"use client"

import { LOCALES } from "@/lib/i18n"
import { useLocale } from "@/lib/locale"
import { cn } from "@/lib/utils"

export function LocaleSwitch({ className }: { className?: string }) {
  const { locale, setLocale, t } = useLocale()

  return (
    <div
      data-locale-switch
      role="group"
      aria-label={t("language")}
      className={cn("flex rounded-full bg-[#e7dccb] p-[3px]", className)}
    >
      {LOCALES.map((item) => (
        <button
          key={item.id}
          type="button"
          data-locale={item.id}
          onClick={() => setLocale(item.id)}
          className={cn(
            "flex-1 rounded-full px-2.5 py-1 text-xs tracking-wide",
            locale === item.id
              ? "bg-[#fbf7f0] text-[#1c1814]"
              : "text-[#6e6458] hover:text-[#1c1814]"
          )}
        >
          {item.short}
        </button>
      ))}
    </div>
  )
}
