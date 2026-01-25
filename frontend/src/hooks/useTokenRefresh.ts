'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useAuthStore } from '@/store/authStore'
import { authService } from '@/services/authService'

const REFRESH_INTERVAL = 10 * 60 * 1000 // 10 minutes
const ACTIVITY_EVENTS = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click']

export function useTokenRefresh() {
  const { accessToken, refreshToken, isAuthenticated, updateLastActivity } = useAuthStore()
  const lastActivityRef = useRef<number>(Date.now())
  const hasActivityRef = useRef<boolean>(false)
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Track user activity
  const handleActivity = useCallback(() => {
    lastActivityRef.current = Date.now()
    hasActivityRef.current = true
    updateLastActivity()
  }, [updateLastActivity])

  // Refresh the token
  const performTokenRefresh = useCallback(async () => {
    // Only refresh if there was activity since last check and user is authenticated
    if (!hasActivityRef.current || !accessToken) {
      return
    }

    try {
      console.log('[TokenRefresh] Refreshing token due to user activity...')
      const response = await authService.refreshToken()

      // Update the token in the store
      refreshToken(response.accessToken, response.expiresIn)
      console.log('[TokenRefresh] Token refreshed successfully')

      // Reset activity flag
      hasActivityRef.current = false
    } catch (error) {
      console.error('[TokenRefresh] Failed to refresh token:', error)
      // Don't clear auth here - let the API interceptor handle 401s
    }
  }, [accessToken, refreshToken])

  useEffect(() => {
    // Only set up listeners if authenticated
    if (!isAuthenticated()) {
      return
    }

    // Add activity event listeners
    ACTIVITY_EVENTS.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true })
    })

    // Set up refresh interval (every 10 minutes)
    refreshIntervalRef.current = setInterval(() => {
      performTokenRefresh()
    }, REFRESH_INTERVAL)

    // Initial activity mark
    hasActivityRef.current = true

    // Cleanup
    return () => {
      ACTIVITY_EVENTS.forEach(event => {
        window.removeEventListener(event, handleActivity)
      })

      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
    }
  }, [isAuthenticated, handleActivity, performTokenRefresh])

  return {
    lastActivity: lastActivityRef.current,
    hasActivity: hasActivityRef.current,
  }
}
