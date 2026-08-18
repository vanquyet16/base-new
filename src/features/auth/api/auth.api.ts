// PATH: src/features/auth/api/auth.api.ts
// Auth API calls — all HTTP calls for the auth feature go through apiClient.
// Never call axiosInstance directly in feature code.

import { apiClient } from '@/shared/lib/axios'
import type { ApiResponse } from '@/shared/types/api.types'

import { AUTH_ENDPOINTS } from '../constants/endpoints'
import type {
    LoginRequest,
    LoginResponse,
    RefreshTokenResponse,
    RegisterRequest,
    RegisterResponse,
    User,
} from '../types/auth.types'

/**
 * POST /auth/login — authenticates user and returns token + profile.
 */
export async function loginApi(payload: LoginRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>(AUTH_ENDPOINTS.LOGIN, payload)
}

/**
 * POST /auth/register — creates a new user account.
 */
export async function registerApi(payload: RegisterRequest): Promise<RegisterResponse> {
    return apiClient.post<RegisterResponse>(AUTH_ENDPOINTS.REGISTER, payload)
}

/**
 * POST /auth/logout — invalidates the current token on the server.
 */
export async function logoutApi(): Promise<void> {
    return apiClient.post<void>(AUTH_ENDPOINTS.LOGOUT)
}

/**
 * GET /auth/me — fetches the current authenticated user's profile.
 * Called on app mount to restore session and validate the stored token.
 */
export async function getMeApi(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>(AUTH_ENDPOINTS.ME)
    return response.data
}

/**
 * POST /auth/refresh — refreshes the access token using the refresh token.
 */
export async function refreshTokenApi(refreshToken: string): Promise<RefreshTokenResponse> {
    return apiClient.post<RefreshTokenResponse>(AUTH_ENDPOINTS.REFRESH, { refreshToken })
}
