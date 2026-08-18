---
trigger: always_on
---

---

description: Rule ReactJS chuẩn Senior — áp dụng cho toàn bộ dự án React/Next.js
globs: \*_/_.{ts,tsx,js,jsx}
alwaysApply: true

---

# ⚛️ React Senior Code Standard

## 🎯 Triết lý chung

- Luôn code theo tư duy **Senior Developer**: rõ ràng, có thể mở rộng, dễ bảo trì
- Ưu tiên **tính đọc được** hơn sự ngắn gọn
- Mỗi file chỉ làm **một nhiệm vụ duy nhất** (Single Responsibility Principle)
- Luôn **comment bằng tiếng Việt** khi sinh code

---

## 📁 Cấu trúc thư mục dự án (BẮT BUỘC tuân thủ)

```
src/
├── app/                  # Next.js App Router (hoặc pages/)
├── components/
│   ├── ui/               # Component shadcn/ui đã tuỳ chỉnh
│   ├── common/           # Component dùng chung toàn dự án (Button, Modal, ...)
│   ├── layout/           # Header, Footer, Sidebar, Shell...
│   └── features/         # Component theo tính năng (auth/, dashboard/, ...)
├── hooks/                # Custom hooks (useXxx.ts)
├── lib/                  # Helpers, utils, config
├── services/             # Gọi API (axios, fetch)
├── stores/               # State management (zustand, redux...)
├── types/                # TypeScript interfaces & types
└── constants/            # Hằng số toàn cục
```

> Khi tạo file mới, **LUÔN đặt đúng thư mục** theo cấu trúc trên.
> Không được tạo component trực tiếp trong `app/` hoặc `pages/`.

---

## 🧱 Quy tắc viết Component

### ✅ Bắt buộc

```tsx
// ✅ Luôn dùng React.memo để tránh re-render không cần thiết
const MyComponent = React.memo(({ title, onClick }: Props) => {
  // Mô tả ngắn gọn: component hiển thị tiêu đề và xử lý click
  return (
    <div>
      <h1>{title}</h1>
      <Button onClick={onClick}>Xác nhận</Button>
    </div>
  );
});

MyComponent.displayName = "MyComponent"; // Bắt buộc khi dùng memo
```

### ✅ Dùng useCallback cho mọi hàm truyền qua props

```tsx
// ✅ Đúng — tránh tạo lại hàm mỗi lần render
const handleSubmit = useCallback(() => {
  // Xử lý logic submit form
  onSubmit(formData);
}, [formData, onSubmit]);
```

### ✅ Dùng useMemo cho giá trị tính toán nặng

```tsx
// ✅ Đúng — chỉ tính lại khi danh sách thay đổi
const filteredList = useMemo(
  () => items.filter((item) => item.active),
  [items]
);
```

---

## 🎨 UI — Ưu tiên shadcn/ui + Component Custom

### Thứ tự ưu tiên khi xây dựng UI:

1. **shadcn/ui** — dùng trực tiếp hoặc bọc lại trong `components/ui/`
2. **Component custom** trong `components/common/` hoặc `components/features/`
3. **Tailwind CSS** — cho styling bổ sung
4. **KHÔNG** dùng thẻ HTML thuần (`<div>`, `<button>`) khi đã có component tương ứng

```tsx
// ❌ Sai — dùng thẻ HTML thuần
<button className="px-4 py-2 bg-blue-500">Gửi</button>

// ✅ Đúng — dùng component shadcn/ui
import { Button } from "@/components/ui/button";
<Button variant="default">Gửi</Button>

// ✅ Đúng — dùng layout shadcn/ui
import { Card, CardHeader, CardContent } from "@/components/ui/card";
<Card>
  <CardHeader>Tiêu đề</CardHeader>
  <CardContent>Nội dung</CardContent>
</Card>
```

### Layout Shell chuẩn (dùng shadcn/ui):

```tsx
// components/layout/AppShell.tsx
// Bố cục chính của ứng dụng: sidebar + content area
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const AppShell = React.memo(({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      {/* Sidebar điều hướng chính */}
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
});
```

---

## 💬 Quy tắc Comment (BẮT BUỘC — Tiếng Việt)

```tsx
// ✅ Comment component: mô tả mục đích
/**
 * ProductCard — Hiển thị thông tin tóm tắt của một sản phẩm.
 * Dùng trong trang danh sách và trang tìm kiếm.
 */

// ✅ Comment logic phức tạp
// Lọc sản phẩm đang hoạt động và sắp xếp theo giá tăng dần
const sorted = useMemo(
  () =>
    products
      .filter((p) => p.isActive)
      .sort((a, b) => a.price - b.price),
  [products]
);

// ✅ Comment cho hook custom
/**
 * useProductFilter — Hook quản lý logic lọc và tìm kiếm sản phẩm.
 * @param initialFilters - Bộ lọc mặc định khi khởi tạo
 */

// ✅ Comment TODO / FIXME
// TODO: Tích hợp phân trang khi danh sách vượt quá 100 items
// FIXME: Xử lý edge case khi API trả về mảng rỗng
```

---

## 🔧 Custom Hooks — Quy tắc

```tsx
// hooks/useDebounce.ts
// Hook trì hoãn cập nhật giá trị — dùng cho ô tìm kiếm
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Đặt timer để cập nhật giá trị sau một khoảng trễ
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    // Huỷ timer nếu value thay đổi trước khi hết delay
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

- Tên hook: `useXxx` (camelCase, bắt đầu bằng `use`)
- Mỗi hook một file riêng trong `hooks/`
- Hook chỉ xử lý **logic**, không chứa JSX

---

## 📐 TypeScript — Bắt buộc

```tsx
// ✅ Luôn định nghĩa Props rõ ràng
interface ProductCardProps {
  /** ID sản phẩm */
  id: string;
  /** Tên sản phẩm hiển thị */
  name: string;
  /** Giá bán (VNĐ) */
  price: number;
  /** Callback khi người dùng nhấn thêm vào giỏ hàng */
  onAddToCart: (id: string) => void;
}

// ✅ Dùng type cho union, interface cho object
type ButtonVariant = "primary" | "secondary" | "ghost";
interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}
```

---

## 🚫 Các điều KHÔNG được làm

```tsx
// ❌ Không dùng `any`
const data: any = fetchData();

// ❌ Không inline function trong JSX (gây re-render)
<Button onClick={() => handleClick(id)}>Click</Button>

// ❌ Không để logic trong JSX — tách ra biến
<div>{items.filter(i => i.active).map(i => <Item key={i.id} {...i} />)}</div>

// ❌ Không dùng index làm key
items.map((item, index) => <Item key={index} />)

// ❌ Không tạo component trong component khác
function Parent() {
  function Child() { return <div /> } // ❌
}
```

---

## ✅ Checklist trước khi commit

- [ ] Component có `React.memo` nếu nhận props
- [ ] Tất cả hàm truyền qua props dùng `useCallback`
- [ ] Giá trị tính toán nặng dùng `useMemo`
- [ ] Props có TypeScript interface rõ ràng
- [ ] File đặt đúng thư mục theo cấu trúc dự án
- [ ] Ưu tiên dùng component shadcn/ui thay thẻ HTML
- [ ] Comment bằng tiếng Việt cho logic phức tạp và component
- [ ] Không có `any`, không có `console.log` thừa
- [ ] Tên biến / hàm rõ nghĩa, không viết tắt tuỳ tiện
