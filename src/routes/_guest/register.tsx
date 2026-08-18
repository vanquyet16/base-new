// PATH: src/routes/_guest/register.tsx
import { createFileRoute } from '@tanstack/react-router'
import { RegisterPage } from '@/features/auth'

export const Route = createFileRoute('/_guest/register')({
  component: RegisterPage,
})
