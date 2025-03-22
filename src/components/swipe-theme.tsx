'use client'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { AnimatePresence, motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export function SwipeTheme() {
  const theme = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      className="absolute top-4 right-4 rounded-full"
      onClick={() => theme.setTheme(theme.theme === 'dark' ? 'light' : 'dark')}
    >
      <AnimatePresence mode="wait">
        {theme.theme === 'light' ? (
          <motion.div
            key="sun"
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="h-5 w-5" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ opacity: 0, rotate: 90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: -90 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="h-5 w-5" />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  )
}
