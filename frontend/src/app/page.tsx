'use client'

import Link from 'next/link'
import { ArrowRight, MapPin, Calendar } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { visitService } from '@/services/visitService'
import { formatDateSafe } from '@/lib/format'
import { useAuthStore } from '@/store/authStore'

export default function Home() {
  const { isAuthenticated } = useAuthStore()
  const isLoggedIn = isAuthenticated()

  const { data: visits } = useQuery({
    queryKey: ['recent-visits'],
    queryFn: async () => {
      const allVisits = await visitService.getAll()
      return allVisits.slice(0, 6)
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: isLoggedIn,
    retry: false,
  })

  return (
    <main className="min-h-screen">
      {/* Hero Section with Video Background */}
<section className="relative h-[90vh] flex items-center">
  {/* Background Video */}
  <video
    src="/videos/t.mp4"    
    autoPlay
    loop
    muted
    playsInline
    className="absolute inset-0 w-full h-full object-cover"
  />

  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-black/50"></div>

  {/* Content */}
  <div className="container relative z-10 mx-auto px-4">
    <div className="max-w-3xl text-white">
      <h1 className="text-5xl font-bold mb-6">
        Making a Difference Together
      </h1>
      <p className="text-xl mb-8 text-gray-200">
        Join General Givers Family Foundation in supporting children homes and
        communities. Every contribution creates lasting impact.
      </p>

      <div className="flex gap-4">
        <Link
          href="/donate"
          className="bg-white text-primary-700 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition flex items-center gap-2"
        >
          Donate Now
          <ArrowRight className="w-5 h-5" />
        </Link>

        <Link
          href="/projects"
          className="border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-700 transition"
        >
          View Projects
        </Link>
      </div>
    </div>
  </div>
</section>

      {/* <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">
              Making a Difference Together
            </h1>
            <p className="text-xl mb-8 text-primary-100">
              Join General Givers Family Foundation in supporting children homes and
              communities. Every contribution creates lasting impact.
            </p>
            <div className="flex gap-4">
              <Link
                href="/donate"
                className="bg-white text-primary-700 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition flex items-center gap-2"
              >
                Donate Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/projects"
                className="border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-700 transition"
              >
                View Projects
              </Link>
            </div>
          </div>
        </div>
      </section> */}

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-4 text-gray-900">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                To be a dynamic and caring organization that inspires positive action and helps create an
                environment of love, respect, and cooperation in our society.



              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4 text-gray-900">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed">
                To improve the quality of life of the marginalized sectors of society by influencing individuals,
                 groups and institutions into realizing their humanitarian concern; and by providing a venue for 
                 them to contribute their resources through relevant and responsive programs in aid of helping 
                 the less fortunate.

              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Visited Sites */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Recent Visits</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              See where we&apos;ve been making a difference in our community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visits && visits.length > 0 ? (
              visits.map((visit) => (
                <div key={visit.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                  {/* Image Gallery */}
                  {visit.photos && visit.photos.length > 0 ? (
                    <div className="relative h-48 bg-gray-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={visit.photos[0]}
                        alt={visit.childrenHomeName || visit.location || 'Visit'}
                        className="w-full h-full object-cover"
                      />
                      {visit.photos.length > 1 && (
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
                          +{visit.photos.length - 1} more
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                      <MapPin className="w-16 h-16 text-white opacity-50" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {visit.childrenHomeName || visit.location || 'Community Visit'}
                    </h3>

                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDateSafe(visit.visitDate)}</span>
                    </div>

                    {visit.location && visit.childrenHomeName && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <MapPin className="w-4 h-4" />
                        <span>{visit.location}</span>
                      </div>
                    )}

                    {visit.notes && (
                      <p className="text-sm text-gray-600 line-clamp-3">{visit.notes}</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No visits recorded yet</p>
              </div>
            )}
          </div>

          {visits && visits.length > 0 && (
            <div className="text-center mt-8">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold"
              >
                View All Visits
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Get Involved</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Whether through donations, volunteering, or spreading awareness,
            there are many ways to make a difference.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/donate"
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
            >
              Donate Now
            </Link>
            <Link
              href="/contact"
              className="border-2 border-primary-600 text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
