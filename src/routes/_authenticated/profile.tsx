// PATH: src/routes/_authenticated/profile.tsx
// User profile page.

import { createFileRoute } from '@tanstack/react-router'

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/shadcn/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/shadcn/card'
import { Badge } from '@/shared/ui/shadcn/badge'
import { useAuthStore } from '@/features/auth/stores/auth.store'

export const Route = createFileRoute('/_authenticated/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const user = useAuthStore((state) => state.user)

  if (!user) return null

  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Hồ sơ cá nhân</h1>
        <p className="text-muted-foreground">Thông tin tài khoản của bạn</p>
      </div>

      <Card className="max-w-lg">
        <CardHeader className="flex flex-row items-center gap-4 pb-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar ?? undefined} />
            <AvatarFallback className="text-lg font-bold">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{user.fullName}</CardTitle>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <Badge variant="secondary" className="mt-1 capitalize">
              {user.role}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Họ</p>
              <p className="font-medium">{user.firstName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Tên</p>
              <p className="font-medium">{user.lastName}</p>
            </div>
            <div className="col-span-2">
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Email xác thực</p>
              <Badge variant={user.isEmailVerified ? 'default' : 'destructive'}>
                {user.isEmailVerified ? 'Đã xác thực' : 'Chưa xác thực'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
