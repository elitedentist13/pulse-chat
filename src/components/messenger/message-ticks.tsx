import { cn } from "@/lib/utils"
import type { MessageStatus } from "@/lib/types"

export function ReceiptMark({
  status,
  className,
}: {
  status: MessageStatus
  className?: string
}) {
  const label =
    status === "sending"
      ? "Writing"
      : status === "sent"
        ? "Sent"
        : status === "delivered"
          ? "Arrived"
          : "Seen"

  return (
    <span
      className={cn(
        "font-heading text-[11px] tracking-wide",
        status === "read" ? "text-[#b4452a]" : "text-[#6e6458]",
        className
      )}
    >
      {label}
    </span>
  )
}
