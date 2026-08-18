// PATH: src/features/auth/hooks/useRegisterForm.ts
// Hook chuyên biệt cho Register — quản lý form và xử lý đăng ký.
// Sửa lỗi cũ: dùng mutateAsync thay vì mutate, thêm try/catch, navigate sau register.

import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from '@tanstack/react-router'

import { toast } from '@/shared/stores/toast.store'
import type { ApiError } from '@/shared/types/api.types'

import { registerSchema, type RegisterFormValues } from '../schemas/auth.schema'
import { useRegisterMutation } from './auth.queries'

/**
 * useRegisterForm — Hook quản lý toàn bộ register flow.
 * - Khởi tạo form với validation Zod (bao gồm cross-field confirmPassword)
 * - Gọi API register qua mutateAsync (await được, có thể try/catch)
 * - Toast thành công và navigate về /login sau khi đăng ký thành công
 * - Surface lỗi server qua toast
 */
export function useRegisterForm() {
    const router = useRouter()
    const registerMutation = useRegisterMutation()

    // Khởi tạo form với giá trị mặc định
    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: '',
            firstName: '',
            lastName: '',
            password: '',
            confirmPassword: '',
        },
    })

    /**
     * Xử lý submit form register.
     * Gọi API → toast thành công → navigate về trang login để đăng nhập.
     */
    const handleRegister = useCallback(
        async (values: RegisterFormValues) => {
            try {
                await registerMutation.mutateAsync(values)
                toast.success('Đăng ký tài khoản thành công! Vui lòng đăng nhập.')
                void router.navigate({ to: '/login' })
            } catch (err) {
                const error = err as ApiError
                const message = error.message || 'Đăng ký thất bại, vui lòng thử lại'
                toast.error(message)
            }
        },
        [registerMutation, router],
    )

    return {
        form,
        handleRegister,
        isPending: registerMutation.isPending,
    }
}
