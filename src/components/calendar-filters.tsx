"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Collaborator, Patient } from "../../types/calendar"

interface CalendarFiltersProps {
  collaborators: Collaborator[]
  patients: Patient[]
  selectedCollaborators: string[]
  selectedPatients: string[]
  onCollaboratorFilterChange: (ids: string[]) => void
  onPatientFilterChange: (ids: string[]) => void
}

export function CalendarFilters({
  collaborators,
  patients,
  selectedCollaborators,
  selectedPatients,
  onCollaboratorFilterChange,
  onPatientFilterChange,
}: CalendarFiltersProps) {
  const [collaboratorOpen, setCollaboratorOpen] = useState(false)
  const [patientOpen, setPatientOpen] = useState(false)

  const toggleCollaborator = (id: string) => {
    if (selectedCollaborators.includes(id)) {
      onCollaboratorFilterChange(selectedCollaborators.filter((c) => c !== id))
    } else {
      onCollaboratorFilterChange([...selectedCollaborators, id])
    }
  }

  const togglePatient = (id: string) => {
    if (selectedPatients.includes(id)) {
      onPatientFilterChange(selectedPatients.filter((p) => p !== id))
    } else {
      onPatientFilterChange([...selectedPatients, id])
    }
  }

  const clearCollaboratorFilters = () => {
    onCollaboratorFilterChange([])
  }

  const clearPatientFilters = () => {
    onPatientFilterChange([])
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <div className="flex items-center">
        <Popover open={collaboratorOpen} onOpenChange={setCollaboratorOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={collaboratorOpen} className="justify-between">
              {selectedCollaborators.length > 0
                ? `${selectedCollaborators.length} colaborador(es)`
                : "Filtrar por Colaborador"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Buscar colaborador..." />
              <CommandList>
                <CommandEmpty>Nenhum colaborador encontrado.</CommandEmpty>
                <CommandGroup>
                  {collaborators.map((collaborator) => (
                    <CommandItem
                      key={collaborator.id}
                      value={collaborator.id}
                      onSelect={() => toggleCollaborator(collaborator.id)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedCollaborators.includes(collaborator.id) ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {collaborator.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {selectedCollaborators.length > 0 && (
          <Button variant="ghost" size="icon" onClick={clearCollaboratorFilters} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center">
        <Popover open={patientOpen} onOpenChange={setPatientOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={patientOpen} className="justify-between">
              {selectedPatients.length > 0 ? `${selectedPatients.length} paciente(s)` : "Filtrar por Paciente"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Buscar paciente..." />
              <CommandList>
                <CommandEmpty>Nenhum paciente encontrado.</CommandEmpty>
                <CommandGroup>
                  {patients.map((patient) => (
                    <CommandItem key={patient.id} value={patient.id} onSelect={() => togglePatient(patient.id)}>
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedPatients.includes(patient.id) ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {patient.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {selectedPatients.length > 0 && (
          <Button variant="ghost" size="icon" onClick={clearPatientFilters} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {(selectedCollaborators.length > 0 || selectedPatients.length > 0) && (
        <div className="flex flex-wrap gap-1 ml-2">
          {selectedCollaborators.map((id) => {
            const collaborator = collaborators.find((c) => c.id === id)
            if (!collaborator) return null
            return (
              <Badge key={id} variant="secondary" className="flex items-center gap-1">
                {collaborator.name}
                <X className="h-3 w-3 cursor-pointer" onClick={() => toggleCollaborator(id)} />
              </Badge>
            )
          })}
          {selectedPatients.map((id) => {
            const patient = patients.find((p) => p.id === id)
            if (!patient) return null
            return (
              <Badge key={id} variant="secondary" className="flex items-center gap-1">
                {patient.name}
                <X className="h-3 w-3 cursor-pointer" onClick={() => togglePatient(id)} />
              </Badge>
            )
          })}
        </div>
      )}
    </div>
  )
}

