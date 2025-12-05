'use client'

import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { visitService } from '@/services/visitService'
import { childrenHomeService } from '@/services/childrenHomeService'
import { Visit, VisitRequest } from '@/types'
import { Plus, X, Calendar, Image as ImageIcon } from 'lucide-react'
import { DataTable } from '@/components/ui/data-table'
import { DatePicker } from '@/components/ui/date-picker'
import { toast } from 'sonner'
import { formatDateSafe, toDateInputValue } from '@/lib/format'
import { useDropzone } from 'react-dropzone'

export default function VisitsPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [visitDate, setVisitDate] = useState<Date>()
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [formData, setFormData] = useState<VisitRequest>({
    visitDate: '',
    location: '',
    childrenHomeId: '',
    notes: '',
    participants: [],
    photos: [],
  })

  const { data: visits, isLoading } = useQuery({
    queryKey: ['visits'],
    queryFn: visitService.getAll,
  })

  const { data: childrenHomes } = useQuery({
    queryKey: ['childrenHomes'],
    queryFn: childrenHomeService.getAll,
  })

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
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
    maxFiles: 5,
  })

  const createMutation = useMutation({
    mutationFn: visitService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visits'] })
      setIsModalOpen(false)
      resetForm()
      toast.success('Visit recorded successfully!')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to record visit')
    },
  })

  const resetForm = () => {
    setFormData({
      visitDate: '',
      location: '',
      childrenHomeId: '',
      notes: '',
      participants: [],
      photos: [],
    })
    setVisitDate(undefined)
    setUploadedImages([])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const submitData = {
      ...formData,
      visitDate: visitDate ? toDateInputValue(visitDate) : '',
    }
    createMutation.mutate(submitData)
  }

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos?.filter((_, i) => i !== index),
    }))
  }

  const columns = [
    {
      header: 'Date',
      accessor: (visit: Visit) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-900">{formatDateSafe(visit.visitDate)}</span>
        </div>
      ),
    },
    {
      header: 'Location / Home',
      accessor: (visit: Visit) => (
        <div>
          <div className="font-medium text-gray-900">
            {visit.childrenHomeName || visit.location || '-'}
          </div>
          {visit.childrenHomeName && visit.location && (
            <div className="text-sm text-gray-500">{visit.location}</div>
          )}
        </div>
      ),
    },
    {
      header: 'Participants',
      accessor: (visit: Visit) => (
        <span className="text-sm text-gray-600">
          {visit.participants && visit.participants.length > 0
            ? `${visit.participants.length} participant${visit.participants.length > 1 ? 's' : ''}`
            : '-'}
        </span>
      ),
    },
    {
      header: 'Photos',
      accessor: (visit: Visit) => (
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {visit.photos && visit.photos.length > 0 ? visit.photos.length : '0'}
          </span>
        </div>
      ),
    },
    {
      header: 'Notes',
      accessor: (visit: Visit) => (
        <span className="text-sm text-gray-600 line-clamp-2">{visit.notes || '-'}</span>
      ),
    },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading visits...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Visits</h1>
        <button
          onClick={() => {
            resetForm()
            setIsModalOpen(true)
          }}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Record Visit
        </button>
      </div>

      <DataTable
        data={visits || []}
        columns={columns}
        searchPlaceholder="Search visits by location or notes..."
        itemsPerPage={10}
      />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Record Visit</h2>
              <button
                onClick={() => {
                  setIsModalOpen(false)
                  resetForm()
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Visit Date *
                </label>
                <DatePicker
                  date={visitDate}
                  onDateChange={setVisitDate}
                  placeholder="Select visit date"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Children&apos;s Home
                </label>
                <select
                  value={formData.childrenHomeId}
                  onChange={(e) =>
                    setFormData({ ...formData, childrenHomeId: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-gray-900 bg-white"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-gray-900 bg-white"
                  placeholder="Specific location or address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-gray-900 bg-white"
                  placeholder="Visit notes and observations..."
                />
              </div>

              {/* Image Upload with Drag & Drop */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Photos
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
                  <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                  {isDragActive ? (
                    <p className="text-sm text-primary-600">Drop the images here...</p>
                  ) : (
                    <div>
                      <p className="text-sm text-gray-600">
                        Drag &amp; drop images here, or click to select
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, GIF, WebP up to 5 files
                      </p>
                    </div>
                  )}
                </div>

                {/* Preview uploaded images */}
                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {uploadedImages.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                          title="Remove image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
                >
                  {createMutation.isPending ? 'Saving...' : 'Save Visit'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false)
                    resetForm()
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
