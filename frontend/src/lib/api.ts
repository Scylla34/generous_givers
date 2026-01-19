import axios, { AxiosError } from 'axios'
import { useAuthStore } from '@/store/authStore'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'

// Flag to prevent infinite redirects
let isRedirecting = false

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState()
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if ((error.response?.status === 401 || error.response?.status === 403) && !isRedirecting) {
      isRedirecting = true
      // Clear auth data and redirect to home
      const { clearAuth } = useAuthStore.getState()
      clearAuth()
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          window.location.href = '/'
        }, 100)
      }
    }
    return Promise.reject(error)
  }
)

export interface ApiError {
  timestamp: string
  status: number
  error: string
  message: string
}

export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiError
    return apiError?.message || error.message || 'An error occurred'
  }
  return 'An unexpected error occurred'
}
