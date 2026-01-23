'use client'

import { Filter } from 'lucide-react'
import { ProjectStatus } from '@/types'

interface ProjectFiltersProps {
  statusFilter: ProjectStatus | 'ALL'
  onStatusFilterChange: (status: ProjectStatus | 'ALL') => void
  projectCount: number
}

const statusOptions: { value: ProjectStatus | 'ALL'; label: string; color: string }[] = [
  { value: 'ALL', label: 'All', color: 'bg-gray-600' },
  { value: 'PLANNING', label: 'Planning', color: 'bg-purple-600' },
  { value: 'ACTIVE', label: 'Active', color: 'bg-green-600' },
  { value: 'ON_HOLD', label: 'On Hold', color: 'bg-yellow-600' },
  { value: 'COMPLETED', label: 'Completed', color: 'bg-blue-600' },
]

export function ProjectFilters({ statusFilter, onStatusFilterChange, projectCount }: ProjectFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <label className="text-sm font-semibold text-gray-800">Filter by Status:</label>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onStatusFilterChange(option.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  statusFilter === option.value
                    ? `${option.color} text-white shadow-md transform scale-105`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <span className="text-sm text-gray-600 font-medium whitespace-nowrap">
            {projectCount} {projectCount === 1 ? 'project' : 'projects'}
          </span>
        </div>
      </div>
    </div>
  )
}