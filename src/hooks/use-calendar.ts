'use client'

import { useState, useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Event, Month } from '../../types/calendar'

export function useCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [events, setEvents] = useState<Event[]>([])
  const [isAddingEvent, setIsAddingEvent] = useState(false)

  const currentMonth = useMemo(() => {
    return currentDate.getMonth()
  }, [currentDate])

  const currentYear = useMemo(() => {
    return currentDate.getFullYear()
  }, [currentDate])

  const monthName = useMemo(() => {
    return new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(
      currentDate,
    )
  }, [currentDate])

  const daysOfWeek = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)

    const startingDayOfWeek = firstDayOfMonth.getDay()
    const daysInMonth = lastDayOfMonth.getDate()

    const calendar: Month = [[]]
    let week = 0

    // Add days from previous month
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate()
    for (let i = 0; i < startingDayOfWeek; i++) {
      const date = new Date(
        currentYear,
        currentMonth - 1,
        prevMonthLastDay - startingDayOfWeek + i + 1,
      )
      const eventsForDay = events.filter(
        (event) =>
          event.date.getDate() === date.getDate() &&
          event.date.getMonth() === date.getMonth() &&
          event.date.getFullYear() === date.getFullYear(),
      )

      calendar[week].push({
        date,
        isCurrentMonth: false,
        hasEvents: eventsForDay.length > 0,
        events: eventsForDay,
      })
    }

    // Add days from current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day)
      const eventsForDay = events.filter(
        (event) =>
          event.date.getDate() === date.getDate() &&
          event.date.getMonth() === date.getMonth() &&
          event.date.getFullYear() === date.getFullYear(),
      )

      if (calendar[week].length === 7) {
        calendar.push([])
        week++
      }

      calendar[week].push({
        date,
        isCurrentMonth: true,
        hasEvents: eventsForDay.length > 0,
        events: eventsForDay,
      })
    }

    // Add days from next month
    const lastWeekLength = calendar[week].length
    if (lastWeekLength < 7) {
      for (let i = 1; i <= 7 - lastWeekLength; i++) {
        const date = new Date(currentYear, currentMonth + 1, i)
        const eventsForDay = events.filter(
          (event) =>
            event.date.getDate() === date.getDate() &&
            event.date.getMonth() === date.getMonth() &&
            event.date.getFullYear() === date.getFullYear(),
        )

        calendar[week].push({
          date,
          isCurrentMonth: false,
          hasEvents: eventsForDay.length > 0,
          events: eventsForDay,
        })
      }
    }

    return calendar
  }, [currentMonth, currentYear, events])

  const selectedDayEvents = useMemo(() => {
    return events.filter(
      (event) =>
        event.date.getDate() === selectedDate.getDate() &&
        event.date.getMonth() === selectedDate.getMonth() &&
        event.date.getFullYear() === selectedDate.getFullYear(),
    )
  }, [selectedDate, events])

  const formattedSelectedDate = useMemo(() => {
    return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
    }).format(selectedDate)
  }, [selectedDate])

  const totalEventsThisMonth = useMemo(() => {
    return events.filter(
      (event) =>
        event.date.getMonth() === currentMonth &&
        event.date.getFullYear() === currentYear,
    ).length
  }, [events, currentMonth, currentYear])

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
  }

  const addEvent = (title: string, description?: string, time?: string) => {
    const newEvent: Event = {
      id: uuidv4(),
      title,
      date: new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
      ),
      description,
      time,
    }

    setEvents((prev) => [...prev, newEvent])
    setIsAddingEvent(false)
  }

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id))
  }

  return {
    currentDate,
    selectedDate,
    setSelectedDate,
    events,
    isAddingEvent,
    setIsAddingEvent,
    monthName,
    currentYear,
    daysOfWeek,
    calendarDays,
    selectedDayEvents,
    formattedSelectedDate,
    totalEventsThisMonth,
    goToPreviousMonth,
    goToNextMonth,
    addEvent,
    deleteEvent,
  }
}
