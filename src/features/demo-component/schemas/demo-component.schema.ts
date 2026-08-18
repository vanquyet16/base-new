// PATH: src/features/demo-component/schemas/demo-component.schema.ts
// Zod Schema cho biểu mẫu demo văn bản và các trường demo component.

import { z } from 'zod'

export const demoComponentSchema = z.object({
  cqBanHanh: z
    .union([z.string(), z.array(z.string())], {
      errorMap: () => ({ message: 'Vui lòng chọn cơ quan ban hành' }),
    })
    .refine(
      (val) => {
        if (typeof val === 'string') return val.trim().length > 0
        if (Array.isArray(val)) return val.length > 0
        return false
      },
      { message: 'Vui lòng chọn cơ quan ban hành' },
    ),
  soVanBan: z
    .string({ required_error: 'Vui lòng nhập số văn bản' })
    .min(1, 'Vui lòng nhập số văn bản'),
  loaiVanBan: z
    .string({ required_error: 'Vui lòng chọn loại văn bản' })
    .min(1, 'Vui lòng chọn loại văn bản'),
  soDen: z
    .string({ required_error: 'Vui lòng nhập số đến' })
    .min(1, 'Vui lòng nhập số đến'),
  ngayVanBan: z
    .union([z.date(), z.string()], {
      errorMap: () => ({ message: 'Vui lòng chọn ngày văn bản' }),
    })
    .refine((val) => !!val, { message: 'Vui lòng chọn ngày văn bản' }),
  ngayDen: z
    .union([z.date(), z.string()], {
      errorMap: () => ({ message: 'Vui lòng chọn ngày đến' }),
    })
    .refine((val) => !!val, { message: 'Vui lòng chọn ngày đến' }),
  soKyHieu: z
    .string({ required_error: 'Vui lòng nhập số ký hiệu' })
    .min(1, 'Vui lòng nhập số ký hiệu'),
  hanXuLy: z.union([z.date(), z.string()]).optional(),
  trichYeu: z
    .string({ required_error: 'Vui lòng nhập trích yếu' })
    .min(1, 'Vui lòng nhập trích yếu'),
  fileDinhKem: z
    .array(
      z.object({
        id: z.string(),
        fileName: z.string(),
        extension: z.string().optional(),
        size: z.number().optional(),
        url: z.string().optional(),
      }),
    )
    .optional(),
})

export type DemoComponentValues = z.infer<typeof demoComponentSchema>
export type DemoComponentFormValues = DemoComponentValues