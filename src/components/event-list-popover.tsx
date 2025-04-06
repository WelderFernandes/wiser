"use client"

import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Clock, User } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CalendarEvent } from "../../types/calendar"

interface EventListPopoverProps {
  date: Date
  events: CalendarEvent[]
  isOpen: boolean
  onClose: () => void
  onEventClick: (event: CalendarEvent) => void
}

export function EventListPopover({ date, events, isOpen, onClose, onEventClick }: EventListPopoverProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Eventos para {format(date, "d 'de' MMMM", { locale: ptBR })}</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto space-y-1 py-4">
          {events.map((event) => (
            <div
              key={event.id}
              className={`p-2 rounded cursor-pointer mb-2 ${
                event.type === "event"
                  ? "bg-blue-100 text-blue-800"
                  : event.type === "reminder"
                    ? "bg-purple-100 text-purple-800"
                    : "bg-green-100 text-green-800"
              }`}
              onClick={() => {
                onEventClick(event)
                onClose()
              }}
            >
              <div className="font-medium">{event.title}</div>
              <div className="flex items-center gap-2 mt-1 text-sm">
                <Clock className="h-3 w-3" />
                <span>
                  {format(new Date(event.start), "HH:mm")} - {format(new Date(event.end), "HH:mm")}
                </span>
              </div>
              {event.patient && (
                <div className="flex items-center gap-2 mt-1 text-sm">
                  <User className="h-3 w-3" />
                  <span>{event.patient.name}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

