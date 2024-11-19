import { api } from './api-client'

interface GetBillingResponse {
  billing: {
    seats: {
      amount: number
      unit: number
      price: number
    }
    projects: {
      amount: number
      unit: number
      price: number
    }
    total: number
  }
}

export async function getBilling(organization: string) {
  const result = await api
    .get(`organizations/${organization}/billing`)
    .json<GetBillingResponse>()

  return result
}
