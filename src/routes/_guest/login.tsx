// PATH: src/routes/_guest/login.tsx
// Login page route — only accessible to unauthenticated users.

import { createFileRoute } from '@tanstack/react-router'

import { LoginForm } from '@/features/auth/components/LoginForm'

export const Route = createFileRoute('/_guest/login')({
  component: LoginPage,
})

function LoginPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Đăng nhập</h2>
        <p className="text-sm text-muted-foreground">Nhập thông tin đăng nhập của bạn</p>
      </div>
      <LoginForm />
    </div>
  )
}
