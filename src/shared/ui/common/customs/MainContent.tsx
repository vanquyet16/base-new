/**
 * MainContent — Khung chứa nội dung chính của trang với padding quy chuẩn (p-4).
 *
 * Tính năng:
 * - Quy chuẩn padding mặc định: p-4 (px-4 py-4) cho toàn bộ các trang nghiệp vụ
 * - Tích hợp sẵn LoadingComponentChild: chỉ cần truyền prop `loading={true}` là tự động có loading overlay
 * - Hỗ trợ tùy biến linh hoạt className, minHeight, tip và HTML tag (as)
 */

import { memo, type ReactNode, type HTMLAttributes, type ElementType } from 'react'

import { cn } from '@/shared/lib/utils'
import LoadingComponentChild, { type LoadingSize } from './LoadingComponentChild'

export interface MainContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Nội dung bên trong */
  children: ReactNode
  /** Trạng thái loading (tùy chọn: tự động bọc LoadingComponentChild khi truyền prop này) */
  loading?: boolean
  /** Dòng chữ thông báo khi loading (Mặc định: 'Đang tải...') */
  tip?: string | ReactNode
  /** Kích thước spinner loading ('small' | 'default' | 'large' | 'xl') */
  loadingSize?: LoadingSize
  /** Chiều cao tối thiểu khi loading chống giật layout */
  minHeight?: string | number
  /** Thẻ HTML hiển thị (mặc định: 'div') */
  as?: ElementType
  /** Class tùy biến bổ sung (nếu muốn ghi đè hoặc bổ sung style) */
  className?: string
}

export const MainContent = memo(function MainContent({
  children,
  loading,
  tip = 'Đang tải...',
  loadingSize = 'large',
  minHeight = 'auto',
  as: Component = 'div',
  className,
  ...restProps
}: MainContentProps) {
  // Nếu có truyền prop loading (kể cả true hoặc false), tự động tích hợp LoadingComponentChild
  if (loading !== undefined) {
    return (
      <LoadingComponentChild
        loading={loading}
        tip={tip}
        size={loadingSize}
        minHeight={minHeight}
        className={cn('w-full p-4', className)}
      >
        <Component className="w-full" {...restProps}>
          {children}
        </Component>
      </LoadingComponentChild>
    )
  }

  // Trường hợp không dùng loading tích hợp sẵn
  return (
    <Component className={cn('w-full p-4', className)} {...restProps}>
      {children}
    </Component>
  )
})

MainContent.displayName = 'MainContent'

export default MainContent
