import { createFileRoute } from '@tanstack/react-router'
import { useState, useCallback } from 'react'
import { Download, Plus, RotateCw } from 'lucide-react'

import { queryKeys } from '@/config/queryKeys'
import { queryClient } from '@/config/queryClient'
import { getDashboardStatsApi } from '@/features/dashboard/api/dashboard.api'
import { useDashboardStats } from '@/features/dashboard/hooks/useDashboard'
import { DashboardSkeleton, DashboardStats } from '@/features/dashboard'
import { ErrorFallback } from '@/shared/ui/common/ErrorBoundary/ErrorFallback'
import { AnimatedCalendar } from '@/shared/ui/shadcn/calender'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/shadcn/card'
import BreadcrumbWithAction from '@/shared/ui/common/customs/BreadcrumbWithAction'
import CustomButton from '@/shared/ui/common/customs/CustomButton'
import MainContent from '@/shared/ui/common/customs/MainContent'

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

/**
 * DashboardPage — Hiển thị các chỉ số thống kê và lịch làm việc.
 */
function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats()
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>()
  const [isDemoLoading, setIsDemoLoading] = useState(false)

  // Hàm mô phỏng tải lại dữ liệu để thử nghiệm hiệu ứng LoadingComponentChild
  const handleTriggerDemoLoading = useCallback(() => {
    setIsDemoLoading(true)
    setTimeout(() => {
      setIsDemoLoading(false)
    }, 2000)
  }, [])

  if (isLoading || !stats) return <DashboardSkeleton />

  return (
    <div className="flex flex-col animate-fade-in">
      {/* Thanh tiêu đề và Breadcrumb hành động */}
      <BreadcrumbWithAction
        title="Danh sách Tổng hợp báo cáo từ các đơn vị"
        breadcrumbs={[
          { label: 'Trang chủ', to: '/dashboard' },
          { label: 'Đào tạo bồi dưỡng', to: '/dao-tao' },
          { label: 'Tổng hợp báo cáo' },
        ]}
        rightSlot={
          <>
            <CustomButton
              variant="outline"
              title="Tải lại số liệu"
              icon={<RotateCw className="size-4" />}
              iconPosition="start"
              loading={isDemoLoading}
              onClick={handleTriggerDemoLoading}
            />
            <CustomButton
              variant="outline"
              title="Xuất Excel"
              icon={<Download className="size-4" />}
              iconPosition="start"
              onClick={() => {}}
            />
            <CustomButton
              variant="default"
              title="Thêm báo cáo mới"
              icon={<Plus className="size-4" />}
              iconPosition="start"
              onClick={() => {}}
            />
          </>
        }
      />

      {/* ─── Vùng nội dung sử dụng MainContent (mặc định padding p-4) ─────── */}
      <MainContent
        loading={isDemoLoading}
        tip="Đang đồng bộ và tính toán số liệu thống kê..."
        loadingSize="large"
        minHeight={350}
      >
        <div className="space-y-6">
          {/* Grid thống kê số liệu */}
          <DashboardStats stats={stats} />

          {/* Lịch làm việc */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Bộ lọc khoảng thời gian</CardTitle>
                <CardDescription>Chọn khoảng ngày xem báo cáo chi tiết</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <AnimatedCalendar
                  mode="range"
                  value={dateRange}
                  onChange={setDateRange}
                  placeholder="Chọn khoảng ngày..."
                />
                {dateRange?.from && dateRange?.to && (
                  <p className="text-sm text-muted-foreground">
                    Đã chọn: {dateRange.from.toLocaleDateString('vi-VN')} -{' '}
                    {dateRange.to.toLocaleDateString('vi-VN')}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </MainContent>
    </div>
  )
}

