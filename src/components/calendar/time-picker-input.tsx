"use client"

import { Input } from "@/components/ui/input"

interface TimePickerInputProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function TimePickerInput({ value, onChange, disabled = false }: TimePickerInputProps) {
  return (
    <Input
      type="time"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-[100px]"
      disabled={disabled}
    />
  )
}

