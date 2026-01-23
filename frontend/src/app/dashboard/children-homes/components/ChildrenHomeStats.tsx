import { ChildrenHome } from '@/types'
import { Home, MapPin, Phone, FileText } from 'lucide-react'

interface ChildrenHomeStatsProps {
  homes: ChildrenHome[]
}

export function ChildrenHomeStats({ homes }: ChildrenHomeStatsProps) {
  const safeHomes = Array.isArray(homes) ? homes : [];
  
  const stats = {
    total: safeHomes.length,
    withLocation: safeHomes.filter(h => h.location && h.location.trim() !== '').length,
    withContact: safeHomes.filter(h => h.contact && h.contact.trim() !== '').length,
    withNotes: safeHomes.filter(h => h.notes && h.notes.trim() !== '').length,
  }

  const statCards = [
    {
      title: 'Total Homes',
      value: stats.total,
      icon: Home,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      title: 'With Location',
      value: stats.withLocation,
      icon: MapPin,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      title: 'With Contact',
      value: stats.withContact,
      icon: Phone,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
    },
    {
      title: 'With Notes',
      value: stats.withNotes,
      icon: FileText,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.title}
            className={`${stat.bgColor} rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
                {stat.title === 'Total Homes' && stats.total > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round((stats.withContact / stats.total) * 100)}% have contact info
                  </p>
                )}
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ChildrenHomeStats