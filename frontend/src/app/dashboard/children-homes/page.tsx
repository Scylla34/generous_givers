'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { childrenHomeService } from '@/services/childrenHomeService'
import { ChildrenHome, ChildrenHomeRequest } from '@/types'
import { Plus, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { PermissionWrapper } from '@/components/ui/permission-button'
import { ChildrenHomeStats } from './components/ChildrenHomeStats'
import { ChildrenHomeModal } from './components/ChildrenHomeModal'
import { ChildrenHomeViewModal } from './components/ChildrenHomeViewModal'
import { ChildrenHomesTable } from './components/ChildrenHomesTable'

export default function ChildrenHomesPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [editingHome, setEditingHome] = useState<ChildrenHome | null>(null)
  const [viewingHome, setViewingHome] = useState<ChildrenHome | null>(null)

  const { data: homes, isLoading } = useQuery({
    queryKey: ['childrenHomes'],
    queryFn: childrenHomeService.getAll,
  })

  const createMutation = useMutation({
    mutationFn: childrenHomeService.create,
    onSuccess: (newHome) => {
      queryClient.invalidateQueries({ queryKey: ['childrenHomes'] })
      setIsModalOpen(false)
      setEditingHome(null)
      
      // Enhanced success notification
      toast.success(
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="font-medium">Children&apos;s home added successfully!</span>
          </div>
          <div className="text-sm text-gray-600">
            {newHome.name} has been added to the system and is now available for visit planning.
          </div>
        </div>,
        { duration: 5000 }
      )
      
      // Organizing team notification
      toast.info(
        `New children&apos;s home &quot;${newHome.name}&quot; added to the system.`,
        { duration: 4000 }
      )
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add home'
      toast.error(
        <div className="space-y-1">
          <div className="font-medium">Failed to add children&apos;s home</div>
          <div className="text-sm text-gray-600">{errorMessage}</div>
        </div>,
        { duration: 6000 }
      )
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ChildrenHomeRequest }) =>
      childrenHomeService.update(id, data),
    onSuccess: (updatedHome) => {
      queryClient.invalidateQueries({ queryKey: ['childrenHomes'] })
      setIsModalOpen(false)
      setEditingHome(null)
      
      toast.success(
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="font-medium">Children&apos;s home updated successfully!</span>
          </div>
          <div className="text-sm text-gray-600">
            Changes to {updatedHome.name} have been saved.
          </div>
        </div>,
        { duration: 4000 }
      )
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update home'
      toast.error(
        <div className="space-y-1">
          <div className="font-medium">Failed to update children&apos;s home</div>
          <div className="text-sm text-gray-600">{errorMessage}</div>
        </div>,
        { duration: 6000 }
      )
    },
  })

  const deleteMutation = useMutation({
    mutationFn: childrenHomeService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['childrenHomes'] })
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="font-medium">Children&apos;s home deleted successfully!</span>
        </div>,
        { duration: 3000 }
      )
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete home'
      toast.error(
        <div className="space-y-1">
          <div className="font-medium">Failed to delete children&apos;s home</div>
          <div className="text-sm text-gray-600">{errorMessage}</div>
        </div>,
        { duration: 6000 }
      )
    },
  })

  const handleSubmit = (data: ChildrenHomeRequest) => {
    if (editingHome) {
      updateMutation.mutate({ id: editingHome.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const handleEdit = (home: ChildrenHome) => {
    setEditingHome(home)
    setIsModalOpen(true)
  }

  const handleView = (home: ChildrenHome) => {
    setViewingHome(home)
    setIsViewModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this children\'s home? This action cannot be undone.')) {
      deleteMutation.mutate(id)
    }
  }

  const handleCreateNew = () => {
    setEditingHome(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingHome(null)
  }

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false)
    setViewingHome(null)
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Children&apos;s Homes</h1>
          <p className="text-gray-600 mt-1">Manage and track children&apos;s homes for visit planning</p>
        </div>
        <PermissionWrapper resource="childrenHomes" action="create">
          <button
            onClick={handleCreateNew}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 shadow-sm hover:shadow-md whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Add Home
          </button>
        </PermissionWrapper>
      </div>

      {/* Children&apos;s Home Statistics */}
      <ChildrenHomeStats homes={homes || []} />

      {/* Children&apos;s Homes Table */}
      <ChildrenHomesTable
        homes={homes || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        isLoading={isLoading}
      />

      {/* Modals */}
      <ChildrenHomeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        home={editingHome}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <ChildrenHomeViewModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        home={viewingHome}
      />
    </div>
  )
}