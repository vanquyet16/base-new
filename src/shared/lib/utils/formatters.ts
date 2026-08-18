// PATH: src/lib/utils/formatters.ts
// Pure formatting utility functions — no side effects, no imports from app layers.
// Used for consistent display of dates, currencies, and numbers.

/**
 * Format a date value into a localized display string.
 * @param date - ISO string, Date object, or timestamp number
 * @param options - Intl.DateTimeFormat options for customization
 * @returns formatted date string, or empty string if input is invalid
 */
export function formatDate(
    date: string | Date | number | null | undefined,
    options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    },
): string {
    if (!date) return ''
    try {
        const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
        if (isNaN(d.getTime())) return ''
        return new Intl.DateTimeFormat('vi-VN', options).format(d)
    } catch {
        return ''
    }
}

/**
 * Format a date with time (hours and minutes).
 */
export function formatDateTime(date: string | Date | number | null | undefined): string {
    return formatDate(date, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

/**
 * Format a number as a localized currency string.
 * @param amount - numeric value
 * @param currency - ISO 4217 currency code (default: 'VND')
 * @param locale - BCP 47 locale tag (default: 'vi-VN')
 */
export function formatCurrency(
    amount: number | null | undefined,
    currency = 'VND',
    locale = 'vi-VN',
): string {
    if (amount === null || amount === undefined || isNaN(amount)) return ''
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        // VND has no decimal places
        minimumFractionDigits: currency === 'VND' ? 0 : 2,
        maximumFractionDigits: currency === 'VND' ? 0 : 2,
    }).format(amount)
}

/**
 * Format a number with locale-appropriate thousand separators.
 * @param value - numeric value
 * @param decimalPlaces - number of decimal places (default: 0)
 */
export function formatNumber(value: number | null | undefined, decimalPlaces = 0): string {
    if (value === null || value === undefined || isNaN(value)) return ''
    return new Intl.NumberFormat('vi-VN', {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
    }).format(value)
}

/**
 * Truncate a string to a maximum length, adding ellipsis if truncated.
 */
export function truncate(str: string | null | undefined, maxLength: number): string {
    if (!str) return ''
    return str.length <= maxLength ? str : `${str.slice(0, maxLength)}...`
}

/**
 * Convert a string to title case (first letter of each word capitalized).
 */
export function toTitleCase(str: string | null | undefined): string {
    if (!str) return ''
    return str.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
}
