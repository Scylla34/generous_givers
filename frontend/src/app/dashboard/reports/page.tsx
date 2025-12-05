'use client'

import { useQuery } from '@tanstack/react-query'
import { reportService } from '@/services/reportService'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Download, FileSpreadsheet, FileText } from 'lucide-react'
import { formatCurrency } from '@/lib/format'
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

      // Add title
      doc.setFontSize(18)
      doc.text('Projects Progress Report', 14, 20)

      // Add date
      doc.setFontSize(11)
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28)

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
        startY: 35,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [37, 99, 235] }, // primary-600
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

      doc.setFontSize(18)
      doc.text(`Monthly Donations Report ${currentYear}`, 14, 20)

      doc.setFontSize(11)
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28)

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
        startY: 35,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [37, 99, 235] },
        footStyles: { fillColor: [243, 244, 246], textColor: [0, 0, 0], fontStyle: 'bold' },
      })

      doc.save(`donations-report-${currentYear}.pdf`)
      toast.success('PDF file downloaded successfully!')
    } catch (error) {
      console.error('PDF export error:', error)
      toast.error('Failed to export to PDF')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
        <p className="text-gray-600">Export and analyze foundation data</p>
      </div>

      {/* Projects Report */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Project Progress Report</h2>
          <div className="flex gap-2">
            <button
              onClick={exportProjectsToExcel}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Export Excel
            </button>
            <button
              onClick={exportProjectsToPDF}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
            >
              <FileText className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Raised</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Donations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {projectProgress?.map((project) => (
                <tr key={project.projectId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{project.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      project.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      project.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(project.targetAmount)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(project.fundsRaised)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 w-24">
                        <div className="bg-primary-600 h-2 rounded-full" style={{ width: `${Math.min(project.percentFunded, 100)}%` }} />
                      </div>
                      <span className="text-sm text-gray-600">{project.percentFunded.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.donationCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Donations Chart & Export */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Monthly Donations ({currentYear})</h2>
            <div className="flex gap-2">
              <button
                onClick={exportDonationsToExcel}
                className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                title="Export to Excel"
              >
                <FileSpreadsheet className="w-4 h-4" />
              </button>
              <button
                onClick={exportDonationsToPDF}
                className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                title="Export to PDF"
              >
                <FileText className="w-4 h-4" />
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Bar dataKey="amount" fill="#2563eb" name="Donations (KSh)" />
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
                  <span className="text-sm font-bold text-gray-900">Total: {role.totalCount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
