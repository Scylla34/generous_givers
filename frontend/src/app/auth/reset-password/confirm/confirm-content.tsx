'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { authService } from '@/services/authService'
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function ResetPasswordConfirmContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) {
      router.push('/auth/reset-password')
    }
  }, [token, router])

  const checkPasswordStrength = (password: string) => {
    let score = 0
    let feedback = ''
    
    if (password.length >= 8) score += 1
    if (/[a-z]/.test(password)) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1
    
    if (score < 3) {
      feedback = 'Weak - Add uppercase, lowercase, numbers, and symbols'
    } else if (score < 4) {
      feedback = 'Fair - Consider adding more character types'
    } else if (score < 5) {
      feedback = 'Good - Strong password'
    } else {
      feedback = 'Excellent - Very strong password'
    }
    
    return { score, feedback }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const strength = checkPasswordStrength(newPassword)
    
    if (strength.score < 3) {
      setError('Password is too weak. Please create a stronger password.')
      toast.error('Password is too weak. Please create a stronger password.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      await authService.resetPassword({ token: token!, newPassword })
      toast.success('Password reset successfully! You can now login with your new password.')
      router.push('/auth/login')
    } catch (err: unknown) {
      let errorMessage = 'Failed to reset password'
      const error = err as { response?: { data?: { message?: string }; status?: number } }
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid or expired reset token. Please request a new password reset.'
      } else if (error.response?.status === 404) {
        errorMessage = 'Reset token not found. Please request a new password reset.'
      } else if (error.response?.status && error.response.status >= 500) {
        errorMessage = 'Server error. Please try again later.'
      }
      
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return null
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
            Set New Password
          </h1>
          <p className="text-gray-600">
            Enter your new password below
          </p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl text-center">Reset Your Password</CardTitle>
            <CardDescription className="text-center">
              Choose a strong password for your account
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
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value)
                      setPasswordStrength(checkPasswordStrength(e.target.value))
                    }}
                    className="pl-10 pr-10 bg-white text-gray-900"
                    placeholder="Enter new password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {newPassword && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Password Strength</span>
                    <span className={cn(
                      "text-xs font-medium",
                      passwordStrength.score < 3 ? "text-red-600" :
                      passwordStrength.score < 4 ? "text-yellow-600" :
                      passwordStrength.score < 5 ? "text-blue-600" : "text-green-600"
                    )}>
                      {passwordStrength.feedback}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={cn(
                        "h-2 rounded-full transition-all duration-300",
                        passwordStrength.score < 3 ? "bg-red-500" :
                        passwordStrength.score < 4 ? "bg-yellow-500" :
                        passwordStrength.score < 5 ? "bg-blue-500" : "bg-green-500"
                      )}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 bg-white text-gray-900"
                    placeholder="Confirm new password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Password Requirements</span>
                </div>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li className={cn("flex items-center gap-2", newPassword.length >= 8 ? "text-green-600" : "")}>
                    <CheckCircle className={cn("w-3 h-3", newPassword.length >= 8 ? "text-green-500" : "text-blue-300")} />
                    At least 8 characters
                  </li>
                  <li className={cn("flex items-center gap-2", newPassword === confirmPassword && newPassword.length > 0 ? "text-green-600" : "")}>
                    <CheckCircle className={cn("w-3 h-3", newPassword === confirmPassword && newPassword.length > 0 ? "text-green-500" : "text-blue-300")} />
                    Passwords match
                  </li>
                </ul>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white"
              >
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
