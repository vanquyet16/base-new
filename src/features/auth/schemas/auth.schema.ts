// PATH: src/features/auth/schemas/auth.schema.ts
// Zod validation schemas for auth forms.
// Infers TypeScript types from schemas — single source of truth for form shapes.

import { z } from 'zod'

// ─── Login ────────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Email là bắt buộc')
        .email('Email không hợp lệ'),
    password: z
        .string()
        .min(1, 'Mật khẩu là bắt buộc')
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    rememberMe: z.boolean().optional(),
})

/** TypeScript type inferred from loginSchema — use as React Hook Form generic */
export type LoginFormValues = z.infer<typeof loginSchema>

// ─── Register ─────────────────────────────────────────────────────────────────

export const registerSchema = z
    .object({
        email: z
            .string()
            .min(1, 'Email là bắt buộc')
            .email('Email không hợp lệ'),
        firstName: z.string().min(1, 'Họ là bắt buộc').max(50, 'Họ tối đa 50 ký tự'),
        lastName: z.string().min(1, 'Tên là bắt buộc').max(50, 'Tên tối đa 50 ký tự'),
        password: z
            .string()
            .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
            .regex(/[A-Z]/, 'Mật khẩu phải chứa ít nhất 1 chữ hoa')
            .regex(/[0-9]/, 'Mật khẩu phải chứa ít nhất 1 chữ số'),
        confirmPassword: z.string().min(1, 'Xác nhận mật khẩu là bắt buộc'),
    })
    // Cross-field validation: confirmPassword must match password
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Mật khẩu xác nhận không khớp',
        path: ['confirmPassword'],
    })

export type RegisterFormValues = z.infer<typeof registerSchema>
