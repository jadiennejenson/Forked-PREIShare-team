import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/share')({
  component: Share,
})

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
          get a shareable link to send to others.
        </p>
      </section>
    </main>
  )
}

