import { api } from './api'

export interface DashboardStats {
  totalProjects: number
  activeProjects: number
  completedProjects: number
  totalDonations: number
  activeUsers: number
  monthlyGrowth: string
  projectsChange: string
  donationsChange: string
  usersChange: string
}

export interface RecentActivity {
  id: string
  type: string
  title: string
  description: string
  timestamp: string
  color: string
}

export interface MonthlyChartData {
  month: string
  amount?: number
  projects?: number
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/dashboard/stats')
    return response.data
  },

  getRecentActivities: async (): Promise<RecentActivity[]> => {
    const response = await api.get('/dashboard/activities')
    return response.data
  },

  getMonthlyDonations: async (): Promise<MonthlyChartData[]> => {
    const response = await api.get('/dashboard/donations-chart')
    return response.data
  },

  getMonthlyProjects: async (): Promise<MonthlyChartData[]> => {
    const response = await api.get('/dashboard/projects-chart')
    return response.data
  },
}
