import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types'

interface AuthState {
  user: User | null
  accessToken: string | null
  setAuth: (user: User, accessToken: string) => void
  clearAuth: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      setAuth: (user, accessToken) => {
        set({ user, accessToken })
      },
      clearAuth: () => {
        set({ user: null, accessToken: null })
      },
      isAuthenticated: () => {
        return !!get().accessToken && !!get().user
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
