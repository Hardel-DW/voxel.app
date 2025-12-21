import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/world')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/world"!</div>
}
