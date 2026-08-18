// PATH: src/hooks/useMediaQuery.ts
// Returns true/false based on a CSS media query — useful for responsive logic in JS.

import { useEffect, useState } from 'react'

/**
 * Evaluates a CSS media query and returns a boolean that updates reactively.
 * @param query - CSS media query string, e.g. '(min-width: 768px)'
 *
 * @example
 *   const isMobile = useMediaQuery('(max-width: 767px)')
 *   const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
 */
export function useMediaQuery(query: string): boolean {
    // Initialize with the current match state to avoid a flash on first render
    const [matches, setMatches] = useState<boolean>(() => {
        // SSR guard: window may not exist in server-side environments
        if (typeof window === 'undefined') return false
        return window.matchMedia(query).matches
    })

    useEffect(() => {
        if (typeof window === 'undefined') return

        const mediaQueryList = window.matchMedia(query)

        // Use addEventListener for modern browsers (addListener is deprecated)
        const handler = (event: MediaQueryListEvent) => setMatches(event.matches)
        mediaQueryList.addEventListener('change', handler)

        return () => mediaQueryList.removeEventListener('change', handler)
    }, [query])

    return matches
}
