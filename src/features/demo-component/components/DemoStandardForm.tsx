// PATH: src/features/demo-component/components/DemoStandardForm.tsx
import React, { useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'

import { Form } from '@/shared/ui/shadcn/form'
import { FormFieldWrapper } from '@/shared/ui/common/FormFieldWrapper'
import { Input } from '@/shared/ui/shadcn/input'
import { Textarea } from '@/shared/ui/shadcn/textarea'
import { Button } from '@/shared/ui/shadcn/button'
import CustomDatePicker, { DATE_FORMATS } from '@/shared/ui/common/customs/CustomDatePicker'
import CustomDropPagination from '@/shared/ui/common/customs/CustomDropPagination'
import CustomTableUpload from '@/shared/ui/common/customs/Tables/CustomTableUpload'
import { useDemoComponentLogic } from '@/features/demo-component/hooks/useDemoComponentLogic'
import type { DemoComponentFormValues } from '@/features/demo-component/schemas/demo-component.schema'

/**
 * Interface định nghĩa Props cho component DemoStandardForm
 */
export interface DemoStandardFormProps {
  /** Instance của React Hook Form */
  form: UseFormReturn<DemoComponentFormValues>
  /** Hàm callback khi submit form */
  onSubmit: (data: DemoComponentFormValues) => void
}

/**
 * DemoStandardForm — Component hiển thị form theo bố cục 4 cột chuẩn.
 * Tích hợp FormFieldWrapper, CustomDropPagination, CustomDatePicker và CustomTableUpload.
 */
export const DemoStandardForm = React.memo(({ form, onSubmit }: DemoStandardFormProps) => {
  const [dateAsDate, setDateAsDate] = useState<Date | undefined>(new Date())
  const { loadDemoOptions } = useDemoComponentLogic()

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Hàng 1: 4 cột thông tin cơ bản */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <FormFieldWrapper control={form.control} name="cqBanHanh" label="CQ ban hành" required>
            {(field) => (
              <CustomDropPagination
                loadOptions={loadDemoOptions}
                additional={{ page: 1 }}
                valueType="primitive"
                placeholder="Chọn nhiều cơ quan (Primitive)..."
                isMulti
                isClearable
                maxTags={2}
                valueKey="id"
                labelKey="userName"
                onChange={(value) => {
                  field.onChange(value)
                }}
              />
            )}
          </FormFieldWrapper>

          <FormFieldWrapper control={form.control} name="soVanBan" label="Số văn bản" required>
            <Input placeholder="Nhập số..." />
          </FormFieldWrapper>

          <FormFieldWrapper control={form.control} name="loaiVanBan" label="Loại văn bản" required>
            <CustomDropPagination
              maxTags={2}
              options={[
                { value: 'Công văn', label: 'Công văn' },
                { value: 'Nghị quyết', label: 'Nghị quyết' },
                { value: 'Quyết định', label: 'Quyết định' },
                { value: 'Thông báo', label: 'Thông báo' },
              ]}
              formatPrimitiveLabel={(v) => String(v)}
              placeholder="Chọn loại văn bản..."
            />
          </FormFieldWrapper>

          <FormFieldWrapper control={form.control} name="soDen" label="Số đến" required>
            <Input placeholder="Nhập số đến..." />
          </FormFieldWrapper>
        </div>

        {/* Hàng 2: 4 cột ngày tháng và ký hiệu */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <FormFieldWrapper control={form.control} name="ngayVanBan" label="Ngày văn bản" required>
            {() => (
              <CustomDatePicker
                mode="single"
                value={dateAsDate}
                onChange={(v) => setDateAsDate(v as Date | undefined)}
                displayFormat={DATE_FORMATS.VN_DATE}
                outputType="date"
                placeholder="Chọn ngày..."
              />
            )}
          </FormFieldWrapper>

          <FormFieldWrapper control={form.control} name="ngayDen" label="Ngày đến" required>
            <CustomDatePicker mode="single" outputType="iso" />
          </FormFieldWrapper>

          <FormFieldWrapper control={form.control} name="soKyHieu" label="Số ký hiệu" required>
            <Input placeholder="Nhập số ký hiệu..." />
          </FormFieldWrapper>

          <FormFieldWrapper control={form.control} name="hanXuLy" label="Hạn xử lý">
            <CustomDatePicker mode="single" outputType="iso" placeholder="dd/MM/yyyy" />
          </FormFieldWrapper>
        </div>

        {/* Hàng 3: 1 cột Trích yếu (Full width) */}
        <FormFieldWrapper control={form.control} name="trichYeu" label="Trích yếu" required>
          <Textarea
            placeholder="Nhập trích yếu..."
            className="min-h-[80px] resize-none shadow-sm"
          />
        </FormFieldWrapper>

        {/* Hàng 4: Upload file đính kèm */}
        <div className="space-y-2">
          <FormFieldWrapper control={form.control} name="fileDinhKem" label="Tệp tin đính kèm">
            <CustomTableUpload />
          </FormFieldWrapper>
        </div>

        {/* Các nút hành động */}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Làm mới
          </Button>
          <Button type="submit" variant="success">
            Gửi dữ liệu
          </Button>
        </div>
      </form>
    </Form>
  )
})

DemoStandardForm.displayName = 'DemoStandardForm'
