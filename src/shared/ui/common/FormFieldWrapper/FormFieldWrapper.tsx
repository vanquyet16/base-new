import type * as React from 'react'
import { cloneElement, isValidElement } from 'react'
import {
  type Control,
  type FieldPath,
  type FieldValues,
  type ControllerRenderProps,
} from 'react-hook-form'

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/shadcn/form'

export interface FormFieldWrapperProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>
  name: TName
  label?: React.ReactNode
  /** Hiển thị dấu * màu đỏ sau label để đánh dấu trường bắt buộc */
  required?: boolean
  className?: string
  rightCustomElement?: React.ReactNode
  children?:
    | React.ReactElement
    | ((field: ControllerRenderProps<TFieldValues, TName>) => React.ReactNode)
}

/**
 * FormFieldWrapper — Wrapper chuẩn cho form field.
 * Tự động thêm dấu * bắt buộc khi truyền prop `required={true}`.
 * Có thể truyền `children` là React Element (sẽ được clone với field props),
 * hoặc render function `(field) => <.../>` cho trường hợp phức tạp hơn.
 */
export function FormFieldWrapper<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  required,
  className,
  rightCustomElement,
  children,
}: FormFieldWrapperProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <div className="flex items-center justify-between">
            {label && (
              <FormLabel>
                {label}
                {/* Hiển thị dấu * bắt buộc nếu required=true */}
                {required && <span className="ml-0.5 text-destructive">*</span>}
              </FormLabel>
            )}
            {rightCustomElement && rightCustomElement}
          </div>
          <FormControl>
            {typeof children === 'function'
              ? children(field)
              : isValidElement(children)
                ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  cloneElement(children, field as any)
                : children}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
