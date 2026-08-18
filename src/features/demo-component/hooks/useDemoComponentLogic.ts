import { useQuery } from '@tanstack/react-query';
import { demoQueries } from './demo-component.queries';
import { useLoadOptions } from '@/shared/hooks/useLoadOptions';

/**
 * Unified UI Logic Hook — Đóng gói logic điều khiển (form, navigations, actions).
 */
export const useDemoComponentLogic = () => {

  // Khởi tạo data lúc rỗng dựa trên factory
  const { data, isLoading } = useQuery(
    demoQueries.pagination({
      PageInfo: { page: 1, pageSize: 10 },
      UserName: '',
      ReceiveUserId: '',
      ReceiveUserRoleId: '',
      ReceiveUserDeptId: '',
      Users: [],
    }),
  );




  const loadDemoOptions = useLoadOptions({
    queryFactory: demoQueries.pagination,
    searchKey: "UserName", // hoặc "Search", field tương ứng phía API cần
    defaultParams: {
      ReceiveUserDeptId: "e5613fe1-d7ba-4539-91cc-1896160d1d8c",
      ReceiveUserId: "53fa2319-2781-4818-9004-0e459cb062af",
      ReceiveUserRoleId: "f95fc0db-8d40-41e4-3e93-08ddd587cc8d",
      Users: [],
    },
    staleTime: 5 * 60 * 1000, // Cache 5 phút
  });

  // const loadDemoOptions = useLoadOptions({
  //   queryFactory: demoQueries.pagination,
  //   searchKey: "UserName",
  //   defaultParams: {
  //     ReceiveUserDeptId: "e5613fe1-d7ba-4539-91cc-1896160d1d8c",
  //     ReceiveUserId: "53fa2319-2781-4818-9004-0e459cb062af",
  //     ReceiveUserRoleId: "f95fc0db-8d40-41e4-3e93-08ddd587cc8d",
  //     Users: [],
  //   },
  //   staleTime: 5 * 60 * 1000,
  //   // Trực tiếp truyền hàm inline siêu gọn gàng:
  //   mapData: (item: any) => ({
  //     ...item,
  //     value: item.id,
  //     label: `${item.userName} - ${item.positionName}`,
  //   })
  // });

  //   // 1. Gọi Hook Mutation và truyền ngược Logic (onSuccess, onError) vào!
  // const addMutation = useAddDemoMutation({
  //   onSuccess: (dataResponse) => {
  //     // Logic đặc quyền của tầng UI
  //     console.log('Phản hồi từ server:', dataResponse);
  //     // toast.success('Thêm mới mỹ mãn!');

  //     // Ra lệnh làm mới dữ liệu
  //     queryClient.invalidateQueries({
  //       queryKey: ['demo-component'],
  //     });
  //   },
  //   onError: (error) => {
  //     // toast.error('Ối dồi ôi lỗi rồi!');
  //   }
  // });
  // // 2. Nút Submit Form sẽ gọi hàm này
  // const onSubmitForm = (formValues: any) => {
  //   addMutation.mutate(formValues);
  // };


  return {
    data,
    isLoading,
    loadDemoOptions,
  };
};