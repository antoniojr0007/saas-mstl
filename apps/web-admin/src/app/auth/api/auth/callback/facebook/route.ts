import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { SignInWithFacebook } from '@/http/sign-in-with-facebook'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.json(
      { message: 'Facebook OAuth code was not found.' },
      { status: 400 },
    )
  }

  const { token } = await SignInWithFacebook({ code })

  // Obtém o objeto cookie
  const cookieStore = await cookies()
  cookieStore.set('session-token', token, {
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  })

  const redirectUrl = request.nextUrl.clone()
  redirectUrl.pathname = '/'
  redirectUrl.search = ''

  return NextResponse.redirect(redirectUrl)
}
