"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { TimePickerInput } from "./time-picker-input"
import { toast } from "@/components/use-toast"
import { Plus, Edit, Trash2 } from "lucide-react"
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
import type { ServiceProvider, WorkSchedule } from "@/lib/types"

interface SettingsModalProps {
  open: boolean
  onClose: () => void
  providers: ServiceProvider[]
  onUpdateProvider: (provider: ServiceProvider) => void
  onAddProvider: (provider: ServiceProvider) => void
  onDeleteProvider: (providerId: string) => void
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

const DEFAULT_WORK_SCHEDULE: WorkSchedule = {
  monday: { active: true, start: "09:00", end: "18:00" },
  tuesday: { active: true, start: "09:00", end: "18:00" },
  wednesday: { active: true, start: "09:00", end: "18:00" },
  thursday: { active: true, start: "09:00", end: "18:00" },
  friday: { active: true, start: "09:00", end: "18:00" },
  saturday: { active: false, start: "09:00", end: "13:00" },
  sunday: { active: false, start: "00:00", end: "00:00" },
}

export default function SettingsModal({
  open,
  onClose,
  providers,
  onUpdateProvider,
  onAddProvider,
  onDeleteProvider,
}: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState("providers")
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Estados para edição/criação de prestador
  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const [email, setEmail] = useState("")
  const [available, setAvailable] = useState(true)
  const [schedule, setSchedule] = useState<WorkSchedule>(DEFAULT_WORK_SCHEDULE)

  // Obter iniciais do nome
  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  // Iniciar edição de um prestador
  const handleEditProvider = (provider: ServiceProvider) => {
    setSelectedProvider(provider)
    setName(provider.name)
    setRole(provider.role)
    setEmail(provider.email)
    setAvailable(provider.available)
    setSchedule(provider.workSchedule || DEFAULT_WORK_SCHEDULE)
    setIsEditing(true)
    setIsCreating(false)
  }

  // Iniciar criação de um novo prestador
  const handleCreateProvider = () => {
    setSelectedProvider(null)
    setName("")
    setRole("")
    setEmail("")
    setAvailable(true)
    setSchedule(DEFAULT_WORK_SCHEDULE)
    setIsEditing(false)
    setIsCreating(true)
  }

  // Cancelar edição/criação
  const handleCancelEdit = () => {
    setIsEditing(false)
    setIsCreating(false)
    setSelectedProvider(null)
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

  // Salvar alterações do prestador
  const handleSaveProvider = () => {
    if (!name || !role || !email) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        // variant: "destructive",
      })
      return
    }

    if (isCreating) {
      const newProvider: ServiceProvider = {
        id: Date.now().toString(),
        name,
        role,
        email,
        available,
        workSchedule: schedule,
        avatar: "/placeholder.svg?height=40&width=40",
      }

      onAddProvider(newProvider)

      toast({
        title: "Prestador adicionado",
        description: `${name} foi adicionado com sucesso.`,
      })
    } else if (isEditing && selectedProvider) {
      const updatedProvider: ServiceProvider = {
        ...selectedProvider,
        name,
        role,
        email,
        available,
        workSchedule: schedule,
      }

      onUpdateProvider(updatedProvider)

      toast({
        title: "Prestador atualizado",
        description: `As informações de ${name} foram atualizadas com sucesso.`,
      })
    }

    handleCancelEdit()
  }

  // Confirmar exclusão de prestador
  const handleConfirmDelete = () => {
    if (selectedProvider) {
      onDeleteProvider(selectedProvider.id)
      setShowDeleteDialog(false)
      handleCancelEdit()

      toast({
        title: "Prestador removido",
        description: `${selectedProvider.name} foi removido com sucesso.`,
      })
    }
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle>Configurações</SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="providers" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="providers">Prestadores</TabsTrigger>
            <TabsTrigger value="general">Geral</TabsTrigger>
          </TabsList>

          <TabsContent value="providers" className="space-y-4">
            {!isEditing && !isCreating ? (
              <>
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Prestadores de Serviço</h3>
                  <Button variant="outline" size="sm" onClick={handleCreateProvider}>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Prestador
                  </Button>
                </div>

                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {providers.map((provider) => (
                    <div key={provider.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={provider.avatar} alt={provider.name} />
                          <AvatarFallback>{getInitials(provider.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{provider.name}</div>
                          <div className="text-xs text-muted-foreground">{provider.role}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEditProvider(provider)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedProvider(provider)
                            setShowDeleteDialog(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">
                    {isCreating ? "Novo Prestador" : `Editar ${selectedProvider?.name}`}
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nome completo"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Função</Label>
                    <Input
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="Ex: Cabeleireiro, Barbeiro, etc."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@exemplo.com"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="available"
                      checked={available}
                      onCheckedChange={(checked) => setAvailable(checked === true)}
                    />
                    <Label htmlFor="available">Disponível para agendamentos</Label>
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <h4 className="text-sm font-medium mb-4">Dias e Horários de Trabalho</h4>

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
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={handleCancelEdit}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveProvider}>Salvar</Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="general" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Configurações Gerais</h3>

              <div className="space-y-2">
                <Label htmlFor="company-name">Nome da Empresa</Label>
                <Input id="company-name" defaultValue="Kokount UI" placeholder="Nome da sua empresa" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="business-hours">Horário de Funcionamento Padrão</Label>
                <div className="flex items-center space-x-2">
                  <TimePickerInput value="09:00" onChange={() => {}} />
                  <span className="text-muted-foreground">até</span>
                  <TimePickerInput value="18:00" onChange={() => {}} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Dias de Funcionamento</Label>
                <div className="grid grid-cols-2 gap-2">
                  {DAYS_OF_WEEK.map((day) => (
                    <div key={day.id} className="flex items-center space-x-2">
                      <Checkbox id={`business-${day.id}`} defaultChecked={day.id !== "sunday"} />
                      <Label htmlFor={`business-${day.id}`}>{day.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <SheetFooter className="pt-4 flex flex-row gap-2 justify-end">
          {!isEditing && !isCreating && (
            <SheetClose asChild>
              <Button>Fechar</Button>
            </SheetClose>
          )}
        </SheetFooter>
      </SheetContent>

      {/* Diálogo de confirmação de exclusão */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o prestador
              {selectedProvider && ` "${selectedProvider.name}"`} e todos os seus dados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sheet>
  )
}

