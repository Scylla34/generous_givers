export type UserRole = 'SUPER_USER' | 'CHAIRMAN' | 'SECRETARY' | 'TREASURER' | 'MEMBER'

export type ProjectStatus = 'DRAFT' | 'ACTIVE' | 'COMPLETED'

export type DonationStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: UserRole
  isActive: boolean
  mustChangePassword: boolean
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  accessToken: string
  tokenType: string
  expiresIn: number
  user: User
}

export interface CreateUserRequest {
  name: string
  email: string
  temporaryPassword: string
  phone?: string
  role: UserRole
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface Project {
  id: string
  title: string
  description?: string
  status: ProjectStatus
  targetAmount: number
  fundsRaised: number
  percentFunded: number
  startDate?: string
  endDate?: string
  createdById?: string
  createdByName?: string
  createdAt: string
}

export interface ProjectRequest {
  title: string
  description?: string
  status?: ProjectStatus
  targetAmount?: number
  startDate?: string
  endDate?: string
}

export interface Donation {
  id: string
  donorUserId?: string
  donorName?: string
  email?: string
  amount: number
  date: string
  method?: string
  status: DonationStatus
  projectId?: string
  projectTitle?: string
  createdAt: string
}

export interface DonationRequest {
  donorName?: string
  email?: string
  amount: number
  method?: string
  projectId?: string
}

export interface ChildrenHome {
  id: string
  name: string
  location?: string
  contact?: string
  notes?: string
  createdAt: string
}

export interface Visit {
  id: string
  visitDate: string
  location?: string
  childrenHomeId?: string
  childrenHomeName?: string
  notes?: string
  participants?: string[]
  createdById?: string
  createdByName?: string
  photos?: string[]
  createdAt: string
}

export interface VisitRequest {
  visitDate: string
  location?: string
  childrenHomeId?: string
  notes?: string
  participants?: string[]
  photos?: string[]
}

export interface MonthlyFundsReport {
  month: number
  year: number
  totalAmount: number
  donationCount: number
}

export interface ProjectProgressReport {
  projectId: string
  title: string
  status: ProjectStatus
  targetAmount: number
  fundsRaised: number
  percentFunded: number
  donationCount: number
}

export interface UserRoleReport {
  role: UserRole
  activeCount: number
  inactiveCount: number
  totalCount: number
}
