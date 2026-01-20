/**
 * User roles as defined in the Generous Givers Family Constitution (Article 5.2)
 */
export type UserRole =
  | 'SUPER_USER'           // System administrator (full access)
  | 'CHAIRPERSON'          // The Chairperson - leads the organization
  | 'VICE_CHAIRPERSON'     // Vice-Chairperson - assumes chair duties when absent
  | 'SECRETARY_GENERAL'    // Secretary General - maintains records & minutes
  | 'VICE_SECRETARY'       // Vice Secretary - assists secretary
  | 'TREASURER'            // Treasurer - manages finances
  | 'ORGANIZING_SECRETARY' // Organizing Secretary - coordinates events
  | 'COMMITTEE_MEMBER'     // Committee Members - general support

export type ProjectStatus = 'DRAFT' | 'ACTIVE' | 'COMPLETED'

export type DonationStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'

export interface User extends Record<string, unknown> {
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

export interface UpdateUserRequest {
  name?: string
  email?: string
  phone?: string
  password?: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface Project extends Record<string, unknown> {
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
  updatedAt: string
}

export interface ProjectRequest {
  title: string
  description?: string
  status?: ProjectStatus
  targetAmount?: number
  startDate?: string
  endDate?: string
}

export interface Donation extends Record<string, unknown> {
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

export interface ChildrenHome extends Record<string, unknown> {
  id: string
  name: string
  location?: string
  contact?: string
  notes?: string
  createdAt: string
}

export interface ChildrenHomeRequest {
  name: string
  location?: string
  contact?: string
  notes?: string
}

export interface Visit extends Record<string, unknown> {
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

export interface UserReport {
  id: string
  name: string
  email: string
  phone?: string
  role: UserRole
  isActive: boolean
  createdAt: string
}
