// PATH: src/routes/_authenticated/profile.tsx
import { createFileRoute } from '@tanstack/react-router'
import { ProfilePage } from '@/features/auth'

export const Route = createFileRoute('/_authenticated/profile')({
  component: ProfilePage,
})
