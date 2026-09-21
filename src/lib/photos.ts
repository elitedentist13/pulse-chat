export async function compressPhoto(file: File, max = 720): Promise<string> {
  const url = URL.createObjectURL(file)
  try {
    const image = await loadImage(url)
    const scale = Math.min(1, max / Math.max(image.width, image.height))
    const canvas = document.createElement("canvas")
    canvas.width = Math.max(1, Math.round(image.width * scale))
    canvas.height = Math.max(1, Math.round(image.height * scale))
    const context = canvas.getContext("2d")
    if (!context) throw new Error("Could not read the photo.")
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL("image/jpeg", 0.72)
  } finally {
    URL.revokeObjectURL(url)
  }
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error("That photo would not open."))
    image.src = src
  })
}
