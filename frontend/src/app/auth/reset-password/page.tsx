'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/services/authService'
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { isEmailDeliveryError, getUserFriendlyErrorMessage } from '@/lib/utils'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await authService.requestPasswordReset(email)
      setSent(true)
      toast.success('Password reset instructions sent successfully!')
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string }; status?: number } }
      let errorMessage = 'Failed to send reset email'
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.status === 404) {
        errorMessage = 'No account found with this email address'
      } else if (error.response?.status === 403) {
        errorMessage = 'Access denied. Please try again later'
      } else if (error.response?.status && error.response.status >= 500) {
        errorMessage = 'Server error. Please try again later'
      }
      
      const friendlyMessage = getUserFriendlyErrorMessage(errorMessage)
      
      if (isEmailDeliveryError(errorMessage)) {
        setError('Failed to send password reset email. Please check your email address and try again.')
        toast.error(
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="font-medium">Email delivery failed</span>
            </div>
            <div className="text-sm">Please verify your email address is correct and try again.</div>
          </div>,
          { duration: 8000 }
        )
      } else {
        setError(friendlyMessage)
        toast.error(friendlyMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-xl text-green-600">Email Sent Successfully!</CardTitle>
            <CardDescription className="text-gray-600">
              We&apos;ve sent password reset instructions to <strong>{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Next Steps:</strong>
              </p>
              <ul className="text-sm text-blue-700 mt-2 space-y-1">
                <li>• Check your email inbox</li>
                <li>• Click the reset link in the email</li>
                <li>• Follow the instructions to set a new password</li>
              </ul>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => router.push('/auth/login')}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white"
              >
                Back to Login
              </Button>
              <Button
                onClick={() => {
                  setSent(false)
                  setEmail('')
                }}
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <Image
              src="/logo/logo.jpg"
              alt="Generous Givers Family"
              width={80}
              height={80}
              className="rounded-full shadow-lg"
            />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Reset Password
          </h1>
          <p className="text-gray-600">
            Enter your email to receive reset instructions
          </p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl text-center">Password Reset</CardTitle>
            <CardDescription className="text-center">
              We&apos;ll send you a secure link to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-white text-gray-900"
                    placeholder="your.email@example.com"
                    disabled={loading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white"
              >
                {loading ? 'Sending...' : 'Send Reset Instructions'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/auth/login"
                className="text-sm text-primary-600 hover:text-primary-700 inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}