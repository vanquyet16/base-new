// PATH: src/app/providers/QueryProvider.tsx
// TanStack Query v5 provider — wraps the app with QueryClientProvider and Devtools.

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { queryClient } from '@/config/queryClient'
import type { PropsWithChildren } from '@/shared/types/common.types'

/**
 * Provides the TanStack Query context to the entire application.
 * Devtools only rendered in development.
 */
export function QueryProvider({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {import.meta.env.VITE_APP_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
      )}
    </QueryClientProvider>
  )
}
