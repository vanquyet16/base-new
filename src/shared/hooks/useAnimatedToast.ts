// PATH: src/shared/hooks/useAnimatedToast.ts
import { useToastStore } from '@/shared/stores/toast.store'

/**
 * Hook sử dụng Toast thông báo hoạt ảnh
 */
export function useAnimatedToast() {
  const addToast = useToastStore((state) => state.addToast)
  const removeToast = useToastStore((state) => state.removeToast)
  const clearAll = useToastStore((state) => state.clearAll)

  return { addToast, removeToast, clearAll }
}

// Promise Toast (cho các tác vụ bất đồng bộ)
export interface PromiseToastProps<T> {
  promise: Promise<T>
  loading: string
  success: string | ((data: T) => string)
  error: string | ((err: Error) => string)
}

export function usePromiseToast() {
  const { addToast, removeToast } = useAnimatedToast()

  return async function promiseToast<T>({
    promise,
    loading,
    success,
    error,
  }: PromiseToastProps<T>) {
    const id = addToast({ message: loading, type: 'info', duration: 0 })

    try {
      const data = await promise
      removeToast(id)
      addToast({
        message: typeof success === 'function' ? success(data) : success,
        type: 'success',
      })
      return data
    } catch (err) {
      removeToast(id)
      addToast({
        message: typeof error === 'function' ? error(err as Error) : error,
        type: 'error',
      })
      throw err
    }
  }
}
