"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarIcon, Clock, MapPin, Trash2, Edit, User } from "lucide-react"
import { CalendarEvent, Collaborator } from "../../types/calendar"

interface EventDetailsProps {
  event: CalendarEvent | null
  isOpen: boolean
  onClose: () => void
  onEdit: (event: CalendarEvent) => void
  onDelete: (eventId: string) => void
}

export function EventDetails({ event, isOpen, onClose, onEdit, onDelete }: EventDetailsProps) {
  if (!event) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{event.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-3">
            <CalendarIcon className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">
                {format(new Date(event.start), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <p>
                {format(new Date(event.start), "HH:mm", { locale: ptBR })} -{" "}
                {format(new Date(event.end), "HH:mm", { locale: ptBR })}
              </p>
              {event.notification && event.notification > 0 && (
                <p className="text-sm text-muted-foreground">Notificação: {event.notification} minutos antes</p>
              )}
            </div>
          </div>

          {event.location && (
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <p>{event.location}</p>
            </div>
          )}

          {event.patient && (
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{event.patient.name}</p>
                <p className="text-sm text-muted-foreground">{event.patient.phone || event.patient.email}</p>
              </div>
            </div>
          )}

          {event.collaborators && event.collaborators.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Colaboradores</h4>
              <div className="flex flex-wrap gap-2">
                {event.collaborators.map((collaborator: Collaborator) => (
                  <div key={collaborator.id} className="flex items-center gap-2 bg-gray-50 rounded-md p-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={collaborator.avatar} alt={collaborator.name} />
                      <AvatarFallback>
                        {collaborator.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{collaborator.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <Button
            variant="destructive"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => {
              onDelete(event.id)
              onClose()
            }}
          >
            <Trash2 className="h-4 w-4" />
            <span>Excluir</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => {
              onEdit(event)
              onClose()
            }}
          >
            <Edit className="h-4 w-4" />
            <span>Editar</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

