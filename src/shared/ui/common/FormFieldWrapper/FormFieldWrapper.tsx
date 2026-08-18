import type * as React from 'react'
import { cloneElement, isValidElement } from 'react'
import {
  type Control,
  type FieldPath,
  type FieldValues,
  type ControllerRenderProps,
  type ControllerFieldState,
} from 'react-hook-form'

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/shadcn/form'
import { cn } from '@/shared/lib/utils'

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
    | ((
        field: ControllerRenderProps<TFieldValues, TName>,
        fieldState: ControllerFieldState,
      ) => React.ReactNode)
}

/**
 * FormFieldWrapper — Wrapper chuẩn cho form field.
 * Tự động thêm dấu * bắt buộc khi truyền prop `required={true}`.
 * Tự động kích hoạt trạng thái lỗi và hiển thị thông báo validation bên dưới.
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
      render={({ field, fieldState }) => {
        const hasError = !!fieldState.error
        const errorMessage = fieldState.error?.message

        return (
          <FormItem className={cn('space-y-1.5', className)}>
            <div className="flex items-center justify-between">
              {label && (
                <FormLabel className={cn(hasError && 'text-destructive font-medium')}>
                  {label}
                  {required && <span className="ml-0.5 text-destructive">*</span>}
                </FormLabel>
              )}
              {rightCustomElement && rightCustomElement}
            </div>
            <FormControl>
              {typeof children === 'function'
                ? children(field, fieldState)
                : isValidElement(children)
                  ? cloneElement(children, {
                      ...field,
                      error: hasError,
                      errorMessage: errorMessage,
                      className: cn(
                        hasError && 'border-destructive focus-visible:ring-destructive/30',
                        (children.props as { className?: string })?.className,
                      ),
                    } as never)
                  : children}
            </FormControl>
            {hasError && errorMessage ? (
              <p className="text-[12px] font-medium text-destructive animate-in fade-in slide-in-from-top-1">
                {errorMessage}
              </p>
            ) : (
              <FormMessage />
            )}
          </FormItem>
        )
      }}
    />
  )
}
