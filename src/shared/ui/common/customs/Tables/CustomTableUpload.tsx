import React, { useMemo } from 'react'
import { Download, Upload, Loader2, CheckCircle2 } from 'lucide-react'
import CustomTable, { type ColumnType } from './CustomTable'
import CustomButton from '@/shared/ui/common/customs/CustomButton'
import { TableAction } from '@/shared/ui/common/customs/Tables/TableAction'
import AppIcon from '@/shared/ui/core/AppIcon'
import { Progress } from '@/shared/ui/shadcn/progress'
import { type UploadResponse } from '@/shared/types/upload.types'
import { useUpload } from '@/shared/hooks/useUpload'
import { cn } from '@/shared/lib/utils'

/**
 * Interface biểu diễn một bản ghi trong bảng upload (có thể đang upload hoặc đã hoàn thành)
 */
export interface UploadItemRecord extends Partial<UploadResponse> {
  isUploading?: boolean
  progress?: number
}

/**
 * Props cho CustomTableUpload
 */
interface CustomTableUploadProps {
  /** Danh sách file hiện tại (Controlled) */
  value?: UploadResponse[]
  /** Callback khi danh sách file thay đổi */
  onChange?: (files: UploadResponse[]) => void
  /** Trạng thái loading của bảng (Spinner toàn cục) */
  loading?: boolean
  /** Class bổ sung cho container */
  className?: string
  /** Tiêu đề hiển thị (mặc định: "FILE ĐÍNH KÈM") */
  title?: string
  /** Giới hạn số lượng file (tùy chọn) */
  maxCount?: number
  /** Giới hạn dung lượng mỗi file (MB, mặc định 10MB) */
  maxSize?: number
  /** Trạng thái vô hiệu hóa (dùng trong Form) */
  disabled?: boolean
  /** Tên trường (dùng trong Form) */
  name?: string
  /** Loại file (tùy chọn) */
  fileType?: string
  /** Ký số hay không? */
  isSign?: boolean
}

/**
 * CustomTableUpload — Component UI cho việc đính kèm tệp tin.
 * Đã được refactor để sử dụng logic nghiệp vụ từ `useUpload` hook.
 */
const CustomTableUpload = React.memo(
  ({
    value = [],
    onChange,
    loading: globalLoading = false,
    className,
    title = 'FILE ĐÍNH KÈM',
    maxCount,
    maxSize = 10,
    disabled = false,
    fileType,
    isSign = false,
  }: CustomTableUploadProps) => {
    const {
      handleDelete,
      handleCancelUpload,
      handleDownloadFile,
      handleDownloadAll,
      handleFileChange,
      openFileDialog,
      getFileIcon,
      displayData,
      isGlobalUploading,
      fileInputRef,
    } = useUpload({ value, onChange, maxSize, maxCount, fileType, isSign })

    // Cấu hình các cột cho bảng Upload
    const columns = useMemo(
      (): ColumnType<UploadItemRecord>[] => [
        {
          title: 'STT',
          key: 'stt',
          align: 'center',
          width: 60,
          render: (_, __, index) => (
            <span className="text-sm font-medium text-slate-500">{index + 1}</span>
          ),
        },
        {
          title: 'Tên file',
          dataIndex: 'fileName',
          key: 'fileName',
          render: (text, record) => {
            const fileNameText = String(text ?? record.fileName ?? '')
            return (
              <div className="flex flex-col gap-1.5 py-1">
                <span
                  className={cn(
                    'block max-w-[400px] truncate text-sm font-semibold',
                    record.isUploading ? 'text-slate-400' : 'text-slate-700',
                  )}
                  title={fileNameText}
                >
                  {fileNameText}
                </span>
                {record.isUploading && (
                  <div className="flex items-center gap-3 pr-4">
                    <Progress value={record.progress} className="h-1.5" />
                    <span className="w-8 text-[10px] font-bold text-brand-red">
                      {record.progress}%
                    </span>
                  </div>
                )}
              </div>
            )
          },
        },
        {
          title: 'Trạng thái',
          key: 'status',
          align: 'center',
          width: 120,
          render: (_, record) =>
            record.isUploading ? (
              <div className="flex items-center justify-center gap-1.5 text-blue-500">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span className="text-[11px] font-medium italic">Đang tải...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-1.5 text-green-600">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span className="text-[11px] font-medium">Hoàn tất</span>
              </div>
            ),
        },
        {
          title: 'File gốc',
          key: 'original',
          align: 'center',
          width: 100,
          render: (_, record) => {
            const icon = getFileIcon(record.extension || record.fileName?.split('.').pop())
            return !record.isUploading ? (
              <a
                href={record.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-slate-100"
                title="Xem file gốc"
              >
                <AppIcon name={icon.name as Parameters<typeof AppIcon>[0]['name']} className={cn('h-6 w-6', icon.color)} />
              </a>
            ) : (
              <div className="flex h-8 w-8 items-center justify-center opacity-20">
                <AppIcon name={icon.name as Parameters<typeof AppIcon>[0]['name']} className="h-6 w-6 text-slate-400" />
              </div>
            )
          },
        },
        {
          title: 'Thao tác',
          key: 'actions',
          align: 'center',
          width: 120,
          render: (_, record) => (
            <div className="flex items-center justify-center gap-1">
              {!record.isUploading ? (
                <>
                  <TableAction
                    type="download"
                    onClick={() => handleDownloadFile(record as UploadResponse)}
                    disabled={disabled}
                    tooltip="Tải xuống tệp"
                  />
                  <TableAction
                    type="delete"
                    onClick={() => record.id && handleDelete(record.id)}
                    disabled={disabled}
                    tooltip="Xóa tệp đính kèm"
                  />
                </>
              ) : (
                <TableAction
                  type="delete"
                  onClick={() => record.id && handleCancelUpload(record.id)}
                  tooltip="Hủy tải lên"
                />
              )}
            </div>
          ),
        },
      ],
      [disabled, getFileIcon, handleDelete, handleCancelUpload, handleDownloadFile],
    )

    return (
      <div
        className={cn(
          'overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900',
          className,
        )}
      >
        {/* Header toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
              {title}
            </span>
            {maxCount && (
              <span className="text-xs font-medium text-slate-400">
                ({value.length}/{maxCount})
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Input file ẩn */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              disabled={disabled || isGlobalUploading}
              className="hidden"
              aria-label="Chọn tệp tin đính kèm"
            />

            {/* Nút Tải tất cả */}
            {value.length > 0 && (
              <CustomButton
                variant="outline"
                size="sm"
                onClick={handleDownloadAll}
                disabled={disabled || isGlobalUploading}
                startIcon={<Download className="h-3.5 w-3.5" />}
                className="h-8 text-xs font-medium"
              >
                Tải tất cả
              </CustomButton>
            )}

            {/* Nút Chọn file để upload */}
            <CustomButton
              type="button"
              variant="default"
              size="sm"
              onClick={openFileDialog}
              disabled={disabled || isGlobalUploading}
              loading={isGlobalUploading}
              startIcon={<Upload className="h-3.5 w-3.5" />}
              className="bg-brand-red hover:bg-brand-red/90 h-8 text-xs font-medium text-white shadow-sm"
            >
              Tải tệp tin
            </CustomButton>
          </div>
        </div>

        {/* Nội dung bảng danh sách file */}
        <div className="p-0">
          <CustomTable<UploadItemRecord>
            columns={columns}
            data={displayData as UploadItemRecord[]}
            loading={globalLoading}
            bordered
            emptyText={
              <div className="flex flex-col items-center justify-center py-6 text-slate-400">
                <Upload className="mb-2 h-8 w-8 stroke-1 text-slate-300" />
                <p className="text-xs">Chưa có tệp tin đính kèm nào</p>
              </div>
            }
          />
        </div>
      </div>
    )
  },
)

CustomTableUpload.displayName = 'CustomTableUpload'

export default CustomTableUpload
