# 🚀 Base ReactJS — Enterprise Frontend Architecture

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TanStack Router](https://img.shields.io/badge/TanStack_Router-1.x-FF4154?style=flat-square&logo=react-router&logoColor=white)](https://tanstack.com/router)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-5.x-FF4154?style=flat-square&logo=react-query&logoColor=white)](https://tanstack.com/query)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-4.x-443E38?style=flat-square)](https://zustand-demo.pmnd.rs/)
[![Vitest](https://img.shields.io/badge/Vitest-2.x-6E9F18?style=flat-square&logo=vitest&logoColor=white)](https://vitest.dev/)

Base boilerplate chuẩn **Senior React Developer**, tối ưu hóa cho các dự án Web Application / Dashboard Enterprise với kiến trúc module **Feature-Driven Architecture**, kiểu dữ liệu an toàn tuyệt đối (Type-Safe), định tuyến mạnh mẽ, hiệu năng cao và khả năng mở rộng lâu dài.

---

## 📑 Mục Lục

- [Công Nghệ Cốt Lõi (Tech Stack)](#-công-nghệ-cốt-lõi-tech-stack)
- [Kiến Trúc Thư Mục (Folder Structure)](#-kiến-trúc-thư-mục-folder-structure)
- [Cài Đặt & Khởi Chạy (Getting Started)](#-cài-đặt--khởi-chạy-getting-started)
- [Công Cụ Sinh Code Tự Động (CLI Generator)](#-công-cụ-sinh-code-tự-động-cli-generator)
- [Quy Chuẩn Định Tuyến (TanStack Router)](#-quy-chuẩn-định-tuyến-tanstack-router)
- [Quản Lý State & Gọi API (Data Fetching)](#-quản-lý-state--gọi-api-data-fetching)
- [Hệ Thống Giao Diện & UI Components](#-hệ-thống-giao-diện--ui-components)
- [Xử Lý Form & Validate Dữ Liệu](#-xử-lý-form--validate-dữ-liệu)
- [Kiểm Thử (Testing)](#-kiểm-thử-testing)
- [Quy Chuẩn Viết Code (Code Conventions)](#-quy-chuẩn-viết-code-code-conventions)
- [Danh Sách Lệnh (Available Scripts)](#-danh-sách-lệnh-available-scripts)

---

## 🛠 Công Nghệ Cốt Lõi (Tech Stack)

| Phân Loại | Thư Viện / Công Nghệ | Phiên Bản | Mục Đích Sử Dụng |
| :--- | :--- | :--- | :--- |
| **Core** | [React](https://react.dev/) | 19.x | UI Framework chính |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | 5.x | Kiểm soát kiểu dữ liệu an toàn nghiêm ngặt |
| **Build Tool** | [Vite](https://vitejs.dev/) | 7.x | Build & Dev Server siêu nhanh |
| **Routing** | [TanStack Router](https://tanstack.com/router) | 1.x | Định tuyến File-based an toàn type 100% |
| **Server State** | [TanStack Query](https://tanstack.com/query) | 5.x | Caching, sync dữ liệu máy chủ |
| **Client State** | [Zustand](https://zustand-demo.pmnd.rs/) | 4.x | Quản lý state toàn cục nhẹ & linh hoạt |
| **Form & Validation** | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) | 7.x / 3.x | Quản lý form & schema validator |
| **UI Base** | [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) | Mới nhất | Headless component chuẩn accessible |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) + SCSS | 3.x | Utility-first CSS & SCSS tokens |
| **HTTP Client** | [Axios](https://axios-http.com/) | 1.x | Client HTTP hỗ trợ interceptor, refresh token |
| **Unit Test** | [Vitest](https://vitest.dev/) + RTL | 2.x | Test framework tương thích Vite |

---

## 📁 Kiến Trúc Thư Mục (Folder Structure)

Dự án tổ chức theo mô hình **Feature-Driven Development** kết hợp **Layered Architecture**:

```
src/
├── app/                  # App wrapper, providers khởi tạo
├── assets/               # Hình ảnh, icon tĩnh, vector SVG
├── config/               # Biến môi trường, queryClient, queryKeys, constants
│   ├── env.ts            # Validate & type-safe biến môi trường
│   ├── queryClient.ts    # Cấu hình TanStack Query Client
│   └── queryKeys.ts      # Quản lý khóa định danh cache
├── features/             # Module tính năng nghiệp vụ (Feature Modules)
│   ├── auth/             # Xác thực: Đăng nhập, đăng ký, quên mật khẩu...
│   │   ├── api/          # API calls cho feature
│   │   ├── components/   # UI components riêng của feature
│   │   ├── constants/    # Endpoints, constants nội bộ
│   │   ├── hooks/        # Queries & Custom hooks của feature
│   │   ├── schemas/      # Zod validation schemas
│   │   ├── stores/       # Zustand store riêng của feature
│   │   ├── types/        # TypeScript interfaces / types
│   │   └── index.ts      # Public API xuất ra ngoài
│   ├── dashboard/        # Bảng điều khiển / Thống kê
│   └── demo-component/   # Module mẫu tham khảo
├── layouts/              # Bố cục giao diện chung
│   ├── AuthLayout/       # Layout trang đăng nhập, đăng ký
│   ├── MainLayout/       # Layout chính ứng dụng (Sidebar + Header + Body)
│   └── Shares/           # Component layout con (Sidebar, Header, NavMain...)
├── routes/               # Định tuyến File-Based (TanStack Router)
│   ├── __root.tsx        # Root route chứa layout gốc & Devtools
│   ├── _authenticated/   # Các route yêu cầu quyền đăng nhập
│   ├── _guest/           # Các route cho khách (login, register)
│   └── errors/           # Trang lỗi 404, 500
├── shared/               # Tài nguyên dùng chung toàn ứng dụng
│   ├── constants/        # Hằng số toàn cục
│   ├── hooks/            # Custom hooks chung (useDebounce, useMobile...)
│   ├── lib/              # Tiện ích bổ trợ (Axios instance, utils, formatters)
│   ├── services/         # Services toàn cục (Upload, ...)
│   ├── stores/           # Stores dùng chung (Toast, UI state...)
│   ├── types/            # Type definitions chung
│   └── ui/               # Hệ thống Component UI
│       ├── common/       # Component custom nâng cao (CustomTable, CustomModal...)
│       ├── core/         # Component lõi (AppIcon, ...)
│       └── shadcn/       # Component shadcn/ui đã tùy biến
├── styles/               # File định dạng SCSS toàn cục & theme variables
├── test/                 # Cấu hình kiểm thử (Test setup & mocks)
├── main.tsx              # Điểm khởi chạy ứng dụng (Entry point)
└── routeTree.gen.ts      # Cây route tự động sinh bởi TanStack Router
```

---

## ⚡ Cài Đặt & Khởi Chạy (Getting Started)

### 1. Yêu cầu môi trường
- **Node.js**: >= 18.0.0 (khuyến nghị Node 20 LTS trở lên)
- **Package Manager**: `npm` hoặc `yarn`

### 2. Cài đặt dependencies
```bash
# Sử dụng npm
npm install

# Hoặc sử dụng yarn
yarn install
```

### 3. Cấu hình biến môi trường
Tạo file `.env` từ file mẫu `.env.example`:
```bash
cp .env.example .env
```
Cập nhật các biến trong file `.env`:
```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_API_TIMEOUT=30000
VITE_APP_NAME=BaseReactJS
VITE_APP_ENV=development
VITE_SENTRY_DSN=
```

### 4. Khởi chạy môi trường phát triển (Dev)
```bash
npm run dev
# hoặc
yarn dev
```
Ứng dụng sẽ chạy tại địa chỉ: `http://localhost:5173`

### 5. Build dự án & Preview Production
```bash
# Kiểm tra TypeScript & đóng gói mã nguồn
npm run build

# Xem trước bản build production tại local
npm run preview
```

---

## 🪄 Công Cụ Sinh Code Tự Động (CLI Generator)

Dự án tích hợp sẵn CLI script tự động sinh cấu trúc module tính năng mới chuẩn chuẩn chỉnh:

```bash
# Cú pháp
npm run gen:feature <tên-feature>

# Ví dụ tạo feature quản lý người dùng
npm run gen:feature user-management
```

Script sẽ tự động tạo thư mục `src/features/user-management` với đầy đủ:
```
src/features/user-management/
├── api/
├── components/
├── constants/
├── hooks/
├── schemas/
├── stores/
├── types/
└── index.ts
```

---

## 🗺 Quy Chuẩn Định Tuyến (TanStack Router)

Dự án áp dụng **TanStack Router File-Based Routing**. Mọi route được tự động quét và sinh ra file `src/routeTree.gen.ts`.

- **Layout Authenticated**: Nằm trong `src/routes/_authenticated/` (Đã gắn Auth Guard kiểm tra phiên đăng nhập).
- **Layout Guest**: Nằm trong `src/routes/_guest/` (Chỉ dành cho người dùng chưa đăng nhập).
- **Route Guard**: Xác thực được kiểm tra tại `beforeLoad` trong `src/routes/_authenticated.tsx`.

```tsx
// Ví dụ tạo Route mới: src/routes/_authenticated/users/index.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/users/')({
  component: UserListPage,
})

function UserListPage() {
  return <div>Danh sách người dùng</div>
}
```

---

## 🔄 Quản Lý State & Gọi API (Data Fetching)

### 1. Server State: TanStack Query v5
Tách biệt toàn bộ logic gọi API và hook query vào thư mục của từng feature:
- `api/`: Hàm gọi API qua Axios.
- `hooks/`: Custom hook bọc `useQuery` / `useMutation`.
- `config/queryKeys.ts`: Quản lý query key có hệ thống, tránh duplicate key.

```tsx
// src/features/auth/hooks/auth.queries.ts
export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (data: LoginPayload) => authApi.login(data),
    onSuccess: (res) => {
      // Xử lý khi thành công
    },
  })
}
```

### 2. Client State: Zustand
Sử dụng Zustand cho state nhẹ, chia store theo domain hoặc module:
- `auth.store.ts`: Quản lý token, thông tin user hiện tại.
- `ui.store.ts`: Quản lý sidebar collapsed, theme mode.
- `toast.store.ts`: Quản lý hệ thống thông báo động.

### 3. HTTP Client: Axios
Cấu hình tại `src/shared/lib/axios/`:
- Tự động gắn `Bearer Token` vào Header request.
- Bắt lỗi tập trung (Global error handler), xử lý Refresh Token tự động khi gặp `401 Unauthorized`.

---

## 🎨 Hệ Thống Giao Diện & UI Components

### 1. shadcn/ui + Radix UI
Toàn bộ component nguyên tử (Atom UI) được quản lý tại `src/shared/ui/shadcn/`:
- Button, Input, Checkbox, Select, Dropdown Menu, Dialog, Sidebar, Popover, Card, Tooltip...
- Thêm mới component qua CLI:
  ```bash
  npm run shadcn add <component-name>
  ```

### 2. Custom Components Nâng Cao (`src/shared/ui/common/customs/`)
Bộ component đóng gói sẵn dành riêng cho màn hình nghiệp vụ phức tạp:
- `CustomTable`: Bảng dữ liệu hỗ trợ phân trang, sắp xếp, lọc, chọn nhiều dòng.
- `CustomModal` / `CustomModalConfirm`: Modal thông báo & xác nhận hành động chuẩn giao diện.
- `CustomButton`: Nút bấm đa trạng thái (Loading, Icon, Variant).
- `CustomDatePicker`: Bộ chọn ngày/tháng/năm thân thiện.
- `CustomDropPagination`: Phân trang kết hợp tùy chọn số lượng bản ghi trên trang.
- `FormFieldWrapper`: Bọc label, thông báo lỗi validation đồng bộ.

---

## 📝 Xử Lý Form & Validate Dữ Liệu

Sử dụng kết hợp **React Hook Form** + **Zod**:
1. Định nghĩa schema trong `schemas/<feature>.schema.ts`.
2. Suy diễn TypeScript Type trực tiếp từ Zod schema bằng `z.infer<typeof schema>`.
3. Gắn resolver vào `useForm`:

```tsx
const loginSchema = z.object({
  email: z.string().email('Email không đúng định dạng'),
  password: z.string().min(6, 'Mật khẩu phải từ 6 ký tự'),
})

type LoginFormValues = z.infer<typeof loginSchema>

const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
  resolver: zodResolver(loginSchema),
})
```

---

## 🧪 Kiểm Thử (Testing)

Dự án thiết lập sẵn môi trường kiểm thử Unit Test / Integration Test với **Vitest** và **React Testing Library**:

```bash
# Chạy toàn bộ test
npm test

# Chạy test một lần duy nhất (CI/CD)
npm run test:run

# Chạy test kèm giao diện UI trực quan
npm run test:ui

# Xuất báo cáo độ phủ mã nguồn (Coverage Report)
npm run test:coverage
```

---

## 📐 Quy Chuẩn Viết Code (Code Conventions)

1. **Single Responsibility**: Mỗi file, component, hook chỉ thực hiện một nhiệm vụ duy nhất.
2. **Tối ưu Re-render**:
   - Component nhận props dùng `React.memo(Component)` kèm `displayName`.
   - Hàm truyền qua props sử dụng `useCallback`.
   - Tính toán nặng sử dụng `useMemo`.
3. **Tuyệt đối không dùng `any`**: Mọi dữ liệu phải có kiểu TypeScript rõ ràng (`interface`, `type`).
4. **Không gọi API trực tiếp trong UI**: Luôn thông qua tầng `api/` và bọc qua React Query hooks.
5. **Ngôn ngữ chú thích (Comments)**: Toàn bộ ghi chú, giải thích logic phức tạp bắt buộc viết bằng **Tiếng Việt**.

---

## 📜 Danh Sách Lệnh (Available Scripts)

| Lệnh | Ý Nghĩa / Mục Đích |
| :--- | :--- |
| `npm run dev` | Khởi chạy Vite Dev Server tại cổng `5173` |
| `npm run build` | Kiểm tra Type-check & đóng gói dự án (`dist/`) |
| `npm run preview` | Khởi chạy server local chạy thử thư mục `dist/` |
| `npm run gen:feature <name>` | Tự động tạo thư mục feature mới chuẩn kiến trúc |
| `npm run lint` | Quét kiểm tra lỗi ESLint toàn bộ source code |
| `npm run lint:fix` | Tự động sửa các lỗi ESLint có thể fix tự động |
| `npm run format` | Định dạng toàn bộ code theo chuẩn Prettier |
| `npm run format:check` | Kiểm tra định dạng code có tuân thủ Prettier không |
| `npm run type-check` | Kiểm tra toàn bộ lỗi kiểu dữ liệu TypeScript (`tsc --noEmit`) |
| `npm run test` | Chạy bộ kiểm thử tự động với Vitest |
| `npm run test:ui` | Mở dashboard giao diện chạy Vitest trên trình duyệt |
| `npm run test:coverage` | Đo lường tỷ lệ bao phủ test của dự án |
| `npm run doctor` | Kiểm tra sức khỏe & tối ưu hóa mã nguồn React |

---

<p align="center">
  Được xây dựng & duy trì bởi <b>Senior Engineering Team</b> 🎯
</p>
