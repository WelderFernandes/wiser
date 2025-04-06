"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { Service, ServiceProvider } from "@/lib/types"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "@/components/ui/sheet"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ProposeTimeModalProps {
  service: Service
  open: boolean
  onClose: () => void
  onPropose: (service: Service, newStartTime: Date, newEndTime: Date, newProviderId?: string) => void
  providers: ServiceProvider[]
  services: Service[]
}

export default function ProposeTimeModal({
  service,
  open,
  onClose,
  onPropose,
  providers,
  services,
}: ProposeTimeModalProps) {
  const [date, setDate] = useState<Date | undefined>(new Date(service.startTime))
  const [startTime, setStartTime] = useState(service.startTime.toTimeString().split(" ")[0].substring(0, 5))
  const [endTime, setEndTime] = useState(service.endTime.toTimeString().split(" ")[0].substring(0, 5))
  const [timeError, setTimeError] = useState<string | null>(null)
  const [suggestedTimes, setSuggestedTimes] = useState<
    Array<{
      start: string
      end: string
      date: Date
      available: boolean
    }>
  >([])
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | undefined>(undefined)
  const [selectedProviderId, setSelectedProviderId] = useState<string>(service.provider.id)
  const [availableTimes, setAvailableTimes] = useState<{ [key: string]: boolean }>({})
  const [showNoSuggestionsAlert, setShowNoSuggestionsAlert] = useState(false)

  // Gerar horários sugeridos quando o modal é aberto ou quando o provedor muda
  useEffect(() => {
    if (open) {
      generateSuggestedTimes(selectedProviderId)
    }
  }, [open, selectedProviderId])

  // Obter iniciais do nome
  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  // Verificar se um horário está disponível para o provedor selecionado
  const isTimeSlotAvailable = (providerId: string, startDate: Date, endDate: Date): boolean => {
    // Ignorar o próprio serviço atual ao verificar conflitos
    const otherServices = services.filter((s) => s.id !== service.id && s.provider.id === providerId)

    // Verificar se há algum conflito com outros serviços
    const hasConflict = otherServices.some((s) => {
      const serviceStart = new Date(s.startTime)
      const serviceEnd = new Date(s.endTime)

      // Verificar se há sobreposição de horários
      return (
        (startDate >= serviceStart && startDate < serviceEnd) || // Início do novo horário durante outro serviço
        (endDate > serviceStart && endDate <= serviceEnd) || // Fim do novo horário durante outro serviço
        (startDate <= serviceStart && endDate >= serviceEnd) // Novo horário engloba completamente outro serviço
      )
    })

    return !hasConflict
  }

  // Gerar horários sugeridos com base no serviço atual e disponibilidade do provedor
  const generateSuggestedTimes = (providerId: string) => {
    const serviceDuration = service.endTime.getTime() - service.startTime.getTime()
    const durationMinutes = Math.floor(serviceDuration / (1000 * 60))

    // Horários de trabalho padrão (8h às 18h)
    const workStartHour = 8
    const workEndHour = 18

    const suggestions = []
    const availabilityMap: { [key: string]: boolean } = {}

    // Gerar várias sugestões e verificar disponibilidade

    // 1. Mesmo dia, próximas horas
    for (let hour = service.startTime.getHours() + 1; hour <= workEndHour - Math.ceil(durationMinutes / 60); hour++) {
      const suggestion1Start = new Date(service.startTime)
      suggestion1Start.setHours(hour, 0, 0)
      const suggestion1End = new Date(suggestion1Start)
      suggestion1End.setTime(suggestion1Start.getTime() + serviceDuration)

      const isAvailable = isTimeSlotAvailable(providerId, suggestion1Start, suggestion1End)
      const timeKey = `${format(suggestion1Start, "yyyy-MM-dd")}-${hour}`
      availabilityMap[timeKey] = isAvailable

      if (isAvailable) {
        suggestions.push({
          start: suggestion1Start.toTimeString().split(" ")[0].substring(0, 5),
          end: suggestion1End.toTimeString().split(" ")[0].substring(0, 5),
          date: suggestion1Start,
          available: isAvailable,
        })

        // Limitar a 1 sugestão para o mesmo dia
        break
      }
    }

    // 2. Próximo dia, vários horários
    const nextDay = new Date(service.startTime)
    nextDay.setDate(nextDay.getDate() + 1)

    for (let hour = workStartHour; hour <= workEndHour - Math.ceil(durationMinutes / 60); hour += 2) {
      const suggestion2Start = new Date(nextDay)
      suggestion2Start.setHours(hour, 0, 0)
      const suggestion2End = new Date(suggestion2Start)
      suggestion2End.setTime(suggestion2Start.getTime() + serviceDuration)

      const isAvailable = isTimeSlotAvailable(providerId, suggestion2Start, suggestion2End)
      const timeKey = `${format(suggestion2Start, "yyyy-MM-dd")}-${hour}`
      availabilityMap[timeKey] = isAvailable

      if (isAvailable) {
        suggestions.push({
          start: suggestion2Start.toTimeString().split(" ")[0].substring(0, 5),
          end: suggestion2End.toTimeString().split(" ")[0].substring(0, 5),
          date: suggestion2Start,
          available: isAvailable,
        })

        // Limitar a 1 sugestão para o próximo dia
        break
      }
    }

    // 3. Dois dias depois, vários horários
    const dayAfterNext = new Date(service.startTime)
    dayAfterNext.setDate(dayAfterNext.getDate() + 2)

    for (let hour = workStartHour; hour <= workEndHour - Math.ceil(durationMinutes / 60); hour += 2) {
      const suggestion3Start = new Date(dayAfterNext)
      suggestion3Start.setHours(hour, 0, 0)
      const suggestion3End = new Date(suggestion3Start)
      suggestion3End.setTime(suggestion3Start.getTime() + serviceDuration)

      const isAvailable = isTimeSlotAvailable(providerId, suggestion3Start, suggestion3End)
      const timeKey = `${format(suggestion3Start, "yyyy-MM-dd")}-${hour}`
      availabilityMap[timeKey] = isAvailable

      if (isAvailable) {
        suggestions.push({
          start: suggestion3Start.toTimeString().split(" ")[0].substring(0, 5),
          end: suggestion3End.toTimeString().split(" ")[0].substring(0, 5),
          date: suggestion3Start,
          available: isAvailable,
        })

        // Limitar a 1 sugestão para dois dias depois
        break
      }
    }

    // Atualizar estado com as sugestões e mapa de disponibilidade
    setSuggestedTimes(suggestions.slice(0, 3))
    setAvailableTimes(availabilityMap)

    // Mostrar alerta se não houver sugestões disponíveis
    setShowNoSuggestionsAlert(suggestions.length === 0)

    // Limpar seleção se não houver sugestões
    if (suggestions.length === 0) {
      setSelectedTimeSlot(undefined)
    }
  }

  // Verificar disponibilidade do horário personalizado selecionado
  const checkCustomTimeAvailability = () => {
    if (!date) return false

    const dateStr = date.toISOString().split("T")[0]
    const startDate = new Date(`${dateStr}T${startTime}:00`)
    const endDate = new Date(`${dateStr}T${endTime}:00`)

    return isTimeSlotAvailable(selectedProviderId, startDate, endDate)
  }

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

  // Selecionar um horário sugerido
  const handleSelectSuggestion = (index: number) => {
    const suggestion = suggestedTimes[index]
    setDate(suggestion.date)
    setStartTime(suggestion.start)
    setEndTime(suggestion.end)
    setSelectedTimeSlot(`option-${index}`)
  }

  // Mudar o profissional selecionado
  const handleProviderChange = (providerId: string) => {
    setSelectedProviderId(providerId)
    setSelectedTimeSlot(undefined)
  }

  // Enviar proposta de novo horário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!date) {
      setTimeError("Selecione uma data válida")
      return
    }

    // Verificar se há erros de validação
    if (endTime < startTime) {
      setTimeError("O horário de término deve ser posterior ao horário de início")
      return
    }

    // Criar objetos de data de início e fim
    const dateStr = date.toISOString().split("T")[0]
    const startDate = new Date(`${dateStr}T${startTime}:00`)
    const endDate = new Date(`${dateStr}T${endTime}:00`)

    // Verificar disponibilidade do horário personalizado
    const isAvailable = isTimeSlotAvailable(selectedProviderId, startDate, endDate)

    if (!isAvailable) {
      setTimeError("Este horário não está disponível para o profissional selecionado")
      return
    }

    // Verificar se o profissional foi alterado
    const providerChanged = selectedProviderId !== service.provider.id

    onPropose(service, startDate, endDate, providerChanged ? selectedProviderId : undefined)
    onClose()
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle>Propor Novo Horário</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Seleção de profissional */}
          <div className="space-y-2">
            <Label>Profissional</Label>
            <Select value={selectedProviderId} onValueChange={handleProviderChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o profissional" />
              </SelectTrigger>
              <SelectContent>
                {providers.map((provider) => (
                  <SelectItem key={provider.id} value={provider.id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={provider.avatar} alt={provider.name} />
                        <AvatarFallback>{getInitials(provider.name)}</AvatarFallback>
                      </Avatar>
                      <span>
                        {provider.name} - {provider.role}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Alerta quando não há sugestões disponíveis */}
          {showNoSuggestionsAlert && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Não há horários sugeridos disponíveis para este profissional. Por favor, tente outro profissional ou
                selecione um horário personalizado.
              </AlertDescription>
            </Alert>
          )}

          {/* Horários sugeridos */}
          {suggestedTimes.length > 0 && (
            <div className="space-y-2">
              <Label>Horários Sugeridos</Label>
              <RadioGroup value={selectedTimeSlot} onValueChange={setSelectedTimeSlot} className="space-y-2">
                {suggestedTimes.map((suggestion, index) => (
                  <div key={index} className="flex items-center space-x-2 border p-3 rounded-md">
                    <RadioGroupItem
                      value={`option-${index}`}
                      id={`option-${index}`}
                      onClick={() => handleSelectSuggestion(index)}
                    />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      <div className="font-medium">{format(suggestion.date, "dd 'de' MMMM", { locale: ptBR })}</div>
                      <div className="text-sm text-muted-foreground">
                        {suggestion.start} - {suggestion.end}
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          <div className="space-y-2 pt-4">
            <Label htmlFor="date">Ou selecione uma data personalizada</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : <span>Selecione uma data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => {
                    // Desabilitar datas passadas
                    const today = new Date()
                    today.setHours(0, 0, 0, 0)
                    return date < today
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Hora de Início</Label>
              <Input id="startTime" type="time" value={startTime} onChange={handleStartTimeChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">Hora de Término</Label>
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

          {/* Verificação de disponibilidade para horário personalizado */}
          {date && !selectedTimeSlot && (
            <div className={`text-sm mt-2 ${checkCustomTimeAvailability() ? "text-green-500" : "text-red-500"}`}>
              {checkCustomTimeAvailability() ? "✓ Horário disponível" : "✗ Horário indisponível para este profissional"}
            </div>
          )}

          <SheetFooter className="pt-4 flex flex-row gap-2 justify-end">
            <SheetClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </SheetClose>
            <Button
              type="submit"
              disabled={(date && !selectedTimeSlot && !checkCustomTimeAvailability()) || !!timeError}
            >
              Propor Horário
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}

