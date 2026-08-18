// PATH: src/features/auth/pages/RegisterPage.tsx
import React from 'react'
import { RegisterForm } from '@/features/auth/components/RegisterForm'

/**
 * RegisterPage — Trang đăng ký tài khoản mới.
 */
export const RegisterPage = React.memo(() => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Tạo tài khoản</h2>
        <p className="text-sm text-muted-foreground">Điền thông tin để đăng ký tài khoản mới</p>
      </div>
      <RegisterForm />
    </div>
  )
})

RegisterPage.displayName = 'RegisterPage'
