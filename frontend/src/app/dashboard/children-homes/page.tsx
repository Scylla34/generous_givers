'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { childrenHomeService } from '@/services/childrenHomeService'
import { ChildrenHome } from '@/types'
import { Plus, Edit, Trash2, X, MapPin, Phone } from 'lucide-react'
import { DataTable } from '@/components/ui/data-table'
import { toast } from 'sonner'

export default function ChildrenHomesPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingHome, setEditingHome] = useState<ChildrenHome | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    contact: '',
    notes: '',
  })

  const { data: homes, isLoading } = useQuery({
    queryKey: ['childrenHomes'],
    queryFn: childrenHomeService.getAll,
  })

  const createMutation = useMutation({
    mutationFn: childrenHomeService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['childrenHomes'] })
      setIsModalOpen(false)
      resetForm()
      toast.success('Children&apos;s home added successfully!')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to add home')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      childrenHomeService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['childrenHomes'] })
      setIsModalOpen(false)
      resetForm()
      toast.success('Children&apos;s home updated successfully!')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update home')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: childrenHomeService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['childrenHomes'] })
      toast.success('Children&apos;s home deleted successfully!')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete home')
    },
  })

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      contact: '',
      notes: '',
    })
    setEditingHome(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingHome) {
      updateMutation.mutate({ id: editingHome.id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const handleEdit = (home: ChildrenHome) => {
    setEditingHome(home)
    setFormData({
      name: home.name,
      location: home.location || '',
      contact: home.contact || '',
      notes: home.notes || '',
    })
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this home?')) {
      deleteMutation.mutate(id)
    }
  }

  const columns = [
    {
      header: 'Name',
      accessor: (home: ChildrenHome) => (
        <span className="font-medium text-gray-900">{home.name}</span>
      ),
    },
    {
      header: 'Location',
      accessor: (home: ChildrenHome) => (
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{home.location || '-'}</span>
        </div>
      ),
    },
    {
      header: 'Contact',
      accessor: (home: ChildrenHome) => (
        <div className="flex items-center gap-2 text-gray-600">
          <Phone className="w-4 h-4" />
          <span className="text-sm">{home.contact || '-'}</span>
        </div>
      ),
    },
    {
      header: 'Notes',
      accessor: (home: ChildrenHome) => (
        <span className="text-sm text-gray-600 line-clamp-2">{home.notes || '-'}</span>
      ),
    },
    {
      header: 'Actions',
      accessor: (home: ChildrenHome) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(home)}
            className="text-blue-600 hover:text-blue-900"
            title="Edit home"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(home.id)}
            className="text-red-600 hover:text-red-900"
            title="Delete home"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading homes...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Children&apos;s Homes</h1>
        <button
          onClick={() => {
            resetForm()
            setIsModalOpen(true)
          }}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Home
        </button>
      </div>

      <DataTable
        data={homes || []}
        columns={columns}
        searchPlaceholder="Search by name, location, or contact..."
        itemsPerPage={10}
      />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingHome ? 'Edit Home' : 'Add Home'}
              </h2>
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
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-gray-900 bg-white"
                  placeholder="Enter home name"
                />
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
                  placeholder="Enter location"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact
                </label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) =>
                    setFormData({ ...formData, contact: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-gray-900 bg-white"
                  placeholder="Phone or email"
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
                  placeholder="Additional notes..."
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? 'Saving...'
                    : editingHome
                    ? 'Update'
                    : 'Add'}
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
