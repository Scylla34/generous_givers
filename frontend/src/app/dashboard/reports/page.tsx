'use client'

import { useQuery } from '@tanstack/react-query'
import { reportService } from '@/services/reportService'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function ReportsPage() {
  const currentYear = new Date().getFullYear()

  const { data: monthlyFunds } = useQuery({
    queryKey: ['monthly-funds', currentYear],
    queryFn: () => reportService.getMonthlyFunds(currentYear),
  })

  const { data: projectProgress } = useQuery({
    queryKey: ['project-progress'],
    queryFn: reportService.getProjectProgress,
  })

  const { data: userRoles } = useQuery({
    queryKey: ['user-roles'],
    queryFn: reportService.getUserRoles,
  })

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const monthlyData = monthlyFunds?.map(item => ({
    name: monthNames[item.month - 1],
    amount: item.totalAmount,
  })) || []

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Reports & Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Monthly Donations ({currentYear})
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">User Roles Distribution</h2>
          <div className="space-y-4">
            {userRoles?.map((role) => (
              <div key={role.role} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{role.role}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    Active: {role.activeCount} | Inactive: {role.inactiveCount}
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    Total: {role.totalCount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Project Progress</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Target
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Raised
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Donations
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {projectProgress?.map((project) => (
                <tr key={project.projectId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {project.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        project.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-800'
                          : project.status === 'COMPLETED'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${project.targetAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${project.fundsRaised.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{
                            width: `${Math.min(project.percentFunded, 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 min-w-[50px]">
                        {project.percentFunded.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {project.donationCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
