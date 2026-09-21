"use client"

import { Paperclip, SendHorizontal, Smile } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const EMOJIS = [
  "😀",
  "😂",
  "😍",
  "🙏",
  "🔥",
  "✨",
  "👍",
  "❤️",
  "🎉",
  "😎",
  "😅",
  "🙌",
  "☕",
  "🌿",
  "💬",
  "📍",
]

export function Composer({
  disabled,
  onSend,
}: {
  disabled?: boolean
  onSend: (text: string) => void
}) {
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
      className="flex items-end gap-2 bg-[#202c33] px-3 py-2 md:px-4"
      onSubmit={(event) => {
        event.preventDefault()
        submit()
      }}
    >
      <DropdownMenu open={emojiOpen} onOpenChange={setEmojiOpen}>
        <DropdownMenuTrigger
          nativeButton={false}
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-10 shrink-0 text-[#8696a0] hover:bg-white/5 hover:text-[#e9edef]"
              aria-label="Add emoji"
            />
          }
        >
          <Smile className="size-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 border-[#2a3942] bg-[#233138] p-2" align="start">
          <div className="grid grid-cols-8 gap-1">
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className="grid size-7 place-items-center rounded-md text-base hover:bg-white/10"
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
        className="size-10 shrink-0 text-[#8696a0] hover:bg-white/5 hover:text-[#e9edef]"
        aria-label="Attach a file (demo)"
        onClick={() =>
          onSend("📎 I’ll drop the file in the shared folder instead of attaching it here.")
        }
      >
        <Paperclip className="size-5" />
      </Button>
      <label className="sr-only" htmlFor="relay-composer">
        Message
      </label>
      <textarea
        id="relay-composer"
        ref={areaRef}
        rows={1}
        value={value}
        disabled={disabled}
        placeholder="Type a message"
        className={cn(
          "max-h-[140px] min-h-10 flex-1 resize-none rounded-lg border-0 bg-[#2a3942] px-3 py-2.5 text-[15px] text-[#e9edef] outline-none placeholder:text-[#8696a0]"
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
        size="icon"
        disabled={disabled || !value.trim()}
        className="size-10 shrink-0 rounded-full bg-[#00a884] text-[#111b21] hover:bg-[#06cf9c] disabled:bg-[#2a3942] disabled:text-[#8696a0]"
        aria-label="Send message"
      >
        <SendHorizontal className="size-5" />
      </Button>
    </form>
  )
}
