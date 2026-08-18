import { apiClient } from '@/shared/lib/axios';
import type { GetInfoFileRequest, UploadParams, UploadResponse } from '@/shared/types/upload.types';

/**
 * Service xử lý các thao tác với tệp tin qua ManageFilesServer.
 */

/**
 * Tải tệp tin lên máy chủ.
 * @param params Bao gồm file, fileType, isSign, userName, isPublish và callback tiến độ.
 */
export const uploadFileApi = async (params: UploadParams): Promise<UploadResponse> => {
  const { file, fileType, isSign = false, userName, isPublish = true, onProgress, signal } = params;
  const formData = new FormData();
  formData.append('file', file);

  // Xây dựng query parameters theo chuẩn 
  const queryParams = new URLSearchParams();
  if (fileType) queryParams.append('fileType', fileType);
  queryParams.append('isSign', String(isSign));
  if (userName) queryParams.append('userName', userName);
  queryParams.append('isPublish', String(isPublish));

  return apiClient.post<UploadResponse>(
    `/api/ManageFilesServer/UploadFile?${queryParams.toString()}`,
    formData,
    {
      signal,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    }
  );
};

/**
 * Lấy thông tin chi tiết danh sách tệp tin.
 * @param body { isSign: boolean, listFile: string[] }
 */
export const getInfoFileApi = async (body: GetInfoFileRequest): Promise<UploadResponse[]> => {
  return apiClient.post<UploadResponse[]>('/api/ManageFilesServer/GetInfoFile', body);
};

/**
 * Tải tệp tin về máy (trả về blob).
 * @param fileId ID của tệp tin.
 */
export const downloadFileApi = async (fileId: string): Promise<Blob> => {
  return apiClient.get<Blob>(`/api/ManageFilesServer/DownloadFile?fileId=${fileId}`, {
    responseType: 'blob',
  });
};

/**
 * Xóa tệp tin khỏi hệ thống.
 * @param fileId ID của tệp tin.
 */
export const deleteFileApi = async (fileId: string): Promise<void> => {
  return apiClient.post<void>(`/api/ManageFilesServer/Delete/${fileId}`, {});
};
