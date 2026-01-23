'use client'

import { ChildrenHome } from '@/types'
import { Home, MapPin, Phone, FileText, Eye, Edit, Trash2 } from 'lucide-react'
import { PermissionButton } from '@/components/ui/permission-button'

interface ChildrenHomesTableProps {
  homes: ChildrenHome[]
  onEdit: (home: ChildrenHome) => void
  onDelete: (id: string) => void
  onView: (home: ChildrenHome) => void
  isLoading: boolean
}

export function ChildrenHomesTable({ homes, onEdit, onDelete, onView, isLoading }: ChildrenHomesTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-3 text-gray-600">Loading children&apos;s homes...</span>
        </div>
      </div>
    )
  }

  if (!homes || homes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No children&apos;s homes registered</h3>
        <p className="text-gray-500">Start by adding your first children&apos;s home to the system.</p>
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
                Home Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Notes
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {homes.map((home) => (
              <tr key={home.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Home className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{home.name}</div>
                      <div className="text-sm text-gray-500">
                        Added {new Date(home.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-900">
                      {home.location || 'Not specified'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-900">
                      {home.contact || 'Not provided'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-start">
                    <FileText className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <span className="text-sm text-gray-900 line-clamp-2 max-w-xs">
                      {home.notes || 'No notes'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onView(home)}
                      className="text-gray-600 hover:text-gray-900 transition-colors p-1"
                      title="View home details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <PermissionButton
                      resource="childrenHomes"
                      action="update"
                      onClick={() => onEdit(home)}
                      className="text-blue-600 hover:text-blue-900 transition-colors p-1"
                      title="Edit home"
                    >
                      <Edit className="w-4 h-4" />
                    </PermissionButton>
                    <PermissionButton
                      resource="childrenHomes"
                      action="delete"
                      onClick={() => onDelete(home.id)}
                      className="text-red-600 hover:text-red-900 transition-colors p-1"
                      title="Delete home"
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