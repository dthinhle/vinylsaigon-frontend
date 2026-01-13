'use client'

import LoadingSpinner from '@/app/components/blog/loading-spinner'
import { useAuthStore } from '@/app/store/auth-store'
import { FRONTEND_PATH } from '@/lib/constants'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface PublicRouteProps {
  children: React.ReactNode
  redirectTo?: string
  fallback?: React.ReactNode
}

/**
 * PublicRoute - For pages that should only be accessible to non-authenticated users
 * Examples: sign-in, sign-up, forgot-password pages
 * Exception: complete-account page is allowed for authenticated users
 */
export function PublicRoute({
  children,
  redirectTo = FRONTEND_PATH.viewProfile,
  fallback,
}: PublicRouteProps) {
  const user = useAuthStore((state) => state.user)
  const loading = useAuthStore((state) => state.loading)
  const router = useRouter()
  const pathname = usePathname()

  // Allow complete-account page for authenticated users
  const isCompleteAccountPage = pathname === FRONTEND_PATH.completeAccount

  useEffect(() => {
    if (!loading && user && !isCompleteAccountPage) {
      router.replace(redirectTo)
    }
  }, [user, loading, router, redirectTo, isCompleteAccountPage])

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      fallback || (
        <div className='flex items-center justify-center min-h-screen'>
          <LoadingSpinner />
        </div>
      )
    )
  }

  // If user is authenticated and not on complete-account page, don't render children (redirect is handled by useEffect)
  if (user && !isCompleteAccountPage) {
    return null
  }

  // User is not authenticated, or is on complete-account page, render the public content
  return <>{children}</>
}
