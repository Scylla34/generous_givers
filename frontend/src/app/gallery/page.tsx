import Image from 'next/image'
import { Heart, Users } from 'lucide-react'

export default function GalleryPage(): React.ReactElement {
  const childrenImages = [1, 2, 3, 4, 5, 6, 7, 8]
  const coreValuesImages = [
    { name: 'Compassion', image: '/core values/Compassion.jpg' },
    { name: 'Teamwork', image: '/core values/Teamwork.jpg' },
    { name: 'Sustainability', image: '/core values/Sustainability.jpg' },
  ]
  const getInvolvedImages = [
    { name: 'Volunteer with Us', image: '/Ways to Get Involved/Volunteer with Us.jpg' },
    { name: 'Partnership Opportunities', image: '/Ways to Get Involved/Partnership Opportunities.jpg' },
    { name: 'Non-Cash Donations', image: '/Ways to Get Involved/Non-Cash Donations.jpg' },
  ]
  const whatWeDoImages = [
    { name: 'Direct Support', image: '/what we do/Direct Support.jpg' },
    { name: 'Education', image: '/what we do/Education.jpg' },
    { name: 'Healthcare', image: '/what we do/Healthcare.jpg' },
    { name: 'Community Development', image: '/what we do/Community Development.jpg' },
  ]
  const leadershipImages = [
    { name: 'Chairperson', image: '/leadership/chairperson.jpg' },
    { name: 'Vice Chairperson', image: '/leadership/vice_chair.jpg' },
    { name: 'Secretary General', image: '/leadership/sec_gen.jpg' },
    { name: 'Treasurer', image: '/leadership/treasuerer.jpg' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section with Image Background */}
      <section className="relative h-[300px] md:h-[400px] flex items-center justify-center text-white overflow-hidden">
        <Image
          src="/children/1.jpg"
          alt="Gallery Hero"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">Our Gallery</h1>
          <p className="text-xl animate-slide-up" style={{ animationDelay: '100ms' }}>See the impact we&apos;re making in the lives of children</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Children Gallery Section */}
        <section className="mb-20 animate-fade-in">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3 animate-slide-up">
              <Heart className="w-8 h-8 text-primary-600" />
              Children We Serve
            </h2>
            <p className="text-gray-600 text-lg animate-slide-up" style={{ animationDelay: '100ms' }}>
              Moments from our visits to children&apos;s homes across the region
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {childrenImages.map((num, idx) => (
              <div
                key={num}
                className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 aspect-square animate-scale-in"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <Image
                  src={`/children/${num}.jpg`}
                  alt={`Children moment ${num}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-end">
                  <div className="p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-sm font-semibold">Moment {num}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Core Values Section */}
        <section className="mb-20 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 animate-slide-up">Our Core Values</h2>
            <p className="text-gray-600 text-lg animate-slide-up" style={{ animationDelay: '100ms' }}>Principles that guide everything we do</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreValuesImages.map((item, idx) => (
              <div
                key={item.name}
                className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all animate-scale-in"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="relative h-64 w-full">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                  <div className="p-6 text-white w-full">
                    <h3 className="text-xl font-bold">{item.name}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What We Do Section */}
        <section className="mb-20 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 animate-slide-up">What We Do</h2>
            <p className="text-gray-600 text-lg animate-slide-up" style={{ animationDelay: '100ms' }}>Our key activities and programs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {whatWeDoImages.map((item, idx) => (
              <div
                key={item.name}
                className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all animate-scale-in"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="relative h-80 w-full">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                  <div className="p-6 text-white w-full">
                    <h3 className="text-2xl font-bold">{item.name}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Get Involved Section */}
        <section className="mb-20 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 animate-slide-up">Ways to Get Involved</h2>
            <p className="text-gray-600 text-lg animate-slide-up" style={{ animationDelay: '100ms' }}>Multiple opportunities to make a difference</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {getInvolvedImages.map((item, idx) => (
              <div
                key={item.name}
                className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all animate-scale-in"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="relative h-64 w-full">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                  <div className="p-6 text-white w-full">
                    <h3 className="text-xl font-bold">{item.name}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Leadership Section */}
        <section className="mb-20 animate-fade-in" style={{ animationDelay: '500ms' }}>
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3 animate-slide-up">
              <Users className="w-8 h-8 text-primary-600" />
              Our Leadership
            </h2>
            <p className="text-gray-600 text-lg animate-slide-up" style={{ animationDelay: '100ms' }}>The dedicated team guiding our mission</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {leadershipImages.map((item, idx) => (
              <div
                key={item.name}
                className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all animate-scale-in"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="relative h-72 w-full">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                  <div className="p-4 text-white w-full">
                    <h3 className="text-lg font-bold">{item.name}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Be Part of This Story</h2>
          <p className="text-lg mb-8 text-primary-100 max-w-2xl mx-auto">
            Every image represents a life touched, a child helped, and a community strengthened. Join us in creating more moments like these.
          </p>
          <div className="flex justify-center gap-4 flex-col sm:flex-row">
            <a
              href="/donate"
              className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition"
            >
              Donate Now
            </a>
            <a
              href="/get-involved"
              className="inline-block border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition"
            >
              Get Involved
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
