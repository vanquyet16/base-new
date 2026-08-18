// PATH: src/hooks/useOnClickOutside.ts
// Fires a callback when a click is detected outside of the referenced element.
// Useful for dropdown menus, modals, tooltips.

import { useEffect, type RefObject } from 'react'

/**
 * Attaches a mousedown/touchstart listener to detect clicks outside a ref element.
 *
 * @param ref - React ref pointing to the element to monitor
 * @param handler - callback to fire when a click outside is detected
 * @param enabled - optional flag to enable/disable the listener (default: true)
 *
 * @example
 *   const ref = useRef<HTMLDivElement>(null)
 *   useOnClickOutside(ref, () => setOpen(false))
 */
export function useOnClickOutside<T extends HTMLElement>(
    ref: RefObject<T | null>,
    handler: (event: MouseEvent | TouchEvent) => void,
    enabled = true,
): void {
    useEffect(() => {
        if (!enabled) return

        const listener = (event: MouseEvent | TouchEvent) => {
            // Do nothing if the click is inside the ref element or its children
            if (!ref.current || ref.current.contains(event.target as Node)) {
                return
            }
            handler(event)
        }

        document.addEventListener('mousedown', listener)
        document.addEventListener('touchstart', listener)

        return () => {
            document.removeEventListener('mousedown', listener)
            document.removeEventListener('touchstart', listener)
        }
    }, [ref, handler, enabled])
}
