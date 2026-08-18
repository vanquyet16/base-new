// PATH: src/lib/axios/apiClient.ts
// Type-safe HTTP client — wraps the Axios instance with proper generics.
// All feature API files should import from here, never from axios directly.
//
// Design decision: unwrap response.data automatically so callers get T, not AxiosResponse<T>.

import type { AxiosRequestConfig } from 'axios'

import { axiosInstance } from './axiosInstance'
// Ensure interceptors are registered before any API call is made
import './interceptors'

/**
 * GET request — fetches data and unwraps response.data
 * @param url - endpoint path relative to baseURL
 * @param config - optional Axios config (params, headers, etc.)
 */
async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.get<T>(url, config)
    return response.data
}

/**
 * POST request — sends data and unwraps response.data
 * @param url - endpoint path
 * @param data - request body
 * @param config - optional Axios config
 */
async function post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.post<T>(url, data, config)
    return response.data
}

/**
 * PUT request — full resource replacement
 */
async function put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.put<T>(url, data, config)
    return response.data
}

/**
 * PATCH request — partial resource update
 */
async function patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.patch<T>(url, data, config)
    return response.data
}

/**
 * DELETE request
 */
async function del<T = void>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.delete<T>(url, config)
    return response.data
}

/**
 * Centralized API client.
 * Usage: apiClient.get<User>('/users/me')
 */
export const apiClient = {
    get,
    post,
    put,
    patch,
    // 'delete' is a reserved keyword, so we expose it as 'delete' via bracket notation
    delete: del,
} as const
