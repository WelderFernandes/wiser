import db from '@/lib/prisma'
import { User } from '@prisma/client'

export async function getCurrentUser(userId: string): Promise<User | null> {
  try {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!user) {
      return null
    }

    return user
  } catch (error) {
    console.error('Error fetching current user:', error)
    return null
  }
}
