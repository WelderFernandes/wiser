import { signIn } from 'next-auth/react'
import { z } from 'zod'

export const signInFormSchema = z.object({
  email: z.string().email({ message: 'Please provide a valid email address' }),
  password: z.string().min(6, { message: 'Please provide a password' }),
  rememberMe: z.boolean().optional(),
})

export async function signInAction(formData: FormData) {
  const result = signInFormSchema.safeParse(Object.fromEntries(formData))

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

  const response = await signIn('credentials', {
    email: result.data.email,
    password: result.data.password,
    redirect: false,
    callbackUrl: '/dashboard',
  })
  console.log('🚀 ~ signInAction ~ response:', response)

  if (response?.error) {
    return {
      success: false,
      error: response.error,
      message: null,
      formValidateErrors: null,
    }
  }

  return {
    success: true,
    message: 'Sign in successful',
    error: null,
    formValidateErrors: null,
  }
}
