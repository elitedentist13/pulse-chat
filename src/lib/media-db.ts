const DB_NAME = "kith-media-v1"
const STORE = "blobs"

function openDb() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE)) {
        request.result.createObjectStore(STORE)
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error("Media store would not open."))
  })
}

export async function putMediaBlob(id: string, blob: Blob) {
  const db = await openDb()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite")
    tx.objectStore(STORE).put(blob, id)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error ?? new Error("Could not keep the clip."))
  })
}

export async function getMediaBlob(id: string) {
  const db = await openDb()
  return new Promise<Blob | undefined>((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly")
    const request = tx.objectStore(STORE).get(id)
    request.onsuccess = () => resolve(request.result as Blob | undefined)
    request.onerror = () => reject(request.error ?? new Error("Could not open the clip."))
  })
}

export async function deleteMediaBlob(id: string) {
  const db = await openDb()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite")
    tx.objectStore(STORE).delete(id)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error ?? new Error("Could not drop the clip."))
  })
}

export async function clearMediaBlobs() {
  const db = await openDb()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite")
    tx.objectStore(STORE).clear()
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error ?? new Error("Could not clear clips."))
  })
}

export async function purgeMediaBlobs(
  items: { id: string; kind?: "photo" | "video" }[]
) {
  for (const item of items) {
    if (item.kind === "video") {
      await deleteMediaBlob(item.id).catch(() => undefined)
    }
  }
}
