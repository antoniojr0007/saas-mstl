import { api } from './api-client'
interface GetProjectsResponse {
  projects: {
    description: string
    slug: string
    id: string
    name: string
    avatarUrl: string | null
    organizationId: string
    ownerId: string
    createdAt: string
    owner: {
      id: string
      name: string | null
      avatarUrl: string | null
    }
  }[]
}
export async function getProjects(organization: string) {
  const result = await api
    .get(`organizations/${organization}/projects`)
    .json<GetProjectsResponse>()
  return result
}
