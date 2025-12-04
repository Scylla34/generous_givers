'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { projectService } from '@/services/projectService'
import { donationService } from '@/services/donationService'
import { DonationRequest } from '@/types'
import { useSearchParams } from 'next/navigation'

export default function DonatePage() {
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
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Donation Form</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.donorName}
                  onChange={(e) =>
                    setFormData({ ...formData, donorName: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Donation Amount (USD)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  step="0.01"
                  value={formData.amount || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      amount: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="100.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">General Fund</option>
                  {projects?.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.title}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  Choose a specific project or contribute to our general fund
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  value={formData.method}
                  onChange={(e) =>
                    setFormData({ ...formData, method: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="Credit Card">Credit Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={createMutation.isPending}
                className="w-full bg-primary-600 text-white px-6 py-4 rounded-lg hover:bg-primary-700 transition text-lg font-semibold disabled:opacity-50"
              >
                {createMutation.isPending ? 'Processing...' : 'Donate Now'}
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
