import db from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { z } from 'zod'

export const signInFormSchema = z.object({
  email: z.string().email({ message: 'Please provide a valid email address' }),
  password: z.string().min(6, { message: 'Please provide a password' }),
  name: z.string().min(3, { message: 'Please provide a name' }),
  rememberMe: z.boolean().optional(),
})

export async function signUpAction(formData: FormData) {
  const result = signInFormSchema.safeParse(Object.fromEntries(formData))
  console.log('🚀 ~ signUpAction ~ result:', result)

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    console.log('🚀 ~ signInAction ~ result:', errors)
    return {
      error: result.error.issues[0].message,
      success: false,
      message: null,
      formValidateErrors: errors,
    }
  }

  const checkUserExists = await db.user.findUnique({
    where: {
      email: result.data.email,
    },
  })

  if (checkUserExists) {
    return {
      success: false,
      error: 'Usuario já cadastrado',
      message: 'Usuario já cadastrado',
      formValidateErrors: null,
    }
  }

  try {
    await db.user.create({
      data: {
        name: result.data.name,
        email: result.data.email,
        passwordHash: result.data.password,
      },
    })

    return {
      success: true,
      message: 'Usuário cadastrado com sucesso',
      error: null,
      formValidateErrors: null,
    }
  } catch (error: Prisma.PrismaClientKnownRequestError | unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return {
        success: false,
        error: 'Email já cadastrado',
        message: 'Email já cadastrado',
        formValidateErrors: null,
      }
    }
    return {
      success: false,
      error: 'Erro ao cadastrar usuário',
      message: 'Erro ao cadastrar usuário',
      formValidateErrors: null,
    }
  }
}
