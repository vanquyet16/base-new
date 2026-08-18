import { useCallback, useRef, useEffect } from "react";
import { useQueryClient, type FetchQueryOptions } from "@tanstack/react-query";

interface UseLoadOptionsProps<
  TItem = unknown,
  TOption = TItem,
  TParams = unknown,
> {
  /** Hàm tạo query options (ví dụ: demoQueries.pagination) */
  queryFactory: (params: TParams) => object;
  /**
   * Tham số tĩnh bổ sung thêm vào body/params (ví dụ: filter mặc định)
   * Các props này sẽ được gộp chung với PageInfo và search
   */
  defaultParams?: Partial<TParams> | Record<string, unknown>;
  /** Thời gian cache dữ liệu (ms), mặc định 5 phút (300000ms) */
  staleTime?: number;
  /** Tên trường tìm kiếm khi gửi API, mặc định là "UserName" */
  searchKey?: string;
  /** Số bản ghi trên 1 trang mặc định, thường là 10 */
  pageSize?: number;
  /**
   * (Tuỳ chọn) Hàm biến đổi cấu trúc từng dòng dữ liệu sau khi nhận về
   * Dùng khi muốn gộp chuỗi (vd: userName + positionName)
   */
  mapData?: (item: TItem) => TOption;
  /**
   * (Tuỳ chọn) Điều kiện bật/tắt gọi API. Mặc định là true.
   * Dùng cho Cascading Dropdown (vd: chỉ gọi API khi đã chọn Drop 1)
   */
  enabled?: boolean;
}

/**
 * useLoadOptions - Hook dùng để phân trang và tải options với React Select Async
 * Quản lý fetch data, cache data thông qua React Query.
 */
export const useLoadOptions = <
  TItem = unknown,
  TOption = TItem,
  TParams = unknown,
>({
  queryFactory,
  defaultParams = {},
  staleTime = 5 * 60 * 1000,
  searchKey = "UserName",
  pageSize = 10,
  mapData,
  enabled = true,
}: UseLoadOptionsProps<TItem, TOption, TParams>) => {
  const queryClient = useQueryClient();

  // Dùng Ref để giữ giá trị tham chiếu mới nhất của mapData mà không gây re-render
  const mapDataRef = useRef(mapData);
  useEffect(() => {
    mapDataRef.current = mapData;
  }, [mapData]);

  const loadOptions = useCallback(
    async (search: string, _: unknown, additional?: { page?: number }) => {
      // ĐẶC BIỆT: Nếu cờ enabled đang tắt (chưa sẵn sàng lấy data), chặn đứng ngay tại đây!
      if (!enabled) {
        return { options: [], hasMore: false };
      }

      try {
        const page = additional?.page || 1;

        const bodyParams = {
          PageInfo: { page, pageSize },
          [searchKey]: search,
          ...(defaultParams as Record<string, unknown>),
        } as TParams;

        const queryOpts = queryFactory(bodyParams) as unknown as FetchQueryOptions<{ data?: TItem[]; totalRecord?: number }>;

        const res = await queryClient.fetchQuery({
          ...queryOpts,
          staleTime,
        });

        const items = (res?.data || []) as TItem[];
        const totalRecords = res?.totalRecord || 0;

        // Trích xuất hàm map từ Ref mới nhất ra để dùng
        const currentMapData = mapDataRef.current;
        const finalItems = currentMapData ? items.map(currentMapData) : (items as unknown as TOption[]);

        return {
          options: finalItems,
          hasMore: page * pageSize < totalRecords,
          additional: {
            page: page + 1,
          },
        };
      } catch (error) {
        console.error("Lỗi khi gọi API qua React Query trong useLoadOptions:", error);
        return { options: [], hasMore: false };
      }
    },
    [queryClient, queryFactory, defaultParams, staleTime, searchKey, pageSize, enabled]
  );

  return loadOptions;
};
