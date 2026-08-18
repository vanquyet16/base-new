/**
 * CustomDatePicker — Wrapper linh hoạt của AnimatedCalendar (calender.tsx)
 *
 * Tính năng:
 *  - Vừa nhập tay vào <input> theo displayFormat VÀ vừa chọn từ popup calendar.
 *  - Nhập tay: chỉ parse khi chuỗi chứa năm 4 chữ số đầy đủ, tránh nhảy lịch.
 *  - Chọn lịch: click icon → mở Popover, chọn xong → tự đóng + điền input.
 *  - Nhận value ở MỌI định dạng: Date, ISO string, timestamp (number).
 *  - Trả về onChange theo `outputType`.
 *  - Hỗ trợ mode: single | range | multiple
 *    (range/multiple dùng AnimatedCalendar thuần — không có input nhập tay)
 */
import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { AnimatedCalendarProps, DateRange } from '@/shared/ui/shadcn/calender'
import { AnimatedCalendar, AnimatedCalendarStandalone } from '@/shared/ui/shadcn/calender'
import { Popover, PopoverAnchor, PopoverContent } from '@/shared/ui/shadcn/popover'
import { Button } from '@/shared/ui/shadcn/button'
import { cn } from '@/shared/lib/utils'
import { AlertCircle, Calendar as CalendarIcon, X } from 'lucide-react'
import { format, isValid, parse, parseISO, startOfDay } from 'date-fns'

// ─── Các format string phổ biến ───────────────────────────────────────────────
export const DATE_FORMATS = {
  /** 25/03/2026 */
  VN_DATE: 'dd/MM/yyyy',
  /** 2026-03-25 */
  ISO_DATE: 'yyyy-MM-dd',
  /** 03/25/2026 */
  US_DATE: 'MM/dd/yyyy',
  /** 25/03/2026 15:30 */
  VN_DATETIME: 'dd/MM/yyyy HH:mm',
  /** 25/03/2026 15:30:00 */
  VN_DATETIME_SECONDS: 'dd/MM/yyyy HH:mm:ss',
  /** 2026-03-25T15:30 */
  ISO_DATETIME: "yyyy-MM-dd'T'HH:mm",
  /** 03/2026 */
  MONTH_YEAR: 'MM/yyyy',
  /** 25 tháng 03, 2026 */
  VN_LONG: 'dd MMMM, yyyy',
  /** 25 Thg3 2026 */
  VN_SHORT: 'dd MMM yyyy',
} as const

/** Kiểu output trả về qua onChange */
export type DateOutputType = 'date' | 'iso' | 'timestamp' | 'string' | 'year' | 'month'

/** Kiểu đầu vào linh hoạt cho value */
export type DateInputValue = Date | string | number | null | undefined

// ─── Hằng số module-level (tránh tạo lại mỗi lần gọi hàm) ───────────────────

/**
 * Danh sách format fallback phổ biến ở Việt Nam.
 * Cố định ở module level để tránh allocation mỗi lần parseFlexibleDate chạy.
 */
const FALLBACK_FORMATS = [
  'd/M/yyyy',
  'dd/M/yyyy',
  'd/MM/yyyy',
  'dd/MM/yyyy',
  'd-M-yyyy',
  'dd-M-yyyy',
  'd-MM-yyyy',
  'dd-MM-yyyy',
  'yyyy-MM-dd',
  'yyyy-M-d',
  'MM/dd/yyyy',
  'M/d/yyyy',
] as const

/** Class Tailwind tương ứng size input — hằng số để tránh tạo object mỗi render */
const INPUT_SIZE_CLASS: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'h-8 text-xs',
  md: 'h-10 text-sm',
  lg: 'h-12 text-base',
}

// ─── Props của CustomDatePicker ───────────────────────────────────────────────
export interface CustomDatePickerProps
  extends Omit<AnimatedCalendarProps, 'value' | 'defaultValue' | 'onChange' | 'formatStr'> {
  /**
   * Giá trị hiện tại.
   * - mode='single'   → Date | string | number | null | undefined
   * - mode='range'    → { from?: DateInputValue, to?: DateInputValue }
   * - mode='multiple' → DateInputValue[]
   */
  value?: DateInputValue | { from?: DateInputValue; to?: DateInputValue } | DateInputValue[]

  /** Giá trị mặc định (uncontrolled). */
  defaultValue?: DateInputValue | { from?: DateInputValue; to?: DateInputValue } | DateInputValue[]

  /** Callback khi người dùng chọn ngày. */
  onChange?: (
    value:
      | Date
      | string
      | number
      | undefined
      | { from: Date | string | number | undefined; to: Date | string | number | undefined }
      | (Date | string | number | undefined)[]
  ) => void

  /**
   * Format hiển thị trên input (date-fns format string).
   * Mặc định: 'dd/MM/yyyy'
   */
  displayFormat?: string

  /** Format để parse khi value là string không rõ chuẩn. */
  inputFormat?: string

  /**
   * Kiểu giá trị trả về trong onChange:
   * - 'date'      → Date object (mặc định)
   * - 'iso'       → chuỗi ISO 8601
   * - 'timestamp' → số milliseconds
   * - 'string'    → formatted string theo outputFormatStr
   * - 'year'      → số nguyên năm
   * - 'month'     → số nguyên tháng 1-12
   */
  outputType?: DateOutputType

  /**
   * Format string dùng cho output khi outputType='string'.
   * Mặc định dùng displayFormat.
   */
  outputFormatStr?: string

  /** Chế độ khởi tạo của popup calendar. */
  initialView?: 'days' | 'months' | 'years' | 'time'

  /**
   * (Chỉ áp dụng mode=single) Cho phép nhập tay vào input.
   * Mặc định: true.
   * Đặt false để dùng trigger button thuần (hành vi cũ).
   */
  typeable?: boolean
}

// ─── Helper: parse bất kỳ đầu vào → Date ────────────────────────────────────

/**
 * toDate — Chuyển đổi mọi loại input (Date, string, number) sang Date object.
 * Luôn trả về ngày tại 00:00:00 để đảm bảo tính nhất quán của bộ chọn ngày.
 */
function toDate(val: DateInputValue, inputFormat?: string): Date | undefined {
  if (val === null || val === undefined) return undefined

  let d: Date | undefined

  if (val instanceof Date) {
    d = val
  } else if (typeof val === 'number') {
    d = new Date(val)
  } else if (typeof val === 'string') {
    // 1. Thử parse theo inputFormat
    if (inputFormat) {
      try {
        const parsed = parse(val, inputFormat, new Date())
        if (isValid(parsed)) d = parsed
      } catch { /* ignore */ }
    }

    // 2. Thử ISO 8601
    if (!d) {
      try {
        const iso = parseISO(val)
        if (isValid(iso)) d = iso
      } catch { /* ignore */ }
    }

    // 3. Thử timestamp string hoặc generic Date
    if (!d) {
      const ts = Number(val)
      d = !isNaN(ts) && val.trim() !== '' ? new Date(ts) : new Date(val)
    }
  }

  // Kết quả cuối cùng: nếu hợp lệ thì đưa về đầu ngày
  return d && isValid(d) ? startOfDay(d) : undefined
}

// ─── Helper: parse linh hoạt nhiều format ────────────────────────────────────

/**
 * parseFlexibleDate — Parse chuỗi nhập tay với nhiều format dự phòng.
 */
function parseFlexibleDate(text: string, primaryFormat?: string, inputFmt?: string): Date | undefined {
  if (!text) return undefined
  const refDate = new Date()

  // Xây dựng danh sách format thử nghiệm
  const formatsToTry = new Set<string>()
  if (primaryFormat) {
    formatsToTry.add(primaryFormat)
    formatsToTry.add(primaryFormat.replace(/MM/g, 'M').replace(/dd/g, 'd'))
    formatsToTry.add(primaryFormat.replace(/\//g, '-'))
    formatsToTry.add(primaryFormat.replace(/MM/g, 'M').replace(/dd/g, 'd').replace(/\//g, '-'))
  }
  if (inputFmt) formatsToTry.add(inputFmt)
  FALLBACK_FORMATS.forEach(f => formatsToTry.add(f))

  for (const fmt of formatsToTry) {
    try {
      const d = parse(text, fmt, refDate)
      if (isValid(d) && d.getFullYear() >= 1900) {
        return startOfDay(d)
      }
    } catch { /* next */ }
  }

  // Cuối cùng thử parse ISO hoặc timestamp
  const fallback = toDate(text, inputFmt)
  return fallback && fallback.getFullYear() >= 1900 ? startOfDay(fallback) : undefined
}

/**
 * Kiểm tra chuỗi có khả năng chứa năm 4 chữ số không.
 * Ngăn parse quá sớm khi user đang xoá dần: "27/03/20" chưa xong năm → bỏ qua.
 */
function isLikelyComplete(text: string): boolean {
  return /\d{4}/.test(text)
}

// ─── Helper: chuyển Date → output format ─────────────────────────────────────

/**
 * Chuyển Date object sang kiểu output mong muốn.
 */
function fromDate(
  date: Date | undefined,
  outputType: DateOutputType,
  outputFormatStr: string,
): Date | string | number | undefined {
  if (!date || !isValid(date)) return undefined
  switch (outputType) {
    case 'date':      return date
    case 'iso':       return date.toISOString()
    case 'timestamp': return date.getTime()
    case 'string':    return format(date, outputFormatStr)
    case 'year':      return date.getFullYear()
    case 'month':     return date.getMonth() + 1 // JS getMonth() từ 0-11
    default:          return date
  }
}

// ─── Interface nội bộ của InputDatePicker ────────────────────────────────────
interface InputDatePickerProps {
  /** Giá trị Date nội bộ (đã được parse từ CustomDatePicker) */
  pickerValue: Date | undefined
  /** Callback khi giá trị thay đổi (trả ra Date hoặc undefined) */
  onPickerChange: (date: Date | undefined) => void
  displayFormat: string
  inputFormat?: string
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  error?: boolean
  errorMessage?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  id?: string
  'aria-label'?: string
  /** Các props còn lại truyền vào AnimatedCalendarStandalone */
  calendarProps: Omit<
    AnimatedCalendarProps,
    'value' | 'defaultValue' | 'onChange' | 'formatStr' | 'mode' | 'placeholder'
  >
  initialView?: 'days' | 'months' | 'years' | 'time'
}

// ─── Sub-component: InputDatePicker ──────────────────────────────────────────

/**
 * InputDatePicker — Input text có thể nhập tay kết hợp popup calendar.
 *
 * Luồng hoạt động:
 *  1. input hiển thị giá trị theo displayFormat.
 *  2. Khi gõ: parse realtime nếu isLikelyComplete → gọi onPickerChange.
 *  3. Khi focus: dừng sync từ ngoài vào (isFocused ref).
 *  4. Khi blur: normalize text hoặc reset nếu không hợp lệ.
 *  5. Khi chọn từ popup: đóng popup, onPickerChange(date).
 *  6. Khi click X: clear.
 */
const InputDatePicker = React.memo(
  ({
    pickerValue,
    onPickerChange,
    displayFormat,
    inputFormat,
    placeholder = 'Chọn ngày...',
    disabled = false,
    readOnly = false,
    required = false,
    error = false,
    errorMessage,
    className,
    size = 'md',
    id,
    'aria-label': ariaLabel,
    calendarProps,
    initialView,
  }: InputDatePickerProps) => {
    const generatedId = useId()
    const triggerId = id || generatedId
    const errorId = `${triggerId}-error`
    const inputRef = useRef<HTMLInputElement>(null)
    const [isOpen, setIsOpen] = useState(false)

    // isFocused ref dùng để chặn việc ghi đè text khi user đang gõ
    const isFocused = useRef(false)
    // skipOpenRef dùng để chặn việc mở lại popover khi trả focus về input
    const skipOpenRef = useRef(false)

    // Local state cho text trong input
    const [inputText, setInputText] = useState<string>(() =>
      pickerValue && isValid(pickerValue) ? format(pickerValue, displayFormat) : '',
    )

    // Đồng bộ từ ngoài vào khi pickerValue thay đổi (và người dùng không đang focus)
    useEffect(() => {
      if (!isFocused.current) {
        const newText = pickerValue && isValid(pickerValue) ? format(pickerValue, displayFormat) : ''
        setInputText(newText)
      }
    }, [pickerValue, displayFormat])

    const handleFocus = useCallback(() => {
      isFocused.current = true
      if (skipOpenRef.current) {
        skipOpenRef.current = false
        return
      }
      setIsOpen(true)
    }, [])

    const handleBlur = useCallback(() => {
      isFocused.current = false
      if (!inputText) return

      const parsed = parseFlexibleDate(inputText, displayFormat, inputFormat)
      if (parsed) {
        setInputText(format(parsed, displayFormat))
        onPickerChange(parsed)
      } else {
        // Reset về giá trị cũ nếu nhập sai
        setInputText(pickerValue && isValid(pickerValue) ? format(pickerValue, displayFormat) : '')
      }
    }, [inputText, displayFormat, inputFormat, pickerValue, onPickerChange])

    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value
        setInputText(text)

        if (text === '') {
          onPickerChange(undefined)
          return
        }

        if (isLikelyComplete(text)) {
          const parsed = parseFlexibleDate(text, displayFormat, inputFormat)
          if (parsed) onPickerChange(parsed)
        }
      },
      [displayFormat, inputFormat, onPickerChange],
    )

    const handleCalendarSelect = useCallback(
      (val: any) => {
        onPickerChange(val as Date | undefined)
        setIsOpen(false)
        // Lưu ý: Đánh dấu để lần focus tới không mở lại popover
        skipOpenRef.current = true
        setTimeout(() => inputRef.current?.focus(), 50)
      },
      [onPickerChange],
    )

    const handleClear = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation()
        setInputText('')
        onPickerChange(undefined)
        // Khi xóa cũng không nên mở lời ngay lập tức
        skipOpenRef.current = true
        inputRef.current?.focus()
      },
      [onPickerChange],
    )

    return (
      <div className="relative w-full">
        <Popover open={isOpen} onOpenChange={setIsOpen} modal={false}>
          <PopoverAnchor asChild>
            <div className={cn('relative flex items-center w-full group', disabled && 'opacity-50 cursor-not-allowed')}>
              <input
                ref={inputRef}
                id={triggerId}
                type="text"
                value={inputText}
                autoComplete="off"
                onChange={handleInputChange}
                onFocus={handleFocus}
                onClick={() => setIsOpen(true)}
                onBlur={handleBlur}
                placeholder={placeholder}
                disabled={disabled}
                readOnly={readOnly}
                required={required}
                aria-label={ariaLabel || placeholder}
                aria-invalid={error}
                aria-required={required}
                aria-describedby={error ? errorId : undefined}
                className={cn(
                  'flex w-full rounded-md border border-input bg-card px-3 py-1 ring-offset-background transition-colors',
                  'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  'pr-16',
                  INPUT_SIZE_CLASS[size],
                  error && 'border-destructive focus-visible:ring-destructive',
                  className,
                )}
              />

              <div className="absolute right-0 flex items-center h-full pr-1 gap-0.5">
                {inputText && !disabled && !readOnly && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={handleClear}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  disabled={disabled || readOnly}
                  onClick={() => setIsOpen(true)}
                >
                  <CalendarIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </PopoverAnchor>

          <PopoverContent
            className="p-0 border-none bg-transparent shadow-none w-auto"
            align="center"
            sideOffset={8}
            onOpenAutoFocus={(e) => e.preventDefault()}
            onInteractOutside={(e) => {
              if (e.target !== inputRef.current) setIsOpen(false)
            }}
          >
            <AnimatedCalendarStandalone
              {...(calendarProps as any)}
              mode="single"
              value={pickerValue}
              onChange={handleCalendarSelect}
              initialView={initialView}
              closeOnSelect
            />
          </PopoverContent>
        </Popover>

        {error && errorMessage && (
          <p id={errorId} className="mt-1.5 flex items-center gap-1.5 text-xs text-destructive animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="h-3.5 w-3.5" />
            {errorMessage}
          </p>
        )}
      </div>
    )
  },
)
InputDatePicker.displayName = 'InputDatePicker'

// ─── Component chính: CustomDatePicker ───────────────────────────────────────

export const CustomDatePicker = React.memo(
  React.forwardRef<HTMLButtonElement, CustomDatePickerProps>((props, ref) => {
    const {
      mode = 'single',
      value,
      defaultValue,
      onChange,
      displayFormat = DATE_FORMATS.VN_DATE,
      inputFormat,
      outputType = 'date',
      outputFormatStr,
      initialView,
      typeable = true,
      placeholder,
      disabled,
      readOnly,
      required,
      error,
      errorMessage,
      className,
      size = 'md',
      id,
      'aria-label': ariaLabel,
      ...restProps
    } = props

    const effectiveOutputFmt = outputFormatStr ?? displayFormat

    // Parse giá trị hiện tại
    const parsedValue = useMemo<any>(() => {
      if (value === null || value === undefined) return undefined
      if (mode === 'single') return toDate(value as DateInputValue, inputFormat)
      if (mode === 'range') {
        const rv = value as { from?: DateInputValue; to?: DateInputValue }
        return { from: toDate(rv?.from, inputFormat), to: toDate(rv?.to, inputFormat) }
      }
      if (mode === 'multiple') {
        return (value as DateInputValue[])
          .map((v) => toDate(v, inputFormat))
          .filter((d): d is Date => d !== undefined)
      }
      return undefined
    }, [value, mode, inputFormat])

    // Parse giá trị mặc định
    const parsedDefault = useMemo<any>(() => {
      if (defaultValue === null || defaultValue === undefined) return undefined
      if (mode === 'single') return toDate(defaultValue as DateInputValue, inputFormat)
      if (mode === 'range') {
        const rv = defaultValue as { from?: DateInputValue; to?: DateInputValue }
        return { from: toDate(rv?.from, inputFormat), to: toDate(rv?.to, inputFormat) }
      }
      if (mode === 'multiple') {
        return (defaultValue as DateInputValue[])
          .map((v) => toDate(v, inputFormat))
          .filter((d): d is Date => d !== undefined)
      }
      return undefined
    }, [defaultValue, mode, inputFormat])

    // Handler trung tâm: chuyển đổi Date -> OutputType trước khi trả về
    const handleChange = useCallback(
      (val: any) => {
        if (!onChange) return

        if (mode === 'single') {
          onChange(fromDate(val as Date | undefined, outputType, effectiveOutputFmt))
        } else if (mode === 'range') {
          const range = val as DateRange | undefined
          onChange(
            range
              ? {
                  from: fromDate(range.from, outputType, effectiveOutputFmt),
                  to: fromDate(range.to, outputType, effectiveOutputFmt),
                }
              : undefined,
          )
        } else if (mode === 'multiple') {
          const dates = (val ?? []) as Date[]
          onChange(dates.map((d) => fromDate(d, outputType, effectiveOutputFmt)))
        }
      },
      [onChange, mode, outputType, effectiveOutputFmt],
    )

    const commonProps = {
      placeholder,
      disabled,
      readOnly,
      required,
      error,
      errorMessage,
      className,
      size,
      id,
      'aria-label': ariaLabel,
    }

    // Chế độ 1: Cung cấp Input cho phép nhập tay (chỉ mode single & typeable=true)
    if (mode === 'single' && typeable) {
      return (
        <InputDatePicker
          {...commonProps}
          pickerValue={parsedValue as Date | undefined}
          onPickerChange={handleChange}
          displayFormat={displayFormat}
          inputFormat={inputFormat}
          calendarProps={{ ...restProps, size }}
          initialView={initialView}
        />
      )
    }

    // Chế độ 2: AnimatedCalendar thuần (cho Range, Multiple hoặc khi tắt nhập tay)
    return (
      <AnimatedCalendar
        ref={ref}
        {...(restProps as any)}
        {...commonProps}
        mode={mode as any}
        value={parsedValue}
        defaultValue={parsedDefault}
        onChange={handleChange}
        formatStr={displayFormat}
        initialView={initialView}
      />
    )
  }),
)

CustomDatePicker.displayName = 'CustomDatePicker'

export default CustomDatePicker
