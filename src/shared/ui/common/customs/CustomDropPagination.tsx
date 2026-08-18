import React from 'react'
import { AsyncPaginate, type AsyncPaginateProps } from 'react-select-async-paginate'
import { cn } from '@/shared/lib/utils'
import { ChevronDown, X } from 'lucide-react'
import {
  type GroupBase,
  type SelectComponentsConfig,
  components,
  type ValueContainerProps,
  type ControlProps,
  type ClearIndicatorProps,
  type InputProps,
  type OnChangeValue,
  type ActionMeta,
  type PropsValue,
  type OptionsOrGroups,
} from 'react-select'

export interface SelectOption {
  value: string | number
  label: string
  [key: string]: unknown
}

export interface CustomDropPaginationProps<
  Option = SelectOption,
  Group extends GroupBase<Option> = GroupBase<Option>,
  Additional = unknown,
  IsMulti extends boolean = false,
> extends Omit<AsyncPaginateProps<Option, Group, Additional, IsMulti>, 'loadOptions'> {
  options?: Option[]
  loadOptions?: AsyncPaginateProps<Option, Group, Additional, IsMulti>['loadOptions']
  maxTags?: number
  className?: string
  placeholder?: string
  error?: boolean
  valueType?: 'object' | 'primitive'
  formatPrimitiveLabel?: (value: unknown) => string
  onValueChange?: (value: unknown) => void
  labelKey?: string
  valueKey?: string
}

// ─── Các Component Tĩnh (Khai báo bên ngoài — Không bao giờ bị khởi tạo lại) ────

const DropdownIndicator = () => (
  <div className="flex h-full items-center pr-2 opacity-50">
    <ChevronDown className="h-4 w-4" />
  </div>
)

const IndicatorSeparator = () => null

const CustomValueContainer = <
  Option = SelectOption,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>({
  children,
  ...props
}: ValueContainerProps<Option, IsMulti, Group>) => {
  const selectProps = props.selectProps as { maxTags?: number; isMulti?: boolean }
  const maxTags = selectProps.maxTags
  const isMulti = selectProps.isMulti
  const selected = props.getValue()

  if (!isMulti || !maxTags || selected.length <= maxTags) {
    return <components.ValueContainer {...props}>{children}</components.ValueContainer>
  }

  if (!Array.isArray(children)) {
    return <components.ValueContainer {...props}>{children}</components.ValueContainer>
  }

  const [values, input] = children as [React.ReactNode[], React.ReactNode]
  const displayValues = values.slice(0, maxTags)
  const remainingCount = selected.length - maxTags

  return (
    <components.ValueContainer {...props}>
      {displayValues}
      <div className="ml-1 flex shrink-0 select-none items-center justify-center whitespace-nowrap rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
        +{remainingCount}...
      </div>
      {input}
    </components.ValueContainer>
  )
}

// ─── Component Chính ───────────────────────────────────────────────────────────

const CustomDropPagination = <
  Option = SelectOption,
  Group extends GroupBase<Option> = GroupBase<Option>,
  Additional = unknown,
  IsMulti extends boolean = false,
>(
  props: CustomDropPaginationProps<Option, Group, Additional, IsMulti>,
) => {
  const {
    options: staticOptions,
    loadOptions: providedLoadOptions,
    maxTags,
    className,
    placeholder = 'Chọn...',
    error,
    valueType = 'primitive',
    formatPrimitiveLabel,
    value,
    onChange,
    onValueChange,
    isMulti,
    labelKey = 'label',
    valueKey = 'value',
    debounceTimeout = 400,
    components: externalComponents,
    ...rest
  } = props

  // ── Khóa Ref cho formatPrimitiveLabel để cản memo tạo thêm phiên bản mới ─────
  const formatPrimitiveLabelRef = React.useRef(formatPrimitiveLabel)
  React.useLayoutEffect(() => {
    formatPrimitiveLabelRef.current = formatPrimitiveLabel
  })
  const stableFormatLabel = React.useCallback(
    (v: unknown) => (formatPrimitiveLabelRef.current ? formatPrimitiveLabelRef.current(v) : String(v)),
    [],
  )

  // ── Khóa Ref cho onChange / onValueChange ─────────
  const onChangeRef = React.useRef(onChange)
  const onValueChangeRef = React.useRef(onValueChange)
  React.useLayoutEffect(() => {
    onChangeRef.current = onChange
    onValueChangeRef.current = onValueChange
  })

  // ── State (Trạng thái nội bộ) ───────────────────────────────────────────────
  const [isFocused, setIsFocused] = React.useState(false)
  const [menuIsOpen, setMenuIsOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')

  const containerRef = React.useRef<HTMLDivElement>(null)
  const selectRef = React.useRef<HTMLInputElement | null>(null)
  const menuIsOpenRef = React.useRef(false)

  const getInput = React.useCallback(
    () => containerRef.current?.querySelector<HTMLInputElement>('input'),
    [],
  )

  // ── Các hàm phụ trợ Menu ────────────────────────────────────────────────────
  const openMenu = React.useCallback(() => {
    menuIsOpenRef.current = true
    setMenuIsOpen(true)
    getInput()?.focus()
  }, [getInput])

  const closeMenu = React.useCallback(() => {
    menuIsOpenRef.current = false
    setMenuIsOpen(false)
    setIsFocused(false)
    setTimeout(() => getInput()?.blur(), 0)
  }, [getInput])

  const toggleMenu = React.useCallback(() => {
    if (menuIsOpenRef.current) closeMenu()
    else openMenu()
  }, [openMenu, closeMenu])

  // ── Xử lý Click ra ngoài (Cho Multi-select) ─────────────────────────────────
  React.useEffect(() => {
    if (!isMulti) return
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      const isInsideContainer = containerRef.current?.contains(target)
      const isInsidePortal = document.querySelector('.custom-select-portal')?.contains(target)
      if (!isInsideContainer && !isInsidePortal) closeMenu()
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMulti, closeMenu])

  // ── Xử lý Click ra ngoài (Cho Single-select) ────────────────────────────────
  React.useEffect(() => {
    if (isMulti) return
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      const isInsideContainer = containerRef.current?.contains(target)
      const isInsidePortal = document.querySelector('.custom-select-portal')?.contains(target)
      if (!isInsideContainer && !isInsidePortal) {
        setIsFocused(false)
        setInputValue('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMulti])

  // ── Xử lý mất tiêu điểm (Blur) ─────────────────────────────────────────────
  const handleBlur = React.useCallback(() => {
    setTimeout(() => {
      if (!containerRef.current?.contains(document.activeElement)) {
        setIsFocused(false)
        if (isMulti) {
          menuIsOpenRef.current = false
          setMenuIsOpen(false)
        }
      }
    }, 50)
  }, [isMulti])

  // ── Gọi dữ liệu (loadOptions) ───────────────────────────────────────────────
  const providedLoadOptionsRef = React.useRef(providedLoadOptions)
  const staticOptionsRef = React.useRef(staticOptions)
  React.useLayoutEffect(() => {
    providedLoadOptionsRef.current = providedLoadOptions
    staticOptionsRef.current = staticOptions
  })

  const internalLoadOptions = React.useCallback(
    async (search: string, prevOptions: OptionsOrGroups<Option, Group>, additional?: Additional) => {
      if (providedLoadOptionsRef.current)
        return providedLoadOptionsRef.current(search, prevOptions, additional)
      if (staticOptionsRef.current) {
        const filtered = (staticOptionsRef.current as Array<Record<string, unknown>>).filter((o) => {
          const label = o[labelKey] || o.label
          return String(label ?? '').toLowerCase().includes(search.toLowerCase())
        })
        return { options: filtered as unknown as Option[], hasMore: false }
      }
      return { options: [], hasMore: false }
    },
    [labelKey],
  )

  // ── Giá trị dẫn xuất (Derived value) ────────────────────────────────────────
  const internalValue = React.useMemo(() => {
    if (valueType === 'object' || !value) return value
    if (isMulti && Array.isArray(value)) {
      return value.map((v) =>
        typeof v === 'object' ? v : { [valueKey]: v, [labelKey]: stableFormatLabel(v) },
      )
    }
    if (!isMulti && typeof value !== 'object') {
      return { [valueKey]: value, [labelKey]: stableFormatLabel(value) }
    }
    return value
  }, [value, valueType, isMulti, stableFormatLabel, valueKey, labelKey])

  // ── Lắng nghe sự kiện (onChange) ────────────────────────────────────────────
  const handleOnChange = React.useCallback(
    (newValue: OnChangeValue<Option, IsMulti>, actionMeta: ActionMeta<Option>) => {
      let finalValue: unknown = newValue
      if (valueType === 'primitive') {
        if (isMulti) {
          finalValue = Array.isArray(newValue)
            ? (newValue as Array<Record<string, unknown>>).map((opt) => opt[valueKey])
            : []
        } else {
          finalValue = (newValue as Record<string, unknown> | null)?.[valueKey]
        }
      }
      onChangeRef.current?.(finalValue as OnChangeValue<Option, IsMulti>, actionMeta)
      onValueChangeRef.current?.(finalValue)

      if (!isMulti) setInputValue('')

      setTimeout(() => selectRef.current?.focus(), 10)
    },
    [valueType, isMulti, valueKey],
  )

  // ── Control giao diện (MultiControl) ────────────────────────────────────────
  const MultiControl = React.useCallback(
    (controlProps: ControlProps<Option, IsMulti, Group>) => (
      <components.Control
        {...controlProps}
        innerProps={{
          ...controlProps.innerProps,
          onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => {
            const target = e.target as HTMLElement
            const isRemoveBtn =
              target.closest('[role="button"]') !== null &&
              target.closest('[role="button"]') !== target.closest('.react-select__control')
            if (isRemoveBtn) {
              controlProps.innerProps.onMouseDown?.(e)
              return
            }
            e.preventDefault()
            e.stopPropagation()
            toggleMenu()
          },
        }}
      />
    ),
    [toggleMenu],
  )

  // ── Thành phần Xóa thẻ (ClearIndicator) ─────────────────────────────────────
  const ClearIndicator = React.useCallback((clearProps: ClearIndicatorProps<Option, IsMulti, Group>) => {
    const {
      innerProps: { ref, ...restInnerProps },
    } = clearProps
    return (
      <div
        {...restInnerProps}
        ref={ref}
        className="flex h-full cursor-pointer items-center p-1 opacity-50 hover:text-destructive hover:opacity-100"
      >
        <X className="h-3 w-3" />
      </div>
    )
  }, [])

  const InputComponent = React.useCallback(
    (inputProps: InputProps<Option, IsMulti, Group>) => (
      <components.Input
        {...inputProps}
        className="m-0 p-0 text-foreground"
        inputClassName="focus:ring-0 focus:ring-offset-0 border-none outline-none bg-transparent m-0 p-0"
      />
    ),
    [],
  )

  // ── Gộp chung Components ──────────────────────────────────────────────────
  const customComponents: SelectComponentsConfig<Option, IsMulti, Group> = React.useMemo(
    () => ({
      ...(isMulti ? { Control: MultiControl } : {}),
      ValueContainer: CustomValueContainer as unknown as typeof components.ValueContainer,
      DropdownIndicator,
      ClearIndicator,
      Input: InputComponent,
      IndicatorSeparator,
      ...externalComponents,
    }),
    [isMulti, MultiControl, ClearIndicator, InputComponent, externalComponents],
  )

  // ── classNames — Object bền vững qua useMemo ────────────────────────────────
  const classNames = React.useMemo(
    () => ({
      container: () => 'w-full',
      control: ({ isDisabled }: { isDisabled: boolean }) =>
        cn(
          'flex min-h-10 w-full rounded-md border border-input bg-card px-3 text-sm transition-all shadow-sm cursor-pointer',
          isFocused && 'focus-ring-input',
          isDisabled && 'cursor-not-allowed opacity-50',
          error && 'border-destructive',
          className,
        ),
      placeholder: () => 'text-muted-foreground select-none truncate',
      valueContainer: () =>
        isMulti
          ? 'flex items-center flex-1 gap-1 h-full overflow-x-auto overflow-y-hidden py-1.5 px-0 [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:display-none'
          : 'grid items-center flex-1 h-full py-1.5 px-0',
      singleValue: () =>
        isMulti
          ? 'text-foreground truncate'
          : 'text-foreground truncate col-start-1 col-end-3 row-start-1 row-end-2',
      input: () =>
        isMulti
          ? 'text-foreground caret-primary'
          : 'text-foreground caret-primary col-start-1 col-end-3 row-start-1 row-end-2',
      multiValue: () =>
        'bg-primary/5 text-primary border border-primary/10 rounded-md px-1.5 py-0.5 mr-1 flex items-center shrink-0 transition-all hover:bg-primary/10',
      multiValueLabel: () => 'text-[11px] font-semibold px-1 truncate max-w-[150px]',
      multiValueRemove: () =>
        'text-primary/40 hover:text-primary hover:bg-transparent rounded-sm ml-0.5 transition-colors',
      menuPortal: () => 'custom-select-portal z-50',
      menu: () =>
        'z-50 mt-2 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95',
      menuList: () => 'p-1',
      option: ({ isFocused: isOptFocused, isSelected }: { isFocused: boolean; isSelected: boolean }) =>
        cn(
          'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none transition-colors',
          isOptFocused && 'bg-accent text-accent-foreground',
          isSelected && 'bg-primary text-primary-foreground font-medium',
        ),
      noOptionsMessage: () => 'py-6 text-center text-sm text-muted-foreground',
      loadingMessage: () => 'py-6 text-center text-sm text-muted-foreground',
    }),
    [isFocused, error, className, isMulti],
  )

  // ── Thuộc tính dành riêng cho Multi-Select ──────────────────────────────────
  const multiProps = React.useMemo(
    () =>
      isMulti
        ? {
            menuIsOpen,
            onMenuOpen: () => {
              menuIsOpenRef.current = true
              setMenuIsOpen(true)
            },
            onMenuClose: () => {
              menuIsOpenRef.current = false
              setMenuIsOpen(false)
            },
            closeMenuOnSelect: false,
            blurInputOnSelect: false,
          }
        : {
            inputValue,
            onInputChange: (newVal: string, { action }: { action: string }) => {
              if (action === 'input-change') setInputValue(newVal)
            },
            closeMenuOnSelect: false,
            blurInputOnSelect: false,
          },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isMulti, isMulti ? menuIsOpen : inputValue],
  )

  // ── Bắt đầu Render Template ─────────────────────────────────────────────────
  return (
    <div ref={containerRef} className="relative w-full">
      <AsyncPaginate
        {...rest}
        selectRef={selectRef as unknown as React.Ref<never>}
        loadOptions={internalLoadOptions as unknown as AsyncPaginateProps<Option, Group, Additional, IsMulti>['loadOptions']}
        getOptionLabel={(option: Option) =>
          ((option as Record<string, unknown>)[labelKey] as string) ||
          ((option as { label?: string }).label ?? '')
        }
        getOptionValue={(option: Option) =>
          String(
            (option as Record<string, unknown>)[valueKey] ||
            (option as { value?: unknown }).value ||
            '',
          )
        }
        isMulti={isMulti}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
        {...multiProps}
        {...(maxTags !== undefined ? { maxTags } : {})}
        value={internalValue as PropsValue<Option>}
        onChange={handleOnChange as unknown as (newValue: unknown, actionMeta: unknown) => void}
        components={customComponents}
        placeholder={placeholder}
        tabSelectsValue={false}
        debounceTimeout={debounceTimeout}
        unstyled
        classNames={classNames}
      />
    </div>
  )
}

export default React.memo(CustomDropPagination) as typeof CustomDropPagination
