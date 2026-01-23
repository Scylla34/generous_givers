'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { visitService } from '@/services/visitService'
import { childrenHomeService } from '@/services/childrenHomeService'
import { Visit, VisitRequest } from '@/types'
import { Plus, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { PermissionWrapper } from '@/components/ui/permission-button'
import { VisitStats } from './components/VisitStats'
import { VisitModal } from './components/VisitModal'
import { VisitViewModal } from './components/VisitViewModal'
import { VisitsTable } from './components/VisitsTable'

export default function VisitsPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [editingVisit, setEditingVisit] = useState<Visit | null>(null)
  const [viewingVisit, setViewingVisit] = useState<Visit | null>(null)

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
    onSuccess: (newVisit) => {
      queryClient.invalidateQueries({ queryKey: ['visits'] })
      queryClient.invalidateQueries({ queryKey: ['recent-visits'] })
      setIsModalOpen(false)
      setEditingVisit(null)
      
      // Enhanced success notification
      toast.success(
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="font-medium">Visit recorded successfully!</span>
          </div>
          <div className="text-sm text-gray-600">
            Visit to {newVisit.childrenHomeName || newVisit.location || 'location'} has been saved.
          </div>
        </div>,
        { duration: 5000 }
      )
      
      // Organizing team notification
      toast.info(
        `New visit recorded at ${newVisit.childrenHomeName || newVisit.location || 'location'}.`,
        { duration: 4000 }
      )
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to record visit'
      toast.error(
        <div className="space-y-1">
          <div className="font-medium">Failed to record visit</div>
          <div className="text-sm text-gray-600">{errorMessage}</div>
        </div>,
        { duration: 6000 }
      )
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: VisitRequest }) =>
      visitService.update(id, data),
    onSuccess: (updatedVisit) => {
      queryClient.invalidateQueries({ queryKey: ['visits'] })
      queryClient.invalidateQueries({ queryKey: ['recent-visits'] })
      setIsModalOpen(false)
      setEditingVisit(null)
      
      toast.success(
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="font-medium">Visit updated successfully!</span>
          </div>
          <div className="text-sm text-gray-600">
            Changes to visit at {updatedVisit.childrenHomeName || updatedVisit.location || 'location'} have been saved.
          </div>
        </div>,
        { duration: 4000 }
      )
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update visit'
      toast.error(
        <div className="space-y-1">
          <div className="font-medium">Failed to update visit</div>
          <div className="text-sm text-gray-600">{errorMessage}</div>
        </div>,
        { duration: 6000 }
      )
    },
  })

  const deleteMutation = useMutation({
    mutationFn: visitService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visits'] })
      queryClient.invalidateQueries({ queryKey: ['recent-visits'] })
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="font-medium">Visit deleted successfully!</span>
        </div>,
        { duration: 3000 }
      )
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete visit'
      toast.error(
        <div className="space-y-1">
          <div className="font-medium">Failed to delete visit</div>
          <div className="text-sm text-gray-600">{errorMessage}</div>
        </div>,
        { duration: 6000 }
      )
    },
  })

  const handleSubmit = (data: VisitRequest) => {
    if (editingVisit) {
      updateMutation.mutate({ id: editingVisit.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const handleEdit = (visit: Visit) => {
    setEditingVisit(visit)
    setIsModalOpen(true)
  }

  const handleView = (visit: Visit) => {
    setViewingVisit(visit)
    setIsViewModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this visit? This action cannot be undone.')) {
      deleteMutation.mutate(id)
    }
  }

  const handleCreateNew = () => {
    setEditingVisit(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingVisit(null)
  }

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false)
    setViewingVisit(null)
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Visits</h1>
          <p className="text-gray-600 mt-1">Record and manage visits to children&apos;s homes</p>
        </div>
        <PermissionWrapper resource="visits" action="create">
          <button
            onClick={handleCreateNew}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 shadow-sm hover:shadow-md whitespace-nowrap"
          >
            <Plus className="w-5 h-5 text-white" />
            <span className="text-white font-medium">Record Visit</span>
          </button>
        </PermissionWrapper>
      </div>

      {/* Visit Statistics */}
      <VisitStats visits={visits || []} />

      {/* Visits Table */}
      <VisitsTable
        visits={visits || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        isLoading={isLoading}
      />

      {/* Modals */}
      <VisitModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        visit={editingVisit}
        childrenHomes={childrenHomes || []}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <VisitViewModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        visit={viewingVisit}
      />
    </div>
  )
}