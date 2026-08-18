// PATH: src/types/env.d.ts
// Vite environment variable type augmentation
// Extends ImportMetaEnv so VITE_* vars are fully typed in the codebase

/// <reference types="vite/client" />

interface ImportMetaEnv {
    /** Base URL for all API requests, e.g. http://localhost:3000/api/v1 */
    readonly VITE_API_BASE_URL: string

    /** Axios request timeout in milliseconds */
    readonly VITE_API_TIMEOUT: string

    /** Display name of the application */
    readonly VITE_APP_NAME: string

    /** Current deployment environment */
    readonly VITE_APP_ENV: 'development' | 'staging' | 'production'

    /** Sentry DSN — empty string means Sentry is disabled */
    readonly VITE_SENTRY_DSN: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
