export interface Event {
    id: string
    title: string
    date: Date
    description?: string
    time?: string
  }
  
  export interface CalendarDay {
    date: Date
    isCurrentMonth: boolean
    hasEvents: boolean
    events: Event[]
  }
  
  export type Month = CalendarDay[][]
  
  export interface Collaborator {
    id: string
    name: string
    email: string
    avatar?: string
  }
  
  export interface Patient {
    id: string
    name: string
    email?: string
    phone?: string
    avatar?: string
  }
  
  export interface CalendarEvent {
    id: string
    title: string
    start: Date
    end: Date
    allDay?: boolean
    color?: string
    description?: string
    location?: string
    collaborators?: Collaborator[]
    patient?: Patient
    type: "event" | "reminder" | "task"
    repeat?: "daily" | "weekly" | "monthly" | "yearly" | "none"
    notification?: number // minutos antes
  }
  
  export interface Holiday {
    date: string
    name: string
    type: string
  }
  
  export type CalendarViewType = "day" | "week" | "month" | "year"
  
  