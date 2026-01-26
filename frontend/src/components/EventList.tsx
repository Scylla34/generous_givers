'use client'

import { Button } from '@/components/ui/button'
import { Edit, Trash2, Clock, Calendar } from 'lucide-react'
import { Event } from '@/types'
import { format, parseISO } from 'date-fns'

interface EventListProps {
  events: Event[]
  onEdit: (event: Event) => void
  onDelete: (id: string) => void
  isLoading?: boolean
}

const colorClasses = {
  blue: 'bg-blue-100 border-blue-300 text-blue-800',
  green: 'bg-green-100 border-green-300 text-green-800',
  red: 'bg-red-100 border-red-300 text-red-800',
  yellow: 'bg-yellow-100 border-yellow-300 text-yellow-800',
  purple: 'bg-purple-100 border-purple-300 text-purple-800',
  pink: 'bg-pink-100 border-pink-300 text-pink-800',
}

export default function EventList({ events, onEdit, onDelete, isLoading }: EventListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse">
            <div className="h-20 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>No events for this date</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {events.map(event => {
        const startTime = format(parseISO(event.startDateTime), 'h:mm a')
        const endTime = format(parseISO(event.endDateTime), 'h:mm a')
        const colorClass = colorClasses[event.colorCategory as keyof typeof colorClasses] || colorClasses.blue

        return (
          <div
            key={event.id}
            className={`p-4 rounded-lg border-l-4 ${colorClass}`}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-sm">{event.title}</h4>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(event)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(event.id)}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-xs opacity-75 mb-2">
              <Clock className="w-3 h-3" />
              <span>{startTime} - {endTime}</span>
            </div>
            
            {event.description && (
              <p className="text-xs opacity-75 line-clamp-2">
                {event.description}
              </p>
            )}
            
            <div className="flex justify-between items-center mt-2 text-xs opacity-60">
              <span>By {event.createdByName}</span>
              {event.reminderMinutes > 0 && (
                <span>{event.reminderMinutes}min reminder</span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}