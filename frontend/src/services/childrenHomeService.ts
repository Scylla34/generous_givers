import { api } from '@/lib/api'
import { ChildrenHome, ApiResponse } from '@/types'

export interface ChildrenHomeRequest {
  name: string
  location?: string
  contact?: string
  notes?: string
}

export const childrenHomeService = {
  getAll: async (): Promise<ChildrenHome[]> => {
    const { data } = await api.get<ApiResponse<ChildrenHome[]>>('/children-homes')
    return Array.isArray(data.data) ? data.data : []
  },

  getById: async (id: string): Promise<ChildrenHome> => {
    const { data } = await api.get<ApiResponse<ChildrenHome>>(`/children-homes/${id}`)
    return data.data
  },

  create: async (request: ChildrenHomeRequest): Promise<ChildrenHome> => {
    const { data } = await api.post<ApiResponse<ChildrenHome>>('/children-homes', request)
    return data.data
  },

  update: async (id: string, request: Partial<ChildrenHomeRequest>): Promise<ChildrenHome> => {
    const { data } = await api.put<ApiResponse<ChildrenHome>>(`/children-homes/${id}`, request)
    return data.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete<ApiResponse<void>>(`/children-homes/${id}`)
  },
}
