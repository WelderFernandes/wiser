'use client'

import { useState, type ChangeEvent } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface PhoneInputProps {
  id?: string
  label?: string
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
  error?: string
}

export function PhoneInput({
  id = 'phone',
  label = 'Telefone',
  value = '',
  onChange,
  placeholder = '(00) 00000-0000',
  required = false,
  disabled = false,
  className,
  error,
}: PhoneInputProps) {
  const [inputValue, setInputValue] = useState(value)

  // Função para aplicar a máscara ao número de telefone
  const applyMask = (value: string) => {
    // Remove todos os caracteres não numéricos
    const numericValue = value.replace(/\D/g, '')

    // Limita a 11 dígitos (2 para DDD + 9 para celular)
    const limitedValue = numericValue.slice(0, 11)

    // Aplica a máscara de acordo com o comprimento
    if (limitedValue.length <= 2) {
      return limitedValue.replace(/^(\d{0,2})/, '($1')
    } else if (limitedValue.length <= 6) {
      // Para telefones fixos (início da digitação)
      return limitedValue.replace(/^(\d{2})(\d{0,4})/, '($1) $2')
    } else if (limitedValue.length <= 10) {
      // Para telefones fixos (completo)
      return limitedValue.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
    } else {
      // Para celulares (11 dígitos)
      return limitedValue.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value
    const maskedValue = applyMask(rawValue)

    setInputValue(maskedValue)

    // Passa o valor formatado para o callback onChange
    if (onChange) {
      onChange(maskedValue)
    }
  }

  // Função para remover a máscara e obter apenas os números
  const getNumericValue = () => {
    return inputValue.replace(/\D/g, '')
  }

  // Verifica se o número é válido (tem pelo menos 10 dígitos - DDD + 8 dígitos para fixo)
  const isValid = () => {
    const numericValue = getNumericValue()
    return numericValue.length >= 10
  }
  console.log('🚀 ~ isValid ~ isValid:', isValid)

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <Input
        id={id}
        type="tel"
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={cn(error && 'border-destructive')}
        aria-invalid={error ? 'true' : 'false'}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
