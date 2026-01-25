'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import DashboardLayout from '@/components/DashboardLayout'
import { useTokenRefresh } from '@/hooks/useTokenRefresh'

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [mounted, setMounted] = useState(false)

  // Auto-refresh token every 10 minutes when there's user activity
  useTokenRefresh()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isAuthenticated()) {
      router.push('/')
    } else if (mounted && user?.mustChangePassword) {
      router.push('/auth/change-password')
    }
  }, [user, isAuthenticated, router, mounted])

  if (!mounted || !user || user.mustChangePassword) {
    return null
  }

  return <DashboardLayout>{children}</DashboardLayout>
}
