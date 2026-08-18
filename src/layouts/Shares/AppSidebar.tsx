/**
 * AppSidebar — Sidebar chính của ứng dụng Bộ Công An (nằm dưới Header).
 * Tối ưu: React.memo để tránh re-render khi props không thay đổi.
 */
import React from 'react'
import { ShieldCheck } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/shared/ui/shadcn/sidebar'
import { sidebarItems } from '@/shared/constants/sidebar.constants'
import { NavMain } from './NavMain'

export const AppSidebar = React.memo(function AppSidebar(
  props: React.ComponentProps<typeof Sidebar>,
) {
  return (
    <Sidebar {...props} variant="sidebar" collapsible="icon" className="border-r border-border bg-card">
      {/* ─── Sidebar Header: Cổng thông tin nghiệp vụ BCA + Nút thu gọn ────── */}
      <SidebarHeader className="h-[68px] px-3 flex flex-col justify-center border-b border-border/80">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center justify-between gap-2 px-0.5">
              <div className="flex items-center gap-2.5 min-w-0 group-data-[collapsible=icon]:hidden">
                <div className="flex aspect-square size-8.5 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                  <ShieldCheck className="size-5" />
                </div>
                <div className="flex flex-col text-left min-w-0">
                  <span className="text-xs font-bold text-primary truncate uppercase tracking-wide leading-tight">
                    Cổng Nghiệp Vụ
                  </span>
                  <span className="text-[11px] text-muted-foreground truncate leading-tight">
                    Bộ Công An
                  </span>
                </div>
              </div>

              {/* Nút thu gọn / mở rộng Sidebar */}
              <SidebarTrigger className="h-8 w-8 text-on-surface-variant hover:text-primary hover:bg-muted/60 transition-colors group-data-[collapsible=icon]:mx-auto" />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* ─── Sidebar Content: Danh mục điều hướng tính năng ────────────────── */}
      <SidebarContent className="py-2">
        <NavMain items={sidebarItems} />
      </SidebarContent>

      {/* ─── Sidebar Footer: Thông tin đơn vị quản trị hệ thống ───────────── */}
      <SidebarFooter className="p-3 border-t border-border/60">
        <div className="flex items-center gap-3 px-1 py-1 group-data-[collapsible=icon]:justify-center">
          <div className="relative shrink-0">
            <img
              src="/bca-emblem.png"
              alt="Cục CNTT"
              className="w-9 h-9 rounded-full object-cover border border-border/80"
            />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-secondary border-2 border-card rounded-full" />
          </div>
          <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="text-xs font-bold text-foreground truncate">Cục CNTT</span>
            <span className="text-[11px] text-muted-foreground truncate">Quản trị hệ thống</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
})

AppSidebar.displayName = 'AppSidebar'
