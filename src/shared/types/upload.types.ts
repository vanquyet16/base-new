export interface UploadResponse {
  /** ID định danh tệp tin trong hệ thống */
  id: string
  /** Tên gốc của tệp tin */
  fileName: string
  /** Đường dẫn tệp tin trên server */
  filePath?: string
  /** URL server lưu trữ */
  serverUrl?: string
  /** Định dạng tệp tin (VD: .docx, .pdf) */
  extension?: string
  /** URL truy cập tệp tin / dùng để download */
  url?: string
  /** URL download trực tiếp từ server (đối với hệ thống cũ) */
  fileDownload?: string
  /** Kích thước tệp tin (bytes) */
  size?: number
  /** Định dạng tệp tin (mime type) */
  mimetype?: string
  /** Người tạo file */
  createdBy?: string
  /** Ngày tạo */
  createdDate?: string
  /** Trạng thái ký số (nếu có) */
  isSign?: boolean
}

export interface UploadParams {
  /** Tệp tin cần upload */
  file: File
  /** Loại file (văn bản, đính kèm, ...) */
  fileType?: string
  /** Có ký số hay không */
  isSign?: boolean
  /** Công khai hay không */
  isPublish?: boolean
  /** Tên người dùng thực hiện upload */
  userName?: string
  /** Hàm callback theo dõi tiến độ (0-100) */
  onProgress?: (percent: number) => void
  /** Signal để hủy request upload */
  signal?: AbortSignal
}

export interface GetInfoFileRequest {
  /** Có phải file ký số không */
  isSign: boolean
  /** Danh sách ID file cần lấy thông tin */
  listFile: string[]
}
