"use client"

import { useState, useEffect } from "react"
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  addYears,
  subYears,
} from "date-fns"
import { ptBR } from "date-fns/locale"
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { CalendarEvent, CalendarViewType, Holiday } from "../../types/calendar"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EventListPopover } from "./event-list-popover"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Slider
} from "@/components/ui/slider"
import {
  Label
} from "@/components/ui/label"

interface CalendarViewProps {
  events: CalendarEvent[]
  holidays: Holiday[]
  view: CalendarViewType
  selectedDate: Date
  onDateChange: (date: Date) => void
  onEventClick: (event: CalendarEvent) => void
  onAddEvent: (date: Date) => void
  filteredCollaboratorIds?: string[]
  filteredPatientIds?: string[]
}

export function CalendarView({
  events,
  holidays,
  view,
  selectedDate,
  onDateChange,
  onEventClick,
  onAddEvent,
  filteredCollaboratorIds = [],
  filteredPatientIds = [],
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(selectedDate)
  const [eventListDate, setEventListDate] = useState<Date | null>(null)
  const [eventListEvents, setEventListEvents] = useState<CalendarEvent[]>([])
  
  // Adicionando estado para controlar o intervalo de horas
  const [startHour, setStartHour] = useState(7)
  const [endHour, setEndHour] = useState(22)
  const [timeRange, setTimeRange] = useState<number[]>([7, 22])
  
  // Estado para forçar atualização do indicador de hora atual
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    setCurrentDate(selectedDate)
  }, [selectedDate])

  // Efeito para atualizar as horas quando o range mudar
  useEffect(() => {
    setStartHour(timeRange[0])
    setEndHour(timeRange[1])
  }, [timeRange])
  
  // Efeito para atualizar o indicador de tempo atual a cada segundo
  useEffect(() => {
    // Função para atualizar o tempo atual
    const updateCurrentTime = () => setCurrentTime(new Date());
    
    // Definir o intervalo para atualização a cada segundo
    const intervalId = setInterval(updateCurrentTime, 1000);
    
    // Limpar o intervalo quando o componente for desmontado
    return () => clearInterval(intervalId);
  }, [])

  // Filtrar eventos com base nos filtros selecionados
  const filteredEvents = events.filter((event) => {
    // Se não há filtros, mostrar todos os eventos
    if (filteredCollaboratorIds.length === 0 && filteredPatientIds.length === 0) {
      return true
    }

    // Verificar filtro de colaboradores
    const hasCollaboratorFilter = filteredCollaboratorIds.length > 0
    const matchesCollaborator = hasCollaboratorFilter
      ? (event.collaborators?.some((c) => filteredCollaboratorIds.includes(c.id)) ?? false)
      : true

    // Verificar filtro de pacientes
    const hasPatientFilter = filteredPatientIds.length > 0
    const matchesPatient = hasPatientFilter ? filteredPatientIds.includes(event.patient?.id ?? "") : true

    // Se ambos os filtros estão ativos, o evento deve corresponder a pelo menos um deles
    if (hasCollaboratorFilter && hasPatientFilter) {
      return matchesCollaborator || matchesPatient
    }

    // Caso contrário, corresponder ao filtro ativo
    return matchesCollaborator && matchesPatient
  })

  const goToPrevious = () => {
    if (view === "day") {
      const newDate = addDays(currentDate, -1)
      setCurrentDate(newDate)
      onDateChange(newDate)
    } else if (view === "week") {
      const newDate = addDays(currentDate, -7)
      setCurrentDate(newDate)
      onDateChange(newDate)
    } else if (view === "month") {
      const newDate = subMonths(currentDate, 1)
      setCurrentDate(newDate)
      onDateChange(newDate)
    } else if (view === "year") {
      const newDate = subYears(currentDate, 1)
      setCurrentDate(newDate)
      onDateChange(newDate)
    }
  }

  const goToNext = () => {
    if (view === "day") {
      const newDate = addDays(currentDate, 1)
      setCurrentDate(newDate)
      onDateChange(newDate)
    } else if (view === "week") {
      const newDate = addDays(currentDate, 7)
      setCurrentDate(newDate)
      onDateChange(newDate)
    } else if (view === "month") {
      const newDate = addMonths(currentDate, 1)
      setCurrentDate(newDate)
      onDateChange(newDate)
    } else if (view === "year") {
      const newDate = addYears(currentDate, 1)
      setCurrentDate(newDate)
      onDateChange(newDate)
    }
  }

  // Verificar se um dia é feriado
  const getHoliday = (date: Date) => {
    const formattedDate = format(date, "yyyy-MM-dd")
    return holidays.find((holiday) => holiday.date === formattedDate)
  }

  // Obter eventos para um dia específico
  const getEventsForDay = (date: Date) => {
    return filteredEvents.filter((event) => {
      const eventDate = new Date(event.start)
      return isSameDay(eventDate, date)
    })
  }

  // Obter eventos para um mês específico
  const getEventsForMonth = (year: number, month: number) => {
    return filteredEvents.filter((event) => {
      const eventDate = new Date(event.start)
      return eventDate.getFullYear() === year && eventDate.getMonth() === month
    })
  }

  const showMoreEvents = (date: Date, events: CalendarEvent[]) => {
    setEventListDate(date)
    setEventListEvents(events)
  }

  const closeEventList = () => {
    setEventListDate(null)
  }
  
  // Função aprimorada para marcar com precisão o horário atual no grid
  const getCurrentTimeIndicator = (day: Date) => {
    // Usar uma nova instância de Date para garantir que o tempo está atualizado
    const now = new Date();

    // Verificar se o dia é hoje
    if (!isSameDay(day, now)) {
      return null
    }

    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()

    // Verificar se o horário atual está dentro do intervalo visível (startHour-endHour)
    if (currentHour < startHour || currentHour > endHour) {
      return null
    }

    // Altura de cada célula de hora (em pixels)
    const hourCellHeight = 80;
    
    // Cálculo simplificado e direto da posição
    const hoursDiff = currentHour - startHour;
    const minutePercentage = currentMinute / 60;
    
    // Posição final com ajuste para garantir precisão
    const position = (hoursDiff + minutePercentage) * hourCellHeight;
    
    // Formatação do horário para exibição (removendo segundos para simplificar)
    const timeDisplay = format(now, "HH:mm");

    return (
      <div
        className="absolute left-0 right-0 border-t-2 border-red-500 z-50 flex items-center pointer-events-none"
        style={{ 
          top: `${position}px`
        }}
      >
        <div className="h-3 w-3 rounded-full bg-red-500 -ml-1.5 animate-pulse" />
        <span className="text-[10px] text-red-500 font-medium ml-1">
          {timeDisplay}
        </span>
      </div>
    )
  }

  // Função para lidar com a alteração do intervalo de horas
  const handleTimeRangeChange = (values: number[]) => {
    setTimeRange(values)
  }

  // Renderizar visualização de semana
  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate, { locale: ptBR })
    const weekEnd = endOfWeek(currentDate, { locale: ptBR })
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd })

    // Horários para exibir na visualização de semana (baseado no intervalo selecionado)
    const hours = Array.from({ length: (endHour - startHour) + 1 }, (_, i) => i + startHour)

    return (
      <div className="flex flex-col h-full">
        {/* Cabeçalho dos dias */}
        <div className="grid grid-cols-8 border-b">
          <div className="border-r p-2"></div> {/* Célula vazia para o canto superior esquerdo */}
          {days.map((day) => {
            const isToday = isSameDay(day, new Date())
            const holiday = getHoliday(day)

            return (
              <div key={day.toString()} className={cn("text-center p-2 relative", isToday && "bg-primary/10")}>
                <p className="text-sm font-medium capitalize">{format(day, "EEE", { locale: ptBR })}</p>
                <p className={cn("text-xl capitalize", isToday && "text-primary font-bold")}>{format(day, "d")}</p>
                {holiday && <p className="text-xs text-red-500 truncate capitalize">{holiday.name}</p>}
                {/* Indicador de horário atual */}
                {getCurrentTimeIndicator(day)}
              </div>
            )
          })}
        </div>

        {/* Grade de horários */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-8 divide-x">
            {/* Coluna de horários */}
            <div className="border-t border-d pr-2">
              {hours.map((hour) => (
                <div key={hour} className="text-right text-sm text-muted-foreground h-20 pt-2 bg-accent">
                  {`${String(hour).padStart(2, '0')}:00`}
                </div>
              ))}
            </div>

            {/* Colunas dos dias */}
            {days.map((day) => {
              const dayEvents = getEventsForDay(day)

              return (
                <div key={day.toString()} className="relative">
                  {/* Linhas de hora */}
                  {hours.map((hour) => (
                    <div
                      key={hour}
                      className="border-b border-dashed h-20"
                      onClick={() => {
                        const newDate = new Date(day)
                        newDate.setHours(hour, 0, 0, 0)
                        onAddEvent(newDate)
                      }}
                    ></div>
                  ))}

                  {/* Eventos */}
                  {dayEvents.map((event) => {
                    const startHourEvent = new Date(event.start).getHours()
                    const startMinute = new Date(event.start).getMinutes()
                    const endHourEvent = new Date(event.end).getHours()
                    const endMinute = new Date(event.end).getMinutes()

                    // Verificar se o evento está dentro do intervalo visível
                    if (endHourEvent < startHour || startHourEvent > endHour) {
                      return null // Não mostrar eventos fora do intervalo
                    }

                    // Ajustar eventos que começam antes do intervalo visível
                    const adjustedStartHour = Math.max(startHourEvent, startHour)
                    const adjustedStartMinute = startHourEvent < startHour ? 0 : startMinute

                    // Ajustar eventos que terminam depois do intervalo visível
                    const adjustedEndHour = Math.min(endHourEvent, endHour)
                    const adjustedEndMinute = endHourEvent > endHour ? 0 : endMinute

                    // Calcular posição e altura do evento ajustadas
                    const startPosition = (adjustedStartHour - startHour) * 80 + (adjustedStartMinute / 60) * 80
                    const duration = 
                      (adjustedEndHour - adjustedStartHour) * 60 + 
                      (adjustedEndMinute - adjustedStartMinute)
                    const height = (duration / 60) * 80

                    return (
                      <div
                        key={event.id}
                        className={cn(
                          "absolute left-0 right-0 mx-1 p-1 rounded text-xs overflow-hidden cursor-pointer",
                          event.type === "event" && "bg-blue-100 text-blue-800",
                          event.type === "reminder" && "bg-purple-100 text-purple-800",
                          event.type === "task" && "bg-green-100 text-green-800",
                        )}
                        style={{
                          top: `${startPosition}px`,
                          height: `${Math.max(height, 20)}px`,
                          minHeight: "20px",
                        }}
                        onClick={(e) => {
                          e.stopPropagation()
                          onEventClick(event)
                        }}
                      >
                        <div className="font-medium truncate">{event.title}</div>
                        <div className="truncate">
                          {format(new Date(event.start), "HH:mm")} - {format(new Date(event.end), "HH:mm")}
                        </div>
                        {event.patient && (
                          <div className="flex items-center gap-1 truncate">
                            <User className="h-3 w-3" />
                            <span>{event.patient.name}</span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // Renderizar visualização de mês
  const renderMonthView = () => {
    const today = new Date()
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

    // Obter o primeiro dia da semana (domingo = 0)
    const firstDayOfWeek = firstDayOfMonth.getDay()

    // Obter o último dia do mês anterior para preencher o início do calendário
    const daysFromPrevMonth = firstDayOfWeek
    const lastDayOfPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate()

    // Obter o número de dias no mês atual
    const daysInMonth = lastDayOfMonth.getDate()

    // Calcular o número de dias do próximo mês para preencher o final do calendário
    const totalCells = Math.ceil((daysFromPrevMonth + daysInMonth) / 7) * 7
    const daysFromNextMonth = totalCells - (daysFromPrevMonth + daysInMonth)

    // Criar array com todos os dias a serem exibidos
    const calendarDays = []

    // Dias do mês anterior
    for (let i = 0; i < daysFromPrevMonth; i++) {
      const day = lastDayOfPrevMonth - daysFromPrevMonth + i + 1
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, day)
      calendarDays.push({ date, isCurrentMonth: false })
    }

    // Dias do mês atual
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i)
      calendarDays.push({ date, isCurrentMonth: true })
    }

    // Dias do próximo mês
    for (let i = 1; i <= daysFromNextMonth; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i)
      calendarDays.push({ date, isCurrentMonth: false })
    }

    // Agrupar dias em semanas
    const weeks = []
    for (let i = 0; i < calendarDays.length; i += 7) {
      weeks.push(calendarDays.slice(i, i + 7))
    }

    return (
      <div className="flex flex-col h-full">
        {/* Cabeçalho dos dias da semana */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day, index) => (
            <div key={index} className="text-center py-2 font-medium ">
              {day}
            </div>
          ))}
        </div>

        {/* Grade do calendário */}
        <div className="grid grid-rows-6 gap-1 flex-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-1 h-auto min-h-24 ">
              {week.map(({ date, isCurrentMonth }, dayIndex) => {
                const isToday = isSameDay(date, today)
                const dayEvents = getEventsForDay(date)
                const holiday = getHoliday(date)
                const maxVisibleEvents = 2 // Mostrar apenas 2 eventos
                const hasMoreEvents = dayEvents.length > maxVisibleEvents

                return (
                  <div
                    key={dayIndex}
                    className={cn(
                      "flex w-full flex-col p-1 h-full border rounded-md hover:bg-primary/50 hover:ring-1 hover:ring-primary/70",
                      isCurrentMonth ? "bg-primary/10" : "bg-foreground/5",
                      isToday && "border-primary bg-primary/50",
                      !isCurrentMonth && "opacity-50",
                    )}
                    onClick={() => onAddEvent(date)}
                  >
                    <div
                      className={cn(
                        "text-right text-sm font-medium p-1",
                        isToday &&
                          "bg-secondary-foreground text-primary rounded-full w-7 h-7 flex items-center justify-center ml-auto",
                      )}
                    >
                      {date.getDate()}
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-0 mt-1">
                      {holiday && (
                        <div className="bg-red-100 text-red-800 p-1 rounded text-xs truncate mb-1">{holiday.name}</div>
                      )}

                      {dayEvents.slice(0, maxVisibleEvents).map((event) => (
                        <div
                          key={event.id}
                          className={cn(
                            "p-1 rounded-md text-xs cursor-pointer truncate mb-1",
                            event.type === "event" && "bg-blue-100 text-blue-800",
                            event.type === "reminder" && "bg-purple-100 text-purple-800",
                            event.type === "task" && "bg-green-100 text-green-800",
                          )}
                          onClick={(e) => {
                            e.stopPropagation()
                            onEventClick(event)
                          }}
                        >
                          {format(new Date(event.start), "HH:mm")} {event.title}
                        </div>
                      ))}

                      {hasMoreEvents && (
                        <div
                          className="text-xs text-center text-muted-foreground cursor-pointer hover:underline"
                          onClick={(e) => {
                            e.stopPropagation()
                            showMoreEvents(date, dayEvents)
                          }}
                        >
                          +{dayEvents.length - maxVisibleEvents} mais
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Popover para mostrar mais eventos */}
        {eventListDate && (
          <EventListPopover
            date={eventListDate}
            events={eventListEvents}
            isOpen={!!eventListDate}
            onClose={closeEventList}
            onEventClick={onEventClick}
          />
        )}
      </div>
    )
  }

  // Renderizar visualização de ano
  const renderYearView = () => {
    const year = currentDate.getFullYear()
    const months = Array.from({ length: 12 }, (_, i) => new Date(year, i, 1))

    return (
      <div className="grid grid-cols-4 gap-4 h-full overflow-y-auto">
        {months.map((month) => {
          const monthName = format(month, "MMMM", { locale: ptBR })
          const monthEvents = getEventsForMonth(year, month.getMonth())
          const monthHolidays = holidays.filter((holiday) => {
            const holidayDate = new Date(holiday.date)
            return holidayDate.getFullYear() === year && holidayDate.getMonth() === month.getMonth()
          })

          // Obter o primeiro dia do mês
          const firstDay = new Date(year, month.getMonth(), 1)
          // Obter o último dia do mês
          const lastDay = new Date(year, month.getMonth() + 1, 0)
          // Dias no mês
          const daysInMonth = lastDay.getDate()

          // Obter o primeiro dia da semana (domingo = 0)
          const firstDayOfWeek = firstDay.getDay()

          // Criar array com todos os dias do mês
          const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

          // Criar array para preencher os dias vazios no início
          const emptyDays = Array.from({ length: firstDayOfWeek }, (_, i) => null)

          // Combinar dias vazios e dias do mês
          const allDays = [...emptyDays, ...days]

          // Agrupar em semanas
          const weeks = []
          for (let i = 0; i < allDays.length; i += 7) {
            weeks.push(allDays.slice(i, i + 7))
          }

          return (
            <div
              key={month.toString()}
              className="border rounded-md p-2 flex flex-col"
              onClick={() => {
                setCurrentDate(month)
                onDateChange(month)
                // Mudar para visualização de mês
                // Isso deve ser implementado no componente pai
              }}
            >
              <h3 className="text-center font-medium capitalize mb-2">{monthName}</h3>

              <div className="grid grid-cols-7 gap-1 text-xs text-center">
                {["D", "S", "T", "Q", "Q", "S", "S"].map((day, i) => (
                  <div key={i} className="text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>

              <div className="flex-1">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="grid grid-cols-7 gap-1 text-xs text-center">
                    {week.map((day, dayIndex) => {
                      if (day === null) {
                        return <div key={dayIndex} />
                      }

                      const date = new Date(year, month.getMonth(), day)
                      const isToday = isSameDay(date, new Date())
                      const hasEvents = getEventsForDay(date).length > 0
                      const isHoliday = getHoliday(date) !== undefined

                      return (
                        <div
                          key={dayIndex}
                          className={cn(
                            "h-6 w-6 flex items-center justify-center rounded-full mx-auto",
                            isToday && "bg-primary text-white",
                            hasEvents && !isToday && "bg-blue-100",
                            isHoliday && !isToday && "text-red-500",
                          )}
                        >
                          {day}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>

              <div className="mt-2 text-xs">
                <div className="flex justify-between">
                  <span>{monthEvents.length} eventos</span>
                  <span>{monthHolidays.length} feriados</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // Renderizar visualização de dia
  const renderDayView = () => {
    const dayEvents = getEventsForDay(currentDate)
    const holiday = getHoliday(currentDate)

    return (
      <div className="flex flex-col h-full">
        <div className="text-center py-4">
          <p className="text-xl font-medium capitalize">{format(currentDate, "EEEE, d 'de' MMMM", { locale: ptBR })}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {holiday && (
            <div className="bg-red-100 text-red-800 p-2 rounded">
              <p className="font-medium">Feriado: {holiday.name}</p>
            </div>
          )}

          {dayEvents.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <p>Nenhum evento para este dia</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={() => onAddEvent(currentDate)}>
                <Plus className="h-4 w-4 mr-1" />
                Adicionar evento
              </Button>
            </div>
          ) : (
            dayEvents.map((event) => (
              <div
                key={event.id}
                className={cn(
                  "p-3 rounded cursor-pointer",
                  event.type === "event" && "bg-blue-100 text-blue-800",
                  event.type === "reminder" && "bg-purple-100 text-purple-800",
                  event.type === "task" && "bg-green-100 text-green-800",
                )}
                onClick={() => onEventClick(event)}
              >
                <div className="font-medium text-lg">{event.title}</div>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-4 w-4" />
                  <span>
                    {format(new Date(event.start), "HH:mm")} - {format(new Date(event.end), "HH:mm")}
                  </span>
                </div>

                {event.location && (
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                )}

                {event.patient && (
                  <div className="flex items-center gap-2 mt-1">
                    <User className="h-4 w-4" />
                    <span>{event.patient.name}</span>
                  </div>
                )}

                {event.collaborators && event.collaborators.length > 0 && (
                  <div className="flex items-center gap-1 mt-2">
                    {event.collaborators.map((collaborator) => (
                      <Avatar key={collaborator.id} className="h-6 w-6">
                        <AvatarImage src={collaborator.avatar} alt={collaborator.name} />
                        <AvatarFallback>
                          {collaborator.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between py-4">
        <h2 className="text-xl font-bold">
          {view === "year"
            ? format(currentDate, "yyyy", { locale: ptBR })
            : format(currentDate, "d MMMM, yyyy", { locale: ptBR })}
        </h2>

        <div className="flex items-center space-x-4">
          {/* Seletor de intervalo de horas - Apenas visível na visualização semanal */}
          {view === "week" && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-8 flex items-center gap-1">
                  <Settings className="h-4 w-4" />
                  <span>{String(startHour).padStart(2, '0')}:00 - {String(endHour).padStart(2, '0')}:00</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4">
                <div className="space-y-4">
                  <h4 className="font-medium">Intervalo de Horas</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Início: {String(timeRange[0]).padStart(2, '0')}:00</span>
                      <span>Fim: {String(timeRange[1]).padStart(2, '0')}:00</span>
                    </div>
                    <Slider
                      defaultValue={[startHour, endHour]}
                      min={0}
                      max={23}
                      step={1}
                      value={timeRange}
                      onValueChange={handleTimeRangeChange}
                      className="my-4"
                    />
                    <div className="grid grid-cols-8 gap-2 text-xs text-center text-muted-foreground">
                      {Array.from({ length: 24 }, (_, i) => (
                        <div 
                          key={i} 
                          className={cn(
                            "p-1 rounded cursor-pointer hover:bg-primary/20",
                            (i >= timeRange[0] && i <= timeRange[1]) && "bg-primary/40"
                          )}
                          onClick={() => {
                            // Se clicou no início do intervalo atual
                            if (i === timeRange[0]) {
                              setTimeRange([Math.max(0, i-1), timeRange[1]]);
                            } 
                            // Se clicou no fim do intervalo atual
                            else if (i === timeRange[1]) {
                              setTimeRange([timeRange[0], Math.min(23, i+1)]);
                            }
                            // Se clicou dentro do intervalo atual
                            else if (i > timeRange[0] && i < timeRange[1]) {
                              // Não faz nada
                            } 
                            // Se clicou fora do intervalo
                            else {
                              // Se clicou antes do início, ajusta o início
                              if (i < timeRange[0]) {
                                setTimeRange([i, timeRange[1]]);
                              } 
                              // Se clicou depois do fim, ajusta o fim
                              else if (i > timeRange[1]) {
                                setTimeRange([timeRange[0], i]);
                              }
                            }
                          }}
                        >
                          {String(i).padStart(2, '0')}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setTimeRange([8, 18])}
                      >
                        Horário comercial
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setTimeRange([0, 23])}
                      >
                        Dia inteiro
                      </Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={goToPrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={goToNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {view === "day" && renderDayView()}
        {view === "week" && renderWeekView()}
        {view === "month" && renderMonthView()}
        {view === "year" && renderYearView()}
      </div>
    </div>
  )
}