// PATH: src/routes/__root.tsx
// Root route — định nghĩa router context và layout wrapper toàn cục.
// Tất cả các route khác đều là children của root route này.

import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import type { QueryClient } from '@tanstack/react-query'

import { isDev } from '@/config/env'
import { ErrorFallback } from '@/shared/ui/common/ErrorBoundary/ErrorFallback'
import { AppProviders } from '@/app/providers'
import type { useAuthStore } from '@/features/auth/stores/auth.store'
import { NotFoundPage } from '@/routes/errors/404'

/**
 * Router context shape — chia sẻ cho mọi route qua useRouteContext()
 */
interface RouterContext {
  queryClient: QueryClient
  auth: ReturnType<typeof useAuthStore.getState>
}

/**
 * Component Root bao bọc AppProviders và TanStack Router Outlet
 */
function RootComponent() {
  return (
    <AppProviders>
      <Outlet />
      {/* Router Devtools: chỉ hiển thị trong môi trường development */}
      {isDev && <TanStackRouterDevtools position="bottom-left" />}
    </AppProviders>
  )
}

/**
 * Root route với context có kiểu dữ liệu đầy đủ.
 * Các giá trị context được cung cấp trong main.tsx khi khởi tạo router.
 */
export const Route = createRootRouteWithContext<RouterContext>()({
  // Global error component — hiển thị khi có lỗi chưa được bắt trong cây route
  errorComponent: ({ error }) => (
    <ErrorFallback error={error instanceof Error ? error : new Error(String(error))} />
  ),
  // Global 404 component
  notFoundComponent: NotFoundPage,

  component: RootComponent,
})
