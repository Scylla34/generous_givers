'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Calendar } from '@/components/ui/calendar'
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { eventService } from '@/services/eventService'
import { Event, EventRequest } from '@/types'
import { toast } from 'sonner'
import { format, startOfMonth, endOfMonth, addMonths, subMonths, isSameDay, parseISO } from 'date-fns'
import EventModal from '@/components/EventModal'
import EventList from '@/components/EventList'

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const queryClient = useQueryClient()

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events', format(monthStart, 'yyyy-MM-dd'), format(monthEnd, 'yyyy-MM-dd')],
    queryFn: () => eventService.getByDateRange(
      monthStart.toISOString(),
      monthEnd.toISOString()
    ),
  })

  const createMutation = useMutation({
    mutationFn: eventService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      toast.success('Event created successfully')
      setIsModalOpen(false)
    },
    onError: () => {
      toast.error('Failed to create event')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: EventRequest }) =>
      eventService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      toast.success('Event updated successfully')
      setIsModalOpen(false)
      setEditingEvent(null)
    },
    onError: () => {
      toast.error('Failed to update event')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: eventService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      toast.success('Event deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete event')
    },
  })

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  const handleCreateEvent = (data: EventRequest) => {
    createMutation.mutate(data)
  }

  const handleUpdateEvent = (data: EventRequest) => {
    if (editingEvent) {
      updateMutation.mutate({ id: editingEvent.id, data })
    }
  }

  const handleDeleteEvent = (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      deleteMutation.mutate(id)
    }
  }

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event)
    setIsModalOpen(true)
  }

  const getEventsForDate = (date: Date) => {
    if (!Array.isArray(events)) return []
    return events.filter(event => 
      isSameDay(parseISO(event.startDateTime), date)
    )
  }

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : []

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Calendar & Events</h1>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Event
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              <div className="flex gap-2">
                <button 
                  className="border border-primary-600 bg-white hover:bg-primary-50 text-primary-600 px-3 py-1 rounded text-sm transition-colors"
                  onClick={handlePreviousMonth}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  className="border border-primary-600 bg-white hover:bg-primary-50 text-primary-600 px-3 py-1 rounded text-sm transition-colors"
                  onClick={handleNextMonth}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              month={currentDate}
              onMonthChange={setCurrentDate}
              modifiers={{
                hasEvents: (date) => getEventsForDate(date).length > 0
              }}
              modifiersClassNames={{
                hasEvents: 'bg-primary-100 text-primary-900 font-semibold'
              }}
            />
          </div>
        </div>

        {/* Event List */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">
            {selectedDate ? format(selectedDate, 'MMM d, yyyy') : 'Select a date'}
          </h3>
          <EventList
            events={selectedDateEvents}
            onEdit={handleEditEvent}
            onDelete={handleDeleteEvent}
            isLoading={isLoading}
          />
        </div>
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingEvent(null)
        }}
        onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
        event={editingEvent}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  )
}