// PATH: src/features/auth/components/RegisterForm.tsx
// Component Register Form — sử dụng React Hook Form + Zod với kiểm tra khớp mật khẩu.
// Tuân thủ quy tắc: Không gọi API trực tiếp, delegate toàn bộ cho useRegisterForm.

import React from 'react'
import { Loader2 } from 'lucide-react'
import { Link } from '@tanstack/react-router'

import { Button } from '@/shared/ui/shadcn/button'
import { Form } from '@/shared/ui/shadcn/form'
import { FormFieldWrapper } from '@/shared/ui/common/FormFieldWrapper'
import { Input } from '@/shared/ui/shadcn/input'

import { useRegisterForm } from '../hooks/useRegisterForm'

/**
 * RegisterForm — Form đăng ký với họ tên, email, mật khẩu và xác nhận mật khẩu.
 * Validation cross-field (khớp mật khẩu) được xử lý thông qua Zod schema.
 */
export const RegisterForm = React.memo(function RegisterForm() {
  const { form, isPending, handleRegister } = useRegisterForm()

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-4" noValidate>
        {/* Họ và Tên */}
        <div className="grid grid-cols-2 gap-3">
          <FormFieldWrapper control={form.control} name="firstName" label="Họ">
            <Input placeholder="Nguyễn" disabled={isPending} />
          </FormFieldWrapper>
          <FormFieldWrapper control={form.control} name="lastName" label="Tên">
            <Input placeholder="Văn A" disabled={isPending} />
          </FormFieldWrapper>
        </div>

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
        <FormFieldWrapper control={form.control} name="password" label="Mật khẩu">
          <Input
            type="password"
            placeholder="Tối thiểu 8 ký tự, 1 hoa, 1 số"
            autoComplete="new-password"
            disabled={isPending}
          />
        </FormFieldWrapper>

        {/* Xác nhận mật khẩu */}
        <FormFieldWrapper
          control={form.control}
          name="confirmPassword"
          label="Xác nhận mật khẩu"
        >
          <Input
            type="password"
            placeholder="Nhập lại mật khẩu"
            autoComplete="new-password"
            disabled={isPending}
          />
        </FormFieldWrapper>

        {/* Submit */}
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
        </Button>

        {/* Điều hướng đăng nhập */}
        <p className="text-center text-sm text-muted-foreground">
          Đã có tài khoản?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Đăng nhập
          </Link>
        </p>
      </form>
    </Form>
  )
})

RegisterForm.displayName = 'RegisterForm'
