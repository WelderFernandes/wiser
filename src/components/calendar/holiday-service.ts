"use client"

import type React from "react"

import { useEffect, useState } from "react"

export interface Holiday {
  date: string
  name: string
  type: string
}

export function useHolidays(year: number) {
  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        setLoading(true)
        const response = await fetch(`https://brasilapi.com.br/api/feriados/v1/${year}`)

        if (!response.ok) {
          throw new Error(`Erro ao buscar feriados: ${response.status}`)
        }

        const data = await response.json()
        setHolidays(data)
        setError(null)
      } catch (err) {
        console.error("Erro ao buscar feriados:", err)
        setError(err instanceof Error ? err : new Error("Erro desconhecido ao buscar feriados"))
        setHolidays([])
      } finally {
        setLoading(false)
      }
    }

    fetchHolidays()
  }, [year])

  return { holidays, loading, error }
}

// Função para verificar se uma data é um feriado
export function isHoliday(date: Date, holidays: Holiday[]): Holiday | null {
  const dateString = date.toISOString().split("T")[0] // Formato YYYY-MM-DD
  const holiday = holidays.find((h) => h.date === dateString)
  return holiday || null
}

// Função para obter o estilo de um feriado
export function getHolidayStyle(holiday: Holiday): React.CSSProperties {
  // Cores diferentes para diferentes tipos de feriados
  switch (holiday.type) {
    case "national":
      return {
        background: "linear-gradient(135deg, rgba(255,215,0,0.2) 0%, rgba(255,140,0,0.2) 100%)",
        borderLeft: "4px solid #FFA500",
      }
    default:
      return {
        background: "linear-gradient(135deg, rgba(173,216,230,0.2) 0%, rgba(135,206,250,0.2) 100%)",
        borderLeft: "4px solid #87CEFA",
      }
  }
}

