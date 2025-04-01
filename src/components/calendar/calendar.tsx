'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Search, CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar as CalendarPicker } from '@/components/ui/calendar'
import Sidebar from './sidebar'
import CalendarGrid from './calendar-grid'
import MeetingDetails from './meeting-details'
import NewMeetingModal from './new-meeting-modal'
import { motion, AnimatePresence } from 'framer-motion'
import { Attachment, Meeting } from '@/lib/types'
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '../ui/drawer'

// Função para gerar uma cor aleatória
export const generateRandomColor = (): string => {
  const colors = [
    '#FF5733',
    '#33FF57',
    '#3357FF',
    '#FF33A8',
    '#33FFF5',
    '#FF8C33',
    '#8C33FF',
    '#33FF8C',
    '#FF3333',
    '#33FFFF',
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

// Função para atualizar os eventos de exemplo para a semana atual
const updateEventsToCurrentWeek = (events: Meeting[]): Meeting[] => {
  const today = new Date()
  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth()

  return events.map((event) => {
    // Criar novas datas mantendo o mesmo dia da semana, hora e minuto
    const newStartTime = new Date(event.startTime)
    newStartTime.setFullYear(currentYear)
    newStartTime.setMonth(currentMonth)

    const newEndTime = new Date(event.endTime)
    newEndTime.setFullYear(currentYear)
    newEndTime.setMonth(currentMonth)

    // Ajustar o dia para manter o mesmo dia da semana
    const dayDiff = event.day - newStartTime.getDay()
    newStartTime.setDate(newStartTime.getDate() + dayDiff)
    newEndTime.setDate(newEndTime.getDate() + dayDiff)

    return {
      ...event,
      startTime: newStartTime,
      endTime: newEndTime,
    }
  })
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date()) // Data atual
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)
  const [showNewMeetingModal, setShowNewMeetingModal] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Eventos de exemplo com datas fixas
  const exampleMeetings = [
    {
      id: '1',
      title: 'Criar um aplicativo móvel com tema de viagem',
      startTime: new Date(2023, 8, 18, 8, 0), // 18 de setembro de 2023, 8:00
      endTime: new Date(2023, 8, 18, 10, 0),
      day: 1, // Segunda-feira
      attendees: [
        {
          id: '1',
          name: 'Rachel Thompson',
          email: 'rachel.thompson@gmail.com',
          avatar: '/placeholder.svg?height=40&width=40',
        },
        {
          id: '2',
          name: 'Alex Martinez',
          email: 'alex.martinez@company.com',
          avatar: '/placeholder.svg?height=40&width=40',
        },
        {
          id: '3',
          name: 'Jessica Lee',
          email: 'jessica.lee@company.com',
          avatar: '/placeholder.svg?height=40&width=40',
        },
      ],
      meetingType: 'google',
      meetingUrl: '#',
      description:
        'Sessão de brainstorming para novo aplicativo móvel com tema de viagem',
      color: '#FF5733',
    },
    {
      id: '2',
      title: 'Criar uma landing page com tema de negócios',
      startTime: new Date(2023, 8, 20, 10, 0), // 20 de setembro de 2023, 10:00
      endTime: new Date(2023, 8, 20, 12, 0),
      day: 3, // Quarta-feira
      attendees: [
        {
          id: '1',
          name: 'Rachel Thompson',
          email: 'rachel.thompson@gmail.com',
          avatar: '/placeholder.svg?height=40&width=40',
        },
        {
          id: '2',
          name: 'Alex Martinez',
          email: 'alex.martinez@company.com',
          avatar: '/placeholder.svg?height=40&width=40',
        },
      ],
      meetingType: 'zoom',
      meetingUrl: '#',
      description:
        'Planejamento de design e desenvolvimento para nova landing page de negócios',
      color: '#33FF57',
    },
    {
      id: '3',
      title: 'Criar um dashboard com tema de agência',
      startTime: new Date(2023, 8, 19, 12, 0), // 19 de setembro de 2023, 12:00
      endTime: new Date(2023, 8, 19, 13, 0),
      day: 2, // Terça-feira
      attendees: [
        {
          id: '1',
          name: 'Rachel Thompson',
          email: 'rachel.thompson@gmail.com',
          avatar: '/placeholder.svg?height=40&width=40',
        },
        {
          id: '3',
          name: 'Jessica Lee',
          email: 'jessica.lee@company.com',
          avatar: '/placeholder.svg?height=40&width=40',
        },
      ],
      meetingType: 'teams',
      meetingUrl: '#',
      description:
        'Sessão de planejamento para design e funcionalidade do dashboard da agência',
      color: '#3357FF',
    },
    {
      id: '4',
      title: 'Revisão do Sistema de Design',
      startTime: new Date(2023, 8, 22, 14, 0), // 22 de setembro de 2023, 14:00
      endTime: new Date(2023, 8, 22, 15, 30),
      day: 5, // Sexta-feira
      attendees: [
        {
          id: '3',
          name: 'Jessica Lee',
          email: 'jessica.lee@company.com',
          avatar: '/placeholder.svg?height=40&width=40',
        },
      ],
      meetingType: 'zoom',
      meetingUrl: '#',
      description: 'Revisar componentes e documentação do sistema de design',
      color: '#FF33A8',
    },
    {
      id: '5',
      title: 'Demonstração para Cliente',
      startTime: new Date(2023, 8, 21, 11, 0), // 21 de setembro de 2023, 11:00
      endTime: new Date(2023, 8, 21, 12, 0),
      day: 4, // Quinta-feira
      attendees: [
        {
          id: '1',
          name: 'Rachel Thompson',
          email: 'rachel.thompson@gmail.com',
          avatar: '/placeholder.svg?height=40&width=40',
        },
        {
          id: '2',
          name: 'Alex Martinez',
          email: 'alex.martinez@company.com',
          avatar: '/placeholder.svg?height=40&width=40',
        },
      ],
      meetingType: 'teams',
      meetingUrl: '#',
      description: 'Demonstração de produto para stakeholders do cliente',
      color: '#33FFF5',
    },
    // Adicione um evento de longa duração para testar a funcionalidade
    {
      id: '6',
      title: 'Workshop de dia inteiro: Estratégia de Produto',
      startTime: new Date(2023, 8, 21, 9, 0), // 21 de setembro de 2023, 9:00
      endTime: new Date(2023, 8, 21, 16, 0), // 21 de setembro de 2023, 16:00 (7 horas de duração)
      day: 4, // Quinta-feira
      attendees: [
        {
          id: '1',
          name: 'Rachel Thompson',
          email: 'rachel.thompson@gmail.com',
          avatar: '/placeholder.svg?height=40&width=40',
        },
        {
          id: '2',
          name: 'Alex Martinez',
          email: 'alex.martinez@company.com',
          avatar: '/placeholder.svg?height=40&width=40',
        },
        {
          id: '3',
          name: 'Jessica Lee',
          email: 'jessica.lee@company.com',
          avatar: '/placeholder.svg?height=40&width=40',
        },
        {
          id: '4',
          name: 'Michael Johnson',
          email: 'michael.johnson@company.com',
          avatar: '/placeholder.svg?height=40&width=40',
        },
        {
          id: '5',
          name: 'Sarah Wilson',
          email: 'sarah.wilson@company.com',
          avatar: '/placeholder.svg?height=40&width=40',
        },
      ],
      meetingType: 'google',
      meetingUrl: '#',
      description:
        'Workshop abrangente cobrindo todos os aspectos da nossa estratégia de produto para o Q4',
      color: '#FF8C33',
    },
  ]

  // Atualizar eventos para a semana atual
  const [meetings, setMeetings] = useState<Meeting[]>(() =>
    updateEventsToCurrentWeek(exampleMeetings),
  )

  const upcomingMeetings = [
    {
      id: '1',
      title: 'Criar um aplicativo móvel',
      duration: '2 horas',
      description: 'Sessão de brainstorming para novo aplicativo móvel',
      meetingType: 'google',
    },
    {
      id: '2',
      title: 'Criar uma landing page',
      duration: '2 horas',
      description: 'Planejamento de design e desenvolvimento',
      meetingType: 'zoom',
    },
  ]

  const recentAttachments: Attachment[] = [
    {
      id: '1',
      name: '04_Readme.pdf',
      size: '2.4 MB',
      context: 'Anexado à Reunião de Estratégia',
      icon: 'pdf',
    },
    {
      id: '2',
      name: 'Design_Mockup_V2.png',
      size: '3.8 MB',
      context: 'Anexado à Revisão de Design',
      icon: 'image',
    },
    {
      id: '3',
      name: 'Product_Demo.mp4',
      size: '12.6 MB',
      context: 'Anexado à Discussão de MVP',
      icon: 'video',
    },
    {
      id: '4',
      name: 'Meeting_Notes.docx',
      size: '1.2 MB',
      context: 'Anexado à Revisão de Design',
      icon: 'doc',
    },
  ]

  // Atualiza a lista de reuniões próximas com base na data atual
  useEffect(() => {
    // Fechar o painel de detalhes quando a data mudar
    setSelectedMeeting(null)
  }, [currentDate])

  const handlePrevious = (): void => {
    setIsLoading(true)
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() - 7)

    // Simular um pequeno atraso para mostrar a animação de carregamento
    setTimeout(() => {
      setCurrentDate(newDate)
      setIsLoading(false)
    }, 300)
  }

  const handleNext = (): void => {
    setIsLoading(true)
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + 7)

    // Simular um pequeno atraso para mostrar a animação de carregamento
    setTimeout(() => {
      setCurrentDate(newDate)
      setIsLoading(false)
    }, 300)
  }

  const handleToday = (): void => {
    setIsLoading(true)

    // Simular um pequeno atraso para mostrar a animação de carregamento
    setTimeout(() => {
      setCurrentDate(new Date()) // Usar a data atual
      setIsLoading(false)
    }, 300)
  }

  const handleMeetingClick = (meeting: Meeting): void => {
    setSelectedMeeting(meeting)
  }

  const handleCloseMeetingDetails = (): void => {
    setSelectedMeeting(null)
  }

  const handleCreateMeeting = (newMeeting: Meeting): void => {
    // Adicionar uma cor aleatória se não for especificada
    if (!newMeeting.color) {
      newMeeting.color = generateRandomColor()
    }
    setMeetings([...meetings, newMeeting])
    setShowNewMeetingModal(false)
  }

  const handleDeleteMeeting = (meetingId: string): void => {
    setMeetings(meetings.filter((meeting) => meeting.id !== meetingId))
    setSelectedMeeting(null)
  }

  const handleUpdateMeeting = (updatedMeeting: Meeting): void => {
    setMeetings(
      meetings.map((meeting) =>
        meeting.id === updatedMeeting.id ? updatedMeeting : meeting,
      ),
    )
    setSelectedMeeting(updatedMeeting)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value)
  }

  const filteredMeetings = searchQuery
    ? meetings.filter(
        (meeting) =>
          meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          meeting.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : meetings

  // Formatar data para exibição
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  // Obter número da semana
  const getWeekNumber = (date: Date): number => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
    const pastDaysOfYear =
      (date.getTime() - firstDayOfYear.getTime()) / 86400000
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
  }

  // Obter datas de início e fim da semana atual
  const getWeekDates = (date: Date): { start: Date; end: Date } => {
    const day = date.getDay()
    const diff = date.getDate() - day + (day === 0 ? -6 : 1) // Ajustar quando o dia é domingo
    const monday = new Date(date)
    monday.setDate(diff)

    const friday = new Date(monday)
    friday.setDate(monday.getDate() + 4)

    return {
      start: monday,
      end: friday,
    }
  }

  // Adicione esta função para filtrar reuniões com base na semana atual
  const getFilteredMeetings = (): Meeting[] => {
    // Obtenha as datas de início e fim da semana atual
    const weekDates = getWeekDates(currentDate)

    // Defina o início e o fim da semana com horas
    const weekStart = new Date(weekDates.start)
    weekStart.setHours(0, 0, 0, 0)

    const weekEnd = new Date(weekDates.end)
    weekEnd.setHours(23, 59, 59, 999)

    // Filtre as reuniões que ocorrem na semana atual
    return filteredMeetings.filter((meeting) => {
      const meetingDate = new Date(meeting.startTime)
      return meetingDate >= weekStart && meetingDate <= weekEnd
    })
  }

  // Contar o número total de eventos na semana atual
  const totalEvents = getFilteredMeetings().length

  const weekDates = getWeekDates(currentDate)
  const dateRangeText = `${weekDates.start.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })} - ${weekDates.end.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })}`

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      {totalEvents}
      <Sidebar
        upcomingMeetings={upcomingMeetings}
        recentAttachments={recentAttachments}
        onCreateMeeting={() => setShowNewMeetingModal(true)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="border-b border-border p-4 flex justify-between items-center"
        >
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                Calendário
              </h1>
              <div className="text-sm text-muted-foreground">
                {formatDate(currentDate)} · Semana {getWeekNumber(currentDate)}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              disabled={isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={handleToday}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-primary animate-spin" />
              ) : (
                'Hoje'
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={isLoading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <div className="relative ml-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar reuniões..."
                className="pl-8 w-[250px]"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <div className="border-l border-border pl-4 ml-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{dateRangeText}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <CalendarPicker
                    mode="single"
                    selected={currentDate}
                    onSelect={(date) => date && setCurrentDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </motion.header>

        {/* Calendar Grid with Loading State */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex items-center justify-center"
            >
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-full border-4 border-t-transparent border-primary animate-spin mb-4" />
                <p className="text-muted-foreground">
                  Carregando calendário...
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="calendar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 overflow-hidden"
            >
              <CalendarGrid
                meetings={getFilteredMeetings()}
                currentDate={currentDate}
                onMeetingClick={handleMeetingClick}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {/* Meeting Details Sidebar */}

        {selectedMeeting && (
          <Drawer
            open={!!selectedMeeting}
            onClose={handleCloseMeetingDetails}
            direction="right"
          >
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Detalhes da Reunião</DrawerTitle>
              </DrawerHeader>
              <DrawerContent>
                <MeetingDetails
                  meeting={selectedMeeting!}
                  onClose={handleCloseMeetingDetails}
                  onDelete={handleDeleteMeeting}
                  onUpdate={handleUpdateMeeting}
                />
              </DrawerContent>
              <DrawerFooter>
                <Button onClick={handleCloseMeetingDetails}>Fechar</Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
          // <motion.div
          //   initial={{ x: 320, opacity: 0 }}
          //   animate={{ x: 0, opacity: 1 }}
          //   exit={{ x: 320, opacity: 0 }}
          //   transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          // >
          //   <MeetingDetails
          //     meeting={selectedMeeting}
          //     onClose={handleCloseMeetingDetails}
          //     onDelete={handleDeleteMeeting}
          //     onUpdate={handleUpdateMeeting}
          //   />
          // </motion.div>
        )}
      </AnimatePresence>

      {/* New Meeting Modal */}
      {showNewMeetingModal && (
        <NewMeetingModal
          onClose={() => setShowNewMeetingModal(false)}
          onSave={handleCreateMeeting}
          currentDate={currentDate}
        />
      )}
    </div>
  )
}
