import { api } from '@/lib/api'
import { MonthlyFundsReport, ProjectProgressReport, UserRoleReport, UserReport, ApiResponse } from '@/types'

export const reportService = {
  getMonthlyFunds: async (year: number): Promise<MonthlyFundsReport[]> => {
    const { data } = await api.get<ApiResponse<MonthlyFundsReport[]>>(`/reports/funds-by-month?year=${year}`)
    return Array.isArray(data.data) ? data.data : []
  },

  getProjectProgress: async (): Promise<ProjectProgressReport[]> => {
    const { data } = await api.get<ApiResponse<ProjectProgressReport[]>>('/reports/projects-progress')
    return Array.isArray(data.data) ? data.data : []
  },

  getUserRoles: async (): Promise<UserRoleReport[]> => {
    const { data } = await api.get<ApiResponse<UserRoleReport[]>>('/reports/users-roles')
    return Array.isArray(data.data) ? data.data : []
  },

  getUsersReport: async (): Promise<UserReport[]> => {
    const { data } = await api.get<ApiResponse<UserReport[]>>('/reports/users')
    return Array.isArray(data.data) ? data.data : []
  },

  notifyDataExport: async (exportType: string, recordCount: number): Promise<string> => {
    const { data } = await api.post<ApiResponse<null>>('/reports/export-notification', null, {
      params: { exportType, recordCount }
    })
    return data.message
  },
}
