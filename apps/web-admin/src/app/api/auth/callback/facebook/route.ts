import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { acceptInvite } from '@/http/accept-invite'
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

  const cookieStore = await cookies()
  cookieStore.set('session-token', token, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  const inviteId = cookieStore.get('inviteId')?.value

  if (inviteId) {
    try {
      await acceptInvite(inviteId)
      cookieStore.delete('inviteId')
    } catch (error) {
      console.error('Error accepting invite:', error)
    }
  }

  const redirectUrl = request.nextUrl.clone()
  redirectUrl.pathname = '/'
  redirectUrl.search = ''

  return NextResponse.redirect(redirectUrl)
}
