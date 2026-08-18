// PATH: src/layouts/MainLayout/MainLayout.tsx
// Bố cục chính của ứng dụng Bộ Công An: Header toàn màn hình trên cùng + Sidebar nằm dưới Header.

import React from 'react'
import { Outlet } from '@tanstack/react-router'

import { SidebarInset, SidebarProvider } from '@/shared/ui/shadcn/sidebar'

import { Header } from '../Shares/Header'
import { AppSidebar } from '../Shares/AppSidebar'

/**
 * MainLayout — Khung layout chính của ứng dụng Bộ Công An cho các route đã xác thực.
 * Cấu trúc: Header toàn chiều rộng (Top Full-width) + Thân dưới chứa Sidebar & Vùng nội dung chính.
 */
export const MainLayout = React.memo(function MainLayout() {
  return (
    <SidebarProvider
      data-layout="admin"
      defaultOpen
      className="flex min-h-svh h-svh w-full flex-col overflow-hidden bg-background"
    >
      {/* ─── 1. Header trên cùng chiếm toàn bộ chiều ngang ─────────────────── */}
      <Header />

      {/* ─── 2. Phần thân dưới Header: Sidebar + Vùng nội dung chính ───────── */}
      <div className="flex flex-1 w-full overflow-hidden relative">
        {/* Sidebar điều hướng chính */}
        <AppSidebar />
        
        {/* Vùng nội dung chính */}
        <SidebarInset className="flex w-full flex-1 flex-col overflow-y-auto bg-background">
          <main className="flex-1 " id="main-content">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
})

MainLayout.displayName = 'MainLayout'
