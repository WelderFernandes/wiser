"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface AnimatedTextProps {
  children: ReactNode
}

export function AnimatedText({ children }: AnimatedTextProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      {children}
    </motion.div>
  )
}

