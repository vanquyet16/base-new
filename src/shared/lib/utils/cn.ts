// PATH: src/lib/utils/cn.ts
// Utility for merging Tailwind CSS classes safely.
// Combines clsx (conditional classes) + tailwind-merge (deduplicate conflicting Tailwind classes)
//
// Usage: cn('px-4 py-2', condition && 'bg-red-500', 'px-2') → 'py-2 bg-red-500 px-2'
// tailwind-merge ensures the last 'px-*' wins: 'py-2 px-2' (not 'px-4 py-2 px-2')

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge class names with Tailwind conflict resolution.
 * @param inputs - any mix of strings, objects, arrays (clsx format)
 * @returns merged class string safe for className prop
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs))
}
