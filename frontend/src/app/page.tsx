import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
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
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-4 text-gray-900">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                To provide comprehensive support to children homes and communities
                through sustainable projects, educational initiatives, and
                humanitarian aid. We believe every child deserves a chance to thrive.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4 text-gray-900">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed">
                A world where every child has access to basic necessities, quality
                education, and opportunities for growth. Through collective action,
                we aim to create lasting positive change in communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Get Involved</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Whether through donations, volunteering, or spreading awareness,
            there are many ways to make a difference.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/auth/signup"
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
            >
              Join Us
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
