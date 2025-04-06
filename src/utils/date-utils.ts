import { format, formatRelative } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const formatDate = (date: Date | string, formatStr: string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return format(dateObj, formatStr, { locale: ptBR })
}

export const formatRelativeDate = (
  date: Date | string,
  baseDate: Date = new Date(),
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return formatRelative(dateObj, baseDate, { locale: ptBR })
}

export const getMonthName = (month: number): string => {
  const date = new Date()
  date.setMonth(month)
  return format(date, 'MMMM', { locale: ptBR })
}

export const getDayName = (day: number): string => {
  const date = new Date()
  date.setDate(day)
  return format(date, 'EEEE', { locale: ptBR })
}
