// PATH: src/app/providers/index.tsx
// Combines all providers into a single <AppProviders> wrapper.
// Order matters: QueryProvider must wrap anything that uses useQuery/useMutation.

import type { PropsWithChildren } from '@/shared/types/common.types'

import { QueryProvider } from './QueryProvider'
import { ToastProvider } from './ToastProvider'

/**
 * Root provider composition.
 * Wrap the RouterProvider with this in main.tsx.
 */
export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </QueryProvider>
  )
}
