import type { PetKind } from "@/lib/types"

const silhouettes: Record<PetKind, string> = {
  dog: "M70 168c18-38 52-58 90-58 28 0 48 10 62 28 10-18 28-22 40-10 8 8 6 22-2 30 14 16 20 38 12 62-8 24-30 40-62 46v22h-28v-18c-18 4-36 4-54 0v18H100v-22c-28-10-48-30-52-54-4-22 6-44 22-44z",
  cat: "M78 150l18-42 22 18 22-10 22 10 22-18 18 42c24 18 28 52 8 78-14 18-40 28-70 28s-56-10-70-28c-20-26-16-60 8-78z",
  other:
    "M110 140c20-28 70-28 90 0 24 32 10 70-18 86v28H128v-28c-28-16-42-54-18-86z",
}

export function paperPhoto({
  ink,
  paper = "#efe4d2",
  kind,
  title,
}: {
  ink: string
  paper?: string
  kind: PetKind
  title: string
}) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="380" viewBox="0 0 320 380">
    <rect width="320" height="380" fill="#f7f1e8"/>
    <rect x="16" y="16" width="288" height="288" fill="${paper}"/>
    <rect x="16" y="16" width="288" height="288" fill="${ink}" opacity="0.18"/>
    <path d="${silhouettes[kind]}" fill="${ink}" opacity="0.88"/>
    <circle cx="250" cy="64" r="18" fill="#f7f1e8" opacity="0.45"/>
    <text x="160" y="344" text-anchor="middle" font-family="Georgia, serif" font-size="16" fill="#6e6458">${escapeXml(title)}</text>
  </svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

export function paperSlip({
  title,
  ink = "#6e6458",
}: {
  title: string
  ink?: string
}) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="400" viewBox="0 0 320 400">
    <rect width="320" height="400" fill="#f4efe4"/>
    <rect x="18" y="18" width="284" height="364" fill="none" stroke="${ink}" stroke-width="2"/>
    <text x="160" y="48" text-anchor="middle" font-family="Georgia, serif" font-size="14" fill="${ink}">${escapeXml(title)}</text>
    <line x1="40" y1="70" x2="280" y2="70" stroke="${ink}" stroke-opacity="0.35"/>
    <line x1="40" y1="100" x2="280" y2="100" stroke="${ink}" stroke-opacity="0.25"/>
    <line x1="40" y1="130" x2="240" y2="130" stroke="${ink}" stroke-opacity="0.25"/>
    <line x1="40" y1="160" x2="260" y2="160" stroke="${ink}" stroke-opacity="0.2"/>
    <rect x="40" y="200" width="240" height="140" fill="${ink}" opacity="0.08"/>
    <text x="160" y="276" text-anchor="middle" font-family="Georgia, serif" font-size="12" fill="${ink}">photo kept</text>
  </svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}
