import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/shadcn/select'
import { Input } from '@/shared/ui/shadcn/input'
import { ChevronLeft, ChevronRight, ChevronFirst, ChevronLast } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

export interface CustomPaginationParamPage {
  page: number
  pageSize: number
  [key: string]: unknown
}

export interface CustomPaginationProps {
  total: number
  paramPage: CustomPaginationParamPage
  setParamPage: (params: CustomPaginationParamPage) => void
  className?: string
  paginationContent?: string
}

/**
 * CustomPagination — Component phân trang tái sử dụng.
 * Hỗ trợ chọn số bản ghi/trang, nhảy trang trực tiếp, và 4 nút điều hướng.
 * Tối ưu hóa: dùng React.memo + useCallback để tránh re-render không cần thiết.
 */
const CustomPagination = React.memo(({
  total,
  paramPage,
  setParamPage,
  className,
}: CustomPaginationProps): React.JSX.Element => {
  const { page, pageSize } = paramPage

  // Tính tổng số trang (đảm bảo ít nhất 1 trang nếu không có data)
  const finalPage = useMemo(
    () => Math.max(1, Math.ceil(total / pageSize)),
    [total, pageSize],
  )

  // State cục bộ cho ô input nhập trang
  const [inputPage, setInputPage] = useState<string>(() => page.toString())

  // Cập nhật lại input khi props page thay đổi từ bên ngoài
  useEffect(() => {
    setInputPage(page.toString())
  }, [page])

  // Tính toán range hiển thị: "1-10 trên tổng số 100" (tính trực tiếp, không cần useMemo)
  const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1
  const endItem = Math.min(page * pageSize, total)

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= finalPage) {
        setParamPage({ ...paramPage, page: newPage })
      }
    },
    [finalPage, paramPage, setParamPage],
  )

  const handleSizeChange = useCallback(
    (newSize: string) => {
      setParamPage({ ...paramPage, page: 1, pageSize: Number(newSize) })
    },
    [paramPage, setParamPage],
  )

  // Bắt sự kiện khi người dùng blur hoặc ấn Enter trên ô nhập trang
  const handleInputCommit = useCallback(() => {
    let newPage = parseInt(inputPage, 10)
    // Validate dữ liệu nhập
    if (isNaN(newPage) || newPage < 1) {
      newPage = 1
    } else if (newPage > finalPage) {
      newPage = finalPage
    }

    setInputPage(newPage.toString())
    // Chỉ gọi setParamPage nếu thực sự thay đổi trang
    if (newPage !== page) {
      handlePageChange(newPage)
    }
  }, [finalPage, handlePageChange, inputPage, page])

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleInputCommit()
      }
    },
    [handleInputCommit],
  )

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPage(e.target.value)
  }, [])

  // Các callback điều hướng cố định — useCallback để không tạo lại mỗi render
  const goFirst = useCallback(() => handlePageChange(1), [handlePageChange])
  const goPrev = useCallback(() => handlePageChange(page - 1), [handlePageChange, page])
  const goNext = useCallback(() => handlePageChange(page + 1), [handlePageChange, page])
  const goLast = useCallback(() => handlePageChange(finalPage), [handlePageChange, finalPage])

  const isFirst = page === 1 || total === 0
  const isLast = page === finalPage || total === 0

  return (
    <div
      className={cn(
        'flex w-full flex-wrap items-center justify-center sm:justify-end gap-4 sm:gap-6 px-2 py-4 text-sm text-foreground',
        className,
      )}
    >
      {/* 1. Số record trên trang */}
      <div className="flex items-center gap-2 font-medium">
        <span>Hàng trên mỗi trang:</span>
        <Select value={pageSize.toString()} onValueChange={handleSizeChange} disabled={total === 0}>
          <SelectTrigger className="h-8 w-[72px] bg-transparent">
            <SelectValue placeholder={pageSize.toString()} />
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 50, 100].map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 2. Tổng số record */}
      <div className="mr-2 font-medium text-muted-foreground">
        {startItem}-{endItem} trên tổng số {total}
      </div>

      {/* 3. Phím điều hướng */}
      <div className="flex items-center gap-3">
        <button
          className="flex items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
          onClick={goFirst}
          disabled={isFirst}
        >
          <span className="sr-only">Trang đầu</span>
          <ChevronFirst className="h-[18px] w-[18px]" />
        </button>
        <button
          className="flex items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
          onClick={goPrev}
          disabled={isFirst}
        >
          <span className="sr-only">Trang trước</span>
          <ChevronLeft className="h-[18px] w-[18px]" />
        </button>

        {/* Input nhập số trang */}
        {total === 0 ? (
          <span className="mx-1 select-none text-sm font-medium opacity-50">0 / 0</span>
        ) : (
          <div className="flex items-center justify-center gap-1 mx-1 text-sm font-medium">
            <Input
              type="number"
              min={1}
              max={finalPage}
              className="h-7 w-8 border-none bg-transparent px-0 text-center font-medium shadow-none outline-none transition-none focus-visible:ring-0 focus-visible:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              value={inputPage}
              onChange={handleInputChange}
              onBlur={handleInputCommit}
              onKeyDown={handleInputKeyDown}
            />
            <span className="mx-1 select-none text-muted-foreground">/</span>
            <span className="w-8 select-none text-center text-muted-foreground">{finalPage}</span>
          </div>
        )}

        <button
          className="flex items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
          onClick={goNext}
          disabled={isLast}
        >
          <span className="sr-only">Trang tiếp</span>
          <ChevronRight className="h-[18px] w-[18px]" />
        </button>
        <button
          className="flex items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
          onClick={goLast}
          disabled={isLast}
        >
          <span className="sr-only">Trang cuối</span>
          <ChevronLast className="h-[18px] w-[18px]" />
        </button>
      </div>
    </div>
  )
})

CustomPagination.displayName = 'CustomPagination'

export default CustomPagination
