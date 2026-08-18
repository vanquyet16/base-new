// PATH: src/routes/_authenticated/dashboard.tsx
import { createFileRoute } from '@tanstack/react-router'

import { queryKeys } from '@/config/queryKeys'
import { queryClient } from '@/config/queryClient'
import { getDashboardStatsApi } from '@/features/dashboard/api/dashboard.api'
import { DashboardSkeleton, DashboardPage } from '@/features/dashboard'
import { ErrorFallback } from '@/shared/ui/common/ErrorBoundary/ErrorFallback'

export const Route = createFileRoute('/_authenticated/dashboard')({
  /**
   * Loader: prefetch dashboard stats trước khi component render.
   * Ngăn chặn flash skeleton nếu dữ liệu đã có sẵn trong cache.
   */
  loader: () =>
    queryClient.ensureQueryData({
      queryKey: queryKeys.dashboard.stats(),
      queryFn: getDashboardStatsApi,
    }),

  // Hiển thị khi loader đang chạy
  pendingComponent: DashboardSkeleton,

  // Hiển thị khi loader hoặc query gặp lỗi
  errorComponent: ({ error }) => (
    <ErrorFallback error={error instanceof Error ? error : new Error(String(error))} />
  ),

  component: DashboardPage,
})
