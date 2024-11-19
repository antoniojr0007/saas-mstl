import { Role } from '@saas/auth'

import { api } from './api-client'

interface UpdateMemberRequest {
  organization: string
  memberId: string
  role: Role
}

export async function updateMember({
  org,
  memberId,
  role,
}: UpdateMemberRequest) {
  await api.put(`organizations/${organization}/members/${memberId}`, {
    json: { role },
  })
}
