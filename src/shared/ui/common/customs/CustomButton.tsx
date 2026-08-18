/**
 * CustomButton — Nút bấm tái sử dụng dựa trên shadcn/ui Button.
 *
 * Tính năng:
 *  - Hỗ trợ tooltip (vị trí, styling tùy biến qua AnimatedTooltip)
 *  - Hỗ trợ icon dạng URL ảnh hoặc ReactElement, với vị trí start/end
 *  - Hỗ trợ loading spinner tích hợp (Loader2)
 *  - Hỗ trợ cả `title` hoặc `children`
 *  - Đồng bộ variant và size của shadcn Button
 */
import React, { forwardRef } from 'react'
import { AnimatedTooltip } from '@/shared/ui/shadcn/animated-tooltip'
import { Button, type ButtonProps } from '@/shared/ui/shadcn/button'
import { Loader2 } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

// ─── Kiểu TooltipSide tương ứng với Radix TooltipContent side prop ────────────
type TooltipSide = 'top' | 'right' | 'bottom' | 'left'

// ─── Props ────────────────────────────────────────────────────────────────────
export interface CustomButtonProps extends Omit<ButtonProps, 'title'> {
  /** Nhãn hiển thị trên nút (tùy chọn nếu dùng children) */
  title?: string
  /** Nội dung tooltip (tùy chọn, không truyền thì không hiện tooltip) */
  tooltip?: string
  /** Vị trí tooltip — mặc định "top" */
  placement?: TooltipSide
  /** Màu nền tooltip (CSS color string / token class) */
  colorTooltip?: string
  /** Hiển thị spinner loading bên trong nút */
  loading?: boolean
  /**
   * Icon hiển thị trong nút (tương thích cả prop icon hoặc startIcon/endIcon)
   */
  icon?: React.ReactElement | string
  startIcon?: React.ReactElement
  endIcon?: React.ReactElement
  /** Vị trí icon so với label — mặc định "end" */
  iconPosition?: 'start' | 'end'
}

// ─── Component ────────────────────────────────────────────────────────────────
const CustomButton = forwardRef<HTMLButtonElement, CustomButtonProps>(
  (
    {
      title,
      children,
      tooltip,
      placement = 'top',
      colorTooltip,
      loading = false,
      icon,
      startIcon,
      endIcon,
      iconPosition = 'end',
      disabled = false,
      className,
      variant = 'default',
      size = 'default',
      // Mặc định type="button" để tránh vô tình trigger submit form khi nằm trong <form>
      type = 'button',
      ...restProps
    },
    ref,
  ) => {
    // ─── Render nội dung nút ──────────────────────────────────────────────────
    const buttonContent = (
      <>
        {/* Loading spinner */}
        {loading && (
          <Loader2 className="size-4 animate-spin motion-reduce:animate-none shrink-0" />
        )}

        {/* Start Icon (chỉ hiện khi không loading hoặc có startIcon riêng biệt) */}
        {!loading && (startIcon || (iconPosition === 'start' && icon)) && (
          <span className="shrink-0 flex items-center">{startIcon || icon}</span>
        )}

        {/* Text Label */}
        {title && <span>{title}</span>}
        {children}

        {/* End Icon (chỉ hiện khi không loading) */}
        {!loading && (endIcon || (iconPosition === 'end' && icon && !startIcon)) && (
          <span className="shrink-0 flex items-center">{endIcon || icon}</span>
        )}
      </>
    )

    // ─── Nút không có tooltip ──────────────────────────────────────────────────
    if (!tooltip) {
      return (
        <Button
          ref={ref}
          type={type}
          variant={variant}
          size={size}
          disabled={disabled || loading}
          className={cn(
            'custom-button',
            variant === 'default' &&
              'bg-brand-red text-brand-red-foreground hover:bg-brand-red-hover',
            disabled && 'pointer-events-none cursor-not-allowed opacity-60',
            className,
          )}
          {...restProps}
        >
          {buttonContent}
        </Button>
      )
    }

    // ─── Nút có tooltip ────────────────────────────────────────────────────────
    return (
      <AnimatedTooltip
        content={tooltip}
        placement={placement}
        className={cn('inline-flex', disabled && 'cursor-not-allowed')}
        contentClassName="bg-inverse-surface text-inverse-on-surface border-none shadow-xl"
      >
        <Button
          ref={ref}
          type={type}
          variant={variant}
          size={size}
          disabled={disabled || loading}
          className={cn(
            'custom-button',
            variant === 'default' &&
              'bg-brand-red text-brand-red-foreground hover:bg-brand-red-hover',
            disabled && 'pointer-events-none',
            className,
          )}
          {...restProps}
        >
          {buttonContent}
        </Button>
      </AnimatedTooltip>
    )
  },
)

CustomButton.displayName = 'CustomButton'

export default CustomButton
