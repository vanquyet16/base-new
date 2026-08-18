// PATH: src/config/constants.ts
// App-wide constants — read-only values with no side effects
// Rule: can import from types only

/**
 * App metadata
 */
export const APP_NAME = 'BaseReactJS'
export const APP_VERSION = '1.0.0'

/**
 * Pagination defaults — use these in all list query hooks
 */
export const PAGINATION_DEFAULTS = {
    PAGE: 1,
    LIMIT: 10,
    MAX_LIMIT: 100,
} as const

/**
 * Date/time formatting patterns (for use with formatters.ts)
 */
export const DATE_FORMAT = {
    DISPLAY: 'dd/MM/yyyy',
    DISPLAY_WITH_TIME: 'dd/MM/yyyy HH:mm',
    ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
    TIME_ONLY: 'HH:mm',
} as const

/**
 * Local storage keys — centralized to avoid typos
 */
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'auth_token',
    THEME: 'theme',
    LANGUAGE: 'language',
} as const

/**
 * HTTP status codes commonly handled in the app
 */
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    UNPROCESSABLE: 422,
    INTERNAL_ERROR: 500,
} as const

/**
 * Toast durations in milliseconds
 */
export const TOAST_DURATION = {
    SHORT: 2000,
    DEFAULT: 4000,
    LONG: 7000,
} as const
