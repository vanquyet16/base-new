// PATH: src/routes/_authenticated/demo-component.tsx
import { createFileRoute } from '@tanstack/react-router'
import { DemoComponentPage } from '@/features/demo-component'

export const Route = createFileRoute('/_authenticated/demo-component')({
  component: DemoComponentPage,
})
