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
        className="max-w-md overflow-hidden border-[#e0d6c8] bg-[#fbf7f0] p-0 sm:max-w-md"
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
    <div className="flex min-h-[380px] flex-col bg-[#efe8dc]">
      <div className="px-5 pt-5">
        <div className="h-1 overflow-hidden rounded-full bg-[#e0d6c8]">
          <div
            className="h-full bg-[#b4452a] transition-[width] duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
        <DialogHeader className="mt-4 flex-row items-center gap-3 space-y-0">
          <UserAvatar contact={contact} size="sm" />
          <div className="text-left">
            <DialogTitle className="font-heading text-base">
              {contact.id === you.id ? "Your mood" : contact.name}
            </DialogTitle>
            <DialogDescription>{formatClock(status.createdAt)}</DialogDescription>
          </div>
        </DialogHeader>
      </div>
      <p className="flex flex-1 items-center justify-center px-8 text-center font-heading text-3xl leading-snug text-[#1c1814]">
        {status.text}
      </p>
    </div>
  )
}
