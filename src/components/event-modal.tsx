"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, Clock, MapPin, X, Plus, Bell, User, CalendarClockIcon } from "lucide-react"
import { format, addMinutes } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarEvent, Collaborator, Patient } from "../../types/calendar"
import { TabsContent } from "@radix-ui/react-tabs"

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (event: Omit<CalendarEvent, "id">) => void
  initialDate?: Date
  event?: CalendarEvent
  collaborators: Collaborator[]
  patients: Patient[]
}

export function EventModal({
  isOpen,
  onClose,
  onSave,
  initialDate = new Date(),
  event,
  collaborators,
  patients,
}: EventModalProps) {
  const [title, setTitle] = useState("")
  const [startDate, setStartDate] = useState<Date>(initialDate)
  const [endDate, setEndDate] = useState<Date>(addMinutes(initialDate, 60))
  const [selectedCollaborators, setSelectedCollaborators] = useState<Collaborator[]>([])
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [location, setLocation] = useState("")
  const [eventType, setEventType] = useState<"event" | "reminder" | "task">("event")
  const [notification, setNotification] = useState<number>(30) // 30 minutos antes por padrão
  const [showCollaboratorSelector, setShowCollaboratorSelector] = useState(false)
  const [showPatientSelector, setShowPatientSelector] = useState(false)

  useEffect(() => {
    if (event) {
      setTitle(event.title)
      setStartDate(new Date(event.start))
      setEndDate(new Date(event.end))
      setSelectedCollaborators(event.collaborators || [])
      setSelectedPatient(event.patient || null)
      setLocation(event.location || "")
      setEventType(event.type)
      setNotification(event.notification || 30)
    } else {
      // Reset form for new event
      setTitle("")
      setStartDate(initialDate)
      setEndDate(addMinutes(initialDate, 60))
      setSelectedCollaborators([])
      setSelectedPatient(null)
      setLocation("")
      setEventType("event")
      setNotification(30)
    }
  }, [event, initialDate, isOpen])

  const handleSave = () => {
    const newEvent: Omit<CalendarEvent, "id"> = {
      title: title || "Sem título",
      start: startDate,
      end: endDate,
      collaborators: selectedCollaborators,
      patient: selectedPatient || undefined,
      location,
      type: eventType,
      notification,
    }

    onSave(newEvent)
    onClose()
  }

  const addCollaborator = (collaborator: Collaborator) => {
    if (!selectedCollaborators.some((c) => c.id === collaborator.id)) {
      setSelectedCollaborators([...selectedCollaborators, collaborator])
    }
    setShowCollaboratorSelector(false)
  }

  const removeCollaborator = (collaboratorId: string) => {
    setSelectedCollaborators(selectedCollaborators.filter((c) => c.id !== collaboratorId))
  }

  const selectPatient = (patient: Patient) => {
    setSelectedPatient(patient)
    setShowPatientSelector(false)
  }

  const removePatient = () => {
    setSelectedPatient(null)
  }

  const handleTimeChange = (type: "start" | "end", hours: number, minutes: number) => {
    if (type === "start") {
      const newStartDate = new Date(startDate)
      newStartDate.setHours(hours, minutes)
      setStartDate(newStartDate)

      // Se a data de término for anterior à nova data de início, ajuste-a
      if (endDate < newStartDate) {
        setEndDate(addMinutes(newStartDate, 60))
      }
    } else {
      const newEndDate = new Date(endDate)
      newEndDate.setHours(hours, minutes)
      setEndDate(newEndDate)

      // Se a data de término for anterior à data de início, ajuste a data de início
      if (newEndDate < startDate) {
        setStartDate(addMinutes(newEndDate, -60))
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle>{event ? "Editar Evento" : "Criar um Evento"}</DialogTitle>
        </DialogHeader>

        <div className="p-4 pt-2">
          <Tabs defaultValue="event" value={eventType} onValueChange={(value) => setEventType(value as any)}>
            <TabsList className="grid grid-cols-3 mb-4 w-full gap-2">
              <TabsTrigger value="event">Evento</TabsTrigger>
              <TabsTrigger value="reminder">Lembrete</TabsTrigger>
              <TabsTrigger value="task">Tarefa</TabsTrigger>
            </TabsList>

            <Input
              placeholder="Adicionar título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mb-4"
            />

            <div className="flex items-center gap-2 mb-4">
              <CalendarClockIcon size={28} className="text-muted-foreground" />
              <div className="flex flex-col text-sm">
                <div className="flex items-center">{format(startDate, "EEEE, d 'de' MMMM", { locale: ptBR })}</div>
                <div className="flex items-center text-muted-foreground">
                  {format(startDate, "HH:mm", { locale: ptBR })} - {format(endDate, "HH:mm", { locale: ptBR })}
                  <span className="ml-1">· Fuso horário: {format(new Date(), "O", { locale: ptBR })}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    <span>Data</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      if (date) {
                        // Manter a hora atual ao mudar a data
                        const newDate = new Date(date)
                        newDate.setHours(startDate.getHours(), startDate.getMinutes())
                        setStartDate(newDate)

                        // Ajustar a data de término para manter a mesma duração
                        const duration = endDate.getTime() - startDate.getTime()
                        setEndDate(new Date(newDate.getTime() + duration))
                      }
                    }}
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Horário inicial</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2" align="start">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-muted-foreground">Hora</label>
                      <Select
                        value={startDate.getHours().toString()}
                        onValueChange={(value) =>
                          handleTimeChange("start", Number.parseInt(value), startDate.getMinutes())
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }).map((_, i) => (
                            <SelectItem key={i} value={i.toString()}>
                              {i.toString().padStart(2, "0")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Minuto</label>
                      <Select
                        value={startDate.getMinutes().toString()}
                        onValueChange={(value) =>
                          handleTimeChange("start", startDate.getHours(), Number.parseInt(value))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[0, 15, 30, 45].map((minute) => (
                            <SelectItem key={minute} value={minute.toString()}>
                              {minute.toString().padStart(2, "0")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Horário final</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2" align="start">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-muted-foreground">Hora</label>
                      <Select
                        value={endDate.getHours().toString()}
                        onValueChange={(value) => handleTimeChange("end", Number.parseInt(value), endDate.getMinutes())}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }).map((_, i) => (
                            <SelectItem key={i} value={i.toString()}>
                              {i.toString().padStart(2, "0")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Minuto</label>
                      <Select
                        value={endDate.getMinutes().toString()}
                        onValueChange={(value) => handleTimeChange("end", endDate.getHours(), Number.parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[0, 15, 30, 45].map((minute) => (
                            <SelectItem key={minute} value={minute.toString()}>
                              {minute.toString().padStart(2, "0")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Popover open={showCollaboratorSelector} onOpenChange={setShowCollaboratorSelector}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Plus className="h-4 w-4" />
                      <span>Adicionar pessoas</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-2 bg-background" align="start">
                    <div className="space-y-2 ">
                      <Input placeholder="Buscar colaboradores" className="mb-2" />
                      <div className="max-h-48 overflow-y-auto space-y-1">
                        {collaborators.map((collaborator) => (
                          <div
                            key={collaborator.id}
                            className="flex items-center gap-2 p-2 hover:bg-primary/50 rounded cursor-pointer"
                            onClick={() => addCollaborator(collaborator)}
                          >
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={collaborator.avatar} alt={collaborator.name} />
                              <AvatarFallback>
                                {collaborator.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{collaborator.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{collaborator.email}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                <Popover open={showPatientSelector} onOpenChange={setShowPatientSelector}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>Adicionar paciente</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-2 bg-background" align="start">
                    <div className="space-y-2 ">
                      <Input placeholder="Buscar pacientes" className="mb-2" />
                      <div className="max-h-52 overflow-y-auto scroll-auto space-y-1">
                        {patients.map((patient) => (
                          <div
                            key={patient.id}
                            className="flex items-center gap-2 p-2 hover:bg-primary/50 rounded cursor-pointer"
                            onClick={() => selectPatient(patient)}
                          >
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={patient.avatar} alt={patient.name} />
                              <AvatarFallback>
                                {patient.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{patient.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{patient.phone || patient.email}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>Adicionar localização</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-2" align="start">
                    <Input
                      placeholder="Digite a localização"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </PopoverContent>
                </Popover> */}

                {/* <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Bell className="h-4 w-4" />
                      <span>Notificação</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2" align="start">
                    <Select
                      value={notification.toString()}
                      onValueChange={(value) => setNotification(Number.parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Notificação" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Sem notificação</SelectItem>
                        <SelectItem value="5">5 minutos antes</SelectItem>
                        <SelectItem value="10">10 minutos antes</SelectItem>
                        <SelectItem value="15">15 minutos antes</SelectItem>
                        <SelectItem value="30">30 minutos antes</SelectItem>
                        <SelectItem value="60">1 hora antes</SelectItem>
                      </SelectContent>
                    </Select>
                  </PopoverContent>
                </Popover> */}
              </div>

              {selectedCollaborators.length > 0 && (
                <div className="space-y-2 mt-4">
                  <h4 className="text-sm font-medium">Colaboradores</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCollaborators.map((collaborator) => (
                      <div
                        key={collaborator.id}
                        className="flex items-center gap-1 bg-primary/50 rounded-full pl-1 pr-2 py-1"
                      >
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={collaborator.avatar} alt={collaborator.name} />
                          <AvatarFallback>
                            {collaborator.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs">{collaborator.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-1"
                          onClick={() => removeCollaborator(collaborator.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedPatient && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium">Paciente</h4>
                  <div className="flex items-center justify-between p-2 bg-secondary/50 rounded-md mt-1">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={selectedPatient.avatar} alt={selectedPatient.name} />
                        <AvatarFallback>
                          {selectedPatient.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{selectedPatient.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {selectedPatient.phone || selectedPatient.email}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={removePatient}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {location && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium">Localização</h4>
                  <div className="flex items-center justify-between p-2 bg-secondary/50 rounded-md mt-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{location}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setLocation("")}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Tabs>
        </div>

        <DialogFooter className="p-4 pt-0">
          <div className="flex justify-between w-full">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

