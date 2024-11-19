import { api } from './api-client'

interface ShutdownOrganizationRequest {
  organization: string
}

export async function shutdownOrganization({
  org,
}: ShutdownOrganizationRequest) {
  await api.delete(`organizations/${organization}`)
}
