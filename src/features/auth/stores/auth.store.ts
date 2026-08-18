// PATH: src/features/auth/stores/auth.store.ts
// Auth Zustand store — persists token in localStorage, devtools enabled.
// Rule: persist ONLY the token (avoid storing sensitive user data in localStorage).

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import type { Nullable } from '@/shared/types/common.types'

import type { User } from '../types/auth.types'

// ─── State ────────────────────────────────────────────────────────────────────

interface AuthState {
    /** Authenticated user profile — null when not logged in */
    user: Nullable<User>
    /** JWT access token — persisted in localStorage for session restore */
    token: Nullable<string>
    /** True when user is authenticated (has a valid token + user) */
    isAuthenticated: boolean
    /** True during async auth operations (login, logout, token refresh) */
    isLoading: boolean
}

// ─── Actions ──────────────────────────────────────────────────────────────────

interface AuthActions {
    /**
     * Set auth state after successful login or token refresh.
     * @param user - authenticated user profile
     * @param token - JWT access token
     */
    setAuth: (user: User, token: string) => void

    /** Clear all auth state — called on logout or 401 */
    clearAuth: () => void

    /** Update user profile without changing token (e.g. after profile edit) */
    setUser: (user: User) => void

    /** Set loading state during async operations */
    setLoading: (isLoading: boolean) => void
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState & AuthActions>()(
    devtools(
        persist(
            (set) => ({
                // Initial state
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,

                // Actions
                setAuth: (user, token) =>
                    set(
                        { user, token, isAuthenticated: true, isLoading: false },
                        false,
                        'auth/setAuth',
                    ),

                clearAuth: () =>
                    set(
                        { user: null, token: null, isAuthenticated: false, isLoading: false },
                        false,
                        'auth/clearAuth',
                    ),

                setUser: (user) => set({ user }, false, 'auth/setUser'),

                setLoading: (isLoading) => set({ isLoading }, false, 'auth/setLoading'),
            }),
            {
                name: 'auth-storage',
                // Persist ONLY the token — user profile is fetched fresh on app load
                // This prevents stale user data from being used on session restore
                partialize: (state) => ({ token: state.token }),
                // On rehydration, mark as authenticated if a token exists
                // The token will be validated when useMe() fires on app mount
                onRehydrateStorage: () => (state) => {
                    if (state?.token) {
                        state.isAuthenticated = true
                    }
                },
            },
        ),
        { name: 'auth-store' },
    ),
)
