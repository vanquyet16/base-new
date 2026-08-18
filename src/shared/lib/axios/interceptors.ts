// PATH: src/lib/axios/interceptors.ts
// Axios request/response interceptors
// Responsibilities:
//   REQUEST:  inject Bearer token từ auth.store
//   RESPONSE: normalize errors to ApiError, handle 401/403/5xx

import type { AxiosError, InternalAxiosRequestConfig } from 'axios'

import { HTTP_STATUS } from '@/config/constants'
import type { ApiError } from '@/shared/types/api.types'

import { axiosInstance } from './axiosInstance'

// ─── Lazy store import ────────────────────────────────────────────────────────
// Import store lazily bên trong interceptor để tránh circular dependency:
// axiosInstance → auth.store → apiClient → axiosInstance
// Dynamic import bên trong function phá vỡ vòng lặp này.

async function getAuthStore() {
    const { useAuthStore } = await import('@/features/auth/stores/auth.store')
    return useAuthStore.getState()
}

// ─── Request Interceptor: inject auth token ───────────────────────────────────

axiosInstance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        try {
            const { token } = await getAuthStore()
            // Chỉ inject token khi tồn tại — public endpoints tự tiếp tục không cần token
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
        } catch {
            // Nếu store chưa load được, tiếp tục không kèm token (public endpoints)
        }
        return config
    },
    (error: unknown) => Promise.reject(error),
)

// ─── Response Interceptor: normalize errors ───────────────────────────────────

axiosInstance.interceptors.response.use(
    // Success path — pass through unchanged
    (response) => response,

    async (error: AxiosError<{ message?: string; errors?: Record<string, string> }>) => {
        const status = error.response?.status ?? 0
        const serverMessage = error.response?.data?.message
        const serverErrors = error.response?.data?.errors

        // ── 401 Unauthorized: clear auth state và redirect về login ──────────
        if (status === HTTP_STATUS.UNAUTHORIZED) {
            try {
                const { clearAuth } = await getAuthStore()
                clearAuth()
            } catch {
                // Fail silently nếu store không khả dụng
            }
            // Dùng window.location để tránh import router (sẽ tạo circular dep)
            window.location.replace('/login')
        }

        // ── 403 Forbidden: redirect về trang 403 ─────────────────────────
        if (status === HTTP_STATUS.FORBIDDEN) {
            window.location.replace('/403')
        }

        // ── 5xx Server Errors: log trong development, sẵn sàng cho Sentry ──
        if (status >= 500) {
            // Production: uncomment để bật Sentry sau khi cài @sentry/react
            // const { captureException } = await import('@sentry/react')
            // captureException(error)
            if (import.meta.env.VITE_APP_ENV !== 'production') {
                console.error('[API] Server error:', error)
            }
        }

        // ── Normalize thành ApiError để thống nhất xử lý ở toàn bộ app ──────
        const normalizedError: ApiError = {
            message: serverMessage ?? getDefaultMessage(status),
            statusCode: status,
            errors: serverErrors,
            // Đính kèm lỗi gốc chỉ trong development để debug dễ hơn
            originalError: import.meta.env.VITE_APP_ENV !== 'production' ? error : undefined,
        }

        return Promise.reject(normalizedError)
    },
)

/**
 * Trả về message lỗi mặc định theo HTTP status code.
 */
function getDefaultMessage(status: number): string {
    const messages: Record<number, string> = {
        [HTTP_STATUS.BAD_REQUEST]: 'Invalid request. Please check your input.',
        [HTTP_STATUS.UNAUTHORIZED]: 'Your session has expired. Please log in again.',
        [HTTP_STATUS.FORBIDDEN]: "You don't have permission to perform this action.",
        [HTTP_STATUS.NOT_FOUND]: 'The requested resource was not found.',
        [HTTP_STATUS.UNPROCESSABLE]: 'The data provided is invalid.',
        [HTTP_STATUS.INTERNAL_ERROR]: 'A server error occurred. Please try again later.',
    }
    return messages[status] ?? 'An unexpected error occurred.'
}

export { }
