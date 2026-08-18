// PATH: src/types/api.types.ts
// Global API type definitions — shared across all features
// Rule: ZERO imports from any src layer

/**
 * Standard success response wrapper from the API server.
 * All endpoints should return data in this shape.
 */
export interface ApiResponse<T> {
    data: T
    message: string
    success: boolean
    timestamp: string
}

/**
 * Paginated list response — extends ApiResponse with pagination metadata.
 * Used by any endpoint returning a list with pagination.
 */
export interface PaginatedResponse<T> {
    data: T[]
    meta: PaginationMeta
    message: string
    success: boolean
    totalRecord: number
}

/**
 * Pagination metadata returned by the server.
 */
export interface PaginationMeta {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
}

/**
 * Normalized API error — always thrown by apiClient after interceptor processing.
 * Axios errors are transformed to this shape so feature code never deals with AxiosError.
 */
export interface ApiError {
    message: string
    statusCode: number
    /** Field-specific validation errors from the server (e.g. { email: 'already taken' }) */
    errors?: Record<string, string>
    /** Original error for debugging — only populated in development */
    originalError?: unknown
}

/**
 * Query params for list endpoints.
 */
export interface PaginationParams {
    page?: number
    limit?: number
}

/**
 * Sort params for list endpoints.
 */
export interface SortParams {
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

/**
 * Combined query params for sortable + paginated lists.
 */
export type ListQueryParams = PaginationParams & SortParams & Record<string, unknown>
