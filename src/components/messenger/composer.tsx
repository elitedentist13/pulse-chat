"use client"

import { ArrowUpRight, Quote, Smile } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLocale } from "@/lib/locale"
import { cn } from "@/lib/utils"

const EMOJIS = ["🙂", "😂", "🙏", "🔥", "✨", "👍", "❤️", "☕", "🌿", "🌙", "✉️", "📍"]

export function Composer({
  disabled,
  onSend,
  toName,
  address = "to",
}: {
  disabled?: boolean
  onSend: (text: string) => void
  toName: string
  address?: "to" | "in"
}) {
  const { t } = useLocale()
  const [value, setValue] = useState("")
  const [emojiOpen, setEmojiOpen] = useState(false)
  const areaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const node = areaRef.current
    if (!node) return
    node.style.height = "0px"
    node.style.height = `${Math.min(node.scrollHeight, 140)}px`
  }, [value])

  function submit() {
    const next = value.trim()
    if (!next || disabled) return
    onSend(next)
    setValue("")
    areaRef.current?.focus()
  }

  return (
    <form
      className="border-t border-[#e0d6c8] bg-[#fbf7f0] px-4 py-3 md:px-10"
      onSubmit={(event) => {
        event.preventDefault()
        submit()
      }}
    >
      <div className="mx-auto flex max-w-2xl items-end gap-2 rounded-[1.6rem] border border-[#e0d6c8] bg-white px-3 py-2 shadow-[0_12px_40px_-28px_rgba(28,24,20,0.45)]">
        <DropdownMenu open={emojiOpen} onOpenChange={setEmojiOpen}>
          <DropdownMenuTrigger
            nativeButton={false}
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-9 shrink-0 text-[#6e6458] hover:bg-[#efe8dc] hover:text-[#1c1814]"
                aria-label={t("addEmoji")}
              />
            }
          >
            <Smile className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-52 p-2" align="start">
            <div className="grid grid-cols-6 gap-1">
              {EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  className="grid size-7 place-items-center rounded-md text-base hover:bg-[#efe8dc]"
                  onClick={() => {
                    setValue((current) => current + emoji)
                    setEmojiOpen(false)
                    areaRef.current?.focus()
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-9 shrink-0 text-[#6e6458] hover:bg-[#efe8dc] hover:text-[#1c1814]"
          aria-label={t("leaveNote")}
          onClick={() => onSend(t("composerFileNote"))}
        >
          <Quote className="size-4" />
        </Button>
        <label className="sr-only" htmlFor="kith-composer">
          {t("note")}
        </label>
        <textarea
          id="kith-composer"
          ref={areaRef}
          rows={1}
          value={value}
          disabled={disabled}
          placeholder={address === "in" ? t("writeIn", { name: toName }) : t("writeTo", { name: toName })}
          className={cn(
            "max-h-[140px] min-h-10 flex-1 resize-none border-0 bg-transparent px-1 py-2 text-[15px] text-[#1c1814] outline-none placeholder:text-[#6e6458]"
          )}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault()
              submit()
            }
          }}
        />
        <Button
          type="submit"
          disabled={disabled || !value.trim()}
          className="h-9 shrink-0 rounded-full bg-[#b4452a] px-3 text-[#fbf7f0] hover:bg-[#9a3a23] disabled:bg-[#e7dccb] disabled:text-[#6e6458]"
          aria-label={t("sendMessage")}
        >
          {t("send")}
          <ArrowUpRight className="size-4" />
        </Button>
      </div>
    </form>
  )
}
