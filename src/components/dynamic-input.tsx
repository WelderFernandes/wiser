import type React from 'react'
import { type InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { LucideIcon } from 'lucide-react'

export interface SelectOption {
  value: string
  label: string
}

export interface DynamicInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  type?: string | 'select'
  label?: string
  icon?: LucideIcon
  iconPosition?: 'start' | 'end'
  error?: string
  containerClassName?: string
  labelClassName?: string
  inputClassName?: string
  errorClassName?: string
  options?: SelectOption[]
  onValueChange?: (value: string) => void
}

const DynamicInput = forwardRef<
  HTMLInputElement | HTMLSelectElement,
  DynamicInputProps
>(
  (
    {
      label,
      type = 'text',
      icon: Icon,
      iconPosition = 'start',
      error,
      containerClassName,
      labelClassName,
      inputClassName,
      errorClassName,
      className,
      options = [],
      value,
      onChange,
      onValueChange,
      ...props
    },
    ref,
  ) => {
    const inputClasses = cn(
      'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      Icon && iconPosition === 'start' && 'pl-10',
      Icon && iconPosition === 'end' && 'pr-10',
      error && 'border-destructive focus-visible:ring-destructive',
      inputClassName,
      className,
    )

    const iconComponent = Icon && (
      <div
        className={cn(
          'absolute inset-y-0 flex items-center pointer-events-none',
          iconPosition === 'start' ? 'left-3' : 'right-3',
        )}
      >
        <Icon className="w-5 h-5 text-muted-foreground" />
      </div>
    )

    return (
      <div className={cn('space-y-2', containerClassName)}>
        {label && (
          <Label
            htmlFor={props.id}
            className={cn(
              'text-sm font-medium',
              error && 'text-destructive',
              labelClassName,
            )}
          >
            {label}
          </Label>
        )}

        <div className="relative">
          {type === 'select' ? (
            <Select
              defaultValue={value as string}
              onValueChange={onValueChange}
            >
              <SelectTrigger id={props.id} className={inputClasses}>
                {iconComponent}
                <SelectValue placeholder={props.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <>
              <Input
                ref={ref as React.Ref<HTMLInputElement>}
                type={type}
                className={inputClasses}
                value={value}
                onChange={onChange}
                aria-invalid={!!error}
                {...props}
              />
              {iconComponent}
            </>
          )}
        </div>

        {error && (
          <p
            className={cn(
              'text-sm font-medium text-destructive',
              errorClassName,
            )}
          >
            {error}
          </p>
        )}
      </div>
    )
  },
)

DynamicInput.displayName = 'DynamicInput'

export { DynamicInput }
