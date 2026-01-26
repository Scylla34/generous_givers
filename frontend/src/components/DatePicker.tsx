'use client'

import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react'
import { format } from 'date-fns'

interface DatePickerProps {
  label: string
  selected: Date | undefined
  onSelect: (date: Date | undefined) => void
}

export default function DatePicker({ label, selected, onSelect }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <Label className="flex items-center gap-2 mb-2">
        <CalendarIcon className="w-4 h-4" />
        {label}
      </Label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-left flex items-center justify-between hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      >
        <span className="text-gray-900">
          {selected ? format(selected, 'MMM d, yyyy') : 'Select date'}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={(date) => {
              onSelect(date)
              setIsOpen(false)
            }}
            className="w-full"
          />
        </div>
      )}
    </div>
  )
}