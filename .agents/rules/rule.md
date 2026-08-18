---
trigger: always_on
---

---
description: Quy chuẩn kiến trúc Base React (Senior Standard) — Áp dụng cho toàn bộ dự án
globs: **/*.{ts,tsx,js,jsx}
alwaysApply: true
---

# ⚛️ Chuẩn Kiến Trúc & Quy Tắc Lập Trình Base React (Senior Standard)

## 🎯 1. Triết lý chung & Nguyên tắc thiết kế

- **Tư duy Senior Developer**: Code rõ ràng, tường minh, có tính module cao, dễ mở rộng và bảo trì lâu dài.
- **Single Responsibility Principle (SRP)**: Mỗi file, hook, component chỉ làm một nhiệm vụ duy nhất.
- **Feature-Driven Architecture (FDA)**: Toàn bộ nghiệp vụ được chia nhỏ và đóng gói độc lập theo từng Feature.
- **Decoupled Routing (Tách rời Trang và Định tuyến)**:
  - Thư mục `src/routes/` **chỉ làm nhiệm vụ khai báo route** (TanStack Router `createFileRoute`), kiểm tra auth guard, loader.
  - Tuyệt đối **không viết JSX layout/giao diện trực tiếp trong file router**. Toàn bộ giao diện trang phải đặt tại `src/features/<feature>/pages/`.
- **Cấm sử dụng `any` (100% Type-Safe)**: Toàn bộ dữ liệu phải có kiểu TypeScript chặt chẽ (`interface`, `type`, `generic`, hoặc `unknown` khi ép kiểu có kiểm soát).
- **Comment Tiếng Việt bắt buộc**: Toàn bộ giải thích, tài liệu và **comment trong code phải viết bằng tiếng Việt**.

---

## 📁 2. Cấu trúc thư mục chuẩn (BẮT BUỘC tuân thủ)

```
src/
├── app/                  # App wrapper, Context providers khởi tạo
├── assets/               # Hình ảnh tĩnh, SVG vector, logo
├── config/               # Cấu hình môi trường, queryClient, queryKeys, menu constants
│   ├── env.ts            # Validate & type-safe biến môi trường
│   ├── queryClient.ts    # Cấu hình TanStack Query Client
│   └── queryKeys.ts      # Quản lý khóa định danh cache
├── features/             # ⭐️ Tầng nghiệp vụ tính năng (Feature Modules)
│   └── <feature-name>/   # Tên feature (kebab-case, ví dụ: auth, dashboard, demo-component)
│       ├── api/          # Các hàm gọi API qua Axios client
│       ├── components/   # UI components nội bộ của riêng feature
│       ├── constants/    # Endpoints, default params, hằng số nội bộ
│       ├── hooks/        # Queries factory (@tanstack/react-query) & Custom hooks
│       ├── pages/        # ⭐️ Component Trang giao diện (Tách rời hoàn toàn khỏi Router)
│       ├── schemas/      # Zod validation schemas
│       ├── stores/       # Zustand store riêng của feature (nếu có)
│       ├── types/        # TypeScript interfaces & types của feature
│       ├── __tests__/    # Unit tests của feature
│       └── index.ts      # Public API xuất khẩu ra ngoài feature
├── layouts/              # Bố cục khung giao diện chung
│   ├── AuthLayout/       # Layout trang đăng nhập, đăng ký
│   ├── MainLayout/       # Layout chính ứng dụng (Header toàn màn hình + Sidebar + Nội dung)
│   └── Shares/           # Component layout con (Header, AppSidebar, NavUser, ...)
├── routes/               # Định tuyến File-Based (TanStack Router)
│   ├── __root.tsx        # Root route chứa layout gốc & Devtools
│   ├── _authenticated/   # Các route yêu cầu quyền đăng nhập
│   ├── _guest/           # Các route cho khách (login, register)
│   └── errors/           # Trang lỗi 404, 500
├── shared/               # Tài nguyên dùng chung toàn ứng dụng (Foundational layer)
│   ├── constants/        # Hằng số toàn cục
│   ├── hooks/            # Custom hooks chung (useUpload, useLoadOptions, useAnimatedToast, ...)
│   ├── lib/              # Tiện ích bổ trợ (Axios instance, Interceptors, utils cn, formatters)
│   ├── services/         # Services HTTP toàn cục
│   ├── stores/           # Zustand stores dùng chung (auth.store, toast.store, sidebar.store)
│   ├── types/            # Type definitions chung toàn dự án
│   └── ui/               # Hệ thống Component UI
│       ├── core/         # Component lõi (AppIcon, ...)
│       ├── shadcn/       # Primitives shadcn/ui đã tùy biến (button, form, popover, dialog, ...)
│       └── common/       # Component custom nâng cao (FormFieldWrapper, CustomDatePicker, CustomDropPagination, CustomTable, CustomTableUpload, CustomModal, CustomButton)
├── styles/               # File định dạng SCSS toàn cục, animations, theme variables
├── test/                 # Cấu hình kiểm thử (Test setup & mocks)
├── main.tsx              # Điểm khởi chạy ứng dụng (Entry point)
└── routeTree.gen.ts      # Cây route tự động sinh bởi TanStack Router (Không sửa file này)
```

---

## 🛡️ 3. Quy tắc phân tầng & Cấm tạo/import file sai chỗ (Architecture Boundaries)

ESLint (`eslint-plugin-boundaries`) kiểm soát tự động hướng phụ thuộc:

| Tầng (Layer) | Được phép Import | KHÔNG được phép Import |
| :--- | :--- | :--- |
| **`routes/`** | `features` (pages/public API), `layouts`, `shared`, `config`, `types` | Không viết UI layout phức tạp trực tiếp trong router |
| **`features/`** | `shared`, `config`, `types`, `assets`, `styles`, và **nội bộ feature của mình** | Không import private files của feature khác |
| **`layouts/`** | `shared`, `config`, `types`, `layouts` (Shares nội bộ) | Không import ngược từ `routes` |
| **`shared/`** | `config`, `types`, `assets`, `styles` và `shared` nội bộ | **Tuyệt đối KHÔNG import từ `features`, `routes`, `layouts`** |
| **`types/`** | Không phụ thuộc bất kỳ tầng logic nào | |

---

## 🧱 4. Quy tắc viết Component (Senior React Standard)

### ✅ 1. Bắt buộc dùng `React.memo` & `displayName`
Mọi component nhận `props` phải bọc trong `React.memo` và có `displayName` tường minh:

```tsx
interface UserCardProps {
  /** Thông tin người dùng */
  name: string
  /** Email hiển thị */
  email: string
  /** Callback khi bấm chọn */
  onSelect: (email: string) => void
}

/**
 * UserCard — Component hiển thị thông tin thẻ người dùng.
 */
export const UserCard = React.memo(({ name, email, onSelect }: UserCardProps) => {
  const handleClick = useCallback(() => {
    onSelect(email)
  }, [email, onSelect])

  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div>
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-muted-foreground">{email}</p>
      </div>
      <Button onClick={handleClick} variant="outline" size="sm">
        Chọn
      </Button>
    </div>
  )
})

UserCard.displayName = 'UserCard'
```

### ✅ 2. Tối ưu hoá Callback & Tính toán (`useCallback`, `useMemo`)
- Mọi hàm truyền qua props phải được bọc trong `useCallback`.
- Mọi phép tính toán biến đổi, lọc dữ liệu nặng phải được bọc trong `useMemo`.

```tsx
// ✅ Đúng — giữ nguyên tham chiếu hàm tránh re-render component con
const handleSubmitForm = useCallback((values: FormValues) => {
  mutateAsync(values)
}, [mutateAsync])

// ✅ Đúng — chỉ tính toán lại khi dữ liệu nguồn thay đổi
const activeUsers = useMemo(
  () => users.filter((u) => u.status === 'active'),
  [users]
)
```

---

## 📋 5. Quy chuẩn Form & Validation (React Hook Form + Zod)

1. **Định nghĩa Schema bằng Zod**: Thông báo lỗi bằng tiếng Việt cho tất cả các trường.
2. **Sử dụng `FormFieldWrapper`**: Tự động hiển thị Label, dấu `*` bắt buộc, viền đỏ `border-destructive` khi lỗi, và dòng text `FormMessage` bên dưới.
3. **Bắt sự kiện Submit an toàn**: Truyền cả handler `onValid` và `onInvalid`:

```tsx
// 1. Zod Schema
export const documentSchema = z.object({
  soVanBan: z.string({ required_error: 'Vui lòng nhập số văn bản' }).min(1, 'Vui lòng nhập số văn bản'),
  cqBanHanh: z.array(z.string()).min(1, 'Vui lòng chọn cơ quan ban hành'),
})

// 2. Component Form
export const DocumentForm = React.memo(({ form, onSubmit }: DocumentFormProps) => {
  const handleInvalid = useCallback((errors: FieldErrors<DocumentFormValues>) => {
    toast.error('Vui lòng kiểm tra và điền đầy đủ các trường bắt buộc!', {
      title: 'Thông tin chưa hợp lệ',
    })
  }, [])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, handleInvalid)} className="space-y-4" noValidate>
        <FormFieldWrapper control={form.control} name="soVanBan" label="Số văn bản" required>
          {(field, fieldState) => (
            <Input
              {...field}
              placeholder="Nhập số văn bản..."
              className={cn(fieldState.error && 'border-destructive focus-visible:ring-destructive/30')}
            />
          )}
        </FormFieldWrapper>
      </form>
    </Form>
  )
})
```

---

## 🎨 6. Hệ thống UI & Thứ tự ưu tiên xây dựng Component

Thứ tự ưu tiên khi tạo giao diện:
1. **Component Custom trong `src/shared/ui/common/`**:
   - `FormFieldWrapper`: Wrapper form chuẩn.
   - `CustomButton`: Nút bấm đa năng hỗ trợ tooltip, icon, loading.
   - `CustomDatePicker`: Bộ chọn ngày/tháng/năm linh hoạt (Date, ISO, timestamp).
   - `CustomDropPagination`: Dropdown phân trang async tích hợp React Query.
   - `CustomTable`: Bảng dữ liệu đa năng phân trang, chọn dòng, fixed column.
   - `CustomTableUpload`: Bảng upload tệp tin song song, tiến trình tải, hủy và tải xuống.
   - `CustomModal`, `CustomModalConfirm`: Hộp thoại xác nhận chuẩn.
2. **shadcn/ui Primitives trong `src/shared/ui/shadcn/`**: `Button`, `Input`, `Dialog`, `Popover`, `Card`, `Badge`.
3. **Tailwind CSS Utility**: Spacing, Flexbox, Grid, Typography.
4. **CẤM** dùng thẻ HTML thô (`<button>`, `<select>`, `<input>`) khi đã có component tương ứng trong Base.

---

## 🔄 7. Quy chuẩn Quản lý Dữ liệu & Gọi API (TanStack Query + Zustand)

- **Query Factory Pattern**: Gom toàn bộ query options của feature vào 1 object `<feature>Queries` tập trung:
  ```ts
  export const demoQueries = {
    pagination: (body: DemoRequest) => queryOptions({
      queryKey: ['demo', 'pagination', body] as const,
      queryFn: () => getDemoPaginationApi(body),
    }),
  }
  ```
- **Global State (Zustand)**: Đặt trong `src/shared/stores/` (cho state toàn cục) hoặc `src/features/<feature>/stores/` (cho state riêng feature).

---

## 💬 8. Quy tắc Comment trong Code (BẮT BUỘC Tiếng Việt)

```tsx
// ✅ Comment mô tả mục đích Component / Hook
/**
 * DemoStandardForm — Component hiển thị form theo bố cục 4 cột chuẩn.
 * Tích hợp FormFieldWrapper, CustomDropPagination, CustomDatePicker và CustomTableUpload.
 */

// ✅ Comment logic xử lý phức tạp
// Đồng bộ danh sách file an toàn dựa trên latest valueRef
const currentList = valueRef.current
const updatedList = [...currentList, newFile]

// ✅ Comment TODO / FIXME
// TODO: Tích hợp API phân quyền chi tiết theo vai trò người dùng
// FIXME: Bổ sung xử lý khi mất kết nối mạng đột ngột
```

---

## 🚫 9. Các điều CẤM TUYỆT ĐỐI (Anti-Patterns)

- ❌ **CẤM dùng `any`**: Sử dụng `unknown`, generic `<T>`, hoặc định nghĩa kiểu tường minh.
- ❌ **CẤM viết UI trực tiếp trong router**: Router chỉ import component từ `src/features/<feature>/pages/`.
- ❌ **CẤM inline function phức tạp trong JSX**: Tách ra biến bọc `useCallback`.
- ❌ **CẤM dùng index làm `key`** trong vòng lặp `.map()` render danh sách động.
- ❌ **CẤM gọi API trực tiếp trong UI Component**: Phải gọi qua Hook / Service / Query Factory.
- ❌ **CẤM tạo component lồng nhau bên trong component khác**: Tách thành file riêng biệt.

---

## ✅ 10. Checklist chất lượng trước khi Commit

- [ ] Lệnh `npm run lint` đạt **0 lỗi, 0 cảnh báo** (kiểm soát boundaries và cấm `any`).
- [ ] Lệnh `npm run type-check` đạt **0 lỗi TypeScript**.
- [ ] Lệnh `npm run build` biên dịch thành công (`tsc -b && vite build`).
- [ ] Lệnh `npm run test:run` vượt qua 100% unit tests.
- [ ] Mọi component nhận props đều có `React.memo` & `displayName`.
- [ ] Mọi callback truyền qua props đều có `useCallback`.
- [ ] File mới được đặt đúng thư mục theo cấu trúc chuẩn Base (`pages/`, `components/`, `hooks/`, `schemas/`, `types/`, `api/`).
- [ ] Comment và thông báo giao diện viết hoàn toàn bằng tiếng Việt.
