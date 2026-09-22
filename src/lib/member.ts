import type { Member, MemberShow } from "@/lib/types"

export const DESK_ID = "desk"
export const MEMBER_CHAT_ID = "chat-member"
export const MEMBERS_KEY = "kith-members-v1"

export const DEFAULT_MEMBER_SHOW: MemberShow = {
  realName: false,
  displayName: true,
  phone: false,
  dob: false,
}

export function memberInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase()
}

export function digitsIn(value: string) {
  return value.replace(/\D/g, "")
}

export function isUsablePhone(value: string) {
  return digitsIn(value).length >= 6
}

export function isUsableDob(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split("-").map(Number)
  const date = new Date(year ?? 0, (month ?? 1) - 1, day ?? 1)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== (month ?? 1) - 1 ||
    date.getDate() !== day
  ) {
    return false
  }
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (date > today) return false
  if (year < 1900) return false
  return true
}

export function memberKey(phone: string, dob: string) {
  return `${digitsIn(phone)}:${dob}`
}

export function sameMember(
  left: Pick<Member, "phone" | "dob">,
  right: Pick<Member, "phone" | "dob">
) {
  return memberKey(left.phone, left.dob) === memberKey(right.phone, right.dob)
}

export function normalizeShow(show?: Partial<MemberShow> | null): MemberShow {
  return {
    realName: show?.realName ?? DEFAULT_MEMBER_SHOW.realName,
    displayName: show?.displayName ?? DEFAULT_MEMBER_SHOW.displayName,
    phone: show?.phone ?? DEFAULT_MEMBER_SHOW.phone,
    dob: show?.dob ?? DEFAULT_MEMBER_SHOW.dob,
  }
}

export function normalizeMember(
  raw: Partial<Member> &
    Pick<Member, "phone" | "dob"> & {
      name?: string
      realName?: string
      displayName?: string
    }
): Member {
  const displayName = (raw.displayName ?? raw.name ?? "").trim()
  const realName = (raw.realName ?? "").trim()
  return {
    id: raw.id || `member-${memberKey(raw.phone, raw.dob)}`,
    realName,
    displayName,
    phone: raw.phone.trim(),
    dob: raw.dob,
    joinedAt: raw.joinedAt ?? Date.now(),
    show: normalizeShow(raw.show),
  }
}

export function publicMemberName(member: Member, hidden = "Hidden") {
  return member.show.displayName && member.displayName.trim()
    ? member.displayName.trim()
    : hidden
}

export function readRoster(): Member[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(MEMBERS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((item) => item && item.phone && item.dob && (item.displayName || item.name))
      .map((item) => normalizeMember(item as Member))
  } catch {
    return []
  }
}

export function writeRoster(roster: Member[]) {
  window.localStorage.setItem(MEMBERS_KEY, JSON.stringify(roster))
}

export function findMember(roster: Member[], phone: string, dob: string) {
  const key = memberKey(phone, dob)
  return roster.find((item) => memberKey(item.phone, item.dob) === key)
}
