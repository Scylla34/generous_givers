'use client'

import { useQuery } from '@tanstack/react-query'
import { donationService } from '@/services/donationService'
import { Donation } from '@/types'
import { DataTable } from '@/components/ui/data-table'
import { format } from 'date-fns'

export default function DonationsPage() {
  const { data: donations, isLoading } = useQuery({
    queryKey: ['donations'],
    queryFn: donationService.getAll,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading donations...</div>
      </div>
    )
  }

  const totalAmount = donations?.reduce((sum, d) => sum + d.amount, 0) || 0

  const columns = [
    {
      header: 'Donor',
      accessor: (donation: Donation) => (
        <div>
          <div className="text-sm font-medium text-gray-900">
            {donation.donorName || 'Anonymous'}
          </div>
          <div className="text-sm text-gray-500">{donation.email}</div>
        </div>
      ),
    },
    {
      header: 'Amount',
      accessor: (donation: Donation) => (
        <span className="text-sm font-semibold text-gray-900">
          KSh {donation.amount.toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Project',
      accessor: (donation: Donation) => (
        <span className="text-sm text-gray-600">
          {donation.projectTitle || 'General Fund'}
        </span>
      ),
    },
    {
      header: 'Date',
      accessor: (donation: Donation) => (
        <span className="text-sm text-gray-600">
          {format(new Date(donation.date), 'MMM dd, yyyy')}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: (donation: Donation) => (
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            donation.status === 'COMPLETED'
              ? 'bg-green-100 text-green-800'
              : donation.status === 'PENDING'
              ? 'bg-yellow-100 text-yellow-800'
              : donation.status === 'FAILED'
              ? 'bg-red-100 text-red-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {donation.status}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Donations</h1>
        <p className="text-lg text-gray-600 mt-2">
          Total Donations: <span className="font-semibold text-blue-600">KSh {totalAmount.toLocaleString()}</span>
        </p>
      </div>

      <DataTable
        data={donations || []}
        columns={columns}
        searchPlaceholder="Search donations by donor name, email, or project..."
        itemsPerPage={15}
      />
    </div>
  )
}
