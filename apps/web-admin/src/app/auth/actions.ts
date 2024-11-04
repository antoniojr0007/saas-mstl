'use server'

import { env } from '@saas/env'
import { redirect } from 'next/navigation'

export async function signInWithGithub() {
  const githubSignInURL = new URL('login/oauth/authorize', 'https://github.com')

  githubSignInURL.searchParams.set('client_id', env.GITHUB_OAUTH_CLIENT_ID)
  githubSignInURL.searchParams.set(
    'redirect_uri',
    env.GITHUB_OAUTH_CLIENT_REDIRECT_URI,
  )
  githubSignInURL.searchParams.set('scope', 'user')

  redirect(githubSignInURL.toString())
}

export async function signInWithGoogle() {
  const googleSignInURL = new URL('https://accounts.google.com/o/oauth2/auth')

  googleSignInURL.searchParams.set(
    'client_id',
    '508328687128-flhdl6q9lphq9m5b86u5eend2vjmlvd2.apps.googleusercontent.com',
  )
  googleSignInURL.searchParams.set(
    'redirect_uri',
    'http://localhost:3000/api/auth/callback/google',
  )
  googleSignInURL.searchParams.set('response_type', 'code')
  googleSignInURL.searchParams.set('scope', 'openid profile email')

  redirect(googleSignInURL.toString())
}

export async function signInWithFacebook() {
  const facebookSignInURL = new URL(
    'https://www.facebook.com/v12.0/dialog/oauth',
  )

  facebookSignInURL.searchParams.set('client_id', '1078314600639652')
  facebookSignInURL.searchParams.set(
    'redirect_uri',
    'http://localhost:3000/api/auth/callback/facebook',
  )
  facebookSignInURL.searchParams.set('response_type', 'code')
  facebookSignInURL.searchParams.set('scope', 'public_profile,email')

  redirect(facebookSignInURL.toString())
}
