import { localeTag, translate, type Locale } from "@/lib/i18n"

const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

export function formatChatTime(ts: number, now = Date.now(), locale: Locale = "en") {
  const date = new Date(ts)
  const current = new Date(now)
  const tag = localeTag(locale)
  if (date.toDateString() === current.toDateString()) {
    return formatClock(date, locale)
  }
  const yesterday = new Date(current)
  yesterday.setDate(current.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) {
    return translate(locale, "yesterday")
  }
  if (now - ts < 7 * DAY) {
    return date.toLocaleDateString(tag, { weekday: "long" })
  }
  return date.toLocaleDateString(tag, {
    month: "numeric",
    day: "numeric",
    year: "2-digit",
  })
}

export function formatClock(date: Date | number, locale: Locale = "en") {
  const value = typeof date === "number" ? new Date(date) : date
  return value.toLocaleTimeString(localeTag(locale), {
    hour: "numeric",
    minute: "2-digit",
  })
}

export function formatDateSeparator(ts: number, now = Date.now(), locale: Locale = "en") {
  const date = new Date(ts)
  const current = new Date(now)
  if (date.toDateString() === current.toDateString()) return translate(locale, "today")
  const yesterday = new Date(current)
  yesterday.setDate(current.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) {
    return translate(locale, "yesterday")
  }
  return date.toLocaleDateString(localeTag(locale), {
    weekday: "long",
    month: "short",
    day: "numeric",
  })
}

export function formatLastSeen(
  contact: {
    online: boolean
    lastSeen: number
  },
  now = Date.now(),
  locale: Locale = "en"
) {
  if (contact.online) return translate(locale, "here")
  const delta = now - contact.lastSeen
  if (delta < 2 * MINUTE) return translate(locale, "justSteppedAway")
  if (delta < HOUR) {
    const minutes = Math.max(1, Math.round(delta / MINUTE))
    return translate(locale, "awayMin", { count: minutes })
  }
  if (delta < 6 * HOUR) {
    const hours = Math.round(delta / HOUR)
    return translate(locale, hours === 1 ? "awayHr" : "awayHrs", { count: hours })
  }
  return translate(locale, "lastAround", {
    when: formatChatTime(contact.lastSeen, now, locale),
    clock: formatClock(contact.lastSeen, locale),
  })
}

export function sameDay(a: number, b: number) {
  return new Date(a).toDateString() === new Date(b).toDateString()
}
