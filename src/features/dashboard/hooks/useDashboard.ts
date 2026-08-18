// PATH: src/features/dashboard/hooks/useDashboard.ts
// Query hook for dashboard stats — used by the dashboard route with loader prefetch.

import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/config/queryKeys'

import { getDashboardStatsApi } from '../api/dashboard.api'

/**
 * Fetches dashboard stats.
 * The loader in dashboard.tsx prefetches this query so the component
 * gets data immediately without waterfall.
 */
export function useDashboardStats() {
    return useQuery({
        queryKey: queryKeys.dashboard.stats(),
        queryFn: getDashboardStatsApi,
        // Dashboard stats can be slightly stale — no need for aggressive refetch
        staleTime: 2 * 60 * 1000,
    })
}
