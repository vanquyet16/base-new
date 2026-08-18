/**
 * BreadcrumbWithAction — Thanh tiêu đề trang kết hợp chuỗi Breadcrumb điều hướng và các nút tác vụ (Actions).
 *
 * Tính năng:
 * - Hiển thị tiêu đề trang chuẩn nhận diện thương hiệu
 * - Hỗ trợ chuỗi điều hướng Breadcrumb phân cấp với TanStack Router Link
 * - Hỗ trợ nút Quay lại (Back Button)
 * - Hỗ trợ slot tác vụ bên phải (rightSlot / actions: Thêm mới, Xuất Excel, Bộ lọc...)
 * - Tự động thích ứng chế độ Sáng / Tối (Dark / Light mode) và Responsive trên mọi kích thước màn hình
 * - Hỗ trợ sticky dính mép trên nội dung mượt mà
 */

import React, { memo } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, ChevronRight } from 'lucide-react'

import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/shadcn/button'

export interface BreadcrumbItem {
  /** Nhãn hiển thị của mục điều hướng */
  label: string
  /** Đường dẫn điều hướng (nếu có) */
  to?: string
}

export interface BreadcrumbWithActionProps {
  /** Tiêu đề chính của trang */
  title: string | React.ReactNode
  /** Slot chứa các nút hành động bên phải (Thêm mới, Xuất file, ...) */
  rightSlot?: React.ReactNode
  /** Danh sách chuỗi điều hướng phân cấp (Breadcrumbs) */
  breadcrumbs?: BreadcrumbItem[]
  /** Mô tả ngắn hoặc thông tin bổ sung dưới tiêu đề */
  description?: string | React.ReactNode
  /** Đường dẫn khi nhấn nút Quay lại (tùy chọn) */
  backUrl?: string
  /** Callback tùy biến khi nhấn nút Quay lại */
  onBack?: () => void
  /** Bật/tắt hiệu ứng sticky dính trên cùng của vùng nội dung (mặc định: false) */
  sticky?: boolean
  /** Class tùy biến bổ sung */
  className?: string
}

export const BreadcrumbWithAction = memo(function BreadcrumbWithAction({
  title,
  rightSlot,
  breadcrumbs,
  description,
  backUrl,
  onBack,
  sticky = false,
  className,
}: BreadcrumbWithActionProps) {
  const navigate = useNavigate()

  // Xử lý sự kiện quay lại trang trước
  const handleBack = () => {
    if (onBack) {
      onBack()
    } else if (backUrl) {
      navigate({ to: backUrl as never })
    } else {
      window.history.back()
    }
  }

  const showBackButton = Boolean(onBack || backUrl)

  return (
    <div
      className={cn(
        'w-full min-h-[68px] bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/85 transition-all',
        'border-b border-border/80 px-4 sm:px-6 flex flex-col justify-center py-2.5',
        sticky && 'sticky top-0 z-20 shadow-xs',
        className,
      )}
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between md:gap-4">
        {/* ─── Cột Trái: Nút Back + Breadcrumbs + Tiêu đề trang ───────────── */}
        <div className="flex items-start gap-2 sm:gap-2.5 min-w-0">
          {showBackButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="group size-8 -ml-1 sm:-ml-1.5 shrink-0 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 active:scale-90 transition-all mt-0.5"
              aria-label="Quay lại trang trước"
              title="Quay lại"
            >
              <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            </Button>
          )}

          <div className="flex flex-col justify-center min-w-0">
            {/* Chuỗi Breadcrumb phân cấp (nếu có) */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <nav aria-label="Breadcrumb" className="mb-0.5">
                <ol className="flex flex-wrap items-center gap-2 mb-1 text-xs text-muted-foreground">
                  {breadcrumbs.map((item, index) => {
                    const isLast = index === breadcrumbs.length - 1
                    return (
                      <li key={index} className="inline-flex items-center gap-1.5">
                        {item.to && !isLast ? (
                          <Link
                            to={item.to as never}
                            className="hover:text-primary transition-colors font-medium hover:underline text-primary/80"
                          >
                            {item.label}
                          </Link>
                        ) : (
                          <span
                            className={cn(
                              isLast ? 'text-foreground font-semibold' : 'text-muted-foreground',
                            )}
                          >
                            {item.label}
                          </span>
                        )}
                        {!isLast && <ChevronRight className="size-3.5 text-muted-foreground/60" />}
                      </li>
                    )
                  })}
                </ol>
              </nav>
            )}

            {/* Tiêu đề chính của trang */}
            <div className="flex items-center gap-2 min-w-0">
              {typeof title === 'string' ? (
                <h1 className="text-[15px] sm:text-[16px] font-bold text-foreground uppercase tracking-wide leading-normal truncate">
                  {title}
                </h1>
              ) : (
                <div className="text-[15px] sm:text-[16px] font-bold text-foreground uppercase tracking-wide leading-normal">
                  {title}
                </div>
              )}
            </div>

            {/* Mô tả phụ trợ (nếu có) */}
            {description && (
              <div className="text-xs text-muted-foreground mt-0.5">
                {description}
              </div>
            )}
          </div>
        </div>

        {/* ─── Cột Phải: Các nút hành động tác vụ (Right Slot) ─────────────── */}
        {rightSlot && (
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 shrink-0 self-end md:self-center [&_button]:h-8.5 [&_button]:px-3 [&_button]:text-xs [&_button]:rounded-lg [&_button_svg]:size-3.5">
            {rightSlot}
          </div>
        )}
      </div>
    </div>
  )
})

BreadcrumbWithAction.displayName = 'BreadcrumbWithAction'

export default BreadcrumbWithAction
