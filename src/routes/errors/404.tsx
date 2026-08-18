// PATH: src/routes/errors/404.tsx
// 404 Not Found page — used as notFoundComponent in the router.

import { createFileRoute, Link } from '@tanstack/react-router'
import { FileQuestion } from 'lucide-react'

import { Button } from '@/shared/ui/shadcn/button'

export const Route = createFileRoute('/errors/404')({
  component: NotFoundPage,
})

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in space-y-6 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-muted p-6">
            <FileQuestion className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-5xl font-bold">404</h1>
          <h2 className="text-xl font-semibold">Trang không tồn tại</h2>
          <p className="text-muted-foreground">
            Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
          </p>
        </div>
        <Button asChild>
          <Link to="/dashboard">Về trang chủ</Link>
        </Button>
      </div>
    </div>
  )
}
