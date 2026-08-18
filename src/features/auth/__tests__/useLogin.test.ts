// PATH: src/features/auth/__tests__/useLogin.test.ts
// Unit tests for useLoginMutation hook.

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as React from 'react'

import { loginApi } from '@/features/auth/api/auth.api'
import { useLoginMutation } from '@/features/auth/hooks/auth.queries'
import { useAuthStore } from '@/features/auth/stores/auth.store'

// Mock the auth API module
vi.mock('@/features/auth/api/auth.api', () => ({
    loginApi: vi.fn(),
}))

const mockUser = {
    id: '1',
    email: 'test@example.com',
    firstName: 'Nguyễn',
    lastName: 'Văn A',
    fullName: 'Nguyễn Văn A',
    avatar: null,
    role: 'user' as const,
    isEmailVerified: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
}

const mockLoginResponse = {
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    expiresIn: 3600,
    user: mockUser,
}

describe('useLoginMutation', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        useAuthStore.getState().clearAuth()
    })

    const createWrapper = () => {
        const queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false },
                mutations: { retry: false },
            },
        })
        return ({ children }: { children: React.ReactNode }) =>
            React.createElement(QueryClientProvider, { client: queryClient }, children)
    }

    it('should call loginApi with correct credentials', async () => {
        const mockLoginApi = vi.mocked(loginApi)
        mockLoginApi.mockResolvedValueOnce(mockLoginResponse)

        const { result } = renderHook(() => useLoginMutation(), {
            wrapper: createWrapper(),
        })

        const data = await result.current.mutateAsync({ email: 'test@example.com', password: 'Password1' })

        expect(mockLoginApi).toHaveBeenCalledWith({
            email: 'test@example.com',
            password: 'Password1',
        })
        expect(data).toEqual(mockLoginResponse)
    })

    it('should throw error when API fails', async () => {
        const mockLoginApi = vi.mocked(loginApi)
        const apiError = new Error('Invalid credentials')
        mockLoginApi.mockRejectedValueOnce(apiError)

        const { result } = renderHook(() => useLoginMutation(), {
            wrapper: createWrapper(),
        })

        await expect(
            result.current.mutateAsync({ email: 'wrong@example.com', password: 'wrongpassword' }),
        ).rejects.toThrow('Invalid credentials')
    })
})
