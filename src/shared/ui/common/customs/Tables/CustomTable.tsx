import React, { type JSX, useCallback, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/shadcn/table'
import { Checkbox } from '@/shared/ui/shadcn/checkbox'
import { cn } from '@/shared/lib/utils'
import { Loader2 } from 'lucide-react'

/**
 * Cấu trúc định nghĩa một cột trong bảng (Tương tự Ant Design)
 */
export interface ColumnType<T> {
  /** Khoá duy nhất của cột */
  key?: React.Key
  /** Tiêu đề hiển thị trên header */
  title?: React.ReactNode
  /** Trường dữ liệu trỏ vào object T */
  dataIndex?: keyof T | string
  /** Hàm render tuỳ biến giao diện cho cell */
  render?: (value: unknown, record: T, index: number) => React.ReactNode
  /** Chiều rộng của cột */
  width?: string | number
  /** Căn lề của cột */
  align?: 'left' | 'center' | 'right'
  /** CSS class bổ sung cho cột */
  className?: string
  /** Cố định cột (giữ nguyên khi cuộn ngang) */
  fixed?: 'left' | 'right'
}

/**
 * Cấu hình chọn nhiều dòng trong bảng
 */
export interface TableRowSelection<T> {
  /** Các khoá dòng đang được chọn */
  selectedRowKeys?: React.Key[]
  /** Callback khi người dùng thay đổi lựa chọn */
  onChange?: (selectedRowKeys: React.Key[], selectedRows: T[]) => void
  /** Cấu hình thuộc tính cho checkbox con */
  getCheckboxProps?: (record: T) => { disabled?: boolean; name?: string }
}

/**
 * Props của CustomTable
 */
export interface CustomTableProps<T> {
  /** Mảng cấu hình các cột */
  columns: ColumnType<T>[]
  /** Dữ liệu hiển thị trong bảng */
  data: T[]
  /** Cấu hình chọn row (Nếu có sẽ hiển thị cột checkbox ở đầu) */
  rowSelection?: TableRowSelection<T>
  /** Khoá duy nhất cho mỗi dòng (string hoặc hàm trả về key) */
  rowKey?: keyof T | ((record: T) => React.Key)
  /** Class bổ sung cho wrapper bên ngoài table */
  className?: string
  /** Hiển thị trạng thái đang tải dữ liệu (spinner) */
  loading?: boolean
  /** UI hiển thị khi không có dữ liệu */
  emptyText?: React.ReactNode
  /** Cấu hình thanh cuộn (x: chiều ngang, y: chiều dọc) */
  scroll?: { x?: string | number; y?: string | number }
  /** Cho phép hiển thị viền giữa các ô (bordered) */
  bordered?: boolean
}

/**
 * CustomTable — Component bảng dữ liệu linh hoạt dựa trên shadcn/ui.
 * Giao diện và API được thiết kế mô phỏng theo Table của Ant Design.
 */
const CustomTable = <T extends object>({
  columns,
  data,
  rowSelection,
  rowKey = 'id' as keyof T,
  className,
  loading = false,
  emptyText = 'Không có dữ liệu',
  scroll,
  bordered = false,
}: CustomTableProps<T>): JSX.Element => {
  // Lấy key duy nhất từ record data
  const getRowKey = useCallback(
    (record: T, index: number): React.Key => {
      if (typeof rowKey === 'function') {
        return rowKey(record)
      }
      return (record[rowKey as keyof T] as unknown as React.Key) ?? index
    },
    [rowKey],
  )

  const isSelectable = !!rowSelection
  const selectedKeys = useMemo(
    () => rowSelection?.selectedRowKeys || [],
    [rowSelection?.selectedRowKeys],
  )

  // Set lookup O(1) cho trạng thái chọn dòng
  const selectedKeysSet = useMemo(() => new Set(selectedKeys), [selectedKeys])

  // Xử lý sự kiện khi chọn/bỏ chọn tất cả các dòng
  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (!rowSelection?.onChange) return
      if (checked) {
        const allKeys = data.map((record, index) => getRowKey(record, index))
        rowSelection.onChange(allKeys, data)
      } else {
        rowSelection.onChange([], [])
      }
    },
    [data, getRowKey, rowSelection],
  )

  // Xử lý sự kiện khi chọn/bỏ chọn một dòng cụ thể
  const handleSelectRow = useCallback(
    (checked: boolean, _record: T, key: React.Key) => {
      if (!rowSelection?.onChange) return
      if (checked) {
        const newKeys = [...selectedKeys, key]
        const newKeysSet = new Set(newKeys)
        const newRows = data.filter((r, i) => newKeysSet.has(getRowKey(r, i)))
        rowSelection.onChange(newKeys, newRows)
      } else {
        const newKeys = selectedKeys.filter((k) => k !== key)
        const newKeysSet = new Set(newKeys)
        const newRows = data.filter((r, i) => newKeysSet.has(getRowKey(r, i)))
        rowSelection.onChange(newKeys, newRows)
      }
    },
    [data, getRowKey, rowSelection, selectedKeys],
  )

  // Trạng thái của checkbox "Chọn tất cả" — tính bằng useMemo
  const allSelected = useMemo(
    () => data.length > 0 && selectedKeys.length === data.length,
    [data.length, selectedKeys.length],
  )
  const someSelected = useMemo(
    () => selectedKeys.length > 0 && selectedKeys.length < data.length,
    [data.length, selectedKeys.length],
  )

  return (
    <div
      className={cn(
        'relative w-full bg-card',
        bordered && 'border-color-table overflow-hidden rounded-md border shadow-sm',
        // Thiết lập chiều cao cho container của Shadcn Table để hiện đúng cuộn x, y
        '[&>div.overflow-auto]:max-h-[var(--table-max-height)]',
        // Style luôn scrollbar để hiển thị rõ ràng và đẹp mắt
        '[&>div.overflow-auto::-webkit-scrollbar]:h-2',
        '[&>div.overflow-auto::-webkit-scrollbar]:w-2',
        '[&>div.overflow-auto::-webkit-scrollbar-thumb]:rounded-full',
        '[&>div.overflow-auto::-webkit-scrollbar-thumb]:bg-slate-300',
        'dark:[&>div.overflow-auto::-webkit-scrollbar-thumb]:bg-slate-700',
        '[&>div.overflow-auto::-webkit-scrollbar-track]:bg-transparent',
        className,
      )}
      style={
        {
          '--table-max-height':
            typeof scroll?.y === 'number' ? `${scroll.y}px` : scroll?.y || '100%',
        } as React.CSSProperties
      }
    >
      {/* Lớp phủ Loading hiển thị Spinner */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-card/70 backdrop-blur-[1px]">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="text-brand-red h-8 w-8 animate-spin" />
            <span className="text-xs font-medium text-muted-foreground">Đang tải dữ liệu...</span>
          </div>
        </div>
      )}

      <Table
        className={cn(
          'w-full text-sm',
          scroll?.x &&
            (typeof scroll.x === 'number' ? `min-w-[${scroll.x}px]` : `min-w-[${scroll.x}]`),
        )}
      >
        <TableHeader>
          <TableRow className="border-color-table hover:bg-transparent bg-slate-50/90 dark:bg-muted/60">
            {/* Cột checkbox Chọn tất cả */}
            {isSelectable && (
              <TableHead
                className={cn(
                  'sticky left-0 z-20 w-[50px] bg-slate-50 dark:bg-muted/80 text-center shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]',
                  bordered &&
                    'border-color-table border-x after:absolute after:bottom-0 after:right-0 after:top-0 after:z-30 after:w-px after:bg-color-table',
                )}
              >
                <Checkbox
                  checked={allSelected ? true : someSelected ? 'indeterminate' : false}
                  onCheckedChange={handleSelectAll}
                  aria-label="Chọn tất cả các dòng"
                />
              </TableHead>
            )}

            {/* Các cột dữ liệu */}
            {columns.map((col, index) => {
              const isFixedLeft = col.fixed === 'left'
              const isFixedRight = col.fixed === 'right'

              return (
                <TableHead
                  key={String(col.key || col.dataIndex || `col-${index}`)}
                  className={cn(
                    'bg-slate-50 dark:bg-muted/80 font-bold text-foreground',
                    col.align === 'center' && 'text-center',
                    col.align === 'right' && 'text-right',
                    bordered && 'border-color-table border-x',
                    isFixedLeft &&
                      cn(
                        'sticky left-0 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]',
                        bordered &&
                          'after:absolute after:bottom-0 after:right-0 after:top-0 after:z-30 after:w-px after:bg-color-table',
                      ),
                    isFixedRight &&
                      cn(
                        'sticky right-0 z-20 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.06)]',
                        bordered &&
                          'after:absolute after:bottom-0 after:left-0 after:top-0 after:z-30 after:w-px after:bg-color-table',
                      ),
                    col.className,
                  )}
                  style={{ width: col.width }}
                >
                  {col.title}
                </TableHead>
              )
            })}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + (isSelectable ? 1 : 0)}
                className="h-32 text-center text-muted-foreground"
              >
                {emptyText}
              </TableCell>
            </TableRow>
          ) : (
            data.map((record, rowIndex) => {
              const key = getRowKey(record, rowIndex)
              const isSelected = selectedKeysSet.has(key)
              const checkboxProps = rowSelection?.getCheckboxProps?.(record)

              return (
                <TableRow
                  key={key}
                  data-state={isSelected ? 'selected' : undefined}
                  className={cn(
                    'border-color-table',
                    bordered && '[&>td]:border-color-table [&>td]:border-x',
                    'group transition-colors hover:bg-slate-50/80 dark:hover:bg-muted/40 bg-card',
                  )}
                >
                  {isSelectable && (
                    <TableCell
                      className={cn(
                        'sticky left-0 z-10 w-[50px] bg-card text-center group-hover:bg-slate-50 dark:group-hover:bg-muted/40',
                        'shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]',
                        bordered &&
                          'after:absolute after:bottom-0 after:right-0 after:top-0 after:z-30 after:w-px after:bg-color-table',
                      )}
                    >
                      <Checkbox
                        checked={isSelected}
                        disabled={checkboxProps?.disabled}
                        name={checkboxProps?.name}
                        onCheckedChange={(checked) =>
                          handleSelectRow(checked as boolean, record, key)
                        }
                        aria-label={`Chọn dòng ${key}`}
                      />
                    </TableCell>
                  )}
                  {columns.map((col, colIndex) => {
                    const value = col.dataIndex ? record[col.dataIndex as keyof T] : undefined
                    // Render với logic hàm render nếu có, không thì in chuỗi mặc định
                    let displayValue: React.ReactNode = value as React.ReactNode

                    if (col.render) {
                      displayValue = col.render(value, record, rowIndex)
                    }

                    const isFixedLeft = col.fixed === 'left'
                    const isFixedRight = col.fixed === 'right'

                    return (
                      <TableCell
                        key={String(col.key || col.dataIndex || `cell-${colIndex}`)}
                        className={cn(
                          col.align === 'center' && 'text-center',
                          col.align === 'right' && 'text-right',
                          isFixedLeft &&
                            cn(
                              'sticky left-0 z-10 bg-card shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] group-hover:bg-slate-50 dark:group-hover:bg-muted/40',
                              bordered &&
                                'after:absolute after:bottom-0 after:right-0 after:top-0 after:z-30 after:w-px after:bg-color-table',
                            ),
                          isFixedRight &&
                            cn(
                              'sticky right-0 z-10 bg-card shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.06)] group-hover:bg-slate-50 dark:group-hover:bg-muted/40',
                              bordered &&
                                'after:absolute after:bottom-0 after:left-0 after:top-0 after:z-30 after:w-px after:bg-color-table',
                            ),
                          col.className,
                        )}
                        style={{ width: col.width }}
                      >
                        {displayValue}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}

// Sử dụng Type Assertion để giữ được Generics khi dùng React.memo
export default React.memo(CustomTable) as typeof CustomTable
