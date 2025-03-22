'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <div className="flex flex-1 w-full flex-col items-center justify-center min-h-screen space-y-8">
      <motion.div
        className="text-center space-y-1.5"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          ✨ Bem-vindo ao Slot Wise! ✨
        </h1>
        <h2 className="text-2xl font-bold tracking-tight text-primary">
          Agende, Gerencie e Cresça! 🚀
        </h2>
        <p className="text-muted-foreground max-w-3xl">
          Seu tempo vale ouro! Simplifique seus agendamentos, organize sua
          rotina e ofereça uma experiência impecável para seus clientes. Comece
          agora!
        </p>
      </motion.div>

      <div className="pt-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full flex items-center justify-center"
        >
          <Card className="h-full w-3/4 transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle>Vamos começar!</CardTitle>
              <CardDescription>
                Primeiro passo para começar a usar o Slot Wise e criar sua
                orgniação.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/first-access/register" className="block w-full">
                <Button className="w-full transition-all duration-300 hover:scale-105">
                  Criar Organização
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
