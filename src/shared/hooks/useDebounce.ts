// PATH: src/hooks/useDebounce.ts
// Returns a debounced version of value — useful for search inputs to reduce API calls.

import { useEffect, useState } from 'react'

/**
 * Debounces a value: returns the latest value only after `delay` ms of inactivity.
 * @param value - the value to debounce (string, number, object, etc.)
 * @param delay - debounce delay in milliseconds (default: 300ms)
 */
export function useDebounce<T>(value: T, delay = 300): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value)

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        // Cleanup on value or delay change — cancels the previous timer
        return () => clearTimeout(timer)
    }, [value, delay])

    return debouncedValue
}
