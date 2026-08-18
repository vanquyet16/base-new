import type { ActivityItem, DashboardStats } from '../types/dashboard.types'

/**
 * GET /dashboard/stats — fetches dashboard overview statistics.
 */
export async function getDashboardStatsApi(): Promise<DashboardStats> {
    /**
     * const response = await apiClient.get<ApiResponse<DashboardStats>>(DASHBOARD_ENDPOINTS.STATS)
     * return response.data
     */
    // Mock data since real API does not exist
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                totalUsers: 1420,
                usersGrowth: 12.5,
                totalRevenue: 45000000,
                revenueGrowth: 8.2,
                totalOrders: 350,
                ordersGrowth: -2.4,
                activeProjects: 12,
            })
        }, 500)
    })
}

/**
 * GET /dashboard/activity — fetches recent activity feed.
 */
export async function getRecentActivityApi(): Promise<ActivityItem[]> {
    /**
     * const response = await apiClient.get<ApiResponse<ActivityItem[]>>(DASHBOARD_ENDPOINTS.ACTIVITY)
     * return response.data
     */
    // Mock data since real API does not exist

    return new Promise(resolve => {
        setTimeout(() => {
            resolve([
                {
                    id: '1',
                    type: 'user_joined',
                    message: 'Admin has joined the project',
                    timestamp: new Date().toISOString(),
                    actor: {
                        name: 'Admin',
                        avatar: null
                    }
                }
            ])
        }, 500)
    })
}
