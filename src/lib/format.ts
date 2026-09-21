const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

export function formatChatTime(ts: number, now = Date.now()) {
  const date = new Date(ts)
  const current = new Date(now)
  if (date.toDateString() === current.toDateString()) {
    return formatClock(date)
  }
  const yesterday = new Date(current)
  yesterday.setDate(current.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday"
  }
  if (now - ts < 7 * DAY) {
    return date.toLocaleDateString(undefined, { weekday: "long" })
  }
  return date.toLocaleDateString(undefined, {
    month: "numeric",
    day: "numeric",
    year: "2-digit",
  })
}

export function formatClock(date: Date | number) {
  const value = typeof date === "number" ? new Date(date) : date
  return value.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  })
}

export function formatDateSeparator(ts: number, now = Date.now()) {
  const date = new Date(ts)
  const current = new Date(now)
  if (date.toDateString() === current.toDateString()) return "Today"
  const yesterday = new Date(current)
  yesterday.setDate(current.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday"
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  })
}

export function formatLastSeen(contact: {
  online: boolean
  lastSeen: number
}, now = Date.now()) {
  if (contact.online) return "online"
  const delta = now - contact.lastSeen
  if (delta < 2 * MINUTE) return "last seen just now"
  if (delta < HOUR) {
    const minutes = Math.max(1, Math.round(delta / MINUTE))
    return `last seen ${minutes} min ago`
  }
  if (delta < 6 * HOUR) {
    const hours = Math.round(delta / HOUR)
    return `last seen ${hours} hr${hours === 1 ? "" : "s"} ago`
  }
  return `last seen ${formatChatTime(contact.lastSeen, now)} at ${formatClock(contact.lastSeen)}`
}

export function sameDay(a: number, b: number) {
  return new Date(a).toDateString() === new Date(b).toDateString()
}
