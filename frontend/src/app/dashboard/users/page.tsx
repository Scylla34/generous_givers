'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '@/services/userService'
import { CreateUserRequest, User, UserRole, UpdateUserRequest, UserResponse } from '@/types'
import { Plus, Edit, Trash2, X, Mail, CheckCircle } from 'lucide-react'
import { DataTable } from '@/components/ui/data-table'
import { DatePicker } from '@/components/ui/date-picker'
import { toast } from 'sonner'
import { PermissionButton, PermissionWrapper } from '@/components/ui/permission-button'
import { isEmailDeliveryError, getUserFriendlyErrorMessage } from '@/lib/utils'

export default function UsersPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formError, setFormError] = useState('')
  const [formData, setFormData] = useState<CreateUserRequest>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'COMMITTEE_MEMBER',
    memberJoiningDate: '',
  })

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
  })

  const createMutation = useMutation({
    mutationFn: userService.create,
    onSuccess: (response: UserResponse) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setIsModalOpen(false)
      resetForm()
      
      // Show success message with email status
      if (response.emailSent) {
        toast.success(
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="font-medium">User created successfully!</span>
            </div>
            <div className="text-sm text-gray-600">
              <Mail className="w-3 h-3 inline mr-1" />
              Login credentials sent to {response.email}
            </div>
          </div>,
          { duration: 5000 }
        )
      } else {
        toast.success('User created successfully!', { duration: 3000 })
        toast.warning(
          `Email notification failed. Please manually send credentials to ${response.email}`,
          { duration: 8000 }
        )
      }
      
      // Show admin notification
      toast.info(
        `New user ${response.firstName} ${response.lastName} has been created.`,
        { duration: 4000 }
      )
    },
    onError: (err: unknown) => {
      const errorResponse = err as { response?: { data?: { message?: string } } }
      const errorMessage = errorResponse?.response?.data?.message || 'Failed to create user'
      
      // Use utility function for better error handling
      const friendlyMessage = getUserFriendlyErrorMessage(errorMessage)
      
      if (isEmailDeliveryError(errorMessage)) {
        setFormError(friendlyMessage)
        toast.error(
          <div className="space-y-2">
            <div className="font-medium">User creation failed</div>
            <div className="text-sm">Unable to send login credentials to the provided email address. Please verify the email is correct and try again.</div>
          </div>,
          { duration: 8000 }
        )
      } else {
        setFormError(friendlyMessage)
        toast.error(friendlyMessage)
      }
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
    onError: (err: unknown) => {
      const errorResponse = err as { response?: { data?: { message?: string } } }
      const errorMessage = errorResponse?.response?.data?.message || 'Failed to update user'
      setFormError(errorMessage)
      toast.error(errorMessage)
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
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'COMMITTEE_MEMBER',
      memberJoiningDate: '',
    })
    setEditingUser(null)
    setFormError('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    
    if (editingUser) {
      updateMutation.mutate({
        id: editingUser.id,
        data: {
          name: `${formData.firstName} ${formData.lastName}`,
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
      firstName: user.firstName || user.name.split(' ')[0] || '',
      lastName: user.lastName || user.name.split(' ').slice(1).join(' ') || '',
      email: user.email,
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
        <span className="font-medium text-gray-900">
          {user.firstName && user.lastName 
            ? `${user.firstName} ${user.lastName}` 
            : user.name}
        </span>
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
          {user.role.replace('_', ' ')}
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
      accessor: (user: User) => {
        console.log('Rendering actions for user:', user.name); // Debug log
        return (
          <div className="flex gap-2">
            <PermissionButton
              resource="users"
              action="update"
              onClick={() => handleEdit(user)}
              className="text-primary-600 hover:text-primary-900 transition-colors"
              title="Edit user"
            >
              <Edit className="w-4 h-4" />
            </PermissionButton>
            <PermissionButton
              resource="users"
              action="delete"
              onClick={() => handleDelete(user.id)}
              disabled={!user.isActive}
              className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50"
              title="Deactivate user"
            >
              <Trash2 className="w-4 h-4" />
            </PermissionButton>
          </div>
        );
      },
    },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading users...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Failed to load users. Please try again.</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage organization members and their roles</p>
        </div>
        <PermissionWrapper resource="users" action="create">
          <button
            onClick={() => {
              resetForm()
              setIsModalOpen(true)
            }}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Create User
          </button>
        </PermissionWrapper>
      </div>

      <DataTable
        data={users || []}
        columns={columns}
        searchPlaceholder="Search users by name, email, or phone..."
        itemsPerPage={10}
      />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editingUser ? 'Edit User' : 'Create New User'}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false)
                  resetForm()
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {formError}
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors text-gray-900 bg-white"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors text-gray-900 bg-white"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors text-gray-900 bg-white"
                  placeholder="john.doe@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors text-gray-900 bg-white"
                  placeholder="+254 700 000 000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Member Joining Date
                </label>
                <DatePicker
                  value={formData.memberJoiningDate ? new Date(formData.memberJoiningDate) : undefined}
                  onChange={(date) =>
                    setFormData({ 
                      ...formData, 
                      memberJoiningDate: date ? date.toISOString().split('T')[0] : '' 
                    })
                  }
                  placeholder="Select joining date"
                  maxDate={new Date()}
                />
              </div>

              {!editingUser && (
                <>
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors text-gray-900 bg-white"
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

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <Mail className="w-4 h-4 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium">Auto-Generated Password</p>
                        <p>A temporary password will be automatically generated and sent to the user&apos;s email address. <strong>User creation will fail if the email cannot be delivered.</strong></p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? 'Processing...'
                    : editingUser
                    ? 'Update User'
                    : 'Create User'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false)
                    resetForm()
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
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
