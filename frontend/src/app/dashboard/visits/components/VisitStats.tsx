import { Visit } from '@/types'
import { MapPin, Calendar, Users, Camera } from 'lucide-react'

interface VisitStatsProps {
  visits: Visit[]
}

export function VisitStats({ visits }: VisitStatsProps) {
  const stats = {
    total: visits.length,
    thisMonth: visits.filter(v => {
      const visitDate = new Date(v.visitDate)
      const now = new Date()
      return visitDate.getMonth() === now.getMonth() && visitDate.getFullYear() === now.getFullYear()
    }).length,
    withPhotos: visits.filter(v => v.photos && v.photos.length > 0).length,
    uniqueHomes: new Set(visits.filter(v => v.childrenHomeId).map(v => v.childrenHomeId)).size,
  }

  const statCards = [
    {
      title: 'Total Visits',
      value: stats.total,
      icon: MapPin,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      title: 'This Month',
      value: stats.thisMonth,
      icon: Calendar,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      title: 'With Photos',
      value: stats.withPhotos,
      icon: Camera,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
    },
    {
      title: 'Unique Homes',
      value: stats.uniqueHomes,
      icon: Users,
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

export default VisitStats