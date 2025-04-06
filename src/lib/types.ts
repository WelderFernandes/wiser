export interface Attendee {
  id: string
  name: string
  email: string
  avatar: string
}

export interface WorkDay {
  active: boolean
  start: string
  end: string
}

export interface WorkSchedule {
  monday: WorkDay
  tuesday: WorkDay
  wednesday: WorkDay
  thursday: WorkDay
  friday: WorkDay
  saturday: WorkDay
  sunday: WorkDay
}

export interface ServiceProvider {
  id: string
  name: string
  email: string
  avatar: string
  role: string
  available: boolean
  workSchedule?: WorkSchedule
}

export interface Service {
  id: string
  title: string
  startTime: Date
  endTime: Date
  day: number
  client: Attendee
  serviceType: string
  provider: ServiceProvider
  description: string
  color?: string
  status: "scheduled" | "completed" | "canceled"
}

export interface Attachment {
  id: string
  name: string
  size: string
  context: string
  icon: "pdf" | "image" | "video" | "doc"
}

export interface Meeting {
  id: string
  title: string
  description: string
  startTime: Date
  endTime: Date
  day: number
  meetingType: "google" | "zoom" | "teams"
  meetingUrl: string
  color?: string
  attendees: Attendee[]
}

