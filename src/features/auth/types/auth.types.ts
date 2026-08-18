// PATH: src/features/auth/types/auth.types.ts
// Auth domain types — used by store, API, hooks, and components within auth feature.

import type { ID, Nullable } from '@/shared/types/common.types'

/**
 * Authenticated user profile.
 */
export interface User {
    id: ID
    email: string
    firstName: string
    lastName: string
    fullName: string
    avatar: Nullable<string>
    role: UserRole
    isEmailVerified: boolean
    createdAt: string
    updatedAt: string
}

/**
 * User roles — determines access level throughout the app.
 */
export type UserRole = 'admin' | 'manager' | 'user'

/**
 * Payload sent to POST /auth/login
 */
export interface LoginRequest {
    email: string
    password: string
    rememberMe?: boolean
}

/**
 * Response from POST /auth/login — contains token + user profile
 */
export interface LoginResponse {
    accessToken: string
    refreshToken: string
    expiresIn: number
    user: User
}

/**
 * Payload sent to POST /auth/register
 */
export interface RegisterRequest {
    email: string
    password: string
    confirmPassword: string
    firstName: string
    lastName: string
}

/**
 * Response from POST /auth/register
 */
export interface RegisterResponse {
    user: User
    message: string
}

/**
 * Response from POST /auth/refresh
 */
export interface RefreshTokenResponse {
    accessToken: string
    expiresIn: number
}
