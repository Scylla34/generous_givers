'use client'

import { Visit } from '@/types'
import { Calendar, MapPin, Camera, Users, Eye, Edit, Trash2 } from 'lucide-react'
import { formatDateSafe } from '@/lib/format'
import { PermissionButton } from '@/components/ui/permission-button'

interface VisitsTableProps {
  visits: Visit[]
  onEdit: (visit: Visit) => void
  onDelete: (id: string) => void
  onView: (visit: Visit) => void
  isLoading: boolean
}

export function VisitsTable({ visits, onEdit, onDelete, onView, isLoading }: VisitsTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-3 text-gray-600">Loading visits...</span>
        </div>
      </div>
    )
  }

  if (!visits || visits.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No visits recorded</h3>
        <p className="text-gray-500">Start by recording your first visit to a children&apos;s home.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Visit Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Photos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created By
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {visits.map((visit) => (
              <tr key={visit.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatDateSafe(visit.visitDate)}
                      </div>
                      {visit.notes && (
                        <div className="text-sm text-gray-500 line-clamp-2 max-w-xs">
                          {visit.notes}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {visit.childrenHomeName || visit.location || 'Not specified'}
                      </div>
                      {visit.childrenHomeName && visit.location && (
                        <div className="text-sm text-gray-500">{visit.location}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Camera className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-900">
                      {visit.photos && visit.photos.length > 0 ? visit.photos.length : '0'} photos
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-gray-400 mr-3" />
                    <div className="text-sm text-gray-900">
                      {visit.createdByName || 'Unknown'}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onView(visit)}
                      className="text-gray-600 hover:text-gray-900 transition-colors p-1"
                      title="View visit"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <PermissionButton
                      resource="visits"
                      action="update"
                      onClick={() => onEdit(visit)}
                      className="text-blue-600 hover:text-blue-900 transition-colors p-1"
                      title="Edit visit"
                    >
                      <Edit className="w-4 h-4" />
                    </PermissionButton>
                    <PermissionButton
                      resource="visits"
                      action="delete"
                      onClick={() => onDelete(visit.id)}
                      className="text-red-600 hover:text-red-900 transition-colors p-1"
                      title="Delete visit"
                    >
                      <Trash2 className="w-4 h-4" />
                    </PermissionButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}