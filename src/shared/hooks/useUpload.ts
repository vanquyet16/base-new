// PATH: src/shared/hooks/useUpload.ts
// Hook "Headless" xử lý toàn bộ nghiệp vụ liên quan đến tệp tin: Upload, Download, Progress Tracking, Validation.
// Tuân thủ Clean Architecture: Tầng shared/ KHÔNG import từ tầng features/.

import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'

import { uploadFileApi, downloadFileApi } from '@/shared/services/upload.service'
import { type UploadParams, type UploadResponse } from '@/shared/types/upload.types'
import { toast } from '@/shared/stores/toast.store'

/**
 * Interface biểu diễn trạng thái của một tệp tin đang được tải lên
 */
export interface UploadingItem {
  /** ID tạm thời để định danh item trong tiến trình tải */
  id: string
  /** Tên tệp tin gốc */
  fileName: string
  /** Tiến độ tải lên (0 - 100) */
  progress: number
  /** Cờ đánh dấu đang tải */
  isUploading: true
  /** Kích thước file (bytes) */
  size?: number
}

/**
 * Interface tệp tin hiển thị kết hợp giữa tệp đã tải và tệp đang tải
 */
export interface UploadDisplayItem extends Partial<UploadResponse> {
  id: string
  fileName: string
  isUploading: boolean
  progress: number
}

/**
 * Cấu hình tùy chọn cho hook useUpload
 */
export interface UseUploadOptions {
  /** Danh sách tệp tin hiện tại (Controlled từ Form hoặc State ngoài) */
  value?: UploadResponse[]
  /** Callback kích hoạt khi danh sách tệp tin thay đổi */
  onChange?: (files: UploadResponse[]) => void
  /** Giới hạn dung lượng tối đa cho mỗi file (đơn vị: MB, mặc định 10MB) */
  maxSize?: number
  /** Giới hạn số lượng tệp tin tối đa được phép đính kèm */
  maxCount?: number
  /** Danh sách đuôi file được phép upload (VD: ['.pdf', '.docx', '.png']) */
  allowedExtensions?: string[]
  /** Loại file nghiệp vụ (gửi lên API) */
  fileType?: string
  /** Có yêu cầu ký số hay không */
  isSign?: boolean
  /** Cho phép công khai tệp tin hay không */
  isPublish?: boolean
  /** Tên người dùng thực hiện upload */
  userName?: string
  /** Callback tùy chỉnh khi upload một file thành công */
  onUploadSuccess?: (file: UploadResponse) => void
  /** Callback tùy chỉnh khi có lỗi xảy ra */
  onUploadError?: (error: unknown, fileName: string) => void
}

/**
 * useUpload — Hook "Headless" chuẩn Senior xử lý toàn diện nghiệp vụ tệp tin.
 *
 * Tính năng chính:
 * 1. Tải lên đơn lẻ / đồng thời nhiều file với thanh tiến độ riêng biệt (Progress tracking).
 * 2. Tự động kiểm tra tính hợp lệ: Giới hạn số lượng (maxCount), dung lượng (maxSize), định dạng (allowedExtensions).
 * 3. Hỗ trợ hủy tải lên (AbortController) theo từng file hoặc khi component bị unmount.
 * 4. Khắc phục triệt để Race Condition & Stale Closures khi tải nhiều tệp song song.
 * 5. Tải file về máy an toàn, giải phóng bộ nhớ (Object URL cleanup).
 * 6. Helper phân loại icon theo định dạng file.
 */
export const useUpload = (options: UseUploadOptions = {}) => {
  const {
    value = [],
    onChange,
    maxSize = 10,
    maxCount,
    allowedExtensions,
    fileType,
    isSign = false,
    isPublish = true,
    userName,
    onUploadSuccess,
    onUploadError,
  } = options

  // DOM ref cho thẻ input file
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Map lưu trữ các AbortController cho từng file đang upload (Key: tempId)
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map())

  // Ref giữ giá trị value và onChange mới nhất để tránh Stale Closure và hạn chế re-create callbacks
  const valueRef = useRef<UploadResponse[]>(value)
  const onChangeRef = useRef(onChange)
  const onUploadSuccessRef = useRef(onUploadSuccess)
  const onUploadErrorRef = useRef(onUploadError)

  useEffect(() => {
    valueRef.current = value
    onChangeRef.current = onChange
    onUploadSuccessRef.current = onUploadSuccess
    onUploadErrorRef.current = onUploadError
  })

  // State theo dõi các file đang trong quá trình upload
  const [uploadingItems, setUploadingItems] = useState<Record<string, UploadingItem>>({})

  // Dọn dẹp tất cả các request upload đang dang dở khi unmount
  useEffect(() => {
    const controllers = abortControllersRef.current
    return () => {
      controllers.forEach((controller) => controller.abort())
      controllers.clear()
    }
  }, [])

  // Mutation gọi API upload file
  const uploadMutation = useMutation<UploadResponse, Error, UploadParams>({
    mutationFn: (params: UploadParams) => uploadFileApi(params),
  })

  /**
   * 1. Xóa một file đã upload khỏi danh sách
   */
  const handleDelete = useCallback((id: string) => {
    const currentFiles = valueRef.current
    const fileToDelete = currentFiles.find((f) => f.id === id)
    const updatedFiles = currentFiles.filter((f) => f.id !== id)

    onChangeRef.current?.(updatedFiles)
    toast.success(
      fileToDelete?.fileName
        ? `Đã gỡ bỏ: ${fileToDelete.fileName}`
        : 'Đã gỡ bỏ tệp tin khỏi danh sách',
    )
  }, [])

  /**
   * 2. Hủy tiến trình upload của một tệp tin cụ thể
   */
  const handleCancelUpload = useCallback((tempId: string) => {
    const controller = abortControllersRef.current.get(tempId)
    if (controller) {
      controller.abort()
      abortControllersRef.current.delete(tempId)
    }

    setUploadingItems((prev) => {
      if (!prev[tempId]) return prev
      const updated = { ...prev }
      delete updated[tempId]
      return updated
    })

    toast.info('Đã hủy tải lên tệp tin')
  }, [])

  /**
   * 3. Tải tệp tin về máy (Download Blob) an toàn
   */
  const handleDownloadFile = useCallback(async (file: UploadResponse) => {
    if (!file.id) {
      toast.error('Tệp tin không hợp lệ để tải xuống')
      return
    }

    try {
      const blob = await downloadFileApi(file.id)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = file.fileName || 'download'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Thu hồi Object URL sau 1 khoảng trễ ngắn để browser hoàn tất trigger download
      setTimeout(() => {
        window.URL.revokeObjectURL(url)
      }, 1000)
    } catch {
      toast.error(`Không thể tải xuống tệp tin: ${file.fileName || 'Tệp tin'}`)
    }
  }, [])

  /**
   * 4. Tải tất cả các tệp tin hiện có trong danh sách
   */
  const handleDownloadAll = useCallback(() => {
    const files = valueRef.current
    if (files.length === 0) {
      toast.info('Không có tệp tin nào để tải xuống')
      return
    }

    files.forEach((file) => {
      handleDownloadFile(file)
    })
    toast.info(`Bắt đầu tải xuống ${files.length} tệp tin`)
  }, [handleDownloadFile])

  /**
   * 5. Kích hoạt hộp thoại chọn file
   */
  const openFileDialog = useCallback(() => {
    if (fileInputRef.current) {
      // Reset value trước khi click để đảm bảo chọn lại file vừa upload vẫn trigger onChange
      fileInputRef.current.value = ''
      fileInputRef.current.click()
    }
  }, [])

  /**
   * 6. Xử lý sự kiện khi người dùng chọn file từ Input
   */
  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (!files || files.length === 0) return

      const fileList = Array.from(files)

      // Reset value của input ngay lập tức
      e.target.value = ''

      const currentFilesCount = valueRef.current.length
      const currentUploadingCount = Object.keys(abortControllersRef.current).length

      // Kiểm tra giới hạn số lượng file (maxCount)
      if (maxCount && currentFilesCount + currentUploadingCount + fileList.length > maxCount) {
        toast.error(
          `Vượt quá số lượng tệp cho phép. Tối đa: ${maxCount}, hiện có: ${currentFilesCount + currentUploadingCount}`,
        )
        return
      }

      // Xử lý upload từng file song song nhưng đồng bộ cập nhật state an toàn
      const uploadPromises = fileList.map(async (file) => {
        // Kiểm tra dung lượng (maxSize - MB)
        const maxSizeBytes = maxSize * 1024 * 1024
        if (file.size > maxSizeBytes) {
          toast.error(`Tệp "${file.name}" vượt quá dung lượng cho phép (${maxSize}MB)`)
          return
        }

        // Kiểm tra định dạng file (allowedExtensions) nếu có cấu hình
        if (allowedExtensions && allowedExtensions.length > 0) {
          const fileExtension = `.${file.name.split('.').pop()?.toLowerCase() || ''}`
          const isAllowed = allowedExtensions.some(
            (ext) => ext.toLowerCase() === fileExtension,
          )
          if (!isAllowed) {
            toast.error(
              `Định dạng tệp "${file.name}" không hợp lệ. Cho phép: ${allowedExtensions.join(', ')}`,
            )
            return
          }
        }

        const tempId = `temp-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`
        const abortController = new AbortController()
        abortControllersRef.current.set(tempId, abortController)

        // Cập nhật trạng thái đang upload
        setUploadingItems((prev) => ({
          ...prev,
          [tempId]: {
            id: tempId,
            fileName: file.name,
            progress: 0,
            isUploading: true,
            size: file.size,
          },
        }))

        try {
          const response = await uploadMutation.mutateAsync({
            file,
            fileType,
            isSign,
            isPublish,
            userName,
            signal: abortController.signal,
            onProgress: (percent) => {
              setUploadingItems((prev) => {
                if (!prev[tempId]) return prev
                return {
                  ...prev,
                  [tempId]: { ...prev[tempId], progress: percent },
                }
              })
            },
          })

          // Chuẩn hóa response trả về từ backend
          const res = response as UploadResponse & { data?: UploadResponse }
          const fileData = res.data ?? res

          if (fileData && fileData.id) {
            let finalUrl = fileData.fileDownload || fileData.url
            if (!finalUrl && fileData.serverUrl && fileData.filePath) {
              const baseUrl = fileData.serverUrl.endsWith('/')
                ? fileData.serverUrl
                : `${fileData.serverUrl}/`
              const path = fileData.filePath.startsWith('/')
                ? fileData.filePath
                : fileData.filePath
              finalUrl = `${baseUrl}${path}`
            }

            const newFile: UploadResponse = {
              id: fileData.id,
              fileName: fileData.fileName || file.name,
              filePath: fileData.filePath,
              serverUrl: fileData.serverUrl,
              extension: fileData.extension,
              url: finalUrl,
              createdBy: fileData.createdBy,
              size: fileData.size || file.size,
              mimetype: fileData.mimetype,
              isSign: fileData.isSign ?? isSign,
            }

            // Cập nhật danh sách file an toàn dựa trên latest valueRef
            const currentList = valueRef.current
            const updatedList = [...currentList, newFile]
            valueRef.current = updatedList
            onChangeRef.current?.(updatedList)

            onUploadSuccessRef.current?.(newFile)
            toast.success(`Tải lên thành công: ${file.name}`)
          }
        } catch (error: unknown) {
          // Bỏ qua thông báo lỗi nếu request bị hủy chủ động bởi người dùng
          if (error instanceof Error && (error.name === 'CanceledError' || error.name === 'AbortError')) {
            return
          }
          onUploadErrorRef.current?.(error, file.name)
          toast.error(`Tải lên thất bại: ${file.name}`)
        } finally {
          abortControllersRef.current.delete(tempId)
          setUploadingItems((prev) => {
            if (!prev[tempId]) return prev
            const updated = { ...prev }
            delete updated[tempId]
            return updated
          })
        }
      })

      await Promise.allSettled(uploadPromises)
    },
    [maxSize, maxCount, allowedExtensions, fileType, isSign, isPublish, userName, uploadMutation],
  )

  /**
   * 7. Helper nhận diện Icon và Màu sắc tương ứng với định dạng tệp tin
   */
  const getFileIcon = useCallback((extensionOrName?: string) => {
    if (!extensionOrName) return { name: 'File', color: 'text-slate-400' }

    const ext = (
      extensionOrName.includes('.')
        ? extensionOrName.split('.').pop() || ''
        : extensionOrName
    ).toLowerCase()

    if (['pdf'].includes(ext)) {
      return { name: 'FileText', color: 'text-red-500' }
    }
    if (['doc', 'docx'].includes(ext)) {
      return { name: 'FileText', color: 'text-blue-500' }
    }
    if (['xls', 'xlsx', 'csv'].includes(ext)) {
      return { name: 'FileSpreadsheet', color: 'text-emerald-600' }
    }
    if (['png', 'jpg', 'jpeg', 'svg', 'webp', 'gif'].includes(ext)) {
      return { name: 'FileImage', color: 'text-purple-500' }
    }
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
      return { name: 'FileArchive', color: 'text-amber-500' }
    }

    return { name: 'File', color: 'text-slate-400' }
  }, [])

  /**
   * Danh sách hiển thị thống nhất cho UI Table/List
   */
  const displayData = useMemo<UploadDisplayItem[]>(() => {
    const uploaded: UploadDisplayItem[] = (Array.isArray(value) ? value : []).map((f) => ({
      ...f,
      isUploading: false,
      progress: 100,
    }))

    const uploading: UploadDisplayItem[] = Object.values(uploadingItems).map((item) => ({
      id: item.id,
      fileName: item.fileName,
      size: item.size,
      isUploading: true,
      progress: item.progress,
    }))

    return [...uploaded, ...uploading]
  }, [value, uploadingItems])

  const isGlobalUploading = useMemo(
    () => Object.keys(uploadingItems).length > 0,
    [uploadingItems],
  )

  return {
    /** Ref gắn vào input file */
    fileInputRef,

    // Actions
    /** Gỡ bỏ tệp tin khỏi danh sách */
    handleDelete,
    /** Hủy tiến trình upload của tệp đang tải */
    handleCancelUpload,
    /** Tải 1 tệp tin về máy */
    handleDownloadFile,
    /** Tải tất cả tệp tin về máy */
    handleDownloadAll,
    /** Handler gán vào sự kiện onChange của input file */
    handleFileChange,
    /** Kích hoạt mở hộp thoại chọn file */
    openFileDialog,

    // UI Helpers
    /** Helper lấy icon và màu sắc cho file */
    getFileIcon,
    /** Danh sách tệp tin hiển thị thống nhất cho UI */
    displayData,

    // States
    /** Map các tệp tin đang được tải lên */
    uploadingItems,
    /** Cờ báo hiệu có ít nhất một file đang tải lên */
    isGlobalUploading,
    /** Trạng thái pending từ React Query mutation */
    isPending: uploadMutation.isPending,

    // Mutation gốc
    uploadMutation,
  }
}

export default useUpload
