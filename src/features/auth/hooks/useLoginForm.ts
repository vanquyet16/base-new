// PATH: src/features/auth/hooks/useLoginForm.ts
// Hook chuyên biệt cho Login — quản lý form và xử lý login logic.
// Tách từ useAuthLogic để tuân thủ Single Responsibility Principle.

import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from '@tanstack/react-router'

import { toast } from '@/shared/stores/toast.store'
import type { ApiError } from '@/shared/types/api.types'

import { loginSchema, type LoginFormValues } from '../schemas/auth.schema'
import { useAuthStore } from '../stores/auth.store'
import { useLoginMutation } from './auth.queries'

/**
 * useLoginForm — Hook quản lý toàn bộ login flow.
 * - Khởi tạo form với validation Zod
 * - Gọi API login qua mutation
 * - Lưu auth state và navigate sau khi đăng nhập thành công
 * - Surface lỗi server qua toast
 */
export function useLoginForm() {
    const { setAuth } = useAuthStore()
    const router = useRouter()
    const loginMutation = useLoginMutation()

    // Khởi tạo form với giá trị mặc định
    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
    })

    /**
     * Xử lý submit form login.
     * Gọi API → lưu auth state → toast welcome → navigate về dashboard.
     */
    const handleLogin = useCallback(
        async (values: LoginFormValues) => {
            try {
                const data = await loginMutation.mutateAsync(values)
                setAuth(data.user, data.accessToken)
                toast.success(`Chào mừng trở lại, ${data.user.firstName}!`)
                void router.navigate({ to: '/dashboard' })
            } catch (err) {
                const error = err as ApiError
                // Ưu tiên lỗi credentials cụ thể (sai mật khẩu/tài khoản)
                const message = error.errors?.['credentials'] ?? error.message
                toast.error(message || 'Đăng nhập thất bại')
            }
        },
        [loginMutation, setAuth, router],
    )

    return {
        form,
        handleLogin,
        isPending: loginMutation.isPending,
    }
}
