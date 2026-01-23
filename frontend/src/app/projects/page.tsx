'use client'

import { useQuery } from '@tanstack/react-query'
import { projectService } from '@/services/projectService'
import Link from 'next/link'
import { formatCurrency } from '@/lib/format'
import { HeroImageSlider } from '@/components/HeroImageSlider'

export default function ProjectsPage() {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['public-projects'],
    queryFn: projectService.getActive,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading projects...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Image Slider Header */}
      <HeroImageSlider 
        title="Our Projects"
        subtitle="Supporting children through meaningful initiatives"
      />
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects?.map((project, idx) => (
            <div
              key={project.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition animate-scale-in"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {project.title}
                </h3>
                <p className="text-gray-700 mb-4 line-clamp-3">
                  {project.description || 'No description available'}
                </p>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Raised: {formatCurrency(project.fundsRaised)}</span>
                    <span>Goal: {formatCurrency(project.targetAmount)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-primary-600 h-3 rounded-full transition-all"
                      style={{
                        width: `${Math.min(project.percentFunded, 100)}%`,
                      }}
                    />
                  </div>
                  <div className="text-center text-sm text-gray-600 mt-1">
                    {project.percentFunded.toFixed(1)}% funded
                  </div>
                </div>

                <Link
                  href={`/donate?project=${project.id}`}
                  className="block w-full bg-primary-600 text-white text-center px-4 py-2 rounded-lg hover:bg-primary-700 transition"
                >
                  Support This Project
                </Link>
              </div>
            </div>
          ))}
        </div>

        {(!projects || projects.length === 0) && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No active projects at the moment. Please check back later!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
