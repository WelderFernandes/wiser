"use client"

import { useState, useMemo, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Search, Calendar, Clock, MapPin, User, Tag } from "lucide-react"
import { format, isAfter, compareAsc } from "date-fns"
import { ptBR } from "date-fns/locale"
import { motion, AnimatePresence } from "framer-motion"
import { CalendarEvent } from "../../types/calendar"

interface UpcomingEventsProps {
  events: CalendarEvent[]
  onSelectEvent: (event: CalendarEvent) => void
  onNavigateToDate: (date: Date) => void
}

export function UpcomingEvents({ events, onSelectEvent, onNavigateToDate }: UpcomingEventsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [mounted, setMounted] = useState(false)

  // Montar o componente com animação
  useEffect(() => {
    setMounted(true)
  }, [])

  // Filtrar eventos futuros e ordená-los por data
  const upcomingEvents = useMemo(() => {
    const now = new Date()
    return events
      .filter(
        (event) =>
          isAfter(new Date(event.start), now) ||
          format(new Date(event.start), "yyyy-MM-dd") === format(now, "yyyy-MM-dd"),
      )
      .sort((a, b) => compareAsc(new Date(a.start), new Date(b.start)))
      .slice(0, 5) // Pegar apenas os 5 primeiros
  }, [events])

  // Filtrar eventos com base na busca
  const filteredEvents = useMemo(() => {
    if (!searchTerm.trim()) return upcomingEvents

    const term = searchTerm.toLowerCase()
    return events
      .filter(
        (event) =>
          event.title.toLowerCase().includes(term) ||
          event.patient?.name.toLowerCase().includes(term) ||
          false ||
          event.location?.toLowerCase().includes(term) ||
          false,
      )
      .sort((a, b) => compareAsc(new Date(a.start), new Date(b.start)))
      .slice(0, 5)
  }, [events, upcomingEvents, searchTerm])

  const handleEventClick = (event: CalendarEvent) => {
    // Navegar para a data do evento
    onNavigateToDate(new Date(event.start))
    // Abrir os detalhes do evento
    onSelectEvent(event)
  }

  // Função para obter a cor de fundo baseada no tipo de evento
  const getEventColor = (type: string) => {
    switch (type) {
      case "event":
        return "bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 "
      case "reminder":
        return "bg-gradient-to-r from-purple-50 to-purple-100 border-l-4 border-purple-500"
      case "task":
        return "bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500"
      default:
        return "bg-gradient-to-r from-gray-50 to-gray-100 border-l-4 border-gray-500"
    }
  }

  // Função para obter a cor do texto baseada no tipo de evento
  const getEventTextColor = (type: string) => {
    switch (type) {
      case "event":
        return "text-blue-700"
      case "reminder":
        return "text-purple-700"
      case "task":
        return "text-green-700"
      default:
        return "text-gray-700"
    }
  }

  // Função para obter o ícone baseado no tipo de evento
  const getEventIcon = (type: string) => {
    switch (type) {
      case "event":
        return <Calendar className="h-4 w-4 text-blue-500" />
      case "reminder":
        return <Tag className="h-4 w-4 text-purple-500" />
      case "task":
        return <Clock className="h-4 w-4 text-green-500" />
      default:
        return <Calendar className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
        Próximos Eventos
      </h3>

      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar eventos"
          className="pl-8 border-primary/20 focus-visible:ring-primary/30 transition-all duration-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-3 p-1 overflow-hidden">
        <AnimatePresence>
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  transition: { duration: 0.1 },
                }}
                whileTap={{ scale: 0.98 }}
                className={`${getEventColor(event.type)} rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-all duration-300`}
                onClick={() => handleEventClick(event)}
              >
                <div className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-full  shadow-sm">{getEventIcon(event.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${getEventTextColor(event.type)}`}>{event.title}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3" />
                        <span className="font-medium">
                          {format(new Date(event.start), "d MMM, HH:mm", { locale: ptBR })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {(event.patient || event.location) && (
                    <div className="mt-2 pt-2 border-t border-gray-100 text-xs space-y-1">
                      {event.patient && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span className="truncate">{event.patient.name}</span>
                        </div>
                      )}
                      {event.location && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8 rounded-lg "
            >
              <p className="text-muted-foreground">Nenhum evento encontrado</p>
              <motion.div
                className="mt-2 text-primary text-"
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 4 }}
              >
                Crie um novo evento para começar
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

