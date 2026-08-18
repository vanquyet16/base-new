// PATH: src/components/common/ErrorBoundary/ErrorFallback.tsx
// Fallback UI shown when the ErrorBoundary catches an error.

import { AlertTriangle, RefreshCw } from 'lucide-react'

import { Button } from '@/shared/ui/shadcn/button'
import type { Nullable } from '@/shared/types/common.types'

interface ErrorFallbackProps {
  error: Nullable<Error>
  onReset?: () => void
}

/**
 * Full-page error fallback — shown when ErrorBoundary catches a runtime error.
 * Provides error details in development and a reset action.
 */
export function ErrorFallback({ error, onReset }: ErrorFallbackProps) {
  const isDev = import.meta.env.VITE_APP_ENV === 'development'

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in space-y-6 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-4">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Đã xảy ra lỗi</h1>
          <p className="text-muted-foreground">
            Ứng dụng gặp sự cố không mong muốn. Vui lòng thử lại.
          </p>
        </div>

        {/* Show error detail only in development */}
        {isDev && error && (
          <pre className="max-h-40 overflow-auto rounded-lg bg-muted p-4 text-left text-xs text-muted-foreground">
            {error.message}
            {error.stack && `\n\n${error.stack}`}
          </pre>
        )}

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          {onReset && (
            <Button onClick={onReset} variant="default">
              <RefreshCw className="mr-2 h-4 w-4" />
              Thử lại
            </Button>
          )}
          <Button variant="outline" onClick={() => window.location.replace('/')}>
            Về trang chủ
          </Button>
        </div>
      </div>
    </div>
  )
}
