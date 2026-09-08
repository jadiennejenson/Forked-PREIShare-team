import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/share')({
  component: Share,
})

function Share() {
  return <div>Share a file</div>
}