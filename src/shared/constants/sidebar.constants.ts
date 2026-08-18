import {
  Building2,
  GitBranch,
  KeyRound,
  LayoutDashboard,
  Settings,
  Shield,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavSubItem {
  title: string
  url: string
  icon?: LucideIcon
  comingSoon?: boolean
  newTab?: boolean
  isNew?: boolean
  subItems?: NavSubItem[]
}

export interface NavMainItem {
  title: string
  url: string
  icon?: LucideIcon
  subItems?: NavSubItem[]
  comingSoon?: boolean
  newTab?: boolean
  isNew?: boolean
}

export interface NavGroup {
  id: number
  label?: string
  items: NavMainItem[]
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: 'Tổng quan',
    items: [
      {
        title: 'Trang chủ',
        url: '/dashboard',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    id: 2,
    label: 'Quản trị',
    items: [
      {
        title: 'Đơn vị',
        url: '/admin/departments',
        icon: Building2,
      },
      {
        title: 'Người dùng',
        url: '/admin/users',
        icon: Users,
      },
      {
        title: 'Chức vụ',
        url: '/admin/roles',
        icon: Shield,
      },
      {
        title: 'Quyền menu',
        url: '/admin/menu-permission',
        icon: KeyRound,
      },
      {
        title: 'Workflow',
        url: '/admin/workflow',
        icon: GitBranch,
        subItems: [
          { title: 'Danh sách luồng', url: '/admin/workflow/danh-sach' },
          { title: 'Tạo / Chỉnh sửa luồng', url: '/admin/workflow/upsert-luong', },
        ],
      },
    ],
  },
  {
    id: 3,
    label: 'Cấu hình',
    items: [
      {
        title: 'Cài đặt',
        url: '/settings',
        icon: Settings,
      },
    ],
  },
]
