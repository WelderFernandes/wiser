"use client"

import type React from "react"

import { useState } from "react"
import { Clock, User, ChevronRight, Trash2, Edit } from "lucide-react"
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
import type { Service, ServiceProvider } from "@/lib/types"
import EditServiceModal from "./edit-service-modal"
import ProposeTimeModal from "./propose-time-modal"
import { motion } from "framer-motion"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/use-toast"

interface ServiceDetailsProps {
  service: Service
  open: boolean
  onClose: () => void
  onDelete: (serviceId: string) => void
  onUpdate: (service: Service) => void
  providers: ServiceProvider[]
  services: Service[]
}

export default function ServiceDetails({
  service,
  open,
  onClose,
  onDelete,
  onUpdate,
  providers,
  services,
}: ServiceDetailsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)
  const [showEditModal, setShowEditModal] = useState<boolean>(false)
  const [showProposeTimeModal, setShowProposeTimeModal] = useState<boolean>(false)

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

  // Corrigir a função de exclusão para fechar o drawer antes de excluir o serviço
  const handleDelete = (): void => {
    // Primeiro fechar o drawer para evitar problemas de UI
    onClose()

    // Usar setTimeout para garantir que o drawer seja fechado antes da exclusão
    setTimeout(() => {
      onDelete(service.id)
      setShowDeleteDialog(false)
    }, 300)
  }

  // Obter estilo para o serviço com base na cor personalizada
  const getServiceStyle = (): React.CSSProperties => {
    if (!service.color) return {}

    return {
      backgroundColor: `${service.color}20`, // 20 é a opacidade em hex (12.5%)
      borderLeftColor: service.color,
      borderLeftWidth: "4px",
    }
  }

  // Calcular duração do serviço em horas e minutos
  const getServiceDuration = (): string => {
    const durationMs = service.endTime.getTime() - service.startTime.getTime()
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

  // Obter cor e texto para o status
  const getStatusBadge = () => {
    switch (service.status) {
      case "scheduled":
        return <Badge className="bg-blue-500">Agendado</Badge>
      case "completed":
        return <Badge className="bg-green-500">Concluído</Badge>
      case "canceled":
        return <Badge className="bg-red-500">Cancelado</Badge>
      default:
        return <Badge>Agendado</Badge>
    }
  }

  // Função para lidar com a proposta de novo horário
  const handleProposeTime = (service: Service, newStartTime: Date, newEndTime: Date, newProviderId?: string) => {
    // Criar uma cópia do serviço com o novo horário proposto
    let updatedService = {
      ...service,
      startTime: newStartTime,
      endTime: newEndTime,
    }

    // Se um novo profissional foi selecionado, atualize o provedor
    if (newProviderId) {
      const newProvider = providers.find((p) => p.id === newProviderId)
      if (newProvider) {
        updatedService = {
          ...updatedService,
          provider: newProvider,
        }
      }
    }

    // Atualizar o serviço
    onUpdate(updatedService)

    // Mostrar notificação de sucesso
    toast({
      title: "Novo horário proposto",
      description: `O serviço foi reagendado para ${formatDate(newStartTime)} às ${newStartTime.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}${newProviderId ? ` com ${updatedService.provider.name}` : ""}`,
    })
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          {/* Header */}
          <SheetHeader className="border-b border-border pb-4 mb-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <SheetTitle className="text-lg font-semibold">{service.title}</SheetTitle>
                  {getStatusBadge()}
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatDate(service.startTime)} · Semana {getWeekNumber(service.startTime)}
                </p>
                <div className="mt-1 text-sm">{formatTimeRange(service.startTime, service.endTime)}</div>
                <div className="mt-1 text-xs text-muted-foreground">Duração: {getServiceDuration()}</div>
              </div>
              <div className="flex space-x-1">
                <Button variant="ghost" size="icon" onClick={() => setShowEditModal(true)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setShowDeleteDialog(true)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </SheetHeader>

          {/* Content */}
          <div className="space-y-6">
            {/* Propose new time */}
            <div className="flex items-center justify-between">
              <span className="text-sm">Propor novo horário</span>
              <Button variant="ghost" size="sm" className="h-8" onClick={() => setShowProposeTimeModal(true)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Provider */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium mb-2">Prestador de Serviço</h3>
              <motion.div
                className="flex items-center gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Avatar>
                  <AvatarImage src={service.provider.avatar} alt={service.provider.name} />
                  <AvatarFallback>{getInitials(service.provider.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{service.provider.name}</div>
                  <div className="text-xs text-muted-foreground">{service.provider.role}</div>
                </div>
              </motion.div>
            </div>

            {/* Client */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium mb-2">Cliente</h3>
              <motion.div
                className="flex items-center gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Avatar>
                  <AvatarImage src={service.client.avatar} alt={service.client.name} />
                  <AvatarFallback>{getInitials(service.client.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{service.client.name}</div>
                  <div className="text-xs text-muted-foreground">{service.client.email}</div>
                </div>
              </motion.div>
            </div>

            {/* Service details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Lembrete: 30min antes</span>
              </div>

              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Tipo de serviço: {service.serviceType}</span>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Observações</h3>
              <p className="text-sm">{service.description}</p>
            </div>
          </div>

          {/* Footer */}
          <SheetFooter className="border-t border-border mt-6 pt-4 flex flex-row justify-between">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={() => {
                  const updatedService = { ...service, status: "completed" as const }
                  onUpdate(updatedService)
                }}
              >
                Concluir
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={() => {
                  const updatedService = { ...service, status: "canceled" as const }
                  onUpdate(updatedService)
                }}
              >
                Cancelar
              </Button>
            </motion.div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>Isso excluirá permanentemente o serviço "{service.title}".</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Service Modal */}
      {showEditModal && (
        <EditServiceModal
          service={service}
          open={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={onUpdate}
        />
      )}

      {/* Propose Time Modal */}
      {showProposeTimeModal && (
        <ProposeTimeModal
          service={service}
          open={showProposeTimeModal}
          onClose={() => setShowProposeTimeModal(false)}
          onPropose={handleProposeTime}
          providers={providers}
          services={services}
        />
      )}
    </>
  )
}

