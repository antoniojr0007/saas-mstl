import { api } from './api-client'

interface GetOrganizationResponse {
  organization: {
    slug: string
    id: string
    name: string
    domain: string | null
    shouldAttachUsersByDomain: boolean
    avatarUrl: string | null
    createdAt: string
    updatedAt: string
    ownerId: string
  }
}

export async function getOrganization(organization: string) {
  const result = await api
    .get(`organizations/${organization}`, {
      next: {
        tags: ['organization'],
      },
    })
    .json<GetOrganizationResponse>()

  return result
}
