'use client'

import * as React from 'react'
import { AlertCircle, Check, ChevronsUpDown } from 'lucide-react'
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'

interface InputWithErrorProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  id: string
  type?: 'text' | 'password' | 'number' | 'file' | 'select' | 'combobox'
  options?: { value: string; label: string }[] // Para o caso de select e combobox
  description?: string
}

export default function InputWithError({
  label,
  error,
  id,
  className,
  type = 'text',
  options = [],
  description,
  ...props
}: InputWithErrorProps) {
  // Estado para o combobox
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState((props.defaultValue as string) || '')

  // Renderiza o input apropriado com base no tipo
  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <div className="relative">
            <Select
              defaultValue={props.defaultValue as string}
              onValueChange={(value: string) => {
                if (props.onChange) {
                  const event = {
                    target: { id, value },
                  } as React.ChangeEvent<HTMLInputElement>
                  props.onChange(event)
                }
              }}
              disabled={props.disabled}
            >
              <SelectTrigger
                id={id}
                className={cn(
                  error && 'border-destructive ring-destructive',
                  className,
                )}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : undefined}
              >
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
            {error && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
            )}
          </div>
        )

      case 'combobox':
        return (
          <div className="relative">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <div
                  className={cn(
                    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    error && 'border-destructive ring-destructive',
                    className,
                  )}
                  aria-invalid={!!error}
                  aria-describedby={error ? `${id}-error` : undefined}
                >
                  <button
                    type="button"
                    id={id}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between"
                    disabled={props.disabled}
                    onClick={(e) => e.preventDefault()}
                  >
                    {value
                      ? options.find((option) => option.value === value)
                          ?.label || props.placeholder
                      : props.placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </button>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder={props.placeholder as string} />
                  <CommandList>
                    <CommandEmpty>Nenhuma opção encontrada.</CommandEmpty>
                    <CommandGroup>
                      {options.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          onSelect={(currentValue) => {
                            setValue(currentValue === value ? '' : currentValue)
                            if (props.onChange) {
                              const event = {
                                target: {
                                  id,
                                  value:
                                    currentValue === value ? '' : currentValue,
                                },
                              } as React.ChangeEvent<HTMLInputElement>
                              props.onChange(event)
                            }
                            setOpen(false)
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              value === option.value
                                ? 'opacity-100'
                                : 'opacity-0',
                            )}
                          />
                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {error && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
            )}
          </div>
        )

      default:
        return (
          <div className="relative">
            <Input
              id={id}
              type={type}
              className={cn(
                error &&
                  'border-destructive pr-10 ring-destructive animate-shake',
                className,
              )}
              aria-invalid={!!error}
              aria-describedby={error ? `${id}-error` : undefined}
              {...props}
            />
            {error && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
            )}
          </div>
        )
    }
  }
  return (
    <div className="space-y-2">
      {label && <Label htmlFor={id}>{label}</Label>}
      {renderInput()}
      {description && !error && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {error && (
        <p
          className="text-sm text-destructive mt-1"
          id={`${id}-error`}
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  )
}
