'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { visitService } from '@/services/visitService'
import { childrenHomeService } from '@/services/childrenHomeService'
import { VisitRequest } from '@/types'
import { Plus, X } from 'lucide-react'
import { format } from 'date-fns'

export default function VisitsPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState<VisitRequest>({
    visitDate: '',
    location: '',
    childrenHomeId: '',
    notes: '',
    participants: [],
  })

  const { data: visits, isLoading } = useQuery({
    queryKey: ['visits'],
    queryFn: visitService.getAll,
  })

  const { data: childrenHomes } = useQuery({
    queryKey: ['childrenHomes'],
    queryFn: childrenHomeService.getAll,
  })

  const createMutation = useMutation({
    mutationFn: visitService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visits'] })
      setIsModalOpen(false)
      resetForm()
    },
  })

  const resetForm = () => {
    setFormData({
      visitDate: '',
      location: '',
      childrenHomeId: '',
      notes: '',
      participants: [],
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(formData)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading visits...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visits?.map((visit) => (
          <div key={visit.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {visit.childrenHomeName || visit.location || 'Visit'}
              </h3>
              <p className="text-sm text-gray-600">
                {format(new Date(visit.visitDate), 'MMMM dd, yyyy')}
              </p>
            </div>

            {visit.notes && (
              <p className="text-sm text-gray-700 mb-4 line-clamp-3">{visit.notes}</p>
            )}

            {visit.participants && visit.participants.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-2">Participants:</p>
                <div className="flex flex-wrap gap-1">
                  {visit.participants.map((participant, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {participant}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
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
                  Visit Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.visitDate}
                  onChange={(e) =>
                    setFormData({ ...formData, visitDate: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Children's Home
                </label>
                <select
                  value={formData.childrenHomeId}
                  onChange={(e) =>
                    setFormData({ ...formData, childrenHomeId: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select a home</option>
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  rows={4}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
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
