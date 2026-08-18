// PATH: src/lib/axios/axiosInstance.ts
// Axios instance with base configuration.
// Interceptors are registered separately in interceptors.ts.

import axios from 'axios'

import { env } from '@/config/env'

/**
 * Global Axios instance used by all API calls in the application.
 * Never use `axios.get/post` directly — always use `apiClient` or this instance.
 */
export const axiosInstance = axios.create({
    baseURL: env.VITE_API_BASE_URL,
    timeout: env.VITE_API_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-App-Name': env.VITE_APP_NAME,
    },
    // Automatically include cookies for session-based auth if needed
    withCredentials: false,
})
