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

export type ProjectStatus = 'DRAFT' | 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED'

export type DonationStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'

export interface Event extends Record<string, unknown> {
  id: string
  title: string
  description?: string
  startDateTime: string
  endDateTime: string
  colorCategory: string
  reminderMinutes: number
  reminderSent: boolean
  createdById: string
  createdByName: string
  createdAt: string
}

export interface EventRequest {
  title: string
  description?: string
  startDateTime: string
  endDateTime: string
  colorCategory?: string
  reminderMinutes?: number
}

export interface User extends Record<string, unknown> {
  id: string
  memberNumber?: string // Auto-generated member number (GGF001, etc.)
  firstName: string
  lastName: string
  name: string // Computed full name for backward compatibility
  email: string
  phone?: string
  role: UserRole
  isActive: boolean
  mustChangePassword: boolean
  profilePicture?: string
  memberJoiningDate?: string
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
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: UserRole
  memberJoiningDate?: string
}

export interface UserResponse {
  id: string
  memberNumber?: string // Auto-generated member number (GGF001, etc.)
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: UserRole
  isActive: boolean
  mustChangePassword: boolean
  profilePicture?: string
  memberJoiningDate?: string
  createdAt: string
  updatedAt: string
  temporaryPassword?: string
  emailSent?: boolean
}

export interface UpdateUserRequest {
  name?: string
  email?: string
  phone?: string
  password?: string
  role?: UserRole // Allow role change on edit
  memberJoiningDate?: string // Allow editing member joining date
}

export interface UpdateProfileRequest {
  firstName: string
  lastName: string
  phone?: string
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
  poster?: string // Upload ID for project poster image
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
  poster?: string // Upload ID for project poster image
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
  city?: string
  town?: string
  village?: string
  contact?: string
  notes?: string
  createdAt: string
}

export interface ChildrenHomeRequest {
  name: string
  location?: string
  city?: string
  town?: string
  village?: string
  contact?: string
  notes?: string
}

export interface Visit extends Record<string, unknown> {
  id: string
  visitDate: string
  location?: string
  city?: string
  town?: string
  village?: string
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
  city?: string
  town?: string
  village?: string
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

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  timestamp: string
}

// Module types for file uploads
export type ModuleType = 'VISIT' | 'CHILDREN_HOME' | 'PROJECT' | 'DONATION' | 'USER' | 'REPORT' | 'OTHER'

export interface Upload extends Record<string, unknown> {
  id: string
  fileName: string
  originalFileName: string
  fileType?: string
  fileSize?: number
  fileUrl: string
  moduleType: ModuleType
  moduleId?: string
  uploadedByName?: string
  createdAt: string
}

export interface UploadResponse {
  id: string
  fileName: string
  originalFileName: string
  fileType?: string
  fileSize?: number
  fileUrl: string
  moduleType: ModuleType
  moduleId?: string
  uploadedByName?: string
  createdAt: string
}
