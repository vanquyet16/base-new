// PATH: src/features/dashboard/components/DashboardStats.tsx
// Dashboard stats cards — displays key metrics.

import { TrendingDown, TrendingUp } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/shadcn/card'
import { cn } from '@/shared/lib/utils/cn'
import { formatCurrency, formatNumber } from '@/shared/lib/utils/formatters'

import type { DashboardStats } from '../types/dashboard.types'

interface DashboardStatsProps {
  stats: DashboardStats
}

interface StatCardProps {
  title: string
  value: string
  growth: number
  description: string
}

/**
 * Single stat card with trend indicator.
 */
function StatCard({ title, value, growth, description }: StatCardProps) {
  const isPositive = growth >= 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div
          className={cn(
            'flex items-center gap-1 text-xs font-medium',
            isPositive ? 'text-emerald-600' : 'text-destructive',
          )}
        >
          {isPositive ? (
            <TrendingUp className="h-3.5 w-3.5" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5" />
          )}
          {Math.abs(growth).toFixed(1)}%
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

/**
 * Grid of stats cards for the dashboard overview.
 */
export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Tổng người dùng"
        value={formatNumber(stats.totalUsers)}
        growth={stats.usersGrowth}
        description="so với tháng trước"
      />
      <StatCard
        title="Doanh thu"
        value={formatCurrency(stats.totalRevenue)}
        growth={stats.revenueGrowth}
        description="so với tháng trước"
      />
      <StatCard
        title="Đơn hàng"
        value={formatNumber(stats.totalOrders)}
        growth={stats.ordersGrowth}
        description="so với tháng trước"
      />
      <StatCard
        title="Dự án đang chạy"
        value={formatNumber(stats.activeProjects)}
        growth={0}
        description="không thay đổi"
      />
    </div>
  )
}
