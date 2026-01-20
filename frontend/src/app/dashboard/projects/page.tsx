'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { projectService } from '@/services/projectService'
import { ProjectRequest, Project, ProjectStatus } from '@/types'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { ProjectsTable } from './components/ProjectsTable'
import { ProjectModal } from './components/ProjectModal'
import { ProjectViewModal } from './components/ProjectViewModal'
import { ProjectFilters } from './components/ProjectFilters'

export default function ProjectsPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [viewingProject, setViewingProject] = useState<Project | null>(null)
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'ALL'>('ALL')

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: projectService.getAll,
  })

  const createMutation = useMutation({
    mutationFn: projectService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setIsModalOpen(false)
      setEditingProject(null)
      toast.success('Project created successfully!')
    },
    onError: () => {
      toast.error('Failed to create project')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProjectRequest }) =>
      projectService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setIsModalOpen(false)
      setEditingProject(null)
      toast.success('Project updated successfully!')
    },
    onError: () => {
      toast.error('Failed to update project')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: projectService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Project deleted successfully!')
    },
    onError: () => {
      toast.error('Failed to delete project')
    },
  })

  const handleSubmit = (data: ProjectRequest) => {
    if (editingProject) {
      updateMutation.mutate({ id: editingProject.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setIsModalOpen(true)
  }

  const handleView = (project: Project) => {
    setViewingProject(project)
    setIsViewModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      deleteMutation.mutate(id)
    }
  }

  const handleCreateNew = () => {
    setEditingProject(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingProject(null)
  }

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false)
    setViewingProject(null)
  }

  // Filter projects by status
  const filteredProjects = projects?.filter(project =>
    statusFilter === 'ALL' || project.status === statusFilter
  ) || []

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
        <button
          onClick={handleCreateNew}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          Create Project
        </button>
      </div>

      <ProjectFilters
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        projectCount={filteredProjects.length}
      />

      <ProjectsTable
        projects={filteredProjects}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        isLoading={isLoading}
      />

      <ProjectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        project={editingProject}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <ProjectViewModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        project={viewingProject}
      />
    </div>
  )
}