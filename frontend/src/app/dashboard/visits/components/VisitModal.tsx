import React, { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { Visit, VisitRequest, ChildrenHome } from '@/types'
import { X, Calendar, MapPin, Camera, Users, Paperclip, FileText } from 'lucide-react'
import { DatePicker } from '@/components/ui/date-picker'
import { useDropzone } from 'react-dropzone'
import { FileUpload } from '@/components/ui/FileUpload'

const toDateInputValue = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

interface VisitModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: VisitRequest) => void
  visit?: Visit | null
  childrenHomes: ChildrenHome[]
  isLoading: boolean
}

export function VisitModal({ isOpen, onClose, onSubmit, visit, childrenHomes, isLoading }: VisitModalProps) {
  const [visitDate, setVisitDate] = useState<Date>()
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [formData, setFormData] = useState<VisitRequest>({
    visitDate: '',
    location: '',
    city: '',
    town: '',
    village: '',
    childrenHomeId: '',
    notes: '',
    participants: [],
    photos: [],
  })

  useEffect(() => {
    if (visit) {
      setFormData({
        visitDate: visit.visitDate,
        location: visit.location || '',
        city: visit.city || '',
        town: visit.town || '',
        village: visit.village || '',
        childrenHomeId: visit.childrenHomeId || '',
        notes: visit.notes || '',
        participants: visit.participants || [],
        photos: visit.photos || [],
      })
      setVisitDate(visit.visitDate ? new Date(visit.visitDate) : undefined)
      setUploadedImages(visit.photos || [])
    } else {
      resetForm()
    }
  }, [visit])

  const resetForm = () => {
    setFormData({
      visitDate: '',
      location: '',
      city: '',
      town: '',
      village: '',
      childrenHomeId: '',
      notes: '',
      participants: [],
      photos: [],
    })
    setVisitDate(undefined)
    setUploadedImages([])
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onload = () => {
        const base64 = reader.result as string
        setUploadedImages((prev) => [...prev, base64])
        setFormData((prev) => ({
          ...prev,
          photos: [...(prev.photos || []), base64],
        }))
      }
      reader.readAsDataURL(file)
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 10,
  })

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos?.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const submitData = {
      ...formData,
      visitDate: visitDate ? toDateInputValue(visitDate) : '',
    }
    onSubmit(submitData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {visit ? 'Edit Visit' : 'Record New Visit'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Visit Date *
            </label>
            <DatePicker
              value={visitDate}
              onChange={setVisitDate}
              placeholder="Select visit date"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="w-4 h-4 inline mr-2" />
              Children&apos;s Home
            </label>
            <select
              value={formData.childrenHomeId}
              onChange={(e) =>
                setFormData({ ...formData, childrenHomeId: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white text-gray-900"
            >
              <option value="">Select a home (optional)</option>
              {childrenHomes?.map((home) => (
                <option key={home.id} value={home.id}>
                  {home.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-2" />
              Location Details
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white text-gray-900 placeholder-gray-500"
              placeholder="Specific location or address"
            />
          </div>

          {/* Location Breakdown Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white text-gray-900 placeholder-gray-500"
                placeholder="City"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Town
              </label>
              <input
                type="text"
                value={formData.town}
                onChange={(e) =>
                  setFormData({ ...formData, town: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white text-gray-900 placeholder-gray-500"
                placeholder="Town"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Village
              </label>
              <input
                type="text"
                value={formData.village}
                onChange={(e) =>
                  setFormData({ ...formData, village: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white text-gray-900 placeholder-gray-500"
                placeholder="Village"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              rows={4}
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white text-gray-900 placeholder-gray-500"
              placeholder="Visit notes, observations, and activities..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Paperclip className="w-4 h-4 inline mr-2" />
              Photos & Documents
            </label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
                isDragActive
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-primary-400'
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex justify-center gap-2 mb-2">
                <Camera className="w-10 h-10 text-gray-400" />
                <FileText className="w-10 h-10 text-gray-400" />
              </div>
              {isDragActive ? (
                <p className="text-sm text-primary-600">Drop the files here...</p>
              ) : (
                <div>
                  <p className="text-sm text-gray-600">
                    Drag & drop images or PDFs here, or click to select
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, GIF, WebP, PDF up to 10 files
                  </p>
                </div>
              )}
            </div>

            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-4">
                {uploadedImages.map((file, index) => (
                  <div key={index} className="relative group">
                    {file.startsWith('data:application/pdf') ? (
                      <div className="w-full h-24 flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
                        <FileText className="w-8 h-8 text-red-500" />
                        <span className="text-xs text-gray-600 mt-1">PDF</span>
                      </div>
                    ) : (
                      <Image
                        src={file}
                        alt={`Upload ${index + 1}`}
                        width={96}
                        height={96}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* File Attachments - only shown when editing an existing visit */}
          {visit && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Paperclip className="w-4 h-4 inline mr-2" />
                File Attachments
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Upload documents, spreadsheets, or any other files related to this visit
              </p>
              <FileUpload
                moduleType="VISIT"
                moduleId={visit.id}
                maxFiles={20}
                showExistingFiles={true}
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : visit ? 'Update Visit' : 'Save Visit'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}