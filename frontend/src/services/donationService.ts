import { api } from '@/lib/api'
import { Donation, DonationRequest } from '@/types'

export const donationService = {
  getAll: async (): Promise<Donation[]> => {
    const response = await api.get<Donation[]>('/donations')
    return response.data
  },

  getById: async (id: string): Promise<Donation> => {
    const response = await api.get<Donation>(`/donations/${id}`)
    return response.data
  },

  getByUser: async (userId: string): Promise<Donation[]> => {
    const response = await api.get<Donation[]>(`/donations/user/${userId}`)
    return response.data
  },

  getByProject: async (projectId: string): Promise<Donation[]> => {
    const response = await api.get<Donation[]>(`/donations/project/${projectId}`)
    return response.data
  },

  create: async (data: DonationRequest): Promise<Donation> => {
    const response = await api.post<Donation>('/donations', data)
    return response.data
  },

  createPublic: async (data: DonationRequest): Promise<Donation> => {
    const response = await api.post<Donation>('/donations', data)
    return response.data
  },

  getTotalDonations: async (): Promise<number> => {
    const response = await api.get<number>('/donations/total')
    return response.data
  },
}
