import { api } from '@/lib/api'
import { CreateUserRequest, UpdateUserRequest, User, UserRole } from '@/types'

export const userService = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users')
    return response.data
  },

  getById: async (id: string): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`)
    return response.data
  },

  create: async (data: CreateUserRequest): Promise<User> => {
    const response = await api.post<User>('/users', data)
    return response.data
  },

  update: async (id: string, data: UpdateUserRequest): Promise<User> => {
    const response = await api.put<User>(`/users/${id}`, data)
    return response.data
  },

  updateRole: async (id: string, role: UserRole): Promise<User> => {
    const response = await api.patch<User>(`/users/${id}/role?role=${role}`)
    return response.data
  },

  deactivate: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`)
  },

  getByRole: async (role: UserRole): Promise<User[]> => {
    const response = await api.get<User[]>(`/users/role/${role}`)
    return response.data
  },
}

export interface UpdateUserRequest {
  name?: string
  email?: string
  phone?: string
  password?: string
}
