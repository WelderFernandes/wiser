import { Badge } from "@/components/ui/badge"
import { CalendarDays } from "lucide-react"
import type { Holiday } from "./holiday-service"

interface HolidayBadgeProps {
  holiday: Holiday
}

export function HolidayBadge({ holiday }: HolidayBadgeProps) {
  return (
    <Badge
      className="bg-orange-500/20 text-orange-700 border border-orange-300 flex items-center gap-1 px-2 py-0.5"
      variant="outline"
    >
      <CalendarDays className="h-3 w-3" />
      <span className="text-[10px]">{holiday.name}</span>
    </Badge>
  )
}

