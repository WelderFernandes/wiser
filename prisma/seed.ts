import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

export async function main() {
  // Create main user
  const passwordHash = await hash('testeteste', 12)

  const mainUser = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'testes@teste.com',
      passwordHash,
      emailVerified: new Date(),
    },
  })

  // Create secondary user
  const secondUser = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      passwordHash: await hash('password456', 12),
      emailVerified: new Date(),
    },
  })

  // Create a organization
  const organization = await prisma.organization.create({
    data: {
      name: 'Zently Corp',
      description: 'A modern software organization',
      ownerId: mainUser.id,
      slug: 'zently-corp',
    },
  })

  // Create organization member
  await prisma.organizationMember.create({
    data: {
      userId: secondUser.id,
      organizationId: organization.id,
    },
  })

  // Create session
  await prisma.session.create({
    data: {
      sessionToken: 'sample-session-token',
      userId: mainUser.id,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
  })

  // Create account
  await prisma.account.create({
    data: {
      userId: mainUser.id,
      type: 'credentials',
      provider: 'local',
      providerAccountId: '1',
      access_token: 'sample-access-token',
      token_type: 'bearer',
      scope: 'user',
    },
  })

  // Create authenticator (WebAuthn example)
  await prisma.authenticator.create({
    data: {
      credentialID: 'sample-credential-id',
      userId: mainUser.id,
      providerAccountId: '1',
      credentialPublicKey: 'sample-public-key',
      counter: 0,
      credentialDeviceType: 'platform',
      credentialBackedUp: true,
      transports: 'usb,nfc',
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
