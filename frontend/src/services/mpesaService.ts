import { api } from '@/lib/api'

export interface MpesaPaymentRequest {
  phoneNumber: string
  amount: number
  donorName?: string
  email?: string
  projectId?: string
  accountReference?: string
}

export interface StkPushResponse {
  success: boolean
  merchantRequestId?: string
  checkoutRequestId?: string
  responseCode?: string
  responseDescription?: string
  customerMessage?: string
  errorMessage?: string
}

export interface PaymentStatusResponse {
  found: boolean
  status?: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
  amount?: number
  phoneNumber?: string
  mpesaReceiptNumber?: string
  resultDesc?: string
  projectId?: string
  projectTitle?: string
  message?: string
}

export const mpesaService = {
  /**
   * Initiate STK Push payment
   */
  async initiatePayment(request: MpesaPaymentRequest): Promise<StkPushResponse> {
    const response = await api.post<StkPushResponse>('/mpesa/stkpush', request)
    return response.data
  },

  /**
   * Check payment status by checkout request ID
   */
  async checkPaymentStatus(checkoutRequestId: string): Promise<PaymentStatusResponse> {
    const response = await api.get<PaymentStatusResponse>(`/mpesa/status/${checkoutRequestId}`)
    return response.data
  },

  /**
   * Query M-Pesa for transaction status
   */
  async queryTransaction(checkoutRequestId: string): Promise<string> {
    const response = await api.post<string>('/mpesa/query', { checkoutRequestId })
    return response.data
  },

  /**
   * Format phone number to Kenyan format
   */
  formatPhoneNumber(phone: string): string {
    // Remove all non-digits
    let cleaned = phone.replace(/\D/g, '')

    // Handle different formats
    if (cleaned.startsWith('0')) {
      cleaned = '254' + cleaned.substring(1)
    } else if (cleaned.startsWith('7') || cleaned.startsWith('1')) {
      cleaned = '254' + cleaned
    } else if (cleaned.startsWith('+254')) {
      cleaned = cleaned.substring(1)
    }

    return cleaned
  },

  /**
   * Validate Kenyan phone number
   */
  isValidPhoneNumber(phone: string): boolean {
    const cleaned = phone.replace(/\D/g, '')
    // Match formats: 0712345678, 254712345678, +254712345678, 712345678
    return /^(254|0)?(7|1)\d{8}$/.test(cleaned)
  },
}
