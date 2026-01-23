'use client'

import { Edit, Trash2, Eye } from 'lucide-react'
import { Project } from '@/types'
import { formatCurrency } from '@/lib/format'
import { DataTable } from '@/components/ui/data-table'
import { PermissionButton } from '@/components/ui/permission-button'

interface ProjectsTableProps {
  projects: Project[]
  onEdit: (project: Project) => void
  onDelete: (id: string) => void
  onView: (project: Project) => void
  isLoading?: boolean
}

export function ProjectsTable({ projects, onEdit, onDelete, onView, isLoading }: ProjectsTableProps) {
  const columns = [
    {
      header: 'Title',
      accessor: (project: Project) => (
        <div className="min-w-0">
          <div className="font-medium text-gray-900 truncate">{project.title}</div>
          <div className="text-sm text-gray-500 line-clamp-2 mt-1">
            {project.description || 'No description'}
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (project: Project) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
            project.status === 'ACTIVE'
              ? 'bg-green-100 text-green-800'
              : project.status === 'COMPLETED'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {project.status}
        </span>
      ),
    },
    {
      header: 'Target',
      accessor: (project: Project) => (
        <span className="text-sm text-gray-900 whitespace-nowrap">
          {formatCurrency(project.targetAmount)}
        </span>
      ),
      className: 'hidden md:table-cell',
    },
    {
      header: 'Raised',
      accessor: (project: Project) => (
        <span className="text-sm font-semibold text-blue-600 whitespace-nowrap">
          {formatCurrency(project.fundsRaised)}
        </span>
      ),
      className: 'hidden md:table-cell',
    },
    {
      header: 'Progress',
      accessor: (project: Project) => (
        <div className="w-24 sm:w-32">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(project.percentFunded, 100)}%` }}
              />
            </div>
            <span className="text-xs text-gray-600 min-w-[35px] text-right">
              {project.percentFunded.toFixed(0)}%
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'Actions',
      accessor: (project: Project) => (
        <div className="flex gap-1 sm:gap-2">
          <button
            onClick={() => onView(project)}
            className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
            title="View project"
          >
            <Eye className="w-4 h-4" />
          </button>
          <PermissionButton
            resource="projects"
            action="update"
            onClick={() => onEdit(project)}
            className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
            title="Edit project"
          >
            <Edit className="w-4 h-4" />
          </PermissionButton>
          <PermissionButton
            resource="projects"
            action="delete"
            onClick={() => onDelete(project.id)}
            className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors"
            title="Delete project"
          >
            <Trash2 className="w-4 h-4" />
          </PermissionButton>
        </div>
      ),
    },
  ]

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading projects...</div>
        </div>
      </div>
    )
  }

  return (
    <DataTable
      data={projects}
      columns={columns}
      searchPlaceholder="Search projects by title or description..."
      itemsPerPage={10}
    />
  )
}