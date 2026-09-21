import { formatDiaryDate, formatRange } from "@/lib/dates"
import type { DiaryEntry, Pet, Story } from "@/lib/types"
import { jsPDF } from "jspdf"

export async function exportStoryBooklet({
  pet,
  story,
  entries,
  keeper,
}: {
  pet: Pet
  story: Story
  entries: DiaryEntry[]
  keeper: string
}) {
  const pages = [...entries]
    .filter((entry) => entry.petId === pet.id)
    .filter(
      (entry) =>
        entry.storyId === story.id ||
        (entry.date >= story.startDate && entry.date <= story.endDate)
    )
    .sort((a, b) => a.date.localeCompare(b.date))

  const doc = new jsPDF({ unit: "mm", format: "a5", orientation: "portrait" })
  const width = doc.internal.pageSize.getWidth()
  const height = doc.internal.pageSize.getHeight()

  paintPaper(doc, width, height)
  doc.setTextColor(28, 24, 20)
  doc.setFont("times", "italic")
  doc.setFontSize(11)
  doc.text("A memorial booklet", width / 2, 22, { align: "center" })
  if (pet.portrait) {
    try {
      const cover = await rasterize(pet.portrait)
      const size = 62
      doc.addImage(cover.data, "JPEG", (width - size) / 2, 32, size, size * 1.12)
    } catch {
      // Paper still holds without the portrait.
    }
  }
  doc.setFont("times", "bold")
  doc.setFontSize(28)
  doc.text(pet.name, width / 2, 118, { align: "center" })
  doc.setFont("times", "italic")
  doc.setFontSize(16)
  doc.text(story.title, width / 2, 130, { align: "center" })
  doc.setFont("times", "normal")
  doc.setFontSize(11)
  doc.text(formatRange(story.startDate, story.endDate), width / 2, 140, {
    align: "center",
  })
  doc.setFontSize(10)
  doc.text(`${pet.breed} · kept by ${keeper}`, width / 2, height - 18, {
    align: "center",
  })

  doc.addPage()
  paintPaper(doc, width, height)
  doc.setFont("times", "italic")
  doc.setFontSize(12)
  doc.text("For", width / 2, 40, { align: "center" })
  doc.setFont("times", "normal")
  doc.setFontSize(13)
  const dedication = doc.splitTextToSize(
    story.dedication || `${pet.name} is still on the stairs.`,
    width - 36
  )
  doc.text(dedication, width / 2, 54, { align: "center" })
  doc.setFontSize(10)
  doc.text(
    `${pages.length} day${pages.length === 1 ? "" : "s"} between the first walk and the last.`,
    width / 2,
    height - 22,
    { align: "center" }
  )

  if (pages.length === 0) {
    doc.addPage()
    paintPaper(doc, width, height)
    doc.setFont("times", "italic")
    doc.setFontSize(13)
    doc.text("The pages are still blank.", width / 2, height / 2, {
      align: "center",
    })
  }

  for (const entry of pages) {
    doc.addPage()
    paintPaper(doc, width, height)
    doc.setFont("times", "italic")
    doc.setFontSize(10)
    doc.text(formatDiaryDate(entry.date), 18, 18)
    doc.setFont("times", "normal")
    doc.setFontSize(12)
    let top = 28
    const photo = entry.photos[0]
    const still = photo?.poster || photo?.src
    if (photo && still) {
      try {
        const image = await rasterize(still)
        const maxW = width - 36
        const maxH = 78
        const scale = Math.min(maxW / 80, maxH / ((80 * image.h) / image.w))
        const drawW = 80 * scale
        const drawH = ((80 * image.h) / image.w) * scale
        doc.addImage(image.data, "JPEG", 18, top, drawW, drawH)
        top += drawH + 10
      } catch {
        top += 4
      }
    }
    const body = doc.splitTextToSize(entry.text || "A quiet day. Nothing written.", width - 36)
    doc.text(body, 18, top)
    doc.setFontSize(9)
    doc.text(
      entry.visibility === "public" ? "On the porch" : "In the drawer",
      18,
      height - 14
    )
  }

  doc.addPage()
  paintPaper(doc, width, height)
  doc.setFont("times", "italic")
  doc.setFontSize(16)
  doc.text("Kept.", width / 2, height / 2 - 6, { align: "center" })
  doc.setFontSize(11)
  doc.text(
    story.closed
      ? "This story is closed. The booklet is the copy you hold."
      : "This story is still open. Export again when the last page is in.",
    width / 2,
    height / 2 + 8,
    { align: "center", maxWidth: width - 40 }
  )

  const slug = `${pet.name}-${story.title}`.toLowerCase().replace(/[^a-z0-9]+/g, "-")
  doc.save(`${slug}-booklet.pdf`)
}

function paintPaper(doc: jsPDF, width: number, height: number) {
  doc.setFillColor(247, 241, 232)
  doc.rect(0, 0, width, height, "F")
  doc.setDrawColor(224, 214, 200)
  doc.rect(8, 8, width - 16, height - 16)
}

function rasterize(src: string) {
  return new Promise<{ data: string; w: number; h: number }>((resolve, reject) => {
    const image = new Image()
    image.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = image.naturalWidth || 320
      canvas.height = image.naturalHeight || 380
      const context = canvas.getContext("2d")
      if (!context) {
        reject(new Error("Could not print the photo."))
        return
      }
      context.fillStyle = "#f7f1e8"
      context.fillRect(0, 0, canvas.width, canvas.height)
      context.drawImage(image, 0, 0)
      resolve({
        data: canvas.toDataURL("image/jpeg", 0.84),
        w: canvas.width,
        h: canvas.height,
      })
    }
    image.onerror = () => reject(new Error("Could not open the photo."))
    image.src = src
  })
}
