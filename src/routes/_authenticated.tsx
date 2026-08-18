// PATH: src/routes/_authenticated.tsx
// Layout route cho tất cả trang cần đăng nhập.
// beforeLoad kiểm tra auth trước khi bất kỳ child route nào load.
// Dùng MainLayout cho toàn bộ — AdminLayout đã được hợp nhất.

import { createFileRoute } from '@tanstack/react-router'

import { MainLayout } from '@/layouts/MainLayout'

export const Route = createFileRoute('/_authenticated')({
    /**
     * Auth guard — chạy trước bất kỳ child route nào.
     * Đọc từ store.getState() vì beforeLoad chạy ngoài React render cycle.
     * Nếu chưa đăng nhập → redirect về /login.
     */
    // beforeLoad: () => {
    //     const { isAuthenticated } = useAuthStore.getState()
    //     if (!isAuthenticated) {
    //         throw redirect({ to: '/login' })
    //     }
    // },

    // MainLayout đã bao gồm cả AppSidebar + Header + Outlet
    component: MainLayout,
})
