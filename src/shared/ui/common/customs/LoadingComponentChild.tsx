/**
 * LoadingComponentChild — Component bọc vùng nội dung với lớp phủ loading (Overlay Spinner).
 *
 * Tính năng:
 * - Thay thế hoàn toàn Spin của Ant Design và styled-components
 * - Hiệu ứng làm mờ nhẹ (backdrop-blur) và vô hiệu tương tác khi đang loading
 * - Tự động căn giữa spinner và dòng text thông báo (tip)
 * - Tùy biến kích cỡ linh hoạt: 'small' | 'default' | 'large' | 'xl'
 * - Hỗ trợ minHeight chống giật layout (CLS - Cumulative Layout Shift)
 * - Hỗ trợ tùy biến icon (indicator) hoặc spinner xoay tròn mặc định
 * - Chuẩn Accessibility (a11y) với role="status" và aria-live="polite"
 */

import { memo, type ReactNode, type ReactElement } from 'react'
import { Loader2 } from 'lucide-react'

import { cn } from '@/shared/lib/utils'

export type LoadingSize = 'small' | 'default' | 'large' | 'xl' | 'sm' | 'md' | 'lg'

export interface LoadingComponentChildProps {
  /** Trạng thái loading: true = đang tải và hiện lớp phủ, false = bình thường */
  loading: boolean
  /** Nội dung con được bọc bên trong */
  children: ReactNode
  /** Dòng chữ mô tả trạng thái hiển thị bên dưới spinner (Mặc định: 'Đang tải...') */
  tip?: string | ReactNode
  /** Kích thước của spinner ('small' | 'default' | 'large' | 'xl') */
  size?: LoadingSize
  /** Icon hoặc component tùy biến thay thế cho spinner mặc định */
  indicator?: ReactElement | ReactNode
  /** Chiều cao tối thiểu khi loading để chống giật layout (vd: 200, '200px', '100%') */
  minHeight?: string | number
  /** Bật/tắt hiệu ứng làm mờ mờ nội dung phía sau khi loading (Mặc định: true) */
  blur?: boolean
  /** Class tùy biến cho container bao ngoài */
  className?: string
  /** Class tùy biến cho lớp phủ overlay loading */
  overlayClassName?: string
  /** Class tùy biến cho dòng text mô tả tip */
  tipClassName?: string
}

// ─── Cấu hình kích cỡ icon và text ──────────────────────────────────────────
const sizeConfigs: Record<
  string,
  {
    iconSize: string
    textSize: string
    gap: string
  }
> = {
  small: {
    iconSize: 'size-4.5',
    textSize: 'text-xs',
    gap: 'gap-1.5',
  },
  sm: {
    iconSize: 'size-4.5',
    textSize: 'text-xs',
    gap: 'gap-1.5',
  },
  default: {
    iconSize: 'size-6',
    textSize: 'text-xs sm:text-sm',
    gap: 'gap-2',
  },
  md: {
    iconSize: 'size-6',
    textSize: 'text-xs sm:text-sm',
    gap: 'gap-2',
  },
  large: {
    iconSize: 'size-8',
    textSize: 'text-sm font-medium',
    gap: 'gap-2.5',
  },
  lg: {
    iconSize: 'size-8',
    textSize: 'text-sm font-medium',
    gap: 'gap-2.5',
  },
  xl: {
    iconSize: 'size-10',
    textSize: 'text-base font-semibold',
    gap: 'gap-3',
  },
}

export const LoadingComponentChild = memo(function LoadingComponentChild({
  loading,
  children,
  tip = 'Đang tải...',
  size = 'default',
  indicator,
  minHeight = 'auto',
  blur = true,
  className,
  overlayClassName,
  tipClassName,
}: LoadingComponentChildProps) {
  const currentSize = sizeConfigs[size] || sizeConfigs.default

  // Chuẩn hóa minHeight dạng số hoặc chuỗi
  const computedMinHeight =
    loading && minHeight !== 'auto'
      ? typeof minHeight === 'number'
        ? `${minHeight}px`
        : minHeight
      : undefined

  return (
    <div
      className={cn('relative w-full transition-all', className)}
      style={{ minHeight: computedMinHeight }}
      aria-busy={loading}
    >
      {/* ─── 1. Lớp phủ Loading Overlay khi loading = true ────────────────── */}
      {loading && (
        <div
          role="status"
          aria-live="polite"
          className={cn(
            'absolute inset-0 z-30 flex flex-col items-center justify-center p-4',
            'transition-opacity duration-200 animate-in fade-in-0',
            blur ? 'bg-card/75 backdrop-blur-[2px]' : 'bg-card/50',
            currentSize.gap,
            overlayClassName,
          )}
        >
          {/* Spinner icon (Tùy biến hoặc mặc định) */}
          <div className="flex items-center justify-center text-primary">
            {indicator ? (
              indicator
            ) : (
              <Loader2 className={cn('animate-spin shrink-0', currentSize.iconSize)} />
            )}
          </div>

          {/* Dòng chữ mô tả trạng thái (tip) */}
          {tip && (
            <div
              className={cn(
                'text-center text-muted-foreground select-none font-medium',
                currentSize.textSize,
                tipClassName,
              )}
            >
              {tip}
            </div>
          )}
        </div>
      )}

      {/* ─── 2. Nội dung con (Children Container) ────────────────────────── */}
      <div
        className={cn(
          'w-full h-full transition-all duration-200',
          loading && blur && 'opacity-40 pointer-events-none select-none filter blur-[0.3px]',
        )}
      >
        {children}
      </div>
    </div>
  )
})

LoadingComponentChild.displayName = 'LoadingComponentChild'

export default LoadingComponentChild
