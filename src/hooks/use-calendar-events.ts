/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useCallback, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { CalendarEvent } from '../../types/calendar'

export function useCalendarEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([])

  // Carregar eventos do localStorage ao inicializar
  useEffect(() => {
    const savedEvents = localStorage.getItem('calendar-events')
    if (savedEvents) {
      try {
        const parsedEvents = JSON.parse(savedEvents)
        // Converter strings de data para objetos Date
        const eventsWithDates = parsedEvents.map((event: any) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }))
        setEvents(eventsWithDates)
      } catch (error) {
        console.error('Erro ao carregar eventos:', error)
      }
    }
  }, [])

  // Salvar eventos no localStorage quando mudam
  useEffect(() => {
    localStorage.setItem('calendar-events', JSON.stringify(events))
  }, [events])

  const addEvent = useCallback((event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: uuidv4(),
    }
    setEvents((prev) => [...prev, newEvent])
    return newEvent
  }, [])

  const updateEvent = useCallback((updatedEvent: CalendarEvent) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event,
      ),
    )
    return updatedEvent
  }, [])

  const deleteEvent = useCallback((eventId: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId))
  }, [])

  const getEventsByDate = useCallback(
    (date: Date) => {
      const year = date.getFullYear()
      const month = date.getMonth()
      const day = date.getDate()

      // Criar objeto Date para o início e fim do dia
      const startOfDay = new Date(year, month, day, 0, 0, 0)
      const endOfDay = new Date(year, month, day, 23, 59, 59)

      return events.filter((event) => {
        const eventStart = new Date(event.start)
        const eventEnd = new Date(event.end)

        // Um evento está no dia se:
        // 1. Começa durante o dia, OU
        // 2. Termina durante o dia, OU
        // 3. Começa antes e termina depois do dia (abrange o dia inteiro)
        return (
          (eventStart >= startOfDay && eventStart <= endOfDay) || // Começa no dia
          (eventEnd >= startOfDay && eventEnd <= endOfDay) || // Termina no dia
          (eventStart <= startOfDay && eventEnd >= endOfDay) // Abrange o dia
        )
      })
    },
    [events],
  )

  const getEventsByMonth = useCallback(
    (year: number, month: number) => {
      return events.filter((event) => {
        const eventDate = new Date(event.start)
        return (
          eventDate.getFullYear() === year && eventDate.getMonth() === month
        )
      })
    },
    [events],
  )

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsByDate,
    getEventsByMonth,
  }
}
