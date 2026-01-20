/**
 * Format currency in KSh
 */
export function formatCurrency(amount: number): string {
  return `KSh ${amount.toLocaleString('en-KE')}`
}

/**
 * Format date safely to avoid hydration errors
 * Returns empty string during SSR, formatted date on client
 */
export function formatDateSafe(date: Date | string | undefined | null): string {
  if (!date) {
    return ''
  }

  if (typeof window === 'undefined') {
    return '' // Return empty during SSR to avoid hydration mismatch
  }

  // Client-side formatting
  const dateObj = typeof date === 'string' ? new Date(date) : date

  // Validate that dateObj is a valid Date
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    return ''
  }

  // Simple date formatting to avoid dependency issues
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }

  return dateObj.toLocaleDateString('en-US', options)
}

/**
 * Convert date to YYYY-MM-DD format for input fields
 */
export function toDateInputValue(date: Date | string | undefined): string {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const day = String(dateObj.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
