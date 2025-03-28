"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Calendar, Clock, Trash2, Tag } from "lucide-react"
import { Event } from "../../types/calendar"

interface EventListProps {
  events: Event[]
  onDelete: (id: string) => void
}

export function EventList({ events, onDelete }: EventListProps) {
  if (events.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-12 text-center"
      >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="inset-0 flex items-center justify-center"
          >
          <Calendar className="h-20 w-20 text-muted-foreground mb-4 opacity-20" />
          </motion.div>
        <h3 className="text-xl font-medium mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
          Nenhum evento agendado
        </h3>
        <p className="text-muted-foreground">Hora para uma pausa para café</p>
      </motion.div>
    )
  }

  return (
    <div className="space-y-4 mt-4">
      <AnimatePresence>
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="glass-effect p-4 rounded-xl event-card"
          >
            <div className="flex justify-between items-start">
              <h4 className="font-medium text-lg">{event.title}</h4>
              <motion.button
                whileHover={{ scale: 1.1, color: "rgb(239, 68, 68)" }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onDelete(event.id)}
                className="text-muted-foreground hover:text-destructive text-xs p-1 rounded-full hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </motion.button>
            </div>

            {event.time && (
              <div className="flex items-center text-sm text-muted-foreground mt-3">
                <Clock className="h-3.5 w-3.5 mr-2 text-primary/70" />
                <span>{event.time}</span>
              </div>
            )}
            {event.description && (
              <div className="mt-3 pt-3 border-t border-primary/10">
                <div className="flex items-start text-sm text-muted-foreground">
                  <Tag className="h-3.5 w-3.5 mr-2 text-primary/70 mt-0.5" />
                  <p>{event.description}</p>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

