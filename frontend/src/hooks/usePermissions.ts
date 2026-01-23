import { useAuthStore } from '@/store/authStore'
import { UserRole } from '@/types'

export interface Permission {
  create: boolean
  read: boolean
  update: boolean
  delete: boolean
}

export interface Permissions {
  users: Permission
  projects: Permission
  donations: Permission
  childrenHomes: Permission
  visits: Permission
  reports: Permission
  notifications: Permission
}

const rolePermissions: Record<UserRole, Permissions> = {
  SUPER_USER: {
    users: { create: true, read: true, update: true, delete: true },
    projects: { create: true, read: true, update: true, delete: true },
    donations: { create: true, read: true, update: true, delete: true },
    childrenHomes: { create: true, read: true, update: true, delete: true },
    visits: { create: true, read: true, update: true, delete: true },
    reports: { create: true, read: true, update: true, delete: true },
    notifications: { create: true, read: true, update: true, delete: true },
  },
  CHAIRPERSON: {
    users: { create: false, read: true, update: false, delete: false },
    projects: { create: true, read: true, update: true, delete: true },
    donations: { create: false, read: true, update: false, delete: false },
    childrenHomes: { create: true, read: true, update: true, delete: true },
    visits: { create: true, read: true, update: true, delete: true },
    reports: { create: false, read: true, update: false, delete: false },
    notifications: { create: false, read: true, update: false, delete: false },
  },
  SECRETARY_GENERAL: {
    users: { create: false, read: true, update: false, delete: false },
    projects: { create: true, read: true, update: true, delete: false },
    donations: { create: false, read: true, update: false, delete: false },
    childrenHomes: { create: true, read: true, update: true, delete: false },
    visits: { create: true, read: true, update: true, delete: false },
    reports: { create: false, read: true, update: false, delete: false },
    notifications: { create: false, read: true, update: false, delete: false },
  },
  VICE_CHAIRPERSON: {
    users: { create: false, read: true, update: false, delete: false },
    projects: { create: false, read: true, update: false, delete: false },
    donations: { create: false, read: true, update: false, delete: false },
    childrenHomes: { create: false, read: true, update: false, delete: false },
    visits: { create: false, read: true, update: false, delete: false },
    reports: { create: false, read: true, update: false, delete: false },
    notifications: { create: false, read: true, update: false, delete: false },
  },
  TREASURER: {
    users: { create: false, read: true, update: false, delete: false },
    projects: { create: false, read: true, update: false, delete: false },
    donations: { create: true, read: true, update: true, delete: false },
    childrenHomes: { create: false, read: true, update: false, delete: false },
    visits: { create: false, read: true, update: false, delete: false },
    reports: { create: false, read: true, update: false, delete: false },
    notifications: { create: false, read: true, update: false, delete: false },
  },
  VICE_SECRETARY: {
    users: { create: false, read: true, update: false, delete: false },
    projects: { create: false, read: true, update: false, delete: false },
    donations: { create: false, read: true, update: false, delete: false },
    childrenHomes: { create: false, read: true, update: false, delete: false },
    visits: { create: false, read: true, update: false, delete: false },
    reports: { create: false, read: true, update: false, delete: false },
    notifications: { create: false, read: true, update: false, delete: false },
  },
  ORGANIZING_SECRETARY: {
    users: { create: false, read: true, update: false, delete: false },
    projects: { create: true, read: true, update: true, delete: false },
    donations: { create: false, read: true, update: false, delete: false },
    childrenHomes: { create: false, read: true, update: false, delete: false },
    visits: { create: true, read: true, update: true, delete: false },
    reports: { create: false, read: true, update: false, delete: false },
    notifications: { create: false, read: true, update: false, delete: false },
  },
  COMMITTEE_MEMBER: {
    users: { create: false, read: true, update: false, delete: false },
    projects: { create: false, read: true, update: false, delete: false },
    donations: { create: false, read: true, update: false, delete: false },
    childrenHomes: { create: false, read: true, update: false, delete: false },
    visits: { create: false, read: true, update: false, delete: false },
    reports: { create: false, read: true, update: false, delete: false },
    notifications: { create: false, read: true, update: false, delete: false },
  },
}

export function usePermissions() {
  const { user } = useAuthStore()
  
  const getUserPermissions = (): Permissions => {
    if (!user?.role) {
      return rolePermissions.COMMITTEE_MEMBER // Default to most restrictive
    }
    return rolePermissions[user.role] || rolePermissions.COMMITTEE_MEMBER
  }

  const hasPermission = (resource: keyof Permissions, action: keyof Permission): boolean => {
    const permissions = getUserPermissions()
    return permissions[resource][action]
  }

  const canCreate = (resource: keyof Permissions): boolean => hasPermission(resource, 'create')
  const canRead = (resource: keyof Permissions): boolean => hasPermission(resource, 'read')
  const canUpdate = (resource: keyof Permissions): boolean => hasPermission(resource, 'update')
  const canDelete = (resource: keyof Permissions): boolean => hasPermission(resource, 'delete')

  return {
    permissions: getUserPermissions(),
    hasPermission,
    canCreate,
    canRead,
    canUpdate,
    canDelete,
  }
}