import { api } from '@/lib/api'
import { Project, ProjectRequest, ApiResponse } from '@/types'

export type { Project, ProjectRequest }

export const projectService = {
  getAll: async (): Promise<Project[]> => {
    const response = await api.get<ApiResponse<Project[]>>('/projects')
    return response.data.data
  },

  getActive: async (): Promise<Project[]> => {
    const response = await api.get<ApiResponse<Project[]>>('/projects/active')
    return response.data.data
  },

  getById: async (id: string): Promise<Project> => {
    const response = await api.get<ApiResponse<Project>>(`/projects/${id}`)
    return response.data.data
  },

  create: async (data: ProjectRequest): Promise<Project> => {
    const response = await api.post<ApiResponse<Project>>('/projects', data)
    return response.data.data
  },

  update: async (id: string, data: ProjectRequest): Promise<Project> => {
    const response = await api.put<ApiResponse<Project>>(`/projects/${id}`, data)
    return response.data.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete<ApiResponse<void>>(`/projects/${id}`)
  },
}
