import { api } from '@/lib/api'
import { AuthResponse, ChangePasswordRequest, LoginRequest } from '@/types'

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data)
    return response.data
  },

  refreshToken: async (): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/refresh')
    return response.data
  },

  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await api.post('/auth/change-password', data)
  },

  requestPasswordReset: async (email: string): Promise<void> => {
    await api.post('/auth/request-password-reset', { email })
  },

  resetPassword: async (data: { token: string; newPassword: string }): Promise<void> => {
    await api.post('/auth/reset-password', data)
  },
}
