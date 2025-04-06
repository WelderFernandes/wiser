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
import ServiceDetails from './service-details'
import NewServiceModal from './new-service-modal'
import ProviderScheduleModal from './provider-schedule-modal'
import type {
  Service,
  Attachment,
  ServiceProvider,
  WorkSchedule,
} from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'
import SettingsModal from './settings-modal'
import { useHolidays } from './holiday-service'
import { toast } from '@/components/use-toast'

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

// Função para atualizar os serviços de exemplo para a semana atual
const updateServicesToCurrentWeek = (services: Service[]): Service[] => {
  const today = new Date()
  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth()

  return services.map((service) => {
    // Criar novas datas mantendo o mesmo dia da semana, hora e minuto
    const newStartTime = new Date(service.startTime)
    newStartTime.setFullYear(currentYear)
    newStartTime.setMonth(currentMonth)

    const newEndTime = new Date(service.endTime)
    newEndTime.setFullYear(currentYear)
    newEndTime.setMonth(currentMonth)

    // Ajustar o dia para manter o mesmo dia da semana
    const dayDiff = service.day - newStartTime.getDay()
    newStartTime.setDate(newStartTime.getDate() + dayDiff)
    newEndTime.setDate(newEndTime.getDate() + dayDiff)

    return {
      ...service,
      startTime: newStartTime,
      endTime: newEndTime,
    }
  })
}

export default function Calendar2() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date()) // Data atual
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [showNewServiceModal, setShowNewServiceModal] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [selectedProvider, setSelectedProvider] =
    useState<ServiceProvider | null>(null)
  const [showProviderScheduleModal, setShowProviderScheduleModal] =
    useState<boolean>(false)
  const [selectedProviderForSchedule, setSelectedProviderForSchedule] =
    useState<ServiceProvider | null>(null)
  // Adicionar estado para o modal de configurações
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false)

  // Buscar feriados para o ano atual
  const {
    holidays,
    loading: loadingHolidays,
    error: holidaysError,
  } = useHolidays(currentDate.getFullYear())

  // Mostrar toast de erro se houver problema ao buscar feriados
  useEffect(() => {
    if (holidaysError) {
      toast({
        title: 'Erro ao buscar feriados',
        description: holidaysError.message,
        // variant: 'destructive',
      })
    }
  }, [holidaysError])

  // Lista de prestadores de serviço com horários de trabalho
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>([
    {
      id: '1',
      name: 'Rachel Thompson',
      email: 'rachel.thompson@gmail.com',
      avatar: '/placeholder.svg?height=40&width=40',
      role: 'Cabeleireira',
      available: true,
      workSchedule: {
        monday: { active: true, start: '09:00', end: '18:00' },
        tuesday: { active: true, start: '09:00', end: '18:00' },
        wednesday: { active: true, start: '09:00', end: '18:00' },
        thursday: { active: true, start: '09:00', end: '18:00' },
        friday: { active: true, start: '09:00', end: '18:00' },
        saturday: { active: true, start: '09:00', end: '13:00' },
        sunday: { active: false, start: '00:00', end: '00:00' },
      },
    },
    {
      id: '2',
      name: 'Alex Martinez',
      email: 'alex.martinez@company.com',
      avatar: '/placeholder.svg?height=40&width=40',
      role: 'Barbeiro',
      available: true,
      workSchedule: {
        monday: { active: true, start: '10:00', end: '19:00' },
        tuesday: { active: true, start: '10:00', end: '19:00' },
        wednesday: { active: true, start: '10:00', end: '19:00' },
        thursday: { active: true, start: '10:00', end: '19:00' },
        friday: { active: true, start: '10:00', end: '19:00' },
        saturday: { active: false, start: '00:00', end: '00:00' },
        sunday: { active: false, start: '00:00', end: '00:00' },
      },
    },
    {
      id: '3',
      name: 'Jessica Lee',
      email: 'jessica.lee@company.com',
      avatar: '/placeholder.svg?height=40&width=40',
      role: 'Manicure',
      available: false,
      workSchedule: {
        monday: { active: true, start: '09:00', end: '17:00' },
        tuesday: { active: true, start: '09:00', end: '17:00' },
        wednesday: { active: false, start: '00:00', end: '00:00' },
        thursday: { active: true, start: '09:00', end: '17:00' },
        friday: { active: true, start: '09:00', end: '17:00' },
        saturday: { active: true, start: '09:00', end: '13:00' },
        sunday: { active: false, start: '00:00', end: '00:00' },
      },
    },
    {
      id: '4',
      name: 'Michael Johnson',
      email: 'michael.johnson@company.com',
      avatar: '/placeholder.svg?height=40&width=40',
      role: 'Esteticista',
      available: true,
      workSchedule: {
        monday: { active: true, start: '08:00', end: '16:00' },
        tuesday: { active: true, start: '08:00', end: '16:00' },
        wednesday: { active: true, start: '08:00', end: '16:00' },
        thursday: { active: true, start: '08:00', end: '16:00' },
        friday: { active: true, start: '08:00', end: '16:00' },
        saturday: { active: false, start: '00:00', end: '00:00' },
        sunday: { active: false, start: '00:00', end: '00:00' },
      },
    },
    {
      id: '5',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@company.com',
      avatar: '/placeholder.svg?height=40&width=40',
      role: 'Maquiadora',
      available: true,
      workSchedule: {
        monday: { active: true, start: '11:00', end: '20:00' },
        tuesday: { active: true, start: '11:00', end: '20:00' },
        wednesday: { active: true, start: '11:00', end: '20:00' },
        thursday: { active: true, start: '11:00', end: '20:00' },
        friday: { active: true, start: '11:00', end: '20:00' },
        saturday: { active: true, start: '10:00', end: '15:00' },
        sunday: { active: false, start: '00:00', end: '00:00' },
      },
    },
  ])

  // Serviços de exemplo com datas fixas
  const exampleServices = [
    {
      id: '1',
      title: 'Corte de Cabelo',
      startTime: new Date(2023, 8, 18, 8, 0), // 18 de setembro de 2023, 8:00
      endTime: new Date(2023, 8, 18, 9, 0),
      day: 1, // Segunda-feira
      client: {
        id: '101',
        name: 'João Silva',
        email: 'joao.silva@gmail.com',
        avatar: '/placeholder.svg?height=40&width=40',
      },
      provider: serviceProviders[0], // Rachel Thompson
      serviceType: 'Corte de Cabelo',
      description: 'Corte masculino com máquina e tesoura',
      color: '#FF5733',
      status: 'scheduled' as const,
    },
    {
      id: '2',
      title: 'Barba',
      startTime: new Date(2023, 8, 20, 10, 0), // 20 de setembro de 2023, 10:00
      endTime: new Date(2023, 8, 20, 10, 30),
      day: 3, // Quarta-feira
      client: {
        id: '102',
        name: 'Pedro Alves',
        email: 'pedro.alves@gmail.com',
        avatar: '/placeholder.svg?height=40&width=40',
      },
      provider: serviceProviders[1], // Alex Martinez
      serviceType: 'Barba',
      description: 'Barba completa com toalha quente',
      color: '#33FF57',
      status: 'scheduled' as const,
    },
    {
      id: '3',
      title: 'Manicure',
      startTime: new Date(2023, 8, 19, 12, 0), // 19 de setembro de 2023, 12:00
      endTime: new Date(2023, 8, 19, 13, 0),
      day: 2, // Terça-feira
      client: {
        id: '103',
        name: 'Maria Santos',
        email: 'maria.santos@gmail.com',
        avatar: '/placeholder.svg?height=40&width=40',
      },
      provider: serviceProviders[2], // Jessica Lee
      serviceType: 'Manicure',
      description: 'Manicure com esmaltação em gel',
      color: '#3357FF',
      status: 'completed' as const,
    },
    {
      id: '4',
      title: 'Limpeza de Pele',
      startTime: new Date(2023, 8, 22, 14, 0), // 22 de setembro de 2023, 14:00
      endTime: new Date(2023, 8, 22, 15, 30),
      day: 5, // Sexta-feira
      client: {
        id: '104',
        name: 'Ana Oliveira',
        email: 'ana.oliveira@gmail.com',
        avatar: '/placeholder.svg?height=40&width=40',
      },
      provider: serviceProviders[3], // Michael Johnson
      serviceType: 'Limpeza de Pele',
      description: 'Limpeza de pele profunda com extração',
      color: '#FF33A8',
      status: 'scheduled' as const,
    },
    {
      id: '5',
      title: 'Maquiagem',
      startTime: new Date(2023, 8, 21, 11, 0), // 21 de setembro de 2023, 11:00
      endTime: new Date(2023, 8, 21, 12, 0),
      day: 4, // Quinta-feira
      client: {
        id: '105',
        name: 'Carla Mendes',
        email: 'carla.mendes@gmail.com',
        avatar: '/placeholder.svg?height=40&width=40',
      },
      provider: serviceProviders[4], // Sarah Wilson
      serviceType: 'Maquiagem',
      description: 'Maquiagem para evento social',
      color: '#33FFF5',
      status: 'canceled' as const,
    },
    // Adicione um serviço de longa duração para testar a funcionalidade
    {
      id: '6',
      title: 'Coloração Completa',
      startTime: new Date(2023, 8, 21, 9, 0), // 21 de setembro de 2023, 9:00
      endTime: new Date(2023, 8, 21, 12, 0), // 21 de setembro de 2023, 12:00 (3 horas de duração)
      day: 4, // Quinta-feira
      client: {
        id: '106',
        name: 'Juliana Costa',
        email: 'juliana.costa@gmail.com',
        avatar: '/placeholder.svg?height=40&width=40',
      },
      provider: serviceProviders[0], // Rachel Thompson
      serviceType: 'Coloração',
      description: 'Coloração completa com mechas e hidratação',
      color: '#FF8C33',
      status: 'scheduled' as const,
    },
  ]

  // Atualizar serviços para a semana atual
  const [services, setServices] = useState<Service[]>(() =>
    updateServicesToCurrentWeek(exampleServices),
  )

  const upcomingServices = [
    {
      id: '1',
      title: 'Corte de Cabelo',
      duration: '1 hora',
      description: 'Cliente: João Silva',
      serviceType: 'Corte de Cabelo',
    },
    {
      id: '2',
      title: 'Barba',
      duration: '30 min',
      description: 'Cliente: Pedro Alves',
      serviceType: 'Barba',
    },
  ]

  const recentAttachments: Attachment[] = [
    {
      id: '1',
      name: 'Ficha_Cliente.pdf',
      size: '2.4 MB',
      context: 'Anexado ao Serviço de Coloração',
      icon: 'pdf',
    },
    {
      id: '2',
      name: 'Referencia_Corte.png',
      size: '3.8 MB',
      context: 'Anexado ao Corte de Cabelo',
      icon: 'image',
    },
    {
      id: '3',
      name: 'Tutorial_Maquiagem.mp4',
      size: '12.6 MB',
      context: 'Anexado à Maquiagem',
      icon: 'video',
    },
    {
      id: '4',
      name: 'Agenda_Semanal.docx',
      size: '1.2 MB',
      context: 'Anexado à Agenda',
      icon: 'doc',
    },
  ]

  // Atualiza a lista de serviços próximos com base na data atual
  useEffect(() => {
    // Fechar o painel de detalhes quando a data mudar
    setSelectedService(null)
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

  const handleServiceClick = (service: Service): void => {
    setSelectedService(service)
  }

  const handleCloseServiceDetails = (): void => {
    setSelectedService(null)
  }

  const handleCreateService = (newService: Service): void => {
    // Adicionar uma cor aleatória se não for especificada
    if (!newService.color) {
      newService.color = generateRandomColor()
    }
    setServices([...services, newService])
    setShowNewServiceModal(false)
  }

  const handleDeleteService = (serviceId: string): void => {
    // Atualizar o estado de services removendo o serviço com o ID correspondente
    const updatedServices = services.filter(
      (service) => service.id !== serviceId,
    )
    setServices(updatedServices)

    // Garantir que o selectedService seja definido como null
    setSelectedService(null)

    // Adicionar um console.log para depuração
    console.log(
      `Serviço ${serviceId} excluído. Restantes: ${updatedServices.length}`,
    )
  }

  const handleUpdateService = (updatedService: Service): void => {
    setServices(
      services.map((service) =>
        service.id === updatedService.id ? updatedService : service,
      ),
    )
    setSelectedService(updatedService)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value)
  }

  // Abrir modal de configuração de horário do prestador
  const handleEditProviderSchedule = (provider: ServiceProvider): void => {
    setSelectedProviderForSchedule(provider)
    setShowProviderScheduleModal(true)
  }

  // Salvar horário de trabalho do prestador
  const handleSaveProviderSchedule = (
    provider: ServiceProvider,
    schedule: WorkSchedule,
  ): void => {
    // Atualizar o prestador na lista
    const updatedProviders = serviceProviders.map((p) =>
      p.id === provider.id ? { ...provider, workSchedule: schedule } : p,
    )

    setServiceProviders(updatedProviders)

    // Se o prestador selecionado for o que está sendo editado, atualize-o também
    if (selectedProvider?.id === provider.id) {
      setSelectedProvider({ ...provider, workSchedule: schedule })
    }
  }

  // Filtrar serviços com base na pesquisa e no prestador selecionado
  const filteredServices = services.filter((service) => {
    // Filtrar por texto de pesquisa
    const matchesSearch = searchQuery
      ? service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.serviceType.toLowerCase().includes(searchQuery.toLowerCase())
      : true

    // Filtrar por prestador selecionado
    const matchesProvider = selectedProvider
      ? service.provider.id === selectedProvider.id
      : true

    return matchesSearch && matchesProvider
  })

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

    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6) // Alterado de 4 para incluir domingo

    return {
      start: monday,
      end: sunday,
    }
  }

  // Adicione esta função para filtrar serviços com base na semana atual
  const getFilteredServices = (): Service[] => {
    // Obtenha as datas de início e fim da semana atual
    const weekDates = getWeekDates(currentDate)

    // Defina o início e o fim da semana com horas
    const weekStart = new Date(weekDates.start)
    weekStart.setHours(0, 0, 0, 0)

    const weekEnd = new Date(weekDates.end)
    weekEnd.setHours(23, 59, 59, 999)

    // Filtre os serviços que ocorrem na semana atual
    return filteredServices.filter((service) => {
      const serviceDate = new Date(service.startTime)
      return serviceDate >= weekStart && serviceDate <= weekEnd
    })
  }

  // Contar o número total de serviços na semana atual
  // const totalServices = getFilteredServices().length

  const weekDates = getWeekDates(currentDate)
  const dateRangeText = `${weekDates.start.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })} - ${weekDates.end.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })}`

  // Função para lidar com a seleção de prestador
  const handleSelectProvider = (provider: ServiceProvider | null) => {
    setSelectedProvider(provider)
  }

  // Adicionar função para abrir o modal de configurações
  const handleOpenSettings = () => {
    setShowSettingsModal(true)
  }

  // Adicionar função para criar serviço a partir de um slot de calendário
  const handleCreateServiceFromSlot = (date: Date, hour: number) => {
    // Criar uma cópia exata da data passada
    const selectedDate = new Date(date)

    // Definir a hora mantendo a data original
    selectedDate.setHours(hour, 0, 0, 0)

    // Atualizar a data atual no estado sem alterar o dia
    setCurrentDate(selectedDate)

    // Abrir o modal de novo serviço
    setShowNewServiceModal(true)
  }

  // Adicionar funções para gerenciar prestadores
  const handleAddProvider = (provider: ServiceProvider) => {
    setServiceProviders([...serviceProviders, provider])
  }

  const handleUpdateProvider = (updatedProvider: ServiceProvider) => {
    const updatedProviders = serviceProviders.map((p) =>
      p.id === updatedProvider.id ? updatedProvider : p,
    )
    setServiceProviders(updatedProviders)

    // Se o prestador selecionado for o que está sendo editado, atualize-o também
    if (selectedProvider?.id === updatedProvider.id) {
      setSelectedProvider(updatedProvider)
    }
  }

  const handleDeleteProvider = (providerId: string) => {
    const updatedProviders = serviceProviders.filter((p) => p.id !== providerId)
    setServiceProviders(updatedProviders)

    // Se o prestador selecionado for o que está sendo excluído, limpe a seleção
    if (selectedProvider?.id === providerId) {
      setSelectedProvider(null)
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        upcomingServices={upcomingServices}
        recentAttachments={recentAttachments}
        onCreateService={() => setShowNewServiceModal(true)}
        providers={serviceProviders}
        onSelectProvider={handleSelectProvider}
        selectedProvider={selectedProvider}
        onEditProviderSchedule={handleEditProviderSchedule}
        onOpenSettings={handleOpenSettings}
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
                Agenda de Serviços
                {selectedProvider && (
                  <span className="ml-2 text-lg font-normal text-muted-foreground">
                    {' - '}
                    {selectedProvider.name}
                  </span>
                )}
              </h1>
              <div className="text-sm text-muted-foreground">
                {formatDate(currentDate)} {'\xB7'} Semana{' '}
                {getWeekNumber(currentDate)}
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
                <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-primary animate-spin"></div>
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
                placeholder="Buscar serviços..."
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
                <div className="h-12 w-12 rounded-full border-4 border-t-transparent border-primary animate-spin mb-4"></div>
                <p className="text-muted-foreground">Carregando agenda...</p>
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
                services={getFilteredServices()}
                currentDate={currentDate}
                onServiceClick={handleServiceClick}
                onCreateService={handleCreateServiceFromSlot}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Service Details Drawer */}
      {selectedService && (
        <ServiceDetails
          service={selectedService}
          open={!!selectedService}
          onClose={handleCloseServiceDetails}
          onDelete={handleDeleteService}
          onUpdate={handleUpdateService}
          providers={serviceProviders}
          services={services}
        />
      )}
      {/* New Service Modal */}
      <NewServiceModal
        open={showNewServiceModal}
        onClose={() => setShowNewServiceModal(false)}
        onSave={handleCreateService}
        currentDate={currentDate}
        providers={serviceProviders}
        selectedProvider={selectedProvider}
      />
      {/* Provider Schedule Modal */}
      {selectedProviderForSchedule && (
        <ProviderScheduleModal
          provider={selectedProviderForSchedule}
          open={showProviderScheduleModal}
          onClose={() => setShowProviderScheduleModal(false)}
          onSave={handleSaveProviderSchedule}
        />
      )}
      {/* Settings Modal */}
      <SettingsModal
        open={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        providers={serviceProviders}
        onUpdateProvider={handleUpdateProvider}
        onAddProvider={handleAddProvider}
        onDeleteProvider={handleDeleteProvider}
      />
    </div>
  )
}
