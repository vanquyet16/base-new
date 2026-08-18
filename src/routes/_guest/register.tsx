// PATH: src/routes/_guest/register.tsx
// Register page route.

import { RegisterForm } from '@/features/auth/components/RegisterForm'
import { createFileRoute } from '@tanstack/react-router'

function RegisterPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Tạo tài khoản</h2>
        <p className="text-sm text-muted-foreground">Điền thông tin để đăng ký tài khoản mới</p>
      </div>
      <RegisterForm />
    </div>
  )
}

export const Route = createFileRoute('/_guest/register')({
  component: RegisterPage,
})
