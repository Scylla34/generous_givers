'use client'

import Image from 'next/image'
import { Visit } from '@/types'
import { X, Calendar, MapPin, Users, Camera } from 'lucide-react'
import { formatDateSafe } from '@/lib/format'

interface VisitViewModalProps {
  isOpen: boolean
  onClose: () => void
  visit: Visit | null
}

export function VisitViewModal({ isOpen, onClose, visit }: VisitViewModalProps) {
  if (!isOpen || !visit) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Visit Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Visit Information */}
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Visit Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <span className="text-sm text-gray-500">Date:</span>
                    <div className="font-medium text-gray-900">
                      {formatDateSafe(visit.visitDate)}
                    </div>
                  </div>
                </div>

                {visit.childrenHomeName && (
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <span className="text-sm text-gray-500">Children&apos;s Home:</span>
                      <div className="font-medium text-gray-900">
                        {visit.childrenHomeName}
                      </div>
                    </div>
                  </div>
                )}

                {visit.location && (
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <span className="text-sm text-gray-500">Location:</span>
                      <div className="font-medium text-gray-900">
                        {visit.location}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center">
                  <Users className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <span className="text-sm text-gray-500">Recorded by:</span>
                    <div className="font-medium text-gray-900">
                      {visit.createdByName || 'Unknown'}
                    </div>
                  </div>
                </div>

                {visit.photos && visit.photos.length > 0 && (
                  <div className="flex items-center">
                    <Camera className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <span className="text-sm text-gray-500">Photos:</span>
                      <div className="font-medium text-gray-900">
                        {visit.photos.length} photo{visit.photos.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {visit.notes && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Notes</h3>
                <p className="text-gray-900 whitespace-pre-wrap bg-white p-3 rounded border">{visit.notes}</p>
              </div>
            )}
          </div>

          {/* Photos Gallery */}
          {visit.photos && visit.photos.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Photos</h3>
              <div className="grid grid-cols-2 gap-3">
                {visit.photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <Image
                      src={photo}
                      alt={`Visit photo ${index + 1}`}
                      width={128}
                      height={128}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => {
                        // Open image in new tab for full view
                        window.open(photo, '_blank')
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                      <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Click on any photo to view full size
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-900 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}