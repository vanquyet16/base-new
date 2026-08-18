import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/shadcn/dialog'
import { cn } from '@/shared/lib/utils'
import { Loader2 } from 'lucide-react'

export interface CustomModalProps {
  /** Trạng thái ẩn/hiện modal */
  open: boolean
  /** Callback khi trạng thái open thay đổi */
  onOpenChange: (open: boolean) => void
  /** Tiêu đề modal */
  title?: string
  /** Nội dung chính của modal (Body) */
  children: React.ReactNode
  /** Chân trang modal (Thường dùng CustomFooterModal) */
  footer?: React.ReactNode
  /** Chiều rộng modal (Mặc định: 600px) */
  width?: number | string
  /** Trạng thái loading toàn cục của modal */
  loading?: boolean
  /** CSS class tuỳ chọn cho DialogContent */
  className?: string
  /** Có cho phép đóng khi click ra ngoài không? (Mặc định: false) */
  maskClosable?: boolean
}

/**
 * CustomModal — Khung Modal (Wrapper) cho phép truyền nội dung và chân trang linh hoạt.
 * Được thiết kế dựa trên phong cách tcxd-web nhưng sử dụng shadcn/ui.
 */
const CustomModal = React.memo(
  ({
    open,
    onOpenChange,
    title,
    children,
    footer,
    width = 600,
    loading = false,
    className,
    maskClosable = false,
  }: CustomModalProps) => {
    const handleOpenChange = React.useCallback(
      (val: boolean) => {
        // Nếu đang loading thì không cho đóng modal
        if (loading) return
        onOpenChange(val)
      },
      [loading, onOpenChange],
    )

    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          style={{ maxWidth: width }}
          className={cn(
            // Định vị Top-Middle tương đồng với ModalConfirm
            'fixed left-[50%] top-[8%] translate-x-[-50%] translate-y-0',
            'flex max-h-[85vh] flex-col gap-0 overflow-hidden p-0',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-10 duration-300',
            'border-none shadow-2xl sm:rounded-xl',
            className,
          )}
          // Chặn đóng khi click ra ngoài nếu maskClosable = false
          onPointerDownOutside={(e) => !maskClosable && e.preventDefault()}
          onEscapeKeyDown={(e) => !maskClosable && e.preventDefault()}
        >
          {/* Header với dải màu gradient nhẹ để tăng tính premium */}
          <DialogHeader className="relative flex flex-row items-center justify-between bg-zinc-900/5 px-6 py-4 dark:bg-zinc-100/5">
            <DialogTitle className="text-lg font-bold italic text-primary">
              {title || 'Thông báo'}
            </DialogTitle>
            {/* Nút close mặc định của shadcn/ui sẽ được render tự động nếu không ẩn */}
          </DialogHeader>

          {/* Body content */}
          <div className="relative flex-1 overflow-y-auto px-6 py-4">
            {/* Global Loading Overlay */}
            {loading && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-[1px]">
                <div className="flex flex-col items-center gap-2 rounded-lg border bg-background p-4 shadow-lg">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="text-sm font-medium">Đang tải dữ liệu...</span>
                </div>
              </div>
            )}
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="border-t bg-zinc-50/50 px-6 py-3 dark:bg-zinc-900/50">{footer}</div>
          )}
        </DialogContent>
      </Dialog>
    )
  },
)

CustomModal.displayName = 'CustomModal'

export default CustomModal
