import { Role } from '@saas/auth'

import { api } from './api-client'

interface GetInvitesResponse {
  invites: {
    id: string
    role: Role
    email: string
    createdAt: string
    author: {
      id: string
      name: string | null
    } | null
  }[]
}

export async function getInvites(organization: string) {
  const result = await api
    .get(`organizations/${organization}/invites`, {
      next: {
        tags: [`${organization}/invites`],
      },
    })
    .json<GetInvitesResponse>()

  return result
}
