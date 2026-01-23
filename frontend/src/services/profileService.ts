import { api } from '@/lib/api'
import { UserRole } from '@/types'

export interface UpdateProfileRequest {
  firstName: string
  lastName: string
  phone?: string
}

export interface ProfileResponse {
  id: string
  firstName: string
  lastName: string
  name: string
  email: string
  phone?: string
  role: UserRole
  isActive: boolean
  mustChangePassword: boolean
  profilePicture?: string
  memberJoiningDate?: string
  createdAt: string
  updatedAt: string
}

export const profileService = {
  async getCurrentProfile(): Promise<ProfileResponse> {
    const response = await api.get<ProfileResponse>('/profile')
    return response.data
  },

  async updateProfile(data: UpdateProfileRequest): Promise<ProfileResponse> {
    const response = await api.put<ProfileResponse>('/profile', data)
    return response.data
  },

  async uploadProfilePicture(file: File): Promise<{ fileName: string; message: string }> {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await api.post<{ fileName: string; message: string }>('/profile/picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  getProfilePictureUrl(fileName?: string): string | undefined {
    if (!fileName) return undefined
    return `${process.env.NEXT_PUBLIC_API_URL}/profile/picture/${fileName}`
  },
}