import { Heart, Handshake, Gift, Phone, Mail } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { HeroImageSlider } from '@/components/HeroImageSlider'

export default function GetInvolvedPage(): React.ReactElement {
  const opportunities = [
    {
      icon: Heart,
      title: 'Volunteer with Us',
      image: '/Ways to Get Involved/Volunteer with Us.jpg',
      description:
        'Join our team of dedicated volunteers visiting children\'s homes, organizing activities, and providing direct support to those in need.',
      action: 'Learn More',
    },
    {
      icon: Handshake,
      title: 'Partnership Opportunities',
      image: '/Ways to Get Involved/Partnership Opportunities.jpg',
      description:
        'Businesses, organizations, and institutions can partner with us to scale our impact and reach more children\'s homes.',
      action: 'Explore Partnerships',
    },
    {
      icon: Gift,
      title: 'Non-Cash Donations',
      image: '/Ways to Get Involved/Non-Cash Donations.jpg',
      description:
        'Donate supplies, materials, or services. We accept school supplies, clothing, medical items, and household goods for the children.',
      action: 'What We Need',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Image Slider Hero Section */}
      <HeroImageSlider 
        title="Get Involved"
        subtitle="Be part of something meaningful. Make a difference in a child's life."
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Ways to Get Involved */}
        <section className="mb-20 animate-fade-in">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-slide-up">
              Ways to Get Involved
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '100ms' }}>
              There are many ways to support our mission. Choose the one that fits
              your passion and availability.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {opportunities.map((opportunity, idx) => {
              const Icon = opportunity.icon
              return (
                <div
                  key={opportunity.title}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-100 group flex flex-col animate-scale-in"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={opportunity.image}
                      alt={opportunity.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="mb-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary-600" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {opportunity.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 flex-1">
                      {opportunity.description}
                    </p>
                    <button className="text-primary-600 font-semibold hover:text-primary-700 transition flex items-center gap-2 text-sm">
                      {opportunity.action}
                      <span>→</span>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Volunteer Details */}
        <section className="mb-20 bg-gray-50 rounded-lg p-8 md:p-12 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 animate-slide-up">
              Volunteer Opportunities
            </h2>
            <div className="space-y-4 text-gray-700">
              <p className="animate-slide-up" style={{ animationDelay: '100ms' }}>
                Our volunteers are the heart of our organization. Whether you have a few
                hours a month or can commit to regular visits, we have opportunities for you:
              </p>
              <ul className="space-y-3 ml-6">
                <li className="flex gap-3 animate-slide-up" style={{ animationDelay: '200ms' }}>
                  <span className="text-primary-600 font-bold">•</span>
                  <span>
                    <strong>Home Visitors:</strong> Visit children&apos;s homes to provide
                    emotional support, facilitate activities, and assess needs.
                  </span>
                </li>
                <li className="flex gap-3 animate-slide-up" style={{ animationDelay: '300ms' }}>
                  <span className="text-primary-600 font-bold">•</span>
                  <span>
                    <strong>Activity Coordinators:</strong> Organize games, educational
                    sessions, and recreational activities for children.
                  </span>
                </li>
                <li className="flex gap-3 animate-slide-up" style={{ animationDelay: '400ms' }}>
                  <span className="text-primary-600 font-bold">•</span>
                  <span>
                    <strong>Mentors:</strong> Provide long-term mentorship and guidance
                    to individual children.
                  </span>
                </li>
                <li className="flex gap-3 animate-slide-up" style={{ animationDelay: '500ms' }}>
                  <span className="text-primary-600 font-bold">•</span>
                  <span>
                    <strong>Professional Services:</strong> Contribute your skills in
                    healthcare, education, counseling, or administration.
                  </span>
                </li>
                <li className="flex gap-3 animate-slide-up" style={{ animationDelay: '600ms' }}>
                  <span className="text-primary-600 font-bold">•</span>
                  <span>
                    <strong>Event Support:</strong> Help organize and run fundraising and
                    awareness events.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Partnership Section */}
        <section className="mb-20 bg-blue-50 rounded-lg p-8 md:p-12 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 animate-slide-up">
              Partnership Opportunities
            </h2>
            <div className="space-y-4 text-gray-700">
              <p className="animate-slide-up" style={{ animationDelay: '100ms' }}>
                We welcome partnerships with businesses, NGOs, educational institutions,
                and community groups to expand our impact:
              </p>
              <ul className="space-y-3 ml-6">
                <li className="flex gap-3 animate-slide-up" style={{ animationDelay: '200ms' }}>
                  <span className="text-primary-600 font-bold">•</span>
                  <span>
                    <strong>Corporate Partnerships:</strong> Sponsorships, employee
                    volunteer programs, and CSR initiatives.
                  </span>
                </li>
                <li className="flex gap-3 animate-slide-up" style={{ animationDelay: '300ms' }}>
                  <span className="text-primary-600 font-bold">•</span>
                  <span>
                    <strong>Educational Partnerships:</strong> Schools and universities
                    can engage students in community service.
                  </span>
                </li>
                <li className="flex gap-3 animate-slide-up" style={{ animationDelay: '400ms' }}>
                  <span className="text-primary-600 font-bold">•</span>
                  <span>
                    <strong>Healthcare Partnerships:</strong> Medical facilities can
                    provide healthcare services to the children.
                  </span>
                </li>
                <li className="flex gap-3 animate-slide-up" style={{ animationDelay: '500ms' }}>
                  <span className="text-primary-600 font-bold">•</span>
                  <span>
                    <strong>Retail Partnerships:</strong> Stores and shops can donate
                    surplus goods or offer discounts for our beneficiaries.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Non-Cash Donations */}
        <section className="mb-20 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center animate-slide-up">
            What We Need (Non-Cash Donations)
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { category: 'School Supplies', items: 'Books, notebooks, pens, uniforms, backpacks' },
              { category: 'Clothing', items: 'Seasonal wear, shoes, undergarments' },
              { category: 'Medical Items', items: 'First aid supplies, toiletries, medications' },
              { category: 'Household Goods', items: 'Bedding, utensils, cleaning supplies' },
              { category: 'Furniture', items: 'Chairs, tables, storage units' },
              { category: 'Electronics', items: 'Learning tablets, educational software' },
            ].map((item, idx) => (
              <div
                key={item.category}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:border-primary-600 transition animate-scale-in"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <h3 className="font-bold text-gray-900 mb-2">{item.category}</h3>
                <p className="text-sm text-gray-600">{item.items}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-6">
            <p className="text-gray-700">
              All donated items must be in good condition. We will verify, categorize, and
              distribute items based on the needs of the children&apos;s homes we serve.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg p-8 md:p-12">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
            <p className="text-lg mb-8 text-primary-100">
              We&apos;d love to hear from you! Whether you want to volunteer, establish a
              partnership, or donate items, please reach out to us today.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span className="text-lg">+254 (0) XXX XXX XXX</span>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span className="text-lg">info@generousgiversfamily.org</span>
              </div>
            </div>
            <div className="mt-8">
              <Link
                href="/contact"
                className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition"
              >
                Contact Us →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
