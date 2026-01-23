import { api } from '@/lib/api';
import { ApiResponse } from '@/types';

export interface Donation {
  id: string;
  donorUserId?: string;
  donorName: string;
  email: string;
  amount: number;
  date: string;
  method: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  projectId?: string;
  projectTitle?: string;
  createdAt: string;
}

export interface DonationRequest {
  donorName: string;
  email: string;
  phoneNumber?: string;
  amount: number;
  method: string;
  projectId?: string;
}

export const donationService = {
  async getAllDonations(): Promise<Donation[]> {
    try {
      const response = await api.get<ApiResponse<Donation[]>>('/donations');
      return Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error) {
      console.error('Error fetching donations:', error);
      return [];
    }
  },

  async createDonation(data: DonationRequest): Promise<Donation> {
    const response = await api.post<ApiResponse<Donation>>('/donations', data);
    return response.data.data;
  },

  async initiateMpesaPayment(data: { phoneNumber: string; amount: number; donorName: string; email: string; projectId?: string }): Promise<{ checkoutRequestId: string }> {
    const response = await api.post<{ checkoutRequestId: string }>('/mpesa/stk-push', data);
    return response.data;
  },

  async getDonationsByProject(projectId: string): Promise<Donation[]> {
    const response = await api.get<ApiResponse<Donation[]>>(`/donations/project/${projectId}`);
    return Array.isArray(response.data.data) ? response.data.data : [];
  },

  async getTotalDonations(): Promise<number> {
    try {
      const response = await api.get<ApiResponse<{ total: number }>>('/donations/total');
      return response.data.data?.total ?? 0;
    } catch (error) {
      console.error('Error fetching total donations:', error);
      return 0;
    }
  },
};