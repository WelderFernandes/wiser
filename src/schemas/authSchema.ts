import { z } from 'zod'

export const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(2),
})

export type Auth = z.infer<typeof authSchema>

export const signUpFormSchema = z.object({
  email: z.string().email({ message: 'Por favor, forneça um endereço de e-mail válido' }),
  password: z.string().min(6, { message: 'Por favor, forneça uma senha' }),
  confirmPassword: z.string().min(6, { message: 'As senhas não coincidem' }),
  name: z.string().min(3, { message: 'Por favor, forneça um nome' }),
  rememberMe: z.boolean().optional(),
}).superRefine(({ confirmPassword, password }, ctx) => {
  if (confirmPassword !== password) {
    ctx.addIssue({
      code: 'custom',
      message: 'As senhas não coincidem',
      path: ['confirmPassword'],
    })
  }
})

export type UserRegister = z.infer<typeof signUpFormSchema>