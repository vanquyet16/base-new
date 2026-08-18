// PATH: src/features/auth/hooks/useLogout.ts
// Hook chuyên biệt cho Logout — tách từ useAuthLogic.
// Xử lý: gọi API logout → clear auth state → clear query cache → navigate.

import { useCallback } from 'react'
import { useRouter } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'

import { toast } from '@/shared/stores/toast.store'

import { useAuthStore } from '../stores/auth.store'
import { useLogoutMutation } from './auth.queries'

/**
 * useLogout — Hook quản lý toàn bộ logout flow.
 * - Gọi API logout để invalidate token phía server
 * - Luôn clear auth state và query cache dù API có lỗi (finally)
 * - Toast thành công và navigate về /login
 */
export function useLogout() {
    const { clearAuth } = useAuthStore()
    const router = useRouter()
    const queryClient = useQueryClient()
    const logoutMutation = useLogoutMutation()

    const handleLogout = useCallback(async () => {
        try {
            await logoutMutation.mutateAsync()
        } catch {
            // Silently ignore server error — vẫn thực hiện logout phía client
        } finally {
            // Luôn clear state dù API có lỗi
            clearAuth()
            queryClient.clear()
            toast.success('Đã đăng xuất thành công')
            void router.navigate({ to: '/login' })
        }
    }, [logoutMutation, clearAuth, queryClient, router])

    return {
        handleLogout,
        isLoggingOut: logoutMutation.isPending,
    }
}
