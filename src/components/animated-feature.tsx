"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { ReactNode } from "react"

interface AnimatedFeatureProps {
  icon: ReactNode
  title: string
  description: string
}

export function AnimatedFeature({ icon, title, description }: AnimatedFeatureProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
      <Card className="h-full transition-all duration-200 hover:shadow-lg glass-card border-primary/20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
        <CardHeader>
          <div className="mb-2 bg-primary/10 p-3 rounded-lg inline-block">{icon}</div>
          <h3 className="text-xl font-bold">{title}</h3>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

