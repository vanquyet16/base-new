// PATH: src/features/dashboard/types/dashboard.types.ts
// Dashboard domain types.

/**
 * Summary stats displayed on the dashboard overview card.
 */
export interface DashboardStats {
    totalUsers: number
    totalRevenue: number
    totalOrders: number
    activeProjects: number
    /** Percentage change from previous period */
    usersGrowth: number
    revenueGrowth: number
    ordersGrowth: number
}

/**
 * A single recent activity event.
 */
export interface ActivityItem {
    id: string
    type: 'user_joined' | 'order_placed' | 'payment_received' | 'comment_added'
    message: string
    timestamp: string
    actor: {
        name: string
        avatar: string | null
    }
}
