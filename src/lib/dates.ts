export function toDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function fromDateKey(key: string) {
  const [year, month, day] = key.split("-").map(Number)
  return new Date(year, (month ?? 1) - 1, day ?? 1)
}

export function addDays(key: string, amount: number) {
  const date = fromDateKey(key)
  date.setDate(date.getDate() + amount)
  return toDateKey(date)
}

export function daysInMonth(year: number, monthIndex: number) {
  return new Date(year, monthIndex + 1, 0).getDate()
}

export function formatDiaryDate(key: string) {
  return fromDateKey(key).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function formatDiaryShort(key: string) {
  return fromDateKey(key).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })
}

export function isLeapYear(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

export function yearLength(year: number) {
  return isLeapYear(year) ? 366 : 365
}

export function inDateRange(date: string, start: string, end: string) {
  return date >= start && date <= end
}

export function formatRange(start: string, end: string) {
  return `${formatDiaryShort(start)} – ${formatDiaryShort(end)}`
}
