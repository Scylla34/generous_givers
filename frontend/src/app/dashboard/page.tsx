'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { Users, FolderOpen, DollarSign, TrendingUp, MapPin, BarChart3, Loader2 } from 'lucide-react'
import { dashboardService } from '@/services/dashboardService'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'

interface DashboardStats {
  totalProjects: number
  totalDonations: string
  activeUsers: number
  monthlyGrowth: string
  projectsChange: string
  donationsChange: string
  usersChange: string
}

interface RecentActivity {
  id: string
  type: string
  title: string
  description: string
  timestamp: string
  color: string
}

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [activities, setActivities] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [statsData, activitiesData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRecentActivities(),
      ])

      setStats(statsData)
      setActivities(activitiesData)
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to load dashboard data'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'users':
        router.push('/dashboard/users')
        break
      case 'projects':
        router.push('/dashboard/projects')
        break
      case 'visits':
        router.push('/dashboard/visits')
        break
      case 'reports':
        router.push('/dashboard/reports')
        break
      default:
        break
    }
  }

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount)
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num)
  }

  const statsConfig = [
    {
      name: 'Total Projects',
      value: stats?.totalProjects || 0,
      change: stats?.projectsChange || 'Loading...',
      icon: FolderOpen,
      color: 'bg-blue-500',
    },
    {
      name: 'Total Donations',
      value: stats ? formatCurrency(stats.totalDonations) : '$0',
      change: stats?.donationsChange || 'Loading...',
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      name: 'Active Users',
      value: stats?.activeUsers || 0,
      change: stats?.usersChange || 'Loading...',
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      name: 'Monthly Growth',
      value: stats?.monthlyGrowth || '0%',
      change: 'Trending up',
      icon: TrendingUp,
      color: 'bg-orange-500',
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here&apos;s what&apos;s happening with your foundation today.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
          <Button
            variant="link"
            size="sm"
            onClick={fetchDashboardData}
            className="ml-2 text-red-700 hover:text-red-800"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsConfig.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.name}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">
                {stat.name}
              </h3>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-gray-500">{stat.change}</p>
            </div>
          )
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h2>
          {activities.length === 0 ? (
            <p className="text-gray-500 text-sm">No recent activities</p>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 pb-4 border-b last:border-0">
                  <div className={`w-2 h-2 bg-${activity.color}-500 rounded-full mt-2`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {activity.description} - {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {user?.role === 'SUPER_USER' && (
              <button
                onClick={() => handleQuickAction('users')}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition text-left cursor-pointer"
              >
                <Users className="w-6 h-6 text-primary-600 mb-2" />
                <p className="text-sm font-medium text-gray-900">Manage Users</p>
              </button>
            )}
            {['SUPER_USER', 'CHAIRMAN', 'SECRETARY'].includes(user?.role || '') && (
              <button
                onClick={() => handleQuickAction('projects')}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition text-left cursor-pointer"
              >
                <FolderOpen className="w-6 h-6 text-primary-600 mb-2" />
                <p className="text-sm font-medium text-gray-900">
                  View Projects
                </p>
              </button>
            )}
            {['SUPER_USER', 'CHAIRMAN', 'SECRETARY'].includes(user?.role || '') && (
              <button
                onClick={() => handleQuickAction('visits')}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition text-left cursor-pointer"
              >
                <MapPin className="w-6 h-6 text-primary-600 mb-2" />
                <p className="text-sm font-medium text-gray-900">
                  View Visits
                </p>
              </button>
            )}
            {['SUPER_USER', 'CHAIRMAN', 'TREASURER'].includes(user?.role || '') && (
              <button
                onClick={() => handleQuickAction('reports')}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition text-left cursor-pointer"
              >
                <BarChart3 className="w-6 h-6 text-primary-600 mb-2" />
                <p className="text-sm font-medium text-gray-900">
                  View Reports
                </p>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
