import { api } from '@/lib/api'
import { MonthlyFundsReport, ProjectProgressReport, UserRoleReport } from '@/types'

export const reportService = {
  getMonthlyFunds: async (year: number): Promise<MonthlyFundsReport[]> => {
    const { data } = await api.get(`/reports/monthly-funds?year=${year}`)
    return data
  },

  getProjectProgress: async (): Promise<ProjectProgressReport[]> => {
    const { data } = await api.get('/reports/project-progress')
    return data
  },

  getUserRoles: async (): Promise<UserRoleReport[]> => {
    const { data } = await api.get('/reports/user-roles')
    return data
  },
}
