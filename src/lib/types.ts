export interface Attendee {
    id: string
    name: string
    email: string
    avatar: string
  }
  
  export interface Meeting {
    id: string
    title: string
    startTime: Date
    endTime: Date
    day: number
    attendees: Attendee[]
    meetingType: string
    meetingUrl: string
    description: string
    color?: string // Campo para armazenar a cor do evento
  }
  
  export interface Attachment {
    id: string
    name: string
    size: string
    context: string
    icon: "pdf" | "image" | "video" | "doc"
  }
  
  