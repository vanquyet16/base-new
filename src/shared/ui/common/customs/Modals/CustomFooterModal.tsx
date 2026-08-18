import React from 'react';
import CustomButton from '@/shared/ui/common/customs/CustomButton';
import AppIcon from '@/shared/ui/core/AppIcon';
import { cn } from '@/shared/lib/utils';

export interface CustomFooterModalProps {
  /** Hàm xử lý khi nhấn nút Xác nhận/Lưu */
  onOk?: () => void | Promise<void>;
  /** Hàm xử lý khi nhấn nút Hủy */
  onCancel?: () => void;
  /** Chữ hiển thị trên nút Xác nhận (Mặc định: Lưu) */
  okText?: string;
  /** Chữ hiển thị trên nút Hủy (Mặc định: Hủy) */
  cancelText?: string;
  /** Trạng thái loading của nút Xác nhận */
  okLoading?: boolean;
  /** Trạng thái disable của nút Xác nhận */
  okDisabled?: boolean;
  /** Loại biến thể của nút Xác nhận (Mặc định: success) */
  okVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "success" | "warning" | "info";
  /** Icon cho nút Xác nhận */
  okIcon?: React.ReactElement | string;
  /** Icon cho nút Hủy */
  cancelIcon?: React.ReactElement | string;
  /** CSS class tuỳ chọn cho container footer */
  className?: string;
}

/**
 * CustomFooterModal — Thành phần chân trang chuẩn cho các Modal.
 * Cung cấp nút Hủy và Xác nhận (Lưu) với giao diện đồng nhất.
 */
const CustomFooterModal = React.memo(
  ({
    onOk,
    onCancel,
    okText = 'Lưu',
    cancelText = 'Hủy',
    okLoading = false,
    okDisabled = false,
    okVariant = 'success',
    okIcon,
    cancelIcon,
    className = '',
  }: CustomFooterModalProps) => {
    return (
      <div className={cn('flex w-full items-center justify-end gap-3 pt-4', className)}>
        {/* Nút Hủy */}
        <CustomButton
          title={cancelText}
          variant="outline"
          onClick={onCancel}
          icon={cancelIcon || <AppIcon type="tabler" name="IconX" size={18} />}
          disabled={okLoading}
        />

        {/* Nút Xác nhận / Lưu */}
        <CustomButton
          title={okText}
          variant={okVariant}
          onClick={onOk}
          loading={okLoading}
          disabled={okDisabled}
          icon={okIcon || <AppIcon type="tabler" name="IconDeviceFloppy" size={18} />}
        />
      </div>
    )
  },
)

CustomFooterModal.displayName = 'CustomFooterModal'

export default CustomFooterModal;
