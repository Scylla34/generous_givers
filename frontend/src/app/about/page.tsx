import { Heart, BookOpen, Stethoscope, Users, Target } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { HeroImageSlider } from '@/components/HeroImageSlider'

export default function AboutPage(): React.ReactElement {
  return (
    <div className="min-h-screen">
      {/* Image Slider Header */}
      <HeroImageSlider 
        title="About Us"
        subtitle="Empowering vulnerable children through love, care, and community service"
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Mission */}
          <section className="mb-16 animate-fade-in">
            <div className="flex gap-4 mb-4">
              <Heart className="w-8 h-8 text-primary-600 flex-shrink-0" />
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-slide-up">Our Mission</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  To be a dynamic and caring organization that inspires positive action and
                  helps create an environment of love, respect, and cooperation in our society.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  We believe that every child deserves access to basic necessities, quality
                  education, emotional support, and opportunities to reach their full potential.
                </p>
              </div>
            </div>
          </section>

          {/* Vision */}
          <section className="mb-16 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="flex gap-4 mb-4">
              <Target className="w-8 h-8 text-primary-600 flex-shrink-0" />
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-slide-up">Our Vision</h2>
                <p className="text-gray-700 leading-relaxed">
                  A world where every child has the opportunity to grow up in a safe, nurturing
                  environment with access to education, healthcare, dignity, and the resources
                  they need to build a brighter future and reach their full potential.
                </p>
              </div>
            </div>
          </section>

          {/* Core Values */}
          <section className="mb-16 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center animate-slide-up">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Compassion',
                  image: '/core values/Compassion.jpg',
                  description: 'We care deeply for the wellbeing of vulnerable children and communities.',
                },
                {
                  title: 'Integrity',
                  image: '/core values/Teamwork.jpg',
                  description: 'We operate transparently and hold ourselves accountable to high ethical standards.',
                },
                {
                  title: 'Sustainability',
                  image: '/core values/Sustainability.jpg',
                  description: 'We build long-term solutions that create lasting, measurable impact.',
                },
              ].map((value, idx) => (
                <div
                  key={value.title}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition border border-gray-100 group animate-scale-in"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="relative h-40 w-full overflow-hidden">
                    <Image
                      src={value.image}
                      alt={value.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h3>
                    <p className="text-gray-700">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* History */}
          <section className="mb-16 bg-gray-50 rounded-lg p-8 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 animate-slide-up">Our Story</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p className="animate-slide-up" style={{ animationDelay: '400ms' }}>
                Generous Givers Family was founded with a simple but powerful vision: to make
                a meaningful difference in the lives of children in need. What started as a
                small group of passionate individuals has grown into a thriving organization
                with hundreds of dedicated members.
              </p>
              <p className="animate-slide-up" style={{ animationDelay: '500ms' }}>
                Over the past decade, we have visited over 50 children&apos;s homes, reached more
                than 1,200 children, and provided direct support in the form of food, clothing,
                educational materials, and emotional care. Our work has expanded to include
                healthcare initiatives, scholarship programs, and community development projects.
              </p>
              <p className="animate-slide-up" style={{ animationDelay: '600ms' }}>
                Today, we remain committed to our mission of serving the most vulnerable members
                of our society. Every visit, every donation, and every volunteer hour represents
                our collective commitment to creating a more compassionate world.
              </p>
            </div>
          </section>

          {/* What We Do */}
          <section className="mb-16 animate-fade-in" style={{ animationDelay: '400ms' }}>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center animate-slide-up">What We Do</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: Heart,
                  title: 'Direct Support',
                  image: '/what we do/Direct Support.jpg',
                  description:
                    'Regular visits and donations to children\'s homes, providing essential supplies, food, clothing, and emotional care.',
                },
                {
                  icon: BookOpen,
                  title: 'Education',
                  image: '/what we do/Education.jpg',
                  description:
                    'Scholarships, school supplies, and educational programs to ensure children have access to quality learning opportunities.',
                },
                {
                  icon: Stethoscope,
                  title: 'Healthcare',
                  image: '/what we do/Healthcare.jpg',
                  description:
                    'Medical support, health screening, and nutrition programs to ensure children receive proper care and wellbeing.',
                },
                {
                  icon: Users,
                  title: 'Community Development',
                  image: '/what we do/Community Development.jpg',
                  description:
                    'Building sustainable programs that empower communities and caregivers to support vulnerable children long-term.',
                },
              ].map((item, idx) => {
                const IconComponent = item.icon
                return (
                  <div
                    key={item.title}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition border border-gray-100 group animate-slide-up"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex gap-3 mb-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <IconComponent className="w-5 h-5 text-primary-600" />
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-700 text-sm">{item.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Leadership */}
          <section className="mb-16 animate-fade-in" style={{ animationDelay: '500ms' }}>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center animate-slide-up">Our Leadership</h2>
            <div className="bg-primary-50 rounded-lg p-8 border border-primary-100 mb-12 animate-scale-in">
              <p className="text-gray-700 text-center max-w-3xl mx-auto">
                Generous Givers Family is led by a dedicated team of volunteers and professionals
                committed to our mission. Our leadership structure ensures accountability, transparency,
                and effective governance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { name: 'Chairperson', image: '/leadership/chairperson.jpg', description: 'Provides overall leadership and strategic direction' },
                { name: 'Vice Chairperson', image: '/leadership/vice_chair.jpg', description: 'Supports the Chairperson and assumes leadership duties' },
                { name: 'Secretary General', image: '/leadership/sec_gen.jpg', description: 'Maintains records, coordinates communications' },
                { name: 'Treasurer', image: '/leadership/treasuerer.jpg', description: 'Manages finances and maintains donor confidence' },
              ].map((member, idx) => (
                <div
                  key={member.name}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all group animate-slide-up"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="relative h-64 w-full overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{member.name}</h3>
                    <p className="text-gray-600 text-sm">{member.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Our Mission</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Whether through donations, volunteering, or spreading awareness, your support
              helps us create lasting change in the lives of children in need.
            </p>

            <div className="flex justify-center gap-4 flex-col sm:flex-row">
              <Link
                href="/donate"
                className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
              >
                Donate Now
              </Link>
              <Link
                href="/get-involved"
                className="border-2 border-primary-600 text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition"
              >
                Get Involved
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
