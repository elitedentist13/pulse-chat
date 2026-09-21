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

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}
