// PATH: src/features/demo-component/schemas/demo-component.schema.ts
// Zod Schema cho biểu mẫu demo văn bản và các trường demo component.

import { z } from 'zod'

export const demoComponentSchema = z.object({
  cqBanHanh: z.union([z.string(), z.array(z.string())]).optional(),
  soVanBan: z.string().min(1, 'Vui lòng nhập số văn bản'),
  loaiVanBan: z.union([z.string(), z.array(z.string())]).optional(),
  soDen: z.string().min(1, 'Vui lòng nhập số đến'),
  ngayVanBan: z.any().optional(),
  ngayDen: z.any().optional(),
  soKyHieu: z.string().min(1, 'Vui lòng nhập số ký hiệu'),
  hanXuLy: z.any().optional(),
  trichYeu: z.string().min(1, 'Vui lòng nhập trích yếu'),
  fileDinhKem: z.array(z.any()).optional(),
})

export type DemoComponentValues = z.infer<typeof demoComponentSchema>