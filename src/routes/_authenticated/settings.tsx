// PATH: src/routes/_authenticated/settings.tsx
// Settings page — placeholder for app settings.

import { createFileRoute } from '@tanstack/react-router'
import { Settings } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/shadcn/card'

export const Route = createFileRoute('/_authenticated/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Cài đặt</h1>
        <p className="text-muted-foreground">Quản lý cài đặt ứng dụng và tài khoản</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Thiết lập hệ thống
          </CardTitle>
          <CardDescription>Thêm các cài đặt của ứng dụng vào đây</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Chưa có cài đặt nào được cấu hình.</p>
        </CardContent>
      </Card>
    </div>
  )
}
