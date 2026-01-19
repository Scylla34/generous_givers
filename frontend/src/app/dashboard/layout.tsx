'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import DashboardLayout from '@/components/DashboardLayout'

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [mounted, setMounted] = useState(false)

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
