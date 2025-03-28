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
  
  