import { api } from './api'

export interface DashboardStats {
  totalProjects: number
  totalDonations: string
  activeUsers: number
  monthlyGrowth: string
  projectsChange: string
  donationsChange: string
  usersChange: string
}

export interface RecentActivity {
  id: string
  type: 'donation' | 'project' | 'visit'
  title: string
  description: string
  timestamp: string
  color: string
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
}
