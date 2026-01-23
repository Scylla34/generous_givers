import { BarChart3, TrendingUp, CheckCircle, Pause } from 'lucide-react'
import { Project } from '@/types'

interface ProjectStatsProps {
  projects: Project[]
}

export function ProjectStats({ projects }: ProjectStatsProps) {
  // Ensure projects is always an array
  const projectsArray = Array.isArray(projects) ? projects : []
  
  const stats = {
    total: projectsArray.length,
    active: projectsArray.filter(p => p.status === 'ACTIVE').length,
    completed: projectsArray.filter(p => p.status === 'COMPLETED').length,
    onHold: projectsArray.filter(p => p.status === 'ON_HOLD').length,
    planning: projectsArray.filter(p => p.status === 'PLANNING').length,
  }

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

  const statCards = [
    {
      title: 'Total Projects',
      value: stats.total,
      icon: BarChart3,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      title: 'Active Projects',
      value: stats.active,
      icon: TrendingUp,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: CheckCircle,
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
    },
    {
      title: 'On Hold',
      value: stats.onHold,
      icon: Pause,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
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
                {stat.title === 'Completed' && stats.total > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    {completionRate}% completion rate
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

export default ProjectStats