'use client'

import { useState, Suspense } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { projectService } from '@/services/projectService'
import { donationService } from '@/services/donationService'
import { DonationRequest } from '@/types'
import { useSearchParams } from 'next/navigation'
// import { formatCurrency } from '@/lib/format'

function DonateForm() {
  const searchParams = useSearchParams()
  const projectId = searchParams.get('project')

  const [formData, setFormData] = useState<DonationRequest>({
    donorName: '',
    email: '',
    amount: 0,
    method: 'Credit Card',
    projectId: projectId || undefined,
  })

  const { data: projects } = useQuery({
    queryKey: ['active-projects'],
    queryFn: projectService.getActive,
  })

  const createMutation = useMutation({
    mutationFn: donationService.createPublic,
    onSuccess: () => {
      alert('Thank you for your donation!')
      setFormData({
        donorName: '',
        email: '',
        amount: 0,
        method: 'Credit Card',
        projectId: undefined,
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.amount <= 0) {
      alert('Please enter a valid donation amount')
      return
    }
    createMutation.mutate(formData)
  }

  return (
    <div className="min-h-screen">
      <div className="bg-primary-600 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Make a Donation</h1>
          <p className="text-xl">Your support changes lives</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Donation Form</h2>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-base font-semibold text-gray-800 mb-3">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.donorName}
                  onChange={(e) =>
                    setFormData({ ...formData, donorName: e.target.value })
                  }
                  className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-primary-200 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-base font-semibold text-gray-800 mb-3">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-primary-200 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-base font-semibold text-gray-800 mb-3">
                  Donation Amount (KSh) *
                </label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 transform -translate-y-1/2 text-xl font-bold text-gray-600">KSh</span>
                  <input
                    type="number"
                    required
                    min="1"
                    step="1"
                    value={formData.amount || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        amount: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full pl-16 pr-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-primary-200 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="5000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-base font-semibold text-gray-800 mb-3">
                  Project (Optional)
                </label>
                <select
                  value={formData.projectId || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      projectId: e.target.value || undefined,
                    })
                  }
                  className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-primary-200 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white appearance-none cursor-pointer"
                >
                  <option value="">General Fund</option>
                  {projects?.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.title}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-600 mt-2 ml-1">
                  💡 Choose a specific project or contribute to our general fund
                </p>
              </div>

              <div>
                <label className="block text-base font-semibold text-gray-800 mb-3">
                  Payment Method *
                </label>
                <select
                  value={formData.method}
                  onChange={(e) =>
                    setFormData({ ...formData, method: e.target.value })
                  }
                  className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-primary-200 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white appearance-none cursor-pointer"
                >
                  <option value="Credit Card">💳 Credit Card</option>
                  <option value="Bank Transfer">🏦 Bank Transfer</option>
                  <option value="PayPal">💰 PayPal</option>
                  <option value="Cash">💵 Cash</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={createMutation.isPending}
                className="w-full bg-primary-600 text-white px-8 py-5 rounded-xl hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 transition-all duration-200 text-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {createMutation.isPending ? '⏳ Processing...' : '❤️ Donate Now'}
              </button>
            </form>
          </div>

          <div className="mt-8 text-center text-gray-600">
            <p>
              Your donation is tax-deductible. You will receive a receipt via email.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DonatePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-gray-500">Loading...</div></div>}>
      <DonateForm />
    </Suspense>
  )
}
