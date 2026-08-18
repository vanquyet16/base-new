// PATH: src/config/queryKeys.ts
// TanStack Query key factory — factory pattern to avoid magic strings.
// All query keys are typed and structured for easy invalidation.
//
// Usage:
//   queryKeys.auth.me()          → ['auth', 'me']
//   queryKeys.users.list(params) → ['users', 'list', params]
//   queryKeys.users.detail(id)   → ['users', 'detail', id]

/**
 * Auth feature query keys
 */
const auth = {
    /** Root key for all auth queries — use for bulk invalidation */
    all: ['auth'] as const,
    /** Current authenticated user */
    me: () => [...auth.all, 'me'] as const,
}

/**
 * Dashboard feature query keys
 */
const dashboard = {
    all: ['dashboard'] as const,
    /** Dashboard stats summary */
    stats: () => [...dashboard.all, 'stats'] as const,
    /** Recent activity list */
    recentActivity: () => [...dashboard.all, 'recentActivity'] as const,
}

/**
 * Users feature query keys
 * @example queryKeys.users.list({ page: 1, limit: 10 })
 */
const users = {
    all: ['users'] as const,
    /** List with optional filters — filters are part of the key for per-filter caching */
    list: (params?: Record<string, unknown>) => [...users.all, 'list', params] as const,
    /** Single user detail */
    detail: (id: string) => [...users.all, 'detail', id] as const,
}

/**
 * Centralized query key registry.
 * Add new feature key factories here as the app grows.
 */
export const queryKeys = {
    auth,
    dashboard,
    users,
} as const
