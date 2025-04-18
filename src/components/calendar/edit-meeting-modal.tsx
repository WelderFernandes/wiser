"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Meeting } from "@/lib/types"
import { generateRandomColor } from "./calendar"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "@/components/ui/sheet"

interface EditMeetingModalProps {
  meeting: Meeting
  open: boolean
  onClose: () => void
  onSave: (meeting: Meeting) => void
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

export default function EditMeetingModal({ meeting, open, onClose, onSave }: EditMeetingModalProps) {
  // Adicionar validação para impedir hora de término inferior à hora de início
  const [startTime, setStartTime] = useState(meeting.startTime.toTimeString().split(" ")[0].substring(0, 5))
  const [endTime, setEndTime] = useState(meeting.endTime.toTimeString().split(" ")[0].substring(0, 5))
  const [timeError, setTimeError] = useState<string | null>(null)
  const [title, setTitle] = useState(meeting.title)
  const [description, setDescription] = useState(meeting.description)
  const [date, setDate] = useState(meeting.startTime.toISOString().split("T")[0])
  const [meetingType, setMeetingType] = useState<"google" | "zoom" | "teams">(meeting.meetingType)
  const [color, setColor] = useState<string>(meeting.color || generateRandomColor())

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

    // Atualizar reunião
    const updatedMeeting: Meeting = {
      ...meeting,
      title,
      description,
      startTime: startDate,
      endTime: endDate,
      day,
      meetingType,
      color,
    }

    onSave(updatedMeeting)
    onClose()
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle>Editar Reunião</SheetTitle>
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
              placeholder="Título da reunião"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Descrição
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição da reunião"
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
            <label htmlFor="meetingType" className="text-sm font-medium">
              Tipo de Reunião
            </label>
            <Select value={meetingType} onValueChange={(value) => setMeetingType(value as "google" | "zoom" | "teams")}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de reunião" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="google">Google Meet</SelectItem>
                <SelectItem value="zoom">Zoom</SelectItem>
                <SelectItem value="teams">Microsoft Teams</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="color" className="text-sm font-medium">
              Cor do Evento
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

