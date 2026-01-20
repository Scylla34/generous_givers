import axios, { AxiosError } from 'axios'
import { useAuthStore } from '@/store/authStore'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'

// Flag to prevent infinite redirects
let isRedirecting = false

// Reset redirect flag after navigation completes
const resetRedirectFlag = () => {
  setTimeout(() => {
    isRedirecting = false
  }, 2000)
}

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
    const isAuthEndpoint = error.config?.url?.includes('/auth/')

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !isRedirecting &&
      !isAuthEndpoint
    ) {
      isRedirecting = true
      const { clearAuth, accessToken } = useAuthStore.getState()

      // Only redirect if user was actually logged in
      if (accessToken) {
        clearAuth()
        if (typeof window !== 'undefined') {
          window.location.href = '/'
        }
      }
      resetRedirectFlag()
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
