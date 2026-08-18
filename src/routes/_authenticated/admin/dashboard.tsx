// PATH: src/routes/_authenticated/admin/dashboard.tsx
import { createFileRoute } from '@tanstack/react-router'
import { AdminDashboardPage } from '@/features/admin'

export const Route = createFileRoute('/_authenticated/admin/dashboard')({
  component: AdminDashboardPage,
})
