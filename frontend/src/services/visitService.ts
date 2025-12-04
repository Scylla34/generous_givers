import { api } from '@/lib/api'
import { Visit, VisitRequest } from '@/types'

export const visitService = {
  getAll: async (): Promise<Visit[]> => {
    const { data } = await api.get('/visits')
    return data
  },

  getById: async (id: string): Promise<Visit> => {
    const { data } = await api.get(`/visits/${id}`)
    return data
  },

  getByChildrenHome: async (childrenHomeId: string): Promise<Visit[]> => {
    const { data } = await api.get(`/visits/children-home/${childrenHomeId}`)
    return data
  },

  create: async (request: VisitRequest): Promise<Visit> => {
    const { data } = await api.post('/visits', request)
    return data
  },

  update: async (id: string, request: Partial<VisitRequest>): Promise<Visit> => {
    const { data } = await api.put(`/visits/${id}`, request)
    return data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/visits/${id}`)
  },
}
