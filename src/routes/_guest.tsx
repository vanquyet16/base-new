// PATH: src/routes/_guest.tsx
// Layout route for guest-only pages (login, register).
// Redirects authenticated users to /dashboard.

import { createFileRoute, redirect } from '@tanstack/react-router'

import { AuthLayout } from '@/layouts/AuthLayout'
import { useAuthStore } from '@/features/auth/stores/auth.store'

export const Route = createFileRoute('/_guest')({
  /**
   * If already authenticated, redirect to dashboard.
   * Prevents logged-in users from accessing login/register pages.
   */
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState()
    if (isAuthenticated) {
      throw redirect({ to: '/dashboard' })
    }
  },

  component: AuthLayout,
})
