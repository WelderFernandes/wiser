"use client"

import type React from "react"

import type { Service } from "@/lib/types"
import { useMemo } from "react"
import { Clock, Plus, CalendarDays } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useHolidays, isHoliday, getHolidayStyle, type Holiday } from "./holiday-service"
import { HolidayBadge } from "./holiday-badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface CalendarGridProps {
  services: Service[]
  currentDate: Date
  onServiceClick: (service: Service) => void
  onCreateService: (date: Date, hour: number) => void
}

export default function CalendarGrid({ services, currentDate, onServiceClick, onCreateService }: CalendarGridProps) {
  // Buscar feriados para o ano atual
  const { holidays, loading: loadingHolidays } = useHolidays(currentDate.getFullYear())

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
    holiday: Holiday | null
  }> => {
    const day = date.getDay()
    const diff = date.getDate() - day + (day === 0 ? -6 : 1) // Ajustar quando o dia é domingo

    const days = []
    // Alterado de 5 para 7 dias para incluir sábado e domingo
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(date)
      currentDay.setDate(diff + i)

      // Verificar se é um feriado
      const holiday = isHoliday(currentDay, holidays)

      days.push({
        name: currentDay.toLocaleDateString("pt-BR", { weekday: "long" }),
        shortName: currentDay.toLocaleDateString("pt-BR", { weekday: "short" }),
        number: currentDay.getDate(),
        day: i + 1,
        date: new Date(currentDay),
        isToday: currentDay.toDateString() === new Date().toDateString(),
        isCurrentWeek: currentDay.toDateString() === date.toDateString(),
        holiday,
      })
    }

    return days
  }

  const days = useMemo(() => generateDays(currentDate), [currentDate, holidays])

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

  // Obter serviços para um dia e slot de tempo específicos
  const getServicesForTimeSlot = (dayDate: Date, time: string): Service[] => {
    const slotHour = Number.parseInt(time.split(":")[0])
    const slotDate = new Date(dayDate)
    slotDate.setHours(slotHour, 0, 0, 0)

    const nextSlotDate = new Date(slotDate)
    nextSlotDate.setHours(slotHour + 1, 0, 0, 0)

    return services.filter((service) => {
      const serviceStart = new Date(service.startTime)
      const serviceEnd = new Date(service.endTime)

      // Verificar se o serviço está no mesmo dia
      const isSameDay =
        serviceStart.getFullYear() === dayDate.getFullYear() &&
        serviceStart.getMonth() === dayDate.getMonth() &&
        serviceStart.getDate() === dayDate.getDate()

      if (!isSameDay) return false

      // Verificar se o serviço começa neste slot
      const startsInThisSlot = serviceStart.getHours() === slotHour

      // Verificar se o serviço continua durante este slot (começou antes mas termina durante ou depois)
      const continuesDuringThisSlot = serviceStart < slotDate && serviceEnd > slotDate

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

  // Calcular altura e posição do serviço
  const getServiceStyle = (
    service: Service,
    slotHour: number,
  ): {
    top: string
    height: string
    isStart: boolean
    isEnd: boolean
    totalDuration: number
  } => {
    const serviceStart = new Date(service.startTime)
    const serviceEnd = new Date(service.endTime)
    const slotStart = new Date(serviceStart)
    slotStart.setHours(slotHour, 0, 0, 0)

    const slotEnd = new Date(slotStart)
    slotEnd.setHours(slotHour + 1, 0, 0, 0)

    // Se o serviço começa neste slot
    if (serviceStart.getHours() === slotHour) {
      const startMinutes = serviceStart.getMinutes()
      const totalDurationMinutes = (serviceEnd.getTime() - serviceStart.getTime()) / (1000 * 60)
      const durationInThisSlot = Math.min(totalDurationMinutes, 60 - startMinutes)

      // Calcular se o serviço continua além deste slot
      const continuesAfterThisSlot = totalDurationMinutes > 60 - startMinutes

      return {
        top: `${(startMinutes * 100) / 60}px`,
        height: `${Math.max((durationInThisSlot * 100) / 60, 30)}px`, // Mínimo de 30px
        isStart: true,
        isEnd: !continuesAfterThisSlot,
        totalDuration: totalDurationMinutes,
      }
    }
    // Se o serviço continua de um slot anterior
    else {
      // Calcular quanto do serviço está neste slot
      const remainingDurationMinutes = Math.max(0, (serviceEnd.getTime() - slotStart.getTime()) / (1000 * 60))
      const durationInThisSlot = Math.min(remainingDurationMinutes, 60)

      // Verificar se este é o último slot do serviço
      const isLastSlot = serviceEnd <= slotEnd

      return {
        top: "0px",
        height: `${Math.min((durationInThisSlot * 100) / 60, 100)}px`,
        isStart: false,
        isEnd: isLastSlot,
        totalDuration: remainingDurationMinutes,
      }
    }
  }

  // Verificar se um serviço deve mostrar detalhes neste slot
  const shouldShowDetails = (service: Service, slotHour: number): boolean => {
    return service.startTime.getHours() === slotHour
  }

  // Obter cor para o serviço com base na cor personalizada ou tipo de serviço
  const getServiceColor = (service: Service): string => {
    if (service.color) {
      return `bg-${service.color}-100 border-l-4 border-l-${service.color}-500 hover:bg-${service.color}-200`
    }

    // Fallback para cores baseadas no tipo de serviço
    switch (service.serviceType) {
      case "Corte de Cabelo":
        return "bg-purple-100 border-l-4 border-l-purple-500 hover:bg-purple-200"
      case "Barba":
        return "bg-blue-100 border-l-4 border-l-blue-500 hover:bg-blue-200"
      case "Coloração":
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

  // Determinar se deve mostrar avatares com base na altura do serviço
  const shouldShowAvatars = (height: string): boolean => {
    const heightValue = Number.parseInt(height, 10)
    return heightValue >= 50 // Mostrar avatares apenas se o serviço tiver pelo menos 50px de altura
  }

  // Gerar estilo de cor personalizado para serviços com cores personalizadas
  const getCustomColorStyle = (service: Service): React.CSSProperties => {
    if (!service.color) return {}

    return {
      backgroundColor: service.color ? `${service.color}20` : undefined, // 20 é a opacidade em hex (12.5%)
      borderLeftColor: service.color,
      borderLeftWidth: "4px",
    }
  }

  // Obter badge de status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge className="bg-blue-500 text-[8px] px-1 py-0">Agendado</Badge>
      case "completed":
        return <Badge className="bg-green-500 text-[8px] px-1 py-0">Concluído</Badge>
      case "canceled":
        return <Badge className="bg-red-500 text-[8px] px-1 py-0">Cancelado</Badge>
      default:
        return null
    }
  }

  // Criar um novo serviço ao clicar em um slot vazio
  const handleCreateServiceClick = (dayDate: Date, hour: number) => {
    // Criar uma data com o dia e hora selecionados
    const selectedDate = new Date(dayDate)
    selectedDate.setHours(hour, 0, 0, 0)

    // Chamar a função para criar um novo serviço
    onCreateService(selectedDate, hour)
  }

  return (
    <TooltipProvider>
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

        {/* Calendar Days Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b border-border sticky top-[73px] bg-background z-10"
        >
          <div className="border-r border-border p-4 w-[80px] text-center text-sm font-medium text-muted-foreground">
            Hora
          </div>
          {days.map((day, index) => (
            // Adicionar estilo especial para destacar o dia atual
            <motion.div
              key={day.name}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.1 + index * 0.05 }}
              className={`border-r border-border p-4 text-center 
                ${day.isToday ? "bg-blue-50 dark:bg-blue-900/10" : ""} 
                ${day.isCurrentWeek ? "text-purple-600" : ""} 
                ${day.holiday ? "relative" : ""} 
                ${day.day > 5 ? "bg-gray-50/50" : ""}`}
              style={day.holiday ? getHolidayStyle(day.holiday) : {}}
            >
              <div className={`text-xl font-medium ${day.isToday ? "text-blue-600" : ""}`}>{day.number}</div>
              <div className="text-sm text-muted-foreground">{day.shortName}</div>

              {/* Exibir badge de feriado se for um feriado */}
              {day.holiday && (
                <div className="mt-1">
                  <HolidayBadge holiday={day.holiday} />
                </div>
              )}

              {/* Indicador de dia atual */}
              {day.isToday && <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500"></div>}
            </motion.div>
          ))}
        </motion.div>

        {/* Time Slots */}
        <div className="relative">
          {timeSlots.map((slot, slotIndex) => (
            // Modificar o grid de slots de tempo para acomodar 7 colunas
            <motion.div
              key={slot.time}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 + slotIndex * 0.02 }}
              className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b border-border"
            >
              {/* Time Label */}
              <div className="border-r border-border p-4 w-[80px] text-xs text-muted-foreground sticky left-0 bg-background">
                {slot.label}
              </div>

              {/* Day Columns */}
              {days.map((day) => {
                const slotHour = Number.parseInt(slot.time.split(":")[0])
                const dayServices = getServicesForTimeSlot(day.date, slot.time)
                const hasServices = dayServices.length > 0

                return (
                  <div
                    key={`${day.name}-${slot.time}`}
                    className={`border-r border-border h-[100px] relative group ${
                      day.holiday ? "bg-orange-50/30" : ""
                    } ${day.day > 5 ? "bg-gray-50/50" : ""}`}
                    onClick={() => handleCreateServiceClick(day.date, slotHour)}
                    style={day.holiday && slotHour === 8 ? getHolidayStyle(day.holiday) : {}}
                  >
                    {/* Botão de adicionar serviço com tooltip */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={`absolute ${hasServices ? "top-0 right-1 z-20" : "top-1 right-1"} opacity-0 group-hover:opacity-100 transition-opacity`}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-6 w-6 rounded-full p-0 ${
                              hasServices ? "bg-background/80 backdrop-blur-sm shadow-sm" : ""
                            }`}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCreateServiceClick(day.date, slotHour)
                            }}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p className="text-xs">Adicionar serviço às {slot.label}</p>
                      </TooltipContent>
                    </Tooltip>

                    {/* Serviços agendados */}
                    {dayServices.map((service) => {
                      const { top, height, isStart, isEnd } = getServiceStyle(service, slotHour)
                      const showDetails = shouldShowDetails(service, slotHour)
                      const showAvatars = shouldShowAvatars(height)

                      // Determine as classes de borda e arredondamento com base na posição do serviço
                      const borderClasses = isStart
                        ? isEnd
                          ? "rounded-md"
                          : "rounded-t-md rounded-b-none border-b-0"
                        : isEnd
                          ? "rounded-t-none rounded-b-md border-t-0"
                          : "rounded-none border-y-0"

                      return (
                        <motion.div
                          key={`${service.id}-${slot.time}`}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          whileHover={{ scale: 1.02, zIndex: 10 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                          className={`absolute inset-x-2 p-3 cursor-pointer transition-all overflow-hidden shadow-sm group-hover:translate-y-6 ${borderClasses}`}
                          style={{
                            top,
                            height,
                            ...getCustomColorStyle(service),
                          }}
                          onClick={(e) => {
                            e.stopPropagation()
                            onServiceClick(service)
                          }}
                        >
                          {showDetails ? (
                            // Primeiro slot (hora inicial) - mostrar detalhes completos
                            <>
                              <div className="flex justify-between items-start">
                                <div className="text-sm font-medium truncate">{service.title}</div>
                                {getStatusBadge(service.status)}
                              </div>
                              <div className="flex items-center mt-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3 mr-1" />
                                {formatTimeRange(service.startTime, service.endTime)}
                              </div>

                              {/* Mostrar tipo de serviço */}
                              <div className="text-xs mt-1">{service.serviceType}</div>

                              {/* Mostrar avatares apenas se o serviço tiver altura suficiente */}
                              {showAvatars && (
                                <div className="flex mt-2 -space-x-1 overflow-hidden">
                                  <Avatar className="h-6 w-6 border-2 border-white">
                                    <AvatarImage src={service.provider.avatar} alt={service.provider.name} />
                                    <AvatarFallback className="text-[8px]">
                                      {getInitials(service.provider.name)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <Avatar className="h-6 w-6 border-2 border-white">
                                    <AvatarImage src={service.client.avatar} alt={service.client.name} />
                                    <AvatarFallback className="text-[8px]">
                                      {getInitials(service.client.name)}
                                    </AvatarFallback>
                                  </Avatar>
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

                    {/* Exibir informação de feriado no primeiro slot do dia (8h) */}
                    {slotHour === 8 && day.holiday && dayServices.length === 0 && (
                      <div className="absolute inset-x-2 top-2 p-2 rounded-md bg-orange-50/50 border-l-4 border-orange-400">
                        <div className="flex items-center gap-1">
                          <CalendarDays className="h-4 w-4 text-orange-500" />
                          <span className="text-sm font-medium text-orange-700">{day.holiday.name}</span>
                        </div>
                        <div className="text-xs text-orange-600 mt-1">Feriado Nacional</div>
                      </div>
                    )}
                  </div>
                )
              })}
            </motion.div>
          ))}
        </div>

        {/* Botão flutuante para adicionar serviço */}
        <div className="fixed bottom-6 right-6 z-20">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              className="h-14 w-14 rounded-full shadow-lg"
              onClick={() => onCreateService(new Date(), new Date().getHours())}
            >
              <Plus className="h-6 w-6" />
            </Button>
          </motion.div>
        </div>
      </div>
    </TooltipProvider>
  )
}

