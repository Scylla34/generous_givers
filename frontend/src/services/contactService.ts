import { api } from '@/lib/api';

export interface ContactRequest {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  status: string;
  message: string;
}

export const contactService = {
  async submitContactForm(data: ContactRequest): Promise<ContactResponse> {
    const response = await api.post<ContactResponse>('/contact', data);
    return response.data;
  },
};
