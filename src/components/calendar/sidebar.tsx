"use client"

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"
import { FileIcon, FileTextIcon, ImageIcon, VideoIcon, Plus, Users, Settings, Mail } from "lucide-react"
import type { Attachment, ServiceProvider } from "@/lib/types"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import Link from "next/link"

interface SidebarProps {
  upcomingServices: {
    id: string
    title: string
    duration: string
    description: string
    serviceType: string
  }[]
  recentAttachments: Attachment[]
  onCreateService: () => void
  providers: ServiceProvider[]
  onSelectProvider: (provider: ServiceProvider | null) => void
  selectedProvider: ServiceProvider | null
  onEditProviderSchedule: (provider: ServiceProvider) => void
  onOpenSettings: () => void
}

export default function Sidebar({
  upcomingServices,
  recentAttachments,
  onCreateService,
  providers,
  onSelectProvider,
  selectedProvider,
  onEditProviderSchedule,
  onOpenSettings,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredProviders = searchQuery
    ? providers.filter(
        (provider) =>
          provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          provider.role.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : providers

  // Função para obter as iniciais do nome
  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="w-[240px] border-r border-border bg-muted/40 flex flex-col overflow-hidden">
      {/* App Title / Provider Selector */}
      <div className="p-4 border-b border-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center space-x-2 cursor-pointer hover:bg-muted p-2 rounded-md">
              <div className="w-8 h-8 rounded-md bg-black flex items-center justify-center overflow-hidden">
                {selectedProvider ? (
                  <Avatar className="w-full h-full">
                    <AvatarImage src={selectedProvider.avatar} alt={selectedProvider.name} />
                    <AvatarFallback className="text-xs bg-black text-white">
                      {getInitials(selectedProvider.name)}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="w-6 h-6 rounded-md bg-primary"></div>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-sm font-semibold">{selectedProvider ? selectedProvider.name : "Kokount UI"}</h2>
                <p className="text-xs text-muted-foreground">
                  {selectedProvider ? selectedProvider.role : "Espaço de Trabalho da Equipe"}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[220px]">
            <DropdownMenuItem onClick={() => onSelectProvider(null)}>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-md bg-primary"></div>
                <div>
                  <p className="text-sm">Kokount UI</p>
                  <p className="text-xs text-muted-foreground">Espaço de Trabalho da Equipe</p>
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {providers.map((provider) => (
              <DropdownMenuItem
                key={provider.id}
                onClick={() => onSelectProvider(provider)}
                className="flex justify-between items-center"
              >
                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={provider.avatar} alt={provider.name} />
                    <AvatarFallback>{getInitials(provider.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm">{provider.name}</p>
                    <p className="text-xs text-muted-foreground">{provider.role}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation()
                    onEditProviderSchedule(provider)
                  }}
                >
                  <Settings className="h-3 w-3" />
                </Button>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-border">
        <h3 className="text-xs font-medium mb-2">Ações Rápidas</h3>
        <div className="space-y-1">
          <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" size="sm" className="w-full justify-start" onClick={onCreateService}>
              <Plus className="h-4 w-4 mr-2" /> Serviço
            </Button>
          </motion.div>
          <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <Users className="h-4 w-4 mr-2" /> Equipe
            </Button>
          </motion.div>
          <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
            <Link href="/settings">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" /> Configurações
              </Button>
            </Link>
          </motion.div>
          <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
            <Link href="/email">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-2" /> E-mail
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Team Members */}
      <div className="p-4 border-b border-border">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xs font-medium">Colaboradores</h3>
          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => onSelectProvider(null)}>
            Ver todos
          </Button>
        </div>

        <div className="relative mb-2">
          <input
            type="text"
            placeholder="Buscar colaborador..."
            className="w-full text-xs p-1.5 rounded border border-border bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="space-y-2 max-h-[200px] overflow-y-auto">
          {filteredProviders.map((provider, index) => (
            <motion.div
              key={provider.id}
              className={`flex items-center gap-2 p-1.5 rounded-md cursor-pointer ${
                selectedProvider?.id === provider.id ? "bg-primary/10" : "hover:bg-muted"
              }`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelectProvider(provider)}
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src={provider.avatar} alt={provider.name} />
                <AvatarFallback className="text-[10px]">{getInitials(provider.name)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-xs font-medium">{provider.name}</div>
                <div className="text-[10px] text-muted-foreground">{provider.role}</div>
              </div>
              <div className="ml-auto flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${provider.available ? "bg-green-500" : "bg-gray-300"}`}></div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 opacity-0 group-hover:opacity-100 hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation()
                    onEditProviderSchedule(provider)
                  }}
                >
                  <Settings className="h-3 w-3" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Upcoming Services */}
      <div className="p-4 border-b border-border">
        <h3 className="text-xs font-medium mb-2">Próximos Serviços</h3>
        <div className="space-y-2">
          {upcomingServices.map((service, index) => (
            <motion.div
              key={service.id}
              className="bg-background rounded-md p-2 text-xs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="font-medium">{service.title}</div>
              <div className="text-muted-foreground text-[10px]">{service.duration}</div>
              <div className="text-[10px]">{service.description}</div>
              <div className="mt-1">
                <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] text-primary">
                  {service.serviceType}
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

