'use client'

import { X, Calendar, DollarSign, Target, TrendingUp } from 'lucide-react'
import { Project } from '@/types'
import { formatCurrency, formatDateSafe } from '@/lib/format'
import { uploadService } from '@/services/uploadService'

interface ProjectViewModalProps {
  isOpen: boolean
  onClose: () => void
  project: Project | null
}

export function ProjectViewModal({ isOpen, onClose, project }: ProjectViewModalProps) {
  if (!isOpen || !project) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Project Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            {/* Poster Image */}
            {project.poster && (
              <div className="rounded-lg overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={uploadService.getDownloadUrl(project.poster)}
                  alt={project.title}
                  className="w-full h-56 object-cover"
                />
              </div>
            )}

            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-2xl font-bold text-gray-900">{project.title}</h3>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>
              {project.description && (
                <p className="text-gray-600 leading-relaxed">{project.description}</p>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Target</span>
                </div>
                <p className="text-lg font-bold text-blue-900">{formatCurrency(project.targetAmount)}</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-900">Raised</span>
                </div>
                <p className="text-lg font-bold text-green-900">{formatCurrency(project.fundsRaised)}</p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">Progress</span>
                </div>
                <p className="text-lg font-bold text-purple-900">{project.percentFunded.toFixed(1)}%</p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-900">Remaining</span>
                </div>
                <p className="text-lg font-bold text-orange-900">
                  {formatCurrency(Math.max(0, project.targetAmount - project.fundsRaised))}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Funding Progress</span>
                <span className="text-sm text-gray-600">{project.percentFunded.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(project.percentFunded, 100)}%` }}
                />
              </div>
            </div>

            {/* Dates */}
            {(project.startDate || project.endDate) && (
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Project Timeline
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.startDate && (
                    <div>
                      <span className="text-xs text-gray-500 uppercase tracking-wide">Start Date</span>
                      <p className="text-sm font-medium text-gray-900">{formatDateSafe(project.startDate)}</p>
                    </div>
                  )}
                  {project.endDate && (
                    <div>
                      <span className="text-xs text-gray-500 uppercase tracking-wide">End Date</span>
                      <p className="text-sm font-medium text-gray-900">{formatDateSafe(project.endDate)}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Project Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Created:</span>
                  <p className="font-medium text-gray-900">{formatDateSafe(project.createdAt)}</p>
                </div>
                <div>
                  <span className="text-gray-500">Last Updated:</span>
                  <p className="font-medium text-gray-900">{formatDateSafe(project.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}