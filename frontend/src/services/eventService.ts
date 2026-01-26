import { api } from '@/lib/api'
import { Event, EventRequest } from '@/types'

export const eventService = {
  getAll: async (): Promise<Event[]> => {
    const response = await api.get<{ data: Event[] }>('/events')
    return response.data.data
  },

  getById: async (id: string): Promise<Event> => {
    const response = await api.get<{ data: Event }>(`/events/${id}`)
    return response.data.data
  },

  getByDateRange: async (startDate: string, endDate: string): Promise<Event[]> => {
    const response = await api.get<{ data: Event[] }>(`/events/range?startDate=${startDate}&endDate=${endDate}`)
    return response.data.data
  },

  create: async (data: EventRequest): Promise<Event> => {
    const response = await api.post<{ data: Event }>('/events', data)
    return response.data.data
  },

  update: async (id: string, data: EventRequest): Promise<Event> => {
    const response = await api.put<{ data: Event }>(`/events/${id}`, data)
    return response.data.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/events/${id}`)
  },
}