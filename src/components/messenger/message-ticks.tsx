import { useLocale } from "@/lib/locale"
import { cn } from "@/lib/utils"
import type { MessageStatus } from "@/lib/types"

export function ReceiptMark({
  status,
  className,
}: {
  status: MessageStatus
  className?: string
}) {
  const { t } = useLocale()
  const label =
    status === "sending"
      ? t("writing")
      : status === "sent"
        ? t("sent")
        : status === "delivered"
          ? t("arrived")
          : t("seen")

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
