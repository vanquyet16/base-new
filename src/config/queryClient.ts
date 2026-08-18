// PATH: src/config/queryClient.ts
// TanStack Query v5 — QueryClient singleton with production-ready defaults
// Import this singleton in AppProviders and in the router context

import { QueryClient } from '@tanstack/react-query'
import { isProd } from '@/config/env'
import { toast } from '@/shared/stores/toast.store'

import type { ApiError } from '@/shared/types/api.types'

/**
 * Determine if a query error should trigger a retry.
 * Skip retries for 4xx errors (client errors) since retrying won't help.
 */
function shouldRetry(failureCount: number, error: unknown): boolean {
    const apiError = error as ApiError
    // Don't retry on client errors (400–499)
    if (apiError?.statusCode >= 400 && apiError?.statusCode < 500) {
        return false
    }
    // Allow up to 2 retries for server errors / network failures
    return failureCount < 2
}

/**
 * QueryClient singleton — export once and share across providers + router.
 * Using a module-level singleton ensures consistent cache across the app.
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // 5 minutes — data is considered fresh for this duration before a background refetch
            staleTime: 5 * 60 * 1000,
            // 10 minutes — inactive queries stay in cache before garbage collection
            gcTime: 10 * 60 * 1000,
            // Smart retry: skip on 4xx, retry up to 2x on 5xx/network
            retry: shouldRetry,
            // Refetch on window focus in production (useful for dashboard-style apps)
            refetchOnWindowFocus: isProd,
        },
        mutations: {
            // Global error handler for mutations — shows a toast on failure
            // Individual mutations can override this with their own onError
            onError: (error: unknown) => {
                const apiError = error as ApiError
                toast.error(apiError?.message ?? 'An unexpected error occurred. Please try again.')
            },
        },
    },
})
