"use client"

import type React from "react"

import { useState } from "react"
import { X, Clock, Users, ChevronRight, Trash2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import EditMeetingModal from "./edit-meeting-modal"
import { motion } from "framer-motion"
import { Meeting } from "@/lib/types"

interface MeetingDetailsProps {
  meeting: Meeting
  onClose: () => void
  onDelete: (meetingId: string) => void
  onUpdate: (meeting: Meeting) => void
}

export default function MeetingDetails({ meeting, onClose, onDelete, onUpdate }: MeetingDetailsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)
  const [showEditModal, setShowEditModal] = useState<boolean>(false)

  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("pt-BR", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
  }

  // Get week number
  const getWeekNumber = (date: Date): number => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
  }

  // Get initials from name
  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  // Format time range
  const formatTimeRange = (start: Date, end: Date): string => {
    const formatTime = (date: Date): string => {
      return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    }
    return `${formatTime(start)} - ${formatTime(end)}`
  }

  const handleDelete = (): void => {
    onDelete(meeting.id)
    setShowDeleteDialog(false)
  }

  // Obter estilo para o evento com base na cor personalizada
  const getMeetingStyle = (): React.CSSProperties => {
    if (!meeting.color) return {}

    return {
      backgroundColor: `${meeting.color}20`, // 20 é a opacidade em hex (12.5%)
      borderLeftColor: meeting.color,
      borderLeftWidth: "4px",
    }
  }

  // Calcular duração da reunião em horas e minutos
  const getMeetingDuration = (): string => {
    const durationMs = meeting.endTime.getTime() - meeting.startTime.getTime()
    const durationMinutes = Math.floor(durationMs / (1000 * 60))

    const hours = Math.floor(durationMinutes / 60)
    const minutes = durationMinutes % 60

    if (hours === 0) {
      return `${minutes} min`
    } else if (minutes === 0) {
      return `${hours} ${hours === 1 ? "hora" : "horas"}`
    } else {
      return `${hours} ${hours === 1 ? "hora" : "horas"} ${minutes} min`
    }
  }

  return (
    <>
      <div className="border-l border-border bg-background flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-border flex justify-between items-start">
          <div>
            <h2 className="text-lg font-semibold">{meeting.title}</h2>
            <p className="text-sm text-muted-foreground">
              {formatDate(meeting.startTime)} · Semana {getWeekNumber(meeting.startTime)}
            </p>
            <div className="mt-1 text-sm">{formatTimeRange(meeting.startTime, meeting.endTime)}</div>
            <div className="mt-1 text-xs text-muted-foreground">Duração: {getMeetingDuration()}</div>
          </div>
          <div className="flex space-x-1">
            <Button variant="ghost" size="icon" onClick={() => setShowEditModal(true)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setShowDeleteDialog(true)}>
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 space-y-6">
          {/* Propose new time */}
          <div className="flex items-center justify-between">
            <span className="text-sm">Propor novo horário</span>
            <Button variant="ghost" size="sm" className="h-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Attendees */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium mb-2">Participantes ({meeting.attendees.length})</h3>
            {meeting.attendees.map((attendee, index) => (
              <motion.div
                key={attendee.id}
                className="flex items-center gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <Avatar>
                  <AvatarImage src={attendee.avatar} alt={attendee.name} />
                  <AvatarFallback>{getInitials(attendee.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{attendee.name}</div>
                  <div className="text-xs text-muted-foreground">{attendee.email}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Join button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button className="w-full border-l-4" style={getMeetingStyle()}>
              Entrar na reunião de{" "}
              {meeting.meetingType === "google" ? "Google Meet" : meeting.meetingType === "zoom" ? "Zoom" : "Teams"}
            </Button>
          </motion.div>

          {/* Meeting details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Lembrete: 30min antes</span>
            </div>

            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{meeting.attendees.length} pessoas • 1 sim</span>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Notas do Organizador</h3>
            <p className="text-sm">{meeting.description}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex justify-between">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="outline">Sim</Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="outline">Não</Button>
          </motion.div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>Isso excluirá permanentemente a reunião "{meeting.title}".</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Meeting Modal */}
      {showEditModal && (
        <EditMeetingModal meeting={meeting} onClose={() => setShowEditModal(false)} onSave={onUpdate} />
      )}
    </>
  )
}

