'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, ArrowLeft } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Toaster } from '@/components/ui/sonner'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const recoverPasswordSchema = z.object({
  email: z
    .string()
    .email({ message: 'Por favor, insira um endereço de e-mail válido' }),
})

type RecoverPasswordFormValues = z.infer<typeof recoverPasswordSchema>

export default function RecoverPasswordPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RecoverPasswordFormValues>({
    resolver: zodResolver(recoverPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: RecoverPasswordFormValues) => {
    setIsLoading(true)
    console.log(data)
    try {
      // Simular chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast.success(
        'Instruções de recuperação de senha enviadas. Verifique seu e-mail.',
        {
          position: 'top-center',
        },
      )

      setTimeout(() => {
        router.push('/signin')
      }, 3000)
    } catch (error) {
      console.error(error)
      toast.error(
        'Falha ao enviar instruções de recuperação. Por favor, tente novamente.',
        {
          position: 'top-center',
        },
      )
    } finally {
      setIsLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: 'easeIn',
      },
    },
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full max-w-md"
      >
        <Card className="border-none shadow-lg dark:bg-slate-900/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Recuperar Senha
            </CardTitle>
            <CardDescription>
              Insira seu e-mail para receber instruções de recuperação de senha
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nome@exemplo.com"
                  {...register('email')}
                  aria-invalid={errors.email ? 'true' : 'false'}
                  className={cn(
                    'transition-all duration-200 focus:ring-2 focus:ring-primary/20',
                    errors.email &&
                      'border-destructive focus:ring-destructive/20',
                  )}
                />
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-destructive mt-1"
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar instruções'
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link
              href="/signin"
              className="text-sm text-primary hover:underline flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para o login
            </Link>
          </CardFooter>
        </Card>
      </motion.div>

      <Toaster />
    </div>
  )
}
