'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { SessionProvider } from 'next-auth/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export function Providers({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const queryClient = new QueryClient()
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <NextThemesProvider {...props}>{children}</NextThemesProvider>
      </QueryClientProvider>
    </SessionProvider>
  )
}
