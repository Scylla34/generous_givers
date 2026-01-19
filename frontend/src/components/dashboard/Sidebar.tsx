'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  DollarSign,
  MapPin,
  Home,
  BarChart3,
  User,
  LogOut,
  Heart,
} from 'lucide-react'

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles: string[]
}

export default function Sidebar() {
  const pathname = usePathname()
  const { user, clearAuth } = useAuthStore()

  const navigation: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['ALL'] },
    { name: 'Users', href: '/dashboard/users', icon: Users, roles: ['SUPER_USER'] },
    {
      name: 'Projects',
      href: '/dashboard/projects',
      icon: FolderOpen,
      roles: ['SUPER_USER', 'CHAIRMAN', 'SECRETARY'],
    },
    {
      name: 'Donations',
      href: '/dashboard/donations',
      icon: DollarSign,
      roles: ['SUPER_USER', 'CHAIRMAN', 'TREASURER'],
    },
    {
      name: 'Visits',
      href: '/dashboard/visits',
      icon: MapPin,
      roles: ['SUPER_USER', 'CHAIRMAN', 'SECRETARY'],
    },
    {
      name: 'Children Homes',
      href: '/dashboard/children-homes',
      icon: Home,
      roles: ['SUPER_USER', 'CHAIRMAN', 'SECRETARY'],
    },
    {
      name: 'Reports',
      href: '/dashboard/reports',
      icon: BarChart3,
      roles: ['SUPER_USER', 'CHAIRMAN', 'TREASURER'],
    },
    { name: 'Profile', href: '/dashboard/profile', icon: User, roles: ['ALL'] },
  ]

  const allowedNavigation = navigation.filter((item) =>
    item.roles.includes('ALL') || (user && item.roles.includes(user.role))
  )

  const handleLogout = () => {
    clearAuth()
    window.location.href = '/auth/login'
  }

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <Heart className="w-8 h-8 text-primary-500 fill-current" />
          <span className="text-lg font-bold">General Givers</span>
        </Link>
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center">
            <span className="text-sm font-semibold">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-gray-400">{user?.role.replace('_', ' ')}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {allowedNavigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  )
}
