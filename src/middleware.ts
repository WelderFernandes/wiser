import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  })

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      const url = new URL('/sign-in', request.url)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/schedule/:path*',
    '/calendar/:path*',
    '/tasks/:path*',
    '/services/:path*',
    '/contact/:path*',
  ],
}
