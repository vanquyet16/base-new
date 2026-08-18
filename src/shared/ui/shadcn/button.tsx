/* eslint-disable react-refresh/only-export-components */
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/shared/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        // ─── Variants mặc định của shadcn ──────────────────────────────────────
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',

        // ─── Variants màu mở rộng (dùng CSS variables từ globals.css) ─────────
        /** Xanh lá — dùng cho hành động thành công, xác nhận, lưu */
        success: 'bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))] hover:bg-[hsl(var(--success)/0.9)]',
        /** Cam/vàng — dùng cho cảnh báo, trạng thái chờ duyệt */
        warning: 'bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))] hover:bg-[hsl(var(--warning)/0.9)]',
        /** Xanh dương nhạt — dùng cho thông tin, hướng dẫn, xem chi tiết */
        info: 'bg-[hsl(var(--info))] text-[hsl(var(--info-foreground))] hover:bg-[hsl(var(--info)/0.9)]',

        /** Outline success — viền xanh lá, nền trong suốt */
        'success-outline':
          'border border-[hsl(var(--success))] text-[hsl(var(--success))] bg-transparent hover:bg-[hsl(var(--success)/0.1)]',
        /** Outline warning — viền cam, nền trong suốt */
        'warning-outline':
          'border border-[hsl(var(--warning))] text-[hsl(var(--warning))] bg-transparent hover:bg-[hsl(var(--warning)/0.1)]',
        /** Outline info — viền xanh dương, nền trong suốt */
        'info-outline':
          'border border-[hsl(var(--info))] text-[hsl(var(--info))] bg-transparent hover:bg-[hsl(var(--info)/0.1)]',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8 shrink-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
