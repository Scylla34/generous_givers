'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { toast } from 'sonner'

const TIMEOUT_DURATION = 10 * 60 * 1000 // 10 minutes in milliseconds
const WARNING_BEFORE = 60 * 1000 // Show warning 1 minute before timeout

export function useSessionTimeout() {
  const router = useRouter()
  const { isAuthenticated, clearAuth } = useAuthStore()
  const timeoutRef = useRef<NodeJS.Timeout>()
  const warningRef = useRef<NodeJS.Timeout>()
  const warningShownRef = useRef(false)

  const handleLogout = useCallback(() => {
    clearAuth()
    toast.error('Your session has expired due to inactivity')
    router.push('/')
  }, [clearAuth, router])

  const showWarning = useCallback(() => {
    if (!warningShownRef.current) {
      warningShownRef.current = true
      toast.warning('Your session will expire in 1 minute due to inactivity', {
        duration: 60000,
      })
    }
  }, [])

  const resetTimer = useCallback(() => {
    // Clear existing timers
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (warningRef.current) clearTimeout(warningRef.current)
    warningShownRef.current = false

    if (isAuthenticated()) {
      // Set warning timer
      warningRef.current = setTimeout(showWarning, TIMEOUT_DURATION - WARNING_BEFORE)

      // Set logout timer
      timeoutRef.current = setTimeout(handleLogout, TIMEOUT_DURATION)
    }
  }, [isAuthenticated, handleLogout, showWarning])

  useEffect(() => {
    if (!isAuthenticated()) return

    // Events that indicate user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click']

    // Reset timer on any activity
    events.forEach((event) => {
      window.addEventListener(event, resetTimer)
    })

    // Initialize timer
    resetTimer()

    // Cleanup
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer)
      })
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (warningRef.current) clearTimeout(warningRef.current)
    }
  }, [isAuthenticated, resetTimer])

  return { resetTimer }
}
