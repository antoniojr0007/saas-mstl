import { api } from './api-client'

interface UpdateOrganizationRequest {
  organization: string
  name: string
  domain: string | null
  shouldAttachUsersByDomain: boolean
}

type UpdateOrganizationResponse = void

export async function updateOrganization({
  org,
  name,
  domain,
  shouldAttachUsersByDomain,
}: UpdateOrganizationRequest): Promise<UpdateOrganizationResponse> {
  await api.put(`organizations/${organization}`, {
    json: {
      name,
      domain,
      shouldAttachUsersByDomain,
    },
  })
}
