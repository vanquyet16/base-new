import React, { type JSX } from 'react'

import { AnimatedTooltip } from '@/shared/ui/shadcn/animated-tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/shadcn/dropdown-menu'
import { cn } from '@/shared/lib/utils'
import AppIcon from '@/shared/ui/core/AppIcon'

export type ActionType =
  | 'edit'
  | 'view'
  | 'send'
  | 'delete'
  | 'add'
  | 'appraisal'
  | 'medicine'
  | 'lock'
  | 'unlock'
  | 'print'
  | 'deleteRow'
  | 'refresh'
  | 'signature'
  | 'ycEdit'
  | 'cancel'
  | 'confirm'
  | 'viewUser'
  | 'viewKetLuan'
  | 'viewYKien'
  | 'ketLuan'
  | 'yKien'
  | 'thuHoi'
  | 'addPerson'
  | 'approve'
  | 'reject'
  | 'viewLichSu'
  | 'refreshData'
  | 'result'
  | 'rollback'
  | 'warning'
  | 'baoCao'
  | 'download'

export interface RenderActionIconParams {
  type?: ActionType
  onClick?: () => void
  /**
   * CSS class tuỳ chọn
   */
  className?: string
  disabled?: boolean
  tooltip?: string
  /**
   * Title thay thế (hover) cho icon đơn
   */
  title?: string
  /**
   * Cờ quyết định render thành dropdown menu thay vì 1 nút duy nhất
   */
  check?: boolean
  actions?: {
    type: ActionType
    onClick?: () => void
    disabled?: boolean
    tooltip?: string
  }[]
  hidden?: boolean
}

/**
 * Hàm mapping ActionType -> Data (Icon component, title tiếng Việt, class màu sắc)
 */
const getIcon = (type: ActionType): { iconName: string; title: string; color: string } => {
  switch (type) {
    case 'edit':
      return { iconName: 'Edit2', title: 'Chỉnh sửa', color: 'text-orange-500' }
    case 'view':
      return { iconName: 'Eye', title: 'Xem chi tiết', color: 'text-blue-500' }
    case 'add':
      return { iconName: 'PlusCircle', title: 'Thêm mới', color: 'text-orange-600' }
    case 'send':
      return { iconName: 'Send', title: 'Gửi', color: 'text-blue-500' }
    case 'delete':
      return { iconName: 'Trash2', title: 'Xóa', color: 'text-red-500' }
    case 'deleteRow':
      return { iconName: 'MinusCircle', title: 'Xóa dòng', color: 'text-red-500' }
    case 'appraisal':
      return { iconName: 'FileBadge', title: 'Thẩm định', color: 'text-green-500' }
    case 'medicine':
      return { iconName: 'Stethoscope', title: 'Chẩn đoán', color: 'text-green-500' }
    case 'lock':
      return { iconName: 'Lock', title: 'Khóa hồ sơ', color: 'text-red-500' }
    case 'unlock':
      return { iconName: 'Unlock', title: 'Mở khóa hồ sơ', color: 'text-red-500' }
    case 'print':
      return { iconName: 'Printer', title: 'In hồ sơ', color: 'text-green-500' }
    case 'refresh':
      return {
        iconName: 'RefreshCw',
        title: 'Cập nhật kết quả',
        color: 'text-green-500',
      }
    case 'signature':
      return { iconName: 'FileSignature', title: 'Ký số', color: 'text-green-500' }
    case 'ycEdit':
      return {
        iconName: 'FileEdit',
        title: 'Yêu cầu chỉnh sửa',
        color: 'text-blue-500',
      }
    case 'cancel':
      return { iconName: 'X', title: 'Hủy', color: 'text-gray-500' }
    case 'confirm':
      return { iconName: 'Check', title: 'Xác nhận', color: 'text-green-500' }
    case 'viewUser':
      return { iconName: 'Users', title: 'Xem học viên', color: 'text-blue-500' }
    case 'viewKetLuan':
      return { iconName: 'FileSearch', title: 'Xem Kết Luận', color: 'text-blue-500' }
    case 'viewYKien':
      return { iconName: 'FileSearch', title: 'Xem Ý kiến', color: 'text-blue-500' }
    case 'ketLuan':
      return { iconName: 'Edit2', title: 'Kết luận', color: 'text-orange-500' }
    case 'yKien':
      return { iconName: 'Edit2', title: 'Ý kiến', color: 'text-orange-500' }
    case 'thuHoi':
      return { iconName: 'Undo2', title: 'Thu hồi', color: 'text-green-500' }
    case 'addPerson':
      return { iconName: 'UserPlus', title: 'Thêm cán bộ', color: 'text-orange-500' }
    case 'approve':
      return { iconName: 'Check', title: 'Duyệt', color: 'text-green-500' }
    case 'reject':
      return { iconName: 'X', title: 'Từ chối', color: 'text-red-500' }
    case 'viewLichSu':
      return {
        iconName: 'FileEdit',
        title: 'Lịch sử tham gia',
        color: 'text-blue-500',
      }
    case 'refreshData':
      return { iconName: 'RotateCcw', title: 'Khôi phục', color: 'text-green-500' }
    case 'result':
      return { iconName: 'ShieldCheck', title: 'Kết quả', color: 'text-green-500' }
    case 'rollback':
      return { iconName: 'Undo2', title: 'Quay lại làm việc', color: 'text-green-500' }

    case 'baoCao':
      return { iconName: 'FileText', title: 'Báo cáo', color: 'text-red-500' }
    case 'download':
      return { iconName: 'Download', title: 'Tải về', color: 'text-green-600' }
    default:
      return { iconName: '', title: '', color: '' }
  }
}

/**
 * TableAction - Component hỗ trợ chung để render các nút bấm hành động (Ví dụ: Thêm, sửa xoá, gửi) nằm dọc theo bảng
 * Hỗ trợ hiển thị dạng Icon duy nhất kèm tooltip, hoặc Dropdown Menu khi có nhiều Action.
 * Tối ưu hóa: dùng React.memo để tránh re-render khi props không thay đổi.
 */
export const TableAction = React.memo(function TableAction({
  type,
  onClick,
  className = '',
  disabled = false,
  tooltip,
  check = false,
  actions = [],
  hidden = false,
}: RenderActionIconParams): JSX.Element | null {
  if (hidden) return null

  // Chế độ nút hành động đơn (check = false) hiển thị trực tiếp bằng Icon có Tooltip
  if (!check && type) {
    const { iconName, title, color } = getIcon(type)
    const finalTooltip = tooltip ?? title
    const content = (
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        aria-label={finalTooltip || title || 'Thao tác'}
        className={cn(
          'inline-flex items-center justify-center rounded-md p-[0.375rem] transition-opacity hover:bg-muted hover:opacity-80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
          color,
          disabled && 'cursor-not-allowed opacity-50 hover:bg-transparent',
          className,
        )}
      >
        <AppIcon name={iconName} className="h-[1.125rem] w-[1.125rem]" />
      </button>
    )

    if (!finalTooltip) return content

    return (
      <AnimatedTooltip
        content={finalTooltip}
        placement="top"
        contentClassName="bg-zinc-900 text-white border-none shadow-xl text-xs font-medium"
      >
        {content}
      </AnimatedTooltip>
    )
  }

  // Chế độ Dropdown khi có cấu hình nhiều hành động ẩn dưới dấu "..." (check = true)
  if (check && actions.length > 0) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Thao tác khác"
            className={cn(
              'inline-flex items-center justify-center rounded-md p-[0.375rem] text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
              className,
            )}
          >
            <AppIcon name="MoreHorizontal" className="h-[1.375rem] w-[1.375rem]" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          {actions.map((act, idx) => {
            const { iconName, title, color } = getIcon(act.type)
            const itemTooltip = act.tooltip ?? title

            return (
              <DropdownMenuItem
                key={`${act.type}-${idx}`}
                disabled={act.disabled}
                onClick={act.onClick}
                className={cn('flex cursor-pointer items-center gap-2', color)}
              >
                <AppIcon name={iconName} className="h-[1.125rem] w-[1.125rem]" />
                <span className="font-medium">{itemTooltip}</span>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return null
})

// Cho phép React DevTools và error stack hiển thị tên đúng
TableAction.displayName = 'TableAction'
