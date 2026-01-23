'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import {
  Users,
  FolderOpen,
  DollarSign,
  TrendingUp,
  MapPin,
  BarChart3,
  Heart,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  HandHeart,
  CheckCircle,
} from 'lucide-react'
import { dashboardService, DashboardStats, RecentActivity, MonthlyChartData } from '@/services/dashboardService'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { Bar, BarChart, XAxis, YAxis, Area, AreaChart, CartesianGrid } from 'recharts'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/format'

const donationsChartConfig = {
  amount: {
    label: 'Donations',
    color: '#0ea5e9',
  },
} satisfies ChartConfig

const projectsChartConfig = {
  projects: {
    label: 'Projects',
    color: '#8b5cf6',
  },
} satisfies ChartConfig

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [activities, setActivities] = useState<RecentActivity[]>([])
  const [donationsChartData, setDonationsChartData] = useState<MonthlyChartData[]>([])
  const [projectsChartData, setProjectsChartData] = useState<MonthlyChartData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [statsData, activitiesData, donationsData, projectsData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRecentActivities(),
        dashboardService.getMonthlyDonations(),
        dashboardService.getMonthlyProjects(),
      ])

      setStats(statsData)
      setActivities(activitiesData)
      setDonationsChartData(donationsData)
      setProjectsChartData(projectsData)

      // Success notification
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="font-medium">Dashboard data loaded successfully!</span>
        </div>,
        { duration: 3000 }
      )
    } catch (error) {
      console.error('Dashboard error:', error)
      const errorMessage = 'Failed to load dashboard data'
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
      case 'donations':
        router.push('/dashboard/donations')
        break
      case 'children-homes':
        router.push('/dashboard/children-homes')
        break
      default:
        break
    }
  }

  const parseChange = (change: string): { value: number; isPositive: boolean } => {
    const match = change.match(/([+-]?\d+(?:\.\d+)?)/)
    const value = match ? parseFloat(match[1]) : 0
    const isPositive = !change.includes('-') && value > 0
    return { value: Math.abs(value), isPositive }
  }

  const statsConfig = [
    {
      name: 'Total Projects',
      value: stats?.totalProjects || 0,
      change: stats?.projectsChange || '+0',
      icon: FolderOpen,
      gradient: 'from-primary-500 to-primary-600',
      bgGradient: 'from-primary-50 to-primary-100',
    },
    {
      name: 'Total Donations',
      value: stats ? formatCurrency(stats.totalDonations) : 'KES 0',
      change: stats?.donationsChange || '+0',
      icon: DollarSign,
      gradient: 'from-emerald-500 to-emerald-600',
      bgGradient: 'from-emerald-50 to-emerald-100',
    },
    {
      name: 'Active Members',
      value: stats?.activeUsers || 0,
      change: stats?.usersChange || '+0',
      icon: Users,
      gradient: 'from-violet-500 to-violet-600',
      bgGradient: 'from-violet-50 to-violet-100',
    },
    {
      name: 'Monthly Growth',
      value: stats?.monthlyGrowth || '0%',
      change: 'Trending',
      icon: TrendingUp,
      gradient: 'from-amber-500 to-amber-600',
      bgGradient: 'from-amber-50 to-amber-100',
    },
  ]

  // Role-based quick actions
  const getQuickActions = () => {
    const actions = []

    if (user?.role === 'SUPER_USER') {
      actions.push({
        key: 'users',
        label: 'Manage Users',
        icon: Users,
        description: 'Add or manage members',
      })
    }

    if (['SUPER_USER', 'CHAIRPERSON', 'SECRETARY_GENERAL'].includes(user?.role || '')) {
      actions.push({
        key: 'projects',
        label: 'View Projects',
        icon: FolderOpen,
        description: 'Manage charitable projects',
      })
      actions.push({
        key: 'visits',
        label: 'Record Visits',
        icon: MapPin,
        description: 'Log community visits',
      })
      actions.push({
        key: 'children-homes',
        label: "Children's Homes",
        icon: Heart,
        description: 'Manage beneficiaries',
      })
    }

    if (['SUPER_USER', 'CHAIRPERSON', 'TREASURER', 'SECRETARY_GENERAL'].includes(user?.role || '')) {
      actions.push({
        key: 'donations',
        label: 'Donations',
        icon: DollarSign,
        description: 'Track contributions',
      })
      actions.push({
        key: 'reports',
        label: 'View Reports',
        icon: BarChart3,
        description: 'Financial analytics',
      })
    }

    return actions
  }

  const quickActions = getQuickActions()

  const getActivityColor = (color: string) => {
    const colors: Record<string, string> = {
      primary: 'bg-primary-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      amber: 'bg-amber-500',
      red: 'bg-red-500',
    }
    return colors[color] || 'bg-primary-500'
  }

  const formatRoleName = (role: string) => {
    return role.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Spinner className="w-8 h-8 text-primary-600" />
        <p className="text-gray-500 text-sm">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className={cn(
        "transition-all duration-500",
        mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      )}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Welcome back, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-gray-500 mt-1 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full">
            <HandHeart className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-medium text-primary-700">
              {formatRoleName(user?.role || '')}
            </span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchDashboardData}
            className="text-red-700 hover:text-red-800 hover:bg-red-100"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsConfig.map((stat, index) => {
          const Icon = stat.icon
          const { value, isPositive } = parseChange(stat.change)
          return (
            <Card
              key={stat.name}
              className={cn(
                "border-0 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden",
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className={cn(
                    "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg",
                    stat.gradient
                  )}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  {stat.change !== 'Trending' && (
                    <div className={cn(
                      "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                      isPositive
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    )}>
                      {isPositive ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3" />
                      )}
                      {value}%
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donations Chart */}
        <Card className={cn(
          "border-0 shadow-md transition-all duration-500",
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )} style={{ transitionDelay: '400ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-500" />
              Donations Overview
            </CardTitle>
            <CardDescription>Monthly donation trends (Last 6 months)</CardDescription>
          </CardHeader>
          <CardContent>
            {donationsChartData.length === 0 ? (
              <div className="flex items-center justify-center h-[200px]">
                <p className="text-gray-500">No donation data available</p>
              </div>
            ) : (
              <ChartContainer config={donationsChartConfig} className="h-[200px] w-full">
                <AreaChart data={donationsChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="donationsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    tickFormatter={(value) => `${value / 1000}k`}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value) => [formatCurrency(Number(value)), 'Donations']}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    fill="url(#donationsGradient)"
                  />
                </AreaChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Projects Chart */}
        <Card className={cn(
          "border-0 shadow-md transition-all duration-500",
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )} style={{ transitionDelay: '500ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-violet-500" />
              Projects Activity
            </CardTitle>
            <CardDescription>Monthly project creation (Last 6 months)</CardDescription>
          </CardHeader>
          <CardContent>
            {projectsChartData.length === 0 ? (
              <div className="flex items-center justify-center h-[200px]">
                <p className="text-gray-500">No project data available</p>
              </div>
            ) : (
              <ChartContainer config={projectsChartConfig} className="h-[200px] w-full">
                <BarChart data={projectsChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="projects"
                    fill="#8b5cf6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className={cn(
          "border-0 shadow-md transition-all duration-500",
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )} style={{ transitionDelay: '600ms' }}>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from the organization</CardDescription>
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Heart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No recent activities</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activities.slice(0, 5).map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0"
                  >
                    <div className={cn(
                      "w-2 h-2 rounded-full mt-2 flex-shrink-0",
                      getActivityColor(activity.color)
                    )} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className={cn(
          "border-0 shadow-md transition-all duration-500",
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )} style={{ transitionDelay: '700ms' }}>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Shortcuts to common tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <button
                    key={action.key}
                    onClick={() => handleQuickAction(action.key)}
                    className="p-4 border-2 border-gray-100 rounded-xl hover:border-primary-200 hover:bg-primary-50 transition-all duration-200 text-left group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center mb-3 group-hover:bg-primary-200 transition-colors">
                      <Icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">{action.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{action.description}</p>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Motto Footer */}
      <div className={cn(
        "text-center py-6 transition-all duration-500",
        mounted ? "opacity-100" : "opacity-0"
      )} style={{ transitionDelay: '800ms' }}>
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary-50 to-primary-100 rounded-full">
          <Heart className="w-5 h-5 text-primary-500" />
          <span className="text-sm font-medium text-primary-700">
            &ldquo;Service to Humanity is Service to God&rdquo;
          </span>
          <Heart className="w-5 h-5 text-primary-500" />
        </div>
      </div>
    </div>
  )
}