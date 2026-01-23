'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/store/authStore'
import { handleApiError } from '@/lib/api'
import { Lock, Mail, Heart, Users, HandHeart, Eye, EyeOff } from 'lucide-react'
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

export default function LoginPage() {
  const router = useRouter()
  const { setAuth } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [redirecting, setRedirecting] = useState(false)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const floatingIcons: FloatingIcon[] = [
    { id: 1, Icon: Heart, initialX: 10, initialY: 20, delay: 0, duration: 6 },
    { id: 2, Icon: Users, initialX: 85, initialY: 15, delay: 1, duration: 7 },
    { id: 3, Icon: HandHeart, initialX: 15, initialY: 70, delay: 2, duration: 5 },
    { id: 4, Icon: Heart, initialX: 80, initialY: 75, delay: 0.5, duration: 8 },
    { id: 5, Icon: Users, initialX: 50, initialY: 10, delay: 1.5, duration: 6 },
    { id: 6, Icon: HandHeart, initialX: 90, initialY: 45, delay: 2.5, duration: 7 },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await authService.login({ email, password })
      setAuth(response.user, response.accessToken)

      toast.success('Welcome back! Login successful.')
      setRedirecting(true)

      if (response.user.mustChangePassword) {
        router.push('/auth/change-password')
      } else {
        router.push('/dashboard')
      }
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      toast.error(errorMessage)
      setRedirecting(false)
    } finally {
      setLoading(false)
    }
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600 text-sm">
              Sign in to continue serving humanity
            </p>
            <p className="text-primary-600 text-xs mt-1 italic">
              &ldquo;Service to Humanity is Service to God&rdquo;
            </p>
          </div>

          {/* Login Card */}
          <Card className={cn(
            "border-0 shadow-xl bg-white/80 backdrop-blur-sm transition-all duration-700 delay-200",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-xl text-center">Member Login</CardTitle>
              <CardDescription className="text-center">
                Dashboard access for registered members only
              </CardDescription>
            </CardHeader>

            {/* Admin-Only Notice */}
            <div className="px-6 pt-2 pb-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <span className="font-semibold">Member Portal Notice:</span> This portal is
                  for registered members only. Accounts are created and managed by administrators.
                </p>
              </div>
            </div>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-shake">
                    {error}
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className={cn(
                      "transition-colors duration-200",
                      focusedField === 'email' && "text-primary-600"
                    )}
                  >
                    Email Address
                  </Label>
                  <div className="relative group">
                    <div className={cn(
                      "absolute -inset-0.5 bg-gradient-to-r from-primary-400 to-primary-600 rounded-lg opacity-0 blur transition-opacity duration-300",
                      focusedField === 'email' && "opacity-30"
                    )} />
                    <div className="relative">
                      <Mail className={cn(
                        "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 z-10 transition-colors duration-200",
                        focusedField === 'email' ? "text-primary-500" : "text-gray-400"
                      )} />
                      <Input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        className="pl-10 bg-white/90 border-gray-200 focus:border-primary-400 transition-all duration-200"
                        placeholder="you@example.com"
                        disabled={loading || redirecting}
                      />
                    </div>
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className={cn(
                      "transition-colors duration-200",
                      focusedField === 'password' && "text-primary-600"
                    )}
                  >
                    Password
                  </Label>
                  <div className="relative group">
                    <div className={cn(
                      "absolute -inset-0.5 bg-gradient-to-r from-primary-400 to-primary-600 rounded-lg opacity-0 blur transition-opacity duration-300",
                      focusedField === 'password' && "opacity-30"
                    )} />
                    <div className="relative">
                      <Lock className={cn(
                        "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 z-10 transition-colors duration-200",
                        focusedField === 'password' ? "text-primary-500" : "text-gray-400"
                      )} />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        className="pl-10 pr-10 bg-white/90 border-gray-200 focus:border-primary-400 transition-all duration-200"
                        placeholder="Enter your password"
                        disabled={loading || redirecting}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading || redirecting}
                  className="w-full h-11 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary-500/25"
                  size="lg"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Spinner className="w-4 h-4" />
                      Signing in...
                    </span>
                  ) : redirecting ? (
                    <span className="flex items-center gap-2">
                      <Spinner className="w-4 h-4" />
                      Redirecting...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Sign In
                      <HandHeart className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  href="/contact"
                  className="text-sm text-gray-500 hover:text-primary-600 transition-colors duration-200 inline-flex items-center gap-1"
                >
                  <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
                  Back to Home
                </Link>
                <span className="mx-2 text-gray-300">|</span>
                <Link
                  href="/auth/reset-password"
                  className="text-sm text-primary-600 hover:text-primary-700 transition-colors duration-200"
                >
                  Forgot Password?
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className={cn(
            "mt-6 text-center transition-all duration-700 delay-300",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            <p className="text-sm text-gray-600">
              Need access?{' '}
              <Link
                href="/contact"
                className="text-primary-600 hover:text-primary-700 font-medium hover:underline transition-all duration-200"
              >
                Contact Administrator
              </Link>
            </p>
          </div>

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
