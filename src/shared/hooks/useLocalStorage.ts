// PATH: src/hooks/useLocalStorage.ts
// Typed, SSR-safe localStorage hook.
// Syncs React state with localStorage — survives page refreshes.

import { useCallback, useEffect, useState } from 'react'

/**
 * Reads a value from localStorage, returning defaultValue if not found or on error.
 */
function readFromStorage<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue
    try {
        const item = window.localStorage.getItem(key)
        return item !== null ? (JSON.parse(item) as T) : defaultValue
    } catch {
        // Fail silently on parse errors (corrupted data) — return default
        return defaultValue
    }
}

/**
 * Typed localStorage hook — persists state across page refreshes.
 *
 * @param key - localStorage key
 * @param defaultValue - initial value if key not found
 * @returns [storedValue, setValue, removeValue]
 *
 * @example
 *   const [theme, setTheme, removeTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light')
 */
export function useLocalStorage<T>(
    key: string,
    defaultValue: T,
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
    const [storedValue, setStoredValue] = useState<T>(() => readFromStorage(key, defaultValue))

    // Sync with storage changes from other tabs
    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key !== key) return
            setStoredValue(
                event.newValue !== null ? (JSON.parse(event.newValue) as T) : defaultValue,
            )
        }
        window.addEventListener('storage', handleStorageChange)
        return () => window.removeEventListener('storage', handleStorageChange)
    }, [key, defaultValue])

    /** Set a new value — persists to localStorage and updates state */
    const setValue = useCallback(
        (value: T | ((prev: T) => T)) => {
            try {
                const valueToStore = typeof value === 'function' ? (value as (prev: T) => T)(storedValue) : value
                setStoredValue(valueToStore)
                window.localStorage.setItem(key, JSON.stringify(valueToStore))
            } catch {
                console.warn(`[useLocalStorage] Failed to set key "${key}"`)
            }
        },
        [key, storedValue],
    )

    /** Remove the key from localStorage and reset to defaultValue */
    const removeValue = useCallback(() => {
        try {
            window.localStorage.removeItem(key)
            setStoredValue(defaultValue)
        } catch {
            console.warn(`[useLocalStorage] Failed to remove key "${key}"`)
        }
    }, [key, defaultValue])

    return [storedValue, setValue, removeValue]
}
