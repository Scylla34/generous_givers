'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { projectService } from '@/services/projectService'
import { ProjectRequest, Project, ProjectStatus } from '@/types'
import { Plus, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { PermissionWrapper } from '@/components/ui/permission-button'
import { ProjectsTable } from './components/ProjectsTable'
import { ProjectModal } from './components/ProjectModal'
import { ProjectViewModal } from './components/ProjectViewModal'
import { ProjectFilters } from './components/ProjectFilters'
import { ProjectStats } from './components/ProjectStats'

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
    onSuccess: (newProject) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setIsModalOpen(false)
      setEditingProject(null)
      
      // Enhanced success notification
      toast.success(
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="font-medium">Project created successfully!</span>
          </div>
          <div className="text-sm text-gray-600">
            Project &quot;{newProject.title}&quot; has been added to the system.
          </div>
        </div>,
        { duration: 5000 }
      )
      
      // Admin notification
      toast.info(
        `New project &quot;${newProject.title}&quot; created with ${newProject.status} status.`,
        { duration: 4000 }
      )
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create project'
      toast.error(
        <div className="space-y-1">
          <div className="font-medium">Failed to create project</div>
          <div className="text-sm text-gray-600">{errorMessage}</div>
        </div>,
        { duration: 6000 }
      )
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProjectRequest }) =>
      projectService.update(id, data),
    onSuccess: (updatedProject) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setIsModalOpen(false)
      setEditingProject(null)
      
      toast.success(
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="font-medium">Project updated successfully!</span>
          </div>
          <div className="text-sm text-gray-600">
            Changes to &quot;{updatedProject.title}&quot; have been saved.
          </div>
        </div>,
        { duration: 4000 }
      )
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update project'
      toast.error(
        <div className="space-y-1">
          <div className="font-medium">Failed to update project</div>
          <div className="text-sm text-gray-600">{errorMessage}</div>
        </div>,
        { duration: 6000 }
      )
    },
  })

  const deleteMutation = useMutation({
    mutationFn: projectService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="font-medium">Project deleted successfully!</span>
        </div>,
        { duration: 3000 }
      )
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete project'
      toast.error(
        <div className="space-y-1">
          <div className="font-medium">Failed to delete project</div>
          <div className="text-sm text-gray-600">{errorMessage}</div>
        </div>,
        { duration: 6000 }
      )
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

  // Filter projects by status - ensure projects is always an array
  const projectsArray = Array.isArray(projects) ? projects : []
  const filteredProjects = projectsArray.filter(project =>
    statusFilter === 'ALL' || project.status === statusFilter
  )

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">Manage and track organization projects</p>
        </div>
        <PermissionWrapper resource="projects" action="create">
          <button
            onClick={handleCreateNew}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 shadow-sm hover:shadow-md whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Create Project
          </button>
        </PermissionWrapper>
      </div>

      {/* Project Statistics */}
      <ProjectStats projects={projectsArray} />

      {/* Filters */}
      <ProjectFilters
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        projectCount={filteredProjects.length}
      />

      {/* Projects Table */}
      <ProjectsTable
        projects={filteredProjects}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        isLoading={isLoading}
      />

      {/* Modals */}
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