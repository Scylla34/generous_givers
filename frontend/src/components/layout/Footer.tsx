'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, Mail, Phone, MapPin, AlertCircle, Facebook, Instagram } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { isEmailDeliveryError, getUserFriendlyErrorMessage } from '@/lib/utils'

// Custom X (Twitter) icon since lucide doesn't have the new X logo
const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

// Custom TikTok icon
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
)

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

  const socialLinks = [
    {
      name: 'Facebook',
      href: 'https://facebook.com/generousgiversfamily',
      icon: Facebook,
    },
    {
      name: 'X',
      href: 'https://x.com/generousgivers',
      icon: XIcon,
    },
    {
      name: 'TikTok',
      href: 'https://vm.tiktok.com/ZS91JEMnsUQem-Fu4J3/',
      icon: TikTokIcon,
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/generousgiversfamily?igsh=MTZieXBoMWV5NHM1aA==',
      icon: Instagram,
    },
  ]

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-8 sm:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="w-6 h-6 text-primary-500 fill-current" />
              <span className="text-lg font-bold text-white">
                Generous Givers
              </span>
            </div>
            <p className="text-sm mb-4">
              Inspiring positive action and help create an
              environment of love, respect, and cooperation in our society.
            </p>
            {/* Social Media Links */}
            <div className="flex items-center space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-800 rounded-full hover:bg-primary-600 transition-colors duration-200"
                  aria-label={social.name}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
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
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="break-all">info@generousgivers.org</span>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+254 (7) 123-4567</span>
              </li>
              <li className="flex items-start space-x-2 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
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

        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <p className="text-center sm:text-left">
            &copy; {new Date().getFullYear()} Generous Givers Family Foundation. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <Link href="/privacy" className="hover:text-primary-400 transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary-400 transition">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
