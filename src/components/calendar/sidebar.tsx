"use client"

import { Button } from "@/components/ui/button"
import { FileIcon, FileTextIcon, ImageIcon, VideoIcon, Plus, Users, Settings, Mail } from "lucide-react"
import { motion } from "framer-motion"
import { Attachment } from "@/lib/types"

interface SidebarProps {
  upcomingMeetings: {
    id: string
    title: string
    duration: string
    description: string
    meetingType: string
  }[]
  recentAttachments: Attachment[]
  onCreateMeeting: () => void
}

export default function Sidebar({ upcomingMeetings, recentAttachments, onCreateMeeting }: SidebarProps) {
  return (
    <div className="w-[240px] border-r border-border bg-muted/40 flex flex-col overflow-hidden">
      {/* App Title */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-md bg-primary"></div>
          <div>
            <h2 className="text-sm font-semibold">Slot Wise</h2>
            <p className="text-xs text-muted-foreground">Espaço de Trabalho da Equipe</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-border">
        <h3 className="text-xs font-medium mb-2">Ações Rápidas</h3>
        <div className="space-y-1">
          <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" size="sm" className="w-full justify-start" onClick={onCreateMeeting}>
              <Plus className="h-4 w-4 mr-2" /> Reunião
            </Button>
          </motion.div>
          <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <Users className="h-4 w-4 mr-2" /> Equipe
            </Button>
          </motion.div>
          <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <Settings className="h-4 w-4 mr-2" /> Configurações
            </Button>
          </motion.div>
          <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <Mail className="h-4 w-4 mr-2" /> E-mail
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Upcoming Meetings */}
      <div className="p-4 border-b border-border">
        <h3 className="text-xs font-medium mb-2">Próximas Reuniões</h3>
        <div className="space-y-2">
          {upcomingMeetings.map((meeting, index) => (
            <motion.div
              key={meeting.id}
              className="bg-background rounded-md p-2 text-xs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="font-medium">{meeting.title}</div>
              <div className="text-muted-foreground text-[10px]">{meeting.duration}</div>
              <div className="text-[10px]">{meeting.description}</div>
              <div className="mt-1">
                <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] text-primary">
                  {meeting.meetingType === "google" ? "Entrar no Google Meet" : "Entrar na Reunião Zoom"}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Attachments */}
      <div className="p-4 flex-1 overflow-auto">
        <h3 className="text-xs font-medium mb-2">Anexos Recentes</h3>
        <div className="space-y-2">
          {recentAttachments.map((attachment, index) => (
            <motion.div
              key={attachment.id}
              className="flex items-start space-x-2 text-xs"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: 5 }}
            >
              <div className="w-6 h-6 rounded bg-muted flex items-center justify-center">
                {attachment.icon === "pdf" && <FileIcon className="w-3 h-3" />}
                {attachment.icon === "image" && <ImageIcon className="w-3 h-3" />}
                {attachment.icon === "video" && <VideoIcon className="w-3 h-3" />}
                {attachment.icon === "doc" && <FileTextIcon className="w-3 h-3" />}
              </div>
              <div>
                <div className="font-medium">{attachment.name}</div>
                <div className="text-[10px] text-muted-foreground">{attachment.size}</div>
                <div className="text-[10px] text-muted-foreground">{attachment.context}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

