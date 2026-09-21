import { cn } from "@/lib/utils"
import type { Contact } from "@/lib/types"

type Size = "sm" | "md" | "lg" | "xl"

const sizes: Record<Size, string> = {
  sm: "size-8 text-[11px]",
  md: "size-12 text-sm",
  lg: "size-14 text-base",
  xl: "size-28 text-3xl",
}

export function UserAvatar({
  contact,
  size = "md",
  className,
  ring,
}: {
  contact: Pick<Contact, "name" | "initials" | "color" | "online">
  size?: Size
  className?: string
  ring?: "unseen" | "seen" | "none"
}) {
  return (
    <div className={cn("relative shrink-0", className)}>
      <div
        className={cn(
          "flex items-center justify-center rounded-full font-semibold text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
          sizes[size],
          ring === "unseen" && "ring-2 ring-[#00a884] ring-offset-2 ring-offset-[#111b21]",
          ring === "seen" && "ring-2 ring-[#667781] ring-offset-2 ring-offset-[#111b21]"
        )}
        style={{ background: contact.color }}
        aria-hidden
      >
        {contact.initials}
      </div>
      {contact.online && size !== "xl" ? (
        <span className="absolute right-0 bottom-0 size-2.5 rounded-full bg-[#00a884] ring-2 ring-[#111b21]" />
      ) : null}
    </div>
  )
}

export function GroupAvatar({
  title,
  size = "md",
  className,
}: {
  title: string
  size?: Size
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-[#00a884]/20 font-semibold text-[#00a884]",
        sizes[size],
        className
      )}
      aria-hidden
    >
      {title
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase()}
    </div>
  )
}
