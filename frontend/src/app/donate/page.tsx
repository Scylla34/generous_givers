'use client'

import { useState, Suspense, useEffect, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { projectService } from '@/services/projectService'
import { mpesaService, PaymentStatusResponse } from '@/services/mpesaService'
import { useSearchParams } from 'next/navigation'
import {
  Phone,
  CheckCircle,
  XCircle,
  Loader2,
  Heart,
  Smartphone,
  Copy,
  Check,
  ArrowRight,
  CreditCard
} from 'lucide-react'
import Image from 'next/image'

type PaymentMethod = 'stk' | 'manual'
type PaymentStep = 'method' | 'form' | 'processing' | 'success' | 'failed' | 'manual-instructions'

interface FormData {
  donorName: string
  email: string
  phoneNumber: string
  amount: number
  projectId?: string
}

// M-Pesa payment details - update these with actual values
const MPESA_DETAILS = {
  sendMoney: {
    name: 'Generous Givers Family',
    phoneNumber: '0712 345 678', // Update with actual number
  },
  tillNumber: {
    name: 'Generous Givers Family',
    number: '123456', // Update with actual till number
  },
  paybill: {
    name: 'Generous Givers Family',
    number: '123456', // Update with actual paybill
    accountNumber: 'DONATION',
  },
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text.replace(/\s/g, ''))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-600" />
      ) : (
        <Copy className="w-4 h-4 text-gray-500" />
      )}
    </button>
  )
}

function DonateForm() {
  const searchParams = useSearchParams()
  const projectId = searchParams.get('project')

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
  const [step, setStep] = useState<PaymentStep>('method')
  const [formData, setFormData] = useState<FormData>({
    donorName: '',
    email: '',
    phoneNumber: '',
    amount: 0,
    projectId: projectId || undefined,
  })
  const [checkoutRequestId, setCheckoutRequestId] = useState<string | null>(null)
  const [paymentResult, setPaymentResult] = useState<PaymentStatusResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: projects } = useQuery({
    queryKey: ['active-projects'],
    queryFn: projectService.getActive,
  })

  // Poll for payment status
  const pollPaymentStatus = useCallback(async (reqId: string, attempts = 0) => {
    if (attempts >= 30) {
      setError('Payment verification timed out. Please check your M-Pesa messages.')
      setStep('failed')
      return
    }

    try {
      const status = await mpesaService.checkPaymentStatus(reqId)

      if (status.status === 'COMPLETED') {
        setPaymentResult(status)
        setStep('success')
      } else if (status.status === 'FAILED') {
        setPaymentResult(status)
        setError(status.resultDesc || 'Payment failed')
        setStep('failed')
      } else {
        setTimeout(() => pollPaymentStatus(reqId, attempts + 1), 3000)
      }
    } catch {
      setTimeout(() => pollPaymentStatus(reqId, attempts + 1), 3000)
    }
  }, [])

  useEffect(() => {
    if (checkoutRequestId && step === 'processing') {
      const timer = setTimeout(() => {
        pollPaymentStatus(checkoutRequestId)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [checkoutRequestId, step, pollPaymentStatus])

  const handleMethodSelect = (method: PaymentMethod) => {
    setPaymentMethod(method)
    setStep('form')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (formData.amount < 1) {
      setError('Minimum donation amount is KSh 1')
      return
    }

    if (paymentMethod === 'manual') {
      setStep('manual-instructions')
      return
    }

    // STK Push flow
    if (!mpesaService.isValidPhoneNumber(formData.phoneNumber)) {
      setError('Please enter a valid Kenyan phone number')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await mpesaService.initiatePayment({
        phoneNumber: formData.phoneNumber,
        amount: formData.amount,
        donorName: formData.donorName,
        email: formData.email,
        projectId: formData.projectId,
      })

      if (response.success && response.checkoutRequestId) {
        setCheckoutRequestId(response.checkoutRequestId)
        setStep('processing')
      } else {
        setError(response.errorMessage || response.responseDescription || 'Failed to initiate payment')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setStep('method')
    setPaymentMethod(null)
    setCheckoutRequestId(null)
    setPaymentResult(null)
    setError(null)
    setFormData({
      donorName: '',
      email: '',
      phoneNumber: '',
      amount: 0,
      projectId: undefined,
    })
  }

  const quickAmounts = [500, 1000, 2500, 5000, 10000]

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <Heart className="w-16 h-16 mx-auto mb-4 animate-pulse" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Make a Donation</h1>
          <p className="text-xl text-primary-100">Your generosity transforms lives</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-xl mx-auto">

          {/* Method Selection Step */}
          {step === 'method' && (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-primary-100">
              <div className="flex items-center justify-center gap-3 mb-8">
                <Image
                  src="/logo/logo.jpg"
                  alt="Logo"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <h2 className="text-2xl font-bold text-gray-900">Choose Payment Method</h2>
              </div>

              <div className="space-y-4">
                {/* STK Push Option */}
                <button
                  onClick={() => handleMethodSelect('stk')}
                  className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <Smartphone className="w-7 h-7 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">STK Push (Recommended)</h3>
                      <p className="text-sm text-gray-500">Receive a prompt on your phone to enter PIN</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                  </div>
                </button>

                {/* Manual Payment Option */}
                <button
                  onClick={() => handleMethodSelect('manual')}
                  className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                      <CreditCard className="w-7 h-7 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">Send Money (Manual)</h3>
                      <p className="text-sm text-gray-500">Get payment details to send manually via M-Pesa</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                  </div>
                </button>
              </div>

              <p className="text-center text-sm text-gray-500 mt-6">
                All payments are processed securely via M-Pesa
              </p>
            </div>
          )}

          {/* Form Step */}
          {step === 'form' && (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-primary-100">
              <button
                onClick={() => setStep('method')}
                className="text-gray-500 hover:text-gray-700 text-sm mb-4 flex items-center gap-1"
              >
                ← Back to payment methods
              </button>

              <div className="flex items-center justify-center gap-3 mb-8">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  paymentMethod === 'stk' ? 'bg-green-100' : 'bg-primary-100'
                }`}>
                  {paymentMethod === 'stk' ? (
                    <Smartphone className="w-6 h-6 text-green-600" />
                  ) : (
                    <CreditCard className="w-6 h-6 text-primary-600" />
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {paymentMethod === 'stk' ? 'STK Push Payment' : 'Manual Payment'}
                </h2>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                  <XCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={formData.donorName}
                    onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-gray-50 focus:bg-white text-gray-900"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-gray-50 focus:bg-white text-gray-900"
                    placeholder="john@example.com"
                  />
                </div>

                {/* Phone Number - Only for STK Push */}
                {paymentMethod === 'stk' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      M-Pesa Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        required
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-gray-50 focus:bg-white text-gray-900"
                        placeholder="0712 345 678"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Enter the number registered for M-Pesa</p>
                  </div>
                )}

                {/* Amount */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Donation Amount (KSh) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">KSh</span>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.amount || ''}
                      onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) || 0 })}
                      className="w-full pl-14 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-gray-50 focus:bg-white text-gray-900 text-lg font-semibold"
                      placeholder="1000"
                    />
                  </div>

                  {/* Quick Amount Buttons */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {quickAmounts.map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => setFormData({ ...formData, amount })}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          formData.amount === amount
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-primary-50 hover:text-primary-700'
                        }`}
                      >
                        {amount.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Project Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Donate To
                  </label>
                  <select
                    value={formData.projectId || ''}
                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value || undefined })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-gray-50 focus:bg-white text-gray-900"
                  >
                    <option value="">General Fund</option>
                    {projects?.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full px-6 py-4 rounded-xl transition-all text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-3 ${
                    paymentMethod === 'stk'
                      ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800'
                      : 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Initiating Payment...
                    </>
                  ) : paymentMethod === 'stk' ? (
                    <>
                      <Smartphone className="w-6 h-6" />
                      Send STK Push
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-6 h-6" />
                      Get Payment Details
                    </>
                  )}
                </button>
              </form>

              {paymentMethod === 'stk' && (
                <p className="text-center text-sm text-gray-500 mt-6">
                  You will receive an STK push on your phone to complete the payment
                </p>
              )}
            </div>
          )}

          {/* Manual Instructions Step */}
          {step === 'manual-instructions' && (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-primary-100">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Send Money via M-Pesa</h2>
                <p className="text-gray-500">
                  Send <strong className="text-green-600">KSh {formData.amount.toLocaleString()}</strong> using the details below
                </p>
              </div>

              {/* Send Money Details */}
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-6">
                <h3 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Send Money (Recommended)
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-white rounded-lg p-3">
                    <div>
                      <p className="text-xs text-gray-500">Phone Number</p>
                      <p className="text-lg font-bold text-gray-900 font-mono">{MPESA_DETAILS.sendMoney.phoneNumber}</p>
                    </div>
                    <CopyButton text={MPESA_DETAILS.sendMoney.phoneNumber} />
                  </div>

                  <div className="flex items-center justify-between bg-white rounded-lg p-3">
                    <div>
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="text-sm font-medium text-gray-900">{MPESA_DETAILS.sendMoney.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-white rounded-lg p-3">
                    <div>
                      <p className="text-xs text-gray-500">Amount</p>
                      <p className="text-lg font-bold text-green-600">KSh {formData.amount.toLocaleString()}</p>
                    </div>
                    <CopyButton text={formData.amount.toString()} />
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">How to Send:</h4>
                <ol className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                    <span>Go to M-Pesa on your phone</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                    <span>Select <strong>Send Money</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                    <span>Enter the phone number above</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
                    <span>Enter amount: <strong>KSh {formData.amount.toLocaleString()}</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">5</span>
                    <span>Enter your M-Pesa PIN and confirm</span>
                  </li>
                </ol>
              </div>

              {/* Donor Info Summary */}
              {(formData.donorName || formData.email) && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> After sending, you can share your confirmation message with us via email at{' '}
                    <a href="mailto:donations@generousgivers.org" className="underline">donations@generousgivers.org</a>
                    {formData.donorName && <> mentioning your name: <strong>{formData.donorName}</strong></>}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('form')}
                  className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
                >
                  Back
                </button>
                <button
                  onClick={resetForm}
                  className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-semibold"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {/* Processing Step */}
          {step === 'processing' && (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Smartphone className="w-12 h-12 text-green-600 animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Check Your Phone</h2>
              <p className="text-gray-600 mb-6">
                An M-Pesa prompt has been sent to <strong>{formData.phoneNumber}</strong>
              </p>
              <p className="text-gray-500 mb-8">
                Enter your M-Pesa PIN to complete the donation of <strong>KSh {formData.amount.toLocaleString()}</strong>
              </p>

              <div className="flex items-center justify-center gap-2 text-primary-600">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Waiting for payment confirmation...</span>
              </div>

              <button
                onClick={resetForm}
                className="mt-8 text-gray-500 hover:text-gray-700 text-sm underline"
              >
                Cancel and start over
              </button>
            </div>
          )}

          {/* Success Step */}
          {step === 'success' && (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-16 h-16 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h2>
              <p className="text-gray-600 mb-6">
                Your donation of <strong>KSh {paymentResult?.amount?.toLocaleString()}</strong> has been received.
              </p>

              {paymentResult?.mpesaReceiptNumber && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-500">M-Pesa Receipt Number</p>
                  <p className="text-lg font-mono font-bold text-gray-900">{paymentResult.mpesaReceiptNumber}</p>
                </div>
              )}

              {paymentResult?.projectTitle && (
                <p className="text-gray-600 mb-6">
                  Your donation will support: <strong>{paymentResult.projectTitle}</strong>
                </p>
              )}

              <p className="text-gray-500 text-sm mb-8">
                A confirmation has been sent to your phone. God bless you!
              </p>

              <button
                onClick={resetForm}
                className="bg-primary-600 text-white px-8 py-3 rounded-xl hover:bg-primary-700 transition-all font-semibold"
              >
                Make Another Donation
              </button>
            </div>
          )}

          {/* Failed Step */}
          {step === 'failed' && (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-16 h-16 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Failed</h2>
              <p className="text-gray-600 mb-6">
                {error || paymentResult?.resultDesc || 'The payment could not be completed.'}
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => setStep('form')}
                  className="w-full bg-primary-600 text-white px-8 py-3 rounded-xl hover:bg-primary-700 transition-all font-semibold"
                >
                  Try Again
                </button>
                <button
                  onClick={() => {
                    setPaymentMethod('manual')
                    setStep('form')
                  }}
                  className="w-full border-2 border-gray-200 text-gray-700 px-8 py-3 rounded-xl hover:bg-gray-50 transition-all font-semibold"
                >
                  Try Manual Payment Instead
                </button>
                <button
                  onClick={resetForm}
                  className="w-full text-gray-500 hover:text-gray-700 text-sm underline"
                >
                  Start Over
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function DonatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    }>
      <DonateForm />
    </Suspense>
  )
}
