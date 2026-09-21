import { cn } from "@/lib/utils"
import type { Contact } from "@/lib/types"

type Size = "sm" | "md" | "lg" | "xl"

const sizes: Record<Size, string> = {
  sm: "size-8 text-[11px] rounded-xl",
  md: "size-11 text-sm rounded-2xl",
  lg: "size-14 text-base rounded-[1.35rem]",
  xl: "size-28 text-3xl rounded-[2rem]",
}

export function UserAvatar({
  contact,
  size = "md",
  className,
  present,
}: {
  contact: Pick<Contact, "name" | "initials" | "color" | "online">
  size?: Size
  className?: string
  present?: boolean
}) {
  const showPresent = present ?? contact.online

  return (
    <div className={cn("relative shrink-0", className)}>
      <div
        className={cn(
          "flex items-center justify-center font-heading font-medium text-white",
          sizes[size]
        )}
        style={{ background: contact.color }}
        aria-hidden
      >
        {contact.initials}
      </div>
      {showPresent && size !== "xl" ? (
        <span className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full bg-[#2f6b4f] ring-2 ring-[#efe8dc]" />
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
        "flex items-center justify-center bg-[#2c3d6b] font-heading font-medium text-[#f6f1e8]",
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
