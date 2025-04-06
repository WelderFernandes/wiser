"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TimePickerInput } from "./time-picker-input"
import type { ServiceProvider, WorkSchedule } from "@/lib/types"
import { toast } from "@/components/use-toast"

interface ProviderScheduleModalProps {
  provider: ServiceProvider
  open: boolean
  onClose: () => void
  onSave: (provider: ServiceProvider, schedule: WorkSchedule) => void
}

const DAYS_OF_WEEK = [
  { id: "monday", label: "Segunda-feira" },
  { id: "tuesday", label: "Terça-feira" },
  { id: "wednesday", label: "Quarta-feira" },
  { id: "thursday", label: "Quinta-feira" },
  { id: "friday", label: "Sexta-feira" },
  { id: "saturday", label: "Sábado" },
  { id: "sunday", label: "Domingo" },
]

export default function ProviderScheduleModal({ provider, open, onClose, onSave }: ProviderScheduleModalProps) {
  // Inicializar com horário padrão ou horário existente do provedor
  const [schedule, setSchedule] = useState<WorkSchedule>(
    provider.workSchedule || {
      monday: { active: true, start: "09:00", end: "18:00" },
      tuesday: { active: true, start: "09:00", end: "18:00" },
      wednesday: { active: true, start: "09:00", end: "18:00" },
      thursday: { active: true, start: "09:00", end: "18:00" },
      friday: { active: true, start: "09:00", end: "18:00" },
      saturday: { active: false, start: "09:00", end: "13:00" },
      sunday: { active: false, start: "00:00", end: "00:00" },
    },
  )

  const [name, setName] = useState(provider.name)
  const [role, setRole] = useState(provider.role)
  const [email, setEmail] = useState(provider.email)
  const [available, setAvailable] = useState(provider.available)

  // Obter iniciais do nome
  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  // Atualizar dia de trabalho
  const updateDay = (day: string, field: string, value: any) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day as keyof WorkSchedule],
        [field]: value,
      },
    }))
  }

  // Aplicar mesmo horário para todos os dias selecionados
  const applyToAllActive = (start: string, end: string) => {
    const newSchedule = { ...schedule }

    Object.keys(newSchedule).forEach((day) => {
      if (newSchedule[day as keyof WorkSchedule].active) {
        newSchedule[day as keyof WorkSchedule].start = start
        newSchedule[day as keyof WorkSchedule].end = end
      }
    })

    setSchedule(newSchedule)
  }

  // Salvar alterações
  const handleSave = () => {
    const updatedProvider = {
      ...provider,
      name,
      role,
      email,
      available,
      workSchedule: schedule,
    }

    onSave(updatedProvider, schedule)

    toast({
      title: "Horário atualizado",
      description: `O horário de trabalho de ${name} foi atualizado com sucesso.`,
    })

    onClose()
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle>Configurar Horário de Trabalho</SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="schedule">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="schedule">Horário</TabsTrigger>
            <TabsTrigger value="profile">Perfil</TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={provider.avatar} alt={provider.name} />
                  <AvatarFallback>{getInitials(provider.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{provider.name}</h3>
                  <p className="text-sm text-muted-foreground">{provider.role}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {DAYS_OF_WEEK.map((day) => (
                <div key={day.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50">
                  <Checkbox
                    id={`${day.id}-active`}
                    checked={schedule[day.id as keyof WorkSchedule].active}
                    onCheckedChange={(checked) => updateDay(day.id, "active", checked === true)}
                  />
                  <Label htmlFor={`${day.id}-active`} className="flex-1 cursor-pointer">
                    {day.label}
                  </Label>

                  <div className="flex items-center space-x-2">
                    <TimePickerInput
                      value={schedule[day.id as keyof WorkSchedule].start}
                      onChange={(value) => updateDay(day.id, "start", value)}
                      disabled={!schedule[day.id as keyof WorkSchedule].active}
                    />
                    <span className="text-muted-foreground">até</span>
                    <TimePickerInput
                      value={schedule[day.id as keyof WorkSchedule].end}
                      onChange={(value) => updateDay(day.id, "end", value)}
                      disabled={!schedule[day.id as keyof WorkSchedule].active}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 mt-4">
              <h4 className="text-sm font-medium mb-2">Aplicar mesmo horário</h4>
              <div className="flex items-center space-x-2">
                <TimePickerInput value="09:00" onChange={() => {}} />
                <span className="text-muted-foreground">até</span>
                <TimePickerInput value="18:00" onChange={() => {}} />
                <Button variant="outline" size="sm" onClick={() => applyToAllActive("09:00", "18:00")}>
                  Aplicar aos dias selecionados
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Função</Label>
              <Input id="role" value={role} onChange={(e) => setRole(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="available"
                checked={available}
                onCheckedChange={(checked) => setAvailable(checked === true)}
              />
              <Label htmlFor="available">Disponível para agendamentos</Label>
            </div>
          </TabsContent>
        </Tabs>

        <SheetFooter className="pt-4 flex flex-row gap-2 justify-end">
          <SheetClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </SheetClose>
          <Button onClick={handleSave}>Salvar Alterações</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

