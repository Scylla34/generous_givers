'use client'

import { useEffect } from 'react'
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

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/login')
    } else if (user?.mustChangePassword) {
      router.push('/auth/change-password')
    }
  }, [user, isAuthenticated, router])

  if (!user || user.mustChangePassword) {
    return null
  }

  return <DashboardLayout>{children}</DashboardLayout>
}
