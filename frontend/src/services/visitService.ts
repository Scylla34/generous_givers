import { api } from '@/lib/api'
import { Visit, VisitRequest, ApiResponse } from '@/types'

export const visitService = {
  getAll: async (): Promise<Visit[]> => {
    const { data } = await api.get<ApiResponse<Visit[]>>('/visits')
    return Array.isArray(data.data) ? data.data : []
  },

  getById: async (id: string): Promise<Visit> => {
    const { data } = await api.get<ApiResponse<Visit>>(`/visits/${id}`)
    return data.data
  },

  getByChildrenHome: async (childrenHomeId: string): Promise<Visit[]> => {
    const { data } = await api.get<ApiResponse<Visit[]>>(`/visits/children-home/${childrenHomeId}`)
    return Array.isArray(data.data) ? data.data : []
  },

  create: async (request: VisitRequest): Promise<Visit> => {
    const { data } = await api.post<ApiResponse<Visit>>('/visits', request)
    return data.data
  },

  update: async (id: string, request: Partial<VisitRequest>): Promise<Visit> => {
    const { data } = await api.put<ApiResponse<Visit>>(`/visits/${id}`, request)
    return data.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete<ApiResponse<void>>(`/visits/${id}`)
  },
}
