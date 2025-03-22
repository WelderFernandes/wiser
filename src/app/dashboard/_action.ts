'use server'

import { auth } from '@/auth'
import db from '@/lib/prisma'

export async function getOrganizations() {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      throw new Error('Unauthorized')
    }

    const organizations = await db.organization.findMany({
      where: {
        owner: {
          email: session.user.email,
        },
      },
      include: {
        owner: true,
      },
    })

    return {
      error: false,
      message: 'Organizations fetched successfully',
      data: organizations,
    }
  } catch (error) {
    console.error('Error fetching organizations:', error)
    throw new Error('Failed to fetch organizations')
  }
}
