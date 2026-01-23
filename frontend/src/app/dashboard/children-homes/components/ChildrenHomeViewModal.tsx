'use client'

import { ChildrenHome } from '@/types'
import { X, Home, MapPin, Phone, FileText, Calendar } from 'lucide-react'

interface ChildrenHomeViewModalProps {
  isOpen: boolean
  onClose: () => void
  home: ChildrenHome | null
}

export function ChildrenHomeViewModal({ isOpen, onClose, home }: ChildrenHomeViewModalProps) {
  if (!isOpen || !home) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Children&apos;s Home Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Home Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Home Information</h3>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <Home className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <span className="text-sm text-gray-500">Name:</span>
                  <div className="font-medium text-gray-900">{home.name}</div>
                </div>
              </div>

              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <span className="text-sm text-gray-500">Location:</span>
                  <div className="font-medium text-gray-900">
                    {home.location || 'Not specified'}
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <Phone className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <span className="text-sm text-gray-500">Contact:</span>
                  <div className="font-medium text-gray-900">
                    {home.contact || 'Not provided'}
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <span className="text-sm text-gray-500">Added on:</span>
                  <div className="font-medium text-gray-900">
                    {new Date(home.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          {home.notes && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Notes
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {home.notes}
              </p>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h3>
            <div className="flex flex-wrap gap-2">
              {home.contact && (
                <a
                  href={`tel:${home.contact}`}
                  className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </a>
              )}
              {home.location && (
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(home.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  View on Map
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}