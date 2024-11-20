import { api } from './api-client'

interface ShutdownOrganizationRequest {
  organization: string
}

export async function shutdownOrganization({
  organization,
}: ShutdownOrganizationRequest) {
  await api.delete(`organizations/${organization}`)
}
