"use client"

import { formatClipLength, isVideoMedia } from "@/lib/media"
import { getMediaBlob } from "@/lib/media-db"
import type { DiaryPhoto } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

export function MediaTile({
  item,
  className,
  fit = "square",
}: {
  item: DiaryPhoto
  className?: string
  fit?: "square" | "wide"
}) {
  const video = isVideoMedia(item)
  const src = useBlobSrc(video ? item.id : undefined)
  const poster = item.poster || item.src

  if (!video) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={item.src}
        alt={item.alt}
        data-media-kind="photo"
        className={cn(
          "h-full w-full object-cover",
          fit === "square" ? "aspect-square" : "aspect-[4/3]",
          className
        )}
      />
    )
  }

  return (
    <div
      data-media-kind="video"
      data-media-id={item.id}
      className={cn(
        "relative h-full w-full overflow-hidden bg-[#1c1814]",
        fit === "square" ? "aspect-square" : "aspect-[4/3]",
        className
      )}
    >
      {src ? (
        <video
          src={src}
          poster={poster}
          controls
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={poster} alt={item.alt} className="h-full w-full object-cover" />
      )}
      <span className="pointer-events-none absolute bottom-2 left-2 rounded-full bg-[#1c1814]/70 px-2 py-0.5 text-[10px] tracking-wide text-[#fbf7f0]">
        {formatClipLength(item.duration)}
      </span>
    </div>
  )
}

function useBlobSrc(id?: string) {
  const [url, setUrl] = useState<string>()

  useEffect(() => {
    if (!id) return
    let objectUrl = ""
    let cancelled = false
    void getMediaBlob(id).then((blob) => {
      if (cancelled || !blob) return
      objectUrl = URL.createObjectURL(blob)
      setUrl(objectUrl)
    })
    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [id])

  return url
}
