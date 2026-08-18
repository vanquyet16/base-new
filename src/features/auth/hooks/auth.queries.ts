// PATH: src/features/auth/hooks/auth.queries.ts
// Server State Hooks — Chứa các logic liên quan đến TanStack Query cho Auth.
// Chỉ tập trung vào tương tác API và quản lý Cache.

import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@/config/queryKeys'

import { getMeApi, loginApi, logoutApi, registerApi } from '../api/auth.api'
import { useAuthStore } from '../stores/auth.store'
import type { LoginRequest, RegisterRequest } from '../types/auth.types'

// ─── LOGIN MUTATION ─────────────────────────────────────────────────────────
export function useLoginMutation() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (payload: LoginRequest) => loginApi(payload),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() })
        },
    })
}

// ─── REGISTER MUTATION ──────────────────────────────────────────────────────
export function useRegisterMutation() {
    return useMutation({
        mutationFn: (payload: RegisterRequest) => registerApi(payload),
    })
}

// ─── LOGOUT MUTATION ────────────────────────────────────────────────────────
export function useLogoutMutation() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: logoutApi,
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: queryKeys.auth.me() })
        },
    })
}

// ─── GET ME QUERY ───────────────────────────────────────────────────────────
/**
 * Hook truy vấn thông tin user hiện tại.
 * queryFn là pure function; đồng bộ state vào store thông qua useEffect.
 */
export function useMeQuery() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const setUser = useAuthStore((state) => state.setUser)

    const query = useQuery({
        queryKey: queryKeys.auth.me(),
        queryFn: getMeApi,
        enabled: isAuthenticated,
        retry: 1,
    })

    // Đồng bộ user profile vào client store khi fetch thành công
    useEffect(() => {
        if (query.data) {
            setUser(query.data)
        }
    }, [query.data, setUser])

    return query
}
