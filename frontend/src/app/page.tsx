'use client'

import Link from 'next/link'
import { ArrowRight, MapPin, Calendar, Users, Camera } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { visitService } from '@/services/visitService'
import { formatDateSafe } from '@/lib/format'
import { useAuthStore } from '@/store/authStore'
import Image from 'next/image'
import { useState, useEffect } from 'react'

function HomeHeroSlider() {
  const childrenImages = [1, 2, 3, 4, 5, 6, 7, 8];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % childrenImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [childrenImages.length]);

  return (
    <section className="relative h-[90vh] flex items-center">
      {/* Image slider background */}
      <div className="absolute inset-0">
        {childrenImages.map((num, idx) => (
          <div
            key={num}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{
              opacity: idx === currentIndex ? 1 : 0,
            }}
          >
            <Image
              src={`/children/${num}.jpg`}
              alt={`Hero image ${num}`}
              fill
              className="object-cover"
              priority={idx === 0}
            />
          </div>
        ))}
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4">
        <div className="max-w-3xl text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Empowering Vulnerable Children
          </h1>
          <p className="text-xl mb-8 text-gray-100 animate-slide-up" style={{ animationDelay: '100ms' }}>
            Generous Givers Family visits and supports children in need, providing hope,
            care, and opportunities for a better future.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <Link
              href="/donate"
              className="bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition flex items-center justify-center gap-2 hover:scale-105 hover:shadow-lg"
            >
              Donate Now
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/get-involved"
              className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition text-center hover:scale-105 hover:shadow-lg"
            >
              Get Involved
            </Link>
          </div>
        </div>
      </div>

      {/* Image indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {childrenImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentIndex
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to image ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

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
      {/* Hero Section with Image Slider */}
      <HomeHeroSlider />

      {/* Impact Stats */}
      <section className="py-16 relative overflow-hidden">
        <Image
          src="/children/7.jpg"
          alt="Impact background"
          fill
          className="object-cover -z-10"
        />
        <div className="absolute inset-0 bg-black/70 -z-10" />
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Impact
            </h2>
            <p className="text-gray-100 text-lg">
              Measurable change in the lives of children and families
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: '50+', label: 'Children&apos;s Homes Visited' },
              { number: '1,200+', label: 'Children Reached' },
              { number: '500+', label: 'Active Members' },
              { number: '10+', label: 'Years of Service' },
            ].map((stat, idx) => (
              <div
                key={stat.label}
                className={`text-center bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-lg hover:shadow-xl hover:bg-white/20 transition-all duration-300 border border-white/20 animate-slide-up`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-100 text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
                them to contribute their resources through relevant and responsive programs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Visited Sites */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Recent Visits</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              See where we&apos;ve been making a difference in our community through meaningful visits and connections
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visits && visits.length > 0 ? (
              visits.map((visit, idx) => (
                <div 
                  key={visit.id} 
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 animate-scale-in group border border-gray-100"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  {/* Image Gallery */}
                  {visit.photos && visit.photos.length > 0 ? (
                    <div className="relative h-48 bg-gray-200 overflow-hidden">
                      <Image
                        src={visit.photos[0]}
                        alt={visit.childrenHomeName || visit.location || 'Visit'}
                        width={400}
                        height={192}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {visit.photos.length > 1 && (
                        <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-xs font-medium">
                          +{visit.photos.length - 1} more
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center group-hover:from-primary-500 group-hover:to-primary-700 transition-all duration-300">
                      <MapPin className="w-16 h-16 text-white opacity-60" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                      {visit.childrenHomeName || visit.location || 'Community Visit'}
                    </h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-primary-500" />
                        <span>{formatDateSafe(visit.visitDate)}</span>
                      </div>

                      {visit.location && visit.childrenHomeName && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-primary-500" />
                          <span className="line-clamp-1">{visit.location}</span>
                        </div>
                      )}

                      {visit.createdByName && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="w-4 h-4 text-primary-500" />
                          <span>Recorded by {visit.createdByName}</span>
                        </div>
                      )}
                    </div>

                    {visit.notes && (
                      <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                        {visit.notes}
                      </p>
                    )}

                    {visit.photos && visit.photos.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Camera className="w-3 h-3" />
                          <span>{visit.photos.length} photo{visit.photos.length !== 1 ? 's' : ''} captured</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
                  <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No visits recorded yet</h3>
                  <p className="text-gray-500">Our team will start documenting visits to children&apos;s homes soon.</p>
                </div>
              </div>
            )}
          </div>

          {visits && visits.length > 0 && (
            <div className="text-center mt-10 animate-fade-in">
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                View All Visits & Gallery
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700 animate-gradient-shift">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4 animate-fade-in">Ready to Help?</h2>
          <p className="text-gray-100 mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '100ms' }}>
            Every donation, volunteer hour, and partnership makes a real difference in the lives of children in need.
          </p>
          <div className="flex justify-center gap-4 flex-col sm:flex-row animate-slide-up" style={{ animationDelay: '200ms' }}>
            <Link
              href="/donate"
              className="bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 hover:shadow-lg"
            >
              Donate Now
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/get-involved"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Get Involved
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
