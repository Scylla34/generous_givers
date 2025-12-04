# Implementation Guide - Foundation Management System

## What's Been Completed

### ✅ Backend (100% Complete with Updates)
- **New Authentication Flow**: Admin-only user creation
- **Password Management**: Force password change on first login
- **New API Endpoints**:
  - `POST /users` - Create users (Super User only)
  - `POST /auth/change-password` - Change password
- **Removed**: Public signup endpoint
- **Database**: Added `must_change_password` column

### ✅ Frontend Structure (60% Complete)
- Project setup with Next.js 14, TypeScript, Tailwind
- API client with JWT interceptors
- Auth store with Zustand
- Modern Navbar and Footer components
- Login page with redirect logic
- Change password page (force change after first login)
- Updated services for new auth flow

## Implementation Status by Page

### Public Pages (3 of 5 Complete)
- ✅ Home page (`/`) - Hero section and basic layout
- ⏳ About page (`/about`) - NEEDS IMPLEMENTATION
- ⏳ Projects page (`/projects`) - NEEDS IMPLEMENTATION
- ⏳ Donate page (`/donate`) - NEEDS IMPLEMENTATION
- ⏳ Contact page (`/contact`) - NEEDS IMPLEMENTATION

### Authentication (2 of 2 Complete)
- ✅ Login page (`/auth/login`)
- ✅ Change password page (`/auth/change-password`)

### Dashboard (0 of 9 Complete)
- ⏳ Dashboard layout - NEEDS IMPLEMENTATION
- ⏳ Dashboard home - NEEDS IMPLEMENTATION
- ⏳ User management - NEEDS IMPLEMENTATION
- ⏳ Projects management - NEEDS IMPLEMENTATION
- ⏳ Donations management - NEEDS IMPLEMENTATION
- ⏳ Visits management - NEEDS IMPLEMENTATION
- ⏳ Children Homes - NEEDS IMPLEMENTATION
- ⏳ Reports - NEEDS IMPLEMENTATION
- ⏳ Profile settings - NEEDS IMPLEMENTATION

---

## Quick Start Testing

### 1. Start Backend
```bash
cd backend
mvn spring-boot:run
```

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Test Login
- URL: http://localhost:3000/auth/login
- Email: `admin@generalgivers.org`
- Password: `Admin@123`

### 4. Create Test Users (via Swagger)
- URL: http://localhost:8080/swagger-ui.html
- Login with admin credentials to get JWT token
- Use `/users POST` endpoint to create test users with different roles

---

## Implementation Roadmap

### Phase 1: Public Pages (4-6 hours)

#### About Page (`/app/about/page.tsx`)
Create a charity-style about page with:
- Mission and vision sections
- Team/leadership section
- Values and impact statistics
- Call to action

Example structure:
```tsx
'use client'

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary-600 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">About Us</h1>
          <p className="text-xl">Our Story and Mission</p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        {/* Grid layout with mission and vision cards */}
      </section>

      {/* Impact Stats */}
      <section className="bg-gray-50 py-16">
        {/* Statistics: projects completed, funds raised, children helped */}
      </section>

      {/* Team Section */}
      <section className="py-16">
        {/* Team member cards */}
      </section>
    </main>
  )
}
```

#### Projects Page (`/app/projects/page.tsx`)
Create with:
- Project grid/list layout
- Status filter (Active, Completed, All)
- Project cards showing:
  - Title, description, image
  - Progress bar (% funded)
  - Target amount vs raised amount
  - "Donate" button
- Click to go to project detail page

Use `projectService.getAll()` and `projectService.getActive()`

#### Project Detail Page (`/app/projects/[id]/page.tsx`)
- Full project information
- Large progress indicator
- Recent donations list
- Prominent donate button
- Share buttons

#### Donate Page (`/app/donate/page.tsx`)
- Donation form with:
  - Amount selector (preset amounts + custom)
  - Project selection dropdown (or general fund)
  - Donor information (name, email)
  - Payment method (for MVP, just collect info)
  - Submit to create donation

Use `donationService.create()`

#### Contact Page (`/app/contact/page.tsx`)
- Contact form
- Organization contact information
- Map (optional - can use static map image)
- Social media links

---

### Phase 2: Dashboard Foundation (6-8 hours)

#### Create Dashboard Layout (`/app/dashboard/layout.tsx`)
```tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import Sidebar from '@/components/dashboard/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/login')
    } else if (user?.mustChangePassword) {
      router.push('/auth/change-password')
    }
  }, [user, isAuthenticated, router])

  if (!user || user.mustChangePassword) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
```

#### Create Sidebar Component (`/components/dashboard/Sidebar.tsx`)
Role-based navigation:
```tsx
const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['ALL'] },
  { name: 'Users', href: '/dashboard/users', icon: Users, roles: ['SUPER_USER'] },
  { name: 'Projects', href: '/dashboard/projects', icon: FolderOpen, roles: ['SUPER_USER', 'CHAIRMAN', 'SECRETARY'] },
  { name: 'Donations', href: '/dashboard/donations', icon: DollarSign, roles: ['SUPER_USER', 'CHAIRMAN', 'TREASURER'] },
  { name: 'Visits', href: '/dashboard/visits', icon: MapPin, roles: ['SUPER_USER', 'CHAIRMAN', 'SECRETARY'] },
  { name: 'Children Homes', href: '/dashboard/children-homes', icon: Home, roles: ['SUPER_USER', 'CHAIRMAN', 'SECRETARY'] },
  { name: 'Reports', href: '/dashboard/reports', icon: BarChart3, roles: ['SUPER_USER', 'CHAIRMAN', 'TREASURER'] },
  { name: 'Profile', href: '/dashboard/profile', icon: User, roles: ['ALL'] },
]

// Filter based on user role
const allowedNavigation = navigation.filter(item =>
  item.roles.includes('ALL') || item.roles.includes(user.role)
)
```

#### Dashboard Home (`/app/dashboard/page.tsx`)
Statistics overview:
- Total projects
- Total donations
- Active users
- Recent activities
- Quick actions based on role
- Charts using Recharts

---

### Phase 3: User Management (3-4 hours)

#### Users List Page (`/app/dashboard/users/page.tsx`)
**Only for SUPER_USER**

Features:
- Table showing all users
- Columns: Name, Email, Role, Status, Actions
- "Create User" button
- Search/filter functionality
- Actions: Edit, Deactivate, Change Role

#### Create User Modal/Page
Form fields:
- Name (required)
- Email (required)
- Phone (optional)
- Role (dropdown with all roles)
- Temporary Password (required, min 8 chars)

Use `userService.create()`

#### Edit User Functionality
- Update user details
- Change role
- Deactivate/Activate

---

### Phase 4: Other Dashboard Modules (8-10 hours)

#### Projects Management (`/app/dashboard/projects/page.tsx`)
CRUD interface for projects:
- List view with status indicators
- Create/Edit forms
- Status management (Draft → Active → Completed)
- Progress tracking

#### Donations Management (`/app/dashboard/donations/page.tsx`)
- List all donations
- Filter by project, date range, status
- Export to CSV
- View donation details

#### Visits Management (`/app/dashboard/visits/page.tsx`)
- Record new visits
- List past visits
- Filter by date, children home
- View participants and photos

#### Children Homes Management (`/app/dashboard/children-homes/page.tsx`)
- CRUD for children homes
- Link to visits

#### Reports Dashboard (`/app/dashboard/reports/page.tsx`)
Generate and visualize reports:
- Monthly funds chart (Line chart)
- Project progress (Bar chart)
- User role distribution (Pie chart)
- Export functionality

---

## Component Library

Create reusable components:

### Table Component (`/components/ui/Table.tsx`)
Generic data table with:
- Sorting
- Pagination
- Search
- Column definitions
- Actions column

### Modal Component (`/components/ui/Modal.tsx`)
For forms and confirmations

### Form Components
- Input
- Select
- Textarea
- DatePicker
- FileUpload

### Card Component
For dashboard stats and content

### Button Component
With variants (primary, secondary, danger)

---

## Styling Guidelines

### Colors (Tailwind)
- Primary: `primary-*` (blue shades)
- Success: `green-*`
- Warning: `yellow-*`
- Danger: `red-*`
- Neutral: `gray-*`

### Layout Patterns
- Container: `container mx-auto px-4`
- Section padding: `py-16` or `py-12`
- Card: `bg-white rounded-lg shadow-md p-6`
- Input: `px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500`

### Responsive Design
- Mobile-first approach
- Use Tailwind breakpoints: `sm:`, `md:`, `lg:`, `xl:`
- Hide/show elements: `hidden md:block`

---

## Testing Checklist

### Authentication
- [ ] Login with default admin
- [ ] Force password change works
- [ ] Admin creates new user
- [ ] New user logs in with temporary password
- [ ] New user forced to change password
- [ ] Different roles see different navigation

### CRUD Operations
- [ ] Create, read, update, delete projects
- [ ] Create, read, update, delete users (Super User)
- [ ] Record visits
- [ ] Create donations (public and logged in)
- [ ] Manage children homes

### Reports
- [ ] Monthly funds report generates
- [ ] Project progress report shows data
- [ ] User role report displays correctly

### Responsive Design
- [ ] Mobile navigation works
- [ ] Tables responsive on mobile
- [ ] Forms usable on mobile
- [ ] Dashboard sidebar collapsible on mobile

---

## Deployment Considerations

### Environment Variables

**Backend**:
```
SPRING_DATASOURCE_URL=<production-db-url>
SPRING_DATASOURCE_USERNAME=<prod-user>
SPRING_DATASOURCE_PASSWORD=<secure-password>
JWT_SECRET=<256-bit-secret>
FRONTEND_URL=<production-frontend-url>
```

**Frontend**:
```
NEXT_PUBLIC_API_URL=<production-api-url>
```

### Security
- [ ] Change default admin password
- [ ] Use strong JWT secret
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable audit logging
- [ ] Regular backups

### Performance
- [ ] Database indexing
- [ ] API caching
- [ ] Image optimization
- [ ] Code splitting
- [ ] Lazy loading

---

## Support and Resources

- **Backend API Docs**: http://localhost:8080/swagger-ui.html
- **Setup Guide**: `SETUP.md`
- **Project Status**: `PROJECT_STATUS.md`
- **FSD**: `docs/FSD.md`

---

## Quick Reference

### Create User (Admin)
```typescript
const newUser = await userService.create({
  name: "John Doe",
  email: "john@example.com",
  temporaryPassword: "TempPass123",
  phone: "+1234567890",
  role: "MEMBER"
})
```

### Get Projects
```typescript
const projects = await projectService.getAll()
const activeProjects = await projectService.getActive()
```

### Create Donation
```typescript
const donation = await donationService.create({
  donorName: "Jane Smith",
  email: "jane@example.com",
  amount: 100,
  projectId: "project-uuid",
  method: "Credit Card"
})
```

---

## Next Steps

1. **Test what's built**: Login, change password, navigate
2. **Implement public pages**: Start with About, then Projects
3. **Build dashboard foundation**: Layout and sidebar
4. **Implement user management**: Create users from dashboard
5. **Add remaining modules**: Projects, Donations, Visits, Reports
6. **Polish and test**: Responsive design, error handling
7. **Deploy**: Set up production environment

**The heavy lifting is done. The backend is complete. Now it's just frontend UI implementation following the patterns already established!**
