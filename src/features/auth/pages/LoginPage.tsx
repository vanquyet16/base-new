// PATH: src/features/auth/pages/LoginPage.tsx
import React from 'react'
import { LoginForm } from '@/features/auth/components/LoginForm'

/**
 * LoginPage — Trang đăng nhập người dùng.
 */
export const LoginPage = React.memo(() => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Đăng nhập</h2>
        <p className="text-sm text-muted-foreground">Nhập thông tin đăng nhập của bạn</p>
      </div>
      <LoginForm />
    </div>
  )
})

LoginPage.displayName = 'LoginPage'
