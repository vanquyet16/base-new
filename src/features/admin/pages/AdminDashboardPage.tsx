// PATH: src/features/admin/pages/AdminDashboardPage.tsx
import React from 'react'

/**
 * AdminDashboardPage — Trang bảng điều khiển quản trị viên (Admin).
 */
export const AdminDashboardPage = React.memo(() => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Quản trị hệ thống</h1>
      <p className="text-muted-foreground">Bảng điều khiển dành riêng cho quản trị viên.</p>
    </div>
  )
})

AdminDashboardPage.displayName = 'AdminDashboardPage'
