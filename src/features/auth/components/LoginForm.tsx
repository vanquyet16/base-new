// PATH: src/features/auth/components/LoginForm.tsx
// Component Login Form — sử dụng React Hook Form + Zod + shadcn/ui.
// Tuân thủ quy tắc: Không gọi API trực tiếp, delegate toàn bộ cho useLoginForm.

import React, { useCallback, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Link } from '@tanstack/react-router'

import { Button } from '@/shared/ui/shadcn/button'
import { Checkbox } from '@/shared/ui/shadcn/checkbox'
import { Form } from '@/shared/ui/shadcn/form'
import { FormFieldWrapper } from '@/shared/ui/common/FormFieldWrapper'
import { Input } from '@/shared/ui/shadcn/input'

import { useLoginForm } from '../hooks/useLoginForm'

/**
 * LoginForm — Form đăng nhập với email, mật khẩu và ghi nhớ đăng nhập.
 * Xử lý validation client-side qua Zod; thông báo lỗi máy chủ qua toast.
 */
export const LoginForm = React.memo(function LoginForm() {
  const { form, handleLogin, isPending } = useLoginForm()
  const [showPassword, setShowPassword] = useState(false)

  // Tối ưu tránh tạo lại hàm ẩn/hiện mật khẩu mỗi lần render
  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev)
  }, [])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4" noValidate>
        {/* Email */}
        <FormFieldWrapper control={form.control} name="email" label="Email">
          <Input
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            disabled={isPending}
          />
        </FormFieldWrapper>

        {/* Mật khẩu */}
        <FormFieldWrapper
          control={form.control}
          name="password"
          label="Mật khẩu"
          rightCustomElement={
            <Button
              type="button"
              variant="link"
              onClick={togglePassword}
              className="mt-0 h-auto p-0 text-xs font-normal text-muted-foreground transition-colors hover:text-foreground hover:no-underline"
            >
              {showPassword ? 'Ẩn' : 'Hiện'}
            </Button>
          }
        >
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="current-password"
            disabled={isPending}
          />
        </FormFieldWrapper>

        {/* Ghi nhớ đăng nhập */}
        <FormFieldWrapper
          control={form.control}
          name="rememberMe"
          className="flex flex-row-reverse items-center justify-end gap-2 space-y-0"
          label={<span className="cursor-pointer font-normal">Ghi nhớ đăng nhập</span>}
        >
          {(field) => (
            <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isPending} />
          )}
        </FormFieldWrapper>

        {/* Nút submit */}
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </Button>

        {/* Điều hướng đăng ký */}
        <p className="text-center text-sm text-muted-foreground">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </form>
    </Form>
  )
})

LoginForm.displayName = 'LoginForm'
