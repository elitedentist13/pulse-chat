"use client"

import { Input } from "@/components/ui/input"
import { useLocale } from "@/lib/locale"
import { cn } from "@/lib/utils"

export function PrivacyField({
  label,
  value,
  onChange,
  shown,
  onShown,
  type = "text",
  placeholder,
  name,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  shown: boolean
  onShown: (shown: boolean) => void
  type?: string
  placeholder?: string
  name: string
}) {
  const { t } = useLocale()

  return (
    <label className="grid gap-1.5 text-sm">
      <span className="flex items-center justify-between gap-2">
        <span>{label}</span>
        <span
          className="flex rounded-full bg-[#e7dccb] p-[2px]"
          role="group"
          aria-label={shown ? t("showToOthers") : t("hideFromOthers")}
        >
          <button
            type="button"
            data-privacy-hide={name}
            onClick={() => onShown(false)}
            className={cn(
              "rounded-full px-2 py-0.5 text-[11px]",
              !shown ? "bg-[#fbf7f0] text-[#1c1814]" : "text-[#6e6458]"
            )}
          >
            {t("hidden")}
          </button>
          <button
            type="button"
            data-privacy-show={name}
            onClick={() => onShown(true)}
            className={cn(
              "rounded-full px-2 py-0.5 text-[11px]",
              shown ? "bg-[#fbf7f0] text-[#1c1814]" : "text-[#6e6458]"
            )}
          >
            {t("shown")}
          </button>
        </span>
      </span>
      <Input
        data-member-field={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}
