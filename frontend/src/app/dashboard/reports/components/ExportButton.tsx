'use client'

import { useState } from 'react'
import { FileSpreadsheet, FileText, Download } from 'lucide-react'
import { reportService } from '@/services/reportService'
import { toast } from 'sonner'

interface ExportButtonProps {
  onExcelExport: () => void
  onPdfExport: () => void
  title: string
  disabled?: boolean
  recordCount?: number
}

export function ExportButton({ onExcelExport, onPdfExport, title, disabled = false, recordCount = 0 }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const notifyExport = async (exportType: string) => {
    try {
      const message = await reportService.notifyDataExport(exportType, recordCount)
      console.log('Export notification sent:', message)
    } catch (error) {
      console.warn('Failed to send export notification:', error)
    }
  }

  const handleExcelExport = async () => {
    setIsExporting(true)
    try {
      onExcelExport()
      await notifyExport(`${title} - Excel`)
    } catch (error) {
      console.error('Excel export failed:', error)
      toast.error(`Failed to export ${title} to Excel`)
    } finally {
      setIsExporting(false)
    }
  }

  const handlePdfExport = async () => {
    setIsExporting(true)
    try {
      onPdfExport()
      await notifyExport(`${title} - PDF`)
    } catch (error) {
      console.error('PDF export failed:', error)
      toast.error(`Failed to export ${title} to PDF`)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={handleExcelExport}
        disabled={disabled || isExporting}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium shadow-md hover:shadow-lg disabled:opacity-50"
        title={`Export ${title} to Excel`}
      >
        {isExporting ? (
          <Download className="w-4 h-4 animate-bounce" />
        ) : (
          <FileSpreadsheet className="w-4 h-4" />
        )}
        Excel
      </button>
      <button
        onClick={handlePdfExport}
        disabled={disabled || isExporting}
        className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm font-medium shadow-md hover:shadow-lg disabled:opacity-50"
        title={`Export ${title} to PDF`}
      >
        {isExporting ? (
          <Download className="w-4 h-4 animate-bounce" />
        ) : (
          <FileText className="w-4 h-4" />
        )}
        PDF
      </button>
    </div>
  )
}