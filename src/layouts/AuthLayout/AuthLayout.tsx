// PATH: src/layouts/AuthLayout/AuthLayout.tsx
// Bố cục khung thẻ căn giữa dành cho các trang xác thực (login, register).

import React, { useMemo } from 'react'
import { Outlet } from '@tanstack/react-router'

import { env } from '@/config/env'

/**
 * AuthLayout — Bố cục giao diện cho trang Auth (Login / Register).
 * Căn giữa màn hình, hiệu ứng gradient nền và hỗ trợ footer bản quyền.
 */
export const AuthLayout = React.memo(function AuthLayout() {
  // Tránh gọi new Date() mỗi lần render — năm hiển thị không thay đổi trong phiên
  const currentYear = useMemo(() => new Date().getFullYear(), [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md animate-fade-in space-y-6">
        {/* App logo / Brand name */}
        <div className="space-y-1 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{env.VITE_APP_NAME}</h1>
          <p className="text-sm text-muted-foreground">Enterprise React Base</p>
        </div>

        {/* Card wrapper */}
        <div className="rounded-xl border bg-card p-8 shadow-lg">
          <Outlet />
        </div>

        <p className="text-center text-xs text-muted-foreground">
          © {currentYear} {env.VITE_APP_NAME}. All rights reserved.
        </p>
      </div>
    </div>
  )
})

AuthLayout.displayName = 'AuthLayout'
