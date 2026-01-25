'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { projectService } from '@/services/projectService'
import Link from 'next/link'
import { formatCurrency } from '@/lib/format'
import { HeroImageSlider } from '@/components/HeroImageSlider'
import {
  Heart,
  Target,
  TrendingUp,
  Eye,
  Search,
  ArrowRight
} from 'lucide-react'
import { ProjectStatus } from '@/types'
import { cn } from '@/lib/utils'
import { uploadService } from '@/services/uploadService'

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'ALL'>('ALL')
  const [selectedProject, setSelectedProject] = useState<string | null>(null)

  const { data: projects, isLoading } = useQuery({
    queryKey: ['public-projects'],
    queryFn: projectService.getAll, // Get all projects for public view
  })

  // Filter projects based on search and status
  const filteredProjects = projects?.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || project.status === statusFilter
    return matchesSearch && matchesStatus
  }) || []

  const statusOptions = [
    { value: 'ALL' as const, label: 'All Projects', color: 'bg-gray-600' },
    { value: 'ACTIVE' as const, label: 'Active', color: 'bg-green-600' },
    { value: 'COMPLETED' as const, label: 'Completed', color: 'bg-blue-600' },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <HeroImageSlider 
          title="Our Projects"
          subtitle="Supporting children through meaningful initiatives"
        />
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <HeroImageSlider 
        title="Our Projects"
        subtitle="Supporting children through meaningful initiatives that create lasting impact"
      />
      
      <div className="container mx-auto px-4 py-16">
        {/* Search and Filter Section */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search projects by title or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  />
                </div>
              </div>
              
              {/* Status Filter */}
              <div className="flex gap-2">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setStatusFilter(option.value)}
                    className={cn(
                      'px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                      statusFilter === option.value
                        ? `${option.color} text-white shadow-lg transform scale-105`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Results Count */}
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredProjects.length} of {projects?.length || 0} projects
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, idx) => (
            <div
              key={project.id}
              className={cn(
                "group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2",
                "animate-fade-in-up"
              )}
              style={{ animationDelay: `${idx * 150}ms` }}
              onMouseEnter={() => setSelectedProject(project.id)}
              onMouseLeave={() => setSelectedProject(null)}
            >
              {/* Project Image */}
              <div className="relative h-48 bg-gradient-to-br from-primary-400 to-primary-600 overflow-hidden">
                {project.poster ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={uploadService.getDownloadUrl(project.poster)}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Heart className="w-16 h-16 text-white/80" />
                    </div>
                  </>
                )}

                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-semibold",
                    project.status === 'ACTIVE' ? 'bg-green-500 text-white' :
                    project.status === 'COMPLETED' ? 'bg-blue-500 text-white' :
                    'bg-gray-500 text-white'
                  )}>
                    {project.status}
                  </span>
                </div>

                {/* Hover Overlay */}
                <div className={cn(
                  "absolute inset-0 bg-primary-600/90 flex items-center justify-center transition-opacity duration-300",
                  selectedProject === project.id ? "opacity-100" : "opacity-0"
                )}>
                  <div className="text-center text-white">
                    <Eye className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm font-medium">View Details</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Project Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                  {project.title}
                </h3>
                
                {/* Project Description */}
                <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                  {project.description || 'No description available'}
                </p>

                {/* Project Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Target className="w-4 h-4" />
                    <span>Goal: {formatCurrency(project.targetAmount)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <TrendingUp className="w-4 h-4" />
                    <span>{project.percentFunded.toFixed(1)}% funded</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span className="font-medium">Raised: {formatCurrency(project.fundsRaised)}</span>
                    <span>{project.percentFunded.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${Math.min(project.percentFunded, 100)}%`,
                        transform: selectedProject === project.id ? 'scaleX(1.02)' : 'scaleX(1)'
                      }}
                    />
                  </div>
                </div>

                {/* Action Button */}
                <Link
                  href={`/donate?project=${project.id}`}
                  className="group/btn flex items-center justify-center w-full bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                >
                  <Heart className="w-4 h-4 mr-2 group-hover/btn:animate-pulse" />
                  Support This Project
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No projects found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== 'ALL' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No active projects at the moment. Please check back later!'}
              </p>
              {(searchTerm || statusFilter !== 'ALL') && (
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setStatusFilter('ALL')
                  }}
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}
