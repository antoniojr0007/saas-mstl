import { Role } from '@saas/auth'

import { api } from './api-client'

interface CreateInviteRequest {
  organization: string
  email: string
  role: Role
}

type CreateInviteResponse = void

export async function createInvite({
  org,
  email,
  role,
}: CreateInviteRequest): Promise<CreateInviteResponse> {
  await api.post(`organizations/${organization}/invites`, {
    json: {
      email,
      role,
    },
  })
}
