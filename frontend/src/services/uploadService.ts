import { api } from '@/lib/api'
import { UploadResponse, ModuleType, ApiResponse } from '@/types'

export const uploadService = {
  upload: async (file: File, moduleType: ModuleType, moduleId?: string): Promise<UploadResponse> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('moduleType', moduleType)
    if (moduleId) {
      formData.append('moduleId', moduleId)
    }
    const { data } = await api.post<ApiResponse<UploadResponse>>('/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return data.data
  },

  uploadMultiple: async (files: File[], moduleType: ModuleType, moduleId?: string): Promise<UploadResponse[]> => {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('files', file)
    })
    formData.append('moduleType', moduleType)
    if (moduleId) {
      formData.append('moduleId', moduleId)
    }
    const { data } = await api.post<ApiResponse<UploadResponse[]>>('/uploads/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return Array.isArray(data.data) ? data.data : []
  },

  getByModule: async (moduleType: ModuleType, moduleId: string): Promise<UploadResponse[]> => {
    const { data } = await api.get<ApiResponse<UploadResponse[]>>(`/uploads/module/${moduleType}/${moduleId}`)
    return Array.isArray(data.data) ? data.data : []
  },

  getByModuleType: async (moduleType: ModuleType): Promise<UploadResponse[]> => {
    const { data } = await api.get<ApiResponse<UploadResponse[]>>(`/uploads/module/${moduleType}`)
    return Array.isArray(data.data) ? data.data : []
  },

  getById: async (id: string): Promise<UploadResponse> => {
    const { data } = await api.get<ApiResponse<UploadResponse>>(`/uploads/${id}`)
    return data.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete<ApiResponse<void>>(`/uploads/${id}`)
  },

  getDownloadUrl: (id: string): string => {
    let baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
    // Ensure the URL includes /api/v1 if not already present
    if (!baseUrl.includes('/api/v1')) {
      baseUrl = baseUrl.replace(/\/$/, '') + '/api/v1'
    }
    return `${baseUrl}/uploads/${id}/download`
  },
}
