'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Project, ProjectRequest, ProjectStatus } from '@/types'
import { DatePicker } from '@/components/ui/date-picker'
import { parseISO, format } from 'date-fns'

interface ProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ProjectRequest) => void
  project?: Project | null
  isLoading?: boolean
}

interface FormState {
  title: string
  description: string
  status: ProjectStatus
  targetAmount: number
  startDate: Date | undefined
  endDate: Date | undefined
}

const parseDate = (dateString: string | undefined | null): Date | undefined => {
  if (!dateString) return undefined
  try {
    return parseISO(dateString)
  } catch {
    return undefined
  }
}

const formatDateForApi = (date: Date | undefined): string => {
  if (!date) return ''
  return format(date, 'yyyy-MM-dd')
}

export function ProjectModal({ isOpen, onClose, onSubmit, project, isLoading }: ProjectModalProps) {
  const [formData, setFormData] = useState<FormState>({
    title: '',
    description: '',
    status: 'DRAFT',
    targetAmount: 0,
    startDate: undefined,
    endDate: undefined,
  })

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description || '',
        status: project.status,
        targetAmount: project.targetAmount,
        startDate: parseDate(project.startDate),
        endDate: parseDate(project.endDate),
      })
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'DRAFT',
        targetAmount: 0,
        startDate: undefined,
        endDate: undefined,
      })
    }
  }, [project])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const requestData: ProjectRequest = {
      title: formData.title,
      description: formData.description,
      status: formData.status,
      targetAmount: formData.targetAmount,
      startDate: formatDateForApi(formData.startDate),
      endDate: formatDateForApi(formData.endDate),
    }
    onSubmit(requestData)
  }

  const handleInputChange = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-2xl font-bold text-gray-900">
            {project ? 'Edit Project' : 'Create New Project'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-white/50 transition-all duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-800">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-all duration-200 text-gray-900 placeholder-gray-500"
                placeholder="Enter a descriptive project title"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-800">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none resize-none transition-all duration-200 text-gray-900 placeholder-gray-500"
                placeholder="Describe the project goals, beneficiaries, and expected outcomes..."
              />
            </div>

            {/* Status and Target Amount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800">
                  Status *
                </label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value as ProjectStatus)}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-all duration-200 text-gray-900"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="ACTIVE">Active</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800">
                  Target Amount (KSh) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.targetAmount}
                  onChange={(e) => handleInputChange('targetAmount', parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-all duration-200 text-gray-900 placeholder-gray-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Date Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800">
                  Start Date
                </label>
                <DatePicker
                  value={formData.startDate}
                  onChange={(date) => handleInputChange('startDate', date)}
                  placeholder="Select start date"
                  maxDate={formData.endDate}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800">
                  End Date
                </label>
                <DatePicker
                  value={formData.endDate}
                  onChange={(date) => handleInputChange('endDate', date)}
                  placeholder="Select end date"
                  minDate={formData.startDate}
                />
              </div>
            </div>

            {/* Help Text */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> Set clear start and end dates to help track project progress and deadlines.
                The target amount should reflect the total funding needed to complete the project successfully.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-all duration-200 hover:shadow-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg disabled:hover:shadow-none"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </span>
              ) : (
                project ? 'Update Project' : 'Create Project'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
