'use client'

import { useState, useEffect } from 'react'
import { Holiday } from '../../types/calendar'

export function useHolidays(year: number) {
  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `https://brasilapi.com.br/api/feriados/v1/${year}`,
        )

        if (!response.ok) {
          throw new Error('Falha ao buscar feriados')
        }

        const data = await response.json()
        setHolidays(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro desconhecido'))
        // Em caso de erro, usar alguns feriados nacionais fixos como fallback
        const fallbackHolidays: Holiday[] = [
          {
            date: `${year}-01-01`,
            name: 'Confraternização Universal',
            type: 'national',
          },
          { date: `${year}-04-21`, name: 'Tiradentes', type: 'national' },
          { date: `${year}-05-01`, name: 'Dia do Trabalho', type: 'national' },
          {
            date: `${year}-09-07`,
            name: 'Independência do Brasil',
            type: 'national',
          },
          {
            date: `${year}-10-12`,
            name: 'Nossa Senhora Aparecida',
            type: 'national',
          },
          { date: `${year}-11-02`, name: 'Finados', type: 'national' },
          {
            date: `${year}-11-15`,
            name: 'Proclamação da República',
            type: 'national',
          },
          { date: `${year}-12-25`, name: 'Natal', type: 'national' },
        ]
        setHolidays(fallbackHolidays)
      } finally {
        setLoading(false)
      }
    }

    fetchHolidays()
  }, [year])

  return { holidays, loading, error }
}
