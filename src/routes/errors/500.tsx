// PATH: src/routes/errors/500.tsx
// 500 Server Error page — used as global error fallback.

import { createFileRoute } from '@tanstack/react-router'
import { ServerCrash } from 'lucide-react'

import { Button } from '@/shared/ui/shadcn/button'

export const Route = createFileRoute('/errors/500')({
  component: ServerErrorPage,
})

function ServerErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in space-y-6 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-6">
            <ServerCrash className="h-12 w-12 text-destructive" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-5xl font-bold">500</h1>
          <h2 className="text-xl font-semibold">Lỗi máy chủ</h2>
          <p className="text-muted-foreground">Máy chủ gặp sự cố. Vui lòng thử lại sau.</p>
        </div>
        <div className="flex justify-center gap-3">
          <Button onClick={() => window.location.reload()}>Tải lại trang</Button>
          <Button variant="outline" onClick={() => window.location.replace('/')}>
            Về trang chủ
          </Button>
        </div>
      </div>
    </div>
  )
}
