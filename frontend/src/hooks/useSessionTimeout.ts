'use client'

import { useEffect, useRef, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore, SESSION_CONFIG } from '@/store/authStore'
import { authService } from '@/services/authService'
import { toast } from 'sonner'

interface SessionTimeoutOptions {
  onSessionExpired?: () => void
  onTokenRefreshed?: () => void
}

export function useSessionTimeout(options: SessionTimeoutOptions = {}) {
  const router = useRouter()
  const {
    isAuthenticated,
    clearAuth,
    refreshToken,
    updateLastActivity,
    lastActivityAt,
    isTokenExpired,
  } = useAuthStore()

  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const tokenRefreshIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const tokenExpiryCheckRef = useRef<NodeJS.Timeout | null>(null)
  const warningShownRef = useRef(false)
  const isRefreshingRef = useRef(false)
  const lastActivityUpdateRef = useRef(0)

  const clearAllTimers = useCallback(() => {
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current)
      idleTimeoutRef.current = null
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current)
      warningTimeoutRef.current = null
    }
    if (tokenRefreshIntervalRef.current) {
      clearInterval(tokenRefreshIntervalRef.current)
      tokenRefreshIntervalRef.current = null
    }
    if (tokenExpiryCheckRef.current) {
      clearInterval(tokenExpiryCheckRef.current)
      tokenExpiryCheckRef.current = null
    }
  }, [])

  const handleLogout = useCallback(
    (reason: 'idle' | 'expired' | 'manual' = 'idle') => {
      clearAllTimers()
      clearAuth()

      const messages = {
        idle: 'Your session has expired due to inactivity',
        expired: 'Your session has expired. Please log in again',
        manual: 'You have been logged out',
      }

      toast.error(messages[reason])
      options.onSessionExpired?.()
      router.push('/')
    },
    [clearAuth, router, clearAllTimers, options]
  )

  const handleTokenRefresh = useCallback(async (): Promise<boolean> => {
    if (isRefreshingRef.current) return false

    try {
      isRefreshingRef.current = true
      const response = await authService.refreshToken()
      refreshToken(response.accessToken)
      options.onTokenRefreshed?.()
      return true
    } catch (error) {
      console.error('Token refresh failed:', error)
      handleLogout('expired')
      return false
    } finally {
      isRefreshingRef.current = false
    }
  }, [refreshToken, handleLogout, options])

  const showIdleWarning = useCallback(() => {
    if (!warningShownRef.current) {
      warningShownRef.current = true
      toast.warning('Your session will expire in 1 minute due to inactivity. Move your mouse or press a key to stay logged in.', {
        duration: SESSION_CONFIG.WARNING_BEFORE_TIMEOUT,
      })
    }
  }, [])

  const resetIdleTimer = useCallback(() => {
    if (!isAuthenticated()) return

    // Clear existing idle timers
    if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current)
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current)
    warningShownRef.current = false

    // Update last activity timestamp with throttling
    const now = Date.now()
    if (now - lastActivityUpdateRef.current > 5000) {
      lastActivityUpdateRef.current = now
      updateLastActivity()
    }

    // Set warning timer (1 minute before idle timeout)
    warningTimeoutRef.current = setTimeout(
      showIdleWarning,
      SESSION_CONFIG.IDLE_TIMEOUT - SESSION_CONFIG.WARNING_BEFORE_TIMEOUT
    )

    // Set idle timeout
    idleTimeoutRef.current = setTimeout(() => {
      handleLogout('idle')
    }, SESSION_CONFIG.IDLE_TIMEOUT)
  }, [isAuthenticated, updateLastActivity, showIdleWarning, handleLogout])

  // Check for token expiry periodically
  const checkTokenExpiry = useCallback(() => {
    if (isTokenExpired()) {
      handleLogout('expired')
    }
  }, [isTokenExpired, handleLogout])

  // Setup token refresh interval (every 15 minutes if active)
  const setupTokenRefreshInterval = useCallback(() => {
    if (tokenRefreshIntervalRef.current) {
      clearInterval(tokenRefreshIntervalRef.current)
    }

    tokenRefreshIntervalRef.current = setInterval(async () => {
      if (!isAuthenticated()) return

      // Only refresh if user has been active recently (within idle timeout period)
      const now = Date.now()
      const timeSinceLastActivity = lastActivityAt ? now - lastActivityAt : Infinity

      if (timeSinceLastActivity < SESSION_CONFIG.IDLE_TIMEOUT) {
        await handleTokenRefresh()
      }
    }, SESSION_CONFIG.TOKEN_REFRESH_INTERVAL)
  }, [isAuthenticated, lastActivityAt, handleTokenRefresh])

  // Setup token expiry check (every minute)
  const setupTokenExpiryCheck = useCallback(() => {
    if (tokenExpiryCheckRef.current) {
      clearInterval(tokenExpiryCheckRef.current)
    }

    tokenExpiryCheckRef.current = setInterval(checkTokenExpiry, 60 * 1000)
  }, [checkTokenExpiry])

  // Memoize the activity events list to avoid re-creating it
  const activityEvents = useMemo(
    () => ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'],
    []
  )

  useEffect(() => {
    if (!isAuthenticated()) {
      clearAllTimers()
      return
    }

    // Check if token is already expired on mount
    if (isTokenExpired()) {
      handleLogout('expired')
      return
    }

    // Create a stable throttled activity handler
    const throttledResetTimer = () => {
      const now = Date.now()
      if (now - lastActivityUpdateRef.current > 5000) {
        lastActivityUpdateRef.current = now
        resetIdleTimer()
      }
    }

    // Add activity listeners
    activityEvents.forEach((event) => {
      window.addEventListener(event, throttledResetTimer, { passive: true })
    })

    // Initialize timers
    resetIdleTimer()
    setupTokenRefreshInterval()
    setupTokenExpiryCheck()

    // Cleanup
    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, throttledResetTimer)
      })
      clearAllTimers()
    }
  }, [
    isAuthenticated,
    isTokenExpired,
    resetIdleTimer,
    setupTokenRefreshInterval,
    setupTokenExpiryCheck,
    clearAllTimers,
    handleLogout,
    activityEvents,
  ])

  return {
    resetIdleTimer,
    refreshToken: handleTokenRefresh,
    logout: () => handleLogout('manual'),
  }
}
