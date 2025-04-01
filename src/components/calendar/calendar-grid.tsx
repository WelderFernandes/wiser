"use client"

import type React from "react"

import { useMemo } from "react"
import { Clock } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import { Meeting } from "@/lib/types"

interface CalendarGridProps {
  meetings: Meeting[]
  currentDate: Date
  onMeetingClick: (meeting: Meeting) => void
}

export default function CalendarGrid({ meetings, currentDate, onMeetingClick }: CalendarGridProps) {
  // Gerar dias da semana com base na data atual
  const generateDays = (
    date: Date,
  ): Array<{
    name: string
    shortName: string
    number: number
    day: number
    date: Date
    isToday: boolean
    isCurrentWeek: boolean
  }> => {
    const day = date.getDay()
    const diff = date.getDate() - day + (day === 0 ? -6 : 1) // Ajustar quando o dia é domingo

    const days = []
    for (let i = 0; i < 5; i++) {
      const currentDay = new Date(date)
      currentDay.setDate(diff + i)

      days.push({
        name: currentDay.toLocaleDateString("pt-BR", { weekday: "long" }),
        shortName: currentDay.toLocaleDateString("pt-BR", { weekday: "short" }),
        number: currentDay.getDate(),
        day: i + 1,
        date: new Date(currentDay),
        isToday: currentDay.toDateString() === new Date().toDateString(),
        isCurrentWeek: currentDay.toDateString() === date.toDateString(),
      })
    }

    return days
  }

  const days = generateDays(currentDate)

  // Gerar slots de tempo dinamicamente com base nos eventos
  const timeSlots = useMemo((): Array<{
    time: string
    label: string
    hour: number
  }> => {
    // Gerar slots para todas as 24 horas do dia
    const slots = []
    for (let hour = 0; hour < 24; hour++) {
      const time = `${hour.toString().padStart(2, "0")}:00`
      const label = new Date(2023, 0, 1, hour).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
      slots.push({ time, label, hour })
    }
    return slots
  }, [])

  // Obter reuniões para um dia e slot de tempo específicos
  const getMeetingsForTimeSlot = (dayDate: Date, time: string): Meeting[] => {
    const slotHour = Number.parseInt(time.split(":")[0])
    const slotDate = new Date(dayDate)
    slotDate.setHours(slotHour, 0, 0, 0)

    const nextSlotDate = new Date(slotDate)
    nextSlotDate.setHours(slotHour + 1, 0, 0, 0)

    return meetings.filter((meeting) => {
      const meetingStart = new Date(meeting.startTime)
      const meetingEnd = new Date(meeting.endTime)

      // Verificar se o evento está no mesmo dia
      const isSameDay =
        meetingStart.getFullYear() === dayDate.getFullYear() &&
        meetingStart.getMonth() === dayDate.getMonth() &&
        meetingStart.getDate() === dayDate.getDate()

      if (!isSameDay) return false

      // Verificar se o evento começa neste slot
      const startsInThisSlot = meetingStart.getHours() === slotHour

      // Verificar se o evento continua durante este slot (começou antes mas termina durante ou depois)
      const continuesDuringThisSlot = meetingStart < slotDate && meetingEnd > slotDate

      return startsInThisSlot || continuesDuringThisSlot
    })
  }

  // Formatar intervalo de tempo
  const formatTimeRange = (start: Date, end: Date): string => {
    const formatTime = (date: Date): string => {
      return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    }
    return `${formatTime(start)} - ${formatTime(end)}`
  }

  // Obter iniciais do nome
  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  // Calcular altura e posição da reunião
  const getMeetingStyle = (
    meeting: Meeting,
    slotHour: number,
  ): {
    top: string
    height: string
    isStart: boolean
    isEnd: boolean
    totalDuration: number
  } => {
    const meetingStart = new Date(meeting.startTime)
    const meetingEnd = new Date(meeting.endTime)
    const slotStart = new Date(meetingStart)
    slotStart.setHours(slotHour, 0, 0, 0)

    const slotEnd = new Date(slotStart)
    slotEnd.setHours(slotHour + 1, 0, 0, 0)

    // Se o evento começa neste slot
    if (meetingStart.getHours() === slotHour) {
      const startMinutes = meetingStart.getMinutes()
      const totalDurationMinutes = (meetingEnd.getTime() - meetingStart.getTime()) / (1000 * 60)
      const durationInThisSlot = Math.min(totalDurationMinutes, 60 - startMinutes)

      // Calcular se o evento continua além deste slot
      const continuesAfterThisSlot = totalDurationMinutes > 60 - startMinutes

      return {
        top: `${(startMinutes * 100) / 60}px`,
        height: `${Math.max((durationInThisSlot * 100) / 60, 30)}px`, // Mínimo de 30px
        isStart: true,
        isEnd: !continuesAfterThisSlot,
        totalDuration: totalDurationMinutes,
      }
    }
    // Se o evento continua de um slot anterior
    else {
      // Calcular quanto do evento está neste slot
      const remainingDurationMinutes = Math.max(0, (meetingEnd.getTime() - slotStart.getTime()) / (1000 * 60))
      const durationInThisSlot = Math.min(remainingDurationMinutes, 60)

      // Verificar se este é o último slot do evento
      const isLastSlot = meetingEnd <= slotEnd

      return {
        top: "0px",
        height: `${Math.min((durationInThisSlot * 100) / 60, 100)}px`,
        isStart: false,
        isEnd: isLastSlot,
        totalDuration: remainingDurationMinutes,
      }
    }
  }

  // Verificar se um evento deve mostrar detalhes neste slot
  const shouldShowDetails = (meeting: Meeting, slotHour: number): boolean => {
    return meeting.startTime.getHours() === slotHour
  }

  // Obter cor para o evento com base na cor personalizada ou tipo de reunião
  const getMeetingColor = (meeting: Meeting): string => {
    if (meeting.color) {
      return `bg-${meeting.color}-100 border-l-4 border-l-${meeting.color}-500 hover:bg-${meeting.color}-200`
    }

    // Fallback para cores baseadas no tipo de reunião
    switch (meeting.meetingType) {
      case "google":
        return "bg-purple-100 border-l-4 border-l-purple-500 hover:bg-purple-200"
      case "zoom":
        return "bg-blue-100 border-l-4 border-l-blue-500 hover:bg-blue-200"
      case "teams":
        return "bg-green-100 border-l-4 border-l-green-500 hover:bg-green-200"
      default:
        return "bg-gray-100 border-l-4 border-l-gray-500 hover:bg-gray-200"
    }
  }

  // Formatar mês e ano para o cabeçalho
  const formatMonthYear = (): string => {
    const month = currentDate.toLocaleDateString("pt-BR", { month: "long" })
    const year = currentDate.getFullYear()
    return `${month} ${year}`
  }

  // Formatar intervalo de datas para o cabeçalho
  const formatDateRange = (): string => {
    const firstDay = days[0].date
    const lastDay = days[days.length - 1].date

    const firstDate = firstDay.getDate()
    const lastDate = lastDay.getDate()

    const month = firstDay.toLocaleDateString("pt-BR", { month: "long" })
    const year = firstDay.getFullYear()

    return `${month} ${firstDate} - ${lastDate}, ${year}`
  }

  // Determinar se deve mostrar avatares com base na altura do evento
  const shouldShowAvatars = (height: string): boolean => {
    const heightValue = Number.parseInt(height, 10)
    return heightValue >= 50 // Mostrar avatares apenas se o evento tiver pelo menos 50px de altura
  }

  // Gerar estilo de cor personalizado para eventos com cores personalizadas
  const getCustomColorStyle = (meeting: Meeting): React.CSSProperties => {
    if (!meeting.color) return {}

    return {
      backgroundColor: meeting.color ? `${meeting.color}20` : undefined, // 20 é a opacidade em hex (12.5%)
      borderLeftColor: meeting.color,
      borderLeftWidth: "4px",
    }
  }

  return (
    <div className="flex-1 overflow-y-auto h-full">
      {/* Calendar Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-4 border-b border-border bg-background sticky top-0 z-10"
      >
        <div className="text-lg font-medium mb-2">{formatDateRange()}</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr] border-b border-border sticky top-2 bg-background z-10"
      >
        <div className="border-r border-border p-4 w-[80px] text-center text-sm font-medium text-muted-foreground">
          Hora
        </div>
        {days.map((day, index) => (
          <motion.div
            key={day.name}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.1 + index * 0.05 }}
            className={`border-r border-border p-4 text-center ${day.isCurrentWeek ? "text-purple-600" : ""}`}
          >
            <div className="text-xl font-medium">{day.number}</div>
            <div className="text-sm text-muted-foreground">{day.shortName}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Time Slots */}
      <div className="relative">
        {timeSlots.map((slot, slotIndex) => (
          <motion.div
            key={slot.time}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 + slotIndex * 0.02 }}
            className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr] border-b border-border"
          >
            {/* Time Label */}
            <div className="border-r border-border p-4 w-[80px] text-xs text-muted-foreground sticky left-0 bg-background">
              {slot.label}
            </div>

            {/* Day Columns */}
            {days.map((day) => {
              const slotHour = Number.parseInt(slot.time.split(":")[0])
              const dayMeetings = getMeetingsForTimeSlot(day.date, slot.time)

              return (
                <div key={`${day.name}-${slot.time}`} className="border-r border-border h-[100px] relative">
                  {dayMeetings.map((meeting) => {
                    const { top, height, isStart, isEnd } = getMeetingStyle(meeting, slotHour)
                    const showDetails = shouldShowDetails(meeting, slotHour)
                    const showAvatars = shouldShowAvatars(height)

                    // Determine as classes de borda e arredondamento com base na posição do evento
                    const borderClasses = isStart
                      ? isEnd
                        ? "rounded-md"
                        : "rounded-t-md rounded-b-none border-b-0"
                      : isEnd
                        ? "rounded-t-none rounded-b-md border-t-0"
                        : "rounded-none border-y-0"

                    return (
                      <motion.div
                        key={`${meeting.id}-${slot.time}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.02, zIndex: 10 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute inset-x-2 p-3 cursor-pointer transition-all overflow-hidden shadow-sm ${borderClasses}`}
                        style={{
                          top,
                          height,
                          ...getCustomColorStyle(meeting),
                        }}
                        onClick={() => onMeetingClick(meeting)}
                      >
                        {showDetails ? (
                          // Primeiro slot (hora inicial) - mostrar detalhes completos
                          <>
                            <div className="text-sm font-medium truncate">{meeting.title}</div>
                            <div className="flex items-center mt-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatTimeRange(meeting.startTime, meeting.endTime)}
                            </div>

                            {/* Mostrar avatares apenas se o evento tiver altura suficiente */}
                            {showAvatars && (
                              <div className="flex mt-2 -space-x-1 overflow-hidden">
                                {meeting.attendees.slice(0, 3).map((attendee) => (
                                  <Avatar key={attendee.id} className="h-6 w-6 border-2 border-white">
                                    <AvatarImage src={attendee.avatar} alt={attendee.name} />
                                    <AvatarFallback className="text-[8px]">{getInitials(attendee.name)}</AvatarFallback>
                                  </Avatar>
                                ))}
                                {meeting.attendees.length > 3 && (
                                  <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[8px] border-2 border-white">
                                    +{meeting.attendees.length - 3}
                                  </div>
                                )}
                              </div>
                            )}
                          </>
                        ) : (
                          // Slots subsequentes - mostrar apenas indicação de continuação
                          <div className="h-full flex items-center justify-center">
                            <div className="text-xs text-muted-foreground text-center">
                              <div className="w-full border-t border-dashed border-muted-foreground my-1"></div>
                              <span>Continuação</span>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              )
            })}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

