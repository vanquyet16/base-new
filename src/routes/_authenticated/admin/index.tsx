// PATH: src/routes/_authenticated/admin/index.tsx
// /admin redirects to /admin/dashboard

import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/admin/')({
  beforeLoad: () => {
    throw redirect({ to: '/admin/dashboard' })
  },
})
