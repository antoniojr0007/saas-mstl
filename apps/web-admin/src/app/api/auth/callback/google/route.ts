import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { acceptInvite } from '@/http/accept-invite'
import { signInWithGoogle } from '@/http/sign-in-with-google'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.json(
      { message: 'Google OAuth code was not found.' },
      { status: 400 },
    )
  }

  try {
    const { token } = await signInWithGoogle({ code })

    if (!token) {
      return NextResponse.json(
        { message: 'Failed to retrieve token from Google.' },
        { status: 401 },
      )
    }

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
  } catch (error) {
    console.error('Error during Google sign-in:', error)
    return NextResponse.json(
      { message: 'An error occurred during Google sign-in.' },
      { status: 500 },
    )
  }
}
