"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Service, ServiceProvider } from "@/lib/types"
import { generateRandomColor } from "./calendar"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "@/components/ui/sheet"

interface EditServiceModalProps {
  service: Service
  open: boolean
  onClose: () => void
  onSave: (service: Service) => void
  providers?: ServiceProvider[]
}

// Lista de cores predefinidas para seleção
const colorOptions = [
  { value: "#FF5733", label: "Vermelho" },
  { value: "#33FF57", label: "Verde" },
  { value: "#3357FF", label: "Azul" },
  { value: "#FF33A8", label: "Rosa" },
  { value: "#33FFF5", label: "Turquesa" },
  { value: "#FF8C33", label: "Laranja" },
  { value: "#8C33FF", label: "Roxo" },
  { value: "#33FF8C", label: "Verde Claro" },
  { value: "#FF3333", label: "Vermelho Vivo" },
  { value: "#33FFFF", label: "Ciano" },
]

// Lista de tipos de serviço
const serviceTypes = [
  "Corte de Cabelo",
  "Barba",
  "Coloração",
  "Manicure",
  "Pedicure",
  "Depilação",
  "Massagem",
  "Limpeza de Pele",
  "Maquiagem",
  "Tratamento Capilar",
]

export default function EditServiceModal({ service, open, onClose, onSave, providers = [] }: EditServiceModalProps) {
  // Adicionar validação para impedir hora de término inferior à hora de início
  const [startTime, setStartTime] = useState(service.startTime.toTimeString().split(" ")[0].substring(0, 5))
  const [endTime, setEndTime] = useState(service.endTime.toTimeString().split(" ")[0].substring(0, 5))
  const [timeError, setTimeError] = useState<string | null>(null)
  const [title, setTitle] = useState(service.title)
  const [description, setDescription] = useState(service.description)
  const [date, setDate] = useState(service.startTime.toISOString().split("T")[0])
  const [serviceType, setServiceType] = useState<string>(service.serviceType)
  const [providerId, setProviderId] = useState<string>(service.provider.id)
  const [clientName, setClientName] = useState(service.client.name)
  const [clientEmail, setClientEmail] = useState(service.client.email)
  const [color, setColor] = useState<string>(service.color || generateRandomColor())
  const [status, setStatus] = useState<"scheduled" | "completed" | "canceled">(service.status)

  // Carregar os provedores disponíveis
  useEffect(() => {
    if (providers.length === 0) return

    // Se o provedor atual não estiver na lista, selecione o primeiro
    if (!providers.some((p) => p.id === providerId)) {
      setProviderId(providers[0].id)
    }
  }, [providers, providerId])

  // Modificar a função que atualiza o horário de término
  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndTime = e.target.value
    setEndTime(newEndTime)

    // Validar se o horário de término é posterior ao de início
    if (newEndTime < startTime) {
      setTimeError("O horário de término deve ser posterior ao horário de início")
    } else {
      setTimeError(null)
    }
  }

  // Modificar a função que atualiza o horário de início
  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartTime = e.target.value
    setStartTime(newStartTime)

    // Validar se o horário de término é posterior ao de início
    if (endTime < newStartTime) {
      setTimeError("O horário de término deve ser posterior ao horário de início")
    } else {
      setTimeError(null)
    }
  }

  // Modificar o handleSubmit para verificar se há erros antes de salvar
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Verificar se há erros de validação
    if (endTime < startTime) {
      setTimeError("O horário de término deve ser posterior ao horário de início")
      return
    }

    // Criar objetos de data de início e fim
    const startDate = new Date(`${date}T${startTime}:00`)
    const endDate = new Date(`${date}T${endTime}:00`)

    // Calcular dia (1-5 para Seg-Sex)
    const dayOfWeek = startDate.getDay()
    const day = dayOfWeek === 0 ? 7 : dayOfWeek

    // Encontrar o prestador selecionado
    const provider = providers.find((p) => p.id === providerId) || service.provider

    // Atualizar serviço
    const updatedService: Service = {
      ...service,
      title,
      description,
      startTime: startDate,
      endTime: endDate,
      day,
      serviceType,
      provider,
      color,
      status,
      client: {
        ...service.client,
        name: clientName,
        email: clientEmail,
      },
    }

    onSave(updatedService)
    onClose()
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle>Editar Serviço</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Título
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título do serviço"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="serviceType" className="text-sm font-medium">
              Tipo de Serviço
            </label>
            <Select value={serviceType} onValueChange={setServiceType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de serviço" />
              </SelectTrigger>
              <SelectContent>
                {serviceTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {providers.length > 0 && (
            <div className="space-y-2">
              <label htmlFor="provider" className="text-sm font-medium">
                Prestador de Serviço
              </label>
              <Select value={providerId} onValueChange={setProviderId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o prestador" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.name} - {provider.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="clientName" className="text-sm font-medium">
              Nome do Cliente
            </label>
            <Input
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Nome do cliente"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="clientEmail" className="text-sm font-medium">
              Email do Cliente
            </label>
            <Input
              id="clientEmail"
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="Email do cliente"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium">
              Status
            </label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as "scheduled" | "completed" | "canceled")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">Agendado</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
                <SelectItem value="canceled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Observações
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Observações sobre o serviço"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="date" className="text-sm font-medium">
              Data
            </label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>

          {/* Atualizar os inputs de hora no formulário */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="startTime" className="text-sm font-medium">
                Hora de Início
              </label>
              <Input id="startTime" type="time" value={startTime} onChange={handleStartTimeChange} required />
            </div>

            <div className="space-y-2">
              <label htmlFor="endTime" className="text-sm font-medium">
                Hora de Término
              </label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={handleEndTimeChange}
                required
                className={timeError ? "border-red-500" : ""}
              />
            </div>
          </div>

          {/* Exibir mensagem de erro se houver */}
          {timeError && <div className="text-red-500 text-sm mt-1">{timeError}</div>}

          <div className="space-y-2">
            <label htmlFor="color" className="text-sm font-medium">
              Cor do Serviço
            </label>
            <Select value={color} onValueChange={setColor}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma cor">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: color }} />
                    {colorOptions.find((c) => c.value === color)?.label || "Cor personalizada"}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {colorOptions.map((colorOption) => (
                  <SelectItem key={colorOption.value} value={colorOption.value}>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: colorOption.value }} />
                      {colorOption.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <SheetFooter className="pt-4 flex flex-row gap-2 justify-end">
            <SheetClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </SheetClose>
            <Button type="submit">Salvar Alterações</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}

