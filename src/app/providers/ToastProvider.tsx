// PATH: src/app/providers/ToastProvider.tsx
// Global toast notification provider using Sonner.

import { AnimatedToastProvider } from '@/shared/ui/shadcn/animated-toast'

/**
 * Renders the AnimatedToast provider.
 */
export function ToastProvider({ children }: { children?: React.ReactNode }) {
  return (
    <AnimatedToastProvider position="top-right">
      {children}
    </AnimatedToastProvider>
  )
}
