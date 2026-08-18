import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/test')({
  component: Test,
})

function Test() {
  return <div>Test Lazy</div>
}
