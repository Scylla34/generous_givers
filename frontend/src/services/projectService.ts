import { api } from '@/lib/api'
import { Project, ProjectRequest } from '@/types'

export const projectService = {
  getAll: async (): Promise<Project[]> => {
    const response = await api.get<Project[]>('/projects')
    return response.data
  },

  getActive: async (): Promise<Project[]> => {
    const response = await api.get<Project[]>('/projects/active')
    return response.data
  },

  getById: async (id: string): Promise<Project> => {
    const response = await api.get<Project>(`/projects/${id}`)
    return response.data
  },

  create: async (data: ProjectRequest): Promise<Project> => {
    const response = await api.post<Project>('/projects', data)
    return response.data
  },

  update: async (id: string, data: ProjectRequest): Promise<Project> => {
    const response = await api.put<Project>(`/projects/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/projects/${id}`)
  },
}
