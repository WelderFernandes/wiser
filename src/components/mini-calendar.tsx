"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
} from "date-fns"
import { ptBR } from "date-fns/locale"
import { Holiday } from "../../types/calendar"

interface MiniCalendarProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
  holidays?: Holiday[]
}

export function MiniCalendar({ selectedDate, onDateChange, holidays = [] }: MiniCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Dias da semana em português
  const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"]

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

  // Verificar se um dia é feriado
  const isHoliday = (date: Date) => {
    const formattedDate = format(date, "yyyy-MM-dd")
    return holidays.some((holiday) => holiday.date === formattedDate)
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">{format(currentMonth, "MMMM yyyy", { locale: ptBR })}</span>
        <div className="flex items-center space-x-1">
          <button onClick={prevMonth} className="p-1 rounded-md hover:bg-gray-100" aria-label="Mês anterior">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={nextMonth} className="p-1 rounded-md hover:bg-gray-100" aria-label="Próximo mês">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-xs text-center">
        {weekDays.map((day, i) => (
          <div key={i} className="py-1 font-medium">
            {day}
          </div>
        ))}

        {Array.from({ length: monthStart.getDay() }).map((_, i) => (
          <div key={`empty-start-${i}`} className="py-1" />
        ))}

        {days.map((day) => {
          const isSelected = isSameDay(day, selectedDate)
          const isCurrentMonth = isSameMonth(day, currentMonth)
          const holiday = isHoliday(day)

          return (
            <button
              key={day.toString()}
              onClick={() => onDateChange(day)}
              className={cn(
                "h-7 w-7 rounded-full flex items-center justify-center text-xs",
                isCurrentMonth ? "text-muted-foreground" : "text-primary",
                isSelected && "bg-primary text-white",
                holiday && !isSelected && "text-red-500",
                !isSelected && "hover:bg-gray-100",
              )}
            >
              {format(day, "d")}
            </button>
          )
        })}
      </div>
    </div>
  )
}

