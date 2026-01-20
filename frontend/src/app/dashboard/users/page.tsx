'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '@/services/userService'
import { CreateUserRequest, User, UserRole, UpdateUserRequest } from '@/types'
import { Plus, Edit, Trash2, X } from 'lucide-react'
import { DataTable } from '@/components/ui/data-table'
import { toast } from 'sonner'

export default function UsersPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState<CreateUserRequest>({
    name: '',
    email: '',
    temporaryPassword: '',
    phone: '',
    role: 'COMMITTEE_MEMBER',
  })

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
  })

  const createMutation = useMutation({
    mutationFn: userService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setIsModalOpen(false)
      resetForm()
      toast.success('User created successfully!')
    },
    onError: () => {
      toast.error('Failed to create user')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      userService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setIsModalOpen(false)
      resetForm()
      toast.success('User updated successfully!')
    },
    onError: () => {
      toast.error('Failed to update user')
    },
  })

  const deactivateMutation = useMutation({
    mutationFn: userService.deactivate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User deactivated successfully!')
    },
    onError: () => {
      toast.error('Failed to deactivate user')
    },
  })

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      temporaryPassword: '',
      phone: '',
      role: 'COMMITTEE_MEMBER',
    })
    setEditingUser(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingUser) {
      updateMutation.mutate({
        id: editingUser.id,
        data: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
      })
    } else {
      createMutation.mutate(formData)
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      temporaryPassword: '',
      phone: user.phone || '',
      role: user.role,
    })
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to deactivate this user?')) {
      deactivateMutation.mutate(id)
    }
  }

  const columns = [
    {
      header: 'Name',
      accessor: (user: User) => (
        <span className="font-medium text-gray-900">{user.name}</span>
      ),
    },
    {
      header: 'Email',
      accessor: (user: User) => (
        <span className="text-gray-600">{user.email}</span>
      ),
    },
    {
      header: 'Phone',
      accessor: (user: User) => (
        <span className="text-gray-600">{user.phone || '-'}</span>
      ),
    },
    {
      header: 'Role',
      accessor: (user: User) => (
        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
          {user.role}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: (user: User) => (
        <span
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            user.isActive
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {user.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: (user: User) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(user)}
            className="text-primary-600 hover:text-primary-900"
            title="Edit user"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleDelete(user.id)}
            className="text-red-600 hover:text-red-900"
            disabled={!user.isActive}
            title="Deactivate user"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      ),
    },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading users...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <button
          onClick={() => {
            resetForm()
            setIsModalOpen(true)
          }}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create User
        </button>
      </div>

      <DataTable
        data={users || []}
        columns={columns}
        searchPlaceholder="Search users by name, email, or phone..."
        itemsPerPage={10}
      />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingUser ? 'Edit User' : 'Create User'}
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
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-gray-900 bg-white"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-gray-900 bg-white"
                  placeholder="+254 700 000 000"
                />
              </div>

              {!editingUser && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Temporary Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={formData.temporaryPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          temporaryPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-gray-900 bg-white"
                      placeholder="Enter temporary password"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role *
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          role: e.target.value as UserRole,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-gray-900 bg-white"
                    >
                      <option value="COMMITTEE_MEMBER">Committee Member</option>
                      <option value="ORGANIZING_SECRETARY">Organizing Secretary</option>
                      <option value="TREASURER">Treasurer</option>
                      <option value="VICE_SECRETARY">Vice Secretary</option>
                      <option value="SECRETARY_GENERAL">Secretary General</option>
                      <option value="VICE_CHAIRPERSON">Vice Chairperson</option>
                      <option value="CHAIRPERSON">Chairperson</option>
                      <option value="SUPER_USER">Super User</option>
                    </select>
                  </div>
                </>
              )}

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? 'Saving...'
                    : editingUser
                    ? 'Update'
                    : 'Create'}
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
