'use client'

import {
  AlertCircle,
  AlertTriangle,
  Bell,
  CheckCircle,
  Info,
  X,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import * as React from 'react'
import { cn } from '@/shared/lib/utils'
import { useToastStore, type Toast, type ToastType } from '@/shared/stores/toast.store'

// Toast Provider
export function AnimatedToastProvider({
  children,
  position = 'top-right',
}: {
  children: React.ReactNode
  position?: 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center'
}) {
  const toasts = useToastStore((state) => state.toasts)
  const removeToast = useToastStore((state) => state.removeToast)

  const positionClasses: Record<string, string> = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  }

  const isTop = position.startsWith('top')

  return (
    <>
      {children}
      <div
        className={cn(
          'pointer-events-none fixed z-[100] flex flex-col gap-2',
          positionClasses[position],
        )}
      >
        <AnimatePresence mode="popLayout">
          {(isTop ? toasts : [...toasts].reverse()).map((toast, index) => (
            <ToastItem
              key={toast.id}
              toast={toast}
              index={index}
              onRemove={() => removeToast(toast.id)}
              isTop={isTop}
            />
          ))}
        </AnimatePresence>
      </div>
    </>
  )
}

// Toast Item
interface ToastItemProps {
  toast: Toast
  index: number
  onRemove: () => void
  isTop: boolean
}

function ToastItem({ toast, index, onRemove, isTop }: ToastItemProps) {
  const { type = 'default', title, message, duration = 5000, action } = toast

  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onRemove, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onRemove])

  const icons: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle className="h-5 w-5 text-emerald-500" />,
    error: <AlertCircle className="h-5 w-5 text-red-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
    default: <Bell className="h-5 w-5 text-muted-foreground" />,
  }

  const borderColors: Record<ToastType, string> = {
    success: 'border-l-emerald-500',
    error: 'border-l-red-500',
    warning: 'border-l-amber-500',
    info: 'border-l-blue-500',
    default: 'border-l-border',
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: isTop ? -20 : 20, scale: 0.9 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          type: 'spring',
          stiffness: 500,
          damping: 30,
          delay: index * 0.05,
        },
      }}
      exit={{
        opacity: 0,
        scale: 0.9,
        x: 100,
        transition: { duration: 0.2 },
      }}
      className={cn(
        'pointer-events-auto relative min-w-[320px] max-w-[420px] overflow-hidden rounded-lg border border-l-4 bg-card p-4 shadow-lg',
        borderColors[type],
      )}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex-shrink-0">{icons[type]}</div>
        <div className="min-w-0 flex-1">
          {title && <p className="font-medium text-card-foreground">{title}</p>}
          <p className={cn('text-sm text-muted-foreground', title && 'mt-1')}>
            {message}
          </p>
          {action && (
            <button
              onClick={action.onClick}
              className="mt-2 text-sm font-medium text-primary hover:underline"
            >
              {action.label}
            </button>
          )}
        </div>
        <button
          onClick={onRemove}
          className="flex-shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Progress bar */}
        {duration > 0 && (
          <motion.div
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: duration / 1000, ease: 'linear' }}
            className={cn(
              'absolute bottom-0 left-0 right-0 h-1 origin-left',
              type === 'success' && 'bg-emerald-500/30',
              type === 'error' && 'bg-red-500/30',
              type === 'warning' && 'bg-amber-500/30',
              type === 'info' && 'bg-blue-500/30',
              type === 'default' && 'bg-muted',
            )}
          />
        )}
      </div>
    </motion.div>
  )
}
