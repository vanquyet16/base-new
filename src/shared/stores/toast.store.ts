import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'default'

export interface Toast {
  id: string
  title?: string
  message: string
  type?: ToastType
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastState {
  toasts: Toast[]
}

interface ToastActions {
  addToast: (toast: Omit<Toast, 'id'>) => string
  removeToast: (id: string) => void
  clearAll: () => void
}

export const useToastStore = create<ToastState & ToastActions>()(
  devtools(
    (set) => ({
      toasts: [],

      addToast: (toast) => {
        const id = crypto.randomUUID()
        set(
          (state) => ({
            toasts: [...state.toasts, { ...toast, id }].slice(-5), // Giới hạn 5 toast
          }),
          false,
          'toast/addToast',
        )
        return id
      },

      removeToast: (id) =>
        set(
          (state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
          }),
          false,
          'toast/removeToast'
        ),

      clearAll: () => set({ toasts: [] }, false, 'toast/clearAll'),
    }),
    { name: 'toast-store' }
  )
)

// Helper để gọi toast từ bên ngoài React component
export const toast = {
  success: (message: string, options?: Omit<Toast, 'id' | 'message' | 'type'>) =>
    useToastStore.getState().addToast({ ...options, message, type: 'success' }),
  error: (message: string, options?: Omit<Toast, 'id' | 'message' | 'type'>) =>
    useToastStore.getState().addToast({ ...options, message, type: 'error' }),
  warning: (message: string, options?: Omit<Toast, 'id' | 'message' | 'type'>) =>
    useToastStore.getState().addToast({ ...options, message, type: 'warning' }),
  info: (message: string, options?: Omit<Toast, 'id' | 'message' | 'type'>) =>
    useToastStore.getState().addToast({ ...options, message, type: 'info' }),
  default: (message: string, options?: Omit<Toast, 'id' | 'message' | 'type'>) =>
    useToastStore.getState().addToast({ ...options, message, type: 'default' }),
}
