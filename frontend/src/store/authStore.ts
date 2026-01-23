import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types'

// Session configuration constants
export const SESSION_CONFIG = {
  IDLE_TIMEOUT: 10 * 60 * 1000, // 10 minutes idle timeout
  TOKEN_REFRESH_INTERVAL: 15 * 60 * 1000, // Refresh token every 15 minutes if active
  WARNING_BEFORE_TIMEOUT: 60 * 1000, // Show warning 1 minute before logout
} as const

interface AuthState {
  user: User | null
  accessToken: string | null
  tokenExpiresAt: number | null
  lastActivityAt: number | null
  setAuth: (user: User, accessToken: string, expiresInMs?: number) => void
  clearAuth: () => void
  logout: () => void
  isAuthenticated: () => boolean
  refreshToken: (accessToken: string, expiresInMs?: number) => void
  updateUser: (user: User) => void
  updateLastActivity: () => void
  getTimeUntilExpiry: () => number
  isTokenExpired: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      tokenExpiresAt: null,
      lastActivityAt: null,

      setAuth: (user, accessToken, expiresInMs = 30 * 60 * 1000) => {
        const now = Date.now()
        set({
          user,
          accessToken,
          tokenExpiresAt: now + expiresInMs,
          lastActivityAt: now,
        })
      },

      clearAuth: () => {
        set({
          user: null,
          accessToken: null,
          tokenExpiresAt: null,
          lastActivityAt: null,
        })
      },

      logout: () => {
        // Clear all auth data and localStorage
        set({
          user: null,
          accessToken: null,
          tokenExpiresAt: null,
          lastActivityAt: null,
        })
        // Force clear localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage')
        }
      },

      refreshToken: (accessToken, expiresInMs = 30 * 60 * 1000) => {
        const now = Date.now()
        set({
          accessToken,
          tokenExpiresAt: now + expiresInMs,
          lastActivityAt: now,
        })
      },

      updateUser: (user) => {
        set({ user })
      },

      updateLastActivity: () => {
        set({ lastActivityAt: Date.now() })
      },

      isAuthenticated: () => {
        const state = get()
        if (!state.accessToken || !state.user) return false

        // Check if token is expired
        if (state.tokenExpiresAt && Date.now() > state.tokenExpiresAt) {
          return false
        }

        return true
      },

      getTimeUntilExpiry: () => {
        const { tokenExpiresAt } = get()
        if (!tokenExpiresAt) return 0
        return Math.max(0, tokenExpiresAt - Date.now())
      },

      isTokenExpired: () => {
        const { tokenExpiresAt } = get()
        if (!tokenExpiresAt) return true
        return Date.now() > tokenExpiresAt
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        tokenExpiresAt: state.tokenExpiresAt,
        lastActivityAt: state.lastActivityAt,
      }),
    }
  )
)
