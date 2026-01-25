'use client'

import Image from 'next/image'
import { Visit, UploadResponse } from '@/types'
import { X, Calendar, MapPin, Users, Camera, Paperclip, Download, File, FileText, Video, Music, Image as ImageIcon } from 'lucide-react'
import { formatDateSafe } from '@/lib/format'
import { useQuery } from '@tanstack/react-query'
import { uploadService } from '@/services/uploadService'

const getFileIcon = (fileType?: string) => {
  if (!fileType) return <File className="w-5 h-5 text-gray-400" />
  if (fileType.startsWith('image/')) return <ImageIcon className="w-5 h-5 text-blue-500" />
  if (fileType.startsWith('video/')) return <Video className="w-5 h-5 text-purple-500" />
  if (fileType.startsWith('audio/')) return <Music className="w-5 h-5 text-green-500" />
  if (fileType.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />
  return <File className="w-5 h-5 text-gray-400" />
}

const formatFileSize = (bytes?: number): string => {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

interface VisitViewModalProps {
  isOpen: boolean
  onClose: () => void
  visit: Visit | null
}

export function VisitViewModal({ isOpen, onClose, visit }: VisitViewModalProps) {
  // Fetch file attachments for this visit
  const { data: attachments = [] } = useQuery({
    queryKey: ['uploads', 'VISIT', visit?.id],
    queryFn: () => visit ? uploadService.getByModule('VISIT', visit.id) : Promise.resolve([]),
    enabled: isOpen && !!visit?.id,
  })

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

                {/* Location Breakdown */}
                {(visit.city || visit.town || visit.village) && (
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <span className="text-sm text-gray-500">Location Details:</span>
                      <div className="font-medium text-gray-900">
                        {[visit.village, visit.town, visit.city].filter(Boolean).join(', ')}
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

        {/* File Attachments */}
        {attachments.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Paperclip className="w-5 h-5" />
              File Attachments ({attachments.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {attachments.map((file: UploadResponse) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {getFileIcon(file.fileType)}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">
                        {file.originalFileName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.fileSize)}
                      </p>
                    </div>
                  </div>
                  <a
                    href={file.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-gray-200 rounded flex-shrink-0"
                    title="Download"
                  >
                    <Download className="w-4 h-4 text-gray-600" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

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