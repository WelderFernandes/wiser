/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState } from 'react'
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  Mail,
  Lock,
  User2Icon,
} from 'lucide-react'
import { z } from 'zod'
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { DynamicInput } from '@/components/dynamic-input'

// Esquema de validação Zod
const passwordSchema = z
  .string()
  .min(8, 'Senha deve ter pelo menos 8 caracteres')
  .refine(
    (val) => /[A-Z]/.test(val),
    'Senha deve conter pelo menos uma letra maiúscula',
  )
  .refine((val) => /[0-9]/.test(val), 'Senha deve conter pelo menos um número')
  .refine(
    (val) => /[^A-Za-z0-9]/.test(val),
    'Senha deve conter pelo menos um caractere especial',
  )

const signUpSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Nome deve ter pelo menos 3 caracteres')
      .max(70, 'Nome não pode exceder 70 caracteres'),
    email: z.string().email('Formato de email inválido'),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

// Tipo derivado do esquema
type FormValues = z.infer<typeof signUpSchema>

// Enum para força de senha
// enum PasswordStrength {
//   VeryWeak = 0,
//   Weak = 1,
//   Medium = 2,
//   Strong = 3,
//   VeryStrong = 4,
// }

/**
 * SignUpForm - Formulário de cadastro com validação Zod
 */
export function SignUpForm() {
  // Estado do formulário usando um único objeto de estado
  const [form, setForm] = useState({
    values: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    } as FormValues,
    touched: {} as Record<keyof FormValues, boolean>,
    errors: {} as Record<keyof FormValues, string>,
    showPassword: false,
    isSubmitting: false,
    isSuccess: false,
    serverError: null as string | null,
  })

  // Validação de um campo específico
  const validateField = (
    field: keyof FormValues,
    value: string,
    allValues = form.values,
  ) => {
    const newValues = { ...allValues, [field]: value }
    try {
      // Para o campo confirmPassword ou password, valide ambos juntos
      if (field === 'confirmPassword' || field === 'password') {
        signUpSchema.parse(newValues)
        return ''
      } else {
        // Para outros campos, valide apenas o campo específico
        const fieldSchema = signUpSchema._def.schema.shape[field]
        fieldSchema.parse(value)
        return ''
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Encontre o erro para este campo específico
        const fieldError = error.errors.find(
          (e) =>
            e.path.includes(field) ||
            (field === 'password' && e.path.includes('confirmPassword')),
        )
        return fieldError?.message || ''
      }
      return ''
    }
  }

  // Validação do formulário completo
  const validateForm = () => {
    try {
      signUpSchema.parse(form.values)
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = {} as Record<keyof FormValues, string>

        error.errors.forEach((issue) => {
          const path = issue.path[0] as keyof FormValues
          if (path) newErrors[path] = issue.message
        })

        setForm((prev) => ({
          ...prev,
          errors: newErrors,
        }))
      }
      return false
    }
  }

  // Handler para alterações nos campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const fieldName = name as keyof FormValues

    // Atualizar valor
    const newValues = { ...form.values, [fieldName]: value }

    // Validar o campo
    const errorMessage = validateField(fieldName, value, newValues)

    // Verificar se confirmPassword também precisa ser validado
    let confirmPasswordError = ''
    if (fieldName === 'password' && form.values.confirmPassword) {
      confirmPasswordError = validateField(
        'confirmPassword',
        form.values.confirmPassword,
        newValues,
      )
    }

    setForm((prev) => ({
      ...prev,
      values: newValues,
      errors: {
        ...prev.errors,
        [fieldName]: errorMessage,
        ...(fieldName === 'password' && form.values.confirmPassword
          ? { confirmPassword: confirmPasswordError }
          : {}),
      },
    }))
  }

  // Handler para submissão do formulário
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Marcar todos os campos como tocados
    const allTouched = Object.keys(form.values).reduce(
      (acc, key) => {
        acc[key as keyof FormValues] = true
        return acc
      },
      {} as Record<keyof FormValues, boolean>,
    )

    setForm((prev) => ({
      ...prev,
      touched: allTouched,
    }))

    // Validar o formulário
    if (!validateForm()) return

    // Simulação de envio
    setForm((prev) => ({
      ...prev,
      isSubmitting: true,
      serverError: null,
    }))

    setTimeout(() => {
      try {
        // Simulação de sucesso
        setForm((prev) => ({
          ...prev,
          isSubmitting: false,
          isSuccess: true,
        }))

        // Simulação de redirecionamento
        setTimeout(() => {
          console.log('Redirecionando para o dashboard...')
        }, 2000)
      } catch (error: any) {
        console.log('🚀 ~ setTimeout ~ error:', error)
        // Simulação de erro
        setForm((prev) => ({
          ...prev,
          isSubmitting: false,
          serverError: 'Falha ao processar o cadastro. Tente novamente.',
        }))
      }
    }, 1500)
  }

  // Calcula a força da senha
  // const getPasswordStrength = (password: string): PasswordStrength => {
  //   if (!password) return PasswordStrength.VeryWeak

  //   let strength = 0
  //   if (password.length >= 8) strength += 1
  //   if (/[A-Z]/.test(password)) strength += 1
  //   if (/[0-9]/.test(password)) strength += 1
  //   if (/[^A-Za-z0-9]/.test(password)) strength += 1

  //   return strength as PasswordStrength
  // }

  // Toggle para mostrar/esconder senha
  // const togglePasswordVisibility = () => {
  //   setForm((prev) => ({
  //     ...prev,
  //     showPassword: !prev.showPassword,
  //   }))
  // }

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <Card
        className={`border shadow-lg transition-all duration-300 ${form.isSuccess ? 'border-green-500' : ''}`}
      >
        <CardHeader className="space-y-2">
          {form.serverError && (
            <Alert variant="destructive" className="mb-2">
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertDescription>{form.serverError}</AlertDescription>
            </Alert>
          )}

          {form.isSuccess && (
            <Alert
              variant="default"
              className="mb-2 bg-green-50 text-green-800 border-green-500"
            >
              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
              <AlertDescription>
                Cadastro realizado com sucesso! Redirecionando...
              </AlertDescription>
            </Alert>
          )}

          <CardTitle className="text-2xl font-bold">Criar uma conta</CardTitle>
          <CardDescription>
            Preencha os campos abaixo para criar uma conta.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <DynamicInput
                id="name"
                name="name"
                label="Nome completo"
                placeholder="Digite seu nome"
                icon={<User2Icon className="h-4 w-4" />}
                type="text"
                iconPosition="start"
                error={form.errors.name}
                onChange={handleChange}
              />

              <DynamicInput
                id="email"
                label="E-mail"
                name="email"
                type="email"
                placeholder="nome@exemplo.com"
                onChange={handleChange}
                icon={<Mail className="h-4 w-4" />}
                error={form.errors.email}
              />

              <Separator className="my-2" />

              <div className="space-y-4">
                <DynamicInput
                  id="password"
                  label="Senha"
                  onChange={handleChange}
                  name="password"
                  type={form.showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  icon={<Lock className="h-4 w-4" />}
                  error={form.errors.password}
                />

                <DynamicInput
                  id="confirmPassword"
                  label="Confirmar Senha"
                  onChange={handleChange}
                  name="confirmPassword"
                  type={form.showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  icon={<Lock className="h-4 w-4" />}
                  error={form.errors.confirmPassword}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full transition-all duration-300"
              variant={form.isSuccess ? 'outline' : 'default'}
              disabled={form.isSubmitting || form.isSuccess}
              aria-busy={form.isSubmitting}
            >
              {form.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : form.isSuccess ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                  Cadastrado com sucesso
                </>
              ) : (
                'Cadastrar'
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2 items-center">
          <Separator className="w-full my-2" />
          <p className="text-sm text-muted-foreground">
            Já possui uma conta?{' '}
            <Button variant="link" className="p-0 h-auto">
              Entrar
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
