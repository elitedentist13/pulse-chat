import { compressPhoto } from "@/lib/photos"
import { putMediaBlob } from "@/lib/media-db"
import type { DiaryPhoto } from "@/lib/types"

export const VIDEO_MAX_SECONDS = 15
export const VIDEO_MAX_BYTES = 8 * 1024 * 1024
export const PAGE_MEDIA_LIMIT = 3

export function isVideoFile(file: File) {
  return file.type.startsWith("video/")
}

export function isVideoMedia(item: DiaryPhoto) {
  return item.kind === "video"
}

export type MediaLimitCode = "too-long" | "too-heavy" | "unreadable"

export class MediaLimitError extends Error {
  code: MediaLimitCode
  seconds: number
  mb: number

  constructor(code: MediaLimitCode, extras?: { seconds?: number; mb?: number }) {
    super(code)
    this.name = "MediaLimitError"
    this.code = code
    this.seconds = extras?.seconds ?? VIDEO_MAX_SECONDS
    this.mb = extras?.mb ?? VIDEO_MAX_BYTES / (1024 * 1024)
  }
}

export function nid(prefix: string) {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? `${prefix}-${crypto.randomUUID()}`
    : `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export async function ingestMedia(file: File): Promise<DiaryPhoto> {
  const alt = file.name.replace(/\.[^.]+$/, "") || file.name
  if (isVideoFile(file)) {
    if (file.size > VIDEO_MAX_BYTES) {
      throw new MediaLimitError("too-heavy")
    }
    const { duration, poster } = await readVideo(file)
    if (!Number.isFinite(duration) || duration <= 0) {
      throw new MediaLimitError("unreadable")
    }
    if (duration > VIDEO_MAX_SECONDS + 0.25) {
      throw new MediaLimitError("too-long")
    }
    const id = nid("clip")
    await putMediaBlob(id, file)
    return {
      id,
      src: poster,
      alt,
      kind: "video",
      duration,
      poster,
    }
  }
  return {
    id: nid("photo"),
    src: await compressPhoto(file),
    alt,
    kind: "photo",
  }
}

async function readVideo(file: File) {
  const url = URL.createObjectURL(file)
  const video = document.createElement("video")
  video.preload = "metadata"
  video.muted = true
  video.playsInline = true
  video.src = url

  try {
    await waitFor(video, "loadedmetadata")
    if (!Number.isFinite(video.duration) || video.duration === Infinity) {
      await waitFor(video, "durationchange")
    }
    const duration = video.duration
    const seekTo = Math.min(0.35, Math.max(0, duration * 0.12 || 0))
    if (seekTo > 0) {
      video.currentTime = seekTo
      await waitFor(video, "seeked")
    }
    const poster = captureFrame(video)
    return { duration, poster }
  } catch {
    throw new MediaLimitError("unreadable")
  } finally {
    video.src = ""
    URL.revokeObjectURL(url)
  }
}

function waitFor(video: HTMLVideoElement, event: string) {
  return new Promise<void>((resolve, reject) => {
    const done = () => {
      video.removeEventListener(event, done)
      video.removeEventListener("error", fail)
      resolve()
    }
    const fail = () => {
      video.removeEventListener(event, done)
      video.removeEventListener("error", fail)
      reject(new Error(event))
    }
    video.addEventListener(event, done)
    video.addEventListener("error", fail)
  })
}

function captureFrame(video: HTMLVideoElement) {
  const width = video.videoWidth || 320
  const height = video.videoHeight || 240
  const max = 640
  const scale = Math.min(1, max / Math.max(width, height))
  const canvas = document.createElement("canvas")
  canvas.width = Math.max(1, Math.round(width * scale))
  canvas.height = Math.max(1, Math.round(height * scale))
  const context = canvas.getContext("2d")
  if (!context) throw new MediaLimitError("unreadable")
  context.drawImage(video, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL("image/jpeg", 0.7)
}

export function formatClipLength(seconds = 0) {
  const whole = Math.max(0, Math.round(seconds))
  const minutes = Math.floor(whole / 60)
  const rest = whole % 60
  return `${minutes}:${String(rest).padStart(2, "0")}`
}
