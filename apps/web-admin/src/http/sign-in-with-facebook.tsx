import { api } from './api-client'
interface SignInWithFacebookRequest {
  code: string
}
interface SignInWithFacebookResponse {
  token: string
}
export async function SignInWithFacebook({ code }: SignInWithFacebookRequest) {
  const result = await api
    .post('sessions/facebook', {
      json: {
        code,
      },
    })
    .json<SignInWithFacebookResponse>()
  return result
}
