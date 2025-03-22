'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function SuccessPage() {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    // Show confetti after a short delay
    const timer = setTimeout(() => {
      setShowConfetti(true)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen py-12 relative overflow-hidden">
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 100 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: `hsl(${Math.random() * 360}, 80%, 60%)`,
                top: `${Math.random() * -30}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: ['0vh', '100vh'],
                x: [0, Math.random() * 100 - 50],
              }}
              transition={{
                duration: Math.random() * 2 + 2,
                ease: 'linear',
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <motion.div
              className="flex justify-center mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
              transition={{
                scale: { duration: 0.5 },
                rotate: { duration: 0.5, delay: 0.5 },
              }}
            >
              <CheckCircle2 className="h-16 w-16 text-primary" />
            </motion.div>
            <CardTitle className="text-2xl">Success!</CardTitle>
            <CardDescription>
              Sua organização foi criada com sucesso.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center tex">
            <motion.p
              className="mb-4 tracking-tight"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Enviamos um e-mail de confirmação para o endereço de e-mail do
              administrador que você oferecido. Verifique sua caixa de entrada
              para verificar sua conta.
            </motion.p>
            <motion.p
              className="text-sm text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              Agora você pode fazer login no painel da sua organização e começar
              a convidar membros.
            </motion.p>
          </CardContent>
          <CardFooter className="flex justify-center space-x-4">
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="transition-all duration-300 hover:scale-105"
              >
                Ir para o painel
              </Button>
            </Link>
            <Link href="/invite">
              <Button className="transition-all duration-300 hover:scale-105">
                Convidar membros
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
