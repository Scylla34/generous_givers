import { NextRequest, NextResponse } from 'next/server'

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/about',
  '/projects',
  '/gallery',
  '/get-involved',
  '/donate',
  '/contact',
  '/auth/login',
]

export function middleware(request: NextRequest): NextResponse | void {
  const pathname = request.nextUrl.pathname

  // Get token from cookies
  const token = request.cookies.get('auth-storage')

  // Check if the user is authenticated by looking for the auth token
  // Note: The auth is stored in localStorage on the client, so we check the cookie fallback
  const isDashboardRoute = pathname.startsWith('/dashboard')
  const isChangePasswordRoute = pathname.startsWith('/auth/change-password')
  const isPublicRoute = publicRoutes.some((route) => {
    if (route === '/') return pathname === '/'
    return pathname.startsWith(route)
  })

  // Allow public routes
  if (isPublicRoute && !isChangePasswordRoute) {
    return NextResponse.next()
  }

  // For protected routes, redirect to login if not authenticated
  if (isDashboardRoute && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // For change password route, check if user needs to change password
  if (isChangePasswordRoute && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
