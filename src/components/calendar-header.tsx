"use client"

import { Button } from "@/components/ui/button"
import type { CalendarViewType } from "../../types/calendar"

interface CalendarHeaderProps {
  view: CalendarViewType
  onViewChange: (view: CalendarViewType) => void
}

export function CalendarHeader({ view, onViewChange }: CalendarHeaderProps) {
  return (
    <div className="border-b p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Calendário</h1>

        <div className="flex space-x-2 rounded-lg overflow-hidden border">
          <Button
            variant={view === "day" ? "default" : "ghost"}
            className="rounded-none"
            onClick={() => onViewChange("day")}
          >
            Dia
          </Button>
          <Button
            variant={view === "week" ? "default" : "ghost"}
            className="rounded-none"
            onClick={() => onViewChange("week")}
          >
            Semana
          </Button>
          <Button
            variant={view === "month" ? "default" : "ghost"}
            className="rounded-none"
            onClick={() => onViewChange("month")}
          >
            Mês
          </Button>
          <Button
            variant={view === "year" ? "default" : "ghost"}
            className="rounded-none"
            onClick={() => onViewChange("year")}
          >
            Ano
          </Button>
        </div>
      </div>
    </div>
  )
}

