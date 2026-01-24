'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, Mail, Phone, MapPin, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { isEmailDeliveryError, getUserFriendlyErrorMessage } from '@/lib/utils'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    setLoading(true)
    try {
      await api.post('/newsletter/subscribe', null, {
        params: { email }
      })
      toast.success('Successfully subscribed to newsletter!')
      setEmail('')
    } catch (error) {
      const errorResponse = error as { response?: { data?: string } }
      const errorMessage = errorResponse?.response?.data || 'Failed to subscribe. Please try again.'
      const friendlyMessage = getUserFriendlyErrorMessage(errorMessage)
      
      if (isEmailDeliveryError(errorMessage)) {
        toast.error(
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="font-medium">Subscription failed</span>
            </div>
            <div className="text-sm">Please check your email address and try again.</div>
          </div>,
          { duration: 8000 }
        )
      } else {
        toast.error(friendlyMessage)
      }
    } finally {
      setLoading(false)
    }
  }
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="w-6 h-6 text-primary-500 fill-current" />
              <span className="text-lg font-bold text-white">
                Generous Givers
              </span>
            </div>
            <p className="text-sm">
              Inspiring positive action and help create an
                environment of love, respect, and cooperation in our society.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm hover:text-primary-400 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-sm hover:text-primary-400 transition">
                  Our Projects
                </Link>
              </li>
              <li>
                <Link href="/donate" className="text-sm hover:text-primary-400 transition">
                  Donate
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:text-primary-400 transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-sm">
                <Mail className="w-4 h-4" />
                <span>info@Generousgivers.org</span>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <Phone className="w-4 h-4" />
                <span>+254 (7) 123-4567</span>
              </li>
              <li className="flex items-start space-x-2 text-sm">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>Nairobi City, Kenya</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-4">Stay Updated</h3>
            <p className="text-sm mb-4">
              Get updates on our latest projects and impact.
            </p>
            <form className="space-y-2" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-sm focus:outline-none focus:border-primary-500 text-white"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-primary-700 transition disabled:opacity-50"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 pt-6 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} Generous Givers Family Foundation.
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
