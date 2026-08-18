// PATH: src/routes/index.tsx
// Root index route — redirects to /dashboard

import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    // Always redirect from / to /dashboard
    // _authenticated.tsx will handle the auth guard
    throw redirect({ to: '/dashboard' })
  },
})
