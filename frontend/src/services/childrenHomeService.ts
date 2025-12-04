import { api } from '@/lib/api'
import { ChildrenHome } from '@/types'

export interface ChildrenHomeRequest {
  name: string
  location?: string
  contact?: string
  notes?: string
}

export const childrenHomeService = {
  getAll: async (): Promise<ChildrenHome[]> => {
    const { data } = await api.get('/children-homes')
    return data
  },

  getById: async (id: string): Promise<ChildrenHome> => {
    const { data } = await api.get(`/children-homes/${id}`)
    return data
  },

  create: async (request: ChildrenHomeRequest): Promise<ChildrenHome> => {
    const { data } = await api.post('/children-homes', request)
    return data
  },

  update: async (id: string, request: Partial<ChildrenHomeRequest>): Promise<ChildrenHome> => {
    const { data } = await api.put(`/children-homes/${id}`, request)
    return data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/children-homes/${id}`)
  },
}
