'use client'

import { useCalendarEvents } from '@/hooks/use-calendar-events'
import { useState } from 'react'
import {
  Collaborator,
  Patient,
  CalendarViewType,
  CalendarEvent,
} from '../../types/calendar'
import { CalendarFilters } from './calendar-filters'
import { CalendarHeader } from './calendar-header'
import { CalendarView } from './calendar-view'
import { EventDetails } from './event-details'
import { EventModal } from './event-modal'
import { Sidebar } from './sidebar-calendar'
import { Card } from './ui/card'
import { useHolidays } from '@/hooks/use-holidays'

// Dados de exemplo para colaboradores
const sampleCollaborators: Collaborator[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@exemplo.com',
    avatar: '/placeholder.svg?height=40&width=40',
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    email: 'maria.oliveira@exemplo.com',
    avatar: '/placeholder.svg?height=40&width=40',
  },
  {
    id: '3',
    name: 'Pedro Santos',
    email: 'pedro.santos@exemplo.com',
    avatar: '/placeholder.svg?height=40&width=40',
  },
]

// Dados de exemplo para pacientes
const samplePatients: Patient[] = [
  {
    id: '1',
    name: 'Ana Souza',
    email: 'ana.souza@exemplo.com',
    phone: '(11) 98765-4321',
    avatar: '/placeholder.svg?height=40&width=40',
  },
  {
    id: '2',
    name: 'Carlos Ferreira',
    email: 'carlos.ferreira@exemplo.com',
    phone: '(11) 91234-5678',
    avatar: '/placeholder.svg?height=40&width=40',
  },
  {
    id: '3',
    name: 'Beatriz Lima',
    email: 'beatriz.lima@exemplo.com',
    phone: '(11) 99876-5432',
    avatar: '/placeholder.svg?height=40&width=40',
  },
  {
    id: '4',
    name: 'Roberto Almeida',
    email: 'roberto.almeida@exemplo.com',
    phone: '(11) 92345-6789',
    avatar: '/placeholder.svg?height=40&width=40',
  },
  {
    id: '5',
    name: 'Roberto Almeida',
    email: 'roberto.almeida@exemplo.com',
    phone: '(11) 92345-6789',
    avatar: '/placeholder.svg?height=40&width=40',
  },
  {
    id: '6',
    name: 'Roberto Almeida',
    email: 'roberto.almeida@exemplo.com',
    phone: '(11) 92345-6789',
    avatar: '/placeholder.svg?height=40&width=40',
  },
]

export default function Calendar2() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [view, setView] = useState<CalendarViewType>('month')
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [initialDate, setInitialDate] = useState(new Date())
  const [selectedCollaboratorIds, setSelectedCollaboratorIds] = useState<
    string[]
  >([])
  const [selectedPatientIds, setSelectedPatientIds] = useState<string[]>([])

  const { events, addEvent, updateEvent, deleteEvent } = useCalendarEvents()
  const { holidays } = useHolidays(selectedDate.getFullYear())

  const handleDateChange = (date: Date) => {
    setSelectedDate(date)

    // Se estiver na visualização de ano e clicar em um mês, mudar para visualização de mês
    if (view === 'year') {
      setView('month')
    }
  }

  const handleAddEvent = (date: Date) => {
    setInitialDate(date)
    setSelectedEvent(null)
    setIsEventModalOpen(true)
  }

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setIsEventDetailsOpen(true)
  }

  const handleEditEvent = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setIsEventModalOpen(true)
    setIsEventDetailsOpen(false)
  }

  const handleSaveEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    if (selectedEvent) {
      const updatedEvent = { ...eventData, id: selectedEvent.id }
      updateEvent(updatedEvent)
    } else {
      const newEvent = addEvent(eventData)
      // Após adicionar um evento, podemos selecionar a data do evento
      setSelectedDate(new Date(newEvent.start))
    }
  }

  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-[250px_minmax(56.25rem,1fr)_100px]">
      {/* Sidebar */}
      <Card className="shadow-2xl ">
        <Sidebar
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          holidays={holidays}
          events={events}
          onAddEvent={() => handleAddEvent(selectedDate)}
          onSelectEvent={handleEventClick}
        />
      </Card>

      {/* Main Content */}
      <Card>
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <CalendarHeader view={view} onViewChange={setView} />

          {/* Filters */}
          <div className="p-4 border-b">
            <CalendarFilters
              collaborators={sampleCollaborators}
              patients={samplePatients}
              selectedCollaborators={selectedCollaboratorIds}
              selectedPatients={selectedPatientIds}
              onCollaboratorFilterChange={setSelectedCollaboratorIds}
              onPatientFilterChange={setSelectedPatientIds}
            />
          </div>

          {/* Calendar View */}
          <div className="flex-1 p-4 overflow-auto">
            <CalendarView
              events={events}
              holidays={holidays}
              view={view}
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
              onEventClick={handleEventClick}
              onAddEvent={handleAddEvent}
              filteredCollaboratorIds={selectedCollaboratorIds}
              filteredPatientIds={selectedPatientIds}
            />
          </div>
        </div>
      </Card>

      {/* Modals */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onSave={handleSaveEvent}
        initialDate={initialDate}
        event={selectedEvent || undefined}
        collaborators={sampleCollaborators}
        patients={samplePatients}
      />

      <EventDetails
        event={selectedEvent}
        isOpen={isEventDetailsOpen}
        onClose={() => setIsEventDetailsOpen(false)}
        onEdit={handleEditEvent}
        onDelete={deleteEvent}
      />
    </div>
  )
}
