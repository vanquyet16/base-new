/* eslint-disable react-refresh/only-export-components */
// PATH: src/test/utils.tsx
// Custom render function that wraps components with all necessary providers for testing.
// Import from '@/test/utils' instead of '@testing-library/react' in all test files.

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, type RenderOptions } from '@testing-library/react'
import type { ReactNode } from 'react'

/**
 * Creates a fresh QueryClient for each test to prevent state leak between tests.
 * Disables retries to make tests fail fast.
 */
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // No retries in tests — fail immediately on error
        retry: false,
        // No staleTime in tests — always considers data stale
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  })
}

interface WrapperProps {
  children: ReactNode
}

/**
 * Wrapper component that provides all required contexts for component tests.
 */
function AllProviders({ children }: WrapperProps) {
  const testQueryClient = createTestQueryClient()
  return <QueryClientProvider client={testQueryClient}>{children}</QueryClientProvider>
}

/**
 * Custom render — wraps component with QueryClient and other providers.
 *
 * @example
 *   const { getByRole } = customRender(<MyComponent />)
 */
function customRender(ui: ReactNode, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: AllProviders, ...options })
}

// Re-export everything from RTL for convenience
export * from '@testing-library/react'
// Override render with our custom version
export { customRender as render }
