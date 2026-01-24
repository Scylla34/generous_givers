import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'MMM dd, yyyy')
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), 'MMM dd, yyyy HH:mm')
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function isEmailDeliveryError(errorMessage: string): boolean {
  return errorMessage.includes('Unable to send credentials email') || 
         errorMessage.includes('Email delivery failed') ||
         errorMessage.includes('send credentials email') ||
         errorMessage.includes('Failed to send contact email') ||
         errorMessage.includes('Failed to send password reset email') ||
         errorMessage.includes('Failed to send newsletter welcome email') ||
         errorMessage.includes('check your email address')
}

export function getUserFriendlyErrorMessage(errorMessage: string): string {
  if (errorMessage.includes('Unable to send credentials email')) {
    return 'User creation failed: Unable to send login credentials to the provided email address. Please verify the email is correct and try again.'
  }
  if (errorMessage.includes('Failed to send contact email')) {
    return 'Failed to send your message. Please check your email address and try again.'
  }
  if (errorMessage.includes('Failed to send password reset email')) {
    return 'Failed to send password reset email. Please check your email address and try again.'
  }
  if (errorMessage.includes('Failed to send newsletter welcome email')) {
    return 'Failed to subscribe to newsletter. Please check your email address and try again.'
  }
  return errorMessage
}
