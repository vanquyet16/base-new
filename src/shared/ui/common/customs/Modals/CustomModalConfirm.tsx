import React, { 
  useState, 
  isValidElement, 
  cloneElement, 
  useMemo, 
  useCallback, 
  type ReactElement, 
  type ReactNode 
} from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/shared/ui/shadcn/alert-dialog";
import AppIcon from "@/shared/ui/core/AppIcon";
import CustomButton from "@/shared/ui/common/customs/CustomButton";
import { cn } from "@/shared/lib/utils";

/**
 * Các loại Modal confirm được hỗ trợ
 */
export type ModalConfirmType = "success" | "warning" | "danger" | "info";

export interface ModalConfirmContent {
  /** Tiêu đề modal */
  title?: string;
  /** Nội dung mô tả (Hỗ trợ string hoặc JSX) */
  description?: ReactNode;
  /** Chữ hiển thị trên nút xác nhận */
  submitText?: string;
  /** Chữ hiển thị trên nút hủy */
  cancelText?: string;
  /** Chiều rộng modal (mặc định: 400px) */
  width?: number | string;
}

export interface CustomModalConfirmProps {
  /** Element kích hoạt modal (ví dụ: Button) */
  children: ReactElement;
  /** Loại modal (quy định icon và phong cách) */
  type?: ModalConfirmType;
  /** Hàm xử lý khi nhấn xác nhận */
  onSubmit: () => Promise<void>;
  /** Dữ liệu nội dung modal */
  content?: ModalConfirmContent;
  /** CSS class tuỳ chọn cho DialogContent */
  className?: string;
}

/**
 * CustomModalConfirm — Component bọc (wrapper) để hiển thị hộp thoại xác nhận trước khi thực hiện hành động.
 * Sử dụng shadcn/ui AlertDialog và tái hiện phong cách từ dự án TCXD.
 *
 * @example
 * <CustomModalConfirm 
 *   type="danger" 
 *   onSubmit={handleDelete} 
 *   content={{ title: "Xác nhận xóa", description: "Bạn có chắc chắn muốn xóa?" }}
 * >
 *   <Button>Xóa</Button>
 * </CustomModalConfirm>
 */
const CustomModalConfirm = React.memo(({ 
  children, 
  onSubmit, 
  content, 
  type = "warning",
  className 
}: CustomModalConfirmProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    title = "Thông báo",
    description,
    submitText = "Xác nhận",
    cancelText = "Hủy",
    width = 400
  } = content || {};

  // Xử lý đóng modal
  const handleClose = useCallback(() => {
    if (!loading) setOpen(false);
  }, [loading]);

  // Xử lý xác nhận hành động
  const handleConfirm = useCallback(async () => {
    try {
      setLoading(true);
      await onSubmit();
      setOpen(false);
    } catch (error) {
      console.error("[CustomModalConfirm] Submit error:", error);
    } finally {
      setLoading(false);
    }
  }, [onSubmit]);

  // Render icon dựa trên type
  const renderIcon = useMemo(() => {
    switch (type) {
      case "success":
        return <AppIcon type="tabler" name="IconCircleCheck" size={48} className="text-green-500" />;
      case "danger":
        return <AppIcon type="tabler" name="IconCircleX" size={48} className="text-red-500" />;
      case "info":
        return <AppIcon type="tabler" name="IconInfoCircle" size={48} className="text-blue-500" />;
      case "warning":
      default:
        return <AppIcon type="tabler" name="IconAlertTriangle" size={48} className="text-orange-500" />;
    }
  }, [type]);

  // Ép kiểu children để có thể intercept onClick
  const trigger = useMemo(() => {
    if (!isValidElement(children)) return children;

    const child = children as ReactElement<{ onClick?: (e: React.MouseEvent) => void }>;
    
    return cloneElement(child, {
      onClick: async (e: React.MouseEvent) => {
        // Chặn bubble nếu cần
        e.stopPropagation();
        // Gọi onClick gốc của children nếu có
        if (child.props.onClick) {
          await child.props.onClick(e);
        }
        // Mở modal
        setOpen(true);
      }
    });
  }, [children]);

  return (
    <>
      {trigger}

      <AlertDialog open={open} onOpenChange={handleClose}>
        <AlertDialogContent 
          style={{ maxWidth: width }} 
          className={cn(
            // Vị trí: Chính giữa phía trên (Top-Middle)
            "fixed left-[50%] top-[10%] translate-x-[-50%] translate-y-0",
            // Hiệu ứng: Slide từ trên xuống + Fade in
            "duration-300 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-10",
            "sm:rounded-xl shadow-2xl border-t-4",
            // Màu sắc border phía trên dựa theo type để tăng tính thẩm mỹ
            type === "success" && "border-t-green-500",
            type === "warning" && "border-t-orange-500",
            type === "danger" && "border-t-red-500",
            type === "info" && "border-t-blue-500",
            className
          )}
        >
          <AlertDialogHeader className="flex flex-col items-center gap-4 py-4">
            <div className="flex items-center justify-center p-2">
              {renderIcon}
            </div>
            <AlertDialogTitle className="text-center text-xl font-bold">
              {title}
            </AlertDialogTitle>
          </AlertDialogHeader>

          <div className="flex flex-col items-center justify-center py-2 text-center text-muted-foreground">
            {typeof description === 'string' ? (
              <p className="text-sm font-medium leading-relaxed">{description}</p>
            ) : (
              description
            )}
          </div>

          <AlertDialogFooter className="mt-4 flex flex-row items-center justify-center gap-4 sm:justify-center">
            <CustomButton
              title={cancelText}
              variant="outline"
              disabled={loading}
              onClick={handleClose}
              className="min-w-[120px]"
            />
            <CustomButton
              title={submitText}
              variant={type === 'danger' ? 'destructive' : 'default'}
              loading={loading}
              onClick={handleConfirm}
              className="min-w-[120px]"
            />
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
});

CustomModalConfirm.displayName = "CustomModalConfirm";

export default CustomModalConfirm;
