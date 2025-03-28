'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Plus, CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCalendar } from '@/hooks/use-calendar'
import { AddEventForm } from './add-event-form'
import { EventList } from './event-list'
import { Card, CardContent } from './ui/card'

export default function Calendario() {
  const {
    selectedDate,
    setSelectedDate,
    isAddingEvent,
    setIsAddingEvent,
    monthName,
    currentYear,
    daysOfWeek,
    calendarDays,
    selectedDayEvents,
    formattedSelectedDate,
    totalEventsThisMonth,
    goToPreviousMonth,
    goToNextMonth,
    addEvent,
    deleteEvent,
  } = useCalendar()

  const today = new Date()

  return (
    <div className="w-full mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendário */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2"
        >
          <Card className="rounded-xl ">
            <CardContent>
              <div className="flex justify-between items-center ">
                <div>
                  <h2 className="text-3xl font-bold capitalize calendar-header bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                    {monthName} de {currentYear}
                  </h2>
                  <p className="text-muted-foreground flex items-center mt-1">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {totalEventsThisMonth} eventos este mês
                  </p>
                </div>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={goToPreviousMonth}
                    aria-label="Mês anterior"
                    className="rounded-full h-10 w-10 border-primary/20 hover:bg-primary/10 hover:text-primary"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={goToNextMonth}
                    aria-label="Próximo mês"
                    className="rounded-full h-10 w-10 border-primary/20 hover:bg-primary/10 hover:text-primary"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 ">
                {daysOfWeek.map((day, index) => (
                  <div
                    key={index}
                    className="text-center py-2 mt-6 text-sm font-medium text-muted-foreground"
                  >
                    {day}
                  </div>
                ))}

                {calendarDays.flat().map((day, index) => {
                  const isSelected =
                    selectedDate.getDate() === day.date.getDate() &&
                    selectedDate.getMonth() === day.date.getMonth() &&
                    selectedDate.getFullYear() === day.date.getFullYear()

                  const isToday =
                    today.getDate() === day.date.getDate() &&
                    today.getMonth() === day.date.getMonth() &&
                    today.getFullYear() === day.date.getFullYear()

                  return (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedDate(day.date)}
                      className={cn(
                        'aspect-square flex flex-col items-center justify-center rounded-xl relative hover:bg-primary/10 ring-accent ring-1',
                        !day.isCurrentMonth && 'text-muted-foreground/50',
                        isSelected && 'selected-day',
                        isToday && !isSelected && 'today-marker',
                        'transition-all duration-300',
                      )}
                    >
                      <span
                        className={cn(
                          'text-lg day-number',
                          isSelected && 'text-white',
                        )}
                      >
                        {day.date.getDate()}
                      </span>

                      {day.hasEvents && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={cn(
                            'w-6.5 h-0.5 rounded-full absolute bottom-2 event-indicator',
                            isSelected ? 'bg-white' : '',
                          )}
                        />
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Detalhes do dia */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="rounded-xl p-6 shadow-xl h-full flex flex-1 flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-medium capitalize">
                  {formattedSelectedDate}
                </h3>
                <Button
                  onClick={() => setIsAddingEvent(true)}
                  size="icon"
                  // className="gap-1 right-0 add-event-button rounded-full px-4 text-white border-none bottom-0 mb-4 mr-4"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-6">
                <AnimatePresence mode="wait">
                  {isAddingEvent ? (
                    <AddEventForm
                      onAdd={addEvent}
                      onCancel={() => setIsAddingEvent(false)}
                    />
                  ) : (
                    <EventList
                      events={selectedDayEvents}
                      onDelete={deleteEvent}
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
