/**
 * Header — Thanh tiêu đề ứng dụng toàn màn hình chuẩn Bộ Công An:
 * - Logo Quốc huy / Emblem BCA & Tiêu đề cơ quan chính thống
 * - Dải viền đỏ gradient nhận diện thương hiệu
 * - Nút toggle sidebar, tác vụ nhanh (Home, Apps, Notifications, Calendar) và NavUser
 */
import React, { useCallback } from 'react'
import { Link } from '@tanstack/react-router'
import { Bell, Calendar, Home, LayoutGrid, Moon, Sun } from 'lucide-react'

import { Button } from '@/shared/ui/shadcn/button'
import { Separator } from '@/shared/ui/shadcn/separator'
import { useUiStore } from '@/shared/stores/ui.store'
import { NavUser } from './NavUser'

export const Header = React.memo(function Header() {
  // Dùng atomic selectors để chỉ re-render khi theme thay đổi
  const theme = useUiStore((state) => state.theme)
  const setTheme = useUiStore((state) => state.setTheme)

  const toggleTheme = useCallback(
    () => setTheme(theme === 'dark' ? 'light' : 'dark'),
    [theme, setTheme],
  )

  return (
    <header
      className="sticky top-0 z-30 flex h-[var(--header-height,4.5rem)] w-full shrink-0 items-center justify-between border-b-[3px] border-transparent bg-card/95 px-2.5 sm:px-4 md:px-6 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/85 transition-all"
      style={{
        borderImage:
          'linear-gradient(to right, hsl(var(--primary-container)), hsl(var(--primary-fixed-dim)), hsl(var(--primary))) 1 / 1 / 0 stretch',
      }}
    >
      {/* ─── Khu vực Trái: Logo Emblem + Tiêu đề cơ quan chính thống ──── */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0 flex-1 mr-2">
        <Link to="/dashboard" className="flex items-center gap-2 sm:gap-2.5 md:gap-3 group focus:outline-none min-w-0">
          <img
            src="/bca-emblem.png"
            alt="Biểu trưng Bộ Công An"
            className="h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12 object-contain drop-shadow-sm shrink-0 transition-transform group-hover:scale-105"
          />
          <div className="flex flex-col justify-center min-w-0">
            <span className="text-primary font-bold text-[10px] sm:text-[11px] md:text-xs leading-tight tracking-wider uppercase truncate">
              BỘ CÔNG AN
            </span>
            <span className="text-primary font-bold text-xs sm:text-sm md:text-base lg:text-lg leading-tight uppercase truncate">
              <span className="hidden sm:inline">CỤC CẢNH SÁT QLHC VỀ TRẬT TỰ XÃ HỘI</span>
              <span className="inline sm:hidden">CỤC QLHC VỀ TTXH</span>
            </span>
          </div>
        </Link>
      </div>

      {/* ─── Khu vực Phải: Quick Actions + Theme + NavUser ─────────────────── */}
      <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2.5 shrink-0">
        {/* Nút Về trang chủ */}
        <Button
          variant="ghost"
          size="icon"
          className="hidden xs:inline-flex sm:inline-flex h-8 w-8 sm:h-9 sm:w-9 rounded-full text-on-surface-variant hover:text-primary hover:bg-muted/60"
          asChild
          aria-label="Trang chủ"
        >
          <Link to="/dashboard">
            <Home className="h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
        </Button>

        {/* Nút Menu ứng dụng nghiệp vụ */}
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:inline-flex h-8 w-8 sm:h-9 sm:w-9 rounded-full text-on-surface-variant hover:text-primary hover:bg-muted/60"
          aria-label="Danh mục ứng dụng"
        >
          <LayoutGrid className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>

        {/* Nút Thông báo hệ thống có Badge số */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full text-on-surface-variant hover:text-primary hover:bg-muted/60"
          aria-label="Thông báo hệ thống"
        >
          <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="absolute -top-0.5 -right-0.5 flex h-3.5 min-w-3.5 sm:h-4 sm:min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[8px] sm:text-[9px] font-bold text-white shadow-sm ring-2 ring-card">
            99+
          </span>
        </Button>

        {/* Nút Lịch & Sự kiện */}
        <Button
          variant="ghost"
          size="icon"
          className="hidden lg:inline-flex relative h-8 w-8 sm:h-9 sm:w-9 rounded-full text-on-surface-variant hover:text-primary hover:bg-muted/60"
          aria-label="Lịch công tác"
        >
          <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="absolute -top-0.5 -right-0.5 flex h-3.5 min-w-3.5 sm:h-4 sm:min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[8px] sm:text-[9px] font-bold text-white shadow-sm ring-2 ring-card">
            4
          </span>
        </Button>

        {/* Nút Đổi giao diện Sáng / Tối */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 sm:h-9 sm:w-9 rounded-full text-on-surface-variant hover:text-primary hover:bg-muted/60"
          onClick={toggleTheme}
          aria-label="Chuyển chế độ sáng/tối"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
          ) : (
            <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
          )}
        </Button>

        <Separator
          orientation="vertical"
          className="mx-0.5 sm:mx-1 hidden sm:block h-5 sm:h-6 data-[orientation=vertical]:self-center"
        />

        {/* User profile dropdown menu */}
        <NavUser variant="header" />
      </div>
    </header>
  )
})

Header.displayName = 'Header'
