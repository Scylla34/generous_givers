import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/store/authStore'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

// Flag to prevent infinite redirects
let isRedirecting = false
let isRefreshing = false
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (error?: unknown) => void }> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(token)
    }
  })
  
  failedQueue = []
}

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

// Response interceptor to handle errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }
    const isAuthEndpoint = originalRequest?.url?.includes('/auth/')
    const isRefreshEndpoint = originalRequest?.url?.includes('/auth/refresh')

    if (error.response?.status === 401 && !isAuthEndpoint && !originalRequest._retry) {
      if (isRefreshEndpoint) {
        // Refresh token failed, logout user
        const { clearAuth } = useAuthStore.getState()
        clearAuth()
        if (typeof window !== 'undefined' && !isRedirecting) {
          isRedirecting = true
          window.location.href = '/'
          resetRedirectFlag()
        }
        return Promise.reject(error)
      }

      if (isRefreshing) {
        // Token refresh in progress, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(() => {
          return api(originalRequest)
        }).catch(err => {
          return Promise.reject(err)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // Attempt to refresh token
        const refreshResponse = await api.post('/auth/refresh')
        const { accessToken, expiresIn } = refreshResponse.data.data
        
        // Update token in store
        const { refreshToken } = useAuthStore.getState()
        refreshToken(accessToken, expiresIn * 1000)
        
        // Process queued requests
        processQueue(null, accessToken)
        
        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
        }
        
        return api(originalRequest)
      } catch (refreshError) {
        // Refresh failed, logout user
        processQueue(refreshError, null)
        const { clearAuth } = useAuthStore.getState()
        clearAuth()
        
        if (typeof window !== 'undefined' && !isRedirecting) {
          isRedirecting = true
          window.location.href = '/'
          resetRedirectFlag()
        }
        
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // Handle other 401/403 errors
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
