'use server'
import db from '@/lib/prisma'
import { Organization } from '@prisma/client'
type CreateOrganizationInput = Organization & {
  ownerId: string
}

export async function createOrganization(input: CreateOrganizationInput) {
  try {
    const owner = await db.user.findUnique({
      where: { id: input.ownerId },
    })

    if (!owner) {
      throw new Error('Owner not found')
    }

    if (input.slug) {
      const existingSlug = await db.organization.findUnique({
        where: { slug: input.slug },
      })
      if (existingSlug) {
        throw new Error('Slug already exists')
      }
    }

    const organization = await db.organization.create({
      data: {
        name: input.name,
        description: input.description,
        slug: input.slug,
        domain: input.domain,
        shouldAttachUsersByDomain: input.shouldAttachUsersByDomain,
        logoUrl: input.logoUrl,
        ownerId: input.ownerId,
        OrganizationMember: {
          create: {
            userId: input.ownerId,
          },
        },
      },
    })

    return organization
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create organization: ${error.message}`)
    }
    throw new Error('Failed to create organization')
  }
}
