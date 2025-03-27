'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Loader2, Mail } from 'lucide-react'
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
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Toaster } from '@/components/ui/sonner'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { SwipeTheme } from '@/components/swipe-theme'
import { signInAction, signInFormSchema } from './_action'
import { AuthError } from 'next-auth'

export type LoginFormValues = z.infer<typeof signInFormSchema>

// Componente que lida com parâmetros de busca
function SearchParamsHandler({ children }: { children: (error: string | null) => React.ReactNode }) {
  const searchParams = useSearchParams()
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    const error = searchParams.get('error')
    if (error) {
      setAuthError(getErrorMessage(error))
    }
  }, [searchParams])

  // Função para traduzir códigos de erro em mensagens amigáveis
  function getErrorMessage(errorCode: string): string {
    const errorMessages: Record<string, string> = {
      CredentialsSignin:
        'Email ou senha incorretos. Verifique suas credenciais.',
      default: 'Ocorreu um erro durante o login. Tente novamente.',
      Configuration:
        'Problema na configuração do sistema. Contate o administrador.',
      InvalidCredentials: 'Credenciais inválidas. Verifique seu email e senha.',
      UserNotFound: 'Usuário não encontrado.',
      IncorrectPassword: 'Senha incorreta. Tente novamente.',
      ValidationError: 'Dados inválidos. Verifique os campos informados.',
      ServerError: 'Erro no servidor. Tente novamente mais tarde.',
    }

    return errorMessages[errorCode] || errorMessages.default
  }

  return <>{children(authError)}</>
}

export default function SignInForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [authError, setAuthError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  // Função para traduzir códigos de erro em mensagens amigáveis
  function getErrorMessage(errorCode: string): string {
    const errorMessages: Record<string, string> = {
      CredentialsSignin:
        'Email ou senha incorretos. Verifique suas credenciais.',
      default: 'Ocorreu um erro durante o login. Tente novamente.',
      Configuration:
        'Problema na configuração do sistema. Contate o administrador.',
      InvalidCredentials: 'Credenciais inválidas. Verifique seu email e senha.',
      UserNotFound: 'Usuário não encontrado.',
      IncorrectPassword: 'Senha incorreta. Tente novamente.',
      ValidationError: 'Dados inválidos. Verifique os campos informados.',
      ServerError: 'Erro no servidor. Tente novamente mais tarde.',
    }

    return errorMessages[errorCode] || errorMessages.default
  }

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    setAuthError(null) // Limpa erros anteriores

    try {
      const formData = new FormData()
      formData.append('email', data.email)
      formData.append('password', data.password)

      // Chama a server action
      const response = await signInAction(formData)

      if (response?.error) {
        // Define o erro de autenticação no estado local
        setAuthError(getErrorMessage(response.error))
      }

      if (response?.success) {
        toast.success('Login bem-sucedido! Redirecionando...', {
          position: 'top-center',
        })

        // Redireciona programaticamente sem recarregar a página
        setTimeout(() => {
          router.push('/dashboard')
          router.refresh() // Atualiza o estado da autenticação
        }, 1000)
      }
    } catch (error: AuthError | unknown) {
      if (error instanceof AuthError) {
        // Define o erro de autenticação no estado local
        setAuthError(error.message)
      }
      console.error('Erro ao processar login:', error)

      // Não mostra o toast se já estamos exibindo o erro no formulário
      if (!authError) {
        toast.error('Falha no login. Por favor, verifique suas credenciais.', {
          position: 'top-center',
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true)
    setAuthError(null) // Limpa erros anteriores
    try {
      // Aqui você deve implementar a lógica para o login social
      // com o NextAuth sem usar redirect: true

      toast.success(`Login com ${provider} iniciado...`, {
        position: 'top-center',
      })

      // Redireciona para o provedor de autenticação social
      // Nota: este é um exemplo e pode precisar ser ajustado
      window.location.href = `/api/auth/signin/${provider.toLowerCase()}`
    } catch (error) {
      console.error(`Erro ao iniciar login com ${provider}:`, error)
      toast.error(
        `Falha ao iniciar login com ${provider}. Por favor, tente novamente.`,
        {
          position: 'top-center',
        },
      )
      setIsLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 2,
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

  const renderForm = (urlAuthError: string | null) => {
    // Combinamos os erros de URL com os erros do estado local
    const currentAuthError = authError || urlAuthError;

    return (
      <motion.div>
        <SwipeTheme />
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="w-md mx-auto mt-8"
        >
          <Card className="border-none shadow-lg dark:bg-slate-900/60 backdrop-blur-sm">
            <CardHeader>
              {currentAuthError && (
                <motion.div
                  initial={{ opacity: 0, y: -1, scale: 0.5 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="bg-destructive/15 text-destructive p-4 rounded-md"
                >
                  {currentAuthError}
                </motion.div>
              )}
              <CardTitle className="text-2xl font-bold">
                Bem-vindo de volta
              </CardTitle>
              <CardDescription>
                Insira suas credenciais para acessar sua conta
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
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Senha</Label>
                    <Button variant="link" className="p-0 h-auto text-xs">
                      Esqueceu a senha?
                    </Button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      {...register('password')}
                      aria-invalid={errors.password ? 'true' : 'false'}
                      className={cn(
                        'transition-all duration-200 focus:ring-2 focus:ring-primary/20',
                        errors.password &&
                          'border-destructive focus:ring-destructive/20',
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? 'Ocultar senha' : 'Mostrar senha'
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-destructive mt-1"
                    >
                      {errors.password.message}
                    </motion.p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember-me" {...register('rememberMe')} />
                  <Label htmlFor="remember-me" className="text-sm">
                    Lembrar-me
                  </Label>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    'Entrar'
                  )}
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background dark:bg-slate-900 px-2 text-muted-foreground">
                    Ou continue com
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={() => handleSocialLogin('Google')}
                  disabled={isLoading}
                  className="transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <Mail className="mr-2 h-4 w-4 text-red-500" />
                  Google
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSocialLogin('GitHub')}
                  disabled={isLoading}
                  className="transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  GitHub
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-muted-foreground">
                Não tem uma conta?{' '}
                <Link href="/sign-up" className="text-primary hover:underline">
                  Cadastre-se
                </Link>
              </p>
            </CardFooter>
          </Card>
        </motion.div>

        <Toaster />
      </motion.div>
    );
  };

  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <SearchParamsHandler>
        {(urlAuthError) => renderForm(urlAuthError)}
      </SearchParamsHandler>
    </Suspense>
  );
}