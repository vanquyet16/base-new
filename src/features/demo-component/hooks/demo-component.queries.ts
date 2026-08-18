import { useMutation, useQueryClient, queryOptions } from '@tanstack/react-query';
import { getDemoApiPanigation } from '../api/demo-component.api';
import type { DemoApiPanigationRequest } from '../types/demo.type';
import type { UseMutationOptions } from '@tanstack/react-query';

// =============== CHUẨN MẪU QUERY FACTORY (DÀNH CHO REACT QUERY V5) ===============
// Nét đặc sắc: Gom toàn bộ Query Options vào 1 Object duy nhất để quản lý tập trung.
// Không cần đẻ ra hàng tá Custom Hooks lắt nhắt nữa.
export const demoQueries = {
  // Query Option cho luồng Pagination
  pagination: (body: DemoApiPanigationRequest) => queryOptions({
    queryKey: ['demo-component', 'pagination', body] as const, // Thêm sub-key phân tách
    queryFn: () => getDemoApiPanigation(body),
  }),

  // Các Query Option khác có thể thêm vào đây sau này...
  // detail: (id: string) => queryOptions({ ... }),
};

// =============== CHUẨN MẪU HOOK MUTATION (Thêm/Sửa/Xóa) ===============

export const useAddDemoMutation = (options?: UseMutationOptions<any, Error, any>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      // Ví dụ: return await apiAddDemo(data); 
      console.log('API Gọi tạo mới với data:', data);
      return data;
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['demo-component'] });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};