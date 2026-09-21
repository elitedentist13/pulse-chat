"use client"

import { UserAvatar } from "@/components/messenger/user-avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { formatClock } from "@/lib/format"
import { useMessenger } from "@/lib/messenger-store"
import { useEffect, useState } from "react"

export function StatusViewer({
  statusId,
  onClose,
}: {
  statusId: string | null
  onClose: () => void
}) {
  return (
    <Dialog open={Boolean(statusId)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-md overflow-hidden border-0 bg-[#0b141a] p-0 text-[#e9edef] sm:max-w-md"
        showCloseButton
      >
        {statusId ? (
          <StatusPlayback key={statusId} statusId={statusId} onClose={onClose} />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

function StatusPlayback({
  statusId,
  onClose,
}: {
  statusId: string
  onClose: () => void
}) {
  const { statuses, contactById, you } = useMessenger()
  const status = statuses.find((item) => item.id === statusId)
  const contact = status ? contactById(status.contactId) : undefined
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const started = Date.now()
    const duration = 4500
    const timer = window.setInterval(() => {
      const next = Math.min(100, ((Date.now() - started) / duration) * 100)
      setProgress(next)
      if (next >= 100) {
        window.clearInterval(timer)
        onClose()
      }
    }, 50)
    return () => window.clearInterval(timer)
  }, [onClose])

  if (!status || !contact) return null

  return (
    <div
      className="flex min-h-[420px] flex-col"
      style={{ background: `linear-gradient(160deg, ${status.accent}, #0b141a)` }}
    >
      <div className="px-4 pt-4">
        <div className="h-1 overflow-hidden rounded-full bg-white/25">
          <div
            className="h-full bg-white transition-[width] duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
        <DialogHeader className="mt-3 flex-row items-center gap-3 space-y-0">
          <UserAvatar contact={contact} size="sm" />
          <div className="text-left">
            <DialogTitle className="text-sm text-white">
              {contact.id === you.id ? "My status" : contact.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-white/70">
              {formatClock(status.createdAt)}
            </DialogDescription>
          </div>
        </DialogHeader>
      </div>
      <p className="flex flex-1 items-center justify-center px-8 text-center text-2xl font-medium leading-snug text-white">
        {status.text}
      </p>
    </div>
  )
}
