// PATH: src/features/demo-component/schemas/demo-component.schema.ts
// Zod Schema cho biểu mẫu demo văn bản và các trường demo component.

import { z } from 'zod'

export const demoComponentSchema = z.object({
  cqBanHanh: z
    .union([
      z.string().min(1, 'Vui lòng chọn cơ quan ban hành'),
      z.array(z.string()).min(1, 'Vui lòng chọn ít nhất 1 cơ quan ban hành'),
    ]),
  soVanBan: z.string().min(1, 'Vui lòng nhập số văn bản'),
  loaiVanBan: z.string().min(1, 'Vui lòng chọn loại văn bản'),
  soDen: z.string().min(1, 'Vui lòng nhập số đến'),
  ngayVanBan: z.union([
    z.date(),
    z.string().min(1, 'Vui lòng chọn ngày văn bản'),
  ]),
  ngayDen: z.union([
    z.date(),
    z.string().min(1, 'Vui lòng chọn ngày đến'),
  ]),
  soKyHieu: z.string().min(1, 'Vui lòng nhập số ký hiệu'),
  hanXuLy: z.union([z.date(), z.string()]).optional(),
  trichYeu: z.string().min(1, 'Vui lòng nhập trích yếu'),
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