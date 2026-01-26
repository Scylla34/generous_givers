'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { X, Clock } from 'lucide-react'
import { Event, EventRequest } from '@/types'
import { format } from 'date-fns'
import DatePicker from './DatePicker'

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: EventRequest) => void
  event?: Event | null
  isLoading?: boolean
}

const colorOptions = [
  { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
  { value: 'green', label: 'Green', class: 'bg-green-500' },
  { value: 'red', label: 'Red', class: 'bg-red-500' },
  { value: 'yellow', label: 'Yellow', class: 'bg-yellow-500' },
  { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
  { value: 'pink', label: 'Pink', class: 'bg-pink-500' },
]

export default function EventModal({ isOpen, onClose, onSubmit, event, isLoading }: EventModalProps) {
  const [formData, setFormData] = useState<EventRequest>({
    title: '',
    description: '',
    startDateTime: '',
    endDateTime: '',
    colorCategory: 'blue',
    reminderMinutes: 15,
  })
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(new Date())
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('10:00')
  const [isOneDayEvent, setIsOneDayEvent] = useState(true)

  useEffect(() => {
    if (event) {
      const eventStartDate = new Date(event.startDateTime)
      const eventEndDate = new Date(event.endDateTime)
      const isSameDay = eventStartDate.toDateString() === eventEndDate.toDateString()
      
      setFormData({
        title: event.title,
        description: event.description || '',
        startDateTime: event.startDateTime,
        endDateTime: event.endDateTime,
        colorCategory: event.colorCategory,
        reminderMinutes: event.reminderMinutes,
      })
      setStartDate(eventStartDate)
      setEndDate(eventEndDate)
      setStartTime(format(eventStartDate, 'HH:mm'))
      setEndTime(format(eventEndDate, 'HH:mm'))
      setIsOneDayEvent(isSameDay)
    } else {
      const today = new Date()
      setFormData({
        title: '',
        description: '',
        startDateTime: '',
        endDateTime: '',
        colorCategory: 'blue',
        reminderMinutes: 15,
      })
      setStartDate(today)
      setEndDate(today)
      setStartTime('09:00')
      setEndTime('10:00')
      setIsOneDayEvent(true)
    }
  }, [event, isOpen])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'reminderMinutes' ? parseInt(value) || 0 : value
    }))
  }

  const handleOneDayToggle = (checked: boolean) => {
    setIsOneDayEvent(checked)
    if (checked && startDate) {
      setEndDate(startDate)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !startDate || !endDate || !startTime || !endTime) {
      return
    }
    
    // Format datetime strings without timezone conversion
    const startDateStr = startDate.getFullYear() + '-' + 
      String(startDate.getMonth() + 1).padStart(2, '0') + '-' + 
      String(startDate.getDate()).padStart(2, '0')
    const startDateTimeStr = startDateStr + 'T' + startTime + ':00'
    
    const endDateStr = endDate.getFullYear() + '-' + 
      String(endDate.getMonth() + 1).padStart(2, '0') + '-' + 
      String(endDate.getDate()).padStart(2, '0')
    const endDateTimeStr = endDateStr + 'T' + endTime + ':00'
    
    const submitData: EventRequest = {
      ...formData,
      startDateTime: startDateTimeStr,
      endDateTime: endDateTimeStr,
    }
    
    onSubmit(submitData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b">
          <h2 className="text-lg sm:text-xl font-semibold">
            {event ? 'Edit Event' : 'Create New Event'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Mobile: Stack vertically, Desktop: Side by side */}
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 lg:gap-6">
            {/* Form Fields */}
            <div className="space-y-4 order-2 lg:order-1">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Event title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Event description"
                  rows={3}
                  className="bg-white text-gray-900 border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                />
              </div>

              {/* One Day Event Checkbox */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isOneDayEvent"
                  checked={isOneDayEvent}
                  onChange={(e) => handleOneDayToggle(e.target.checked)}
                  className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                />
                <Label htmlFor="isOneDayEvent" className="text-sm font-medium text-gray-700">
                  Single day event
                </Label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="startTime">Start Time *</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="startTime"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="endTime">End Time *</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="endTime"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="colorCategory">Color Category</Label>
                  <select
                    id="colorCategory"
                    name="colorCategory"
                    value={formData.colorCategory}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900"
                  >
                    {colorOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="reminderMinutes">Reminder</Label>
                  <select
                    id="reminderMinutes"
                    name="reminderMinutes"
                    value={formData.reminderMinutes}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900"
                  >
                    <option value={5}>5 minutes</option>
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={120}>2 hours</option>
                    <option value={1440}>1 day</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Calendar(s) */}
            <div className="space-y-4 order-1 lg:order-2">
              {isOneDayEvent ? (
                <DatePicker
                  label="Select Date *"
                  selected={startDate}
                  onSelect={(date) => {
                    setStartDate(date)
                    setEndDate(date)
                  }}
                />
              ) : (
                <div className="space-y-4">
                  <DatePicker
                    label="Start Date *"
                    selected={startDate}
                    onSelect={setStartDate}
                  />
                  <DatePicker
                    label="End Date *"
                    selected={endDate}
                    onSelect={setEndDate}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white"
            >
              {isLoading ? 'Saving...' : event ? 'Update Event' : 'Create Event'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}