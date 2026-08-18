// PATH: src/config/env.ts
// Zod-validated environment variables — throws on startup if any required var is missing.
// This ensures the app NEVER starts silently with a broken config.

import { z } from 'zod'

// ─── Schema Definition ────────────────────────────────────────────────────────

const envSchema = z.object({
    VITE_API_BASE_URL: z.string().url({ message: 'VITE_API_BASE_URL must be a valid URL' }),
    VITE_API_TIMEOUT: z.coerce
        .number()
        .int()
        .positive()
        .default(30000),
    VITE_APP_NAME: z.string().min(1).default('BaseReactJS'),
    VITE_APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),
    VITE_SENTRY_DSN: z.string().default(''),
})

// ─── Validation ───────────────────────────────────────────────────────────────

const parsed = envSchema.safeParse(import.meta.env)

if (!parsed.success) {
    // Throw immediately on startup — better to crash early than silently fail later
    const formatted = parsed.error.format()
    console.error('❌ Invalid environment variables:', JSON.stringify(formatted, null, 2))
    throw new Error('[env] Invalid environment configuration. Check .env file.')
}

// ─── Exports ──────────────────────────────────────────────────────────────────

/**
 * Validated, typed environment variables.
 * Import this instead of `import.meta.env` directly in all files.
 */
export const env = parsed.data

export const isDev = env.VITE_APP_ENV === 'development'
export const isProd = env.VITE_APP_ENV === 'production'
export const isStaging = env.VITE_APP_ENV === 'staging'
