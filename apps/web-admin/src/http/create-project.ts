import { api } from './api-client'

interface CreateProjectRequest {
  organization: string
  name: string
  description: string
}

type CreateProjectResponse = void

export async function createProject({
  organization,
  name,
  description,
}: CreateProjectRequest): Promise<CreateProjectResponse> {
  await api.post(`organizations/${organization}/projects`, {
    json: {
      name,
      description,
    },
  })
}
