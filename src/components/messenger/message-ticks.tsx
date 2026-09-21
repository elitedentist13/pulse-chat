import { Check, CheckCheck, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MessageStatus } from "@/lib/types"

export function MessageTicks({
  status,
  className,
}: {
  status: MessageStatus
  className?: string
}) {
  if (status === "sending") {
    return <Clock className={cn("size-3.5 opacity-70", className)} />
  }
  if (status === "sent") {
    return <Check className={cn("size-3.5 opacity-80", className)} />
  }
  return (
    <CheckCheck
      className={cn(
        "size-3.5",
        status === "read" ? "text-[#53bdeb]" : "opacity-80",
        className
      )}
    />
  )
}
