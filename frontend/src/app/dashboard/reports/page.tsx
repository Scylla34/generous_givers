'use client'

import { useQuery } from '@tanstack/react-query'
import { reportService } from '@/services/reportService'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { FileSpreadsheet, FileText } from 'lucide-react'
import { formatCurrency, formatDateSafe } from '@/lib/format'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { toast } from 'sonner'

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

  const { data: usersReport } = useQuery({
    queryKey: ['users-report'],
    queryFn: reportService.getUsersReport,
  })

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const monthlyData = monthlyFunds?.map(item => ({
    name: monthNames[item.month - 1],
    amount: item.totalAmount,
  })) || []

  const exportProjectsToExcel = () => {
    try {
      if (!projectProgress || projectProgress.length === 0) {
        toast.error('No project data to export')
        return
      }

      const data = projectProgress.map(project => ({
        'Project': project.title,
        'Status': project.status,
        'Target Amount (KSh)': project.targetAmount,
        'Funds Raised (KSh)': project.fundsRaised,
        'Progress (%)': project.percentFunded.toFixed(2),
        'Donations': project.donationCount,
      }))

      const ws = XLSX.utils.json_to_sheet(data)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Projects Report')

      // Auto-size columns
      const maxWidth = data.reduce((w, r) => Math.max(w, r['Project'].length), 10)
      ws['!cols'] = [
        { wch: maxWidth },
        { wch: 12 },
        { wch: 20 },
        { wch: 20 },
        { wch: 15 },
        { wch: 12 },
      ]

      XLSX.writeFile(wb, `projects-report-${new Date().toISOString().split('T')[0]}.xlsx`)
      toast.success('Excel file downloaded successfully!')
    } catch (error) {
      console.error('Excel export error:', error)
      toast.error('Failed to export to Excel')
    }
  }

  const exportProjectsToPDF = () => {
    try {
      if (!projectProgress || projectProgress.length === 0) {
        toast.error('No project data to export')
        return
      }

      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()

      // Add organization header
      doc.setFontSize(16)
      doc.setTextColor(37, 99, 235) // primary-600
      doc.text('Generous Givers Family Foundation', pageWidth / 2, 15, { align: 'center' })
      
      doc.setFontSize(14)
      doc.setTextColor(40, 40, 40)
      doc.text('Projects Progress Report', pageWidth / 2, 23, { align: 'center' })

      // Add horizontal line
      doc.setDrawColor(37, 99, 235)
      doc.line(14, 25, pageWidth - 14, 25)

      // Add date
      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.text(`Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 14, 32)

      // Prepare table data
      const tableData = projectProgress.map(project => [
        project.title,
        project.status,
        formatCurrency(project.targetAmount),
        formatCurrency(project.fundsRaised),
        `${project.percentFunded.toFixed(1)}%`,
        project.donationCount.toString(),
      ])

      autoTable(doc, {
        head: [['Project', 'Status', 'Target', 'Raised', 'Progress', 'Donations']],
        body: tableData,
        startY: 40,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], fontStyle: 'bold' },
      })

      doc.save(`projects-report-${new Date().toISOString().split('T')[0]}.pdf`)
      toast.success('PDF file downloaded successfully!')
    } catch (error) {
      console.error('PDF export error:', error)
      toast.error('Failed to export to PDF')
    }
  }

  const exportDonationsToExcel = () => {
    try {
      if (!monthlyFunds || monthlyFunds.length === 0) {
        toast.error('No donation data to export')
        return
      }

      const data = monthlyFunds.map(item => ({
        'Month': monthNames[item.month - 1],
        'Year': item.year,
        'Total Amount (KSh)': item.totalAmount,
        'Number of Donations': item.donationCount,
      }))

      const ws = XLSX.utils.json_to_sheet(data)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Monthly Donations')

      ws['!cols'] = [{ wch: 12 }, { wch: 8 }, { wch: 20 }, { wch: 20 }]

      XLSX.writeFile(wb, `donations-report-${currentYear}.xlsx`)
      toast.success('Excel file downloaded successfully!')
    } catch (error) {
      console.error('Excel export error:', error)
      toast.error('Failed to export to Excel')
    }
  }

  const exportDonationsToPDF = () => {
    try {
      if (!monthlyFunds || monthlyFunds.length === 0) {
        toast.error('No donation data to export')
        return
      }

      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()

      // Add organization header
      doc.setFontSize(16)
      doc.setTextColor(37, 99, 235) // primary-600
      doc.text('Generous Givers Family Foundation', pageWidth / 2, 15, { align: 'center' })
      
      doc.setFontSize(14)
      doc.setTextColor(40, 40, 40)
      doc.text(`Monthly Donations Report ${currentYear}`, pageWidth / 2, 23, { align: 'center' })

      // Add horizontal line
      doc.setDrawColor(37, 99, 235)
      doc.line(14, 25, pageWidth - 14, 25)

      // Add date
      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.text(`Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 14, 32)

      const tableData = monthlyFunds.map(item => [
        monthNames[item.month - 1],
        item.year.toString(),
        formatCurrency(item.totalAmount),
        item.donationCount.toString(),
      ])

      // Calculate total
      const totalAmount = monthlyFunds.reduce((sum, item) => sum + item.totalAmount, 0)
      const totalCount = monthlyFunds.reduce((sum, item) => sum + item.donationCount, 0)

      autoTable(doc, {
        head: [['Month', 'Year', 'Total Amount', 'Donations']],
        body: tableData,
        foot: [['Total', '', formatCurrency(totalAmount), totalCount.toString()]],
        startY: 40,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], fontStyle: 'bold' },
        footStyles: { fillColor: [243, 244, 246], textColor: [0, 0, 0], fontStyle: 'bold' },
      })

      doc.save(`donations-report-${currentYear}.pdf`)
      toast.success('PDF file downloaded successfully!')
    } catch (error) {
      console.error('PDF export error:', error)
      toast.error('Failed to export to PDF')
    }
  }

  const exportUsersToCSV = () => {
    try {
      if (!usersReport || usersReport.length === 0) {
        toast.error('No user data to export')
        return
      }

      const data = usersReport.map(user => ({
        'ID': user.id,
        'Name': user.name,
        'Email': user.email,
        'Phone': user.phone || '-',
        'Role': user.role,
        'Status': user.isActive ? 'Active' : 'Inactive',
        'Created Date': formatDateSafe(user.createdAt),
      }))

      const ws = XLSX.utils.json_to_sheet(data)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Users Report')

      ws['!cols'] = [
        { wch: 36 },
        { wch: 25 },
        { wch: 30 },
        { wch: 15 },
        { wch: 18 },
        { wch: 12 },
        { wch: 15 },
      ]

      XLSX.writeFile(wb, `users-report-${new Date().toISOString().split('T')[0]}.xlsx`)
      toast.success('CSV file downloaded successfully!')
    } catch (error) {
      console.error('CSV export error:', error)
      toast.error('Failed to export to CSV')
    }
  }

  const exportUsersToPDF = () => {
    try {
      if (!usersReport || usersReport.length === 0) {
        toast.error('No user data to export')
        return
      }

      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()

      // Add organization header
      doc.setFontSize(16)
      doc.setTextColor(37, 99, 235) // primary-600
      doc.text('Generous Givers Family Foundation', pageWidth / 2, 15, { align: 'center' })
      
      doc.setFontSize(14)
      doc.setTextColor(40, 40, 40)
      doc.text('Users Report', pageWidth / 2, 23, { align: 'center' })

      // Add horizontal line
      doc.setDrawColor(37, 99, 235)
      doc.line(14, 25, pageWidth - 14, 25)

      // Add date
      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.text(`Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 14, 32)
      doc.text(`Total Users: ${usersReport.length}`, 14, 38)

      const tableData = usersReport.map(user => [
        user.name,
        user.email,
        user.phone || '-',
        user.role,
        user.isActive ? 'Active' : 'Inactive',
        formatDateSafe(user.createdAt),
      ])

      autoTable(doc, {
        head: [['Name', 'Email', 'Phone', 'Role', 'Status', 'Created Date']],
        body: tableData,
        startY: 45,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], fontStyle: 'bold' },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 35 },
          2: { cellWidth: 25 },
          3: { cellWidth: 25 },
          4: { cellWidth: 15 },
          5: { cellWidth: 25 },
        },
      })

      doc.save(`users-report-${new Date().toISOString().split('T')[0]}.pdf`)
      toast.success('PDF file downloaded successfully!')
    } catch (error) {
      console.error('PDF export error:', error)
      toast.error('Failed to export to PDF')
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-8 border border-primary-200">
        <h1 className="text-4xl font-bold text-primary-900 mb-2">Reports & Analytics</h1>
        <p className="text-primary-700 text-lg">Export and analyze foundation data with detailed insights</p>
      </div>

      {/* Projects Report */}
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Project Progress Report</h2>
            <p className="text-gray-600 mt-1 text-sm">Track the status and progress of all projects</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={exportProjectsToExcel}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium shadow-md hover:shadow-lg"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Excel
            </button>
            <button
              onClick={exportProjectsToPDF}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm font-medium shadow-md hover:shadow-lg"
            >
              <FileText className="w-4 h-4" />
              PDF
            </button>
          </div>
        </div>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className="bg-primary-50 border-b-2 border-primary-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-primary-900 uppercase tracking-wider">Project</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-primary-900 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-primary-900 uppercase tracking-wider">Target</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-primary-900 uppercase tracking-wider">Raised</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-primary-900 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-primary-900 uppercase tracking-wider">Donations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {projectProgress?.map((project) => (
                <tr key={project.projectId} className="hover:bg-primary-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{project.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      project.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      project.status === 'COMPLETED' ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">{formatCurrency(project.targetAmount)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">{formatCurrency(project.fundsRaised)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 w-24">
                        <div className="bg-primary-600 h-2 rounded-full transition-all" style={{ width: `${Math.min(project.percentFunded, 100)}%` }} />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 w-12 text-right">{project.percentFunded.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{project.donationCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Donations Chart & Export */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Monthly Donations ({currentYear})</h2>
              <p className="text-gray-600 mt-1 text-sm">Donation trends by month</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={exportDonationsToExcel}
                className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md hover:shadow-lg font-medium"
                title="Export to Excel"
              >
                <FileSpreadsheet className="w-4 h-4" />
              </button>
              <button
                onClick={exportDonationsToPDF}
                className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition shadow-md hover:shadow-lg font-medium"
                title="Export to PDF"
              >
                <FileText className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            {!monthlyFunds ? (
              <div className="flex items-center justify-center h-[300px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : monthlyData.length === 0 ? (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-gray-500">No donation data available for {currentYear}</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Bar dataKey="amount" fill="#2563eb" name="Donations (KSh)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">User Roles Distribution</h2>
            <p className="text-gray-600 text-sm mb-6">Active and inactive users by role</p>
          </div>
          <div className="space-y-4">
            {!userRoles ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : userRoles.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No user role data available</p>
              </div>
            ) : (
              userRoles.map((role) => (
                <div key={role.role} className="border-l-4 border-primary-600 bg-primary-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-primary-900 uppercase tracking-wider">{role.role}</span>
                    <span className="text-lg font-bold text-primary-600">{role.totalCount}</span>
                  </div>
                  <div className="mt-2 flex gap-4 text-xs text-gray-600">
                    <span className="flex items-center gap-1">✓ <span className="font-semibold text-green-600">{role.activeCount}</span> Active</span>
                    <span className="flex items-center gap-1">✕ <span className="font-semibold text-red-600">{role.inactiveCount}</span> Inactive</span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-600">Active: {((role.activeCount / role.totalCount) * 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(role.activeCount / role.totalCount) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Users Report */}
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Users Report</h2>
            <p className="text-gray-600 mt-1 text-sm">Complete directory of all users in the system</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={exportUsersToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium shadow-md hover:shadow-lg"
            >
              <FileSpreadsheet className="w-4 h-4" />
              CSV
            </button>
            <button
              onClick={exportUsersToPDF}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm font-medium shadow-md hover:shadow-lg"
            >
              <FileText className="w-4 h-4" />
              PDF
            </button>
          </div>
        </div>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className="bg-primary-50 border-b-2 border-primary-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-primary-900 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-primary-900 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-primary-900 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-primary-900 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-primary-900 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-primary-900 uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {usersReport?.map((user) => (
                <tr key={user.id} className="hover:bg-primary-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.phone || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      user.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDateSafe(user.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {(!usersReport || usersReport.length === 0) && (
          <div className="text-center py-8">
            <p className="text-gray-500">No user data available</p>
          </div>
        )}
      </div>
    </div>
  )
}
