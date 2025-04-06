"use client"

import { Button } from "@/components/ui/button"
import { Plus, CalendarIcon } from "lucide-react"
import { UpcomingEvents } from "./upcoming-events"
import { motion } from "framer-motion"
import { CalendarEvent, Holiday } from "../../types/calendar"
import { MiniCalendar } from "./mini-calendar"

interface SidebarProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
  holidays: Holiday[]
  events: CalendarEvent[]
  onAddEvent: () => void
  onSelectEvent: (event: CalendarEvent) => void
}

export function Sidebar({ selectedDate, onDateChange, holidays, events, onAddEvent, onSelectEvent }: SidebarProps) {
  return (
    <motion.div
      className="max-w-64 h-full flex flex-col px-2"
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <Button
          className="mb-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all duration-300"
          onClick={onAddEvent}
        >
          <Plus className="h-4 w-4" />
          Criar Agenda
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <MiniCalendar selectedDate={selectedDate} onDateChange={onDateChange} holidays={holidays} />
      </motion.div>

      <motion.div
        className="mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <UpcomingEvents events={events} onSelectEvent={onSelectEvent} onNavigateToDate={onDateChange} />
      </motion.div>

      <motion.div
        className="mt-auto pt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <Button
          variant="outline"
          className="w-full  flex items-center justify-center gap-2 border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
        >
          <CalendarIcon className="h-4 w-4" />
          Minha Agenda
        </Button>
      </motion.div>
    </motion.div>
  )
}

