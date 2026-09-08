import { useEffect, useState, type ChangeEvent } from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/share')({
  component: Share,
})

type SavedFile = {
  id: string
  name: string
  size: number
  type: string
  savedAt: string
}

type StoredFile = SavedFile & {
  file: Blob
}

const DATABASE_NAME = 'preishare'
const STORE_NAME = 'files'

function openFileDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, 1)

    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME, { keyPath: 'id' })
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function getSavedFiles() {
  const database = await openFileDatabase()

  return new Promise<SavedFile[]>((resolve, reject) => {
    const request = database
      .transaction(STORE_NAME, 'readonly')
      .objectStore(STORE_NAME)
      .getAll()

    request.onsuccess = () => {
      database.close()
      resolve(
        (request.result as SavedFile[]).sort(
          (first, second) =>
            new Date(second.savedAt).getTime() -
            new Date(first.savedAt).getTime(),
        ),
      )
    }
    request.onerror = () => {
      database.close()
      reject(request.error)
    }
  })
}

async function saveFile(file: File) {
  const database = await openFileDatabase()
  const savedFile: StoredFile = {
    id: crypto.randomUUID(),
    name: file.name,
    size: file.size,
    type: file.type,
    savedAt: new Date().toISOString(),
    file,
  }

  return new Promise<SavedFile>((resolve, reject) => {
    const request = database
      .transaction(STORE_NAME, 'readwrite')
      .objectStore(STORE_NAME)
      .add(savedFile)

    request.onsuccess = () => {
      database.close()
      resolve(savedFile)
    }
    request.onerror = () => {
      database.close()
      reject(request.error)
    }
  })
}

async function removeFile(id: string) {
  const database = await openFileDatabase()

  return new Promise<void>((resolve, reject) => {
    const request = database
      .transaction(STORE_NAME, 'readwrite')
      .objectStore(STORE_NAME)
      .delete(id)

    request.onsuccess = () => {
      database.close()
      resolve()
    }
    request.onerror = () => {
      database.close()
      reject(request.error)
    }
  })
}

async function downloadFile(id: string) {
  const database = await openFileDatabase()

  return new Promise<void>((resolve, reject) => {
    const request = database
      .transaction(STORE_NAME, 'readonly')
      .objectStore(STORE_NAME)
      .get(id)

    request.onsuccess = () => {
      database.close()
      const storedFile = request.result as StoredFile | undefined

      if (!storedFile) {
        reject(new Error('File not found'))
        return
      }

      const url = URL.createObjectURL(storedFile.file)
      const link = document.createElement('a')
      link.href = url
      link.download = storedFile.name
      link.click()
      URL.revokeObjectURL(url)
      resolve()
    }
    request.onerror = () => {
      database.close()
      reject(request.error)
    }
  })
}

function Share() {
  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <p className="island-kicker mb-2">Share</p>
        <h1 className="display-title mb-3 text-4xl font-bold text-[var(--sea-ink)] sm:text-5xl">
          Share a file with others.
        </h1>
        <p className="m-0 max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)]">
          Use this page to share a file with others. You can upload a file and
          save it in this browser, download it later, or copy a link for this
          page.
        </p>
      </section>

      <ShareWorkspace />
    </main>
  )
}

function ShareWorkspace() {
  const [files, setFiles] = useState<SavedFile[]>([])
  const [message, setMessage] = useState('')
  const [isBusy, setIsBusy] = useState(true)

  useEffect(() => {
    getSavedFiles()
      .then(setFiles)
      .catch(() => setMessage('Your browser could not open local file storage.'))
      .finally(() => setIsBusy(false))
  }, [])

  async function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    setIsBusy(true)
    setMessage('')

    try {
      const savedFile = await saveFile(file)
      setFiles((currentFiles) => [savedFile, ...currentFiles])
      setMessage(`${file.name} was saved in this browser.`)
    } catch {
      setMessage(
        'This file could not be saved. It may be too large for browser storage.',
      )
    } finally {
      setIsBusy(false)
    }
  }

  async function handleDelete(id: string) {
    await removeFile(id)
    setFiles((currentFiles) => currentFiles.filter((file) => file.id !== id))
    setMessage('File removed from this browser.')
  }

  async function handleCopyLink(id: string) {
    const link = `${window.location.origin}/share?file=${encodeURIComponent(id)}`
    await navigator.clipboard.writeText(link)
    setMessage('Link copied. It works anywhere this browser has the saved file.')
  }

  return (
    <section className="island-shell mt-8 rounded-2xl p-6 sm:p-8">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="island-kicker mb-2">Your files</p>
          <h2 className="display-title m-0 text-3xl font-bold text-[var(--sea-ink)]">
            Keep a private local copy.
          </h2>
        </div>
        <label className="inline-flex cursor-pointer items-center justify-center rounded-full bg-[var(--lagoon-deep)] px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:brightness-105">
          <span>{isBusy ? 'Saving...' : 'Choose a file'}</span>
          <input
            type="file"
            className="sr-only"
            onChange={handleFileSelected}
            disabled={isBusy}
          />
        </label>
      </div>

      {message && (
        <p className="mt-5 rounded-xl border border-[var(--line)] bg-[var(--chip-bg)] px-4 py-3 text-sm text-[var(--sea-ink-soft)]">
          {message}
        </p>
      )}

      {files.length === 0 && !isBusy ? (
        <div className="mt-6 rounded-xl border border-dashed border-[var(--line)] px-5 py-10 text-center">
          <p className="m-0 font-semibold text-[var(--sea-ink)]">No files saved yet.</p>
          <p className="mt-2 mb-0 text-sm text-[var(--sea-ink-soft)]">
            Choose a file to save it securely in this browser.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-3">
          {files.map((file) => (
            <article
              key={file.id}
              className="feature-card flex flex-col gap-4 rounded-xl p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <h3 className="m-0 truncate font-bold text-[var(--sea-ink)]">
                  {file.name}
                </h3>
                <p className="m-0 mt-1 text-sm text-[var(--sea-ink-soft)]">
                  {formatBytes(file.size)} · Saved {formatDate(file.savedAt)}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-sm font-semibold">
                <button
                  type="button"
                  className="rounded-full border border-[var(--line)] px-4 py-2 text-[var(--sea-ink)] transition hover:bg-[var(--link-bg-hover)]"
                  onClick={() => void downloadFile(file.id)}
                >
                  Download
                </button>
                <button
                  type="button"
                  className="rounded-full border border-[var(--line)] px-4 py-2 text-[var(--sea-ink)] transition hover:bg-[var(--link-bg-hover)]"
                  onClick={() => void handleCopyLink(file.id)}
                >
                  Copy link
                </button>
                <button
                  type="button"
                  className="rounded-full px-4 py-2 text-[var(--lagoon-deep)] transition hover:bg-[var(--link-bg-hover)]"
                  onClick={() => void handleDelete(file.id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
  }).format(new Date(date))
}

