// PATH: src/components/common/ErrorBoundary/ErrorBoundary.tsx
// Class-based React Error Boundary — required because error boundaries
// must be class components (no hook equivalent exists yet in React).

import { Component, type ErrorInfo, type ReactNode } from 'react'

import { ErrorFallback } from './ErrorFallback'

interface ErrorBoundaryProps {
  children: ReactNode
  /** Custom fallback — defaults to ErrorFallback if not provided */
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * Error boundary that catches runtime errors in its subtree.
 * Renders a fallback UI instead of crashing the entire app.
 * Logs errors to console in dev, Sentry in production.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary] Caught error:', error, info.componentStack)

    // Report to Sentry in production — install @sentry/react and uncomment:
    // if (import.meta.env.VITE_APP_ENV === 'production') {
    //   import('@sentry/react').then(({ captureException }) => {
    //     captureException(error, { extra: { componentStack: info.componentStack } })
    //   }).catch(() => undefined)
    // }
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return <ErrorFallback error={this.state.error} onReset={this.handleReset} />
    }
    return this.props.children
  }
}
