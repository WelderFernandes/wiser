"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X, Calendar, Clock, AlignLeft } from "lucide-react"
import { Textarea } from "./ui/textarea"
import { DynamicInput } from "./dynamic-input"

interface AddEventFormProps {
  onAdd: (title: string, description?: string, time?: string) => void
  onCancel: () => void
}

export function AddEventForm({ onAdd, onCancel }: AddEventFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [time, setTime] = useState("")

  // Valida o horário
  const validateTime = (timeString: any) => {
    if (!timeString) return true;
    
    const [hours, minutes] = timeString.split(':').map(Number);
    
    if (isNaN(hours) || isNaN(minutes)) return false;
    if (hours < 0 || hours > 23) return false;
    if (minutes < 0 || minutes > 59) return false;
    
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onAdd(title, description, time)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="glass-effect  rounded-xl shadow-lg"
    >
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
          Novo Evento
        </h3>
        <Button variant="ghost" size="icon" onClick={onCancel} className="rounded-full h-8 w-8 hover:bg-white/10">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="title" className="flex items-center text-sm font-medium mb-2 text-muted-foreground">
            Título
          </label>
          <DynamicInput
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título do evento"
            required
            icon={<Calendar className="h-4 w-4 mr-2  text-muted-foreground" />}
          />
        </div>

        <div>
          <label htmlFor="time" className="flex items-center text-sm font-medium mb-2 text-muted-foreground">
            Horário
          </label>
          <DynamicInput
            id="time"
            value={time}
            // type="time"
            onChange={(e) => setTime(e.target.value)}
            placeholder="Ex: 14:30"
            itemProp="time"
            icon={<Clock className="h-4 w-4 mr-2 text-muted-foreground" />}
            className={`pr-10 ${!validateTime(time) ? 'border-red-500' : ''}`}
          />
        </div>

        <div>
          <label htmlFor="description" className="flex items-center text-sm font-medium mb-2 text-muted-foreground">
            Descrição
          </label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={
              "Adicione uma descrição ao evento (opcional)"
            }
            rows={3}
            className="resize-none"
          />
        </div>

        <div className="flex justify-between space-x-3 pt-2 flex-wrap-reverse gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="rounded-full w-full border-primary/20 hover:bg-primary/10 hover:text-primary"
          >
            Cancelar
          </Button>
          <Button type="submit" className="rounded-full w-full add-event-button text-white border-none">
            Salvar
          </Button>
        </div>
      </form>
    </motion.div>
  )
}

