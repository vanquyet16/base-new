// PATH: src/lib/utils/validators.ts
// Pure validation helper functions — no side effects, framework-independent.
// Use these in Zod schemas and form logic for reusable validation logic.

/**
 * Checks if a string is a valid email address.
 */
export function isValidEmail(email: string): boolean {
    // RFC 5322 simplified — covers 99.9% of real-world email addresses
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email.trim())
}

/**
 * Checks if a string is a valid Vietnamese phone number.
 * Supports: 09x, 08x, 07x, 03x, 05x with 10 digits total.
 */
export function isValidVietnamesePhone(phone: string): boolean {
    const cleaned = phone.replace(/[\s-]/g, '')
    const vnPhoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/
    return vnPhoneRegex.test(cleaned)
}

/**
 * Checks if a password meets minimum security requirements:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one digit
 */
export function isStrongPassword(password: string): boolean {
    if (password.length < 8) return false
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasDigit = /\d/.test(password)
    return hasUpperCase && hasLowerCase && hasDigit
}

/**
 * Checks if a string is a valid URL (http or https only).
 */
export function isValidUrl(url: string): boolean {
    try {
        const parsed = new URL(url)
        return parsed.protocol === 'http:' || parsed.protocol === 'https:'
    } catch {
        return false
    }
}

/**
 * Checks if a value is empty: null, undefined, empty string, or empty array.
 */
export function isEmpty(value: unknown): boolean {
    if (value === null || value === undefined) return true
    if (typeof value === 'string') return value.trim().length === 0
    if (Array.isArray(value)) return value.length === 0
    return false
}
