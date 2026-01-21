'use client'

import Link from 'next/link'
import { Heart, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
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
            <form className="space-y-2" action="subscribe">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-sm focus:outline-none focus:border-primary-500"
              />
              <button
                type="submit"
                className="w-full bg-primary-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-primary-700 transition"
              >
                Subscribe
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
