'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/store/authStore'
import { handleApiError } from '@/lib/api'
import { Lock, Shield, Heart, Users, HandHeart, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface FloatingIcon {
  id: number
  Icon: React.ComponentType<{ className?: string }>
  initialX: number
  initialY: number
  delay: number
  duration: number
}

function FloatingElement({ icon: Icon, className, style }: {
  icon: React.ComponentType<{ className?: string }>
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <div className={cn("absolute opacity-20 animate-float", className)} style={style}>
      <Icon className="w-8 h-8 text-primary-400" />
    </div>
  )
}

export default function ChangePasswordPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
    } else if (!user.mustChangePassword) {
      router.push('/dashboard')
    }
  }, [user, router])

  const floatingIcons: FloatingIcon[] = [
    { id: 1, Icon: Heart, initialX: 10, initialY: 20, delay: 0, duration: 6 },
    { id: 2, Icon: Users, initialX: 85, initialY: 15, delay: 1, duration: 7 },
    { id: 3, Icon: HandHeart, initialX: 15, initialY: 70, delay: 2, duration: 5 },
    { id: 4, Icon: Heart, initialX: 80, initialY: 75, delay: 0.5, duration: 8 },
    { id: 5, Icon: Shield, initialX: 50, initialY: 10, delay: 1.5, duration: 6 },
    { id: 6, Icon: HandHeart, initialX: 90, initialY: 45, delay: 2.5, duration: 7 },
  ]

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

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long')
      toast.error('New password must be at least 8 characters long')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      toast.error('New passwords do not match')
      return
    }

    setLoading(true)

    try {
      await authService.changePassword({
        currentPassword,
        newPassword,
      })

      toast.success('Password changed successfully! Redirecting to dashboard...')
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (!user || !user.mustChangePassword) {
    return null
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-primary-100 animate-gradient-shift" />

      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.1),transparent_50%)] animate-pulse-slow" />
      </div>

      {/* Floating Icons */}
      {mounted && floatingIcons.map((item) => (
        <FloatingElement
          key={item.id}
          icon={item.Icon}
          style={{
            left: `${item.initialX}%`,
            top: `${item.initialY}%`,
            animationDelay: `${item.delay}s`,
            animationDuration: `${item.duration}s`,
          }}
        />
      ))}

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className={cn(
          "max-w-md w-full transition-all duration-700 ease-out",
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          {/* Logo and Title */}
          <div className={cn(
            "text-center mb-8 transition-all duration-700 delay-100",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          )}>
            <Link href="/" className="inline-block mb-6 group">
              <div className="relative">
                <div className="absolute -inset-4 bg-primary-200/50 rounded-full blur-xl group-hover:bg-primary-300/50 transition-colors duration-300 animate-pulse-slow" />
                <Image
                  src="/logo/logo.jpg"
                  alt="Generous Givers Family"
                  width={80}
                  height={80}
                  className="relative rounded-full shadow-lg group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="w-6 h-6 text-primary-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                Change Password
              </h1>
            </div>
            <p className="text-gray-600 text-sm">
              For security, please set a new password
            </p>
          </div>

          {/* Change Password Card */}
          <Card className={cn(
            "border-0 shadow-xl bg-white/80 backdrop-blur-sm transition-all duration-700 delay-200",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-xl text-center">Set New Password</CardTitle>
              <CardDescription className="text-center">
                Your temporary password needs to be changed before proceeding
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* First-Login Security Notice */}
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-semibold mb-1">First-Time Login Security</p>
                    <p>
                      As a new member, you received a temporary password for security reasons. 
                      Please create a strong, unique password that only you know.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-shake">
                    {error}
                  </div>
                )}

                {/* Current Password Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="current"
                    className={cn(
                      "transition-colors duration-200",
                      focusedField === 'current' && "text-primary-600"
                    )}
                  >
                    Current Password
                  </Label>
                  <div className="relative group">
                    <div className={cn(
                      "absolute -inset-0.5 bg-gradient-to-r from-primary-400 to-primary-600 rounded-lg opacity-0 blur transition-opacity duration-300",
                      focusedField === 'current' && "opacity-30"
                    )} />
                    <div className="relative">
                      <Lock className={cn(
                        "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 z-10 transition-colors duration-200",
                        focusedField === 'current' ? "text-primary-500" : "text-gray-400"
                      )} />
                      <Input
                        id="current"
                        type="password"
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        onFocus={() => setFocusedField('current')}
                        onBlur={() => setFocusedField(null)}
                        className="pl-10 bg-white/90 border-gray-200 focus:border-primary-400 transition-all duration-200 text-gray-900"
                        placeholder="Enter temporary password"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                {/* New Password Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="new"
                    className={cn(
                      "transition-colors duration-200",
                      focusedField === 'new' && "text-primary-600"
                    )}
                  >
                    New Password
                  </Label>
                  <div className="relative group">
                    <div className={cn(
                      "absolute -inset-0.5 bg-gradient-to-r from-primary-400 to-primary-600 rounded-lg opacity-0 blur transition-opacity duration-300",
                      focusedField === 'new' && "opacity-30"
                    )} />
                    <div className="relative">
                      <Lock className={cn(
                        "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 z-10 transition-colors duration-200",
                        focusedField === 'new' ? "text-primary-500" : "text-gray-400"
                      )} />
                      <Input
                        id="new"
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value)
                          setPasswordStrength(checkPasswordStrength(e.target.value))
                        }}
                        onFocus={() => setFocusedField('new')}
                        onBlur={() => setFocusedField(null)}
                        className="pl-10 bg-white/90 border-gray-200 focus:border-primary-400 transition-all duration-200 text-gray-900"
                        placeholder="At least 8 characters"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                {/* Password Strength Indicator */}
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

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="confirm"
                    className={cn(
                      "transition-colors duration-200",
                      focusedField === 'confirm' && "text-primary-600"
                    )}
                  >
                    Confirm New Password
                  </Label>
                  <div className="relative group">
                    <div className={cn(
                      "absolute -inset-0.5 bg-gradient-to-r from-primary-400 to-primary-600 rounded-lg opacity-0 blur transition-opacity duration-300",
                      focusedField === 'confirm' && "opacity-30"
                    )} />
                    <div className="relative">
                      <Lock className={cn(
                        "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 z-10 transition-colors duration-200",
                        focusedField === 'confirm' ? "text-primary-500" : "text-gray-400"
                      )} />
                      <Input
                        id="confirm"
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onFocus={() => setFocusedField('confirm')}
                        onBlur={() => setFocusedField(null)}
                        className="pl-10 bg-white/90 border-gray-200 focus:border-primary-400 transition-all duration-200 text-gray-900"
                        placeholder="Re-enter new password"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="bg-blue-50/80 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800 font-medium mb-2">Password Requirements:</p>
                  <ul className="space-y-1">
                    <li className="flex items-center gap-2 text-sm text-blue-700">
                      <CheckCircle className={cn(
                        "w-4 h-4",
                        newPassword.length >= 8 ? "text-green-500" : "text-blue-300"
                      )} />
                      At least 8 characters long
                    </li>
                    <li className="flex items-center gap-2 text-sm text-blue-700">
                      <CheckCircle className={cn(
                        "w-4 h-4",
                        newPassword === confirmPassword && newPassword.length > 0 ? "text-green-500" : "text-blue-300"
                      )} />
                      Passwords match
                    </li>
                  </ul>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary-500/25"
                  size="lg"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Spinner className="w-4 h-4" />
                      Changing Password...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Change Password
                      <Shield className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Mission Statement */}
          <div className={cn(
            "mt-8 text-center transition-all duration-700 delay-500",
            mounted ? "opacity-100" : "opacity-0"
          )}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full shadow-sm">
              <Heart className="w-4 h-4 text-primary-500 animate-pulse" />
              <span className="text-xs text-gray-600">
                Generous Givers Family - Let&apos;s Help
              </span>
              <Heart className="w-4 h-4 text-primary-500 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-20px) rotate(5deg);
          }
          50% {
            transform: translateY(-10px) rotate(-5deg);
          }
          75% {
            transform: translateY(-25px) rotate(3deg);
          }
        }

        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          10%, 30%, 50%, 70%, 90% {
            transform: translateX(-4px);
          }
          20%, 40%, 60%, 80% {
            transform: translateX(4px);
          }
        }

        .animate-float {
          animation: float ease-in-out infinite;
        }

        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 15s ease infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}
