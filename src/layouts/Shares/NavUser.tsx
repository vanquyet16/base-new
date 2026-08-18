/**
 * NavUser — Hiển thị thông tin user và menu đăng xuất.
 * Hỗ trợ 2 variant: sidebar (footer) và header (icon avatar).
 * Tối ưu: React.memo + useMemo cho normalizeUser và các giá trị computed.
 */
import React, { useMemo } from 'react'
import { CircleUser, CreditCard, EllipsisVertical, LogOut, MessageSquareDot } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/shadcn/avatar'
import { Button } from '@/shared/ui/shadcn/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/shadcn/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/shared/ui/shadcn/sidebar'
import { useAuthStore } from '@/features/auth/stores/auth.store'
import { useLogout } from '@/features/auth/hooks/useLogout'

interface NavUserProps {
  variant?: 'sidebar' | 'header'
}

interface NormalizedUser {
  firstName: string
  lastName: string
  fullName: string
  email: string
  avatar: string | null
}

// Hàm thuần — đặt ngoài component để không tạo lại mỗi render
function getInitials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

/** Chuẩn hóa user từ store — hỗ trợ nhiều cấu trúc User khác nhau */
function normalizeUser(user: unknown): NormalizedUser {
  if (!user || typeof user !== 'object') {
    return { firstName: 'Khách', lastName: '', fullName: 'Khách', email: '', avatar: null }
  }
  const u = user as Record<string, unknown>
  const toStr = (v: unknown) => (v != null ? String(v) : '')
  const toAvatar = (v: unknown): string | null => (v != null && typeof v === 'string' ? v : null)

  if (u.firstName != null) {
    return {
      firstName: toStr(u.firstName),
      lastName: toStr(u.lastName),
      fullName: toStr(u.fullName || `${u.firstName} ${u.lastName ?? ''}`).trim() || 'Khách',
      email: toStr(u.email),
      avatar: toAvatar(u.avatar ?? u.avatarUrl),
    }
  }
  const parts = toStr(u.fullName).trim().split(/\s+/)
  const firstName = parts[0] || 'Khách'
  const lastName = parts.slice(1).join(' ') || ''
  return {
    firstName,
    lastName,
    fullName: toStr(u.fullName).trim() || 'Khách',
    email: toStr(u.email),
    avatar: toAvatar(u.avatarUrl ?? u.avatar),
  }
}

export const NavUser = React.memo(function NavUser({ variant = 'sidebar' }: NavUserProps) {
  const user = useAuthStore((state) => state.user)
  const { handleLogout, isLoggingOut } = useLogout()
  const { isMobile } = useSidebar()


  // Cache kết quả normalizeUser — chỉ tính lại khi user thay đổi

  const activeUser = useMemo(() => normalizeUser(user), [user])
  const initials = useMemo(
    () => getInitials(activeUser.firstName, activeUser.lastName),
    [activeUser.firstName, activeUser.lastName],
  )
  const dropdownSide = variant === 'header' ? 'bottom' : isMobile ? 'bottom' : 'right'

  const menu = (
    <DropdownMenuContent
      className="animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=right]:slide-in-from-left-2 min-w-56 rounded-lg"
      side={dropdownSide}
      align="end"
      sideOffset={4}
    >
      <DropdownMenuLabel className="p-0 font-normal">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={activeUser.avatar ?? undefined} alt={activeUser.fullName} />
            <AvatarFallback className="rounded-lg text-xs font-semibold">{initials}</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{activeUser.fullName}</span>
            <span className="truncate text-xs text-muted-foreground">{activeUser.email}</span>
          </div>
        </div>
      </DropdownMenuLabel>

      <DropdownMenuSeparator />

      <DropdownMenuGroup>
        <DropdownMenuItem className="gap-2">
          <CircleUser size={16} />
          Tài khoản
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2">
          <CreditCard size={16} />
          Thanh toán
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2">
          <MessageSquareDot size={16} />
          Thông báo
        </DropdownMenuItem>
      </DropdownMenuGroup>

      <DropdownMenuSeparator />

      <DropdownMenuItem
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="gap-2 text-destructive focus:text-destructive"
      >
        <LogOut size={16} />
        {isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}
      </DropdownMenuItem>
    </DropdownMenuContent>
  )

  if (variant === 'header') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center gap-1.5 sm:gap-2 h-9 sm:h-10 px-1 sm:px-2 py-1 rounded-full md:rounded-lg text-on-surface-variant hover:text-primary hover:bg-muted/60 transition-all focus-visible:ring-1 focus-visible:ring-primary"
          >
            <span className="hidden xl:inline-flex font-bold text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary">
              P2
            </span>
            <span className="hidden xl:inline-block text-border">|</span>
            <Avatar className="h-7 w-7 sm:h-8 sm:w-8 rounded-full border border-border shrink-0">
              <AvatarImage src={activeUser.avatar ?? undefined} alt={activeUser.fullName} />
              <AvatarFallback className="bg-primary text-[10px] sm:text-xs font-semibold text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden lg:flex flex-col text-left text-xs leading-none max-w-[140px] xl:max-w-[160px]">
              <span className="font-semibold text-foreground truncate">{activeUser.fullName}</span>
              <span className="text-[11px] text-muted-foreground truncate">Văn thư phòng</span>
            </div>
            <EllipsisVertical className="hidden md:inline-block h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        {menu}
      </DropdownMenu>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" tooltip={activeUser.fullName}>
              <Avatar className="h-8 w-8 rounded-lg group-data-[collapsible=icon]:size-9">
                <AvatarImage src={activeUser.avatar ?? undefined} alt={activeUser.fullName} />
                <AvatarFallback className="rounded-lg text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-medium">{activeUser.fullName}</span>
                <span className="truncate text-xs text-muted-foreground">{activeUser.email}</span>
              </div>
              <EllipsisVertical className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          {menu}
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
})
