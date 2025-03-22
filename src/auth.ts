import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { authSchema } from './schemas/authSchema'
import db from './lib/prisma'
import bcrypt from 'bcryptjs'

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'email', type: 'email', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null
        }

        try {
          const validateCredentials = authSchema.parse(credentials)

          const user = await db.user.findUnique({
            where: {
              email: validateCredentials.email,
            },
          })

          if (!user || !user.passwordHash) {
            return null
          }

          // Use await para comparar a senha
          const isPasswordValid = await bcrypt.compare(
            validateCredentials.password,
            user.passwordHash,
          )

          if (!isPasswordValid) {
            return null
          }

          // Retorna o usuário sem informações sensíveis
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            // Não inclua a senha aqui
          }
        } catch (error) {
          console.error('Erro durante autorização:', error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 dias
    updateAge: 24 * 60 * 60, // 24 horas
    generateSessionToken: () => {
      return crypto.randomUUID()
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
      }
      return session
    },
  },
  pages: {
    signIn: '/sign-in', // Página de login
    signOut: '/sign-out', // Página de logout
    error: '/sign-in', // Redirecionamento de erro para a página de login
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
})
