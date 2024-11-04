import { api } from './api-client'

interface SignInSignInWithPasswordRequest {
  email: string
  password: string
}
interface SignInSignInWithPasswordResponse {
  token: string
}

export async function SignInWithPassword({
  email,
  password,
}: SignInSignInWithPasswordRequest) {
  const result = await api
    .post('sessions/password', {
      json: {
        email,
        password,
      },
    })
    .json<SignInSignInWithPasswordResponse>()

  return result
}
